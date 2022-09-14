/*************************************************************************
* Copyright (c) 2017 - 2021 深圳市链融科技股份有限公司
* Shenzhen Lianrong Technology Co., Ltd.
* All rights reserved.
*
* @file：libs\products\bank-shanghai\src\lib\share\components\flow\sub_sh_prattwhitney_input.ts
* @summary：普惠记账簿开户申请流程配置
* @version: 1.0
* *************************************************************************
* revision             author            reason             date
* 1.0                 hucongying          init          2021-07-02
***************************************************************************/
import { Observable, of } from 'rxjs';
import { IFlowCustom } from './flow-custom';
import { FormGroup, } from '@angular/forms';
import { LoadingService } from 'libs/shared/src/lib/services/loading.service';
import { XnService } from 'libs/shared/src/lib/services/xn.service';
import { ProcduresIdEnum } from 'libs/shared/src/lib/config/enum';

export class SubShOctPrattwhitneyInput implements IFlowCustom {
  constructor(private xn: XnService, private loading: LoadingService) {
  }

  preShow(): Observable<any> {
    return of(null);
  }

  /**
   * submit提交后提示
   * @param svrConfig
   * @returns
   */
  afterSubmitandGettip(svrConfig: any): Observable<any> {
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

  getTitleConfig(): any {
    return {
      hideTitle: true,
      titleName: '流程标题',
      def: '普惠记账簿开户申请'
    };
  }
}
