import {Component, OnInit, Input, ElementRef, OnDestroy} from '@angular/core';
import {FormGroup, AbstractControl} from '@angular/forms';
import {XnFormUtils} from '../../common/xn-form-utils';
import {XnInputOptions} from './xn-input.options';
import {DateCommunicateService} from '../../services/date-communicate.service';
import {XnUtils} from '../../common/xn-utils';
import {CalendarData} from '../../config/calendar';

declare let $: any;
import * as moment from 'moment';

@Component({
    selector: 'app-xn-date-input-wind',
    templateUrl: './date-input-wind.component.html',
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
export class DateInputWindComponent implements OnInit, OnDestroy {

    @Input() row: any;
    @Input() form: FormGroup;

    myClass = '';
    myClass2 = 'input-group-addon';
    alert = '';
    ctrl: AbstractControl;
    xnOptions: XnInputOptions;

    input: any;

    constructor(private er: ElementRef, private dateCommunicateService: DateCommunicateService) {
    }

    ngOnInit() {
        if (!this.row.placeholder) {
            this.row.placeholder = '';
        }

        this.ctrl = this.form.get(this.row.name);
        // 日期组件的默认配置在AppComponent里配置
        this.input = $(this.er.nativeElement).find('input');

        if (this.ctrl.value === '') {
            this.input.val(moment().format('YYYY-MM-DD'));
            this.ctrl.setValue(this.input.val());
        } else {
            this.input.val(this.ctrl.value);
        }

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
                if (this.row.checkerId === 'actualPayBackDate' && this.row.flowId === 'financing13') {
                    this.dateCommunicateService.change.emit(val);
                }
            }

            this.calcAlertClass();
        }
    }

    calcAlertClass(): void {
        this.myClass = (this.ctrl.disabled ? '' : 'enable-input ') + XnFormUtils.getClass(this.ctrl);
        this.myClass2 = 'input-group-addon ' + this.myClass;
        this.alert = XnFormUtils.buildValidatorErrorString(this.ctrl);
    }
}
