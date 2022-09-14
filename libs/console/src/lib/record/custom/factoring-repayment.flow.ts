import {IFlowCustom} from '../flow.custom';
import {XnService} from 'libs/shared/src/lib/services/xn.service';
import {Observable, of} from 'rxjs';

import {XnModalUtils} from 'libs/shared/src/lib/common/xn-modal-utils';
import {ViewContainerRef} from '@angular/core';
import {RepaymentInputModalComponent} from 'libs/shared/src/lib/public/modal/repayment-input-modal.component';

export class FactoringRepaymentFlow implements IFlowCustom {

    constructor(private xn: XnService, private vcr: ViewContainerRef) {
    }

    preShow(): Observable<any> {
        return of(null);
    }

    postShow(svrConfig: any): Observable<any> {
        return XnModalUtils.openInViewContainer(this.xn, this.vcr, RepaymentInputModalComponent, null);
    }

    postGetSvrConfig(svrConfig: any): void {
    }

    preSubmit(svrConfig: any, formValue: any): Observable<any> {
        if (svrConfig.procedure.procedureId === '@begin') {
            (!!svrConfig.constParams) ? formValue.title = '《' + svrConfig.constParams.checkers.honourName + '》收款登记' :
                formValue.title = svrConfig.record.title;
        }

        if (svrConfig && svrConfig.constParams && svrConfig.constParams.checkers) {
            for (const key in svrConfig.constParams.checkers) {
                if (key === 'repaymentAmount') {
                    delete svrConfig.constParams.checkers[key];
                }
            }
        }

        return of(null);
    }

    getTitleConfig(): any {
        return {
            hideTitle: true,
            titleName: '流程标题',
            def: '默认标题'
        };
    }

}
