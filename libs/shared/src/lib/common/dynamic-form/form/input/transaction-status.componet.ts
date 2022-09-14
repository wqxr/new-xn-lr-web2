/*
 * Copyright(c) 2017-2019, 深圳市链融科技股份有限公司
 * Beijing Xiwei Technology Co., Ltd.
 * All rights reserved.
 *
 * @file：AvengerMFileInputComponent
 * @summary：文件上传，批量 type = 'mfile'
 * @version: 1.0
 * **********************************************************************
 * revision             author            reason             date
 * 1.0                  wangqing          增加功能1         2019-08-29
 * **********************************************************************
 */

import { Component, Input, OnInit, ElementRef } from '@angular/core';
import { FormGroup, AbstractControl, FormControl } from '@angular/forms';
import { XnInputOptions } from 'libs/shared/src/lib/public/form/xn-input.options';
import { SelectOptions, HeadquartersTypeEnum } from 'libs/shared/src/lib/config/select-options';
import { XnUtils } from 'libs/shared/src/lib/common/xn-utils';
import { DynamicForm } from '../../dynamic.decorators';



@Component({
    template: `
        <div class="row">
            <div class="col-md-6 xn-dselect-first">
                <select
                    class="form-control xn-input-font"
                    [(ngModel)]="proxyValue"
                    [ngClass]="proxyClass"
                    (blur)="proxyBlur($event)"
                    (change)="proxyChange($event)"
                >
                    <option value="">-请选择-</option>
                    <option
                        *ngFor="let option of row.selectOptions"
                        value="{{ option.value }}"
                        >{{ option.label }}</option
                    >
                </select>
            </div>

            <div class="col-md-6 xn-dselect-second">
                <select
                    class="form-control xn-input-font"
                    *ngIf="secondOptions.length > 0"
                    [(ngModel)]="statusValue"
                    [ngClass]="statusClass"
                    (blur)="statusBlur($event)"
                    (change)="statusChange($event)"
                >
                    <option value="">-请选择-</option>
                    <option
                        *ngFor="let option of secondOptions"
                        value="{{ option.value }}"
                        >{{ option.label }}</option
                    >
                </select>
            </div>
        </div>
        <span class="xn-input-alert">{{ alert }}</span>
    `,
    styles: [
        `
            .xn-dselect-first {
                padding-right: 2px;
            }

            .xn-dselect-second {
                padding-left: 2px;
            }
        `
    ]
})
@DynamicForm({ type: 'machine-tradetype', formModule: 'default-input' })
export class TradeTypeComponent implements OnInit {
    @Input() row: any;
    @Input() form: FormGroup;
    required = false;
    proxyClass = '';
    statusClass = '';
    alert = '';

    ctrl: AbstractControl;
    ctrl2: AbstractControl;
    ctrl3: AbstractControl;

    xnOptions: XnInputOptions;

    secondOptions: any[] = [];

    proxyValue = '';
    statusValue = '';
    ctrl1: AbstractControl;

    constructor(private er: ElementRef) { }

    ngOnInit() {
        this.ctrl = this.form.get(this.row.name);
        this.ctrl1 = this.form.get('headquarters');
        this.ctrl.valueChanges.subscribe(x => {
            if (x !== '') {
                if (this.ctrl1 !== null) {
                    if (JSON.parse(x).isProxy.toString() === '14') {
                        this.ctrl1.setValue(HeadquartersTypeEnum[2]);
                    } else if (JSON.parse(x).isProxy.toString() === '-1') {
                        this.ctrl1.setValue('');
                    } else {
                        JSON.parse(x).isProxy.toString() === '52' ?
                            this.ctrl1.setValue(HeadquartersTypeEnum[5]) : this.ctrl1.setValue('万科');
                    }
                }
            } else {
                this.ctrl1.setValue('');
            }
        });

        this.required = this.row.required === true || this.row.required === 1;
        // 设置初始值
        if (this.ctrl.value) {
            const value = XnUtils.parseObject(this.ctrl.value);
            this.proxyValue = value.tradeType || value.isProxy || '';
            if (typeof (this.proxyValue) === 'number') {
                this.secondOptions = this.row.selectOptions.find(
                    (x: any) => x.value === this.proxyValue
                ).children;
            } else if (typeof (this.proxyValue) === 'string') {
                this.secondOptions = this.row.selectOptions.find(
                    (x: any) => x.value.toString() === this.proxyValue
                ).children;
            }
            this.statusValue = value.tradeStatus || '';
        }

        this.xnOptions = new XnInputOptions(
            this.row,
            this.form,
            this.ctrl,
            this.er
        );
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
            this.secondOptions = this.row.selectOptions.find(
                (x: any) => x.value.toString() === this.proxyValue
            ).children;

            this.ctrl.setValue(
               JSON.stringify({
                    isProxy: this.proxyValue
                })
            );
        }
    }

    statusChange(event) {
        const value = event.target.value;
        if (value === '') {
            if (this.required) {
                this.statusClass = 'xn-control-invalid';
            }
            this.ctrl.setValue(
               JSON.stringify({
                    isProxy: this.proxyValue
                })
            );
            //this.ctrl2.setValue(this.proxyValue);

        } else {
            if (this.required) {
                this.statusClass = 'xn-control-valid';
                this.alert = '';
            }

            this.ctrl.setValue(
                JSON.stringify({
                    isProxy: Number(this.proxyValue),
                    tradeStatus: value
                })
            );
           // this.ctrl2.setValue(this.proxyValue);
            //this.ctrl3.setValue(value);
        }
    }
}
