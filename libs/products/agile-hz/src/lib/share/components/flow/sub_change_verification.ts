
/*
 * Copyright(c) 2017-2019, 深圳市链融科技股份有限公司
 * Beijing Xiwei Technology Co., Ltd.
 * All rights reserved.
 *
 * @file：SubChangeVerification
 * @summary：雅居乐-恒泽 账号变更流程 平台审核
 * @version: 1.0
 * **********************************************************************
 * revision             author            reason             date
 * 1.0                hucongying        雅居乐改造项目     2021-02-02
 * **********************************************************************
 */
import { Observable, of } from 'rxjs';
import { IFlowCustom } from './flow-custom';
import { FormGroup } from '@angular/forms';
import { LoadingService } from 'libs/shared/src/lib/services/loading.service';
import { XnService } from 'libs/shared/src/lib/services/xn.service';

export class SubAgileChangeVerification implements IFlowCustom {
    constructor(private xn: XnService, private loading: LoadingService) {
    }

    preShow(): Observable<any> {
        return of(null);
    }
    afterSubmitandGettip(svrConfig: any): Observable<any> {

        if (svrConfig.procedure.procedureId === 'operate') {
            this.xn.msgBox.open(false, '提交成功,下一步请复核人在【首页-待办任务】中完成【复核】的待办任务');
        } else if (svrConfig.procedure.procedureId === 'review') {
            this.xn.msgBox.open(false, '提交成功！已完成账号变更流程。');
        } 
        return of(null);

    }

    postShow(svrConfig: any, form: FormGroup): Observable<any> {
        return of(null);
    }

    postGetSvrConfig(svrConfig: any): void {
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
            def: '变更流程平台审核'
        };
    }
}
