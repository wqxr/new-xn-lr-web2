/*
 * Copyright(c) 2017-2019, 深圳市链融科技股份有限公司
 * Beijing Xiwei Technology Co., Ltd.
 * All rights reserved.
 *
 * @file：contract-input.component.ts
 * @summary：合同文件
 * @version: 1.0
 * **********************************************************************
 * revision             author            reason             date
 * 1.0                 zhyuanan          增加功能1         2019-04-22
 * **********************************************************************
 */

import { XnService } from 'libs/shared/src/lib/services/xn.service';
import { Observable, of } from 'rxjs';
import { IFlowCustom } from '../flow-custom';
import { LoadingService } from 'libs/shared/src/lib/services/loading.service';
import { XnUtils } from 'libs/shared/src/lib/common/xn-utils';
import XnFlowUtils from 'libs/shared/src/lib/common/xn-flow-utils';
import { AvengerFinancingContractModalComponent } from 'libs/shared/src/lib/public/avenger/modal/avenger-asign-contract.modal';
import { map } from 'rxjs/operators';

export class SupplierSign implements IFlowCustom {
    constructor(private xn: XnService, private loading: LoadingService) {
    }

    preShow(svrConfig: any): Observable<any> {
        return of(null);
    }

    postShow(svrConfig: any): Observable<any> {
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
            recordId: svrConfig.record && svrConfig.record.recordId || '',  // 重复同意时会有recordId，此时后台就不要新生成recordId了
            title: formValue.title,
            memo: formValue.memo,
            checkers: XnFlowUtils.buildSubmitCheckers(svrConfig.checkers, formValue)
        };

        XnUtils.checkLoading(this);
        return this.xn.avenger.post('/flow/preSubmit', params)
          .pipe(map(json => {
                // if (json.data && json.data.isProxy && json.data.isProxy === 50) {
                //     return params;
                // }
                json.data.flowId = 'supplier_sign_500'; // 万科供应商签署合同
                const contracts = json.data;
                contracts.forEach(element => {
                    if (!element.config) {
                        element.config = {
                            text: ''
                        };
                    }
                });
                contracts.forEach(x => {
                    if (x.label === '国内有追索权商业保理合同') {
                        x.config.text = '乙方（保理商）数字签名';
                    } else if (x.label === '安心账户（应收账款资金）托管协议（三方）' || x.label === '委托开户通知书') {
                        x.config.text = '乙方（电子签章、数字签名）';
                    } else if (x.label === '托管指令授权书') {
                        x.config.text = '乙方（公章）';
                    } else if (x.label === '国内商业保理合同(三方协议)') {
                        x.config.text = '丙方(电子签章、数字签名)';
                    } else {
                        x.config.text = '（盖章）';
                    }
                });
                return {
                    action: 'modal',
                    modal: AvengerFinancingContractModalComponent,
                    params: contracts
                };
            }));
        // return of(null);
    }

    getTitleConfig(): any {
        return {
            hideTitle: true,
            titleName: '流程标题',
            def: '万科供应商签署合同'
        };
    }
}
