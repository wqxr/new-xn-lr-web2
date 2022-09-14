import {Component, OnInit, Input, ElementRef, OnDestroy, ViewChild} from '@angular/core';
import {FormGroup, AbstractControl} from '@angular/forms';
import {XnFormUtils} from '../../common/xn-form-utils';
import {XnInputOptions} from './xn-input.options';
import {DateCommunicateService} from '../../services/date-communicate.service';
import {CalendarData} from '../../config/calendar';
import {XnUtils} from '../../common/xn-utils';

declare let $: any;

/**
 *  日期录入，没有默认时间,可控制状态
 */
@Component({
    selector: 'xn-date-input-control-null',
    templateUrl: './date-input-control-null.component.html',
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
        `
    ]
})
export class DateInputControlNullComponent implements OnInit, OnDestroy {
    @Input() row: any;
    @Input() form: FormGroup;
    @ViewChild('input', { static: true }) input1: ElementRef;
    myClass = '';
    myClass2 = 'input-group-addon';
    alert = '';
    ctrl: AbstractControl;
    xnOptions: XnInputOptions;
    input: any;
    // 不可手动编辑，系统自动计算
    inputStatus = false;

    constructor(private er: ElementRef) {
    }

    ngOnInit() {
        this.inputStatus = this.row.options.disabled;
        if (!this.row.placeholder) {
            this.row.placeholder = '';
        }
        this.ctrl = this.form.get(this.row.name);
        // 日期组件的默认配置在AppComponent里配置
        this.input = $(this.er.nativeElement).find('input');
        if (!this.ctrl.value) {
            this.ctrl.setValue('');
        }
        this.input.val(this.ctrl.value); // 显示的值
        this.ctrl.setValue({state: this.inputStatus, value: this.input.val()});
        this.input.on('change', (e) => {
            e.preventDefault();
            const val = this.input.val();
            if (val !== this.ctrl.value.value) {
                this.input.focus();
                this.input.blur();
            }
        });

        this.calcAlertClass();

        this.xnOptions = new XnInputOptions(this.row, this.form, this.ctrl, this.er);
    }

    handleChange() {
        this.inputStatus = !this.inputStatus;
        if (this.inputStatus) {
            this.ctrl.setValue({state: this.inputStatus, value: ''});
            this.input.val('');
        } else {
            this.ctrl.setValue({state: this.inputStatus, value: this.input.val()});
            this.input.val(this.ctrl.value.value);
        }
    }

    ngOnDestroy() {
        if (this.input) {
            this.input.off();
        }
    }

    onBlur(): void {
        if (this.inputStatus) {
            this.ctrl.setValue({state: this.inputStatus, value: ''});
            this.input.val('');
        } else {
            const val = this.input.val();
            if (val !== this.ctrl.value.value) {
                this.ctrl.setValue({state: this.inputStatus, value: val});
                this.ctrl.markAsTouched();
            }
        }
        this.calcAlertClass();
    }

    calcAlertClass(): void {
        this.myClass = (this.ctrl.disabled ? '' : 'enable-input ') + XnFormUtils.getClass(this.ctrl);
        this.myClass2 = 'input-group-addon ' + this.myClass;
        this.alert = XnFormUtils.buildValidatorErrorString(this.ctrl);
    }
}
