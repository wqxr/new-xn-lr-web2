import { Component, OnInit, Input, ElementRef, OnDestroy, ViewChild } from '@angular/core';
import { FormGroup, AbstractControl, Validators } from '@angular/forms';
import { XnInputOptions } from 'libs/shared/src/lib/public/form/xn-input.options';
import { XnFormUtils } from 'libs/shared/src/lib/common/xn-form-utils';
import { DynamicForm } from '../../dynamic.decorators';
import { XnUtils } from 'libs/shared/src/lib/common/xn-utils';
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
@DynamicForm({ type: 'date4', formModule: 'default-input' })

export class Date4InputComponent implements OnInit, OnDestroy {

    @Input() row: any;
    @Input() form: FormGroup;
    @ViewChild('configDate', { static: true }) configDate: ElementRef;
    @ViewChild('alertInfo', { static: true }) alertInfo: ElementRef;

    myClass = '';
    myClass2 = 'input-group-addon';
    alert = '';
    dateAlert = '';
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
        this.initDate();
        if (!this.row.placeholder) {
            this.row.placeholder = '';
        }
        console.log(this.row?.options?.format);
        this.ctrl = this.form.get(this.row.name);

        // 日期组件的默认配置在AppComponent里配置
        // this.input = $(this.er.nativeElement).find('input');
        const $configDate = $(this.configDate.nativeElement);
        const $alertInfo = $(this.alertInfo.nativeElement);
        const regs = /^(?:19|20)[0-9][0-9](?:(?:0[1-9])|(?:1[0-2]))(?:(?:[0-2][1-9])|(?:[1-3][0-1]))$/g;
        if (this.ctrl.value === '' || this.ctrl.value === undefined) {
            $configDate.val('');
            this.ctrl.setValue('');
            $alertInfo.html('');
        } else {
            // let newDate = XnUtils.toDateFromString(this.ctrl.value);
            if (!(regs.test(String(this.ctrl.value))) && String(this.ctrl.value).length === 13) {
                $configDate.val(moment(Number(this.ctrl.value)).format('YYYYMMDD'));
            } else if (String(this.ctrl.value).length === 8) {
                $configDate.val(moment(Number(this.ctrl.value)).valueOf().toString());
            }
            this.ctrl.setValue($configDate.val());
        }
        $configDate.on('change', (e) => {
            e.preventDefault();
            const reg = /^(?:19|20)[0-9][0-9](?:(?:0[1-9])|(?:1[0-2]))(?:(?:[0-2][1-9])|(?:[1-3][0-1]))$/g;
            if (String($configDate.val()) !== '' && !(reg.test($configDate.val()))) {
                $configDate.addClass('not-invalid');
                $alertInfo.html(`请输入正确有效的时间格式，格式为${this.row?.options?.format || 'YYYYMMDD'}`);
                // this.ctrl.setValue(this.input.val());
                this.ctrl.setErrors({ date: true });
            } else {
                $configDate.removeClass('not-invalid');
                $alertInfo.html('');
                this.ctrl.setErrors(null);
                if (!this.ctrl.disabled) {
                    this.ctrl.setValue($configDate.val());
                }
            }
            this.ctrl.markAsTouched();
            // if (this.ctrl.disabled) {
            //     this.input.val(this.ctrl.value);
            // } else {
            //     const val = this.input.val();
            //     if (val !== this.ctrl.value) {
            //         this.ctrl.markAsTouched();
            //         this.ctrl.setValue(val);
            //     }
            // }
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
        const $alertInfo = $(this.alertInfo.nativeElement);
        $(this.configDate.nativeElement).daterangepicker({
            singleDatePicker: true, // 设置为单个的datepicker，而不是有区间的datepicker 默认false
            showDropdowns: true, // 当设置值为true的时候，允许年份和月份通过下拉框的形式选择 默认false
            autoUpdateInput: false, // 1.当设置为false的时候,不给与默认值(当前时间)2.选择时间时,失去鼠标焦点,不会给与默认值 默认true
            timePicker24Hour: true, // 设置小时为24小时制 默认false
            timePicker: false, // 可选中时分 默认false，
            minDate: this.row.options?.minDate ? new Date() : null, // minDate 设置为true只能选择今天及之后的日期，默认可以选择
            locale: {
                format: _this.row?.options?.format || 'YYYYMMDD',
                separator: '',
                daysOfWeek: ['日', '一', '二', '三', '四', '五', '六'],
                monthNames: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月']
            }
        }).on('cancel.daterangepicker', function (ev, picker) {
            //  $('.selectDate').val("");
            $configDate.val('');
            _this.ctrl.setValue('');
            $alertInfo.html('');
        }).on('apply.daterangepicker', function (ev, picker) {
            //  $('.selectDate').val(picker.startDate.format('YYYY-MM-DD'));
            $configDate.val(picker.startDate.format(_this.row?.options?.format || 'YYYYMMDD'));
            _this.ctrl.setValue(picker.startDate.format(_this.row?.options?.format || 'YYYYMMDD'));
            $alertInfo.html('');
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
