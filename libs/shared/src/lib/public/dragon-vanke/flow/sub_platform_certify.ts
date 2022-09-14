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
 * 1.0                 wangqing        保理商预录入         2022-03-16
 * **********************************************************************
 */

import { XnService } from '../../../services/xn.service';
import { Observable, of } from 'rxjs';
import { LoadingService } from '../../../services/loading.service';
import { IFlowCustom } from './flow-custom';

export class SubPlatformCertify implements IFlowCustom {
    constructor(private xn: XnService, private loading: LoadingService) {
    }

    preShow(): Observable<any> {
        return of(null);
    }
    afterSubmitandGettip(svrConfig: any): Observable<any> {
        if (svrConfig.procedure.procedureId === '@begin') {
            this.xn.msgBox.open(false, '提交成功,下一步请复核人在【首页-待办任务】中完成【复核】的待办任务');
        } else if (svrConfig.procedure.procedureId === 'review') {
            this.xn.msgBox.open(false, ' 提交成功！资质录入成功');
        }
        return of(null);

    }

    postShow(svrConfig: any, form: FormGroup): Observable<any> {
        return of(null);
    }

    postGetSvrConfig(svrConfig: any): void {
    }

    preSubmit(svrConfig: any, formValue: any): Observable<any> {
        if (svrConfig.procedure.procedureId === '@begin') {
            const certifyList = JSON.parse(formValue.certifyList);
            const hasValue = certifyList.every(x => { return x.certify_code });
            if (!hasValue) {
                this.xn.msgBox.open(false, '资质文件录入不完整,请确认');
                return of({
                    action: 'stop',
                });
            } else {
                return of(null);
            }

        }else{
            return of(null);
        }
    }

    getTitleConfig(): any {
        return {
            hideTitle: true,
            titleName: '流程标题',
            def: '资质文件录入'
        };
    }
}
