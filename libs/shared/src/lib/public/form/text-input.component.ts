import { ChangeDetectionStrategy, Component, OnInit, Input, ElementRef, ViewChild, OnChanges } from '@angular/core';
import { FormGroup, AbstractControl } from '@angular/forms';
import { XnFormUtils } from '../../common/xn-form-utils';
import { XnInputOptions } from './xn-input.options';
import { AmountControlCommService } from 'libs/console/src/lib/risk-control/transaction-control/amount/amount-control-comm.service';

@Component({
    selector: 'xn-text-input',
    templateUrl: './text-input.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    styles: [
        `.inMemo {
            padding: 5px 0px;
            color: #f20000
        }`
    ]
})
export class TextInputComponent implements OnInit, OnChanges {

    @Input() row: any;
    @Input() form: FormGroup;
    @ViewChild('input', { static: true }) input: ElementRef;
    myClass = '';
    alert = '';
    ctrl: AbstractControl;
    xnOptions: XnInputOptions;
    inMemo = '';

    constructor(private er: ElementRef, private amountControlCommService: AmountControlCommService) {
    }

    ngOnChanges() {
        // 风控保理-获取供应商历史交易平均周期
        this.amountControlCommService.change.subscribe(x => {
            if (this.row.flowId === 'financing_supplier_enterprise' && this.row.checkerId === 'transactionCyclesHistoryAverage') {
                if (!!x.averageDay) {
                    x.averageDay = parseFloat(x.averageDay.toString()).toFixed(4); // 保留四位
                }
                this.ctrl.setValue(x.averageDay);
            }
        });
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
        this.calcAlertClass();

        this.ctrl.valueChanges.subscribe(v => {
            if (this.row.name === 'payRate') {
                if (isNaN(v) || 0.01 > Number(v) || Number(v) > 100) {
                    this.alert = '请输入0.01-100之间的数字';
                } else {
                    this.alert = '';
                }
            } else {
                this.calcAlertClass();

            }
        });
        this.xnOptions = new XnInputOptions(this.row, this.form, this.ctrl, this.er);
    }

    onBlur(event: any): void {

        if (this.row.name === 'payRate') {
            if (isNaN(event.target.value) || 0.01 > Number(event.target.value) || Number(event.target.value) > 100) {
                this.alert = '请输入0.01-100之间的数字';
            } else {
                this.alert = '';
            }
        } else {
            this.calcAlertClass();

        }
    }


    calcAlertClass(): void {
        this.myClass = XnFormUtils.getClass(this.ctrl);
        this.alert = XnFormUtils.buildValidatorErrorString(this.ctrl);
    }
    onOk() {
        if (this.row.id && this.row.id === 'upload-table') {
            if (this.row.name === 'numValue') {
                this.ctrl.setValue('C,F');
            }
        }


    }
}
