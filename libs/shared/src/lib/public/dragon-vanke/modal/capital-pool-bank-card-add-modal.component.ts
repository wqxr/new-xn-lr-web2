import { Component, OnInit, ViewChild } from '@angular/core';
import { Observable, of } from 'rxjs';
import { FormGroup } from '@angular/forms';
import { ModalComponent, ModalSize } from '../../../common/modal/ng2-bs3-modal';
import { XnService } from '../../../services/xn.service';
import { XnFormUtils } from '../../../common/xn-form-utils';

/**
 *  资产池添加银行卡信息
 */
@Component({
    templateUrl: './capital-pool-bank-card-add-modal.component.html'
})
export class CapitalPoolBankCardAddModalComponent implements OnInit {
    // 传入的数据
    public params: any;
    public shows: any;
    public form: FormGroup;
    @ViewChild('modal')
    modal: ModalComponent;
    private observer: any;
    public formModule = 'dragon-input';

    public constructor(private xn: XnService) {
    }

    //     a、期数：
    //     b、买卖协议编号：
    //     c、服务协议编号：
    open(params: any): Observable<string> {
        this.params = params;
        // 构造row
        this.shows = [
            {
                checkerId: 'managerBankInfo',
                name: 'managerBankInfo',
                required: false,
                type: 'bank-single',
                title: '管理人银行信息',
                options: {
                    accountName: true,
                    accountNumber: true,
                    bankName: true
                },
                value: JSON.stringify({
                    accountName: this.params.managerAccountName, // 管理人账户名
                    accountNumber: this.params.managerAccountNo, // 管理人账号
                    bankName: this.params.managerBankName // 管理人开户行名称
                }),
                memo: ''
            },
            {
                checkerId: 'factoringBankInfo',
                name: 'factoringBankInfo',
                required: false,
                type: 'bank-single',
                title: '保理商银行信息',
                options: {
                    accountName: true,
                    accountNumber: true,
                    bankName: true
                },
                value: JSON.stringify({
                    accountName: this.params.factoringAccountName, // 保理商账户名
                    accountNumber: this.params.factoringAccountNo, // 保理商账号
                    bankName: this.params.factoringBankName // 保理商开户行名称
                }),
                memo: ''
            },
            {
                checkerId: 'managerInfo',
                required: false,
                type: 'manager-info',
                title: '管理人信息',
                value: JSON.stringify({
                    // salesAgreementNumber: this.params.salesAgreementNumber,
                    periods: this.params.managerPeriods, // 管理人期数
                    salesAgreementNumber: this.params.managerSalesAgreementNumber, // 管理人买卖协议编号
                    serviceAgreementNumber: this.params.managerServiceAgreementNumber, // 管理人服务协议编号
                    capitalManageNum: this.params.capitalManageNum,      // 资产管理计划编号
                    // headquarters: this.params.headquarters
                }),
                memo: ''
            },
            {
                checkerId: 'contractInfo',
                required: false,
                type: 'contract-info',
                title: '合同编号信息',
                value: JSON.stringify({
                    codeFactoringPayConfirm: this.params.codeFactoringPayConfirm, // 《付款确认书（总部致保理商）》编号
                    codeBrokerPayConfirm: this.params.codeBrokerPayConfirm, // 《付款确认书（总部致券商）》编号
                    codeNotice2: this.params.codeNotice2, // 《致总部公司通知书（二次转让）》编号
                    codeReceipt2: this.params.codeReceipt2, // 《总部公司回执（二次转让）》编号
                }),
                memo: ''
            }
        ];
        XnFormUtils.buildSelectOptions(this.shows);
        this.buildChecker(this.shows);
        this.form = XnFormUtils.buildFormGroup(this.shows);
        this.modal.open(ModalSize.Large);
        return Observable.create(observer => {
            this.observer = observer;
        });
    }

    public ngOnInit() {
    }

    public onSubmit() {
        // 管理人银行信息
        const managerBankInfo =
            typeof this.form.value.managerBankInfo === 'string' && this.form.value.managerBankInfo !== ''
                ? JSON.parse(this.form.value.managerBankInfo)
                : this.form.value.managerBankInfo;

        // 保理商银行信息
        const factoringBankInfo =
            typeof this.form.value.factoringBankInfo === 'string' && this.form.value.factoringBankInfo !== ''
                ? JSON.parse(this.form.value.factoringBankInfo)
                : this.form.value.factoringBankInfo;

        // 管理人信息
        const managerInfo =
            typeof this.form.value.managerInfo === 'string' && this.form.value.capitalBankInfo !== ''
                ? JSON.parse(this.form.value.managerInfo)
                : this.form.value.managerInfo;

        // 合同编号信息
        const contractInfo =
            typeof this.form.value.contractInfo === 'string' && this.form.value.contractInfo !== ''
                ? JSON.parse(this.form.value.contractInfo)
                : this.form.value.contractInfo;

        const params1 = {
            capitalPoolId: this.params.capitalPoolId,
            managerAccountName: managerBankInfo.accountName || '',
            managerBankName: managerBankInfo.bankName || '',
            managerAccountNo: managerBankInfo.accountNumber || '',

            factoringAccountName: factoringBankInfo.accountName || '',
            factoringAccountNo: factoringBankInfo.accountNumber || '',
            factoringBankName: factoringBankInfo.bankName || '',

            managerPeriods: managerInfo.periods || '',
            managerSalesAgreementNumber: managerInfo.salesAgreementNumber || '',
            managerServiceAgreementNumber: managerInfo.serviceAgreementNumber || '',
            capitalManageNum: managerInfo.capitalManageNum || '',   // 资产管理计划编号

            ...contractInfo,
        };
        this.xn.api.dragon
            .post('/pool/bind', params1)
            .subscribe(x => {
                if (x.ret === 0) {
                    this.close('ok');
                }
            });
    }

    public onCancel() {
        this.close('');
    }

    private close(value) {
        this.modal.close();
        this.observer.next(value);
        this.observer.complete();
    }

    private buildChecker(stepRows) {
        for (const row of stepRows) {
            XnFormUtils.convertChecker(row);
        }
    }
}
