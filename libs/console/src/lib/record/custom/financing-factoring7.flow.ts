import { IFlowCustom } from '../flow.custom';
import { XnService } from 'libs/shared/src/lib/services/xn.service';
import { FinancingFactoringModalComponent } from 'libs/shared/src/lib/public/modal/financing-factoring-modal.component';
import XnFlowUtils from 'libs/shared/src/lib/common/xn-flow-utils';
import { Observable, of } from 'rxjs';
import { LoadingService } from 'libs/shared/src/lib/services/loading.service';
import { XnUtils } from 'libs/shared/src/lib/common/xn-utils';
import { FinancingFactoringVankeModalComponent } from 'libs/shared/src/lib/public/modal/financing-factoring-vanke-modal.component';
import { map } from 'rxjs/operators';
export class FinancingFactoring7Flow implements IFlowCustom {
    constructor(private xn: XnService, private loading: LoadingService) {}

    preShow(): Observable<any> {
        return of(null);
    }

    postShow(svrConfig: any): Observable<any> {
        return of(null);
    }

    postGetSvrConfig(svrConfig: any): void {}

    preSubmit(svrConfig: any, formValue: any): Observable<any> {
        // if (svrConfig.procedure.procedureId === 'operate') {
        //     // 这个默认值要加上
        //     formValue.factoringPrice = XnUtils.getDefaultValueByName(svrConfig, 'factoringPrice');
        // }

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
                json.data.flowId = 'financing_factoring7';
                const contracts = [...json.data].filter(x => !x.hide);
                contracts.forEach(element => {
                    if (!element.config) {
                        element.config = {
                            text: ''
                        };
                    }
                });
                contracts[0].config.text =
                    '乙方（保理商、受让人）数字签名';
                contracts[1].config.text = '乙方（受让方）';
                contracts[2].config.text = '乙方（受让方）';
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
        return null;
    }
}
