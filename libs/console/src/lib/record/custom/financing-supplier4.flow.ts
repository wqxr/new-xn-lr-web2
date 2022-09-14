import {IFlowCustom} from '../flow.custom';
import {XnService} from 'libs/shared/src/lib/services/xn.service';
import {Observable, of} from 'rxjs';
import {FinancingFactoringModalComponent} from 'libs/shared/src/lib/public/modal/financing-factoring-modal.component';
import {Contract} from 'libs/shared/src/lib/config/contract';

export class FinancingSupplier4Flow implements IFlowCustom {

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
        const contractFiltersName: any[] = Contract.getNames();

        console.log('contracts: ', contracts);
        // for (let i = 0; i < contractFiltersName.length; i++) {
        //     contracts = contracts.filter(v => v && v.label !== contractFiltersName[i]);
        // }
        // console.log('contractsAfter: ', contracts);

        const params: any = {
            flowId: 'financing_supplier4',
        };
        if (contracts.length === 1) {
            params.attachment1Id = contracts[0].id;
            params.attachment1Secret = contracts[0].secret;
        } else if (contracts.length === 2) {
            params.mainId = contracts[0].id;
            params.mainSecret = contracts[0].secret;
            params.mainDone = contracts[0].done;
            params.attachment1Id = contracts[1].id;
            params.attachment1Secret = contracts[1].secret;
        } else if (contracts.length === 3) {
            params.mainId = contracts[0].id;
            params.mainSecret = contracts[0].secret;
            params.mainDone = contracts[0].done;
            params.attachment1Id = contracts[1].id;
            params.attachment1Secret = contracts[1].secret;
            params.attachment3Id = contracts[2].id;
            params.attachment3Secret = contracts[2].secret;
        } else if (contracts.length === 4) {
            params.mainId = contracts[0].id;
            params.mainSecret = contracts[0].secret;
            params.mainDone = contracts[0].done;
            params.attachment1Id = contracts[1].id;
            params.attachment1Secret = contracts[1].secret;
            params.attachment3Id = contracts[2].id;
            params.attachment3Secret = contracts[2].secret;
            params.attachment4Id = contracts[3].id;
            params.attachment4Secret = contracts[3].secret;
        } else if (contracts.length === 5) {
            params.mainId = contracts[0].id;
            params.mainSecret = contracts[0].secret;
            params.mainDone = contracts[0].done;
            params.attachment1Id = contracts[1].id;
            params.attachment1Secret = contracts[1].secret;
            params.attachment3Id = contracts[2].id;
            params.attachment3Secret = contracts[2].secret;
            params.attachment4Id = contracts[3].id;
            params.attachment4Secret = contracts[3].secret;
            params.attachment5Id = contracts[4].id;
            params.attachment5Secret = contracts[4].secret;
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
