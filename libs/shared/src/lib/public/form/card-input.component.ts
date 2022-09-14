import {Component, OnInit, Input, ElementRef, ViewChild} from '@angular/core';
import {FormGroup, AbstractControl} from '@angular/forms';
import {XnFormUtils} from '../../common/xn-form-utils';
import {XnUtils} from '../../common/xn-utils';
import {XnInputOptions} from './xn-input.options';

@Component({
    selector: 'xn-card-input',
    templateUrl: './card-input.component.html',
    styles: []
})
export class CardInputComponent implements OnInit {

    @Input() row: any;
    @Input() form: FormGroup;
    @ViewChild('input', { static: true }) input: ElementRef;

    myClass = '';
    alert = '';
    ctrl: AbstractControl;
    xnOptions: XnInputOptions;

    constructor(private er: ElementRef) {
    }

    ngOnInit() {
        if (!this.row.placeholder) {
            this.row.placeholder = '';
        }

        this.ctrl = this.form.get(this.row.name);
        this.fromValue();
        this.calcAlertClass();

        this.xnOptions = new XnInputOptions(this.row, this.form, this.ctrl, this.er);
    }

    fromValue() {
        this.input.nativeElement.value = XnUtils.parseObject(this.ctrl.value, []);
        this.cardFormat(); // 将拉取到的数据进行money格式化
        this.alert = XnFormUtils.buildValidatorErrorString(this.ctrl);
    }

    toValue() {
        if (!this.input.nativeElement.value) {
            this.ctrl.setValue('');
        } else {
            this.ctrl.setValue(this.input.nativeElement.value.replace(/\s/g, '').replace(/\D/g, ''));
            // console.log("toValue: " + this.input.nativeElement.value.replace(/,/g, ""));
        }
        this.ctrl.markAsTouched();
        this.alert = XnFormUtils.buildValidatorErrorString(this.ctrl);
    }

    onBlur(): void {
        this.calcAlertClass();
    }

    calcAlertClass(): void {
        this.myClass = XnFormUtils.getClass(this.ctrl);
        this.alert = XnFormUtils.buildValidatorErrorString(this.ctrl);
    }

    onInput() {
        this.cardFormat(); // 将输入的数据进行money格式化
        this.toValue();
        this.calcAlertClass();
    }

    // 银行卡号自动每4位添加一个空格
    // 过滤任何不可见字符，非数字字符
    cardFormat() {
        // console.log("prev: " + this.input.nativeElement.value);

        let num = this.input.nativeElement.value;

        num = num.replace(/\s/g, '').replace(/\D/g, '').replace(/(\d{4})/g, '$1 ');

        this.input.nativeElement.value = num;

        // console.log("after: " + this.input.nativeElement.value);

    }
}


