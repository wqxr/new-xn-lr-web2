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

import { XnService } from 'libs/shared/src/lib/services/xn.service';
import { Observable, of } from 'rxjs';
import { LoadingService } from 'libs/shared/src/lib/services/loading.service';
import { IFlowCustom } from './flow-custom';

export class SubChangeVerification implements IFlowCustom {
    constructor(private xn: XnService, private loading: LoadingService) {
    }

    preShow(): Observable<any> {
        return of(null);
    }
    afterSubmitandGettip(svrConfig: any): Observable<any>  {

        if (svrConfig.procedure.procedureId === 'operate') {
            this.xn.msgBox.open(false, '提交成功,下一步请客户经理复核人在【首页-待办任务】中完成【复核】的待办任务');
        } else if (svrConfig.procedure.procedureId === 'review' ) {
            this.xn.msgBox.open(false, '提交成功！请风险复核人在【首页-待办任务】中完成【风险复核】的待办任务。');

        } else if (svrConfig.procedure.procedureId === 'riskReview' ) {
          this.xn.msgBox.open(false, '提交成功！已完成账号变更流程。');
            // this.xn.msgBox.open(false, '提交成功！请高管复核人在【首页-待办任务】中完成【高管复核】的待办任务。');

        } else if (svrConfig.procedure.procedureId === 'windReview' ) {
            this.xn.msgBox.open(false, '提交成功！已完成账号变更流程。');

        } else if (svrConfig.procedure.procedureId === 'review') {
            this.xn.msgBox.open(false, '提交成功！已完成账号变更流程。');
        }
        return of(null);

    }

    postShow(svrConfig: any, form: FormGroup): Observable<any> {

        return of(null);
    }

    postGetSvrConfig(svrConfig: any): void {
        return svrConfig;

    }

    preSubmit(svrConfig: any, formValue: any): Observable<any> {
        if (svrConfig.procedure.procedureId === 'operate') {
            const contractFile = formValue.pdfProjectFiles;
            const correctFile = formValue.correctFile;
            let alert = '';
            try {

                if (contractFile === '') {
                    alert = '付款确认书文件未上传\n，';
                } else {
                    alert = '';
                }
                if (correctFile === '') {
                    alert = alert + '项目公司更正函文件未上传\n，';
                } else {
                    alert = '';
                }
                if (alert !== '') {
                    this.xn.msgBox.open(false, alert + '无法提交');
                    return of({
                        action: 'stop',

                    });
                } else {
                    return of(null);
                }

                // 只有在填了合同金额时，比较合同金额和应收账款金额大小

            } catch (e) {
                console.log('msg:', e);
            }
            // 不做操作
            // return of(null);
        } else {
            return of(null);
        }

    }

    getTitleConfig(): any {
        return {
            hideTitle: true,
            titleName: '流程标题',
            def: '变更流程保理审核'
        };
    }
}
