import { IFlowCustom } from '../../../flow.custom';
import {XnService} from 'libs/shared/src/lib/services/xn.service';
import {Observable, of} from 'rxjs';

import {FinancingFactoringVankeModalComponent} from 'libs/shared/src/lib/public/modal/financing-factoring-vanke-modal.component';
import XnFlowUtils from 'libs/shared/src/lib/common/xn-flow-utils';
import {XnUtils} from 'libs/shared/src/lib/common/xn-utils';
import {LoadingService} from 'libs/shared/src/lib/services/loading.service';
import { map } from 'rxjs/operators';

/**
 *  定向收款模式-供应商发起变更协议申请
 */
export class Financing12Flow implements IFlowCustom {

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
                json.data.flowId = 'financing12';
                const contracts = json.data;
                contracts.forEach(element => {
                    if (!element.config) {
                        element.config = {
                            text: ''
                        };
                    }
                });
                contracts.forEach(x => {
                    if (x.label === '托管业务变更申请书') {
                        x.config.text = '（客户签章处）';
                    } else if (x.label === '终止协议通知书') {
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
            def: `《${this.xn.user.orgName}》的交易申请`
        };
    }
}
