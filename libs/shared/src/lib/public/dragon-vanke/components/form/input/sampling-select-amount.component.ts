import { ChangeDetectionStrategy, Component, OnInit, Input, ElementRef, OnDestroy, ViewChild } from '@angular/core';
import { FormGroup, AbstractControl } from '@angular/forms';
import { DynamicForm } from '../../../../../common/dynamic-form/dynamic.decorators';
import { XnInputOptions } from '../../../../form/xn-input.options';
import { XnFormUtils } from '../../../../../common/xn-form-utils';


class SelectInputModel {
    type = 0;
    value = '';
    min = '';
    max = '';
    valid = false;
}


declare let $: any;
declare const moment: any;

@Component({
    selector: 'samp-select-amount',
    templateUrl: './sampling-select-amount.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    styles: [
        `
        .linkInput {
            display: block;
            width: 50px;
            height: 18px;
            border-bottom: 1px solid #000;
        }
        `
    ]
})
@DynamicForm({ type: 'samp-select-amount', formModule: 'dragon-input' })

export class SampSelectAmountComponent implements OnInit, OnDestroy {

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
            if (this.ctrl.value.type === 1) {
                this.formValue = new SelectInputModel();
                this.formValue.type = this.ctrl.value.type;
                this.formValue.value = this.ctrl.value.max;
            }
            if (this.ctrl.value.type === 2) {
                this.formValue = new SelectInputModel();
                this.formValue.type = this.ctrl.value.type;
                this.formValue.value = this.ctrl.value.min;
            }
            if (this.ctrl.value.type === 3) {
                this.formValue = this.ctrl.value;
                this.formValue.type = this.ctrl.value.type;
            }
            this.formValue.valid = true;
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
        this.formValue.type = Number( e.target.value);
        this.formValue.value = '';
        if (this.formValue.type === 0) {
            this.ctrl.setValue('');
            this.alert = '';
            return;
        }
        if (Number(this.formValue.type) === 1 || Number(this.formValue.type) === 2) {
            this.setVoidValue();
            this.alert = '请输入数字';
            return;
        }
        if (Number(this.formValue.type) === 3) {
            this.setVoidValue();
            this.alert = '请输入数字(后输入框数字应大于前输入框数字)';
            return;
        }
    }

    public inputChange(e: any, type?: string) {
        this.formValue.value = e.target.value;
        if (Number(this.formValue.type) === 1 || Number(this.formValue.type) === 2) {
            const re: RegExp = /^\d*$/;
            const ok = re.test(this.formValue.value);
            if (ok && this.formValue.value) {
                this.formValue.valid = true;
                const formValue = {} as any;
                if (Number(this.formValue.type) === 1) {
                    formValue.max = Number(this.formValue.value);
                    formValue.min = -1;
                } else {
                    formValue.min = Number(this.formValue.value);
                    formValue.max = -1;
                }
                formValue.type = Number(this.formValue.type);
                formValue.valid = true;
                this.ctrl.setValue(formValue);
                this.alert = '';
            } else {
                this.formValue.valid = false;
                this.setVoidValue();
                this.alert = '请输入数字';
            }
            return;
        }
        if (Number(this.formValue.type) === 3) {
            this.formValue[type] = e.target.value;
            const re: RegExp = /^\d*$/;
            const ok = re.test(this.formValue[type]);
            if (ok && Number(this.formValue.max) > Number(this.formValue.min)) {
                this.formValue.valid = true;
                this.formValue.value = '';
                this.toValue();
                this.alert = '';
            } else {
                this.formValue.valid = false;
                this.setVoidValue();
                this.alert = '请输入数字(后输入框数字应大于前输入框数字)';
            }
            return;
        }
        this.toValue();
    }

    public calcAlertClass(): void {
        this.myClass = XnFormUtils.getClass(this.ctrl);
    }

    private toValue() {
        const value = {} as any;
        for (const key in this.formValue) {
            if (!!this.formValue[key]) {
                value[key] = Number(this.formValue[key]);
            }
        }
        value.valid = true;
        this.ctrl.setValue(value);
        this.ctrl.markAsTouched();
        this.calcAlertClass();

    }

    private setVoidValue() {
        const value = new SelectInputModel();
        value.type = this.formValue.type;
        value.value = '';
        value.min = '';
        value.max = '';
        value.valid = false;
        const newValue = {} as any;
        for (const key in value) {
            if (!!value[key]) {
                newValue[key] = Number(value[key]);
            }
        }
        newValue.valid = false;
        this.ctrl.setValue(newValue);
    }
}
