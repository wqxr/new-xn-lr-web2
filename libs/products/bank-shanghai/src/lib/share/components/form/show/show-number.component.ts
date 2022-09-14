import { Component, Input, OnInit, ElementRef } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { XnUtils } from 'libs/shared/src/lib/common/xn-utils';
import { DynamicForm } from 'libs/shared/src/lib/common/dynamic-form/dynamic.decorators';
@Component({
    template: `
    <div style='width:100%'>
        <div [ngClass]="{'input-group': row.options?.unit}">
            <input class="form-control xn-input-font xn-input-border-radius" [(ngModel)]="val" [ngClass]="myClass" type="text"
            autocomplete="off" readonly="true" [attr.aria-describedby]="row.name">
            <span class="input-group-addon" *ngIf="row.options?.unit" [attr.id]="row.name">{{row.options?.unit}}</span>
        </div>
    </div>
    <ng-container *ngIf="row.options.currency">
        <div class="currency-info" *ngIf="![''].includes(filterVal)">
            <span class="currency-alert">{{ filterVal | xnCurrencyChinese }}</span>
        </div>
    </ng-container>
    `,
    styles: [`
    /* input-number */
    .currency-alert {
        color: #8d4bbb;
        font-size: 12px;
    }
    `]
})
@DynamicForm({ type: 'input-number', formModule: 'dragon-show' })
export class NumberInputShowComponent implements OnInit {
    @Input() row: any;
    @Input() form: FormGroup;

    val: string | number = '';
    filterVal: string | number = '';
    myClass = '';

    constructor(private er: ElementRef) {
    }

    ngOnInit() {
        this.row.placeholder = this.row?.placeholder || '';
        if (!XnUtils.isEmptys(this.row.data, [0])) {
            this.filterVal = String(this.row.data).replace(/,/g, '');
            if (!!XnUtils.isNumber(this.filterVal, true)){
                this.val = this.formatNum2Money(this.filterVal);
            }
        }
    }

    /**
     *  数值格式转换
     */
    private formatNum2Money(filterVal: string): string {
        const integer = `${XnUtils.formatMoney(Math.trunc(Number(filterVal)))}`;
        const decimal = filterVal.indexOf('.') > -1 ?
            filterVal.substring(filterVal.indexOf('.') + 1, filterVal.length) : '';
        const formatVal = `${integer}${!!decimal ? '.' : ''}${decimal}`;
        return formatVal;
    }

}
