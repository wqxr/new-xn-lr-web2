/*************************************************************************
 * Copyright (c) 2017 - 2021 深圳市链融科技股份有限公司
 * Shenzhen Lianrong Technology Co., Ltd.
 * All rights reserved.
 *
 * @file：libs\products\abs-gj\src\lib\flow\sub_qrs_manual_verify.ts
 * @summary：sub_qrs_manual_verify.ts
 * @version: 1.0
 * *************************************************************************
 * revision             author            reason             date
 * 1.0                  DengPei           init               2021-11-22
 ***************************************************************************/

import { Observable, of } from 'rxjs';
import { IFlowCustom } from './flow-custom';
import { XnService } from '../../../../../shared/src/lib/services/xn.service';
import { ProgressStep } from 'libs/shared/src/lib/config/enum/abs-gj.enum';

export class DragonQrsDownloadManualVerify implements IFlowCustom {
  constructor(private xn: XnService) {}

  preShow(): Observable<any> {
    return of(null);
  }

  postShow(svrConfig: any): Observable<any> {
    return of(null);
  }

  postGetSvrConfig(svrConfig: any): void {}

  afterSubmitandGettip(svrConfig: any): Observable<any> {
    if (svrConfig.procedure.procedureId === ProgressStep.Begin) {
      this.xn.msgBox.open(false, '提交成功！请等待复核人完成复核。');
    } else if (svrConfig.procedure.procedureId === ProgressStep.Review) {
      this.xn.msgBox.open(false, '复核成功，点击确定返回【下载付款确认书列表】。', () => {
        this.xn.router.navigate(['/abs-gj/confirmation-download']);
      });
    } else {
      return of(null);
    }
  }

  preSubmit(svrConfig: any, formValue: any): Observable<any> {
    return of(null);
  }

  getTitleConfig(): any {
    return {
      hideTitle: true,
      titleName: '流程标题',
      def: '发起人工校验'
    };
  }
}
