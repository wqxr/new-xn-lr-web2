import {IFlowCustom} from '../flow.custom';
import {XnService} from 'libs/shared/src/lib/services/xn.service';
import {Observable, of} from 'rxjs';
import {FinancingFactoringModalComponent} from 'libs/shared/src/lib/public/modal/financing-factoring-modal.component';
import {Contract} from 'libs/shared/src/lib/config/contract';

export class FinancingSupplierTwo4Flow implements IFlowCustom {

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

        let contracts = JSON.parse(svrConfig.actions[0].contracts);
        const contractFiltersName: any[] = Contract.getNames();

        for (let i = 0; i < contractFiltersName.length; i++) {
            contracts = contracts.filter(v => v && v.label !== contractFiltersName[i]);
        }

        const params: any = {
            flowId: 'financing_supplier_two4',
        };
        if (contracts.length === 1) {
            params.attachment2Id = contracts[0].id;
            params.attachment2Secret = contracts[0].secret;
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
