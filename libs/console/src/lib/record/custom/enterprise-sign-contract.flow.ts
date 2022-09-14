import {IFlowCustom} from '../flow.custom';
import {XnService} from 'libs/shared/src/lib/services/xn.service';
import {Observable, of} from 'rxjs';

import XnFlowUtils from 'libs/shared/src/lib/common/xn-flow-utils';
import {XnUtils} from 'libs/shared/src/lib/common/xn-utils';
import {LoadingService} from 'libs/shared/src/lib/services/loading.service';
import {FinancingFactoringModalComponent} from 'libs/shared/src/lib/public/modal/financing-factoring-modal.component';
import { map } from 'rxjs/operators';

// import {XnUtils} from "libs/shared/src/lib/common/xn-utils";

export class EnterpriseSignContractFlow implements IFlowCustom {

    constructor(private xn: XnService, private loading: LoadingService) {
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
                json.data.flowId = 'enterprise_sign_contract';
                const contracts = json.data;
                return {
                    action: 'modal',
                    modal: FinancingFactoringModalComponent,
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
