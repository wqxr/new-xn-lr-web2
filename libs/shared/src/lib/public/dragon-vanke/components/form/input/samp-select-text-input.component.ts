import { ChangeDetectionStrategy, Component, OnInit, Input, ElementRef, OnDestroy, ViewChild } from '@angular/core';
import { FormGroup, AbstractControl } from '@angular/forms';
import { DynamicForm } from '../../../../../common/dynamic-form/dynamic.decorators';
import { XnInputOptions } from '../../../../form/xn-input.options';
import { PublicCommunicateService } from '../../../../../services/public-communicate.service';
import { XnFormUtils } from '../../../../../common/xn-form-utils';


class SelectInputModel {
    type = '';
    value = '';
}


declare let $: any;
declare const moment: any;

@Component({
    selector: 'samp-select-text',
    templateUrl: './samp-select-text-input.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    styles: [
    ]
})
@DynamicForm({ type: 'samp-select-text', formModule: 'dragon-input' })

export class SampSelectTextComponent implements OnInit, OnDestroy {

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
        private publicCommunicateService: PublicCommunicateService,
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
        this.selAlert = '必填字段';
        if (this.formValue.type === '') {
            return;
        }
    }

    public onBlur1(event) {
        // this.toValue();
    }

    public selectChange(e: any) {
        this.formValue.type = e.target.value;
        this.formValue.value = '';
        this.ctrl.setValue('');
        if (this.formValue.type === '') {
            this.alert = '';
            return;
        }
    }

    public inputChange(e: any) {
        this.formValue.value = e.target.value;
        this.toValue();
    }

    public calcAlertClass(): void {
        this.myClass = XnFormUtils.getClass(this.ctrl);
        if (this.formValue.type.toString() === '2' || this.formValue.type.toString() === '4') {
            const re: RegExp = /^100$|^(\d|[1-9]\d)$/;
            const ok = re.test(this.formValue.value);
            this.alert = ok && Number(this.formValue.value) > 0 ? '' : '请输入0~100之间的整数';
            return;
        }
        this.alert = XnFormUtils.buildValidatorErrorString(this.ctrl);
    }

    private toValue() {
        this.ctrl.markAsTouched();
        this.calcAlertClass();

        if (!this.formValue.type || !this.formValue.value) {
            this.ctrl.setValue('');
        } else {
            const value = {} as any;
            for (const key in this.formValue) {
                value[key] = Number(this.formValue[key]);
            }
            this.ctrl.setValue(value);
        }
        if (this.formValue.type.toString() === '2' || this.formValue.type.toString() === '4') {
            const re: RegExp = /^100$|^(\d|[1-9]\d)$/;
            let ok = re.test(this.formValue.value);
            ok = ok && Number(this.formValue.value) > 0 ? true : false;
            if (!ok) {
                this.ctrl.setValue('');
            }
        }

    }
}
