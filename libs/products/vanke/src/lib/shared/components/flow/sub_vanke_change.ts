/*************************************************************************
* Copyright (c) 2017 - 2021 深圳市链融科技股份有限公司
* Shenzhen Lianrong Technology Co., Ltd.
* All rights reserved.
*
* @file：libs\products\vanke\src\lib\shared\components\flow\sub_vanke_change.ts
* @summary：变更账户流程
* @version: 1.0
* *************************************************************************
* revision             author            reason             date
* 1.0                 hucongying          init           2021-08-24
***************************************************************************/

import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { IFlowCustom } from './flow-custom';
import { map } from 'rxjs/operators';
import { XnService } from 'libs/shared/src/lib/services/xn.service';
import { LoadingService } from 'libs/shared/src/lib/services/loading.service';
import XnFlowUtils from 'libs/shared/src/lib/common/xn-flow-utils';
import { XnUtils } from 'libs/shared/src/lib/common/xn-utils';
import { DragonFinancingContractModalComponent } from 'libs/shared/src/lib/public/dragon-vanke/modal/dragon-asign-contract.modal';

export class SubVankeChange implements IFlowCustom {
    constructor(private xn: XnService, private loading: LoadingService) {
    }

    preShow(): Observable<any> {
        return of(null);
    }
    afterSubmitandGettip(svrConfig: any): Observable<any> {
        if (svrConfig.procedure.procedureId === '@begin') {
            this.xn.msgBox.open(false, '提交成功,下一步请复核人在【首页-待办任务】中完成【复核】的待办任务');

        } else if (svrConfig.procedure.procedureId === 'review') {
            this.xn.msgBox.open(false, ' 提交成功！请等待保理审核！');

        }
        return of(null);

    }

    postShow(svrConfig: any, form: FormGroup): Observable<any> {
        return of(null);
    }

    postGetSvrConfig(svrConfig: any): void {
    }

    preSubmit(svrConfig: any, formValue: any): Observable<any> {
        if (svrConfig.procedure.procedureId !== 'review') {
            return of(null);
        }
        const beginInfo = svrConfig.actions;
        const bankInfo = beginInfo.filter(x =>
            x.procedureId === '@begin'
        );
        const compareInfo = JSON.parse(bankInfo[bankInfo.length - 1].checkers.filter((x: any) => x.checkerId === 'debtCompare')[0].data);
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
            return this.xn.dragon.post('/flow/preSubmit', params)
            .pipe(map(json => {
                    json.data.flowId = 'sub_vanke_change'; // 万科供应商签署合同
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
                        modal: DragonFinancingContractModalComponent,
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
            def: '变更账户流程'
        };
    }
}
