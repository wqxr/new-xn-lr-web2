import {Component, OnInit, Input, ElementRef, OnDestroy} from '@angular/core';
import {FormGroup, AbstractControl} from '@angular/forms';
import {XnFormUtils} from '../../common/xn-form-utils';
import {XnInputOptions} from './xn-input.options';
import {DateCommunicateService} from '../../services/date-communicate.service';
import {XnUtils} from '../../common/xn-utils';
import {CalendarData} from '../../config/calendar';

declare let $: any;
import * as moment from 'moment';

/**
 *  定向收款模式-应收账款证明日期组件 特殊情况- 不可编辑-根据系统自动计算
 */
@Component({
    selector: 'xn-date3-input',
    templateUrl: './date3-input.component.html',
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
export class Date3InputComponent implements OnInit, OnDestroy {

    @Input() row: any;
    @Input() form: FormGroup;

    myClass = '';
    myClass2 = 'input-group-addon';
    alert = '';
    ctrl: AbstractControl;
    xnOptions: XnInputOptions;

    input: any;
    // 不可手动编辑，系统自动计算
    public isCalculationBool: Boolean;

    constructor(private er: ElementRef, private dateCommunicateService: DateCommunicateService) {
        this.dateCommunicateService.change.subscribe(x => {
            // 获取的数据 应付账款日期
            this.ngOnInit();
            if (this.row.checkerId === 'factoringDueDate' && this.row.flowId === 'financing13') {
                this.calcDate(this.ctrl, x, 0);
            } else if (this.row.checkerId === 'graceDate' && this.row.flowId === 'financing13') {
                this.calcDate(this.ctrl, x, 30);
            }
        });
    }

    ngOnInit() {
        if (!this.row.placeholder) {
            this.row.placeholder = '';
        }

        this.ctrl = this.form.get(this.row.name);
        // 不可手动编辑处理
        this.isCalculationBool = this.row.options && this.row.options.isCalculation;
        // 日期组件的默认配置在AppComponent里配置
        this.input = $(this.er.nativeElement).find('input');

        if (this.ctrl.value === '') {
            this.input.val(moment().format('YYYY-MM-DD'));
            if (this.row.checkerId === 'factoringDueDate' && this.row.flowId === 'financing13') {
                this.calcDate(this.ctrl, moment().format('YYYY-MM-DD'), 0);
            } else if (this.row.checkerId === 'graceDate' && this.row.flowId === 'financing13') {
                this.calcDate(this.ctrl, moment().format('YYYY-MM-DD'), 30);
            }
            this.input.val(this.ctrl.value);
            this.ctrl.setValue(this.input.val());
        } else {

            if (this.row.checkerId === 'graceDate' && this.row.flowId === 'financing13') {
                this.calcDate(this.ctrl, moment(this.ctrl.value, 'YYYYMMDD').format('YYYY-MM-DD'), 30);
                this.input.val(this.ctrl.value);
            } else {
                this.input.val(moment(parseInt(this.ctrl.value)).format('YYYY-MM-DD'));
            }
            this.ctrl.setValue(this.input.val());
        }

        this.input.on('change', (e) => {
            e.preventDefault();

            if (this.ctrl.disabled  || this.isCalculationBool) {
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
        if (this.ctrl.disabled || this.isCalculationBool) {
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

    replaceStr(str): string {
        return str.replace(/(\d{4})(\d{2})(\d{2})/, '$1-$2-$3');
    }

    private calcDate(ctrl, current, add) {
        CalendarData.getAllDate().subscribe(y => {
            // y 2018年所有假期
            const find = y.find(day => new Date(this.replaceStr(day.dateTime)).getTime() === new Date(current).getTime());
            const date = XnUtils.dateSalculate(1 + find.extended + add, current, 1);
            ctrl.setValue(date);
        });

    }
}
