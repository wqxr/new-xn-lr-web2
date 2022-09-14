/*************************************************************************
 * Copyright (c) 2017 - 2021 深圳市链融科技股份有限公司
 * Shenzhen Lianrong Technology Co., Ltd.
 * All rights reserved.
 *
 * @file：libs\products\abs-gj\src\lib\flow\supplier-sign.ts
 * @summary：supplier-sign.ts
 * @version: 1.0
 * *************************************************************************
 * revision             author            reason             date
 * 1.0                  DengPei           init               2021-12-02
 ***************************************************************************/

import { map } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { IFlowCustom } from './flow-custom';
import XnFlowUtils from '../../../../../shared/src/lib/common/xn-flow-utils';
import { DragonFinancingContractModalComponent } from '../../../../../shared/src/lib/public/dragon-vanke/modal/dragon-asign-contract.modal';
import { XnService } from '../../../../../shared/src/lib/services/xn.service';
import { XnUtils } from '../../../../../shared/src/lib/common/xn-utils';
import { FlowId, ProgressStep } from '../../../../../shared/src/lib/config/enum';
import { LoadingService } from 'libs/shared/src/lib/services/loading.service';

export class GjSupplierSign implements IFlowCustom {
  // XnUtils.checkLoading 中要使用 loading
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
  }

  preSubmit(svrConfig: any, formValue: any): Observable<any> {
    if (svrConfig.procedure.procedureId !== ProgressStep.Review) {
      return of(null);
    }

    const params: any = {
      flowId: svrConfig.flow.flowId,
      procedureId: svrConfig.procedure.procedureId,
      recordId: svrConfig.record && svrConfig.record.recordId || '',
      title: formValue.title,
      memo: formValue.memo,
      checkers: XnFlowUtils.buildSubmitCheckers(svrConfig.checkers, formValue)
    };

    XnUtils.checkLoading(this);
    return this.xn.dragon.post('/flow/preSubmit', params)
      .pipe(map(json => {
        json.data.flowId = FlowId.GjSupplierSign;
        const contracts = json.data;

        contracts.forEach(x => {
          if (!x.config) {
            x.config = {text: ''};
          }
          if (x.label === '国内无追索权商业保理合同（ABS版本）') {
            x.config.text = '甲方（债权人、出让人）数字签名';
          } else if (x.label.includes('应收账款转让协议书') || x.label.includes('应收账款转让登记协议')) {
            x.config.text = '甲方（出让方）';
          } else if (x.label.includes('国内无追索权商业保理合同')) {
            x.config.text = '甲方（债权人、出让人）数字签名';
          } else {
            x.config.text = '（盖章）';
          }
        });
        return {
          action: 'modal',
          modal: DragonFinancingContractModalComponent,
          params: contracts
        };
      }));
  }

  getTitleConfig(): any {
    return {
      hideTitle: true,
      titleName: '流程标题',
      def: `供应商签署合同`
    };
  }
}
