import { IFlowCustom } from '../../../flow.custom';
import {XnService} from 'libs/shared/src/lib/services/xn.service';
import {Observable, of} from 'rxjs';

import {LoadingService} from 'libs/shared/src/lib/services/loading.service';
import {XnModalUtils} from 'libs/shared/src/lib/common/xn-modal-utils';
import {PayBackInputModalComponent} from 'libs/shared/src/lib/public/form/hw-mode/modal/pay-back-input-modal.component';
import {ViewContainerRef} from '@angular/core';

/**
 *  定向收款模式-申请融资-保理商确认回款
 */
export class FinancingConfirmLoan13Flow implements IFlowCustom {

    constructor(private xn: XnService, private vcr: ViewContainerRef, private loading: LoadingService) {
    }

    preShow(): Observable<any> {
        return of(null);
    }

    postShow(svrConfig: any): Observable<any> {
        return XnModalUtils.openInViewContainer(this.xn, this.vcr, PayBackInputModalComponent, null);
    }

    postGetSvrConfig(svrConfig: any): void {
    }

    preSubmit(svrConfig: any, formValue: any): Observable<any> {
        return of(null);
    }

    getTitleConfig(): any {
        return {
            hideTitle: true,
            def: `《${this.xn.user.orgName}》的交易申请`
        };
    }
}
