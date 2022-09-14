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

import { XnService } from 'libs/shared/src/lib/services/xn.service';
import { Observable, of } from 'rxjs';
import { LoadingService } from 'libs/shared/src/lib/services/loading.service';
import { IFlowCustom } from './flow-custom';
import XnFlowUtils from 'libs/shared/src/lib/common/xn-flow-utils';
import { XnUtils } from 'libs/shared/src/lib/common/xn-utils';
import { map } from 'rxjs/operators';
import { DragonFinancingContractModalComponent } from 'libs/shared/src/lib/public/dragon-vanke/modal/dragon-asign-contract.modal';
import * as _ from 'lodash';
export class VankeFinancingSign implements IFlowCustom {
  constructor(private xn: XnService, private loading: LoadingService) {}

  preShow(): Observable<any> {
    return of(null);
  }

  postShow(svrConfig: any): Observable<any> {
    return of(null);
  }
  afterSubmitandGettip(svrConfig: any): Observable<any> {
    return of(null);
  }
  postGetSvrConfig(svrConfig: any): void {
    return svrConfig;
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
        json.data.flowId = 'vanke_financing_sign';
        const contracts = json.data;
        contracts.forEach((element) => {
          if (!element.config) {
            element.config = {
              text: '',
            };
          }
        });
        contracts.forEach((x) => {
          const getText = _.find(signText, { label: x.label });
          if (!getText) {
            x.config.text = '（盖章）';
          } else {
            x.config.text = getText.text;
          }
        });
        // contracts.forEach(x => {
        //     if (x.label === '国内商业保理合同-万科香纳工行再保理') {
        //         x.config.text = '（公章/电子签章）';
        //     } else if (x.label === '国内无追索权商业保理合同-万科香纳工行再保理') {
        //         x.config.text = '甲方（债权人、出让人）数字签名';
        //     } else if (x.label === '应收账款转让协议书-万科香纳工行再保理' || x.label.includes('应收账款转让登记协议')) {
        //         x.config.text = '甲方（电子签章、数字签名）';
        //     } else {
        //         x.config.text = '（盖章）';
        //     }
        // });
        return {
          action: 'modal',
          modal: DragonFinancingContractModalComponent,
          params: contracts,
        };
      })
    );
  }

  getTitleConfig(): any {
    return {
      hideTitle: true,
      titleName: '流程标题',
      def: `供应商签署合同`,
    };
  }
}
const signText = [
  { label: '国内商业保理合同-万科香纳工行再保理', text: '（公章/电子签章）' },
  {
    label: '应收账款转让协议书-万科香纳工行再保理',
    text: '甲方（电子签章、数字签名）',
  },
  {
    label: '应收账款转让登记协议-万科香纳工行再保理',
    text: '甲方（电子签章、数字签名）',
  },
  {
    label: '国内无追索权商业保理合同-万科香纳工行再保理',
    text: '甲方（债权人、出让人）数字签名',
  },
  {
    label: '国内无追索权商业保理合同-万科香纳工行再保理',
    text: '甲方（债权人、出让人）数字签名',
  },
];
