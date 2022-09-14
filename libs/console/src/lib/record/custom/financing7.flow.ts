import { XnUtils } from 'libs/shared/src/lib/common/xn-utils';
import { FinancingFactoringModalComponent } from 'libs/shared/src/lib/public/modal/financing-factoring-modal.component';
import { IFlowCustom } from '../flow.custom';
import { XnService } from 'libs/shared/src/lib/services/xn.service';
import { Observable, of } from 'rxjs';

import XnFlowUtils from 'libs/shared/src/lib/common/xn-flow-utils';
import { FinancingFactoringVankeModalComponent } from 'libs/shared/src/lib/public/modal/financing-factoring-vanke-modal.component';
import { LoadingService } from 'libs/shared/src/lib/services/loading.service';
import { map } from 'rxjs/operators';
export class Financing7Flow implements IFlowCustom {
    constructor(private xn: XnService, private loading: LoadingService) {}

    preShow(): Observable<any> {
        return of(null);
    }

    postShow(svrConfig: any): Observable<any> {
        return of(null);
    }

    postGetSvrConfig(svrConfig: any): void {}

    preSubmit(svrConfig: any, formValue: any): Observable<any> {
        if (svrConfig.procedure.procedureId !== 'review') {
            return of(null);
        }

        const params: any = {
            flowId: svrConfig.flow.flowId,
            procedureId: svrConfig.procedure.procedureId,
            recordId: (svrConfig.record && svrConfig.record.recordId) || '', // 重复同意时会有recordId，此时后台就不要新生成recordId了
            title: formValue.title,
            memo: formValue.memo,
            checkers: XnFlowUtils.buildSubmitCheckers(
                svrConfig.checkers,
                formValue
            )
        };

        XnUtils.checkLoading(this);

        return this.xn.api
            .post('/record/record?method=pre_submit', params)
            .pipe(map(json => {
                json.data.flowId = 'financing7';
                const contracts = json.data;
                contracts.forEach(element => {
                    if (!element.config) {
                        element.config = {
                            text: ''
                        };
                    }
                });
                contracts[0].config.text =
                    '甲方（债权人、出让人）数字签名';
                contracts[1].config.text = '甲方（出让方）';
                // contracts[2]['config']['text'] = '甲方（出让方）';
                // contracts[3]['config']['text'] = '（盖章）';
                // contracts[4]['config']['text'] = '（盖章）';
                this.loading.close();
                return {
                    action: 'modal',
                    modal: FinancingFactoringVankeModalComponent,
                    params: contracts
                };
            }));
    }

    getTitleConfig(): any {
        return {
            hideTitle: true,
            def: `《保证付款 + 商品融资》的交易申请`
        };
    }
}
