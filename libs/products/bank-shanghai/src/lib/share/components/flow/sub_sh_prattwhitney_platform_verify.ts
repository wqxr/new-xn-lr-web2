/*************************************************************************
* Copyright (c) 2017 - 2021 深圳市链融科技股份有限公司
* Shenzhen Lianrong Technology Co., Ltd.
* All rights reserved.
*
* @file：libs\products\bank-shanghai\src\lib\share\components\flow\sub_sh_prattwhitney_platform_verify.ts
* @summary：平台审核普惠记账簿开户申请流程配置
* @version: 1.0
* *************************************************************************
* revision             author            reason             date
* 1.0                 hucongying          init          2021-07-21
***************************************************************************/
import { Observable, of } from 'rxjs';
import { IFlowCustom } from './flow-custom';
import { FormGroup, } from '@angular/forms';
import { LoadingService } from 'libs/shared/src/lib/services/loading.service';
import { XnService } from 'libs/shared/src/lib/services/xn.service';
import { ProcduresIdEnum } from 'libs/shared/src/lib/config/enum';

export class SubShPrattwhitneyPlatformVerify implements IFlowCustom {
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
    const procedureId = svrConfig.procedure.procedureId || '';
    switch (procedureId) {
      // 初审
      case ProcduresIdEnum.OPERATE:
        this.xn.msgBox.open(false, ['提交成功', '下一步请复核人在【待办列表-】中完成【复核】的待办任务']);
        break;
      // 经办
      case ProcduresIdEnum.BEGIN:
        this.xn.msgBox.open(false, ['提交成功', '下一步请复核人在【待办列表-】中完成【复核】的待办任务']);
        break;
      // 复核
      case ProcduresIdEnum.REVIEW:
        this.xn.msgBox.open(false, ['复核通过。', `请耐心等待上海银行审核`]);
        break;

      default:
        break;
    }
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
      def: '平台审核普惠记账簿开户申请'
    };
  }
}
