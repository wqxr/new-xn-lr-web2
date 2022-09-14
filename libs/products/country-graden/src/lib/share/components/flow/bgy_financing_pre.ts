
/*
 * Copyright(c) 2017-2019, 深圳市链融科技股份有限公司
 * Beijing Xiwei Technology Co., Ltd.
 * All rights reserved.
 *
 * @file：CountryGradenFinancingPre
 * @summary：碧桂园发起提单流程
 * @version: 1.0
 * **********************************************************************
 * revision             author            reason             date
 * 1.0                 hucongying        保理商预录入         2019-08-28
 * **********************************************************************
 */

import { Observable, of } from 'rxjs';
import { IFlowCustom } from './flow-custom';
import { FormGroup } from '@angular/forms';
import { XnService } from 'libs/shared/src/lib/services/xn.service';

export class CountryGradenFinancingPre implements IFlowCustom {
    constructor(private xn: XnService) {
    }

    preShow(): Observable<any> {
        return of(null);
    }
    afterSubmitandGettip(svrConfig: any, ): Observable<any> {
        return of(null);
    }
    postShow(svrConfig: any, form: FormGroup): Observable<any> {

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
            def: '《深圳市链融科技股份有限公司》的交易申请'
        };
    }
}
