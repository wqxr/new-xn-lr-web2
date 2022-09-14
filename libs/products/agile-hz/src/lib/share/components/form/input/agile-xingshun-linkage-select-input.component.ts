/*
 * Copyright(c) 2017-2019, 深圳市链融科技股份有限公司
 * Beijing Xiwei Technology Co., Ltd.
 * All rights reserved.
 *
 * @file：avenger-linkage-select-input.component.ts
 * @summary：多级联动
 * @version: 1.0
 * **********************************************************************
 * revision             author            reason             date
 * 1.0                 zhyuanan             新增         2019-05-18
 * **********************************************************************
 */


import { Component, OnInit, ElementRef, Input } from '@angular/core';
import { FormGroup, AbstractControl } from '@angular/forms';
import { DynamicForm } from 'libs/shared/src/lib/common/dynamic-form/dynamic.decorators';
import { XnUtils } from 'libs/shared/src/lib/common/xn-utils';
import { XnInputOptions } from 'libs/shared/src/lib/public/form/xn-input.options';

/**
 *  多级联动选择
 */
@Component({
    templateUrl: './agile-xingshun-linkage-select-input.component.html',
    styles: [
        `.xn-dselect-first {
            padding-right: 2px;
        }

        .xn-dselect-second {
            padding-left: 2px;
        }`
    ]
})
@DynamicForm({ type: 'linkage-select-yjl', formModule: 'dragon-input' })
export class LinkageSelectInputComponent implements OnInit {
    @Input() row: any;
    @Input() form: FormGroup;

    required = false;
    proxyClass = '';
    statusClass = '';
    alert = '';

    ctrl: AbstractControl;
    xnOptions: XnInputOptions;

    secondOptions: any[] = [];

    proxyValue = '';
    statusValue = '';

    constructor(private er: ElementRef) {
    }

    ngOnInit() {
        this.ctrl = this.form.get(this.row.name);
        this.required = (this.row.required === true || this.row.required === 1);

        // 设置初始值
        if (this.ctrl.value) {
            const value = XnUtils.parseObject(this.ctrl.value);
            this.proxyValue = !value.type ? value.proxy : value.type;
            this.secondOptions = this.row.selectOptions.find(x => x.value.toString() === this.proxyValue).children;
            this.statusValue = value.selectBank || value.status || '';
        }

        this.xnOptions = new XnInputOptions(this.row, this.form, this.ctrl, this.er);
    }

    proxyBlur(event) {
        if (!this.required) {
            return;
        }
        if (event.target.value === '') {
            this.proxyClass = 'xn-control-invalid';
        }
    }

    statusBlur(event) {
        if (!this.required) {
            return;
        }
        if (event.target.value === '') {
            this.statusClass = 'xn-control-invalid';
        }
    }

    proxyChange(event) {
        this.proxyValue = event.target.value;
        if (this.proxyValue === '') {
            this.secondOptions = [];
            this.ctrl.setValue('');
            if (this.required) {
                this.proxyClass = 'xn-control-invalid';
            }
        } else {
            if (this.required) {
                this.proxyClass = 'xn-control-valid';
                this.statusClass = '';
                this.alert = '';
            }
            this.secondOptions = this.row.selectOptions.find(x => x.value.toString() === this.proxyValue).children;
            if (!!this.secondOptions && this.secondOptions.length > 0) {
                if (this.row.name === 'type' || this.row.name === 'productType') {
                    this.ctrl.setValue(JSON.stringify({
                        proxy: this.proxyValue
                    }));
                } else {
                    this.ctrl.setValue('');
                }
            } else {
                this.ctrl.setValue(JSON.stringify({
                    proxy: this.proxyValue
                }));
            }
        }
    }

    statusChange(event) {
        const value = event.target.value;
        if (value === '') {
            if (this.required) {
                this.statusClass = 'xn-control-invalid';
            }
            if ((this.row.name === 'type' || this.row.name === 'productType')) {
                this.ctrl.setValue(JSON.stringify({
                    proxy: this.proxyValue
                }));
            } else {
                this.ctrl.setValue('');
            }
        } else {
            if (this.required) {
                this.statusClass = 'xn-control-valid';
                this.alert = '';
            }
            this.ctrl.setValue(JSON.stringify({
                proxy: this.proxyValue,
                status: value
            }));
        }
    }
}
