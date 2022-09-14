/*
 * Copyright(c) 2017-2019, 深圳市链融科技股份有限公司
 * Beijing Xiwei Technology Co., Ltd.
 * All rights reserved.
 *
 * @file：SupplierUploadInformationFlow
 * @summary：供应商上传企业资料发起流程
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

export class SubShOctSupplementaryInfoInput implements IFlowCustom {
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
                    '提交成功',
                    '下一步请复核人在【首页-待办任务】中完成【复核】的待办任务',
                ],
                () => { }
            );
        } else if (svrConfig.procedure.procedureId === 'review') {
            this.xn.msgBox.open(
                false,
                [
                    `资料已提交成功，待平台审核通过后，资料即可生效`,
                ],
                () => { }
            );
        }
        return of(null);
    }

    getTitleConfig(): any {
        return {
            hideTitle: true,
            def: `《${this.xn.user.orgName}》上传企业准入资料`
        };
    }
}
