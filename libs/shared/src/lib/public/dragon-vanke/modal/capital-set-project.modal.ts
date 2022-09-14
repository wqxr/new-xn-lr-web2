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
    templateUrl: './capital-set-project.modal.html'
})
export class CapitalPoolsetProjectPlanModalComponent implements OnInit {
    // 传入的数据
    public params: any;
    public shows: any;
    public form: FormGroup;
    @ViewChild('modal')
    modal: ModalComponent;
    private observer: any;
    public projectId: string;
    public formModule = 'dragon-input';
    public title = '';

    public constructor(private xn: XnService) {
    }

    //     a、期数：
    //     b、买卖协议编号：
    //     c、服务协议编号：
    open(params: any): Observable<string> {
        if (params.type === 2) {
            this.params = params;
            this.projectId = params.project;
            this.title = '设立专项计划';
        } else {
            this.title = '修改发行要素';
            this.params = { ...params.project, type: 1,isLoganBoshi: params.isLoganBoshi };
        }
        const shows = [
            {
                checkerId: 'capitalPoolName',
                name: 'capitalPoolName',
                required: 1,
                type: 'text',
                title: '资产池名称',
                value: this.params.type === 2 ? '' : this.params.capitalPoolName,
            },
            {
                checkerId: 'managerInfo',
                required: false,
                type: 'manager-info',
                title: '专项计划信息',
                value: this.params.type === 2 ? JSON.stringify({
                    // salesAgreementNumber: this.params.salesAgreementNumber,
                    periods: '', // 管理人期数
                    salesAgreementNumber: '', // 管理人买卖协议编号
                    serviceAgreementNumber: '', // 管理人服务协议编号
                    capitalPeriodNum: '', // 专项计划期数
                    capitalManageNum: '', // 专项计划编号
                    applyExpires: '',  // 申请期限
                    factoringProcedureRate: '',   // 保理手续费率
                    succeededRate: '',  // 承购费率
                    // hidden:params.hidden // 隐藏期数
                    // headquarters: this.params.headquarters
                }) : JSON.stringify({
                    // salesAgreementNumber: this.params.salesAgreementNumber,
                    periods: this.params.managerPeriods || '', // 管理人期数
                    salesAgreementNumber: this.params.managerSalesAgreementNumber || '', // 管理人买卖协议编号
                    serviceAgreementNumber: this.params.managerServiceAgreementNumber || '', // 管理人服务协议编号
                    capitalPeriodNum: this.params.capitalPeriodNum,
                    capitalManageNum: this.params.capitalManageNum,
                    // headquarters: this.params.headquarters
                    applyExpires: this.params.applyExpires,
                    factoringProcedureRate: this.params.factoringProcedureRate,
                    succeededRate: this.params.succeededRate,
                    // hidden:params.hidden // 隐藏期数
                }),
                memo: ''
            },
            {
                checkerId: 'factoringBankInfo',
                name: 'factoringBankInfo',
                required: false,
                type: 'bank-input',
                title: '原始权益人回款账户信息',
                options: {
                    accountName: true,
                    accountNumber: true,
                    bankName: true
                },
                value: this.params.type === 2 ? JSON.stringify({
                    accountName: '', // 管理人账户名
                    accountNumber: '', // 管理人账号
                    bankName: '' // 管理人开户行名称
                }) :
                    JSON.stringify({
                        accountName: this.params.factoringAccountName || '', // 管理人账户名
                        accountNumber: this.params.factoringAccountNo || '', // 管理人账号
                        bankName: this.params.factoringBankName || ''  // 管理人开户行名称
                    }),
                memo: ''
            },
            {
                checkerId: 'managerBankInfo',
                name: 'managerBankInfo',
                required: false,
                type: 'bank-input',
                title: '托管行信息',
                options: {
                    accountName: true,
                    accountNumber: true,
                    bankName: true
                },
                value: this.params.type === 2 ? JSON.stringify({
                    accountName: '', // 管理人账户名
                    accountNumber: '', // 管理人账号
                    bankName: '' // 管理人开户行名称
                }) :
                    JSON.stringify({
                        accountName: this.params.managerAccountName || '', // 保理商账户名
                        accountNumber: this.params.managerAccountNo || '', // 保理商账号
                        bankName: this.params.managerBankName || '' // 保理商开户行名称
                    }),
                memo: ''
            }
        ];
        if (params.isVanke) { // 万科-修改发型要素
            // 构造row
            this.shows = [...shows];
        } else { // 龙光-修改发型要素
            // 构造row
            this.shows = [...shows,
            {
                checkerId: 'contractInfo',
                required: false,
                type: 'contract-info',
                title: '合同编号信息',
                value: this.params.type === 2 ? JSON.stringify({
                    codeFactoringPayConfirm: '', // 管理人账户名
                    codeBrokerPayConfirm: '', // 管理人账号
                    codeNotice2: '', // 管理人开户行名称
                    codeReceipt2: '',
                }) : JSON.stringify({
                    codeFactoringPayConfirm: this.params.codeFactoringPayConfirm, // 《付款确认书（总部致保理商）》编号
                    codeBrokerPayConfirm: this.params.codeBrokerPayConfirm, // 《付款确认书（总部致券商）》编号
                    codeNotice2: this.params.codeNotice2, // 《致总部公司通知书（二次转让）》编号
                    codeReceipt2: this.params.codeReceipt2, // 《总部公司回执（二次转让）》编号
                }),
                memo: '',
                isLoganBoshi: this.params.isLoganBoshi ? true : false
            }];
        }

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
            capitalPoolName: this.form.value.capitalPoolName,
            managerAccountName: managerBankInfo.accountName || '',
            managerBankName: managerBankInfo.bankName || '',
            managerAccountNo: managerBankInfo.accountNumber || '',

            factoringAccountName: factoringBankInfo.accountName || '',
            factoringAccountNo: factoringBankInfo.accountNumber || '',
            factoringBankName: factoringBankInfo.bankName || '',

            managerPeriods: managerInfo.periods || '',
            managerSalesAgreementNumber: managerInfo.salesAgreementNumber || '',
            managerServiceAgreementNumber: managerInfo.serviceAgreementNumber || '',
            capitalPeriodNum: managerInfo.capitalPeriodNum || '',
            capitalManageNum: managerInfo.capitalManageNum || '',
            applyExpires: managerInfo.applyExpires,
            factoringProcedureRate: managerInfo.factoringProcedureRate,
            succeededRate: managerInfo.succeededRate,
            ...contractInfo,
        };
        if (this.params.type === 2) {
            const params = { ...params1, project_manage_id: this.projectId };
            this.xn.api.dragon
                .post('/project_manage/pool/pool_add', params)
                .subscribe(x => {
                    if (x.ret === 0) {
                        this.close('ok');
                    }
                });
        } else if (this.params.type === 1) {
            const params2 = { ...params1, capitalPoolId: this.params.capitalPoolId };
            this.xn.api.dragon
                .post('/project_manage/pool/pool_alter_info', params2)
                .subscribe(x => {
                    if (x.ret === 0) {
                        this.close('ok');
                    }
                });

        }


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
