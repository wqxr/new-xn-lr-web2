/*
 * Copyright(c) 2017-2019, 深圳市链融科技股份有限公司
 * Beijing Xiwei Technology Co., Ltd.
 * All rights reserved.
 *
 * @file：mselect-input.component.ts
 * @summary：联动选择框  type = 'mselect'
 * @version: 1.0
 * **********************************************************************
 * revision             author            reason             date
 * 1.0                 zhyuanan          增加         2019-04-22
 * **********************************************************************
 */

import {Component, OnInit, ElementRef, Input} from '@angular/core';
import {FormGroup, AbstractControl} from '@angular/forms';
import {XnInputOptions} from 'libs/shared/src/lib/public/form/xn-input.options';
import {SelectOptions} from 'libs/shared/src/lib/config/select-options';
import {XnFormUtils} from 'libs/shared/src/lib/common/xn-form-utils';
import { DynamicForm } from 'libs/shared/src/lib/common/dynamic-form/dynamic.decorators';

@Component({
    selector: 'xn-avenger-mselect-input-component',
    templateUrl: './mselect-input.component.html'
})
@DynamicForm({ type: 'mselect', formModule: 'avenger-input' })
export class AvengerMselectInputComponent implements OnInit {

    @Input() row: any;
    @Input() form: FormGroup;

    myClass = '';
    alert = '';
    ctrl: AbstractControl;
    change: AbstractControl;
    xnOptions: XnInputOptions;
    originOptions = [];

    constructor(private er: ElementRef) {
    }

    ngOnInit() {
        this.ctrl = this.form.get(this.row.name);
        this.change = this.row.options && this.row.options.change && this.form.get(this.row.options.change);
        this.originOptions = this.row.selectOptions;

        this.calcAlertClass();

        // 获取模式配置（前端配置）
        const patterns = SelectOptions.get('pattern');

        this.ctrl.valueChanges.subscribe(v => {
            if (v) {
                for (const pattern of patterns) {
                    if (v === pattern.value) {
                        this.change.setValue(JSON.stringify(pattern.data));
                    }
                }
            } else {
                this.change.setValue('');
            }
            this.ctrl.markAsTouched();
            this.calcAlertClass();
        });

        this.xnOptions = new XnInputOptions(this.row, this.form, this.ctrl, this.er);

        this.otherOrgTypeHandler();
    }

    public onBlur() {
        this.calcAlertClass();
    }

    private calcAlertClass() {
        this.myClass = XnFormUtils.getClass(this.ctrl);
        this.alert = XnFormUtils.buildValidatorErrorString(this.ctrl);
    }

    private otherOrgTypeHandler() {
        if (this.row.name === 'otherOrgType') {
            const orgTypeCtrl = this.form.get('orgType');
            if (orgTypeCtrl) {
                this.row.selectOptions = this.originOptions.filter(i => i.value !== orgTypeCtrl.value); // 初始化的时候过滤
                orgTypeCtrl.valueChanges.subscribe(x => {
                    this.row.selectOptions = this.originOptions.filter(i => i.value !== x);

                    this.ctrl.reset('');
                    this.change.setValue('');
                });
            }
        }
    }
}
