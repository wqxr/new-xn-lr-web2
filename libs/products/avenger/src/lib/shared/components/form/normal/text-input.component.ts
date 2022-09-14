
/*
 * Copyright(c) 2017-2019, 深圳市链融科技股份有限公司
 * Beijing Xiwei Technology Co., Ltd.
 * All rights reserved.
 *
 * @file：text-input.component.ts
 * @summary：文本输入  type = 'text'
 * @version: 1.0
 * **********************************************************************
 * revision             author            reason             date
 * 1.0                 zhyuanan          增加              2019-05-13
 * **********************************************************************
 */

import { ChangeDetectionStrategy, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, FormGroup } from '@angular/forms';
import { XnFormUtils } from 'libs/shared/src/lib/common/xn-form-utils';
import { XnInputOptions } from 'libs/shared/src/lib/public/form/xn-input.options';
import { DynamicForm } from 'libs/shared/src/lib/common/dynamic-form/dynamic.decorators';
import { LocalStorageService } from 'libs/shared/src/lib/services/local-storage.service';
import { PublicCommunicateService } from 'libs/shared/src/lib/services/public-communicate.service';

@Component({
    selector: 'xn-avenger-text-input-component',
    templateUrl: './text-input.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    styles: [
        `.inMemo {
            padding: 5px 0px;
            color: #f20000
        }`
    ]
})
@DynamicForm({ type: 'text', formModule: 'avenger-input' })
export class AvengerTextInputComponent implements OnInit {

    @Input() row: any;
    @Input() form: FormGroup;
    @ViewChild('input', { static: true }) input: ElementRef;
    myClass = '';
    alert = '';
    ctrl: AbstractControl;
    xnOptions: XnInputOptions;
    inMemo = '';
    supplierName = '';

    constructor(private er: ElementRef, public localStorageService: LocalStorageService,
                public publicCommunicateService: PublicCommunicateService) {
    }

    ngOnInit() {
        if (!this.row.placeholder) {
            this.row.placeholder = '';
            if (this.row.type === 'text' && this.row.value === 0) {
                this.row.placeholder = 0;
            }
        }
        if (this.row.name === 'contractYi') {
            this.supplierName = this.row.value;
            if (this.localStorageService.caCheMap.get('fitsupplierName') === undefined) {
                this.localStorageService.caCheMap.set('fitsupplierName', this.supplierName);
            } else {

            }
            // this.localStorageService.caCheMap.set('fitsupplierName', this.supplierName);
        }
        this.ctrl = this.form.get(this.row.name);
        // 当是强供应商的时候，费率为必填项
        if (this.row.name === 'subFactoringServiceFLV' || this.row.name === 'subFactoringUseFLV'
            || this.row.name === 'subPlatformServiceFLV' || this.row.name === 'subNowlimit' || this.row.name === 'subMaxAmount') {
            const controls = this.form.controls[this.row.name].validator;
            this.publicCommunicateService.change.subscribe(x => {
                if (x.companyType === '0') {
                    this.form.controls[this.row.name].setValidators(null);
                    this.form.controls[this.row.name].updateValueAndValidity();
                    this.row.required = false;
                    this.xnOptions = new XnInputOptions(this.row, this.form, this.ctrl, this.er);
                } else {
                    this.form.controls[this.row.name].setValidators(controls);
                    this.form.controls[this.row.name].updateValueAndValidity();
                    this.row.required = true;
                }
            });
        }
        this.inMemo = !!this.row.options && this.row.options !== '' && this.row.options.inMemo || '';
        this.calcAlertClass();

        this.ctrl.valueChanges.subscribe(v => {
            this.calcAlertClass();
        });
        this.xnOptions = new XnInputOptions(this.row, this.form, this.ctrl, this.er);
    }

    public onBlur(e: any): void {
        if (this.row.name === 'contractYi' && e.target.value !== this.localStorageService.caCheMap.get('fitsupplierName')) {
            this.alert = '合同乙方与万科供应商不匹配';
        } else if (this.row.name === 'contractYi' && e.target.value === this.localStorageService.caCheMap.get('fitsupplierName')) {
            this.alert = '';
        }
        this.calcAlertClass();
    }


    public calcAlertClass(): void {

        this.myClass = XnFormUtils.getClass(this.ctrl);
        if (this.row.name !== 'contractYi' && this.row.name !== 'contractJia') {
            this.alert = XnFormUtils.buildValidatorErrorString(this.ctrl);

        }

    }
    onOk() {
        if (this.row.id && this.row.id === 'assets') {
            if (this.row.name === 'courseList') {
                this.ctrl.setValue('A,D');
            }
            if (this.row.name === 'startList') {
                this.ctrl.setValue('B,E');
            }
            if (this.row.name === 'endList') {
                this.ctrl.setValue('C,F');
            }
        }
        if (this.row.id && this.row.id === 'cash') {
            if (this.row.name === 'courseList') {
                this.ctrl.setValue('A');
            }
        }
        if (this.row.id && this.row.id === 'profit') {
            if (this.row.name === 'courseList') {
                this.ctrl.setValue('A,D');
            }
        }
    }
}
