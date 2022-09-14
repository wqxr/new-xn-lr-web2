/*
 * Copyright(c) 2017-2021, 深圳市链融科技股份有限公司
 * Beijing Xiwei Technology Co., Ltd.
 * All rights reserved.
 *
 * @file：SubSupplierSignYjl
 * @summary：雅居乐-星顺 保理商账号变更-供应商签署说明书
 * @version: 1.0
 * **********************************************************************
 * revision             author            reason             date
 * 1.0                 hucongying       雅居乐改造项目     2021-02-04
 * **********************************************************************
 */
import { XnService } from 'libs/shared/src/lib/services/xn.service';
import { Observable, of } from 'rxjs';
import { IFlowCustom } from '../flow-custom';
import { LoadingService } from 'libs/shared/src/lib/services/loading.service';
import XnFlowUtils from 'libs/shared/src/lib/common/xn-flow-utils';
import { XnUtils } from 'libs/shared/src/lib/common/xn-utils';
import { AvengerFinancingContractModalComponent } from 'libs/shared/src/lib/public/avenger/modal/avenger-asign-contract.modal';
import { map } from 'rxjs/operators';

export class SubSupplierSignYjl implements IFlowCustom {
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
            console.log(1);

            return of(null);
        }

        const beginInfo = svrConfig.actions;
        const bankInfo = beginInfo.filter(x =>
            x.procedureId === 'operate'
        );
        const compareInfo = JSON.parse(bankInfo[bankInfo.length - 1].checkers.filter((x: any) => x.checkerId === 'debtCompare')[0].data);
        console.log(compareInfo);

        if (compareInfo.old.receiveOrg !== compareInfo.new.receiveOrg
            || compareInfo.old.receiveAccount !== compareInfo.new.receiveAccount) {
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
                    json.data.flowId = 'sub_financing_sign_yjl_520'; // 雅居乐-星顺 供应商签署合同
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
        } else {
            return of(null);
        }

    }

    getTitleConfig(): any {
        return {
            hideTitle: true,
            titleName: '流程标题',
            def: '供应商签署说明书'
        };
    }
}
