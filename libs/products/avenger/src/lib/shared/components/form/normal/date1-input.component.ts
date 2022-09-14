import { Component, OnInit, Input, ElementRef, OnDestroy } from '@angular/core';
import { FormGroup, AbstractControl } from '@angular/forms';
import { XnInputOptions } from 'libs/shared/src/lib/public/form/xn-input.options';
import { XnFormUtils } from 'libs/shared/src/lib/common/xn-form-utils';
import { XnUtils } from 'libs/shared/src/lib/common/xn-utils';
import { CalendarData } from 'libs/shared/src/lib/config/calendar';
import { XnService } from 'libs/shared/src/lib/services/xn.service';
import { DynamicForm } from 'libs/shared/src/lib/common/dynamic-form/dynamic.decorators';


declare let $: any;
import * as moment from 'moment';

@Component({
    selector: 'xn-date1-input',
    templateUrl: './date1-input.component.html',
    styles: [
        `.enable-input { background-color: #ffffff }`,
        `.input-group-addon { border-bottom-right-radius: 3px; border-top-right-radius: 3px;}`,
        `.xn-holiday-alert { color: #8d4bbb; font-size: 12px; }`,
    ]
})
@DynamicForm({ type: 'date1', formModule: 'avenger-input' })
export class AvengerDate1InputComponent implements OnInit, OnDestroy {

    @Input() row: any;
    @Input() form: FormGroup;
    @Input() svrConfig: any;

    myClass = '';
    myClass2 = 'input-group-addon';
    alert = '';
    ctrl: AbstractControl;
    xnOptions: XnInputOptions;
    endDate = '';
    input: any;
    rowName = 'receiveDate';
    receiveDate = '';
    holidayAlert = '';
    addDay: number;
    factoringEndAlert = '';
    factoringDateTemp = false;
    constructor(private er: ElementRef, private xn: XnService) {
    }

    ngOnInit() {
        if (!this.row.placeholder) {
            this.row.placeholder = '';
        }
        this.ctrl = this.form.get(this.row.name);
        // this.rowName === this.row.name;
        if (this.ctrl.value && this.ctrl.value !== '') {

            this.computeDay();
        }

        // 日期组件的默认配置在AppComponent里配置
        this.input = $(this.er.nativeElement).find('input');
        this.input.val((moment().format('YYYY-MM-DD')));
        this.ctrl.setValue(this.input.val());
        const datalist = Number(this.receiveDate);
        this.addDay = Number(JSON.parse(this.svrConfig.checkers[0].value)[4].value);
        this.endDate = this.calcDate(datalist, moment().format('YYYY-MM-DD'), this.addDay);
        this.factoringEndAlert = `贵公司期限是${this.addDay}天,请选择${this.endDate}之前的工作日`;

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
                this.receiveDate = val.replace(/-/g, '');
                this.computeDay();
            }

        }
        this.toValue();
    }
    private toValue() {
        if (!this.factoringDateTemp) {
            this.ctrl.setValue('');

        } else {
            const val = this.input.val();
            this.ctrl.setValue(val);
            this.calcAlertClass();
        }
    }
    calcAlertClass(): void {
        this.myClass = (this.ctrl.disabled ? '' : 'enable-input ') + XnFormUtils.getClass(this.ctrl);
        this.myClass2 = 'input-group-addon ' + this.myClass;
        this.alert = XnFormUtils.buildValidatorErrorString(this.ctrl);
    }

    computeDay() {
        XnUtils.computReceiveDay(this, CalendarData);
    }
    replaceStr(str): string {
        return str.replace(/(\d{4})(\d{2})(\d{2})/, '$1-$2-$3');
    }
    private calcDate(currentday, current, add) {
        let date1 = '';
        CalendarData.getAllDate().subscribe(y => {
            // y 2018年所有假期
            const find = y.find(day => new Date(this.replaceStr(day.dateTime)).getTime() === new Date(current).getTime());
            date1 = XnUtils.dateSalculate(1 + find.extended + add, current, 1);
        });
        return date1;

    }
}
