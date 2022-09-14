import {Component, OnInit, Input, ElementRef, ViewChild} from '@angular/core';
import {FormGroup, AbstractControl} from '@angular/forms';
import {XnFormUtils} from '../../common/xn-form-utils';
import {XnInputOptions} from './xn-input.options';
import { AmountControlCommService } from 'libs/console/src/lib/risk-control/transaction-control/amount/amount-control-comm.service';

@Component({
    selector: 'app-xn-text-input-wind',
    templateUrl: './text-input-wind.component.html',
    styles: [
            `.inMemo {
            padding: 5px 0px;
            color: #f20000
        }`
    ]
})
export class TextInputWindComponent implements OnInit {

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
            this.calcAlertClass();
        });
        this.xnOptions = new XnInputOptions(this.row, this.form, this.ctrl, this.er);
    }


    onBlur(event: any): void {
        if (this.row.checkerId === 'creditRate') { // 保理风控 - 修改供应商额度 - 输入授信额度比例
            if (!isNaN(parseFloat(this.ctrl.value))) {
                const num = parseFloat(this.ctrl.value);
                if (num < 0 || num > 100) {
                    this.alert = '请输入0~100整数';
                    this.myClass = 'xn-control-invalid';
                } else {
                    this.ctrl.setValue(`${num}%`);
                    this.amountControlCommService.rate.emit(num);
                    this.myClass = 'xn-control-valid';
                }
            } else {
                this.alert = '请输入0~100整数';
                this.myClass = 'xn-control-invalid';
            }
        } else {
            this.calcAlertClass();
        }
    }

    calcAlertClass(): void {
        this.myClass = XnFormUtils.getClass(this.ctrl);
        this.alert = XnFormUtils.buildValidatorErrorString(this.ctrl);
    }
}
