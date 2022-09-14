/*
 * Copyright(c) 2017-2019, 深圳市链融科技股份有限公司
 * Beijing Xiwei Technology Co., Ltd.
 * All rights reserved.
 *
 * @file：SupplierUploadInformationFlow
 * @summary：合同模板新增流程
 * @version: 1.0
 * **********************************************************************
 * revision             author            reason             date
 * 1.0                 yutianbao          增加功能1         2019-09-20
 * **********************************************************************
 */

import { Observable, of } from 'rxjs';
import { IFlowCustom } from './flow-custom';
import * as lodashall from 'lodash';
import { XnService } from 'libs/shared/src/lib/services/xn.service';
import { LoadingService } from 'libs/shared/src/lib/services/loading.service';

export class DragonOnceContractTemplateAdd implements IFlowCustom {
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
    afterSubmitandGettip(svrConfig: any, ): Observable<any> {
        return of(null);
    }
    preSubmit(svrConfig: any, formValue: any): Observable<any> {
        if (svrConfig.procedure.procedureId === '@begin') {
        } else {
            return of(null);

        }
    }

    getTitleConfig(): any {
        return {
            hideTitle: true,
            titleName: '流程标题',
            def: '新增合同模板'
        };
    }
}
