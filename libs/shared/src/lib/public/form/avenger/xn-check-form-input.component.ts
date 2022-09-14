import {Component, OnInit, Input} from '@angular/core';
import {FormGroup, AbstractControl} from '@angular/forms';
import {XnFormUtils} from 'libs/shared/src/lib/common/xn-form-utils';
import {SelectOptions} from 'libs/shared/src/lib/config/select-options';
import {XnUtils} from 'libs/shared/src/lib/common/xn-utils';

class InputModel {
    firstValue = '';
    secondValue = '';
}

@Component({
    selector: 'xn-check-form-input',
    templateUrl: './xn-check-form-input.component.html'
})
export class CheckFormInputComponent implements OnInit {
    @Input() row: any;
    @Input() form: FormGroup;
    public formValue: InputModel = new InputModel();
    myClass = '';
    alert = '';
    ctrl: AbstractControl;

    constructor() {

    }

    ngOnInit() {
        this.row.selectOptions = SelectOptions.get('CheckForm');
        if (!this.form) {
            if (this.row.data) {
                this.formValue = JSON.parse(this.row.data);
            }
            return;
        }
        this.ctrl = this.form.get(this.row.name);
        this.ctrl.statusChanges.subscribe(() => {
            this.alert = XnFormUtils.buildValidatorErrorString(this.ctrl);
            this.calcAlertClass();
        });
        this.fromValue();
    }

    public inputChange(e, key) {
        this.formValue[key] = e.target.value;
    }

    public onBlur() {
        this.toValue();
    }

    private fromValue() {
        const data = XnUtils.parseObject(this.ctrl.value, {});
        if (!XnUtils.isEmptyObject(data)) {
            this.formValue = data;
        }
        this.toValue();
    }

    private calcAlertClass() {
        this.myClass = XnFormUtils.getClass(this.ctrl);
        this.alert = XnFormUtils.buildValidatorErrorString(this.ctrl);
    }

    private toValue() {
        if (!this.formValue.secondValue || this.formValue.secondValue === '') {
            this.ctrl.setValue('');
        } else {
            this.ctrl.setValue(JSON.stringify(this.formValue));
        }
        this.calcAlertClass();
        this.ctrl.markAsTouched();
    }
}
