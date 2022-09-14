/*************************************************************************
 * Copyright (c) 2017 - 2021 深圳市链融科技股份有限公司
 * Shenzhen Lianrong Technology Co., Ltd.
 * All rights reserved.
 *
 * @file：libs\products\vanke\src\lib\shared\components\flow\vanke_financing_pre.ts
 * @summary：万科提单保理商预录入
 * @version: 1.0
 * *************************************************************************
 * revision             author            reason             date
 * 1.0                 hucongying          init           2021-08-24
 ***************************************************************************/

import { FormGroup, FormControl, Validators } from '@angular/forms';
import { LoadingService } from 'libs/shared/src/lib/services/loading.service';
import { XnService } from 'libs/shared/src/lib/services/xn.service';
import { Observable, of } from 'rxjs';
import { IFlowCustom } from './flow-custom';
import { IsPreTrade } from 'libs/shared/src/lib/config/enum';

export class VankeFinancingPre implements IFlowCustom {
  constructor(private xn: XnService, private loading: LoadingService) {}

  preShow(): Observable<any> {
    return of(null);
  }
  afterSubmitandGettip(svrConfig: any): Observable<any> {
    return of(null);
  }
  postShow(svrConfig: any, form: FormGroup): Observable<any> {
    return of(null);
  }

  postGetSvrConfig(svrConfig: any): void {}

  preSubmit(svrConfig: any, formValue: any): Observable<any> {
    const isVirtual = formValue.accountInfo
      ? JSON.parse(formValue.accountInfo)?.isVirtual
      : '';
    if (svrConfig.isPreTrade === IsPreTrade.YES && isVirtual === false) {
      return of({ action: 'isVirtualStop' });
    } else {
      return of({ action: null });
    }
  }

  getTitleConfig(): any {
    return {
      hideTitle: true,
      titleName: '流程标题',
      def: '保理商预录入',
    };
  }
}
