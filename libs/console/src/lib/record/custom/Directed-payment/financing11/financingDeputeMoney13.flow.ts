import { IFlowCustom } from '../../../flow.custom';
import {XnService} from 'libs/shared/src/lib/services/xn.service';
import {Observable, of} from 'rxjs';

import {LoadingService} from 'libs/shared/src/lib/services/loading.service';
import XnFlowUtils from 'libs/shared/src/lib/common/xn-flow-utils';
import {XnUtils} from 'libs/shared/src/lib/common/xn-utils';
import {FinancingFactoringVankeModalComponent} from 'libs/shared/src/lib/public/modal/financing-factoring-vanke-modal.component';
import { map } from 'rxjs/operators';

/**
 *  定向收款模式-供应商发起委托付款
 */
export class FinancingDeputeMoney13Flow implements IFlowCustom {

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

    preSubmit(svrConfig: any, formValue: any): Observable<any> {
        // return of(null);
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
        return this.xn.api.post('/record/record?method=pre_submit', params)
            .pipe(map(json => {
                json.data.flowId = 'financing_depute_money13';
                const contracts = json.data;
                contracts.forEach(element => {
                    if (!element.config) {
                        element.config = {
                            text: ''
                        };
                    }
                });
                contracts.forEach(x => {
                    if (x.label.includes('委托付款通知书')) {
                        x.config.text = '甲方（电子签章、数字签名）';
                    } else {
                        x.config.text = '（盖章）';
                    }
                });
                return {
                    action: 'modal',
                    modal: FinancingFactoringVankeModalComponent,
                    params: contracts
                };
            }));
    }

    getTitleConfig(): any {
        return {
            hideTitle: true,
            def: `《${this.xn.user.orgName}》委托付款`
        };
    }
}
