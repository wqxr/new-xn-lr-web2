/*
 * Copyright(c) 2017-2019, 深圳市链融科技股份有限公司
 * Shenzhen Lianrong Technology Co., Ltd.
 * All rights reserved.
 *
 * @file：SupplierUploadInformationFlow
 * @summary：上传付确替换文件
 * @version: 1.0
 * **********************************************************************
 * revision             author            reason             date
 * 1.0                 congying          增加功能1         2019-09-20
 * **********************************************************************
 */

import { XnService } from 'libs/shared/src/lib/services/xn.service';
import { Observable, of } from 'rxjs';
import { LoadingService } from 'libs/shared/src/lib/services/loading.service';
import { IFlowCustom } from './flow-custom';
import * as lodashall from 'lodash';
import XnFlowUtils from 'libs/shared/src/lib/common/xn-flow-utils';
import { map } from 'rxjs/operators';
import { XnUtils } from 'libs/shared/src/lib/common/xn-utils';
import { DragonFinancingContractModalComponent } from 'libs/shared/src/lib/public/dragon-vanke/modal/dragon-asign-contract.modal';

export class SubProjectAdd implements IFlowCustom {
    constructor(private xn: XnService, private loading: LoadingService) {
    }

    preShow(): Observable<any> {
        return of(null);
    }

    postShow(svrConfig: any): Observable<any> {
        return of(null);
    }

    postGetSvrConfig(svrConfig: any): void {
        return svrConfig;

    }
    afterSubmitandGettip(svrConfig: any,): Observable<any> {
        return of(null);
    }
    preSubmit(svrConfig: any, formValue: any): Observable<any> {
        if (svrConfig.procedure.procedureId !== 'review') {
            return of(null);
        }

        const params: any = {
            flowId: svrConfig.flow.flowId,
            procedureId: svrConfig.procedure.procedureId,
            recordId: svrConfig.record && svrConfig.record.recordId || '',
            title: formValue.title,
            memo: formValue.memo,
            checkers: XnFlowUtils.buildSubmitCheckers(svrConfig.checkers, formValue)
        };

        XnUtils.checkLoading(this);
        return this.xn.dragon.post('/flow/preSubmit', params)
            .pipe(map(json => {
                json.data.flowId = 'sub_project_add';
                const contracts = json.data;
                contracts.forEach(element => {
                    if (!element.config) {
                        element.config = {
                            text: ''
                        };
                    }
                });
                contracts.isProxy = 52;
                contracts.forEach(x => {
                    if (x.label === '应收账款转让通知之补充协议') {
                        x.config.text = '项目公司（盖章）';
                    } else {
                        x.config.text = '（盖章）';
                    }
                });
                return {
                    action: 'modal',
                    modal: DragonFinancingContractModalComponent,
                    params: contracts
                };
            }));
    }

    getTitleConfig(): any {
        return {
            hideTitle: true,
            titleName: '流程标题',
            def: '项目公司签署补充协议'
        };
    }
}