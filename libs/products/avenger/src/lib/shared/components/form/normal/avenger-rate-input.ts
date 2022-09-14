import { ChangeDetectionStrategy, Component, ElementRef, Input, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { AbstractControl, FormGroup } from '@angular/forms';
import { XnInputOptions } from 'libs/shared/src/lib/public/form/xn-input.options';
import { XnFormUtils } from 'libs/shared/src/lib/common/xn-form-utils';
import { DynamicForm } from 'libs/shared/src/lib/common/dynamic-form/dynamic.decorators';

@Component({
    selector: 'avenger-rate-input',
    template: `
    <div [formGroup]="form">
        <input #input class="form-control xn-input-font xn-input-border-radius"  style='display:inline;width:99%' [ngClass]="myClass" type="text"
            [placeholder]="row.placeholder" [formControlName]="row.checkerId" (blur)="onBlur()" autocomplete="off">
        <span style='display: block;width: 1%;float: right;font-weight:200;padding-top:5px'>%</span>
    </div>
    <span class="xn-input-alert">{{alert}}</span>
    `,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
@DynamicForm({ type: 'rate-input', formModule: 'avenger-input' })
export class AvengerRateInputComponent implements OnInit {

    @Input() row: any;
    @Input() form: FormGroup;
    @ViewChild('input') input: ElementRef;
    public myClass = ''; // 控件样式
    public alert = ''; // 错误提示
    public ctrl: AbstractControl;
    public ctrl_tradeList: AbstractControl;
    public xnOptions: XnInputOptions;
    public regExp = /^(^[1-9](\d)?(\.\d{1,2})?$)|(^0$)|(^\d\.\d{1,2}$)$/;
    constructor(private er: ElementRef, private cdr: ChangeDetectorRef, ) {
    }

    ngOnInit() {
        if (!this.row.placeholder) {
            this.row.placeholder = '';
        }
        this.ctrl = this.form.get(this.row.name);
        this.ctrl_tradeList = this.form.get('tradeList');

        this.calcAlertClass();
        if (!!this.ctrl.value){
            const x = this.ctrl.value;
            const tradeListVal = JSON.parse(this.ctrl_tradeList.value);
            tradeListVal.map((listVal) => {
                if (listVal.changeEnd !== null && listVal.changeEnd !== undefined){
                    const unitPrice = Number(listVal.changeEnd) / (1 + Number(x / 100));
                    listVal.unitPrice = unitPrice.toFixed(2);
                    listVal.taxAmount = (unitPrice * Number(x / 100)).toFixed(2);
                }
            });
            this.ctrl_tradeList.setValue(JSON.stringify(tradeListVal));
        }
        this.ctrl.valueChanges.subscribe((x) => {
            if (['sub_nuonuocs_blue', 'sub_nuonuocs_blue_offline'].includes(this.row.flowId) && this.regExp.test(x)){
                const tradeListVal = JSON.parse(this.ctrl_tradeList.value);
                tradeListVal.map((listVal) => {
                    if (listVal.changeEnd !== null && listVal.changeEnd !== undefined){
                        const unitPrice = Number(listVal.changeEnd) / (1 + Number(x / 100));
                        listVal.unitPrice = unitPrice.toFixed(2);
                        listVal.taxAmount = (unitPrice * Number(x / 100)).toFixed(2);
                    }
                });
                this.ctrl_tradeList.setValue(JSON.stringify(tradeListVal));
                // this.cdr.markForCheck();
            }
            this.calcAlertClass();
        });
        this.xnOptions = new XnInputOptions(this.row, this.form, this.ctrl, this.er);
    }
    /**
     *  失去焦点事件
     */
    public onBlur(): void {
        this.calcAlertClass();
    }

    calcAlertClass(): void {
        this.myClass = XnFormUtils.getClass(this.ctrl);
        this.alert = XnFormUtils.buildValidatorErrorString(this.ctrl);
    }
}
