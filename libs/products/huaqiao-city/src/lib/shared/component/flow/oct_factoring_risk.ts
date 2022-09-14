/*
 * Copyright(c) 2017-2019, 深圳市链融科技股份有限公司
 * Beijing Xiwei Technology Co., Ltd.
 * All rights reserved.
 *
 * @file：SupplierUploadInformationFlow
 * @summary：平台审核
 * @version: 1.0
 * **********************************************************************
 * revision             author            reason             date
 * 1.0                 wangqing          增加功能1         2019-08-28
 * **********************************************************************
 */

import { Observable, of } from 'rxjs';
import { IFlowCustom } from './flow-custom';
import { XnService } from 'libs/shared/src/lib/services/xn.service';
import { LoadingService } from 'libs/shared/src/lib/services/loading.service';

export class OctFactoringRisk implements IFlowCustom {
    constructor(private xn: XnService, private loading: LoadingService) {
    }

    preShow(): Observable<any> {
        return of(null);
    }

    postShow(svrConfig: any): Observable<any> {
        return of(null);
    }
    afterSubmitandGettip(svrConfig: any, formValue: any, x: any): Observable<any> {
        // console.log("s==", svrConfig, x);
        if (svrConfig.procedure.procedureId === 'operate') {
            this.xn.msgBox.open(false, ['保理商风险审查通过，下一步为供应商签署合同。', `该笔交易进度可在交易列表中查看，交易id为${svrConfig.record.mainFlowId}`], () => {
            });
        } else if (svrConfig.procedure.procedureId === 'review') {
            if (x && x.ret === 0 && x.data && x.data.backMsg) {
                this.xn.msgBox.open(false, x.data.backMsg, () => {

                });
            } else {
                this.xn.msgBox.open(false, ['保理商风险审查通过，下一步为供应商签署合同。', `该笔交易进度可在交易列表中查看，交易id为${svrConfig.record.mainFlowId}`], () => {
                });
            }
        }
        return of(null);
    }
    postGetSvrConfig(svrConfig: any): void {
        return svrConfig;
    }

    preSubmit(svrConfig: any, formValue: any): Observable<any> {
        return of(null);
    }

    getTitleConfig(): any {
        return {
            hideTitle: true,
            titleName: '流程标题',
            def: '保理商风险审核'
        };
    }
}
