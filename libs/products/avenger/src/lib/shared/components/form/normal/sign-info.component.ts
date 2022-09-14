/*
 * Copyright(c) 2017-2019, 深圳市链融科技股份有限公司
 * Beijing Xiwei Technology Co., Ltd.
 * All rights reserved.
 *
 * @file：radio-input.component.ts
 * @summary：单选框 type = 'radio'
 * @version: 1.0
 * **********************************************************************
 * revision             author            reason             date
 * 1.0                 zhyuanan          新增         2019-04-22
 * **********************************************************************
 */

import { Component, OnInit, ElementRef, Input } from '@angular/core';
import { FormGroup, AbstractControl } from '@angular/forms';
import { XnInputOptions } from 'libs/shared/src/lib/public/form/xn-input.options';
import { XnFormUtils } from 'libs/shared/src/lib/common/xn-form-utils';
import { DynamicForm } from 'libs/shared/src/lib/common/dynamic-form/dynamic.decorators';
import { XnService } from 'libs/shared/src/lib/services/xn.service';
import { LocalStorageService } from 'libs/shared/src/lib/services/local-storage.service';
import { PublicCommunicateService } from 'libs/shared/src/lib/services/public-communicate.service';

@Component({
    selector: 'xn-avenger-sign-info-component',
    templateUrl: './sign-info.component.html',
    styles: [`
    .table tr td, .table tr th {
        width: 20%;
        text-align: center;
    }

    .table tr th:first-child, .table tr td:first-child {
        text-align: left;
    }
    .tdfirst{
        width:10% !important;
    }
`]
})
@DynamicForm({ type: 'guide', formModule: 'avenger-input' })
export class AvengersignInfoComponent implements OnInit {

    @Input() row: any;
    @Input() form: FormGroup;

    myClass = '';
    alert = '';
    ctrl: AbstractControl;
    xnOptions: XnInputOptions;
    address = '';

    constructor(private er: ElementRef, private xn: XnService, private localStorageService: LocalStorageService,
                private publicCommunicateService: PublicCommunicateService) {
    }
    ngOnInit() {
        this.ctrl = this.form.get(this.row.name);
        this.publicCommunicateService.change.subscribe(x => {
            if (x.type === 'factoringName') {
                this.xn.avenger.post('/sign_aggrement/bussiness_info/signLead', {
                    supplierAppId: this.xn.user.appId,
                    factoringAppId: x.value.value,

                }).subscribe( x => {
                    if (x.data) {
                        this.address = x.data.address;
                        this.toValue();
                    }
                });
            }
        });

        this.calcAlertClass();
        this.xnOptions = new XnInputOptions(this.row, this.form, this.ctrl, this.er);
    }
    public onBlur() {
        this.calcAlertClass();
    }

    private calcAlertClass() {
        this.alert = XnFormUtils.buildValidatorErrorString(this.ctrl);
    }
    private toValue() {
        if (this.address === '') {
            this.ctrl.setValue('');
        } else {
            this.ctrl.setValue(this.address);
        }
        this.ctrl.markAsTouched();
        this.calcAlertClass();

    }
}
