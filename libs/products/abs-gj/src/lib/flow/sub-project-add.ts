/*************************************************************************
 * Copyright (c) 2017 - 2021 深圳市链融科技股份有限公司
 * Shenzhen Lianrong Technology Co., Ltd.
 * All rights reserved.
 *
 * @file：libs\products\abs-gj\src\lib\flow\sub_project_add.ts
 * @summary：sub_project_add.ts
 * @version: 1.0
 * *************************************************************************
 * revision             author            reason             date
 * 1.0                  DengPei           init               2021-11-22
 ***************************************************************************/

import { map } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { IFlowCustom } from './flow-custom';
import XnFlowUtils from '../../../../../shared/src/lib/common/xn-flow-utils';
import { DragonFinancingContractModalComponent } from '../../../../../shared/src/lib/public/dragon-vanke/modal/dragon-asign-contract.modal';
import { XnService } from '../../../../../shared/src/lib/services/xn.service';
import { XnUtils } from '../../../../../shared/src/lib/common/xn-utils';
import { LoadingService } from 'libs/shared/src/lib/services/loading.service';
import { ProgressStep } from 'libs/shared/src/lib/config/enum/abs-gj.enum';

export class SubProjectAdd implements IFlowCustom {
  // XnUtils.checkLoading 中要使用 loading
  constructor(private xn: XnService, private loading: LoadingService) {}

  preShow(): Observable<any> {
    return of(null);
  }

  postShow(svrConfig: any): Observable<any> {
    return of(null);
  }

  postGetSvrConfig(svrConfig: any): void {}

  afterSubmitandGettip(svrConfig: any): Observable<any> {
    return of(null);
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
        console.log(json, 'pre_submit');
        json.data.flowId = 'sub_project_add';
        const contracts = json.data;
        contracts.forEach(element => {
          if (!element.config) {
            element.config = {
              text: ''
            };
          }
        });
        contracts.forEach(x => {
          if (x.label === '应收账款转让通知之补充说明') {
            x.config.text = '项目公司(盖章)';
          } else if (x.label === '债权转让及账户变更通知的补充说明' || x.label === '应收账款转让登记协议') {
            x.config.text = '甲方（出让方）';
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
      def: '项目公司签署补充协议'
    };
  }
}
