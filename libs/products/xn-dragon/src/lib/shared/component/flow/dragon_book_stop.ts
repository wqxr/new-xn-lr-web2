/*
 * Copyright(c) 2017-2019, 深圳市链融科技股份有限公司
 * Beijing Xiwei Technology Co., Ltd.
 * All rights reserved.
 *
 * @file：SupplierUploadInformationFlow
 * @summary：保理商提单预录入
 * @version: 1.0
 * **********************************************************************
 * revision             author            reason             date
 * 1.0                 wangqing          增加功能1         2019-08-28
 * **********************************************************************
 */

import { XnService } from 'libs/shared/src/lib/services/xn.service';
import { Observable, of } from 'rxjs';
import { LoadingService } from 'libs/shared/src/lib/services/loading.service';
import { IFlowCustom } from './flow-custom';
import { FormGroup } from '@angular/forms';

export class DragonbookStop implements IFlowCustom {
    constructor(private xn: XnService, private loading: LoadingService) {
    }

    preShow(): Observable<any> {
        return of(null);
    }

    postShow(svrConfig: any, mainForm: FormGroup): Observable<any> {
        return of(null);
    }

    postGetSvrConfig(svrConfig: any): void {
        return svrConfig;
    }


    preSubmit(svrConfig: any, formValue: any): Observable<any> {
        return of(null);
    }
    afterSubmitandGettip(svrConfig: any,): Observable<any> {
        return of(null);
    }
    getTitleConfig(): any {
        return {
            hideTitle: true,
            titleName: '流程标题',
            def: '中止'
        };
    }
}
