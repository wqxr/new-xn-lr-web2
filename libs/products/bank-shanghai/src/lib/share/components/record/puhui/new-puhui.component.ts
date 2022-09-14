/*************************************************************************
* Copyright (c) 2017 - 2021 深圳市链融科技股份有限公司
* Shenzhen Lianrong Technology Co., Ltd.
* All rights reserved.
*
* @file：libs\products\bank-shanghai\src\lib\share\components\record\puhui\new-puhui.component.ts
* @summary：发起普惠开户流程
* @version: 1.0
* *************************************************************************
* revision             author            reason             date
* 1.0                 hucongying          init          2021-07-02
***************************************************************************/
import { Component, OnInit, AfterViewInit, ViewContainerRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormGroup } from '@angular/forms';
import { FlowCustom, IFlowCustom } from '../../flow/flow-custom';
import { XnService } from 'libs/shared/src/lib/services/xn.service';
import { LoadingService } from 'libs/shared/src/lib/services/loading.service';
import { LocalStorageService } from 'libs/shared/src/lib/services/local-storage.service';
import { HwModeService } from 'libs/shared/src/lib/services/hw-mode.service';
import { PublicCommunicateService } from 'libs/shared/src/lib/services/public-communicate.service';
import { XnUtils } from 'libs/shared/src/lib/common/xn-utils';
import XnFlowUtils from 'libs/shared/src/lib/common/xn-flow-utils';
import { CheckersOutputModel } from 'libs/shared/src/lib/config/checkers';
import { LocalFlowProcessModel } from '../../process/flow-process.model';
import { supplierProcessJson } from '../../process/puhui/puhui-flow-process-config';

@Component({
  selector: 'sh-bank-new-ph',
  templateUrl: './new-puhui.component.html',
  styles: [
    `.app-flow-process {
            border: 1px solid #ddd;
            padding: 4px;
            margin-bottom: 10px;
            border-radius: 3px;
            background-color: #fff;
        }
      ::ng-deep .ant-modal-close-x {
          padding: 10px;
        }
        `,
  ]
})
export class PuhuiNewComponent implements OnInit, AfterViewInit {
  public formModule = 'dragon-input';
  /** 流程flowId */
  public flowId: string;
  /** 企业appId */
  public appId: string = '';
  /** mainForm */
  public mainForm: FormGroup;
  /** svrConfig */
  public svrConfig: any;
  /** rows checker项 */
  public rows: any[] = [];
  /** pageTitle */
  public pageTitle = '发起新流程';
  /** pageDesc */
  public pageDesc = '';
  /** flowCustom */
  public flowCustom: IFlowCustom;
  /** showProgress */
  public showProgress: boolean = false;
  // 导航配置
  public flowProcess: LocalFlowProcessModel[] = supplierProcessJson;
  public firstStep: number = StepValueEnum.FIRST
  public secondStep: number = StepValueEnum.SECOND
  public thirdStep: number = StepValueEnum.THIRD
  /** 当前步骤 */
  public step: number = StepValueEnum.FIRST;

  constructor(private xn: XnService,
    private route: ActivatedRoute,
    private vcr: ViewContainerRef,
    private loading: LoadingService,
    private localStorageService: LocalStorageService,
    public hwModeService: HwModeService,
    public communicateService: PublicCommunicateService,
    private publicCommunicateService: PublicCommunicateService) {
  }

  ngOnInit() {
    /** 监听子组件表单发射出来的值 */
    this.publicCommunicateService.change.subscribe(v => {
      if (v?.step) {
        this.step = v.step;
        this.svrConfig = v.svrConfig;
      }
    })
  }

  ngAfterViewInit() {

    this.route.queryParams.subscribe(params => {
      if (XnUtils.isEmptyObject(params)) {
        return;
      }
      this.flowId = params.id || this.flowId;
      this.appId = params.appId;
      this.localStorageService.setCacheValue('current_flow', this.flowId);
    });
    this.getPreShow();
  }

  /**
   *  取消并返回
   */
  public onCancel() {
    this.xn.user.navigateBack();
  }

  /**
   * 显示之前处理
   */
  private getPreShow() {
    setTimeout(() => {
      this.flowCustom = FlowCustom.build(this.flowId, this.xn,
        this.vcr, this.loading, this.communicateService, this.localStorageService);
      this.preShow();
    }, 0);
  }

  private preShow() {
    this.flowCustom.preShow(this.svrConfig).subscribe((v: any) => {
      this.handleAction(v, () => {
        this.doShow();
      });
    });
  }

  /**
   *  根据配置，流程id渲染
   */
  private doShow() {
    const postObj = {} as any;
    postObj.flowId = this.flowId;
    postObj.appId = this.appId;

    this.xn.api.dragon.post('/flow/showNew', postObj).subscribe(json => {
      this.svrConfig = json.data;
      this.flowCustom.postGetSvrConfig(this.svrConfig);
      this.svrConfig = XnFlowUtils.handleSvrConfig(this.svrConfig);
      this.buildRows();
    });
  }

  /**
   * 把svrConfig.checkers转换为rows对象，方便模板输出
   */
  private buildRows(): void {
    const others = [];
    const titleConfig = this.flowCustom.getTitleConfig();
    const titleObj = {
      name: 'title',
      required: true,
      type: 'text',
      title: titleConfig.titleName || '流程标题',
      value: titleConfig.def || ''
    };
    if (titleConfig && titleConfig.hideTitle) {
      // mainForm里有titleRow，但this.rows里没有，这样就是个隐藏提交的值
      others.push(titleObj);
      this.rows = [].concat(this.svrConfig.checkers);
    } else {
      this.rows = [titleObj].concat(this.svrConfig.checkers);
    }
    this.rows = this.rows.concat({
      name: 'memo',
      required: false,
      type: 'textarea',
      title: this.svrConfig.procedure.procedureId === '@begin' ? '备注' : '审核意见'
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
  }

  /**
   * 获取other：用于必填项提示 type= 1仅显示提示 2可操作链接
   * @param row 表单数据
   */
  public getRowOther(row: any): any {
    return !!row.other ? XnUtils.parseObject(row.other, {}) : {};
  }
}
/** 开户流程步骤 */
export enum StepValueEnum {
  /** 第一步 */
  FIRST = 1,
  /** 第二步 */
  SECOND = 2,
  /** 第三步 */
  THIRD = 3
}


