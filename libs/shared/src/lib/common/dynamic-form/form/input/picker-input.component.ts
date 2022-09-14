/*
 * Copyright(c) 2017-2019, 深圳市链融科技股份有限公司
 * Beijing Xiwei Technology Co., Ltd.
 * All rights reserved.
 *
 * @file：picker-input.component.ts
 * @summary：列表选择项   type = 'picker'
 * @version: 1.0
 * **********************************************************************
 * revision             author            reason             date
 * 1.0                 zhyuanan          增加功能1         2019-04-22
 * **********************************************************************
 */

import { Component, OnInit, ElementRef, Input, ViewChild, ViewContainerRef } from '@angular/core';
import { AbstractControl, FormGroup } from '@angular/forms';
import { XnInputOptions } from 'libs/shared/src/lib/public/form/xn-input.options';
import { DynamicForm } from '../../dynamic.decorators';
import { XnService } from 'libs/shared/src/lib/services/xn.service';
import { XnFormUtils } from 'libs/shared/src/lib/common/xn-form-utils';
import { XnModalUtils } from 'libs/shared/src/lib/common/xn-modal-utils';
import { VankeAddAgencyModalComponent } from 'libs/shared/src/lib/public/dragon-vanke/modal/vanke-addAgency.modal.component';


@Component({
    selector: 'xn-avenger-picker-input-component',
    templateUrl: './picker-input.component.html',
    styles: [
        `.picker-row {
            background-color: #ffffff
        }

        .form-control button:focus {
            outline: none
        }

        .xn-picker-label {
            display: inline-block;
            max-width: 95%
        }

        .span-disabled {
            background-color: #eee
        }

        .input-class {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
            padding: 6px 10px;
            border: 0;
        }

        .inMemo {
            padding: 5px 0px;
            color: #f20000
        }`
    ]
})
@DynamicForm({ type: 'picker', formModule: 'default-input' })
export class VankePickerInputComponent implements OnInit {

    @Input() row: any;
    @Input() form: FormGroup;
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
    isCard = false;
    isArray = false;
    inMemo = '';
    changeGetNewDataApi = '';

    constructor(private xn: XnService, private er: ElementRef,
                private vcr: ViewContainerRef, ) {
    }

    ngOnInit() {
        this.ctrl = this.form.get(this.row.name);
        this.ctrl.statusChanges.subscribe(() => {
        });
        this.xnOptions = new XnInputOptions(this.row, this.form, this.ctrl, this.er);
    }

    public onPicker() {
        XnModalUtils.openInViewContainer(this.xn, this.vcr, VankeAddAgencyModalComponent, {})
            .subscribe((v) => {

                if (v === null) {
                    return;
                } else {

                }
            });

    }


    private calcAlertClass() {
        this.myClass = XnFormUtils.getClass(this.ctrl);
        this.labelClass = this.ctrl.disabled ? 'span-disabled' : '';
        this.alert = XnFormUtils.buildValidatorErrorString(this.ctrl);
    }

    onBlur(): void {
        this.calcAlertClass();
    }
}
