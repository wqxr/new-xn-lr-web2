import { ChangeDetectionStrategy, Component, OnInit, Input, ElementRef, OnDestroy, ViewChild } from '@angular/core';
import { FormGroup, AbstractControl } from '@angular/forms';
import { DynamicForm } from '../../../../../common/dynamic-form/dynamic.decorators';
import { XnInputOptions } from '../../../../form/xn-input.options';
import { XnFormUtils } from '../../../../../common/xn-form-utils';


class SelectInputModel {
    type = 0;
    value = '';
}

@Component({
    selector: 'samp-select-number',
    templateUrl: './sampling-select-number.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    styles: [
    ]
})
@DynamicForm({ type: 'samp-select-number', formModule: 'dragon-input' })

export class SampSelectNumberComponent implements OnInit, OnDestroy {

    @Input() row: any;
    @Input() form: FormGroup;
    public myClass = '';
    public alert = '';
    public selAlert = '';
    public selCtrl: AbstractControl;
    public ctrl: AbstractControl;
    public ischeck = '';
    public textInput: string;
    public selectArrary: any[];
    public xnOptions: XnInputOptions;
    public readonly = false;

    public formValue: SelectInputModel = new SelectInputModel();
    @ViewChild('input') input: ElementRef;

    constructor(
        private er: ElementRef,
    ) {
    }

    ngOnInit() {
        this.readonly = this.row.options && this.row.options.readonly && this.row.options.readonly === true;
        this.ctrl = this.form.get(this.row.name);
        if (this.ctrl.value !== '') {
            this.formValue = this.ctrl.value;
        }
        this.calcAlertClass();
        this.ctrl.valueChanges.subscribe(v => {
            this.ctrl.markAsTouched();
            this.calcAlertClass();

        });
        this.xnOptions = new XnInputOptions(this.row, this.form, this.ctrl, this.er);

    }

    ngOnDestroy() {

    }

    public onBlur() {
        if (this.formValue.type === 0) {
            return;
        }
    }

    public onBlur1() {
    }

    public selectChange(e: any) {
        this.formValue.type = Number(e.target.value);
        this.formValue.value = '';
        if (this.formValue.type === 0) {
            this.alert = '';
            this.ctrl.setValue('');
            return;
        }
        this.toValue();
        if (Number(this.formValue.type) === 3 || Number(this.formValue.type) === 5 || Number(this.formValue.type) === 7) {
            this.ctrl.setValue('');
            this.alert = '请输入0~20之间的整数';
        }

    }

    public inputChange(e: any) {
        this.formValue.value = e.target.value;
        if (Number(this.formValue.type) === 3 || Number(this.formValue.type) === 5 || Number(this.formValue.type) === 7) {
            const re: RegExp = /^\d*$/;
            const ok = re.test(this.formValue.value);
            if (ok && this.formValue.value && Number(this.formValue.value) > 0 && Number(this.formValue.value) < 21) {
                this.toValue();
                this.alert = '';
            } else {
                this.ctrl.setValue('');
                this.alert = '请输入0~20之间的整数';
            }
            return;
        }
        this.toValue();
    }

    public calcAlertClass(): void {
        this.myClass = XnFormUtils.getClass(this.ctrl);
        this.alert = XnFormUtils.buildValidatorErrorString(this.ctrl);
    }

    private toValue() {
        const value = {} as any;
        for (const key in this.formValue) {
            if (!!this.formValue[key]) {
                value[key] = Number(this.formValue[key]);
            } else if (key === 'value') {
                value[key] = -1;
            }
        }
        this.ctrl.setValue(value);
        this.ctrl.markAsTouched();
        this.calcAlertClass();

    }
}
