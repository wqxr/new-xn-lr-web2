import { ChangeDetectionStrategy, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { DynamicForm } from '../../dynamic.decorators';
import { FormGroup, AbstractControl } from '@angular/forms';
import { XnInputOptions } from 'libs/shared/src/lib/public/form/xn-input.options';
import { XnFormUtils } from 'libs/shared/src/lib/common/xn-form-utils';
import { XnUtils } from 'libs/shared/src/lib/common/xn-utils';
import { XnService } from 'libs/shared/src/lib/services/xn.service';
import { LocalStorageService } from 'libs/shared/src/lib/services/local-storage.service';
import * as moment from 'moment';

@Component({
    templateUrl: './number-range-input.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    styles: [
        `.inMemo {
            padding: 5px 0px;
            color: #f20000
        }`
    ]
})
@DynamicForm({ type: 'number-range', formModule: 'default-input' })
export class NumberRangeComponent implements OnInit {

    @Input() row: any;
    @Input() form: FormGroup;
    @Input() svrConfig: any;
    public ctrl1: AbstractControl;
    public ctrl2: AbstractControl;
    public ctrl3: AbstractControl;
    @ViewChild('input', { static: true }) input: ElementRef;
    myClass = '';
    alert = '';
    ctrl: AbstractControl;
    xnOptions: XnInputOptions;
    errorClass = false;
    formValue = {
        firstValue: '',
        secondValue: '',
    };
    constructor(private er: ElementRef, private xn: XnService, private localStorageService: LocalStorageService) {
    }

    ngOnInit() {
        if (!this.row.placeholder) {
            this.row.placeholder = '';
            if (this.row.type === 'text' && this.row.value === 0) {
                this.row.placeholder = 0;
            }
        }
        this.ctrl = this.form.get(this.row.name);
        //   this.calcAlertClass();
        if (this.ctrl.value !== '') {
            this.formValue = JSON.parse(this.ctrl.value);
        }
        this.ctrl.valueChanges.subscribe(() => {
            this.calcAlertClass();
        });
        this.xnOptions = new XnInputOptions(this.row, this.form, this.ctrl, this.er);
    }
    public inputChange(e: any, key: string) {
        if (isNaN(e.target.value) || e.target.value === '' || (e.target.value + '').indexOf('.') > 0) {
            this.errorClass = true;
            this.formValue[key] = '';
            e.target.value = '';
            this.errorClass = false;
        } else {
            this.formValue[key] = Number(e.target.value);
        }
        this.toValue();

    }
    onBlur(): void {
        this.calcAlertClass();
    }

    private toValue() {
        this.errorClass = false;
        if (this.row.name === 'rateRange') {
            this.errorClass = true;
            this.ctrl.setValue('');
            return;
        }
        if (this.formValue.firstValue === '' && this.formValue.secondValue === '') {
            this.ctrl.setValue('');
            return;
        }
        if (this.formValue.firstValue > this.formValue.secondValue && this.formValue.secondValue !== '') {
            this.errorClass = true;
            this.ctrl.setValue('');
        } else {
            this.errorClass = false;
            this.ctrl.setValue(JSON.stringify(this.formValue));
        }

    }


    calcAlertClass(): void {
        this.myClass = XnFormUtils.getClass(this.ctrl);
        // this.alert = XnFormUtils.buildValidatorErrorString(this.ctrl);
    }
}
