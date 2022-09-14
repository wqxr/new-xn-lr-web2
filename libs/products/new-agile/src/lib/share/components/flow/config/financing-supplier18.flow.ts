import { Observable, of } from 'rxjs';
import { IFlowCustom } from './flow.custom';
import { XnService } from 'libs/shared/src/lib/services/xn.service';
import { LoadingService } from 'libs/shared/src/lib/services/loading.service';
import { EnterpriseMenuEnum } from 'libs/shared/src/lib/common/enums';
import { HeadquartersTypeEnum } from 'libs/shared/src/lib/config/select-options';



/**
 *  保理商审核资料
 */
export class FinancingSupplier18Flow implements IFlowCustom {

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
        try {
            const reg = new RegExp(',', 'g');
            const payables = formValue.payables;
            const payable = parseFloat(formValue.payables.replace(reg, '')).toFixed(2) || 0;
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
        if (svrConfig.procedure.procedureId !== 'review') {
            return of(null);
        }

        // 如果生成雅居乐，则不需要生成合同
        if (this.calcHeadquarters(svrConfig.actions) === HeadquartersTypeEnum[4] && this.xn.user.orgType === EnterpriseMenuEnum.PLATFORM) {
            return of(null);
        }

        return of(null);

        // 如果不是雅居乐时候，直接取合同弹框 ^-^~~~
        // let contracts = svrConfig.actions[0].contracts !== '' ? JSON.parse(svrConfig.actions[0].contracts) : [];
        // contracts = contracts.filter(v => !v.label.includes('应收账款转让通知书') && !v.label.includes('卖方通知'));

        // contracts['flowId'] = 'financing_supplier18';
        // contracts.forEach(element => {
        //     if (!element['config']) {
        //         element['config'] = {
        //             text: ''
        //         };
        //     }
        // });
        // contracts.forEach(x => {
        //     if (x.label.includes('国内无追索权商业保理合同')) {
        //         x['config']['text'] = '乙方（保理商、受让人）数字签名';

        //     } else if (x.label.includes('公开型无追索权国内保理合同')) {
        //         x['config']['text'] = '保理商（盖章）';
        //     } else if (x.label.includes('应收账款转让协议书') || x.label.includes('应收账款转让登记协议')) {
        //         x['config']['text'] = '乙方（受让方）';
        //     } else {
        //         x['config']['text'] = '（盖章）';
        //     }
        // });
        // return of({
        //     action: 'modal',
        //     modal: FinancingFactoringVankeModalComponent,
        //     params: contracts
        // });
    }

    getTitleConfig(): any {
        return null;
    }

    private computeSum(array) {
        return array.reduce((prev, curr, idx, arr) => {
            return prev + curr;
        });
    }

    // 计算总部公司
    private calcHeadquarters(array: any[]): string {
        if (array.length) {
            const find = array.find((x: any) => x.procedureId === 'operate');
            if (find) {
                return find.checkers[0].data;
            }
            return '';
        }
        return '';
    }

}
