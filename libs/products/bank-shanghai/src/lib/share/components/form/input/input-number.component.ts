import { ChangeDetectionStrategy, Component, OnInit, Input, ElementRef, ViewChild, OnChanges, AfterViewChecked } from '@angular/core';
import { FormGroup, AbstractControl } from '@angular/forms';
import { XnInputOptions } from 'libs/shared/src/lib/public/form/xn-input.options';
import { XnFormUtils } from 'libs/shared/src/lib/common/xn-form-utils';
import { DynamicForm } from 'libs/shared/src/lib/common/dynamic-form/dynamic.decorators';
import { XnUtils } from 'libs/shared/src/lib/common/xn-utils';

@Component({
    selector: 'input-number-component',
    templateUrl: './input-number.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    styles: [`
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
    .clear-btn {
        font-size: 15px;
        color: #ff5e00;
    }
    .check-btn {
        font-size: 15px;
        color: green;
    }
    /* input-number */
    .currency-alert {
        color: #8d4bbb;
        font-size: 12px;
    }
    .xn-money-alert {
        color: #8d4bbb;
        font-size: 12px;
    }
    `]
})
@DynamicForm({ type: 'input-number', formModule: 'dragon-input' })
export class NumberInputComponent implements OnInit {

    @Input() row: any;
    @Input() form: FormGroup;
    @ViewChild('numberInput', { static: true }) numberInput: ElementRef;

    myClass = '';
    alert = '';
    ctrl: AbstractControl;
    xnOptions: XnInputOptions;
    filterVal: string | number = '';

    constructor(private er: ElementRef) {
    }

    ngOnInit() {
        this.ctrl = this.form.get(this.row.name);
        this.row.placeholder = !this.row?.options?.readonly ? '请输入' : '';
        this.filterVal = this.ctrl.value || '';
        this.ctrl.valueChanges.subscribe(v => {
            this.calcAlertClass();
        });
        this.initValue();
        this.xnOptions = new XnInputOptions(this.row, this.form, this.ctrl, this.er);
    }

    initValue() {
        if (!XnUtils.isEmptys(this.row.value, [0])) {
            this.filterVal = String(this.row.value).replace(/,/g, '');
            if (!!XnUtils.isNumber(this.filterVal, true)){
                const val = this.formatNum2Money(this.filterVal);
                this.ctrl.setValue(val);
            }
        }
    }

    /**
     * 失焦事件
     * @param event
     */
    onBlur(event: any): void {
        this.calcAlertClass();
    }

    /**
     * 输入框输入事件
     * @param event
     */
    inputChange(event: any){
        this.filterVal = String(event.target.value).replace(/,/g, '');
        if (!!XnUtils.isNumber(this.filterVal, true)){
            const formatVal = this.formatNum2Money(this.filterVal);
            this.ctrl.setValue(formatVal);
        } else if ([''].includes(this.filterVal)){
            this.ctrl.setValue('');
        }
        // this.calcAlertClass();
    }

    /**
     *  提示判断
     */
    private calcAlertClass(): void {
        this.myClass = XnFormUtils.getClass(this.ctrl);
        this.alert = XnFormUtils.buildValidatorErrorString(this.ctrl);
    }

    /**
     *  数值格式转换
     */
    private formatNum2Money(filterVal: string): string {
        const truncNum = filterVal.indexOf('.') > -1 ? filterVal.substring(0, filterVal.indexOf('.')) : filterVal;
        // const integer = `${XnUtils.formatMoney(Math.trunc(Number(filterVal)))}`;
        const integer = truncNum.toString().replace(/(\d)(?=(\d{3})+\b)/g, '$1,');
        const decimal = filterVal.indexOf('.') > -1 ?
            filterVal.substring(filterVal.indexOf('.') + 1, filterVal.length) : '';
        const formatVal = `${integer}${!!decimal ? '.' : ''}${decimal}`;
        return formatVal;
    }

}
