import { FormGroup, FormControl, Validators } from '@angular/forms';
/*
 * Copyright(c) 2017-2019, 深圳市链融科技股份有限公司
 * Beijing Xiwei Technology Co., Ltd.
 * All rights reserved.
 *
 * @file：SupplierUploadInformationFlow
 * @summary：平台资质文件录入
 * @version: 1.0
 * **********************************************************************
 * revision             author            reason             date
 * 1.0                 wangqing        资质文件录入         2022-03-16
 * **********************************************************************
 */

import { XnService } from '../../../services/xn.service';
import { Observable, of } from 'rxjs';
import { LoadingService } from '../../../services/loading.service';
import { IFlowCustom } from './flow-custom';

export class SubDebtUnitCertify implements IFlowCustom {
    constructor(private xn: XnService, private loading: LoadingService) {
    }

    preShow(): Observable<any> {
        return of(null);
    }
    afterSubmitandGettip(svrConfig: any): Observable<any> {
        if (svrConfig.procedure.procedureId === '@begin') {
            this.xn.msgBox.open(false, ' 提交成功！等待平台审核');
        }
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
            def: '资质文件录入'
        };
    }
}
