/*
 * Copyright(c) 2017-2019, 深圳市链融科技股份有限公司
 * Beijing Xiwei Technology Co., Ltd.
 * All rights reserved.
 *
 * @file：CountryGradenFinancingPre
 * @summary：金地发起提单流程
 * @version: 1.0
 * **********************************************************************
 * revision             author            reason             date
 * 1.0                 hucongying        保理商预录入         2019-08-28
 * **********************************************************************
 */

import { Observable, of } from 'rxjs';
import { IFlowCustom } from './flow-custom';
import { FormGroup } from '@angular/forms';
import { XnService } from 'libs/shared/src/lib/services/xn.service';
import { XnUtils } from 'libs/shared/src/lib/common/xn-utils';
import XnFlowUtils from 'libs/shared/src/lib/common/xn-flow-utils';
import { DragonFinancingContractModalComponent } from 'libs/shared/src/lib/public/dragon-vanke/modal/dragon-asign-contract.modal';
import { map } from 'rxjs/operators';

export class JdAccountChangePre implements IFlowCustom {
  constructor(private xn: XnService) {
  }

  preShow(): Observable<any> {
    return of(null);
  }
  afterSubmitandGettip(svrConfig: any): Observable<any> {
    if (svrConfig.procedure.procedureId === '@begin') {
      this.xn.msgBox.open(false, '提交成功,下一步请复核人在【首页-待办任务】中完成【复核】的待办任务');

    } else if (svrConfig.procedure.procedureId === 'review') {
      this.xn.msgBox.open(false, ' 提交成功！请等待项目公司签署合同！');

    }
    return of(null);
  }
  postShow(svrConfig: any, form: FormGroup): Observable<any> {

    return of(null);
  }

  postGetSvrConfig(svrConfig: any): void {
  }

  preSubmit(svrConfig: any, formValue: any): Observable<any> {
    if (svrConfig.procedure.procedureId !== 'review') {
      return of(null);
    }
    const beginInfo = svrConfig.actions;
    const bankInfo = beginInfo.filter(x =>
      x.procedureId === '@begin'
    );
    const compareInfo = JSON.parse(bankInfo[bankInfo.length - 1].checkers.filter((x: any) => x.checkerId === 'debtCompare')[0].data);
    if (compareInfo.old.receiveOrg !== compareInfo.new.receiveOrg
      || compareInfo.old.receiveAccount !== compareInfo.new.receiveAccount) {
      const params: any = {
        flowId: svrConfig.flow.flowId,
        procedureId: svrConfig.procedure.procedureId,
        recordId: svrConfig.record && svrConfig.record.recordId || '',  // 重复同意时会有recordId，此时后台就不要新生成recordId了
        title: formValue.title,
        memo: formValue.memo,
        checkers: XnFlowUtils.buildSubmitCheckers(svrConfig.checkers, formValue)
      };

      // XnUtils.checkLoading(this);
      return this.xn.dragon.post('/flow/preSubmit', params)
        .pipe(map(json => {
          json.data.flowId = 'sub_jd_change'; // 供应商签署合同
          const contracts = json.data;
          contracts.forEach(element => {
            if (!element.config) {
              element.config = {
                text: ''
              };
            }
          });
          contracts.forEach(x => {
            x.config.text = '（盖章）';
          });
          return {
            action: 'modal',
            modal: DragonFinancingContractModalComponent,
            params: contracts
          };
        }));
    } else {
      return of(null);
    }
  }

  getTitleConfig(): any {
    return {
      hideTitle: true,
      titleName: '流程标题',
      def: '账号变更'
    };
  }
}
