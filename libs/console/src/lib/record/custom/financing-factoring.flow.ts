import {IFlowCustom} from '../flow.custom';
import {XnService} from 'libs/shared/src/lib/services/xn.service';
import {Observable, of} from 'rxjs';

import {FinancingFactoringModalComponent} from 'libs/shared/src/lib/public/modal/financing-factoring-modal.component';
import XnFlowUtils from 'libs/shared/src/lib/common/xn-flow-utils';
import {AuditCriteriaModalComponent} from 'libs/shared/src/lib/public/form/hw-mode/modal/audit-criteria-modal.component';
import { map } from 'rxjs/operators';

import * as moment from 'moment';

/**
 *  两票一合同，基础模式-子流程-保理商审批流程
 */
export class FinancingFactoringFlow implements IFlowCustom {

    constructor(private xn: XnService) {
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
        if (svrConfig.procedure.procedureId === 'operate') {
            const payTime = moment(formValue.payDate, 'YYYY-MM-DD').format('YYYYMMDD') || 0; // 将付款时间传给后台
            const modalParams = {
                mainFlowId: svrConfig.record.mainFlowId,
                payTime
            };
            // return of(null);
            return of({
                action: 'modal',
                modal: AuditCriteriaModalComponent,
                params: modalParams
            });
        } else if (svrConfig.procedure.procedureId === 'review') {
            const params: any = {
                flowId: svrConfig.flow.flowId,
                procedureId: svrConfig.procedure.procedureId,
                recordId: svrConfig.record && svrConfig.record.recordId || '',  // 重复同意时会有recordId，此时后台就不要新生成recordId了
                title: formValue.title,
                memo: formValue.memo,
                checkers: XnFlowUtils.buildSubmitCheckers(svrConfig.checkers, formValue)
            };

            return this.xn.api.post('/record/record?method=pre_submit', params)
                .pipe(map(json => {
                    json.data.flowId = 'financing_factoring';
                    return {
                        action: 'modal',
                        modal: FinancingFactoringModalComponent,
                        params: json.data
                    };
                }));
        } else {
            return of(null);
        }
    }

    getTitleConfig(): any {
        return null;
    }
}
