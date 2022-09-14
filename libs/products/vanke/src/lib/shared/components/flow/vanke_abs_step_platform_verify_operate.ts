import { FormGroup, FormControl, Validators } from '@angular/forms';
/*
 * Copyright(c) 2017-2019, 深圳市链融科技股份有限公司
 * Beijing Xiwei Technology Co., Ltd.
 * All rights reserved.
 *
 * @file：SupplierUploadInformationFlow
 * @summary：分布提交万科ABS平台审核
 * @version: 1.0
 * **********************************************************************
 * revision             author            reason             date
 * 1.0                wangqing            平台审核         2021-08-26
 * **********************************************************************
 */

import { Observable, of } from 'rxjs';
import { IFlowCustom, buttonListType } from './flow-custom';
import { XnService } from 'libs/shared/src/lib/services/xn.service';
import { LoadingService } from 'libs/shared/src/lib/services/loading.service';
import { EditButtonType } from 'libs/shared/src/lib/config/enum';
import * as _ from 'lodash';

export class VankePlatFormStep implements IFlowCustom {
  public buttonList: buttonListType = _.cloneDeep(buttonList);
  constructor(private xn: XnService, private loading: LoadingService) { }

  preShow(svrConfig): Observable<any> {
    return of(null);
  }
  afterSubmitandGettip(
    svrConfig: any,
    formValue: any,
    x: any
  ): Observable<any> {
    // console.log("svr==", svrConfig, x);
    if (svrConfig.procedure.procedureId === 'operate') {
      this.xn.msgBox.open(
        false,
        [
          '提交成功',
          '下一步请复核人在【首页-待办任务】中完成【复核】的待办任务',
        ],
        () => { }
      );
    }
    return of(null);
  }
  postShow(svrConfig: any, form: FormGroup): Observable<any> {
    if (svrConfig.rejectType === 0) {
      this.buttonList[svrConfig.procedure.procedureId].rightButtons.push({
        label: '中止流程',
        operate: 'suspension',
        danger: false,
        color: 'default',
        click: (mainForm, svrConfig, xn, vcr) => { },
      });
    }
    if (svrConfig.wkType === 1) {
      this.buttonList[svrConfig.procedure.procedureId].rightButtons=[...this.buttonList[svrConfig.procedure.procedureId].rightButtons,...[{
        label: '发起万科修改',
        danger: false,
        color: 'primary',
        operate: 'vanke-change',
        click: () => { },
      },
      {
        label: '查看全部发票信息',
        danger: false,
        color: 'primary',
        operate: EditButtonType.VIEW_INVOICE,
        click: (mainForm, svrConfig, xn, vcr) => {
          const url = xn.router.serializeUrl(xn.router.createUrlTree([`/console/manage/plat/invoice-view/${svrConfig.record.mainFlowId}`]));
          window.open(url,'_blank','noopener');
        },
      },
    ]];
    }
    return of({ buttonList: this.buttonList[svrConfig.procedure.procedureId] });
  }

  postGetSvrConfig(svrConfig: any, rows: any): void {
    if (svrConfig.actions && svrConfig.actions.length > 0) {
      svrConfig.actions.forEach((x, index) => {
        if (x.checkers.length) {
          x.stepList.forEach((y) => {
            y.checkerIdList = x.checkers.filter((z) => z.stepId === y.stepId);
          });
        }
      });
    }
    if (svrConfig.stepList && svrConfig.stepList.length > 0) {
      svrConfig.stepList.forEach((x) => {
        x.checkerIdList = svrConfig.checkers.filter(
          (y) => y.stepId === x.stepId
        );
      });
      // svrConfig.stepList[svrConfig.stepList.length - 1].checkerIdList.push(rows[rows.length - 1]);
    }
  }
  preSubmit(svrConfig: any, formValue: any): Observable<any> {
    return of(null);
  }

  getTitleConfig(): any {
    return {
      hideTitle: true,
      titleName: '流程标题',
      def: '平台审核',
    };
  }
}
const buttonList: buttonListType = {
  '@begin': {
    leftButtons: [],
    rightButtons: [],
  },
  operate: {
    leftButtons: [
      {
        label: '审核标准',
        danger: false,
        color: 'default',
        operate: EditButtonType.RULR_ENGINE,
        click: () => { },
      },
    ],
    rightButtons: [
      {
        label: '汇融文件问题反馈',
        danger: false,
        color: 'primary',
        operate: EditButtonType.VANKE_FEEDBACK_DOCUMENT,
        click: (mainForm: FormGroup, svrConfig: any) => {
          const mainFlowId = svrConfig?.record?.mainFlowId;
          const url = `${window.location.origin}/console/manage/vanke-document-feedback?mainFlowId=${mainFlowId}`;
          window.open(url, '_blank');
        },
      },
      {
        label: '补充信息',
        danger: false,
        color: 'primary',
        operate: EditButtonType.SAVE,
        click: () => { },
      },
      {
        label: '下载中登附件',
        danger: false,
        color: 'primary',
        operate: EditButtonType.DOWNLOAD_REGISTERFILE,
        click: (mainForm, svrConfig, xn, vcr) => {
          xn.loading.open();
          const invoiceData = mainForm.get('invoice').value;
          const invoiceLists = JSON.parse(invoiceData).map((x) => {
            const { invoiceNum, invoiceAmount, transferMoney } = x;
            return {
              invoiceNum,
              invoiceAmount,
              transferMoney,
            };
          });

          xn.dragon
            .download('/zhongdeng/zd/zhongdeng_attachment_download', {
              mainFlowId: svrConfig.record.mainFlowId,
              invoiceList: invoiceLists,
            })
            .subscribe((v: any) => {
              xn.loading.close();
              xn.api.dragon.save(
                v._body,
                `${mainForm.get('debtUnit').value}-${
                mainForm.get('receive').value
                }.pdf`
              );
            });
        },
      },
      {
        label: '发起资料补正',
        danger: true,
        color: 'primary',
        operate: EditButtonType.COREECT_REJECT,
        click: () => { },
      },
    ],
  },
  review: {
    leftButtons: [],
    rightButtons: [
      {
        label: '驳回',
        danger: false,
        color: 'default',
        operate: EditButtonType.REJECT,
        click: () => { },
      },
    ],
  },
};
