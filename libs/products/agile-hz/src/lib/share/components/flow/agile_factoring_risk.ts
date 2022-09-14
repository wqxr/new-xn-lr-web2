/*
 * Copyright(c) 2017-2019, 深圳市链融科技股份有限公司
 * Beijing Xiwei Technology Co., Ltd.
 * All rights reserved.
 *
 * @file：AgileFactoringRisk
 * @summary：雅居乐-恒泽-保理商风险审核
 * @version: 1.0
 * **********************************************************************
 * revision             author            reason             date
 * 1.0                hucongying       雅居乐改造项目      2021-01-29
 * **********************************************************************
 */

import { Observable, of } from 'rxjs';
import { IFlowCustom } from './flow-custom';
import { XnService } from 'libs/shared/src/lib/services/xn.service';
import { LoadingService } from 'libs/shared/src/lib/services/loading.service';

export class AgileFactoringRisk implements IFlowCustom {
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
            this.xn.msgBox.open(false, ['提交成功!', '下一步请风险复核人在【首页-待办任务】中完成【复核】的待办任务'], () => {
            });
        } else if (svrConfig.procedure.procedureId === 'review') {
            if (x && x.ret === 0 && x.data && x.data.backMsg) {
                this.xn.msgBox.open(false, x.data.backMsg, () => {

                });
            } else {
                this.xn.msgBox.open(false, ['保理商风险审查通过，下一步为供应商签署合同。', 
                `该笔交易进度可在【台账】中查看，交易id为${svrConfig.record.mainFlowId}`], () => {
                });
            }
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
