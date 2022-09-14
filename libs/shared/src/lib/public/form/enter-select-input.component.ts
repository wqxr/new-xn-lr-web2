import {Component, OnInit, ElementRef, Input, OnDestroy} from '@angular/core';
import {FormGroup, AbstractControl} from '@angular/forms';
import {XnInputOptions} from './xn-input.options';
import {XnUtils} from '../../common/xn-utils';
import {PublicCommunicateService} from '../../services/public-communicate.service';

/**
 *  可输入的下拉编辑框
 */
@Component({
    selector: 'app-xn-enter-select-input',
    templateUrl: './enter-select-input.component.html',
    styles: [
            `
            .row {
                height: 40px;
            }

            .select-editable {
                position: relative;
            }

            .select-editable select {
                position: absolute;
                top: 0px;
                left: 15px;
                width: 100px;
                margin: 0;
            }

            .select-editable input {
                position: absolute;
                top: 1px;
                left: 16px;
                width: 80px;
                height: 30px;
                border: none;
            }

        `
    ]
})
export class EnterSelectInputComponent implements OnInit {
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

    public formattedValue: any;
    ValueCache: any;
    // 本文输入
    firstInputValue = '';
    secondInputValue = '';


    constructor(private er: ElementRef, private publicCommunicateService: PublicCommunicateService) {
        // 当应收账款组件值发生改变时，清除已经设置的值,将值设为空
        this.publicCommunicateService.change.subscribe(x => {
            this.ctrl.reset();
        });
    }

    ngOnInit() {
        // row.options.ref 数据
        this.ctrl = this.form.get(this.row.name);
        this.required = (this.row.required === true || this.row.required === 1);
        this.xnOptions = new XnInputOptions(this.row, this.form, this.ctrl, this.er);
        // 将值复制到声明变量中
        this.ValueCache = this.ctrl.value;
        // 设置初始值
        this.init(this.ValueCache);
    }

    init(val) {
        if (val) {
            this.formattedValue = XnUtils.parseObject(val);
            this.firstValue = this.formattedValue.first || '';
            this.firstInputValue = this.firstValue;
            this.secondOptions = this.row.options.ref.second[this.firstValue];
            this.secondValue = this.formattedValue.second || '';
            this.secondInputValue = this.secondValue;
        }
    }

    onFirstBlur(event) {
        if (!this.required) { return; }

        // let option: any = event.target.selectedOptions[0];
        // if (option.value === '') {
        if (event.target.value === '') {
            this.firstClass = 'xn-control-invalid';
            this.alert = this.row.options.ref.firstPlaceHolder;
        }
    }

    onSecondBlur(event) {
        if (!this.required) { return; }
        // let option: any = event.target.selectedOptions[0];
        // if (option.value === '') {
        if (event.target.value === '') {
            this.secondClass = 'xn-control-invalid';
            this.alert = this.row.options.ref.secondPlaceHolder;
        }
    }

    onFirstChange(event) {
        // const firstOption: any = event.target.selectedOptions[0];
        // this.firstValue = firstOption.value;  // 没有使用ngModel双向绑定，所以要自己处理
        this.firstValue = event.target.value;
        this.firstInputValue = this.firstValue;

        if (this.firstValue === '') {
            this.secondOptions = [];
            this.ctrl.setValue('');
            if (this.required) {
                this.firstClass = 'xn-control-invalid';
                this.alert = this.row.options.ref.firstPlaceHolder;
            }
        } else {
            if (this.required) {
                this.firstClass = 'xn-control-valid';
                this.secondClass = '';
                this.alert = '';
            }

            this.secondOptions = this.row.options.ref.second[this.firstValue];
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
        const value = event.target.value;
        this.secondInputValue = value;
        if (value === '') {
            if (this.required) {
                this.secondClass = 'xn-control-invalid';
                this.alert = this.row.options.ref.secondPlaceHolder;
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

    handleInput1(event) {
        this.firstValue = event.target.value;
        this.ctrl.setValue(JSON.stringify({
            first: this.firstValue
        }));
    }

    handleInput2(event) {
        this.secondValue = event.target.value;
        this.ctrl.setValue(JSON.stringify({
            first: this.firstValue,
            second: this.secondValue
        }));
    }
}
