import {IFlowCustom} from '../flow.custom';
import {XnService} from 'libs/shared/src/lib/services/xn.service';
import {Observable, of} from 'rxjs';


// import {XnUtils} from "libs/shared/src/lib/common/xn-utils";

export class FinancingEnterpriseDepositFlow implements IFlowCustom {

    constructor(private xn: XnService) {
    }

    preShow(): Observable<any> {
        return of(null);
    }

    postShow(svrConfig: any): Observable<any> {
        return of(null);
    }

    postGetSvrConfig(svrConfig: any): void {
        // if (svrConfig.procedure.procedureId === '@begin') {
        //     this.handleSvrConfigWhenBegin(svrConfig);
        // }
    }

    preSubmit(svrConfig: any, formValue: any): Observable<any> {
        // // 这个默认值要加上
        return of(null);
    }

    getTitleConfig(): any {
        return {
            hideTitle: true,
            def: `《${this.xn.user.orgName}》的交易申请`
        };
    }

}
