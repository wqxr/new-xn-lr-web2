import {Component, OnInit, Input, ElementRef, ViewChild} from '@angular/core';
import {FormGroup, AbstractControl} from '@angular/forms';
import {XnFormUtils} from '../../common/xn-form-utils';
import {XnUtils} from '../../common/xn-utils';
import {XnInputOptions} from './xn-input.options';

/**
 *  组件输入状态可控
 */
@Component({
    selector: 'xn-money-control-input',
    templateUrl: './money-control-input.component.html',
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
export class MoneyControlInputComponent implements OnInit {

    @Input() row: any;
    @Input() form: FormGroup;
    @ViewChild('input', { static: true }) input: ElementRef;
    @ViewChild('moneyAlertRef', { static: true }) moneyAlertRef: ElementRef;

    myClass = '';
    alert = '';
    moneyAlert = '';
    ctrl: AbstractControl;
    xnOptions: XnInputOptions;
    inputStatus = false;

    constructor(private er: ElementRef) {
    }

    ngOnInit() {
        this.inputStatus = this.row.options.disabled;
        this.ctrl = this.form.get(this.row.name);
        if (!this.row.placeholder) {
            this.row.placeholder = '';
        }
        this.fromValue();
        this.xnOptions = new XnInputOptions(this.row, this.form, this.ctrl, this.er);
    }

    // 改变输入状态
    handleChange(): void {
        this.inputStatus = !this.inputStatus;
        if (this.inputStatus) {
            // 暂时不可填写
            this.input.nativeElement.value = '';
        }
        this.toValue();
    }

    fromValue() {
        this.input.nativeElement.value = !!this.ctrl.value ? this.ctrl.value : '';
        this.moneyFormat(); // 将拉取到的数据进行money格式化
        this.toValue();
    }

    toValue() {
        if (!this.input.nativeElement.value || this.input.nativeElement.value === '') {
            this.ctrl.setValue({state: this.inputStatus, value: ''});
        } else {
            let tempValue = this.input.nativeElement.value.replace(/,/g, '');
            tempValue = parseFloat(tempValue).toFixed(2);
            this.ctrl.setValue({state: this.inputStatus, value: tempValue.toString()});
            this.ctrl.markAsTouched();
        }
        this.calcAlertClass();
    }

    onBlur(): void {
        this.calcAlertClass();
    }

    calcAlertClass(): void {
        this.myClass = XnFormUtils.getClass(this.ctrl);
        this.alert = XnFormUtils.buildValidatorErrorString(this.ctrl);
        if (this.input.nativeElement.value && this.input.nativeElement.value !== '') {
            const ret = XnUtils.convertCurrency(this.input.nativeElement.value);
            this.moneyAlert = ret[1];
            if (!ret[0]) {
                $(this.moneyAlertRef.nativeElement).addClass('red');
            } else {
                $(this.moneyAlertRef.nativeElement).removeClass('red');
            }
        } else {
            this.moneyAlert = '';
        }
    }

    onInput() {
        this.moneyFormat(); // 将输入的数据进行money格式化
        this.toValue();
        $(this.input.nativeElement).focus();
    }

    moneyFormat() {
        if (this.input.nativeElement.value === '') {
            return;
        }
        let num = this.input.nativeElement.value;
        num = XnUtils.formatMoney(num);
        this.input.nativeElement.value = num;
    }
}


