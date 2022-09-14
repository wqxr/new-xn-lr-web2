import { Component, OnInit, Input, ElementRef, OnDestroy, ViewChild } from '@angular/core';
import { FormGroup, AbstractControl } from '@angular/forms';
import { XnFormUtils } from '../../common/xn-form-utils';
import { XnInputOptions } from './xn-input.options';

declare let $: any;
import * as moment from 'moment';

@Component({
    selector: 'xn-date2-input',
    templateUrl: './date2-input.component.html',
    styles: [
        `.enable-input { background-color: #ffffff }`,
        `.input-group-addon { border-bottom-right-radius: 3px; border-top-right-radius: 3px;}`,
        `.item-control input { background: none; }`,
        `.date { width: 100% }`,
        `.date i { position: absolute; top: 11px; right: 10px; opacity: 0.5; cursor: pointer; }`,
    ]
})
export class Date2InputComponent implements OnInit, OnDestroy {

    @Input() row: any;
    @Input() form: FormGroup;
     @ViewChild('configDate', { static: true }) configDate: ElementRef;

    myClass = '';
    myClass2 = 'input-group-addon';
    alert = '';
    ctrl: AbstractControl;
    xnOptions: XnInputOptions;

    input: any;

    constructor(private er: ElementRef) {
    }

    ngOnInit() {

        // $('#time').hide();
        // $('#time').datetimepicker({
        //     timeFormat: 'HH:mm:ss',
        //     dateFormat: 'yy-mm-dd'
        // });

        this.initDate();

        if (!this.row.placeholder) {
            this.row.placeholder = '';
        }

        this.ctrl = this.form.get(this.row.name);

        // 日期组件的默认配置在AppComponent里配置
        this.input = $(this.er.nativeElement).find('input');

        if (this.ctrl.value === '') {
            this.input.val(moment().format('YYYY-MM-DD HH:mm:00'));
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
                    // this.ctrl.setValue(val);
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

    private initDate() {
        $(this.configDate.nativeElement).daterangepicker({
            startDate: moment().subtract(0, 'days'),

            showDropdowns: false,
            showWeekNumbers: false,
            timePicker: true,
            timePickerIncrement: 1,
            singleDatePicker: true,
            timePicker24Hour: true,
            autoUpdateInput: false,
            // locale: {
            //     format: 'YYYY-MM-DD HH:mm:ss',
            //     daysOfWeek: ['日', '一', '二', '三', '四', '五', '六'],
            //     monthNames: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'],
            // },
            locale: {
                customRangeLabel: '自定义日期',
                applyLabel: '确定',
                cancelLabel: '取消',
                fromLabel: '从',
                toLabel: '到',
                format: 'YYYY-MM-DD HH:mm:ss',
                weekLabel: '周',
                daysOfWeek: ['日', '一', '二', '三', '四', '五', '六'],
                monthNames: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月']
            },
            opens: 'left',
            buttonClasses: ['btn btn-default'],
            applyClass: 'btn-small btn-primary',
            cancelClass: 'btn-small',
            format: 'YYYY-MM-DD HH:mm:ss',
        }, (start, end, label) => {
            $(this.configDate.nativeElement).val(start.format('YYYY-MM-DD HH:mm:00'));
            this.ctrl.setValue(start.format('YYYY-MM-DD HH:mm:00'));
            // this.getData(start.format('X'), end.format('X'));
        });
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

}
