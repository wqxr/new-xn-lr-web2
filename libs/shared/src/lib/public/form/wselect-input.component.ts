import {Component, OnInit, ElementRef, Input, ViewChild, ViewContainerRef} from '@angular/core';
import {isNullOrUndefined} from 'util';
import {XnService} from '../../services/xn.service';
import {FormGroup, AbstractControl} from '@angular/forms';
import {XnFormUtils} from '../../common/xn-form-utils';
import {XnInputOptions} from './xn-input.options';
import {XnModalUtils} from '../../common/xn-modal-utils';
import {WselectEditModalComponent} from '../modal/wselect-edit-modal.component';


@Component({
    selector: 'xn-wselect-input',
    templateUrl: './wselect-input.component.html',
    styles: [
        `.picker-row {background-color: #ffffff}`,
        `.form-control button:focus {outline: none}`,
        `.xn-picker-label { display: inline-block; max-width: 95%}`,
        `.span-disabled { background-color: #eee}`,
        `.input-class { position: absolute; left: 0; top: 0; width: 100%; height: 100%; padding: 6px 10px; border: 0;  }`,
        `.btn-choose { border: 1px solid #d2d6de;}`,
        `.btn { border: 0; }`
    ]
})
export class WselectInputComponent implements OnInit {

    @Input() row: any;
    @Input() form: FormGroup;
    @Input() factory?: any;
    @ViewChild('input', { static: true }) input: ElementRef;

    label;
    myClass = '';
    labelClass = '';
    alert = '';
    showClearBtn = false;
    ctrl: AbstractControl;
    ctrlChange: AbstractControl;
    lv: AbstractControl;
    xnOptions: XnInputOptions;
    pickerObj: any;
    ctrlKind = '';
    isCard = false;
    isArray = false;
    factoringId;
    enterprise: any;

    constructor(private xn: XnService, private er: ElementRef, private vcr: ViewContainerRef) {
    }

    ngOnInit() {
        this.ctrl = this.form.get(this.row.name);

        if (this.factory && this.factory !== '') {
            this.factoringId = JSON.parse(this.factory).value;
        }
        this.fromValue();

        this.xnOptions = new XnInputOptions(this.row, this.form, this.ctrl, this.er);
    }

    // onSelect() {


    //     this.ctrl.markAsTouched();
    //     this.calcAlertClass();
    // }

    private fromValue() {
        if (!this.ctrl.value || this.ctrl.value === '') {
            return;
        }
        this.enterprise = JSON.parse(this.ctrl.value);
    }

    private toValue(obj) {
        if (!obj || !obj.enterprise || obj && obj.enterprise === '') {
            this.ctrl.setValue('');
            return;
        } else {
            this.ctrl.setValue(obj.enterprise);
        }

        this.ctrl.markAsTouched();
        this.calcAlertClass();
    }

    private formatLabel(obj) {
        if (!obj) {
            this.label = '请选择';
            this.showClearBtn = false;
        } else {
            if (obj && (typeof obj === 'string') && !this.ctrlChange) {
                obj = JSON.parse(obj);
            }
            if (!!obj.label && !this.ctrlChange) {
                this.label = `${obj.label || ''}`;
            }
            // 兼容银行账号的一起输入
            if (!!this.ctrlChange) {
                this.label = obj;
            }

            // this.showClearBtn = this.ctrl.disabled ? false : true;
            this.showClearBtn = this.ctrl.invalid ? false : true;
        }
    }

    private calcAlertClass() {
        this.myClass = XnFormUtils.getClass(this.ctrl);
        this.labelClass = this.ctrl.disabled ? 'span-disabled' : '';
        // this.labelClass = this.ctrl.invalid ? 'span-disabled' : '';
        this.alert = XnFormUtils.buildValidatorErrorString(this.ctrl);
    }

    onClear() {
        this.toValue(null);
        if (this.ctrlChange) {
            this.ctrlChange.setValue('');
        }
        if (this.row.options && this.row.options.tochange) {
            for (const row of this.row.options.tochange) {
                this.lv = this.form.get(row);
                this.lv.setValue('');
            }
        }
    }

    onBlur(): void {
        this.calcAlertClass();
    }

    onSelect() {
        const item = {} as any;
        item.factoringId = this.factoringId;
        XnModalUtils.openInViewContainer(this.xn, this.vcr, WselectEditModalComponent, item).subscribe(v => {
            // this.items.toString();
            if (v && v.enterprise && v.enterprise !== '') {
                this.enterprise = JSON.parse(v.enterprise);
            }
            this.toValue(v);
        });
    }
}
