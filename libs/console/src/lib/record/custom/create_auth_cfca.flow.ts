/*
 * Copyright(c) 2017-2019, 深圳市链融科技股份有限公司
 * All rights reserved.
 *
 * @file：libs\console\src\lib\record\custom\create_auth_cfca.flow.ts
 * @summary：cfca流程处理
 * @version: 1.0
 * **********************************************************************
 * revision             author            reason             date
 * 1.0                linqiaonan         cfca流程处理       2021-07-21
 * **********************************************************************
 */
import { IFlowCustom } from '../flow.custom';
import { XnService } from 'libs/shared/src/lib/services/xn.service';
import { LoadingService } from 'libs/shared/src/lib/services/loading.service';
import { Observable, of } from 'rxjs';


export class CreatAuthCfcaFlow implements IFlowCustom {

  constructor(private xn: XnService, private loading: LoadingService) {
  }

  preShow(): Observable<any> {
    return of(null);
  }

  postShow(svrConfig: any): Observable<any> {
    return of(null);
  }

  postGetSvrConfig(svrConfig: any): void {
  }

  preSubmit(svrConfig: any, formValue: any): Observable<any> {
    // 初审节点 procedureId = "operate" 需要判断OrgCity对象是否为空
    if (svrConfig.procedure.procedureId === 'operate') {
      const { first, second } = JSON.parse(formValue.orgCity)
      console.log('Orgvalue', first, second, formValue.orgCity, formValue)
      if (first === '' || second === '') {
        this.xn.msgBox.open(false, '请选择省市');
        return of({ action: 'stop' })
      } else {
        return of(null);
      }
    } else {
      return of(null);
    }
  }

  getTitleConfig(): any {
    return {
      hideTitle: true,
      titleName: '流程标题',
      def: '默认标题'
    };
  }
}
