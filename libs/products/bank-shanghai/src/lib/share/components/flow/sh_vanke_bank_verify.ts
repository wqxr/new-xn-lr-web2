/*
 * Copyright(c) 2017-2019, 深圳市链融科技股份有限公司
 * Beijing Xiwei Technology Co., Ltd.
 * All rights reserved.
 *
 * @file：SupplierUploadInformationFlow
 * @summary：上海银行复核
 * @version: 1.0
 * **********************************************************************
 * revision             author            reason             date
 * 1.0                 yutianbao          增加功能1         2019-08-28
 * **********************************************************************
 */
import { LoadingService } from 'libs/shared/src/lib/services/loading.service';
import { XnService } from 'libs/shared/src/lib/services/xn.service';
import { Observable, of } from 'rxjs';
import { IFlowCustom } from './flow-custom';

export class ShVankeBankVerify implements IFlowCustom {
  constructor(private xn: XnService, private loading: LoadingService) { }

  preShow(): Observable<any> {
    return of(null);
  }

  postShow(svrConfig: any): Observable<any> {
    return of(null);
  }

  postGetSvrConfig(svrConfig: any): void { }
  afterSubmitandGettip(
    svrConfig: any,
    formValue: any,
    x: any
  ): Observable<any> {
    // console.log("svr==", svrConfig, x);
    if (svrConfig.procedure.procedureId === 'operate') {
      this.xn.msgBox.open(
        false,
        [
          '提交成功',
        ],
        () => { }
      );
    } else if (svrConfig.procedure.procedureId === 'review') {
      if (x && x.ret === 0 && x.data && x.data.backMsg) {
        this.xn.msgBox.open(false, x.data.backMsg, () => { });
      } else {
        this.xn.msgBox.open(
          false,
          [
            '复核通过。',
            `该笔交易进度可在复核列表中查看，交易id为${svrConfig.record.mainFlowId}`,
          ],
          () => { }
        );
      }
    }
    return of(null);
  }

  preSubmit(svrConfig: any, formValue: any): Observable<any> {
    if (svrConfig.procedure.procedureId === 'operate') {
      // 上海银行-提交条件
      return of(null);
    } else {
      return of(null);
    }
  }

  getTitleConfig(): any {
    return {
      hideTitle: true,
      titleName: '流程标题',
      def: '平台审核',
    };
  }
}
