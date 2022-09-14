/*************************************************************************
 * Copyright (c) 2017 - 2021 深圳市链融科技股份有限公司
 * Shenzhen Lianrong Technology Co., Ltd.
 * All rights reserved.
 *
 * @file：libs\products\abs-gj\src\lib\flow\book-stop.ts
 * @summary：book-stop.ts
 * @version: 1.0
 * *************************************************************************
 * revision             author            reason             date
 * 1.0                  DengPei           init               2021-12-02
 ***************************************************************************/

import { Observable, of } from 'rxjs';
import { IFlowCustom } from './flow-custom';
import { FormGroup } from '@angular/forms';

export class BookStop implements IFlowCustom {
  constructor() {}

  preShow(): Observable<any> {
    return of(null);
  }

  postShow(svrConfig: any, mainForm: FormGroup): Observable<any> {
    return of(null);
  }

  postGetSvrConfig(svrConfig: any): void {
  }

  preSubmit(svrConfig: any, formValue: any): Observable<any> {
    return of(null);
  }

  afterSubmitandGettip(svrConfig: any,): Observable<any> {
    return of(null);
  }

  getTitleConfig(): any {
    return {
      hideTitle: true,
      titleName: '流程标题',
      def: '中止'
    };
  }
}
