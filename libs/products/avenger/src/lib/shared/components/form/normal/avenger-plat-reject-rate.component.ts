import { Component, ElementRef, Input, OnChanges, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, FormGroup } from '@angular/forms';
import { XnInputOptions } from 'libs/shared/src/lib/public/form/xn-input.options';
import { DynamicForm } from 'libs/shared/src/lib/common/dynamic-form/dynamic.decorators';
import { AmountControlCommService } from 'libs/console/src/lib/risk-control/transaction-control/amount/amount-control-comm.service';

@Component({
    selector: 'avenger-platreject-rate-info',
    templateUrl: './avenger-plat-reject-rate.component.html',
    styles: [
        `.inMemo {
            padding: 5px 0px;

        }
        .divfloat {
            float:left;
            display:inline-block;
            margin-right:10px;
        }
       div:nth-child(4){
           width:50%;

       }
       li{
           list-style:none;
       }
        `
    ]
})
@DynamicForm({ type: 'platrateReject', formModule: 'avenger-input' })
export class AvengerPaltRejectrateComponent implements OnInit, OnChanges {

    @Input() row: any;
    @Input() form: FormGroup;
    @ViewChild('input', { static: true }) input: ElementRef;
    myClass = '';
    alert = '';
    ctrl: AbstractControl;
    xnOptions: XnInputOptions;
    valuelist: any;
    inMemo = '';
    datalist: any[] = [];

    constructor(private er: ElementRef, private amountControlCommService: AmountControlCommService) {
    }

    ngOnChanges() {
        // 风控保理-获取供应商历史交易平均周期
        this.amountControlCommService.change.subscribe(x => {
            this.ctrl.setValue(x.averageDay);
        });
    }

    ngOnInit() {
        if (!this.row.placeholder) {
            this.row.placeholder = '';
            if (this.row.type === 'text' && this.row.value === 0) {
                this.row.placeholder = 0;
            }
        }

        this.ctrl = this.form.get(this.row.name);
        this.valuelist = this.row.value;
        this.xnOptions = new XnInputOptions(this.row, this.form, this.ctrl, this.er);

    }
}
