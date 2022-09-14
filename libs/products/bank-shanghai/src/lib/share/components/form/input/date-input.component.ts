import {Component, OnInit, Input, ElementRef, ChangeDetectorRef, ViewChild, AfterViewInit} from '@angular/core';
import {FormGroup, AbstractControl} from '@angular/forms';
import { DynamicForm } from 'libs/shared/src/lib/common/dynamic-form/dynamic.decorators';
import { XnInputOptions } from 'libs/shared/src/lib/public/form/xn-input.options';
import { XnFormUtils } from 'libs/shared/src/lib/common/xn-form-utils';
import { XnService } from 'libs/shared/src/lib/services/xn.service';
declare let $: any;
import * as moment from 'moment';

@Component({
    selector: 'lib-sh-date-input',
    templateUrl: './date-input.component.html',
    styles: [ `
    input.ng-invalid.ng-touched{
        border-color: #dd4b39;
        box-shadow: none;
    }
    input.ng-valid.ng-touched{
        border-color: #00a65a;
        box-shadow: none;
    }
    .error-alert, .success-alert {
        font-size: 12px;
    }
    `]
})
@DynamicForm({ type: 'sh-date', formModule: 'dragon-input' })
export class ShDateInputComponent implements OnInit, AfterViewInit {
    @Input() row: any;
    @Input() form: FormGroup;
    @ViewChild('datepicker', { static: true }) datepicker: ElementRef;
    @ViewChild('datepickerInput', { static: true }) datepickerInput: ElementRef;

    myClass = '';
    alert = '';
    ctrl: AbstractControl;
    xnOptions: XnInputOptions;

    constructor(private xn: XnService, private er: ElementRef, private cdr: ChangeDetectorRef) {
    }

    ngOnInit() {
        this.ctrl = this.form.get(this.row.name);
        this.row.placeholder = this.row.placeholder || '请选择日期';
        this.calcAlertClass();
        this.ctrl.valueChanges.subscribe((x: any) => {
            this.calcAlertClass();
        });
        this.xnOptions = new XnInputOptions(this.row, this.form, this.ctrl, this.er);
    }

    ngAfterViewInit(): void {
        // Date picker
        const dateOptions = options[this.row.checkerId] || {};
        const customBtn = customBtnOption[this.row.checkerId] || {};
        $(this.datepicker.nativeElement).datepicker({
            clearBtn: true, // 清除按钮
            autoclose: true, // 选中之后自动隐藏日期选择框
            language: 'zh-CN',
            todayBtn: true, // 今日按钮
            enableOnReadonly: true,
            format: 'yyyy-mm-dd', // 日期格式
            todayHighlight: true,  // 今日高亮展示
            ...dateOptions
        }).on('show', (e: any) => {
            if (customBtn && !!customBtn.show){
                const $tfootTh = $('.datepicker tfoot tr th');
                if (!$tfootTh.hasClass('forever-day')){
                    $('.datepicker tfoot tr').find('.clear').closest('tr')
                        .before(`<tr><th colspan="7" class="forever-day">${customBtn.btnText || ''}</th></tr>`);
                }
                const $tfootForeverTh = $('.datepicker tfoot tr').find('.forever-day');
                $tfootForeverTh.on('click', (event: any) => {
                    $(this.datepicker.nativeElement).datepicker('update', '2099-12-31');
                    $(this.datepicker.nativeElement).datepicker('hide');
                    this.ctrl.setValue('2099-12-31');
                    this.cdr.markForCheck();
                });
            }
        }).on('changeDate', (e: any) => {
            // `e` here contains the extra attributes-e.date, e.dates, e.format(['yy-mm-dd'])
            this.ctrl.setValue(e.format(['yyyy-mm-dd']));
            this.cdr.markForCheck();
        });
    }

    onBlur() {
        this.calcAlertClass();
    }

    calcAlertClass(): void {
        this.myClass = XnFormUtils.getClass(this.ctrl);
        this.alert = XnFormUtils.buildValidatorErrorString(this.ctrl);
    }
}

// 针对不同checker项定制不同配置
const options = {
    businessLicenseStartDate: {
        endDate: '-1d',
    },
    businessLicenseEndDate: {
        startDate: '+1d',
    },
    orgLegalCardEndDate: {
        startDate: '+1d',
    },
    orgLegalCertEndDate: {
        startDate: '+1d',
    }
};
const customBtnOption = {
    businessLicenseEndDate: {
        show: true,
        btnText: '长期有效'
    },
    orgLegalCardEndDate: {
        show: true,
        btnText: '长期有效'
    },
};
