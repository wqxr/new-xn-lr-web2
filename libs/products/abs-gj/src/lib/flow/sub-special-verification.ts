/*************************************************************************
 * Copyright (c) 2017 - 2021 深圳市链融科技股份有限公司
 * Shenzhen Lianrong Technology Co., Ltd.
 * All rights reserved.
 *
 * @file：libs\products\abs-gj\src\lib\flow\sub_special_verification.ts
 * @summary：sub_special_verification.ts
 * @version: 1.0
 * *************************************************************************
 * revision             author            reason             date
 * 1.0                  DengPei           init               2021-11-22
 ***************************************************************************/
import { FormGroup } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { IFlowCustom } from './flow-custom';
import { XnService } from '../../../../../shared/src/lib/services/xn.service';
import { ProgressStep } from 'libs/shared/src/lib/config/enum/abs-gj.enum';

export class SubSpecialVerfication implements IFlowCustom {
  constructor(private xn: XnService) {}

  preShow(): Observable<any> {
    return of(null);
  }

  afterSubmitandGettip(svrConfig: any): Observable<any> {
    if (svrConfig.procedure.procedureId === ProgressStep.Operate) {
      this.xn.msgBox.open(false, '提交成功,下一步请客户经理复核人在【首页-待办任务】中完成【复核】的待办任务');

    } else if (svrConfig.procedure.procedureId === ProgressStep.Review) {
      this.xn.msgBox.open(false, '提交成功！请风险复核人在【首页-待办任务】中完成【风险复核】的待办任务。');

    } else if (svrConfig.procedure.procedureId === ProgressStep.RiskReview) {
      this.xn.msgBox.open(false, '提交成功！请高管复核人在【首页-待办任务】中完成【高管复核】的待办任务。');

    } else if (svrConfig.procedure.procedureId === ProgressStep.WindReview) {
      this.xn.msgBox.open(false, '提交成功！已完成特殊事项审批任务。');

    }
    return of(null);

  }

  postShow(svrConfig: any, form: FormGroup): Observable<any> {
    return of(null);
  }

  postGetSvrConfig(svrConfig: any): void {}

  preSubmit(svrConfig: any, formValue: any): Observable<any> {
    return of(null);
  }

  getTitleConfig(): any {
    return {
      hideTitle: true,
      titleName: '流程标题',
      def: '特殊事项保理审核'
    };
  }
}
