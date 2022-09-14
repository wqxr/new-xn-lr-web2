import {IFlowCustom} from '../flow.custom';
import {XnService} from 'libs/shared/src/lib/services/xn.service';
import {Observable, of} from 'rxjs';

import {FinancingFactoringModalComponent} from 'libs/shared/src/lib/public/modal/financing-factoring-modal.component';

export class FinancingSupplierFlow implements IFlowCustom {

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

        const contracts = JSON.parse(svrConfig.actions[0].contracts);
        const params: any = {
            flowId: 'financing_supplier',
        };
        if (contracts.length === 1) {
            params.attachment1Id = contracts[0].id;
            params.attachment1Secret = contracts[0].secret;
        }
        else if (contracts.length === 2) {
            params.mainId = contracts[0].id;
            params.mainSecret = contracts[0].secret;
            params.mainDone = contracts[0].done;
            params.attachment1Id = contracts[1].id;
            params.attachment1Secret = contracts[1].secret;
        }
        return of({
            action: 'modal',
            modal: FinancingFactoringModalComponent,
            params
        });
    }

    getTitleConfig(): any {
        return null;
    }

}
