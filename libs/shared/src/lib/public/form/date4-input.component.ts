import { Component, OnInit, Input, ElementRef, OnDestroy, ViewChild } from '@angular/core';
import { FormGroup, AbstractControl } from '@angular/forms';
import { XnFormUtils } from '../../common/xn-form-utils';
import { XnInputOptions } from './xn-input.options';

declare let $: any;
import * as moment from 'moment';

@Component({
    selector: 'xn-date4-input',
    templateUrl: './date4-input.component.html',
    styles: [
        `.enable-input { background-color: #ffffff }`,
        `.input-group-addon { border-bottom-right-radius: 3px; border-top-right-radius: 3px;}`,
        `.item-control input { background: none; }`,
        `.date { width: 100% }`,
        `.date i { position: absolute; top: 11px; right: 10px; opacity: 0.5; cursor: pointer; }`,
    ]
})
export class Date4InputComponent implements OnInit, OnDestroy {

    @Input() row: any;
    @Input() form: FormGroup;
    @ViewChild('configDate', { static: true }) configDate: ElementRef;

    myClass = '';
    myClass2 = 'input-group-addon';
    alert = '';
    ctrl: AbstractControl;
    xnOptions: XnInputOptions;

    input: any;
    /* 自定义组件配置。若不设置，则使用默认配置 */
    public options: any = {
        format: 'YYYY-MM-DD',
    };
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
            this.input.val('');
            this.ctrl.setValue('');
        } else {
            this.input.val(this.ctrl.value);
        }
        this.ctrl.valueChanges.subscribe(x => {
            if (this.ctrl.value === '') {
                this.input.val('');
            }
        })

        this.input.on('change', (e) => {
            e.preventDefault();
            if (this.ctrl.disabled) {
                this.input.val(this.ctrl.value);
            } else {
                const val = this.input.val();
                if (val !== this.ctrl.value) {
                    this.ctrl.markAsTouched();
                    this.ctrl.setValue(val);
                    // this.input.focus();
                    // this.input.blur();
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
        // 单日历
        const _this = this;
        const $configDate = $(this.configDate.nativeElement);
        $(this.configDate.nativeElement).daterangepicker({
            singleDatePicker: true, // 设置为单个的datepicker，而不是有区间的datepicker 默认false
            showDropdowns: true, // 当设置值为true的时候，允许年份和月份通过下拉框的形式选择 默认false
            autoUpdateInput: false, // 1.当设置为false的时候,不给与默认值(当前时间)2.选择时间时,失去鼠标焦点,不会给与默认值 默认true
            timePicker24Hour: true, // 设置小时为24小时制 默认false
            timePicker: false, // 可选中时分 默认false
            locale: {
                format: 'YYYY-MM-DD',
                separator: ' - ',
                daysOfWeek: ['日', '一', '二', '三', '四', '五', '六'],
                monthNames: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月']
            }
        }).on('cancel.daterangepicker', function (ev, picker) {
            // $('.selectDate').val("");
            $configDate.val('');
            _this.ctrl.setValue('');
        }).on('apply.daterangepicker', function (ev, picker) {
            // $('.selectDate').val(picker.startDate.format('YYYY-MM-DD'));
            $configDate.val(picker.startDate.format('YYYY-MM-DD'));
            _this.ctrl.setValue(picker.startDate.format('YYYY-MM-DD'));
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
