import {Component, OnInit, Input, ElementRef, OnDestroy} from '@angular/core';
import {FormGroup, AbstractControl} from '@angular/forms';
import {XnFormUtils} from '../../common/xn-form-utils';
import {XnInputOptions} from './xn-input.options';
import {XnUtils} from '../../common/xn-utils';
import {CalendarData} from '../../config/calendar';

declare let $: any;
import * as moment from 'moment';

@Component({
    selector: 'xn-date1-input',
    templateUrl: './date1-input.component.html',
    styles: [
        `.enable-input { background-color: #ffffff }`,
        `.input-group-addon { border-bottom-right-radius: 3px; border-top-right-radius: 3px;}`,
        `.xn-holiday-alert { color: #8d4bbb; font-size: 12px; }`,
    ]
})
export class Date1InputComponent implements OnInit, OnDestroy {

    @Input() row: any;
    @Input() form: FormGroup;

    myClass = '';
    myClass2 = 'input-group-addon';
    alert = '';
    ctrl: AbstractControl;
    xnOptions: XnInputOptions;

    input: any;
    rowName = 'factoringDate';
    factoringDate = '';

    constructor(private er: ElementRef) {
    }

    ngOnInit() {
        if (!this.row.placeholder) {
            this.row.placeholder = '';
        }

        this.ctrl = this.form.get(this.row.name);
        // this.rowName === this.row.name;


        if (this.ctrl.value && this.ctrl.value !== '') {
            this.factoringDate = this.ctrl.value.replace(/-/g, '');
            this.computeDay();
        }

        // 日期组件的默认配置在AppComponent里配置
        this.input = $(this.er.nativeElement).find('input');
        this.input.val(moment().format('YYYY-MM-DD'));
        this.ctrl.setValue(this.input.val());

        this.input.on('change', (e) => {
            e.preventDefault();

            if (this.ctrl.disabled) {
                this.input.val(this.ctrl.value);
            } else {
                const val = this.input.val();
                if (val !== this.ctrl.value) {
                    this.input.focus();
                    this.input.blur();
                }
            }
        });

        this.calcAlertClass();

        this.xnOptions = new XnInputOptions(this.row, this.form, this.ctrl, this.er);
    }

    ngOnDestroy() {
        if (this.input) {
            this.input.off();
        }
    }

    onBlur(): void {
        if (this.ctrl.disabled) {
            this.input.val(this.ctrl.value);
        } else {
            const val = this.input.val();
            if (val !== this.ctrl.value) {
                this.ctrl.markAsTouched();
                this.ctrl.setValue(val);
                this.factoringDate = val.replace(/-/g, '');
                this.computeDay();
            }

            this.calcAlertClass();
        }
    }

    calcAlertClass(): void {
        this.myClass = (this.ctrl.disabled ? '' : 'enable-input ') + XnFormUtils.getClass(this.ctrl);
        this.myClass2 = 'input-group-addon ' + this.myClass;
        this.alert = XnFormUtils.buildValidatorErrorString(this.ctrl);
    }

    computeDay() {
        XnUtils.computeDay(this, CalendarData);
    }
}
