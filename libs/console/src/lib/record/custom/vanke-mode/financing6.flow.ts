import { IFlowCustom } from '../../flow.custom';
import { LoadingService } from 'libs/shared/src/lib/services/loading.service';
import { XnService } from 'libs/shared/src/lib/services/xn.service';
import { Observable, of } from 'rxjs';
import XnFlowUtils from 'libs/shared/src/lib/common/xn-flow-utils';
import { XnUtils } from 'libs/shared/src/lib/common/xn-utils';
import { FinancingFactoringVankeModalComponent } from 'libs/shared/src/lib/public/modal/financing-factoring-vanke-modal.component';
import { map } from 'rxjs/operators';
import { HeadquartersTypeEnum } from 'libs/shared/src/lib/config/select-options';

/**
 *  保理商审核 万科abs
 */
export class Financing6Flow implements IFlowCustom {

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

        if (svrConfig.procedure.procedureId === '@begin') {
            formValue.title = '《' + JSON.parse(svrConfig.constParams.checkers.supplier).label + '》放款申请';
        }

        if (svrConfig.procedure.procedureId !== 'review') {
            let payables = formValue.payables.toString().replace(/,/g, '');
            let contractFile = formValue.contractFile;
            let invoiceFile = formValue.invoiceFile;
            payables = parseFloat(payables);
            try {
                contractFile = JSON.parse(contractFile);
                const amount = contractFile.reduce((total, next) => {
                    if (next.files.contractAmount) {
                        total += parseFloat(next.files.contractAmount);
                    }
                    return total;
                }, 0).toFixed(2);
                // 只有在填了合同金额时，比较合同金额和应收账款金额大小
                if (parseFloat(payables) > parseFloat(amount) && parseFloat(amount) > 0) {
                    this.xn.msgBox.open(false, '合同金额小于应收账款金额，无法提交');
                    return of({
                        action: 'stop',
                    });
                }
            } catch (e) {
                console.log('msg:', e);
            }

            try {
                invoiceFile = JSON.parse(invoiceFile);
                const statusList = invoiceFile.filter(x => x.status === 4 || x.status === 6 || x.status === 7 || x.status === 8);
                if (statusList.length > 0) {
                    this.xn.msgBox.open(false, `发票状态异常，删除请重新提交`);
                    return of({
                        action: 'stop',
                    });
                }
                const amount = invoiceFile.reduce((total, next) => {
                    if (next.invoiceAmount) {
                        total += parseFloat(next.invoiceAmount);
                    }
                    return total;
                }, 0).toFixed(2);
                if (parseFloat(payables) > parseFloat(amount)) {
                    this.xn.msgBox.open(false, '发票金额小于应收账款金额，无法提交');
                    return of({
                        action: 'stop',
                    });
                }

            } catch (e) {

            }

            // 不做操作
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

        if (svrConfig.actions[0].checkers[0].data === HeadquartersTypeEnum[3] && this.xn.user.orgType === 1) {
            return of(null);
        }
        XnUtils.checkLoading(this);

        return this.xn.api.post('/record/record?method=pre_submit', params)
            .pipe(map(json => {
                // console.log(json, 'pre_submit');
                json.data.flowId = 'financing6';
                const contracts = json.data;
                contracts.forEach(element => {
                    if (!element.config) {
                        element.config = {
                            text: ''
                        };
                    }
                });
                contracts.forEach(x => {
                    if (x.label.includes('国内无追索权商业保理合同')) {
                        x.config.text = '甲方（债权人、出让人）数字签名';
                    } else if (x.label.includes('应收账款转让协议书') || x.label.includes('应收账款转让登记协议')) {
                        x.config.text = '甲方（出让方）';
                    } else if (x.label.includes('公开型无追索权国内保理合同')) {
                        x.config.text = '卖方（盖章）';
                    } else if (x.label.includes('应收账款债权转让通知书')) {
                        x.config.text = '（公章）';
                    } else {
                        x.config.text = '（盖章）';
                    }
                });
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
            def: `《${this.xn.user.orgName}》的交易申请`
        };
    }
}
