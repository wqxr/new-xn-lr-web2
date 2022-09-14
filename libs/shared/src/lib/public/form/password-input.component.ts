import {Component, OnInit, Input, ElementRef} from '@angular/core';
import {FormGroup, AbstractControl} from '@angular/forms';
import {XnFormUtils} from '../../common/xn-form-utils';
import {XnInputOptions} from './xn-input.options';

@Component({
    selector: 'xn-password-input',
    templateUrl: './password-input.component.html',
    styles: []
})
export class PasswordInputComponent implements OnInit {

    @Input() row: any;
    @Input() form: FormGroup;

    myClass = '';
    alert = '';
    ctrl: AbstractControl;
    xnOptions: XnInputOptions;

    constructor(private er: ElementRef) {
    }

    ngOnInit() {
        if (!this.row.placeholder) {
            this.row.placeholder = '';
        }

        this.ctrl = this.form.get(this.row.name);
        this.calcAlertClass();

        this.ctrl.valueChanges.subscribe(v => {
            this.calcAlertClass();
        });

        this.xnOptions = new XnInputOptions(this.row, this.form, this.ctrl, this.er);
    }

    onBlur() {
        this.calcAlertClass();
    }

    calcAlertClass() {
        this.myClass = XnFormUtils.getClass(this.ctrl);
        this.alert = XnFormUtils.buildValidatorErrorString(this.ctrl);
    }
}
