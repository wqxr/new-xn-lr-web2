/*
 * Copyright(c) 2017-2019, 深圳市链融科技股份有限公司
 * Beijing Xiwei Technology Co., Ltd.
 * All rights reserved.
 *
 * @file：money-input.component.ts
 * @summary：金额显示
 * @version: 1.0
 * **********************************************************************
 * revision             author            reason                date
 * 1.0                 zhyuanan       添加注释，修复金额更新   2019-03-22
 * **********************************************************************
 */

import {Component, Input, ElementRef, ViewChild, AfterViewChecked, OnChanges} from '@angular/core';
import {FormGroup, AbstractControl} from '@angular/forms';
import {XnFormUtils} from '../../common/xn-form-utils';
import {XnUtils} from '../../common/xn-utils';
import {XnInputOptions} from './xn-input.options';
import {PublicCommunicateService} from '../../services/public-communicate.service';
import { AmountControlCommService } from 'libs/console/src/lib/risk-control/transaction-control/amount/amount-control-comm.service';

@Component({
    selector: 'xn-money-input',
    templateUrl: './money-input.component.html',
    styles: [
            `.xn-money-alert {
            color: #8d4bbb;
            font-size: 12px;
        }

        .red {
            color: #e15f63
        }`,
    ]
})
export class MoneyInputComponent implements OnChanges, AfterViewChecked {

    @Input() row: any;
    @Input() form: FormGroup;
    @ViewChild('input', { static: true }) input: ElementRef;
    @ViewChild('moneyAlertRef', { static: true }) moneyAlertRef: ElementRef;
    public myClass = ''; // 控件样式
    public alert = ''; // 错误提示
    public moneyAlert = ''; // 金额提示
    public ctrl: AbstractControl;
    public xnOptions: XnInputOptions;
    public ctrlWith = false; // 特殊属性
    public amounts: any;
    // 存储应收账款金额
    public cacheMoney: any;

    // payables应收账款 ，financingAmount融资金额
    constructor(private er: ElementRef,
                private publicCommunicateService: PublicCommunicateService,
                private amountControlCommService: AmountControlCommService) {
    }

    ngOnChanges() {
        this.publicCommunicateService.change.subscribe(x => {
            this.cacheMoney = x; // 存储应收账款金额 |// (this.row.flowId === 'financing6' && this.row.checkerId === 'payables')
            if ((this.row.flowId === 'financing13' && this.row.checkerId === 'money') && !isNaN(Number(x))) {
                this.amounts = x;
            }
            if (this.amounts > 0) {
                this.ctrl = this.form.get(this.row.name);
                this.input.nativeElement.value = this.amounts;
                this.ngAfterViewChecked();
                this.onInput1();
            }
        });
        this.amountControlCommService.change.subscribe(x => {
            if (this.row.flowId === 'financing_enterprise_m' && this.row.checkerId === 'amount') {
                this.input.nativeElement.value = x.amount;
                this.ngAfterViewChecked();
                this.onInput1();
            }
        });
        // 获取核心企业授信金额
        this.amountControlCommService.change1.subscribe(x => {
            if (this.row.flowId === 'financing_enterprise_m' && this.row.checkerId === 'amount') {
                this.input.nativeElement.value = x.amount;
                this.ngAfterViewChecked();
                this.onInput1();
            } else if (this.row.flowId === 'financing_supplier_enterprise' && this.row.checkerId === 'amount') { // 供应商修改额度，获取的核心企业额度
                this.cacheMoney = x.amount; // 暂存金额
            }
        });
        // 获取供应商历史平均交易金额
        this.amountControlCommService.change.subscribe(x => {
            if (this.row.flowId === 'financing_supplier_enterprise' && this.row.checkerId === 'transactionAmountHistoryAverage') {
                this.input.nativeElement.value = x.averageAmount;
                this.ngAfterViewChecked();
                this.onInput1();
            }
        });
        // 获取供应商额度
        this.amountControlCommService.rate.subscribe(x => {
            if (this.row.flowId === 'financing_supplier_enterprise' && this.row.checkerId === 'amount') {
                if (!!this.cacheMoney) {
                    const amount = parseFloat(x) * parseFloat(this.cacheMoney) / 100;
                    this.input.nativeElement.value = amount;
                    this.ngAfterViewChecked();
                    this.onInput1();
                }
            }
        });

        if (!this.row.placeholder) {
            this.row.placeholder = '';
        }
        this.ctrl = this.form.get(this.row.name);
        this.ctrlWith = this.row.options && this.row.options.with === 'picker';
        this.fromValue();
        this.xnOptions = new XnInputOptions(this.row, this.form, this.ctrl, this.er);
        this.ctrl.valueChanges.subscribe(() => {
            this.moneyFormat(); // 将拉取到的数据进行money格式化
            this.calcAlertClass();
            this.maxAmount(this.input.nativeElement.value);
        });
    }

    ngAfterViewChecked() {
        if (this.ctrl && !!this.ctrl.value && !this.input.nativeElement.value) {
            const a = setTimeout(() => {
                clearTimeout(a);
                this.fromValue();
                this.calcAlertClass();
                // console.log("run");
                return;
            }, 0);
        }

        if (this.ctrlWith) {
            if (this.input.nativeElement.value === '') {
                setTimeout(() => {
                    if (this.input.nativeElement.value === '') {
                        this.moneyAlert = '';
                    }
                }, 0);
                return;
            }
            if (isNaN(parseInt(this.ctrl.value, 0)) && this.input.nativeElement.value !== '') {
                this.input.nativeElement.value = 0;
                const ret = XnUtils.convertCurrency(this.input.nativeElement.value);
                const a = setTimeout(() => {
                    this.moneyAlert = ret[1];
                    clearTimeout(a);
                    return;
                });
                return;
            }

            if (parseInt(this.ctrl.value, 0) !== parseInt(this.input.nativeElement.value.replace(/,/g, ''), 0)) {
                const a = setTimeout(() => {
                    clearTimeout(a);
                    this.fromValue();
                    this.calcAlertClass();
                    return;
                }, 0);
            }
        }
    }

    /**
     *  失去焦点时处理金额值
     */
    public onBlur(): void {
        this.toValue();
        this.maxAmount(this.input.nativeElement.value);
    }

    /**
     *  提示判断
     */
    private calcAlertClass(): void {
        this.input.nativeElement.disabled = this.ctrl.disabled;
        this.myClass = XnFormUtils.getClass(this.ctrl);
        this.alert = XnFormUtils.buildValidatorErrorString(this.ctrl);
        if (this.input.nativeElement.value) {
            const ret = XnUtils.convertCurrency(this.input.nativeElement.value);
            this.moneyAlert = ret[1];
            if (!ret[0]) {
                $(this.moneyAlertRef.nativeElement).addClass('red');
            } else {
                $(this.moneyAlertRef.nativeElement).removeClass('red');
            }
        }
    }

    /**
     *  初始值
     */
    private fromValue() {
        if (!this.input.nativeElement.value && this.input.nativeElement.value !== '') {
            return;
        }
        this.input.nativeElement.value = this.ctrl.value;
        this.moneyFormat(); // 将拉取到的数据进行money格式化
        this.calcAlertClass();
    }

    /**
     *  格式化数据
     */
    private toValue() {
        if (!this.input.nativeElement.value) {
            this.ctrl.setValue('');
        } else {
            let tempValue = this.input.nativeElement.value.replace(/,/g, '');
            tempValue = parseFloat(tempValue).toFixed(2);
            this.ctrl.setValue(tempValue.toString());
        }
        this.ctrl.markAsTouched();
        this.calcAlertClass();
    }

    /**
     *  最大金额控制
     * @param num
     */
    private maxAmount(num) {
        if (!this.amounts) {
            return;
        }
        num = Number(num.split(',').join(''));
        const amounts = Number(this.amounts);
        if (num > amounts) {
            this.ctrl.setErrors({overMaxInvoice: true});
            this.moneyAlert = XnFormUtils.buildValidatorErrorString(this.ctrl);
            $(this.moneyAlertRef.nativeElement).addClass('red');
        }
    }

    /**
     *  输入金额
     */
    private onInput1() {
        this.moneyFormat(); // 将输入的数据进行money格式化
        this.toValue();
        this.calcAlertClass();
        this.maxAmount(this.input.nativeElement.value);
    }

    /**
     *  金额显示格式化，加千分位
     */
    private moneyFormat() {
        this.input.nativeElement.value = XnUtils.formatMoney(this.input.nativeElement.value);
    }
}
