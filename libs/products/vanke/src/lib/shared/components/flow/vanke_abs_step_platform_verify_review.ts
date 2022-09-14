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

export class VankePlatFormStepReview implements IFlowCustom {
  public buttonList: buttonListType = _.cloneDeep(buttonList);

  constructor(private xn: XnService, private loading: LoadingService) {}

  preShow(svrConfig): Observable<any> {
    return of(null);
  }
  afterSubmitandGettip(
    svrConfig: any,
    formValue: any,
    x: any
  ): Observable<any> {
    if (svrConfig.procedure.procedureId === 'review') {
      if (x && x.ret === 0 && x.data && x.data.backMsg) {
        this.xn.msgBox.open(false, x.data.backMsg, () => {});
      } else {
        this.xn.msgBox.open(
          false,
          [
            '平台审核通过，请耐心等待保理商风险审查。',
            `该笔交易进度可在交易列表中查看，交易id为${svrConfig.record.mainFlowId}`,
          ],
          () => {}
        );
      }
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
        click: (mainForm, svrConfig, xn, vcr) => {},
      });
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
    leftButtons: [],
    rightButtons: [],
  },
  review: {
    leftButtons: [],
    rightButtons: [
      {
        label: '驳回',
        danger: false,
        color: 'default',
        operate: 'reject',
        click: () => {},
      },
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
        label: '查看补充信息',
        danger: false,
        color: 'primary',
        operate: EditButtonType.REVIEW,
        click: () => {},
      },
    ],
  },
};
