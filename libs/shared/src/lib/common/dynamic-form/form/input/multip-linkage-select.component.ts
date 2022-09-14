import { Component, OnInit, ElementRef, Input, ChangeDetectorRef } from '@angular/core';
import { FormGroup, AbstractControl } from '@angular/forms';
import { XnInputOptions } from 'libs/shared/src/lib/public/form/xn-input.options';
import { XnFormUtils } from 'libs/shared/src/lib/common/xn-form-utils';
import { DynamicForm } from '../../dynamic.decorators';
import { XnUtils } from 'libs/shared/src/lib/common/xn-utils';
/**
 *  多级(3级)联动选择
 *  return {first: '', second: '', third: ''}
 */
@Component({
    selector: 'lib-multip-linkage-select',
    templateUrl: './multip-linkage-select.component.html',
    styles: [
        `.xn-mselect-right {
            padding-right: 2px;
        }
        .xn-mselect-left {
            padding-left: 2px;
        }`
    ]
})
@DynamicForm({ type: 'multip-linkage-select', formModule: 'default-input' })
export class MultipLinkageSelectInputComponent implements OnInit {

    @Input() row: any;
    @Input() form: FormGroup;

    selectModel: {
        first: number | string,
        second: number | string,
        third: number | string,
    } = {
        first: '',
        second: '',
        third: '',
    };
    secondOptions: any[] = [];
    thirdOptions: any[] = [];

    ctrl: AbstractControl;
    alert = '';
    myClass = '';
    xnOptions: XnInputOptions;

    constructor(private er: ElementRef, private cdr: ChangeDetectorRef) {
    }

    ngOnInit() {
        this.ctrl = this.form.get(this.row.name);
        this.calcAlertClass();
        // 设置初始值
        if (!!this.ctrl.value) {
            // {first: '', second: '', third: ''}
            const valObj = XnUtils.parseObject(this.ctrl.value);
            this.initOptions(valObj);
            this.selectModel = {...valObj};
            this.toValue();
            this.calcAlertClass();
            this.cdr.markForCheck();
        }
        this.xnOptions = new XnInputOptions(this.row, this.form, this.ctrl, this.er);
    }

    initOptions(valObj: any = {}) {
        const secondObj = this.row.selectOptions.find((x: any) => x.value.toString() === valObj.first?.toString());
        this.secondOptions = secondObj ? secondObj.children : [];
        const thirdObj = this.secondOptions.find((x: any) => x.value.toString() === valObj.second?.toString());
        this.thirdOptions = thirdObj ? thirdObj.children : [];
    }

    onBlur(event: any): void {
        this.calcAlertClass();
    }

    onChange(event: any, type: string) {
        switch (type) {
            case 'first':
                const secondObj = this.row.selectOptions.find((x: any) => x.value.toString() === this.selectModel.first.toString());
                this.secondOptions = secondObj ? secondObj.children : [];
                this.thirdOptions = [];
                this.selectModel.second = '';
                this.selectModel.third = '';
                break;
            case 'second':
                const thirdObj = this.secondOptions.find((x: any) => x.value.toString() === this.selectModel.second.toString());
                this.thirdOptions = thirdObj ? thirdObj.children : [];
                this.selectModel.third = '';
                break;
            case 'third':
                break;
            default:
                break;
        }
        this.toValue();
    }

    private calcAlertClass() {
        this.myClass = XnFormUtils.getClass(this.ctrl);
        this.alert = XnFormUtils.buildValidatorErrorString(this.ctrl);
    }

    private toValue() {
        if (!!this.selectModel.third) {
            this.ctrl.setValue(JSON.stringify(this.selectModel));
        } else {
            this.ctrl.setValue('');
        }
        console.log('toval', this.ctrl.value);
    }
}
