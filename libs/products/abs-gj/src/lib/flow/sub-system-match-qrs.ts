/*************************************************************************
 * Copyright (c) 2017 - 2021 深圳市链融科技股份有限公司
 * Shenzhen Lianrong Technology Co., Ltd.
 * All rights reserved.
 *
 * @file：libs\products\abs-gj\src\lib\flow\sub_system_match_qrs.ts
 * @summary：sub_system_match_qrs.ts
 * @version: 1.0
 * *************************************************************************
 * revision             author            reason             date
 * 1.0                  DengPei           init               2021-11-22
 ***************************************************************************/
import { Observable, of } from 'rxjs';
import { IFlowCustom } from './flow-custom';
import * as lodashall from 'lodash';
import { XnService } from '../../../../../shared/src/lib/services/xn.service';
import { ProgressStep } from 'libs/shared/src/lib/config/enum/abs-gj.enum';

export class DragonSystemMatchVerify implements IFlowCustom {
  constructor(private xn: XnService) {}

  preShow(): Observable<any> {
    return of(null);
  }

  postShow(svrConfig: any): Observable<any> {
    return of(null);
  }

  postGetSvrConfig(svrConfig: any): void {}

  preSubmit(svrConfig: any, formValue: any): Observable<any> {
    if (svrConfig.procedure.procedureId === ProgressStep.Begin) {
      const mainlist = JSON.parse(formValue.systemList);
      const isOk = lodashall.some(mainlist, ['isMatching', 0]); // 判断影印件是否全部匹配
      const alert = '此列表存在【未匹配】的影印件';
      if (isOk) {
        this.xn.msgBox.open(false, alert);
        return of({action: 'stop'});
      } else {
        return of(null);
      }
    } else {
      return of(null);
    }
  }

  afterSubmitandGettip(svrConfig: any): Observable<any> {
    if (svrConfig.procedure.procedureId === ProgressStep.Begin) {
      this.xn.msgBox.open(false, '提交成功！下一步请财务复核人在【首页 - 待办任务】中完成【复核】的待办任务。', () => {
      });
    } else if (svrConfig.procedure.procedureId === ProgressStep.Review) {
      this.xn.msgBox.open(false, '提交成功！', () => {
      });
    }
    return of(null);
  }

  getTitleConfig(): any {
    return {
      hideTitle: true,
      titleName: '流程标题',
      def: '系统匹配付款确认书'
    };
  }
}
