/*
 * Copyright(c) 2017-2019, 深圳市链融科技股份有限公司
 * Beijing Xiwei Technology Co., Ltd.
 * All rights reserved.
 *
 * @file：SubFactoringAgileVerifyRetreat
 * @summary：雅居乐-星顺-退单流程-财务确认
 * @version: 1.0
 * **********************************************************************
 * revision             author            reason             date
 * 1.0                hucongying       雅居乐改造项目       2021-02-02
 * **********************************************************************
 */

import { XnService } from 'libs/shared/src/lib/services/xn.service';
import { Observable, of } from 'rxjs';
import { LoadingService } from 'libs/shared/src/lib/services/loading.service';
import { IFlowCustom } from './flow-custom';

export class SubFactoringAgileVerifyRetreat implements IFlowCustom {
    constructor(private xn: XnService, private loading: LoadingService) {
    }

    preShow(): Observable<any> {
        return of(null);
    }

    postShow(svrConfig: any): Observable<any> {
        return of(null);
    }

    postGetSvrConfig(svrConfig: any): void {
    }
    afterSubmitandGettip(svrConfig: any,): Observable<any> {
            return of(null);
    }

    preSubmit(svrConfig: any, formValue: any): Observable<any> {
        return of(null);

    }

    getTitleConfig(): any {
        return {
            hideTitle: true,
            titleName: '流程标题',
            def: '财务确认'
        };
    }
}
