/*
 * Copyright(c) 2017-2019, 深圳市链融科技股份有限公司
 * Beijing Xiwei Technology Co., Ltd.
 * All rights reserved.
 *
 * @file：SupplierUploadInformationFlow
 * @summary：供应商上传资料发起流程
 * @version: 1.0
 * **********************************************************************
 * revision             author            reason             date
 * 1.0                 zhyuanan          增加功能1         2019-04-22
 * **********************************************************************
 */

import { IFlowCustom } from '../../flow.custom';
import { XnService } from 'libs/shared/src/lib/services/xn.service';
import { LoadingService } from 'libs/shared/src/lib/services/loading.service';
import { Observable, of } from 'rxjs';
import * as _ from 'lodash';

export class SupplierUploadInformationFlow implements IFlowCustom {
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
            const getFileValue = JSON.parse(formValue.companyUpload);
            if (getFileValue.businessLicenseFile === undefined) {
                this.xn.msgBox.open(false, '请上传文件');
                return of({ action: 'stop' });
            } else {
                if (getFileValue.businessLicenseFile === '' &&
                    getFileValue.orgLegalCard === '' && getFileValue.orgLegalCert === ''
                    && getFileValue.certUserCard === '' && getFileValue.certUserAuthorize === '' && getFileValue.companyDecision === ''
                    && getFileValue.authorizationFile === '') {
                    this.xn.msgBox.open(false, '请上传文件');
                    return of({ action: 'stop' });
                } else {
                    return of(null);
                }
            }
        } else {
            return of(null);
        }
    }

    private isString(value: string): Boolean {
        return value.length === 0 ? false : true;
    }
    getTitleConfig(): any {
        return {
            hideTitle: true,
            def: `《${this.xn.user.orgName}》上传企业资料`
        };
    }
}
