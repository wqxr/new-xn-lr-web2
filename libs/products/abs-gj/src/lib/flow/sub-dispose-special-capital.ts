/*************************************************************************
 * Copyright (c) 2017 - 2021 深圳市链融科技股份有限公司
 * Shenzhen Lianrong Technology Co., Ltd.
 * All rights reserved.
 *
 * @file：libs\products\abs-gj\src\lib\flow\sub_dispose_special_capital.ts
 * @summary：sub_dispose_special_capital.ts
 * @version: 1.0
 * *************************************************************************
 * revision             author            reason             date
 * 1.0                  DengPei           init               2021-11-22
 ***************************************************************************/

import { Observable, of } from 'rxjs';
import { IFlowCustom } from './flow-custom';
import { XnService } from '../../../../../shared/src/lib/services/xn.service';
import { ProgressStep } from 'libs/shared/src/lib/config/enum';

export class DragonDisposeSpecialCapital implements IFlowCustom {
  constructor(private xn: XnService) {}

  preShow(): Observable<any> {
    return of(null);
  }

  postShow(svrConfig: any): Observable<any> {
    return of(null);
  }

  postGetSvrConfig(svrConfig: any): void {
  }

  afterSubmitandGettip(svrConfig: any): Observable<any> {
    if (svrConfig.procedure.procedureId === ProgressStep.Begin) {
      this.xn.msgBox.open(false, ['提交成功！', '下一步请复核人在【首页-待办任务】中完成【复核】的待办任务。']);
    }
    if ([ProgressStep.Review, ProgressStep.WindReview].includes(svrConfig.procedure.procedureId)) {
      this.xn.msgBox.open(false, '提交成功！');
    }
    return of(null);
  }

  preSubmit(svrConfig: any, formValue: any): Observable<any> {
    if (svrConfig.procedure.procedureId === ProgressStep.WindReview) {
      if (this.xn.user.roles.some(x => x === 'reviewer')) {
        return of(null);
      } else {
        this.xn.msgBox.open(false, '您好，您的权限不够，仅【业务复核人】可进行操作');
        return of({action: 'stop'});
      }
    }
    return of(null);
  }

  getTitleConfig(): any {
    return {
      hideTitle: true,
      titleName: '流程标题',
      def: '处置特殊资产'
    };
  }
}
