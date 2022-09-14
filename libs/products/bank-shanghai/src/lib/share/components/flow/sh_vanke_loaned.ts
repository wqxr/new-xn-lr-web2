/*
 * Copyright(c) 2017-2019, 深圳市链融科技股份有限公司
 * Beijing Xiwei Technology Co., Ltd.
 * All rights reserved.
 *
 * @file：ShangHaiVankeLoaned
 * @summary：待供应商提现
 * @version: 1.0
 * **********************************************************************
 * revision             author            reason             date
 * 1.0                  yutianbao          增加功能1         2019-04-22
 * **********************************************************************
 */

import { IFlowCustom } from './flow-custom';
import { XnService } from 'libs/shared/src/lib/services/xn.service';
import { LoadingService } from 'libs/shared/src/lib/services/loading.service';
import { Observable, of } from 'rxjs';
import * as _ from 'lodash';

export class ShangHaiVankeLoaned implements IFlowCustom {
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

    preSubmit(svrConfig: any, formValue: any): Observable<any> {
        if (svrConfig.procedure.procedureId === '@begin') {
            return of(null);
        } else {
            return of(null);
        }
    }

    afterSubmitandGettip(svrConfig: any, formValue?: any, x?: any): Observable<any> {
        if (svrConfig.procedure.procedureId === '@begin') {
            this.xn.msgBox.open(
                false,
                [
                    '提交成功'
                ],
                () => { }
            );
        }
        return of(null);
    }

    getTitleConfig(): any {
        return {
            hideTitle: true,
            def: `待供应商《${this.xn.user.orgName}》提现`
        };
    }
}
