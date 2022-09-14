import { Component, ElementRef, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, FormGroup } from '@angular/forms';
import { XnFormUtils } from 'libs/shared/src/lib/common/xn-form-utils';
import { XnInputOptions } from 'libs/shared/src/lib/public/form/xn-input.options';
import { JsonTransForm } from 'libs/shared/src/lib/public/pipe/xn-json.pipe';
import * as moment from 'moment';
import { DynamicForm } from '../../dynamic.decorators';


declare let $: any;

@Component({
    selector: 'dragon-quantum1-input',
    templateUrl: './quantum-input.component.html',
    styles: [
        `.enable-input {
            background-color: #ffffff
        }

        .input-group-addon {
            border-bottom-right-radius: 3px;
            border-top-right-radius: 3px;
        }

        .item-control input {
            background: none;
        }

        .date {
            width: 100%
        }

        .date i {
            position: absolute;
            top: 11px;
            right: 10px;
            opacity: 0.5;
            cursor: pointer;
        }`,
    ]
})
@DynamicForm({ type: 'quantum1', formModule: 'default-input' })

export class Quantum1InputComponent implements OnInit, OnDestroy {

    @Input() row: any;
    @Input() form: FormGroup;
    myClass = '';
    myClass2 = 'input-group-addon';
    alert = '';
    ctrl: AbstractControl;
    xnOptions: XnInputOptions;
    @ViewChild('configDate', { static: true }) configDate: ElementRef;

    input: any;
    position = 'down'; // 选项框位置
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
        let beginTime = 0;
        let endTime = 0;
        if (!!ctrlValue) {
            beginTime = JSON.parse(ctrlValue).beginTime;
            endTime = JSON.parse(ctrlValue).endTime;
            $(this.configDate.nativeElement).val(moment(Number(beginTime)).format('YYYY-MM-DD') +
                ' - ' + moment(Number(endTime)).format('YYYY-MM-DD'));
        }
        this.initDate(beginTime, endTime); // 初始化时间控件

        this.calcAlertClass();

        this.xnOptions = new XnInputOptions(this.row, this.form, this.ctrl, this.er);

        this.ctrl.valueChanges.subscribe(data => {
            if (!data) {
                // 重置时清空输入框内容
                this.configDate.nativeElement.value = '';
                const today = new Date();
                // $(this.configDate.nativeElement).data('daterangepicker').setStartDate(today);
                // $(this.configDate.nativeElement).data('daterangepicker').setEndDate(today);
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

    private initDate(beginTime, endTime) {
        const afterSelect = ((start, end) => {
            if (Number(start) !== -28800000) { // 不选择时间
                const startTimeMoment = moment(Number(start)).isSame(Number(end), 'day') ? start.startOf('day') : start;
                const times = {
                    beginTime: startTimeMoment.format('x'),
                    // beginTime: start.format('x'),
                    endTime: end.format('x')
                };
                $(this.configDate.nativeElement).val(start.format('YYYY-MM-DD') + ' - ' + end.format('YYYY-MM-DD'));
                this.toValue(times);
            } else {
                $(this.configDate.nativeElement).val('');
                this.toValue('');
            }
        }).bind(this);

        $(this.configDate.nativeElement).daterangepicker({
            startDate: beginTime && moment.unix(beginTime / 1000) || moment().startOf('days'), // 初始化时间兼容后退时间
            endDate: endTime && moment.unix(endTime / 1000) || moment().endOf('day'),
            opens: 'right',
            drops: this.position,
            alwaysShowCalendars: true,
            autoUpdateInput: false,
            ranges: {
                今天: [moment().startOf('days'), moment().endOf('day')],
                昨天: [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
                近7天: [moment().subtract(7, 'days'), moment()],
                近30天: [moment().subtract(30, 'days'), moment()],
                近90天: [moment().subtract(90, 'days'), moment()],
                近180天: [moment().subtract(180, 'days'), moment()],
                近365天: [moment().subtract(365, 'days'), moment()],
                这个月: [moment().startOf('month'), moment().endOf('month')],
                上个月: [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')],
                不选择时间: [0, 0],
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
        }, afterSelect);

        $(this.configDate.nativeElement).on('apply.daterangepicker', function (ev, picker) {
            const start = picker.startDate.toDate().toDateString();
            const end = picker.endDate.toDate().toDateString();
            const now = moment(new Date()).toDate().toDateString();

            if (start === now && start === end) {
                const time = picker.startDate;
                afterSelect(time, picker.endDate);
            } else if (Number(picker.startDate) === -28800000) {
                afterSelect(picker.startDate, picker.endDate);
            }
        });
    }
}
