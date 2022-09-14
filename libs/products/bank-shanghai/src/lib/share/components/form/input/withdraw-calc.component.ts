/**
 * 只读输入框--解决表单控件设置只读后无法提交
 */
import { ChangeDetectorRef, Component, ElementRef, Input, OnInit } from '@angular/core';
import { AbstractControl, FormGroup } from '@angular/forms';
import { DynamicForm } from 'libs/shared/src/lib/common/dynamic-form/dynamic.decorators';
import { XnFormUtils } from 'libs/shared/src/lib/common/xn-form-utils';
import { XnUtils } from 'libs/shared/src/lib/common/xn-utils';
import { XnInputOptions } from 'libs/shared/src/lib/public/form/xn-input.options';

@Component({
    selector: 'withdraw-calc',
    template: `
    <div class="calc-wrapper">
        <div class="row" *ngFor="let item of calcExpression;let i=index" [ngClass]="{'mb-15': i%2 !== 0}">
            <div *ngFor="let col of item.row;let j=index" class="col-text" [class]="col.class || 'col-md-1'">
                <ng-container *ngTemplateOutlet="colTpl; context: { $implicit: col, rowIndex: i, colIndex: j}"></ng-container>
            </div>
        </div>
    </div>
    <ng-template #colTpl let-col let-rowIndex="rowIndex" let-colIndex="colIndex">
        <ng-container [ngSwitch]="col?.type">
            <ng-container *ngSwitchCase="'label'">
                <span class="col-label"> {{col?.val || '&nbsp;&nbsp;'}}</span>
            </ng-container>
            <ng-container *ngSwitchCase="'symbol'">
                <span class="col-label"> {{col?.val || '&nbsp;&nbsp;'}}</span>
            </ng-container>
            <ng-container *ngSwitchCase="'date'">
                <span class="form-control xn-input-font xn-input-border-radius" [ngClass]="myClass">
                    {{col?.val || '&nbsp;&nbsp;'}}
                </span>
            </ng-container>
            <ng-container *ngSwitchCase="'val'">
                <span class="form-control xn-input-font xn-input-border-radius" [ngClass]="myClass">
                    {{formatNum2Money(col?.val || '&nbsp;&nbsp;')}}
                </span>
            </ng-container>
        </ng-container>
    </ng-template>
    <span class="xn-input-alert" *ngIf="!!alert">{{alert}}</span>
    `,
    styles: [`
    .readonlys-tyle {
        background: #eee;
        pointer-events: none;
        cursor: not-allowed;
    }
    .text-red {
        color: #ff5500;
    }
    .col-text {
        text-align: center;
    }
    .col-symbol {
        float: left;
        height: 34px;
        padding: 6px 0px;
        display: block;
    }
    .mb-5 {
        margin-bottom: 5px;
    }
    .mb-15 {
        margin-bottom: 15px;
    }
    .pr-5 {
        padding-right: 5px;
    }
    .pl-5 {
        padding-left: 5px;
    }
    `]
})
@DynamicForm({ type: 'withdraw-calc', formModule: 'dragon-input' })
export class WithdrawCalcComponent implements OnInit {

    @Input() row: any;
    @Input() form: FormGroup;
    @Input() svrConfig: any;
    calcExpression: any[] = [];

    myClass = '';
    alert = '';
    ctrl: AbstractControl;
    xnOptions: XnInputOptions;
    inMemo = '';
    constructor(private er: ElementRef, private cdr: ChangeDetectorRef) {
    }

    ngOnInit() {
        if (!this.row.placeholder) {
            this.row.placeholder = '';
            if (this.row.type === 'text' && this.row.value === 0) {
                this.row.placeholder = 0;
            }
        }
        this.inMemo = !!this.row.options && this.row.options !== '' && this.row.options.inMemo || '';
        this.ctrl = this.form.get(this.row.name);
        this.calcExpression = XnUtils.parseObject(this.ctrl.value, []);
        // this.calcAlertClass();
        this.ctrl.valueChanges.subscribe(v => {
            this.calcAlertClass();
        });
        this.xnOptions = new XnInputOptions(this.row, this.form, this.ctrl, this.er);
    }


    /**
     * @description: 表单组件set值
     * @param {*} val
     * @return {*}
     */
    private toValue(val: string = '') {
        this.ctrl.setValue(val);
        this.cdr.markForCheck();
        this.alert = XnFormUtils.buildValidatorErrorString(this.ctrl);
    }

    calcAlertClass(): void {
        this.myClass = XnFormUtils.getClass(this.ctrl);
        this.alert = XnFormUtils.buildValidatorErrorString(this.ctrl);
    }

    /**
     *  数值格式转换
     */
    formatNum2Money(filterVal: string = ''): string {
         let inputVal = String(filterVal);
        const truncNum = inputVal.indexOf('.') > -1 ? inputVal.substring(0, inputVal.indexOf('.')) : inputVal;
        // const integer = `${XnUtils.formatMoney(Math.trunc(Number(inputVal)))}`;
        const integer = truncNum.toString().replace(/(\d)(?=(\d{3})+\b)/g, '$1,');
        const decimal = inputVal.indexOf('.') > -1 ? inputVal.substring(inputVal.indexOf('.') + 1, inputVal.length) : '';
        const formatVal = `${integer}${!!decimal ? '.' : ''}${decimal}`;
        return formatVal;
    }
}
