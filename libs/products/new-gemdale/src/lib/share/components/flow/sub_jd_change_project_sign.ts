/*
 * Copyright(c) 2017-2019, 深圳市链融科技股份有限公司
 * Shenzhen Lianrong Technology Co., Ltd.
 * All rights reserved.
 *
 * @file：JdFinancingSign
 * @summary:金地-供应商签署合同
 * @version: 1.0
 * **********************************************************************
 * revision             author            reason             date
 * 1.0                hucongying      金地数据对接         2020-12-16
 * **********************************************************************
 */

import { Observable, of } from 'rxjs';
import { IFlowCustom } from './flow-custom';
import { map } from 'rxjs/operators';
import { XnService } from 'libs/shared/src/lib/services/xn.service';
import { LoadingService } from 'libs/shared/src/lib/services/loading.service';
import { LocalStorageService } from 'libs/shared/src/lib/services/local-storage.service';
import XnFlowUtils from 'libs/shared/src/lib/common/xn-flow-utils';
import { XnUtils } from 'libs/shared/src/lib/common/xn-utils';
import { DragonFinancingContractModalComponent } from 'libs/shared/src/lib/public/dragon-vanke/modal/dragon-asign-contract.modal';

export class JdProjectFinancingSign implements IFlowCustom {
    constructor(private xn: XnService, private loading: LoadingService,
    ) {
    }

    preShow(): Observable<any> {
        return of(null);
    }

    postShow(svrConfig: any): Observable<any> {
        return of(null);
    }

    postGetSvrConfig(svrConfig: any): void {
    }
    afterSubmitandGettip(svrConfig: any): Observable<any> {
        if (svrConfig.procedure.procedureId !== 'review') {
            return of(null);
        } else {
            this.xn.msgBox.open(false, '提交成功，等待保理商审核');
        }
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
                if (json.data.length === 0) {
                    this.xn.msgBox.open(false, '无合同可签署');
                    return of({
                        action: 'stop',
                    });
                } else {
                    json.data.flowId = 'sub_jd_change_project_sign';
                    json.data.isProxy = 56;
                    const contracts = json.data;
                    // this.localStorageService.setCacheValue('jd_financing_sign', { onLineStatus: !contracts[0].readonly });
                    contracts.forEach(element => {
                        if (!element.config) {
                            element.config = {
                                text: ''
                            };
                        }
                    });
                    contracts.forEach(x => {
                        x.config.text = '项目公司';
                    });
                    return {
                        action: 'modal',
                        modal: DragonFinancingContractModalComponent,
                        params: contracts
                    };
                }

            }));
    }

    getTitleConfig(): any {
        return {
            hideTitle: true,
            titleName: '流程标题',
            def: '项目公司签署合同'
        };
    }
}
