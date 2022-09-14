import {Component, OnInit, Input, ElementRef} from '@angular/core';
import {FormGroup, AbstractControl, FormControl} from '@angular/forms';
import {XnFormUtils} from '../../common/xn-form-utils';
import {isNullOrUndefined} from 'util';
import {XnInputOptions} from './xn-input.options';

@Component({
    selector: 'xn-text-icon-input',
    templateUrl: './text-icon-input.component.html',
    styles: [
        `.inMemo {padding: 5px 0px; color: #f20000}`
    ]
})
export class TextIconInputComponent implements OnInit {

    @Input() row: any;
    @Input() form: FormGroup;

    myClass = '';
    alert = '';
    ctrl: AbstractControl;
    xnOptions: XnInputOptions;
    inMemo = '';

    constructor(private er: ElementRef) {
    }

    ngOnInit() {
        if (!this.row.placeholder) {
            this.row.placeholder = '';
            if (this.row.type === 'text' && this.row.value === 0) {
                this.row.placeholder = 0;
            }
        }

        this.inMemo = this.row.options !== '' && this.row.options.inMemo || '';

        this.ctrl = this.form.get(this.row.name);
        this.calcAlertClass();

        this.ctrl.valueChanges.subscribe(v => {
            this.calcAlertClass();
        });

        this.xnOptions = new XnInputOptions(this.row, this.form, this.ctrl, this.er);
    }

    onBlur(): void {
        this.calcAlertClass();
    }

    calcAlertClass(): void {
        this.myClass = XnFormUtils.getClass(this.ctrl);
        this.alert = XnFormUtils.buildValidatorErrorString(this.ctrl);
    }

}
