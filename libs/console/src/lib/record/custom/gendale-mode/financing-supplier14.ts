import { Observable, of } from 'rxjs';

import { IFlowCustom } from '../../flow.custom';
import { XnService } from 'libs/shared/src/lib/services/xn.service';
import { FinancingFactoringVankeModalComponent } from 'libs/shared/src/lib/public/modal/financing-factoring-vanke-modal.component';

/**
 *  金地模式3.0-供应商上传资料
 */
export class FinancingSupplier14Flow implements IFlowCustom {
    constructor(private xn: XnService) { }

    preShow(): Observable<any> {
        return of(null);
    }

    postShow(svrConfig: any): Observable<any> {
        return of(null);
    }

    postGetSvrConfig(svrConfig: any): void { }

    preSubmit(svrConfig: any, formValue: any): Observable<any> {
        try {
            const reg = new RegExp(',', 'g');
            const payables = formValue.payables;
            const payable = parseFloat(formValue.payables.replace(reg , '')).toFixed(2) || 0;
            let contractFile = formValue.contractFile;
            const transferAll = JSON.parse(formValue.invoiceFile);
            const transferAmount = this.computeSum(transferAll.filter(v =>
                v && v.transferMoney).map(v => Number(v.transferMoney))).toFixed(2) || 0;
            if (transferAmount !== payable) {
                this.xn.msgBox.open(false, '转让金额总和不等于应收账款金额，无法提交');
                return;
            }
            let amount = 0;
            contractFile = JSON.parse(contractFile);
            contractFile.forEach(c => {
                !!parseFloat(c.files.contractAmount) ? amount += parseFloat(c.files.contractAmount) : amount += 0;
            });
            if (payables > amount) {
                this.xn.msgBox.open(false, '合同金额小于应收账款金额，无法提交');
                return;
            }
        } catch (e) {

        }
        return of(null);
    }

    // preSubmit(svrConfig: any, formValue: any): Observable<any> {
    //     if (svrConfig.procedure.procedureId !== 'review') {
    //         return of(null);
    //     }

    //     let contracts = JSON.parse(svrConfig.actions[0].contracts);
    //     contracts = contracts.filter(v => v.label !== '应收账款转让通知书(债权人-->付款人)' && v.label !== '应收账款转让通知书(债权人-->债务人)');

    //     contracts['flowId'] = 'financing_supplier6';
    //     contracts.forEach(element => {
    //         if (!element['config']) {
    //             element['config'] = {
    //                 text: ''
    //             };
    //         }
    //     });
    //     contracts.forEach(x => {
    //         if (x.label === '国内无追索权商业保理合同') {
    //             x['config']['text'] = '乙方（保理商、受让人）数字签名';

    //         } else if (x.label === '应收账款转让协议书(债权人<-->保理商)' || x.label === '应收账款转让登记协议(债权人<-->保理商)') {
    //             x['config']['text'] = '乙方（受让方）';
    //         } else {
    //             x['config']['text'] = '（盖章）';
    //         }
    //     });
    //     return of({
    //         action: 'modal',
    //         modal: FinancingFactoringVankeModalComponent,
    //         params: contracts
    //     });
    // }
    private computeSum(array) {
        return array.reduce((prev, curr, idx, arr) => {
            return prev + curr;
        });
    }

    getTitleConfig(): any {
        return {
            hideTitle: true,
            def: `《${this.xn.user.orgName}》的交易申请`
        };
    }
}
