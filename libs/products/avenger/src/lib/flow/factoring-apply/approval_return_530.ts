/*
 * Copyright(c) 2017-2019, 深圳市链融科技股份有限公司
 * Beijing Xiwei Technology Co., Ltd.
 * All rights reserved.
 *
 * @file：contract-input.component.ts
 * @summary：回款管理回款匹配
 * @version: 1.0
 * **********************************************************************
 * revision             author            reason             date
 * 1.0                 wq          增加功能1         2019-06-24
 * **********************************************************************
 */

import {XnService} from 'libs/shared/src/lib/services/xn.service';
import {Observable, of} from 'rxjs';
import {IFlowCustom} from '../flow-custom';
import {LoadingService} from 'libs/shared/src/lib/services/loading.service';

export class AvengerApprovalreturn implements IFlowCustom {
    constructor(private xn: XnService, private loading: LoadingService) {
    }

    preShow(svrConfig: any): Observable<any> {
        return of(null);
    }

    postShow(svrConfig: any): Observable<any> {
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
            def: '万科供应商发起流程'
        };
    }
}
