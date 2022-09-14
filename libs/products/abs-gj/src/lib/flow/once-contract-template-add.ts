/*************************************************************************
 * Copyright (c) 2017 - 2021 深圳市链融科技股份有限公司
 * Shenzhen Lianrong Technology Co., Ltd.
 * All rights reserved.
 *
 * @file：libs\products\abs-gj\src\lib\flow\once_contract_template_add.ts
 * @summary：once_contract_template_add.ts
 * @version: 1.0
 * *************************************************************************
 * revision             author            reason             date
 * 1.0                  DengPei           init               2021-11-22
 ***************************************************************************/

import { Observable, of } from 'rxjs';
import { IFlowCustom } from './flow-custom';

export class DragonOnceContractTemplateAdd implements IFlowCustom {
  constructor() {}

  preShow(): Observable<any> {
    return of(null);
  }

  postShow(svrConfig: any): Observable<any> {
    return of(null);
  }

  postGetSvrConfig(svrConfig: any): void {
  }

  afterSubmitandGettip(svrConfig: any): Observable<any> {
    return of(null);
  }

  preSubmit(svrConfig: any, formValue: any): Observable<any> {
    return of(null);
  }

  getTitleConfig(): any {
    return {
      hideTitle: true,
      titleName: '流程标题',
      def: '新增合同模板'
    };
  }
}
