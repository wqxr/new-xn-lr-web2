import { Component, OnInit, Input, ElementRef, OnDestroy, ViewChild } from '@angular/core';
import { FormGroup, AbstractControl } from '@angular/forms';
import { DateCommunicateService } from '../../../../../services/date-communicate.service';



declare let $: any;
import * as moment from 'moment';
import { DynamicForm } from '../../../../../common/dynamic-form/dynamic.decorators';
import { XnInputOptions } from '../../../../form/xn-input.options';
import { JsonTransForm } from '../../../../pipe/xn-json.pipe';
import { SelectOptions } from '../../../../../config/select-options';
import { XnFormUtils } from '../../../../../common/xn-form-utils';
import { XnUtils } from '../../../../../common/xn-utils';

@Component({
    templateUrl: './loan-date.component.html',
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
@DynamicForm({ type: 'dragon-loandate', formModule: 'dragon-input' })

export class LoanDateComponent implements OnInit, OnDestroy {

    @Input() row: any;
    @Input() form: FormGroup;
     @ViewChild('configDate', { static: true }) configDate: ElementRef;
    position = 'down';
    myClass = '';
    myClass2 = 'input-group-addon';
    alert = '';
    ctrl: AbstractControl;
    ischeck: string;
    selectArrary: any[];
    xnOptions: XnInputOptions;

    input: any;

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
        this.selectArrary = SelectOptions.get('accountReceipts');

        // ??????????????????????????????AppComponent?????????

        const ctrlValue = this.ctrl.value ? this.ctrl.value : '';

        if (ctrlValue === '') {
            this.ischeck = '-1';
        } else {
            const value = JSON.parse(ctrlValue);
            this.ischeck = `${value.isPriorityLoanDate}`;
        }
        this.initDate(ctrlValue);

        // ?????????????????????
        this.calcAlertClass();
        this.xnOptions = new XnInputOptions(this.row, this.form, this.ctrl, this.er);
    }

    ngOnDestroy() {
        if (this.input) {
            this.input.off();
        }
    }

    onBlur1() {
        if (this.ischeck === '0') {
            this.initDate(''); // ?????????????????????
        } else if (this.ischeck === '-1') {
            this.configDate.nativeElement.value = '';
            this.ctrl.setValue('');
            this.initDate('');
        } else {
            this.initDate(1);
        }
    }

    calcAlertClass(): void {
        this.myClass = (this.ctrl.disabled ? '' : 'enable-input ') + XnFormUtils.getClass(this.ctrl);
        this.myClass2 = 'input-group-addon ' + this.myClass;
        this.alert = XnFormUtils.buildValidatorErrorString(this.ctrl);
    }
    private initDate(ctrlValue) {
        let priorityLoanDateStart: any;
        let priorityLoanDateEnd: any;
        let isPriorityLoanDate: any;
        if (ctrlValue === '' || +this.ischeck <= 0) {
            this.configDate.nativeElement.value = '';
            this.ctrl.setValue(JSON.stringify({ isPriorityLoanDate: +this.ischeck }));
            return;
        } else {

            if (!XnUtils.isEmptyObject(JSON.parse(ctrlValue))) {
                priorityLoanDateStart = JSON.parse(ctrlValue).priorityLoanDateStart;
                priorityLoanDateEnd = JSON.parse(ctrlValue).priorityLoanDateEnd;
                isPriorityLoanDate = 1;
            } else {
                const times = {
                    priorityLoanDateStart: moment().startOf('day').format('x'),
                    priorityLoanDateEnd: moment().endOf('day').format('x'),
                    isPriorityLoanDate: 1,
                };
                this.ctrl.setValue(JSON.stringify(times));
            }


        }
        $(this.configDate.nativeElement).daterangepicker({
            startDate: priorityLoanDateStart
                && moment.unix(priorityLoanDateStart / 1000) || moment(new Date()).valueOf(), // ?????????????????????????????????
            endDate: priorityLoanDateEnd && moment.unix(priorityLoanDateEnd / 1000) || moment(new Date()).valueOf(),
            opens: 'right',
            drops: this.position,
            alwaysShowCalendars: true,
            ranges: {
                ??????: [moment(), moment()],
                ??????: [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
                ???7???: [moment().subtract(7, 'days'), moment()],
                ???30???: [moment().subtract(30, 'days'), moment()],
                ???90???: [moment().subtract(90, 'days'), moment()],
                ???180???: [moment().subtract(180, 'days'), moment()],
                ???365???: [moment().subtract(365, 'days'), moment()],
                ?????????: [moment().startOf('month'), moment().endOf('month')],
                ?????????: [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')],
            },
            locale: {
                customRangeLabel: '???????????????',
                applyLabel: '??????',
                cancelLabel: '??????',
                fromLabel: '???',
                toLabel: '???',
                format: 'YYYY-MM-DD',
                weekLabel: '???',
                daysOfWeek: ['???', '???', '???', '???', '???', '???', '???'],
                monthNames: ['??????', '??????', '??????', '??????', '??????', '??????', '??????', '??????', '??????', '??????', '?????????', '?????????']
            }
        }, (start, end, label) => {
            const times = {
                priorityLoanDateStart: start.format('x'),
                priorityLoanDateEnd: end.format('x'),
                isPriorityLoanDate: 1,
            };
            this.toValue(times);
        });
    }
    toValue(times) {
        if (!this.configDate.nativeElement.value) {
            this.ctrl.setValue(0);
        } else {
            this.ctrl.setValue(JSON.stringify(times));
        }
    }
}
