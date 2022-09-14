import { FormGroup, FormControl, Validators } from '@angular/forms';
/*
 * Copyright(c) 2017-2019, 深圳市链融科技股份有限公司
 * Beijing Xiwei Technology Co., Ltd.
 * All rights reserved.
 *
 * @file：SupplierUploadInformationFlow
 * @summary：平台特殊事项审批
 * @version: 1.0
 * **********************************************************************
 * revision             author            reason             date
 * 1.0                 yutianbao        保理商预录入         2019-02-05
 * **********************************************************************
 */

import { XnService } from '../../../services/xn.service';
import { Observable, of } from 'rxjs';
import { LoadingService } from '../../../services/loading.service';
import { IFlowCustom } from './flow-custom';

export class SubSpecialVerfication implements IFlowCustom {
    constructor(private xn: XnService, private loading: LoadingService) {
    }

    preShow(): Observable<any> {
        return of(null);
    }
    afterSubmitandGettip(svrConfig: any): Observable<any> {
        if (svrConfig.procedure.procedureId === 'operate') {
            this.xn.msgBox.open(false, '提交成功,下一步请客户经理复核人在【首页-待办任务】中完成【复核】的待办任务');

        } else if (svrConfig.procedure.procedureId === 'review') {
            this.xn.msgBox.open(false, '提交成功！请风险复核人在【首页-待办任务】中完成【风险复核】的待办任务。');

        } else if (svrConfig.procedure.procedureId === 'riskReview') {
            this.xn.msgBox.open(false, '提交成功！请高管复核人在【首页-待办任务】中完成【高管复核】的待办任务。');

        } else if (svrConfig.procedure.procedureId === 'windReview') {
            this.xn.msgBox.open(false, '提交成功！已完成特殊事项审批任务。');

        }
        return of(null);

    }

    postShow(svrConfig: any, form: FormGroup): Observable<any> {
        // console.log('post show svrConfig :', svrConfig, form);

        // form.get('enterprise').valueChanges.subscribe(val => {
        //     if (!val) {
        //         form.get('enterprise').reset('');
        //         return;
        //     }

        //     form.addControl('new', new FormControl('enterprise1', Validators.required));
        //     console.log('enterprise value changes :', val);
        // });

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
            def: '特殊事项保理审核'
        };
    }
}
