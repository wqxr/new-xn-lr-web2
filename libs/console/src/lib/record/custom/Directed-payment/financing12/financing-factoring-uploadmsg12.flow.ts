import { IFlowCustom } from '../../../flow.custom';
import {XnService} from 'libs/shared/src/lib/services/xn.service';
import {Observable, of} from 'rxjs';

import {LoadingService} from 'libs/shared/src/lib/services/loading.service';

/**
 *  定向收款模式-协议变更-保理商上传变更后的信息
 */
export class FinancingFactoringUploadmsg12Flow implements IFlowCustom {

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
            return of(null);
    }

    getTitleConfig(): any {
        return {
            hideTitle: true,
            def: `《${this.xn.user.orgName}》的交易申请`
        };
    }
}
