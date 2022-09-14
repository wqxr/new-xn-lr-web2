import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MsgBoxService } from 'libs/shared/src/lib/services/msg-box.service';
import { PublicCommunicateService } from 'libs/shared/src/lib/services/public-communicate.service';
import { XnService } from 'libs/shared/src/lib/services/xn.service';

@Injectable({ providedIn: 'root' })
export class BankFormService {
    private tempData: any;

    private honourFile: any;

    constructor(
        private xn: XnService,
        private msgBox: MsgBoxService,
        private publicCommunicateService: PublicCommunicateService
    ) {}

    onValueChanges(form: FormGroup, rows) {
        // 电票扫描件值改变
        form.get('honourFile').valueChanges.subscribe(val => {
            if (!val) {
                this.resetValues(form, rows);
                return;
            }

            this.tempData = null;
            const res = JSON.parse(val);
            this.honourFile = res[res.length - 1];
            this.xn.api
                .postMap('/llz/financing/add_honour', {
                    flowId: 'financing7',
                    honourNum: this.honourFile.honourNum,
                    honourDate: this.honourFile.honourDate,
                    dueDate: this.honourFile.dueDate,
                    factoringDate: this.honourFile.factoringDate
                })
                .subscribe(json => {
                    if (json && json.msg) {
                        this.publicCommunicateService.change.emit({
                            honourInvalid: true
                        });
                        this.msgBox.open(false, json.msg);
                        return;
                    }

                    const data = json.data;

                    // 更新 保理商选项
                    if (data.factoringOrg.length) {
                        this.getRow(
                            rows,
                            'factoringApp'
                        ).selectOptions = data.factoringOrg.map(item => {
                            return {
                                label: `${item.factoringId}-${
                                    item.factoringName
                                }`,
                                value: item.factoringId
                            };
                        });

                        form.get('factoringApp').reset('');
                    } else {
                        const ctrl = form.get('factoringApp');

                        ctrl.markAsTouched();
                        ctrl.setErrors({ customer: '暂无可选保理商' });
                    }

                    // 更新 融资银行 选项
                    if (data.bankOrg.length) {
                        this.getRow(
                            rows,
                            'financingBank'
                        ).selectOptions = data.bankOrg.map(item => {
                            return {
                                label: `${item.bankId}-${item.bankName}`,
                                value: item.bankId
                            };
                        });

                        form.get('financingBank').reset('');
                    } else {
                        const ctrl = form.get('financingBank');
                        ctrl.markAsTouched();
                        ctrl.setErrors({ customer: '暂无可选银行' });
                    }

                    // 保理商详情
                    this.initFactoringList(form, rows, data.factoringList);

                    // 融资银行详情
                    this.initBankList(form, rows, data.bankList);

                    if (data.platformOrg && data.platformOrg.length) {
                        // 核心企业
                        form.get('enterprise').setValue(
                            data.platformOrg[0].orgName
                        );

                        // 核心企业类型
                        form.get('enterpriseType').setValue(
                            data.platformOrg[0].orgType
                        );

                        // 平台服务费率
                        form.get('platformFWF').setValue(
                            data.platformOrg[0].platformFWF
                        );

                        // 参考综合融资成本
                        // form.get('financingCost').setValue(
                        //     data.platformOrg[0].platformFWF
                        // );
                    }

                    this.tempData = data;
                });
        });

        // 保理商选项值改变
        form.get('factoringApp').valueChanges.subscribe(val => {
            if (!this.tempData || !form.get('honourFile').value) {
                return;
            }

            this.resetFinancingCostIfValueEmpty(form, val);

            this.xn.api
                .postMap('/llz/financing/factoring_list', {
                    enterpriseId: this.tempData.platformOrg.length
                        ? this.tempData.platformOrg[0].appId
                        : '',
                    factoringId: val
                })
                .subscribe(json => {
                    if (json && json.msg) {
                        this.publicCommunicateService.change.emit({
                            honourInvalid: true
                        });
                        this.msgBox.open(false, json.msg);
                        return;
                    }

                    const data = json.data;
                    this.initFactoringList(form, rows, data.factoringList);
                    this.calFinancingCost(form, rows);
                });
        });

        // 融资银行选项值改变
        form.get('financingBank').valueChanges.subscribe(val => {
            if (!this.tempData || !form.get('honourFile').value) {
                return;
            }

            this.resetFinancingCostIfValueEmpty(form, val);

            this.xn.api
                .postMap('/llz/financing/bank_list', {
                    enterpriseId: this.tempData.platformOrg.length
                        ? this.tempData.platformOrg[0].appId
                        : '',
                    factoringDate: this.tempData.platformOrg.length
                        ? this.tempData.platformOrg[0].factoringDate
                        : '',
                    dueDate: this.tempData.platformOrg.length
                        ? this.tempData.platformOrg[0].dueDate
                        : '',
                    bankId: val
                })
                .subscribe(json => {
                    if (json && json.msg) {
                        this.publicCommunicateService.change.emit({
                            honourInvalid: true
                        });
                        this.msgBox.open(false, json.msg);
                        return;
                    }

                    const data = json.data;
                    this.initBankList(form, rows, data.bankList);
                    this.calFinancingCost(form, rows);
                });
        });
    }

    prepareData(formValue) {
        if (formValue.factoringApp) {
            formValue.factoringApp = JSON.stringify([
                {
                    label: this.tempData.factoringOrg.find(
                        (x: any) => x.factoringId === formValue.factoringApp
                    ).factoringName,
                    value: formValue.factoringApp
                }
            ]);
        }

        if (formValue.financingBank) {
            formValue.financingBank = JSON.stringify([
                {
                    label: this.tempData.bankOrg.find(
                        (x: any) => x.bankId === formValue.financingBank
                    ).bankName,
                    value: formValue.financingBank
                }
            ]);
        }

        if (formValue.enterprise) {
            formValue.enterprise = JSON.stringify([
                {
                    label: this.tempData.platformOrg.length
                        ? this.tempData.platformOrg[0].orgName
                        : '',
                    value: this.tempData.platformOrg.length
                        ? this.tempData.platformOrg[0].appId
                        : ''
                }
            ]);
        }
    }

    private getRow(rows, name) {
        return rows.find((x: any) => x.name === name);
    }

    // 设置保理商详情
    private initFactoringList(
        form: FormGroup,
        rows,
        factoringList: Array<any>
    ) {
        const data = factoringList.map(item => {
            return {
                factoringName: item[0],
                cardCode: item[1],
                bankName: item[2],
                bankCodeNo: item[3],
                factoringFWF: item[4]
            };
        });
        this.getRow(rows, 'factoringInfo').data = data;
        form.get('factoringInfo').setValue(JSON.stringify(data));
    }

    // 设置融资银行详情
    private initBankList(form: FormGroup, rows, bankList: Array<any>) {
        const data = bankList.map(item => {
            return {
                bankName: item[0],
                bankCodeNo: item[1],
                interestRate: item[2]
            };
        });
        this.getRow(rows, 'financingBankInfo').data = data;
        form.get('financingBankInfo').setValue(JSON.stringify(data));
    }

    private resetValues(form, rows) {
        const emptyOptions = [];
        this.getRow(rows, 'factoringApp').selectOptions = emptyOptions;
        this.getRow(rows, 'financingBank').selectOptions = emptyOptions;

        form.get('factoringApp').reset('');
        form.get('financingBank').reset('');

        this.initFactoringList(form, rows, []);
        this.initBankList(form, rows, []);
        form.get('financingCost').reset('');
    }

    private calFinancingCost(form, rows) {
        if (
            form.get('factoringApp').value &&
            form.get('financingBank').value &&
            form.get('factoringInfo').value &&
            form.get('financingBankInfo')
        ) {
            const factoringInfo = +JSON.parse(
                form.get('factoringInfo').value
            )[0].factoringFWF;
            const financingBankInfo = +JSON.parse(
                form.get('financingBankInfo').value
            )[0].interestRate;
            const platformFWF = +form.get('platformFWF').value;

            const total = factoringInfo + financingBankInfo + platformFWF;

            form.get('financingCost').setValue(total);
        }
    }

    private resetFinancingCostIfValueEmpty(form, val) {
        if (!val) {
            form.get('financingCost').reset('');
        }
    }
}
