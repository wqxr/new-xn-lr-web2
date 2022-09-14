import {IFlowCustom} from '../flow.custom';
import {XnService} from 'libs/shared/src/lib/services/xn.service';
import {Observable, of} from 'rxjs';

import {FinancingFactoringModalComponent} from 'libs/shared/src/lib/public/modal/financing-factoring-modal.component';
import XnFlowUtils from 'libs/shared/src/lib/common/xn-flow-utils';
import { map } from 'rxjs/operators';
export class FinancingFactoring3Flow implements IFlowCustom {

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

        return this.xn.api.post('/record/record?method=pre_submit', params)
            .pipe(map(json => {
                json.data.flowId = 'financing_factoring3';
                return {
                    action: 'modal',
                    modal: FinancingFactoringModalComponent,
                    params: json.data
                };
            }));
    }

    getTitleConfig(): any {
        return null;
    }
}
