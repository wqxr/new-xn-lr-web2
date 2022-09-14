/*
 * @Description: 上海银行复核流程
 * @Version: 1.0
 * @Author: yutianbao
 * @Date: 2020-10-23 15:07:03
 * @LastEditors: yutianbao
 * @LastEditTime: 2021-09-09 11:15:17
 * @FilePath: \xn-lr-web2\libs\products\bank-shanghai\src\lib\pages\shanghai-review\review-process\review-process.component.ts
 * @copyright: Copyright(C) 2017-2020, 深圳市链融科技股份有限公司
 */
import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnInit,
  ViewContainerRef,
} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import XnFlowUtils from 'libs/shared/src/lib/common/xn-flow-utils';
import { XnFormUtils } from 'libs/shared/src/lib/common/xn-form-utils';
import { XnUtils } from 'libs/shared/src/lib/common/xn-utils';
import { HwModeService } from 'libs/shared/src/lib/services/hw-mode.service';
import { XnService } from 'libs/shared/src/lib/services/xn.service';
import { AntResultModalComponent } from '../../../share/components/result-modal/ant-result-modal.component';
import { AntEditModalComponent } from '../../../share/modal/ant-edit-modal.component';
import { ShowModalService } from '../../../share/services/show-modal.service';

@Component({
  selector: 'lib-review-process',
  templateUrl: './review-process.component.html',
  styleUrls: ['./review-process.component.css'],
})
export class ReviewProcessComponent implements OnInit, AfterViewInit {
  formModule = 'dragon-input'; // 表单模块
  mainForm: FormGroup; // 表单类
  svrConfig: any; // 流程配置项
  rows: any[] = [
    {
      fieldGroupSpan: 24,
      key: 'accessInfo',
      text: '准入资料',
      fieldGroup: [],
    },
    {
      fieldGroupSpan: 24,
      key: 'businessInfo',
      text: '业务资料',
      fieldGroup: [],
    },
    {
      fieldGroupClassName: 24,
      key: 'addLoanCrdNo',
      text: '补充中征码',
      fieldGroup: [],
    },
  ]; // 控件配置项
  queryParams: any; // 路由数据
  showProgress = true;
  nzLayout: 'horizontal' | 'vertical' = 'vertical';
  constructor(
    private xn: XnService,
    private vcr: ViewContainerRef,
    private showModalService: ShowModalService,
    private route: ActivatedRoute,
    private router: Router,
    private er: ElementRef,
    public hwModeService: HwModeService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      if (XnUtils.isEmptyObject(params)) {
        return;
      }
      this.queryParams = { ...params };
      this.doShow();
    });
  }

  ngAfterViewInit() {}

  /**
   *  根据配置渲染form
   */
  private doShow() {
    const postObj = {
      recordId: this.queryParams.recordId,
    };
    this.xn.api.dragon.postMapCatch('/flow/showSubmit', postObj).subscribe({
      next: (json: any) => {
        if (json && json.ret !== 0) {
          this.showPostError(json);
        } else if (json && json.ret === 0 && json.data) {
          this.svrConfig = json.data;
          // this.flowCustom.postGetSvrConfig(this.svrConfig);
          this.svrConfig = XnFlowUtils.handleSvrConfig(this.svrConfig);
          // this.buildRows();
          this.prevHandleSvrConfig(this.svrConfig);
        }
      },
      error: (err: any) => {
        console.log('err', err);
      },
      complete: () => {},
    });
  }

  /**
   * 接口返回数据预处理
   * @svrConfig 接口返回数据
   */
  prevHandleSvrConfig(svrConfig: any) {
    // const checkersObj = this.svrConfig.actions.find((x: any) => x.recordSeq === this.svrConfig.record.recordSeq);
    const checkers = svrConfig?.checkers || [];
    const prevInoviceObj = svrConfig.actions[0].checkers.find((x: any) => ['invoice'].includes(x.checkerId)) || {};
    const newInvoieData = XnUtils.parseObject(prevInoviceObj?.data || [], []);
    // 重新组装数据 添加样式
    const checkersNew = [
      {
        fieldGroupSpan: 24,
        key: 'accessInfo',
        text: '准入资料',
        fieldGroup: [
          {
            rowSpan: 24,
            checkerIdGroup: ['supplierName', 'linkageRadio'],
            checkerGroup: checkers
              .filter((x: any) =>
                ['supplierName', 'linkageRadio'].includes(x.checkerId)
              )
              .map((y: any) => {
                y.checkerSpan = ['linkageRadio'].includes(y.checkerId) ? 16 : 8;
                return y;
              }),
          },
          {
            rowSpan: 24,
            checkerIdGroup: [
              'creditPublicityFile',
              'enterpriseExecutorFile',
              'litigationFile',
            ],
            checkerGroup: checkers
              .filter((x: any) =>
                [
                  'creditPublicityFile',
                  'enterpriseExecutorFile',
                  'litigationFile',
                ].includes(x.checkerId)
              )
              .map((y: any) => {
                y.checkerSpan = 8;
                return y;
              }),
          },
          {
            rowSpan: 24,
            checkerIdGroup: ['baseFile'],
            checkerGroup: checkers
              .filter((x: any) => ['baseFile'].includes(x.checkerId))
              .map((y: any) => {
                y.checkerSpan = ['baseFile'].includes(y.checkerId) ? 18 : 8;
                return y;
              }),
          },
        ],
      },
      {
        fieldGroupSpan: 24,
        key: 'businessInfo',
        text: '业务资料',
        fieldGroup: [
          {
            rowSpan: 24,
            checkerIdGroup: ['productType', 'headquarters', 'projectCompany'],
            checkerGroup: checkers
              .filter((x: any) =>
                ['productType', 'headquarters', 'projectCompany'].includes(
                  x.checkerId
                )
              )
              .map((y: any) => {
                y.checkerSpan = 8;
                return y;
              }),
          },
          {
            rowSpan: 24,
            checkerIdGroup: ['supplierName', 'receive', 'discountRate'],
            checkerGroup: checkers
              .filter((x: any) =>
                ['supplierName', 'receive', 'discountRate'].includes(
                  x.checkerId
                )
              )
              .map((y: any) => {
                y.checkerSpan = 8;
                return y;
              }),
          },
          {
            rowSpan: 24,
            checkerIdGroup: ['registerCertFile', 'otherFile'], // 'checkCertFile',
            checkerGroup: checkers
              .filter((x: any) =>
                ['registerCertFile', 'otherFile'] // 'checkCertFile',
                  .includes(x.checkerId)
              )
              .map((y: any) => {
                y.checkerSpan = 8;
                return y;
              }),
          },
          {
            rowSpan: 24,
            checkerIdGroup: ['dealContract'],
            checkerGroup: checkers
              .filter((x: any) => ['dealContract'].includes(x.checkerId))
              .map((y: any) => {
                y.checkerSpan = ['dealContract'].includes(y.checkerId) ? 24 : 8;
                return y;
              }),
          },
          {
            rowSpan: 24,
            checkerIdGroup: ['invoice'],
            // svrConfig.actions[0].checkers.filter((i) => i.checkerId === 'invoice')
            checkerGroup: checkers
              .filter((x: any) => ['invoice'].includes(x.checkerId))
              .map((y: any) => {
                let val = XnUtils.parseObject(y.value, []);
                y.value = newInvoieData.map((z: any, index: number) => {
                  return {
                    ...z,
                    fileName: val[index]?.fileName,
                    filePath: val[index]?.filePath,
                  }
                })
                y.checkerSpan = ['invoice'].includes(y.checkerId) ? 24 : 8;
                return y;
              }),
          },
        ],
      },
      {
        fieldGroupClassName: 24,
        key: 'addLoanCrdNo',
        text: '融资申请信息',
        fieldGroup: [
          {
            rowSpan: 24,
            checkerIdGroup: [
              'eAccountStatus',
              'eAcctNo',
              'debtUnitUser',
              'debtUnitUserMobile',
              'debtUnitRegisterAddress',
              'debtUnitAddress',
              'projectCompanyName',
              'projectCompanyCustNo',
            ],
            checkerGroup: checkers
              .filter((x: any) =>
                [
                  'eAccountStatus',
                  'eAcctNo',
                  'debtUnitUser',
                  'debtUnitUserMobile',
                  'debtUnitRegisterAddress',
                  'debtUnitAddress',
                  'projectCompanyName',
                  'projectCompanyCustNo',
                ].includes(x.checkerId)
              )
              .map((y: any) => {
                y.checkerSpan = 8;
                return y;
              }),
          },
        ],
      },
    ];
    this.buildRows(checkersNew, checkers);
  }

  /**
   * 把svrConfig.checkers转换为rows对象，方便模板输出
   */
  private buildRows(checkersNew: any[], checkers: any[]): void {
    // this.rows = this.svrConfig.checkers;
    // this.mainForm = XnFormUtils.buildFormGroup(this.rows);
    this.rows = checkersNew;
    this.mainForm = XnFormUtils.buildFormGroup(checkers);
    this.cdr.markForCheck();
  }

  /**
   *  提交
   */
  public onSubmit() {
    const formValue: any = this.mainForm.value;
    const eAccountStatus = formValue.eAccountStatus;
    let noEAccountMsg = '';
    if (!!XnUtils.isEmptys(eAccountStatus, [0])) {
      noEAccountMsg = `${this.svrConfig.debtUnit}普惠开户状态查询中，请稍后再操作`;
    } else if (['2', 2].includes(eAccountStatus)) {
      noEAccountMsg = `开户状态查询异常，请稍后重试或联系管理员`;
    } else if (['0', 0].includes(eAccountStatus)) {
      noEAccountMsg = `${this.svrConfig.debtUnit}在普惠APP上未开户成功，请等待开户成功后再操作`;
    }
    if (!!noEAccountMsg) {
      const param = {
        nzTitle: '',
        nzWidth: 480,
        nzFooter: true,
        nzMaskClosable: true,
        nzClosable: true,
        message: {
          nzType: 'exclamation-circle',
          nzColor: '#faad14',
          nzTitle: '警告',
          nzContent: noEAccountMsg,
        },
        buttons: {
          left: [],
          right: [{ label: '确定', btnKey: 'ok', type: 'normal' }],
        },
      };
      this.showModalService
        .openModal(this.xn, this.vcr, AntResultModalComponent, param)
        .subscribe((x: any) => {});
      return false;
    }
    const param = {
      recordId: this.queryParams.recordId,
      procedureId: this.svrConfig.procedure.procedureId,
      memo: formValue.memo || '',
      checkers: XnFlowUtils.buildSubmitCheckers(
        this.svrConfig.checkers,
        formValue
      ),
    };
    this.xn.dragon.postMapCatch('/flow/submit', param).subscribe({
      next: (res) => {
        if (res && res.ret === 0 && res.data) {
          this.onGoBack();
        } else if (res.ret !== 0) {
          this.showPostError(res);
        }
      },
      error: (err) => {
        console.error(err);
      },
      complete: () => {},
    });
  }

  /**
   * 返回列表
   */
  onGoBack() {
    this.router.navigate(['/bank-shanghai/review-list']);
  }

  /**
   * 拒绝
   */
  onRefuse() {
    const params = {
      title: '上海银行复核-审核意见',
      showTipIcon: true,
      tipIconType: 'exclamation-circle',
      tipIconNzType: 'err',
      layout: 'vertical',
      width: 560,
      formModalFields: [
        {
          className: 'ant-col ant-col-md-24 ant-col-sm-24',
          wrappers: ['form-field-horizontal'],
          key: 'rejectReason',
          type: 'textarea',
          templateOptions: {
            label: '请输入拒绝理由',
            placeholder: '请输入',
            required: true,
            labelSpan: 24,
            controlSpan: 24,
          },
        },
      ],
    };
    this.showModalService
      .openModal(this.xn, this.vcr, AntEditModalComponent, params)
      .subscribe((v) => {
        if (v && v.action === 'ok') {
          // 退回到平台初审
          const rejectParam: any = {
            recordId: this.queryParams.recordId,
            procedureId: this.svrConfig.procedure.procedureId,
            memo: '',
            rejectInfo: {
              content: {},
              rejectReason: v.params?.rejectReason || '',
              desc: '',
            },
          };
          this.xn.api.dragon
            .postMapCatch(`/flow/reject`, rejectParam)
            .subscribe((result: any) => {
              if (result && result.ret !== 0) {
                this.showPostError(result);
              } else if (result && result.ret === 0) {
                this.onGoBack();
              }
            });
        }
      });
  }

  showPostError(json: { ret: number; msg: string }) {
    const param = {
      nzTitle: '',
      nzWidth: 480,
      nzFooter: true,
      nzMaskClosable: true,
      nzClosable: true,
      message: {
        nzType: 'close-circle',
        nzColor: '#ff4d4f',
        nzTitle: '错误',
        nzContent: `错误码[${json.ret}]，${json.msg}`,
      },
      buttons: {
        left: [],
        right: [{ label: '确定', btnKey: 'ok', type: 'normal' }],
      },
    };
    this.showModalService
      .openModal(this.xn, this.vcr, AntResultModalComponent, param)
      .subscribe((x: any) => {
        if ([99902, 20001].includes(json.ret)) {
          // 用户没有登录，跳转到登录界面
          this.router.navigate(['/login']);
        } else {
          this.onGoBack();
        }
      });
  }
}

export enum CardTitle {
  'accessInfo' = '准入资料',
  'businessInfo' = '业务资料',
}

export enum SubmitUrl {
  '/cloud/contract/contract_group/update' = 2,
  '/cloud/contract/contract_group/add' = 3,
}

export enum Relation {
  '' = 0,
  '上海银行股份有限公司' = 1,
  '万科企业股份有限公司' = 2,
}
