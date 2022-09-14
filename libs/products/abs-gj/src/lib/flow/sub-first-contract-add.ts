/*************************************************************************
 * Copyright (c) 2017 - 2021 深圳市链融科技股份有限公司
 * Shenzhen Lianrong Technology Co., Ltd.
 * All rights reserved.
 *
 * @file：libs\products\abs-gj\src\lib\flow\sub_first_contract_add.ts
 * @summary：sub_first_contract_add.ts
 * @version: 1.0
 * *************************************************************************
 * revision             author            reason             date
 * 1.0                  DengPei           init               2021-11-22
 ***************************************************************************/

import { Observable, of } from 'rxjs';
import { IFlowCustom } from './flow-custom';
import { XnService } from '../../../../../shared/src/lib/services/xn.service';
import { CompanyAppId, ProgressStep } from 'libs/shared/src/lib/config/enum';

export class OnceContractGroupAdd implements IFlowCustom {
  constructor(private xn: XnService) {}

  preShow(): Observable<any> {
    return of(null);
  }

  postShow(svrConfig: any): Observable<any> {
    return of(null);
  }

  postGetSvrConfig(svrConfig: any): void {
    svrConfig.checkers.map((v: any) => {
      if (v.checkerId === 'factoringAppId') {
        v.value = CompanyAppId.BLH;
      }
    });
  }

  afterSubmitandGettip(svrConfig: any): Observable<any> {
    if (svrConfig.procedure.procedureId === ProgressStep.Begin) {
      this.xn.msgBox.open(false, '提交成功！下一步请复核人在【首页 - 待办任务】中完成【复核】的待办任务。');
    } else if (svrConfig.procedure.procedureId === ProgressStep.Review) {
      const msg = svrConfig.actions.find((action) => {
        return action.recordSeq === svrConfig.record.recordSeq;
      }).checkers.find((checker) => {
        return checker.checkerId === 'contractListName';
      }).data;
      this.xn.msgBox.open(false, `新增合同组完成。合同组名称：${msg}`);
    }
    return of(null);
  }

  preSubmit(svrConfig: any, formValue: any): Observable<any> {
    return of(null);
  }

  getTitleConfig(): any {
    return {
      hideTitle: true,
      titleName: '流程标题',
      def: '新增合同组'
    };
  }
}
