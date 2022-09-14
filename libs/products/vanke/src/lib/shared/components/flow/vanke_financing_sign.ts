import { includes } from 'lodash';
/*
 * Copyright(c) 2017-2019, 深圳市链融科技股份有限公司
 * Beijing Xiwei Technology Co., Ltd.
 * All rights reserved.
 *
 * @file：SupplierUploadInformationFlow
 * @summary:供应商签署合同
 * @version: 1.0
 * **********************************************************************
 * revision             author            reason             date
 * 1.0                 wangqing          增加功能1         2019-08-28
 * **********************************************************************
 */

import { Observable, of } from 'rxjs';
import { IFlowCustom } from './flow-custom';
import { map } from 'rxjs/operators';
import { XnUtils } from 'libs/shared/src/lib/common/xn-utils';
import { XnService } from 'libs/shared/src/lib/services/xn.service';
import { LoadingService } from 'libs/shared/src/lib/services/loading.service';
import { LocalStorageService } from 'libs/shared/src/lib/services/local-storage.service';
import XnFlowUtils from 'libs/shared/src/lib/common/xn-flow-utils';
import { DragonFinancingContractModalComponent } from 'libs/shared/src/lib/public/dragon-vanke/modal/dragon-asign-contract.modal';
import { PointService } from 'libs/shared/src/lib/services/point.service';
import { ViewButtonType } from 'libs/shared/src/lib/config/enum';
export class VankeFinancingSign implements IFlowCustom {
  constructor(
    private xn: XnService,
    private loading: LoadingService,
    private localStorageService: LocalStorageService,
    private pointService: PointService,
  ) { }

  preShow(): Observable<any> {
    return of(null);
  }

  postShow(svrConfig: any): Observable<any> {
    return of(null);
  }

  postGetSvrConfig(svrConfig: any): void { }
  afterSubmitandGettip(svrConfig: any): Observable<any> {
    if (svrConfig.procedure.procedureId === 'operate') {
      this.xn.msgBox.open(false, [
        '提交成功',
        '下一步请复核人在【首页-待办任务】中完成【复核】的待办任务',
      ]);
    } else if (svrConfig.procedure.procedureId === 'review') {
      if (
        this.localStorageService.caCheMap.get('vanke_financing_sign')
          .onLineStatus
      ) {
        // 线上签署
        this.xn.msgBox.open(false, [
          '签署合同成功！',
          '本笔交易操作已全部完成！请等待放款！',
          `该笔交易进度可在左侧导航栏【我的交易】-【台账】-【已完成】查看，交易id为${svrConfig.record.mainFlowId}`,
        ]);
      } else {
        // 线下签署
        this.xn.msgBox.open(false, [
          '本笔交易需线下签署合同！请将已签署合同的影印件交给保理商！',
          '本笔交易操作已全部完成，请等待放款！',
          `该笔交易进度可在左侧导航栏【我的交易】-【台账】-【已完成】查看，交易id为${svrConfig.record.mainFlowId}`,
        ]);
      }
      this.pointService.setPoint({itemName: ViewButtonType.SignContractReview, mainFlowId: svrConfig.record.mainFlowId})
      this.localStorageService.caCheMap.delete('vanke_financing_sign');
    }
    return of(null);
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
          json.data.flowId = 'vanke_financing_sign';
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
              x.label==='国内商业保理合同-线上线下合同万科通用版-无特定到期日版'||
              x.label === '国内商业保理合同-线上线下合同万科通用版-邮储版' ||
              x.label === '国内商业保理合同-线上线下合同-青岛海尔开利修订版'
            ) {
              x.config.text = '乙方（公章/电子签章）';
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
              (x.label !== '应收账款债权转让通知书-招行' &&
                x.label !== '应收账款债权转让通知书-民生银行')
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
            } else if (x.label.includes('邮储')) {
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
      def: '供应商签署合同',
    };
  }
}
