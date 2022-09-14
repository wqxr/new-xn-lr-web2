/*************************************************************************
 * Copyright (c) 2017 - 2021 深圳市链融科技股份有限公司
 * Shenzhen Lianrong Technology Co., Ltd.
 * All rights reserved.
 *
 * @file：libs\products\abs-gj\src\lib\flow\sub_change_verification.ts
 * @summary：sub_change_verification.ts
 * @version: 1.0
 * *************************************************************************
 * revision             author            reason             date
 * 1.0                  DengPei           init               2021-11-22
 ***************************************************************************/
import { FormGroup } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { IFlowCustom } from './flow-custom';
import { XnService } from '../../../../../shared/src/lib/services/xn.service';
import { ProgressStep } from 'libs/shared/src/lib/config/enum';

export class SubChangeVerification implements IFlowCustom {
  constructor(private xn: XnService) {}

  preShow(): Observable<any> {
    return of(null);
  }

  afterSubmitandGettip(svrConfig: any): Observable<any> {
    if (svrConfig.procedure.procedureId === ProgressStep.Operate) {
      this.xn.msgBox.open(false, '提交成功,下一步请客户经理复核人在【首页-待办任务】中完成【复核】的待办任务');
    }
    if (svrConfig.procedure.procedureId === ProgressStep.Review) {
      this.xn.msgBox.open(false, '提交成功！请风险复核人在【首页-待办任务】中完成【风险复核】的待办任务。');
    }
    if ([ProgressStep.RiskReview, ProgressStep.WindReview, ProgressStep.Review].includes(svrConfig.procedure.procedureId)) {
      this.xn.msgBox.open(false, '提交成功！已完成账号变更流程。');
    }
    return of(null);
  }

  postShow(svrConfig: any, form: FormGroup): Observable<any> {
    return of(null);
  }

  postGetSvrConfig(svrConfig: any): void {}

  preSubmit(svrConfig: any, formValue: any): Observable<any> {
    if (svrConfig.procedure.procedureId === ProgressStep.Operate) {
      const contractFile = formValue.pdfProjectFiles;
      const correctFile = formValue.correctFile;
      let alert = '';
      try {

        if (contractFile === '') {
          alert = '付款确认书文件未上传\n，';
        } else {
          alert = '';
        }
        if (correctFile === '') {
          alert = alert + '项目公司更正函文件未上传\n，';
        } else {
          alert = '';
        }
        if (alert !== '') {
          this.xn.msgBox.open(false, alert + '无法提交');
          return of({
            action: 'stop',
          });
        } else {
          return of(null);
        }
      } catch (e) {
        console.log('msg:', e);
      }
    } else {
      return of(null);
    }
  }

  getTitleConfig(): any {
    return {
      hideTitle: true,
      titleName: '流程标题',
      def: '变更流程保理审核'
    };
  }
}
