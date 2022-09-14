/*
 * Copyright(c) 2017-2019, 深圳市链融科技股份有限公司
 * Beijing Xiwei Technology Co., Ltd.
 * All rights reserved.
 *
 * @file：SupplierUploadInformationFlow
 * @summary：保理商提单预录入
 * @version: 1.0
 * **********************************************************************
 * revision             author            reason             date
 * 1.0                 wangqing          增加功能1         2019-08-28
 * **********************************************************************
 */

import { XnService } from 'libs/shared/src/lib/services/xn.service';
import { Observable, of } from 'rxjs';
import { LoadingService } from 'libs/shared/src/lib/services/loading.service';
import { IFlowCustom } from './flow-custom';
import { FormGroup } from '@angular/forms';
import XnFlowUtils from 'libs/shared/src/lib/common/xn-flow-utils';
import { XnUtils } from 'libs/shared/src/lib/common/xn-utils';
import { BankFinancingContractModalComponent } from '../share/modal/bank-asign-contract.modal';
import { map } from 'rxjs/operators';

export class BankPushSupplier implements IFlowCustom {
    constructor(private xn: XnService, private loading: LoadingService) {
    }

    preShow(): Observable<any> {
        return of(null);
    }

    postShow(svrConfig: any, mainForm: FormGroup): Observable<any> {
        // let routeparams = mainForm.get('mainFlowId').value;
        // let self = this;
        // setTimeout(() => {
        //     let textId = document.getElementById("text-id");
        //     console.log(textId);
        //     textId.onclick = function viewProcess() {
        //         self.xn.router.navigate([
        //             `machine-account/main-list/detail/${routeparams}`
        //         ]);
        //     }
        // }, 300);
        return of(null);
    }

    postGetSvrConfig(svrConfig: any): void {
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
        return this.xn.avenger.post('/flow/preSubmit', params)
        .pipe(map(json => {
                json.data.flowId = 'sub_bank_push_supplier_sign';
                const contracts = json.data;
                contracts.forEach(element => {
                    if (!element.config) {
                        element.config = {
                            text: ''
                        };
                    }
                });
                contracts.forEach(x => {
                    if (x.label.includes ('链融科技供应链服务平台合作协议')) {
                        x.config.text = '乙方（电子签章、数字签名）';
                    } else if (x.label.includes('企业信用信息采集授权书')) {
                        x.config.text = '授权人（或本公司）';
                    } else {
                        x.config.text = '（盖章）';
                    }
                });
                return {
                    action: 'modal',
                    modal: BankFinancingContractModalComponent,
                    params: contracts
                };
            }));
    }

    getTitleConfig(): any {
        return {
            hideTitle: true,
            titleName: '流程标题',
            def: '签署协议'
        };
    }
}
