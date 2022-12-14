import { Component, OnInit, Input, ElementRef, OnDestroy, ViewChild } from '@angular/core';
import { FormGroup, AbstractControl } from '@angular/forms';
import { DynamicForm } from '../../dynamic.decorators';
import { XnInputOptions } from 'libs/shared/src/lib/public/form/xn-input.options';
import { JsonTransForm } from 'libs/shared/src/lib/public/pipe/xn-json.pipe';
import { XnFormUtils } from 'libs/shared/src/lib/common/xn-form-utils';
import { XnUtils } from 'libs/shared/src/lib/common/xn-utils';


declare let $: any;
declare var jQuery: any;
import * as moment from 'moment';

@Component({
    selector: 'dragon-quantum-input',
    templateUrl: './quantum-input.component.html',
    styles: [
        `.enable-input {
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
        }`,
    ]
})
@DynamicForm({ type: 'quantum', formModule: 'default-input' })
export class QuantumInputComponent implements OnInit, OnDestroy {

    @Input() row: any;
    @Input() form: FormGroup;

    myClass = '';
    myClass2 = 'input-group-addon';
    alert = '';
    ctrl: AbstractControl;
    xnOptions: XnInputOptions;
     @ViewChild('configDate', { static: true }) configDate: ElementRef;

    input: any;
    position = 'down';

    constructor(private er: ElementRef) {
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

        this.initDate(ctrlValue); // ?????????????????????

        this.calcAlertClass();

        this.xnOptions = new XnInputOptions(this.row, this.form, this.ctrl, this.er);

        this.ctrl.valueChanges.subscribe(data => {
            console.log('daterangepicker value changes :>> ', data);
            if (!data) {
                // ??????????????????????????????
                this.configDate.nativeElement.value = '';
                const startDate = moment().subtract(365, 'days'); // ?????????????????????????????????
                const endDate = moment();
                $(this.configDate.nativeElement).data('daterangepicker').setStartDate(startDate);
                $(this.configDate.nativeElement).data('daterangepicker').setEndDate(endDate);
            } else {
                this.initDate(data);
            }
        });
    }

    toValue(times) {
        if (!this.configDate.nativeElement.value) {
            this.ctrl.setValue('');
        } else {
            this.ctrl.setValue(JSON.stringify(times));
        }
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
            }

            this.calcAlertClass();
        }
    }

    calcAlertClass(): void {
        this.myClass = (this.ctrl.disabled ? '' : 'enable-input ') + XnFormUtils.getClass(this.ctrl);
        this.myClass2 = 'input-group-addon ' + this.myClass;
        this.alert = XnFormUtils.buildValidatorErrorString(this.ctrl);
    }

    private initDate(ctrlValue) {
        let beginTime: any;
        let endTime: any;
        if (ctrlValue === '') {
            this.configDate.nativeElement.value = '';
            this.ctrl.setValue('');
        } else if (ctrlValue !== '') {
            if (!XnUtils.isEmptyObject(JSON.parse(ctrlValue))) {
                beginTime = JSON.parse(ctrlValue).beginTime;
                endTime = JSON.parse(ctrlValue).endTime;
            } else {
                const times = {
                    beginTime: moment().subtract(365, 'days').format('x'),
                    endTime: moment().format('x')
                };
                this.ctrl.setValue(JSON.stringify(times));
            }
        }

        $(this.configDate.nativeElement).daterangepicker({
            startDate: beginTime && moment.unix(beginTime / 1000) || moment().subtract(365, 'days'), // ?????????????????????????????????
            endDate: endTime && moment.unix(endTime / 1000) || moment(),
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
                beginTime: start.format('x'),
                endTime: end.format('x')
            };
            this.toValue(times);
        });
    }




}
