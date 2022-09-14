import {Component, OnInit, ViewChild} from '@angular/core';
import {Observable, of} from 'rxjs';
import {ModalComponent, ModalSize} from '../../common/modal/components/modal';
import {FormGroup} from '@angular/forms';
import {XnFormUtils} from '../../common/xn-form-utils';
import {XnService} from '../../services/xn.service';

/**
 *  资产池添加银行卡信息
 */
@Component({
    templateUrl: './bank-card-add-modal.component.html'
})
export class BankCardAddModalComponent implements OnInit {
    // 传入的数据
    public params: any;
    public shows: any;
    public form: FormGroup;
    @ViewChild('modal')
    modal: ModalComponent;
    private observer: any;

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
                checkerId: 'capitalBankInfo',
                name: 'capitalBankInfo',
                required: false,
                type: 'bank-single',
                title: '银行信息',
                options: {
                    accountName: true,
                    accountNumber: true,
                    bankName: true
                },
                value: JSON.stringify({
                    accountName: this.params.accountName,
                    accountNumber: this.params.accountNo,
                    bankName: this.params.bankName
                }),
                memo: ''
            },
            {
                checkerId: 'managerInfo',
                required: false,
                type: 'manager-info',
                title: '管理人信息',
                value: JSON.stringify({
                    salesAgreementNumber: this.params.salesAgreementNumber,
                    periods: this.params.periods,
                    serviceAgreementNumber: this.params.serviceAgreementNumber,
                    payConfirmId: this.params.payConfirmId,
                    headquarters: this.params.headquarters,
                    capitalManageNum: this.params.capitalManageNum || '',
                    capitalPeriodNum: this.params.capitalPeriodNum || ''
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
        // 银行信息
        const capitalBankInfo =
            typeof this.form.value.capitalBankInfo === 'string' && this.form.value.capitalBankInfo !== ''
                ? JSON.parse(this.form.value.capitalBankInfo)
                : this.form.value.capitalBankInfo;
        // 管理人信息
        const managerInfo =
            typeof this.form.value.managerInfo === 'string' && this.form.value.capitalBankInfo !== ''
                ? JSON.parse(this.form.value.managerInfo)
                : this.form.value.managerInfo;
        const params1 = {
            capitalPoolId: this.params.capitalPoolId,
            accountName: capitalBankInfo.accountName || '',
            bankName: capitalBankInfo.bankName || '',
            accountNo: capitalBankInfo.accountNumber || '',
            periods: managerInfo.periods || '',
            salesAgreementNumber: managerInfo.salesAgreementNumber || '',
            serviceAgreementNumber: managerInfo.serviceAgreementNumber || '',
            capitalManageNum: managerInfo.capitalManageNum || '',
            capitalPeriodNum: managerInfo.capitalPeriodNum || ''
        };
        this.xn.api
            .post('/ljx/capital_pool/update_bank_info', params1)
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
