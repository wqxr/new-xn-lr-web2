/*
 * Copyright(c) 2017-2019, 深圳市链融科技股份有限公司
 * Beijing Xiwei Technology Co., Ltd.
 * All rights reserved.
 *
 * @file：SupplierUploadInformationFlow
 * @summary：已线下开票-同步开票状态
 * @version: 1.0
 * **********************************************************************
 * revision             author            reason             date
 * 1.0                 yutinabao          增加功能1         2019-09-20
 * **********************************************************************
 */

import { XnService } from 'libs/shared/src/lib/services/xn.service';
import { Observable, of } from 'rxjs';
import { LoadingService } from 'libs/shared/src/lib/services/loading.service';
import { IFlowCustom } from '../flow-custom';
import * as lodashall from 'lodash';

export class DragonNuonuocsOfflineInvoice implements IFlowCustom {
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
    afterSubmitandGettip(svrConfig: any, formValue: any, params: any): Observable<any> {
        if (svrConfig.procedure.procedureId === '@begin') {
            this.xn.msgBox.open(false, '提交成功！下一步请财务复核人在【首页 - 待办任务】中完成【复核】的待办任务。');
        } else if (svrConfig.procedure.procedureId === 'review') {
            this.xn.msgBox.open(false, '提交成功！开票状态已更新');
        }
        return of(null);
    }

    preSubmit(svrConfig: any, formValue: any): Observable<any> {
        if (svrConfig.procedure.procedureId === '@begin' || svrConfig.procedure.procedureId === 'operate') {
            const tradeList = !!formValue.tradeList ? JSON.parse(formValue.tradeList) : [];
            const isOk = tradeList.every(x => !!x.invoiceFile && x.invoiceFile.length);
            const noFiels = tradeList.filter(y => !y.invoiceFile).map(z => z.mainFlowId);
            if (!isOk) {
                this.xn.msgBox.open(false, [
                    `以下交易: `,
                    noFiels.join(','),
                    `没有上传开票文件，请上传后再提交`
                ]);
                return of({ action: 'stop' });
            } else {
                return of(null);
            }
        } else {
            return of(null);
        }
    }

    getTitleConfig(): any {
        return {
            hideTitle: true,
            titleName: '流程标题',
            def: '已线下开票申请'
        };
    }
}
