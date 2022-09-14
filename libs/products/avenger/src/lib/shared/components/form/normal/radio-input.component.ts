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

@Component({
    selector: 'xn-avenger-radio-input-component',
    templateUrl: './radio-input.component.html',
    styles: [
        `.xn-radio-row {
            padding-top: 7px;
        }

        .xn-radio-row label {
            font-weight: normal;
            margin: 0 10px;
        }

        .xn-radio-row button:focus {
            outline: none
        }`, // 去掉点击后产生的边框
    ]
})
@DynamicForm({ type: 'radio', formModule: 'avenger-input' })
export class AvengerRadioInputComponent implements OnInit {

    @Input() row: any;
    @Input() form: FormGroup;

    myClass = '';
    alert = '';
    showClearBtn = false;
    ctrl: AbstractControl;
    xnOptions: XnInputOptions;

    constructor(private er: ElementRef) {
    }

    ngOnInit() {
        this.ctrl = this.form.get(this.row.name);
        this.calcAlertClass();

        this.ctrl.valueChanges.subscribe(v => {
            this.showClearBtn = true;
            this.calcAlertClass();
        });
        this.xnOptions = new XnInputOptions(this.row, this.form, this.ctrl, this.er);
    }

    private calcAlertClass() {
        this.myClass = XnFormUtils.getClass(this.ctrl);
        this.alert = XnFormUtils.buildValidatorErrorString(this.ctrl);
    }

    public onClear() {
        this.showClearBtn = false;
        this.ctrl.setValue(null);

    }
}
