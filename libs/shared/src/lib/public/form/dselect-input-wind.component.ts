import {Component, OnInit, ElementRef, Input} from '@angular/core';
import {FormGroup, AbstractControl} from '@angular/forms';
import {XnInputOptions} from './xn-input.options';
import {XnUtils} from '../../common/xn-utils';

@Component({
    selector: 'app-xn-dselect-input-wind',
    templateUrl: './dselect-input-wind.component.html',
    styles: [
            `.xn-dselect-first {
            padding-right: 2px;
        }

        .xn-dselect-second {
            padding-left: 2px;
        }`
    ]
})
export class DselectInputWindComponent implements OnInit {

    @Input() row: any;
    @Input() form: FormGroup;

    required = false;
    firstClass = '';
    secondClass = '';
    alert = '';

    ctrl: AbstractControl;
    xnOptions: XnInputOptions;

    secondOptions: any[] = [];

    firstValue = '';
    secondValue = '';
    // 是否显现
    isDisplay: boolean;

    constructor(private er: ElementRef) {
    }

    ngOnInit() {
        this.ctrl = this.form.get(this.row.name);
        this.required = (this.row.required === true || this.row.required === 1);

        // 设置初始值
        if (this.ctrl.value) {
            const value = XnUtils.parseObject(this.ctrl.value);
            this.firstValue = value.first || '';
            this.secondOptions = this.row.selectOptions.second[this.firstValue];
            this.secondValue = value.second || '';
        }

        this.xnOptions = new XnInputOptions(this.row, this.form, this.ctrl, this.er);
    }

    onFirstBlur(event) {
        if (!this.required) { return; }

        // let option: any = event.target.selectedOptions[0];
        // if (option.value === '') {
        if (event.target.value === '') {
            this.firstClass = 'xn-control-invalid';
            this.alert = this.row.selectOptions.firstPlaceHolder;
        }
    }

    onSecondBlur(event) {
        if (!this.required) { return; }
        // let option: any = event.target.selectedOptions[0];
        // if (option.value === '') {
        if (event.target.value === '') {
            this.secondClass = 'xn-control-invalid';
            this.alert = this.row.selectOptions.secondPlaceHolder;
        }
    }

    onFirstChange(event) {
        // const firstOption: any = event.target.selectedOptions[0];
        // this.firstValue = firstOption.value;  // 没有使用ngModel双向绑定，所以要自己处理
        this.firstValue = event.target.value;

        if (this.firstValue === '') {
            this.secondOptions = [];
            this.ctrl.setValue('');
            if (this.required) {
                this.firstClass = 'xn-control-invalid';
                this.alert = this.row.selectOptions.firstPlaceHolder;
            }
        } else {
            if (this.required) {
                this.firstClass = 'xn-control-valid';
                this.secondClass = '';
                this.alert = '';
            }

            this.secondOptions = this.row.selectOptions.second[this.firstValue];
            if (this.secondOptions.length > 0) {
                this.ctrl.setValue('');
            } else {
                this.ctrl.setValue(JSON.stringify({
                    first: this.firstValue
                }));
            }
        }
    }

    onSecondChange(event) {
        // const option: any = event.target.selectedOptions[0];
        // const value = option.value;
        const value = event.target.value;
        if (value === '') {
            if (this.required) {
                this.secondClass = 'xn-control-invalid';
                this.alert = this.row.selectOptions.secondPlaceHolder;
            }

            this.ctrl.setValue('');
        } else {
            if (this.required) {
                this.secondClass = 'xn-control-valid';
                this.alert = '';
            }

            this.ctrl.setValue(JSON.stringify({
                first: this.firstValue,
                second: value
            }));
        }
    }
}
