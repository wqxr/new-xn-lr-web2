/*
 * Copyright(c) 2017-2019, 深圳市链融科技股份有限公司
 * Beijing Xiwei Technology Co., Ltd.
 * All rights reserved.
 *
 * @file：money-input.component.ts
 * @summary：采购融资/金额显示  type = 'money'
 * @version: 1.0
 * **********************************************************************
 * revision             author            reason                date
 * 1.0                 zhyuanan             新增            2019-05-13
 * **********************************************************************
 */

import { Component, Input, ElementRef, ViewChild, AfterViewChecked, ChangeDetectionStrategy, OnInit } from '@angular/core';
import { FormGroup, AbstractControl } from '@angular/forms';
import { XnInputOptions } from 'libs/shared/src/lib/public/form/xn-input.options';
import { XnUtils } from 'libs/shared/src/lib/common/xn-utils';
import { XnFormUtils } from 'libs/shared/src/lib/common/xn-form-utils';
import { DynamicForm } from 'libs/shared/src/lib/common/dynamic-form/dynamic.decorators';

@Component({
    selector: 'xn-avenger-money-input-component',
    templateUrl: './money-input.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
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
@DynamicForm({ type: 'money', formModule: 'avenger-input' })
export class AvengerMoneyInputComponent implements AfterViewChecked, OnInit {

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

    constructor(private er: ElementRef, ) {
        //
    }

    ngOnInit() {
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
     *  金额显示格式化，加千分位
     */
    private moneyFormat() {
        this.input.nativeElement.value = XnUtils.formatMoney(this.input.nativeElement.value);
    }
}
