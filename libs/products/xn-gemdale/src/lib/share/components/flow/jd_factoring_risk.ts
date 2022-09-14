/*
 * Copyright(c) 2017-2019, 深圳市链融科技股份有限公司
 * Beijing Xiwei Technology Co., Ltd.
 * All rights reserved.
 *
 * @file：BgyFactoringRisk
 * @summary：金地-保理商风险审核
 * @version: 1.0
 * **********************************************************************
 * revision             author            reason             date
 * 1.0                hucongying       金地数据对接      2020-11-04
 * **********************************************************************
 */

import { Observable, of } from 'rxjs';
import { IFlowCustom } from './flow-custom';
import { XnService } from 'libs/shared/src/lib/services/xn.service';
import { LoadingService } from 'libs/shared/src/lib/services/loading.service';

export class JdFactoringRisk implements IFlowCustom {
    constructor(private xn: XnService, private loading: LoadingService) {
    }

    preShow(): Observable<any> {
        return of(null);
    }

    postShow(svrConfig: any): Observable<any> {
        return of(null);
    }
    afterSubmitandGettip(svrConfig: any, formValue: any, x: any): Observable<any> {
        if (svrConfig.procedure.procedureId === 'operate') {
            this.xn.msgBox.open(false, ['保理商风险审查通过!', '下一步请项目公司确认应收账款金额',
            `该笔交易进度可在【台账】中查看，交易id为${svrConfig.record.mainFlowId}`], () => {
            });
        }
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
            def: '保理商风险审核'
        };
    }
}
