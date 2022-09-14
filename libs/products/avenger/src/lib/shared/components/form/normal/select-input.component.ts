/*
 * Copyright(c) 2017-2019, 深圳市链融科技股份有限公司
 * Beijing Xiwei Technology Co., Ltd.
 * All rights reserved.
 *
 * @file：select-input.component.ts
 * @summary：下拉选项-单选  type = 'select'
 * @version: 1.0
 * **********************************************************************
 * revision             author            reason             date
 * 1.0                 zhyuanan          增加             2019-04-22
 * **********************************************************************
 */

import { Component, OnInit, ElementRef, Input, ViewChild, ChangeDetectionStrategy } from '@angular/core';
import { FormGroup, AbstractControl } from '@angular/forms';
import { XnInputOptions } from 'libs/shared/src/lib/public/form/xn-input.options';
import { XnFormUtils } from 'libs/shared/src/lib/common/xn-form-utils';
import { DynamicForm } from 'libs/shared/src/lib/common/dynamic-form/dynamic.decorators';
import { PublicCommunicateService } from 'libs/shared/src/lib/services/public-communicate.service';
import { EditModalComponent } from 'libs/shared/src/lib/public/avenger/modal/edit-modal.component';

@Component({
    selector: 'xn-avenger-select-input-component',
    templateUrl: './select-input.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
@DynamicForm({ type: 'select', formModule: 'avenger-input' })
export class AvengerSelectInputComponent implements OnInit {

    @Input() row: any;
    @Input() form: FormGroup;

    myClass = '';
    alert = '';
    ctrl: AbstractControl;
    ctrl1: AbstractControl;
    xnOptions: XnInputOptions;

    constructor(private er: ElementRef, private publicCommunicateService: PublicCommunicateService) {
    }

    ngOnInit() {

        this.ctrl = this.form.get(this.row.name);
        // 保证金为0的时候，缴付方变成不是必填项
        if (this.row.name === 'payCompany') {
            this.ctrl1 = this.form.get('depositRate');
            this.ctrl1.valueChanges.subscribe(x => {
                if (x === '0') {
                    this.form.controls.payCompany.setValidators(null);
                    this.form.controls.payCompany.updateValueAndValidity();
                    this.row.required = false;
                } else {
                    this.form.controls.payCompany.setValidators(null);
                    this.form.controls.payCompany.updateValueAndValidity();
                    this.row.required = true;
                }
                this.xnOptions = new XnInputOptions(this.row, this.form, this.ctrl, this.er);
            });
        }

        this.calcAlertClass();
        this.ctrl.valueChanges.subscribe(v => {
            this.ctrl.markAsTouched();
            this.calcAlertClass();
            this.publicCommunicateService.change.emit(v);

        });
        // 保证金为0的时候，缴付方变成不是必填项
        // if (this.row.name === 'payCompany') {
        //     this.publicCommunicateService.change.subscribe(x => {
        //         if (x.depositRate === '0') {
        //             this.form.controls.payCompany.setValidators(null);
        //             this.form.controls.payCompany.updateValueAndValidity();
        //             this.row.required = false;
        //         } else {
        //             this.form.controls.payCompany.setValidators(null);
        //             this.form.controls.payCompany.updateValueAndValidity();
        //             this.row.required = true;


        //         }
        //         this.xnOptions = new XnInputOptions(this.row, this.form, this.ctrl, this.er);

        //     });
        // }


        this.xnOptions = new XnInputOptions(this.row, this.form, this.ctrl, this.er);
    }

    public onBlur() {
        if (this.row.name === 'companyType') {
            this.publicCommunicateService.change.emit({ companyType: this.ctrl.value });
        }

        this.calcAlertClass();
    }

    private calcAlertClass() {
        this.myClass = XnFormUtils.getClass(this.ctrl);
        this.alert = XnFormUtils.buildValidatorErrorString(this.ctrl);
    }
}
