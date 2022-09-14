import { Component, OnInit, ElementRef, Input } from '@angular/core';
import { FormGroup, AbstractControl } from '@angular/forms';
import { XnFormUtils } from '../../common/xn-form-utils';
import { XnInputOptions } from './xn-input.options';
import { XnService } from '../../services/xn.service';

@Component({
    selector: 'xn-radio-billingType-input',
    templateUrl: './radio-billingType-input.component.html',
    styles: [
        `.xn-radio-row {
            padding-top: 7px;
        }`,
        `.xn-radio-row label {
            font-weight: normal;
            margin: 0 10px;
        }`,
        `.xn-radio-row button:focus {
            outline: none
        }`, // 去掉点击后产生的边框
    ]
})
export class RadioBillingTypeInputComponent implements OnInit {

    @Input() row: any;
    @Input() form: FormGroup;

    myClass = '';
    alert = '';
    showClearBtn = false;
    ctrl: AbstractControl;
    xnOptions: XnInputOptions;

    isChecked = false;

    constructor(private er: ElementRef, private xn: XnService) {
    }

    ngOnInit() {
        this.ctrl = this.form.get(this.row.name);
        this.calcAlertClass();
        if (!this.ctrl.value) {
            this.ctrl.setValue('1');
        }
        this.ctrl.valueChanges.subscribe(v => {
            // this.showClearBtn = true;
            this.calcAlertClass();
            // if (v === '2') {
            //     this.xn.msgBox.open(false, 'SZCA专票开具周期为3个月');
            // }
        });
        this.xnOptions = new XnInputOptions(this.row, this.form, this.ctrl, this.er);
    }

    private calcAlertClass() {
        this.myClass = XnFormUtils.getClass(this.ctrl);
        this.alert = XnFormUtils.buildValidatorErrorString(this.ctrl);
    }

    onClear() {
        this.showClearBtn = false;
        this.ctrl.setValue(null);

    }
}
