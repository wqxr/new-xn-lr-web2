/*
 * Copyright(c) 2017-2019, 深圳市链融科技股份有限公司
 * Beijing Xiwei Technology Co., Ltd.
 * All rights reserved.
 *
 * @file：new.component.ts
 * @summary：新创建流程
 * @version: 1.0
 * **********************************************************************
 * revision             author            reason             date
 * 1.0                 wangqing          代码规范         2019-08-28
 * **********************************************************************
 */

import {
  Component,
  OnInit,
  AfterViewInit,
  Output,
  EventEmitter,
  Input,
  ViewContainerRef,
} from '@angular/core';
import { Params, ActivatedRoute } from '@angular/router';
import { FormGroup } from '@angular/forms';
import { isNullOrUndefined } from 'util';
import * as _ from 'lodash';
import { IFlowCustom, FlowCustom } from '../flow/flow-custom';
import { XnService } from 'libs/shared/src/lib/services/xn.service';
import { LoadingService } from 'libs/shared/src/lib/services/loading.service';
import { LocalStorageService } from 'libs/shared/src/lib/services/local-storage.service';
import { HwModeService } from 'libs/shared/src/lib/services/hw-mode.service';
import { PublicCommunicateService } from 'libs/shared/src/lib/services/public-communicate.service';
import {
  EditModalComponent,
  EditParamInputModel,
} from 'libs/shared/src/lib/public/dragon-vanke/modal/edit-modal.component';
import { CheckersOutputModel } from 'libs/shared/src/lib/config/checkers';
import { XnUtils } from 'libs/shared/src/lib/common/xn-utils';
import XnFlowUtils from 'libs/shared/src/lib/common/xn-flow-utils';
import { applyFactoringTtype } from 'libs/shared/src/lib/config/select-options';
import { XnModalUtils } from 'libs/shared/src/lib/common/xn-modal-utils';
import { PointService } from 'libs/shared/src/lib/services/point.service';
@Component({
  selector: 'old-vanke-new-component',
  templateUrl: './old-new.component.html',
  styles: [
    `
      .app-flow-process {
        border: 1px solid #ddd;
        padding: 4px;
        margin-bottom: 10px;
        border-radius: 3px;
        background-color: #fff;
      }
    `,
  ],
})
export class OldVankeNewComponent implements OnInit {
  formModule = 'dragon-input';
  @Input() flowId: string;
  @Input() mainForm: FormGroup;
  @Input() svrConfig: any;
  @Input() rows;

  pageTitle = '发起新流程';
  pageDesc = '';

  flowCustom: IFlowCustom;

  /** 定向支付-替换发票-额外参数 */
  invoiceReplaceParams = {} as any;

  loadingback = false;

  showProgress = false;

  flowProcess = {
    show: false,
    proxy: 0,
    steped: 0,
  };
  billNumberList: string[] = [];
  headquarters: string;
  // todo 定向收款保理-经办显示合同
  public contracts: any;
  @Output() afterBuildFormGroup: EventEmitter<void> = new EventEmitter();

  constructor(
    private xn: XnService,
    private route: ActivatedRoute,
    private vcr: ViewContainerRef,
    private loading: LoadingService,
    private localStorageService: LocalStorageService,
    public hwModeService: HwModeService,
    public communicateService: PublicCommunicateService,
    public pointService: PointService
  ) {}

  ngOnInit() {
    this.flowCustom = FlowCustom.build(
      this.flowId,
      this.xn,
      this.vcr,
      this.loading,
      this.communicateService,
      this.localStorageService,
      this.pointService
    );
  }
  preTradeCheck(formValue): Promise<any[]> {
    const billNumberList = XnUtils.parseObject(formValue.value).map(
      (i) => i.billNumber
    );
    return new Promise((resolve) => {
      this.xn.api.dragon
        .post('/pre_trade/pre_trade/check', { billNumberList: billNumberList })
        .subscribe((res) => {
          if (res.ret === 0) {
            const { warn } = res.data;
            if (!_.isEmpty(res.data.warn)) {
              resolve(warn);
            } else {
              resolve(undefined);
            }
          } else {
            console.log('接口有误', res);
            resolve(undefined);
          }
          this.xn.loading.close();
        });
    });
  }
  /**
   *  提交
   */
  public async onSubmit() {
    const orderInfo = this.svrConfig.checkers.filter(
      (item) => item.checkerId === 'orderInfo'
    );
    // TODO:
    const warnData =
      orderInfo.length > 0 ? await this.preTradeCheck(orderInfo[0]) : null;
    if (!_.isEmpty(warnData)) {
      const resultList = XnUtils.parseObject(
        this.mainForm.value.orderInfo
      ).filter((i) => {
        return warnData.includes(i.billNumber);
      });
      const params: EditParamInputModel = {
        title: '提示',
        checker: [
          {
            title: '已选交易',
            checkerId: 'editPreTradeInfo',
            type: 'table-common',
            required: 0,
            value: !_.isEmpty(resultList) ? JSON.stringify(resultList) : '',
          },
        ] as CheckersOutputModel[],
        content:
          '以下【进度款前置融资业务】的“应收账款金额”小于“特定数值”，请确认是否继续发起提单？',
        subContent:
          'tips：特定数值=进度款前置融资产品流程中的付款金额 ×（1+（22.5%×（发起提单日期-进度款前置融资产品流程中的付款日期）/360））',
        buttons: ['取消', '确定'],
      };
      XnModalUtils.openInViewContainer(
        this.xn,
        this.vcr,
        EditModalComponent,
        params
      ).subscribe((res) => {
        if (!res) {
          return;
        }
        this.innerSubmit(() => {
          return this.flowCustom.preSubmit(this.svrConfig, this.mainForm.value);
        });
      });
      return;
    }
    this.innerSubmit(() => {
      return this.flowCustom.preSubmit(this.svrConfig, this.mainForm.value);
    });
  }

  /**
   *  取消并返回
   */
  public onCancel() {
    this.xn.user.navigateBack();
  }

  /**
   *  中等登记 todo 暂留
   */
  public onRegistration() {}

  /**
   * 下载授权文件
   */
  public authorizationFile() {
    // this.xn.loading.open();
    // this.xn.api.dragon.download('/custom/vanke_v5/project/download_qrh', {}).subscribe((v: any) => {
    //     this.xn.loading.close();
    //     this.xn.api.dragon.save(v._body, '确认函-项目公司.zip');
    // });

    console.error('未实现');
  }

  /**
   *  提交前特殊处理
   */
  public doSubmit() {
    this.request('new');
  }

  /**
   *  提交时根据配置进行处理
   * @param fn
   */
  private innerSubmit(fn) {
    fn().subscribe((v) => {
      this.handleAction(v, () => {
        this.doSubmit();
      });
    });
  }

  private request(method: string) {
    for (const checker of this.svrConfig.checkers) {
      if (checker.options && checker.options.readonly) {
        if (checker.checkerId === 'deputeMoney') {
          // 特殊过滤：替换发票流程 中 委托付款金额 过滤
          this.mainForm.value[checker.checkerId] = XnUtils.formatMoney(
            this.mainForm.controls.deputeMoney.value
          );
        } else if (checker.checkerId === 'deputeLeft') {
          // 特殊过滤：替换发票流程 中 托管账户余额 过滤
          this.mainForm.value[checker.checkerId] = XnUtils.formatMoney(
            this.mainForm.controls.deputeLeft.value
          );
        } else {
          this.mainForm.value[checker.checkerId] = checker.value;
        }
      }
      if (checker.checkerId === 'checkType') {
        // 特殊过滤：万科数据对接-预审不通过、退单流程过滤
        const checkTypeVal = JSON.parse(this.mainForm.controls.checkType.value);
        const statusText = XnFlowUtils.fnTransform(
          JSON.parse(this.mainForm.controls.checkType.value),
          'systemFail'
        );
        this.mainForm.value[checker.checkerId] = JSON.stringify({
          ...checkTypeVal,
          statusText,
        });
      }
      if (checker.checkerId === 'redeemReceive') {
        this.mainForm.value[checker.checkerId] = String(
          this.mainForm.value[checker.checkerId]
        ).replace(/\D/g, '');
      }
    }

    const formValue: any = this.mainForm.value;

    const params: any = {
      flowId: this.flowId,
      procedureId: this.svrConfig.procedure.procedureId,
      title: formValue.title,
      memo: formValue.memo,
      checkers: XnFlowUtils.buildSubmitCheckers(
        this.svrConfig.checkers,
        formValue
      ),
      recordId: (this.svrConfig.record && this.svrConfig.record.recordId) || '',
      contracts: this.svrConfig.contracts,
    };

    if (this.svrConfig.constParams) {
      params.relatedRecordId = this.svrConfig.constParams.relatedRecordId || '';
      if (this.svrConfig.constParams.checkers) {
        for (const key in this.svrConfig.constParams.checkers) {
          if (this.svrConfig.constParams.checkers.hasOwnProperty(key)) {
            params.checkers[key] = this.svrConfig.constParams.checkers[key];
          }
        }
      }
    }
    params.factoringAppId = applyFactoringTtype['深圳市柏霖汇商业保理有限公司'];

    // 加上loading
    XnUtils.checkLoading(this);
    console.log('flow params', params);
    this.xn.api.dragon.post(`/flow/${method}`, params).subscribe((json) => {
      this.flowCustom.afterSubmitandGettip(this.svrConfig, this.mainForm.value);
      this.xn.router.navigate([`/vanke/record/record/${this.flowId}`]);
    });
  }

  /**
   *  对流程checkers 项的值进行处理
   * @param v v{null:不做处理，v.action{navigate-back:返回，const-params: 对流程所有项重新赋值}}
   * @param fn
   */
  private handleAction(v, fn) {
    if (!(v && v.action)) {
      fn();
      return;
    }
    if (v.action === 'stop') {
      return;
    }
    if (v.action === 'navigate-back') {
      this.xn.user.navigateBack();
      return;
    }
    if (v.action === 'modal') {
      XnModalUtils.openInViewContainer(
        this.xn,
        this.vcr,
        v.modal,
        v.params
      ).subscribe((v2) => {
        if (v2.action === 'cancel' || !!v2) {
          fn();
          return;
        } else if (v2 === null) {
          // this.goDistance();
          return;
        }
      });
      // return;
    }
    // 收款登记
    if (v.action === 'const-params') {
      this.svrConfig.constParams = this.svrConfig.constParams || {
        checkers: [],
      };
      // 经办显示的合同
      this.contracts = v.data.contracts;
      // 赋值
      for (const checkerId in v.data) {
        if (v.data.hasOwnProperty(checkerId)) {
          const ctrl = this.mainForm.get(checkerId);
          this.svrConfig.constParams.checkers[checkerId] = v.data[checkerId];
          if (!isNullOrUndefined(ctrl)) {
            ctrl.setValue(v.data[checkerId]);
          }
        }
      }
      return;
    }
  }

  /**
   * 获取other：用于必填项提示 type= 1仅显示提示 2可操作链接
   * @param row 表单数据
   */
  public getRowOther(row: any): any {
    if (!!row.other && typeof row.other === 'string') {
      return JSON.parse(row.other);
    }
  }

  /**
   * other提示-点击事件
   * @param value
   * @param row
   */
  public onRowOtherClick(value: string, row: any) {
    if (
      ['legalCertificate', 'beneficiaryIdentify', 'authLetter'].includes(
        row.checkerId
      )
    ) {
      const param = {
        type: TypeEnum[row.checkerId],
      };
      // this.xn.api.dragon.download(CommonEnum[row.checkerId], param).subscribe((v: any) => {
      //     this.xn.api.save(v._body, 'xxxx.zip');
      // });
    }
  }

  /**
   * checker项是否隐藏
   * @param row
   * @returns boolean
   */
  showRow(row: any): boolean {
    /** 如果options 配置了nodisplay=true则意为隐藏该checker项 */
    if (row?.options && row?.options?.nodisplay) {
      return false;
    } else {
      return true;
    }
  }
}

export enum CommonEnum {
  'legalCertificate' = 'http://gsxt.gdgs.gov.cn/',
  'beneficiaryIdentify' = 'http://gsxt.gdgs.gov.cn/',
  'authLetter' = 'http://gsxt.gdgs.gov.cn/',
}

export enum TypeEnum {
  'legalCertificate' = '0',
  'beneficiaryIdentify' = '1',
  'authLetter' = '2',
}
