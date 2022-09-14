import { Component, OnInit, Input, ElementRef, OnDestroy, ViewChild } from '@angular/core';
import { FormGroup, AbstractControl } from '@angular/forms';
import { DateCommunicateService } from 'libs/shared/src/lib/services/date-communicate.service';
import { XnInputOptions } from 'libs/shared/src/lib/public/form/xn-input.options';
import { JsonTransForm } from 'libs/shared/src/lib/public/pipe/xn-json.pipe';
import { SelectOptions } from 'libs/shared/src/lib/config/select-options';
import { XnFormUtils } from 'libs/shared/src/lib/common/xn-form-utils';
import { XnUtils } from 'libs/shared/src/lib/common/xn-utils';
import { DynamicForm } from '../../dynamic.decorators';




declare let $: any;
import * as moment from 'moment';

@Component({
    templateUrl: './vanke-text-select-input.component.html',
    styles: [
        `.enable-input {
            background-color: #ffffff
        }

        .input-group-addon {
            border-bottom-right-radius: 3px;
            border-top-right-radius: 3px;
        }

        .input-group > .bg {
            background-color: #eee;
            opacity: 1;
        }
        .enable-input {
            background-color: #ffffff
        }.input-group-addon {
            border-bottom-right-radius: 3px;
            border-top-right-radius: 3px;
        }.item-control input {
            background: none;
        }.date {
            width: 100%
        }.date i {
            position: absolute;
            top: 11px;
            right: 10px;
            opacity: 0.5;
            cursor: pointer;
        }

        `
    ]
})
@DynamicForm({ type: 'select-text', formModule: 'default-input' })

export class VankeInputSelectComponent implements OnInit, OnDestroy {

    @Input() row: any;
    @Input() form: FormGroup;
     @ViewChild('configDate', { static: true }) configDate: ElementRef;
    position = 'down';
    myClass = '';
    myClass2 = 'input-group-addon';
    alert = '';
    ctrl: AbstractControl;
    xnOptions: XnInputOptions;
    status: string;
    input: any;
    text = '';

    constructor(private er: ElementRef, private dateCommunicateService: DateCommunicateService) {
    }

    ngOnInit() {
        if (!this.row.placeholder) {
            this.row.placeholder = '';
        }
        if (this.row.options) {
            const opts = JsonTransForm(this.row.options);
            this.position = opts.position ? opts.position : 'down';
        }
        this.ctrl = this.form.get(this.row.name);
        const ctrlValue = this.ctrl.value ? this.ctrl.value : '';
        if (ctrlValue === '') {
            this.status = '-1';
            this.text = '';
        } else {
            this.status = JSON.parse(ctrlValue).status;
            this.text = JSON.parse(ctrlValue).text;
        }

        // 初始化时间控件
        this.calcAlertClass();
        this.xnOptions = new XnInputOptions(this.row, this.form, this.ctrl, this.er);
    }

    ngOnDestroy() {
        if (this.input) {
            this.input.off();
        }
    }

    onBlur1() {
        if (this.status === '0') {
            this.ctrl.setValue(JSON.stringify({ status: this.status }));
            this.text = '';
        } else if (this.status === '1') {
            this.ctrl.setValue(JSON.stringify({ status: this.status, text: this.text }));

        } else {
            this.ctrl.setValue('');
        }
    }
    onBlur(event) {
        this.ctrl.setValue(JSON.stringify({ status: this.status, text: this.text }));

    }

    calcAlertClass(): void {
        this.myClass = (this.ctrl.disabled ? '' : 'enable-input ') + XnFormUtils.getClass(this.ctrl);
        this.myClass2 = 'input-group-addon ' + this.myClass;
        this.alert = XnFormUtils.buildValidatorErrorString(this.ctrl);
    }

}
