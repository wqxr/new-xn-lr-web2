/*************************************************************************
 * Copyright (c) 2017 - 2021 深圳市链融科技股份有限公司
 * Shenzhen Lianrong Technology Co., Ltd.
 * All rights reserved.
 *
 * @file：libs\products\abs-gj\src\lib\flow\sub_factoring_verify_retreat.ts
 * @summary：sub_factoring_verify_retreat.ts
 * @version: 1.0
 * *************************************************************************
 * revision             author            reason             date
 * 1.0                  DengPei           init               2021-11-22
 ***************************************************************************/

import { XnService } from 'libs/shared/src/lib/services/xn.service';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { IFlowCustom } from './flow-custom';
import {
  SingleSearchListModalComponent,
  SingleListParamInputModel
} from 'libs/shared/src/lib/public/dragon-vanke/modal/single-searchList-modal.component';
import { ProgressStep } from 'libs/shared/src/lib/config/enum/abs-gj.enum';

export class SubFactoringVerifyRetreat implements IFlowCustom {
  constructor(private xn: XnService) {
  }

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
      def: '财务确认'
    };
  }
}
