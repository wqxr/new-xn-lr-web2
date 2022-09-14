/*************************************************************************
 * Copyright (c) 2017 - 2021 深圳市链融科技股份有限公司
 * Shenzhen Lianrong Technology Co., Ltd.
 * All rights reserved.
 *
 * @file：libs\products\abs-gj\src\lib\flow\financing-pre.ts
 * @summary：financing-pre.ts
 * @version: 1.0
 * *************************************************************************
 * revision             author            reason             date
 * 1.0                  DengPei           init               2021-12-01
 ***************************************************************************/
import { FormGroup } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { IFlowCustom } from './flow-custom';

export class GJFinancingPre implements IFlowCustom {
  constructor() {}

  preShow(): Observable<any> {
    return of(null);
  }

  postShow(svrConfig: any, form: FormGroup): Observable<any> {
    return of(null);
  }

  postGetSvrConfig(svrConfig: any): void {
  }

  preSubmit(svrConfig: any, formValue: any): Observable<any> {
    return of(null);
  }

  afterSubmitandGettip(svrConfig: any): Observable<any> {
    return of(null);
  }

  getTitleConfig(): any {
    return {
      hideTitle: true,
      titleName: '流程标题',
      def: '保理商提单预录入'
    };
  }
}
