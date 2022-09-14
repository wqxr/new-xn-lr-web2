import {Component, OnInit, Input, ElementRef, OnDestroy, ViewChild} from '@angular/core';
import {FormGroup, AbstractControl} from '@angular/forms';
import {XnFormUtils} from '../../common/xn-form-utils';
import {XnInputOptions} from './xn-input.options';
import {JsonTransForm} from '../pipe/xn-json.pipe';
import {XnUtils} from '../../common/xn-utils';

declare let $: any;
declare var jQuery: any;
import * as moment from 'moment';

@Component({
    selector: 'xn-quantum-input',
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

        this.initDate(ctrlValue); // 初始化时间控件

        this.calcAlertClass();

        this.xnOptions = new XnInputOptions(this.row, this.form, this.ctrl, this.er);
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
        if (ctrlValue !== '') {
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
            startDate: beginTime && moment.unix(beginTime / 1000) || moment().subtract(365, 'days'), // 初始化时间兼容后退时间
            endDate: endTime && moment.unix(endTime / 1000) || moment(),
            opens: 'right',
            drops: this.position,
            alwaysShowCalendars: true,
            ranges: {
                今天: [moment(), moment()],
                昨天: [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
                近7天: [moment().subtract(7, 'days'), moment()],
                近30天: [moment().subtract(30, 'days'), moment()],
                近90天: [moment().subtract(90, 'days'), moment()],
                近180天: [moment().subtract(180, 'days'), moment()],
                近365天: [moment().subtract(365, 'days'), moment()],
                这个月: [moment().startOf('month'), moment().endOf('month')],
                上个月: [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')],
            },
            locale: {
                customRangeLabel: '自定义日期',
                applyLabel: '确定',
                cancelLabel: '取消',
                fromLabel: '从',
                toLabel: '到',
                format: 'YYYY-MM-DD',
                weekLabel: '周',
                daysOfWeek: ['日', '一', '二', '三', '四', '五', '六'],
                monthNames: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月']
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
