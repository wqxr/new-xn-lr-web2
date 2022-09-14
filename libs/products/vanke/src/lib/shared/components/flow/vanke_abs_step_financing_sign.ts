import { FormGroup, FormControl, Validators } from '@angular/forms';
/*
 * Copyright(c) 2017-2019, 深圳市链融科技股份有限公司
 * Beijing Xiwei Technology Co., Ltd.
 * All rights reserved.
 *
 * @file：SupplierUploadInformationFlow
 * @summary：分布提交万科ABS供应商签署合同
 * @version: 1.0
 * **********************************************************************
 * revision             author            reason             date
 * 1.0                wangqing        供应商签署合同         2021-09-08
 * **********************************************************************
 */

import { Observable, of } from 'rxjs';
import { IFlowCustom, buttonListType } from './flow-custom';
import { XnService } from 'libs/shared/src/lib/services/xn.service';
import { LoadingService } from 'libs/shared/src/lib/services/loading.service';
import { XnUtils } from 'libs/shared/src/lib/common/xn-utils';
import { LocalStorageService } from 'libs/shared/src/lib/services/local-storage.service';
import XnFlowUtils from 'libs/shared/src/lib/common/xn-flow-utils';
import { DragonFinancingContractModalComponent } from 'libs/shared/src/lib/public/dragon-vanke/modal/dragon-asign-contract.modal';
import { map } from 'rxjs/operators';
import * as _ from 'lodash';
import { PointService } from 'libs/shared/src/lib/services/point.service';
import { ViewButtonType } from 'libs/shared/src/lib/config/enum';
export class VankeFinancingSignStep implements IFlowCustom {
  public buttonList: buttonListType = _.cloneDeep(buttonList);

  constructor(
    private xn: XnService,
    private loading: LoadingService,
    private localStorageService: LocalStorageService,
    private pointService: PointService
  ) {}

  preShow(svrConfig): Observable<any> {
    return of(null);
  }
  afterSubmitandGettip(svrConfig: any): Observable<any> {
    this.pointService.setPoint({itemName: ViewButtonType.SignContractReview, mainFlowId: svrConfig.record.mainFlowId})
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
    if (svrConfig.procedure.procedureId !== 'review') {
      return of(null);
    }

    const params: any = {
      flowId: svrConfig.flow.flowId,
      procedureId: svrConfig.procedure.procedureId,
      recordId: (svrConfig.record && svrConfig.record.recordId) || '',
      title: formValue.title,
      memo: formValue.memo,
      checkers: XnFlowUtils.buildSubmitCheckers(svrConfig.checkers, formValue),
    };

    XnUtils.checkLoading(this);
    return this.xn.dragon.post('/flow/preSubmit', params).pipe(
      map((json) => {
        if (json.data.length === 0) {
          this.xn.msgBox.open(false, '无合同可签署');
          return of({
            action: 'stop',
          });
        } else {
          json.data.flowId = 'vanke_abs_step_financing_sign';
          json.data.isProxy = 53;
          const contracts = json.data;
          this.localStorageService.setCacheValue('vanke_financing_sign', {
            onLineStatus: !contracts.readonly,
          });
          contracts.forEach((element) => {
            if (!element.config) {
              element.config = {
                text: '',
              };
            }
          });
          contracts.forEach((x) => {
            if (x.label.includes('国内无追索权商业保理合同')) {
              x.config.text = '甲方（债权人、出让人）数字签名';
            } else if (x.label === '国内商业保理合同（宁波建工修订版）') {
              x.config.text = '乙方授权代表：';
            } else if (
              x.label === '国内商业保理合同-线上线下合同万科通用版' ||
              x.label === '国内商业保理合同-线上线下合同万科通用版-邮储版' ||
              x.label ===
                '国内商业保理合同-线上线下合同万科通用版-无特定到期日版' ||
              x.label === '国内商业保理合同-线上线下合同-青岛海尔开利修订版'
            ) {
              x.config.text = '乙方（公章/电子签章）';
            } else if (x.label === '国内商业保理合同线上线下通用版-华泰') {
              x.config.text = '乙方(公章/电子签章)';
            } else if (
              x.label.includes('应收账款转让协议书') ||
              x.label.includes('应收账款转让登记协议')
            ) {
              x.config.text = '甲方（出让方）';
            } else if (
              x.label.includes('应收账款债权转让通知书（致项目公司及万科总部')
            ) {
              x.config.text = '（盖章）';
            } else if (
              x.label.includes('应收账款债权转让通知书') &&
              x.label !== '应收账款债权转让通知书-招行'
            ) {
              x.config.text = '卖方：';
            } else if (x.label === '供应商说明-北京银行再保理') {
              x.config.text = '（公章）';
            } else if (x.label === '保理合同-国寿') {
              x.config.text = '卖方（盖章）：';
            } else if (
              x.label.includes('国内商业保理合同-线上版（新增邮储版')
            ) {
              x.config.text = '乙方(电子签章、数字签名)：';
            } else if (
              x.label.includes('国内商业保理合同-标准线上版-支持通用签章')
            ) {
              // 浦发银行合同列表
              x.config.text = '乙方(电子签章、数字签名)：';
            } else if (x.label.includes('国内商业保理合同-标准线下签章')) {
              // 浦发银行合同列表
              x.config.text = '乙方(公章)：';
            } else if (
              x.label.includes('邮储') ||
              x.label === '应收账款债权转让通知书-华泰'
            ) {
              x.config.text = '卖方： （公章）';
            } else if (x.label.includes('农行')) {
              x.config.text = '卖 方 ： （  公 章 （ 含 电 子 章 ））';
            } else if (
              x.label.includes('国内商业保理合同（万科线上版）') ||
              x.label.includes('应收账款转让清单')
            ) {
              x.config.text = '乙方(电子签章、数字签名)：';
            } else if (x.label.includes('国内商业保理合同（万科线下版）')) {
              x.config.text = '乙方(公章)：';
            } else if (
              x.label.includes('国内商业保理合同(万科版-通力电梯修订版)') ||
              x.label === '国内商业保理合同（日立电梯修订版）'
            ) {
              x.config.text = '乙方授权代表：';
            } else {
              x.config.text = '（盖章）';
            }
          });
          return {
            action: 'modal',
            modal: DragonFinancingContractModalComponent,
            params: contracts,
          };
        }
      })
    );
  }

  getTitleConfig(): any {
    return {
      hideTitle: true,
      titleName: '流程标题',
      def: '保理商风险审核',
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
    rightButtons: [
      {
        label: '拒绝',
        danger: false,
        color: 'default',
        operate: 'reject',
        click: () => {},
      },
    ],
  },
  review: {
    leftButtons: [],
    rightButtons: [
      {
        label: '拒绝',
        danger: false,
        color: 'default',
        operate: 'reject',
        click: () => {},
      },
    ],
  },
};
