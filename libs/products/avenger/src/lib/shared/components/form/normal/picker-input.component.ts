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

import { Component, OnInit, ElementRef, Input, ViewChild } from '@angular/core';
import { AbstractControl, FormGroup } from '@angular/forms';
import { XnInputOptions } from 'libs/shared/src/lib/public/form/xn-input.options';
import { XnService } from 'libs/shared/src/lib/services/xn.service';
import { XnUtils } from 'libs/shared/src/lib/common/xn-utils';
import { DataTablePicker } from 'libs/shared/src/lib/common/data-table-picker';
import { EnterpriseTypeEnum } from 'libs/shared/src/lib/config/enum';
import { XnFormUtils } from 'libs/shared/src/lib/common/xn-form-utils';
import { DynamicForm } from 'libs/shared/src/lib/common/dynamic-form/dynamic.decorators';
import { LocalStorageService } from 'libs/shared/src/lib/services/local-storage.service';
import { PublicCommunicateService } from 'libs/shared/src/lib/services/public-communicate.service';

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
@DynamicForm({ type: 'picker', formModule: 'avenger-input' })
export class AvengerPickerInputComponent implements OnInit {

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

    constructor(private xn: XnService, private er: ElementRef, private localStorageService: LocalStorageService,
                private publicCommunicateService: PublicCommunicateService) {
    }

    ngOnInit() {
        this.ctrl = this.form.get(this.row.name);
        this.ctrlChange = this.row.options && this.row.options.change && this.form.get(this.row.options.change);
        this.inMemo = this.row.options !== '' && this.row.options.inMemo || '';

        this.isCard = !!(this.row.options && this.row.options.kind === 'card'); // 这里的kind是为了保证，如果没有card，则不进行card之类的校验
        this.isArray = !!(this.row.options && this.row.options.kind === 'isArray'); // 这里的kind是为了保证，如果没有card，则不进行card之类的校验

        this.changeGetNewDataApi = this.row.options && this.row.options.api || '';


        if (!this.isCard) {
            this.ctrl.valueChanges.subscribe(() => {
                this.fromValue();
            });
        }

        this.ctrl.statusChanges.subscribe(status => {
        });

        // 设置初始值, string 不能以0开始
        if (!!this.row.value) {
            if (typeof (this.row.value) === 'string' && !XnUtils.isZero(this.row.value)) {  // 第一次退回之后，这里获取到是一个string，先转成json
                if (typeof (JSON.parse(this.row.value)) === 'object') {
                    this.row.value = this.row.value && JSON.parse(this.row.value);
                } else {
                    this.row.value = this.row.value;
                }
            }
            this.toValue(this.row.value);
        } else if (!!this.ctrl.value) {
            this.fromValue();
        }

        this.xnOptions = new XnInputOptions(this.row, this.form, this.ctrl, this.er);
    }

    public onPicker() {
        if (!this.ctrlChange) {
            new DataTablePicker(this.xn).open('请选择', this.row.options.ref, obj => this.toValue(obj),
                () => {
                },
                { type: EnterpriseTypeEnum[this.row.options.ref] });
        } else {
            new DataTablePicker(this.xn).open('请选择', this.row.options.ref, obj => this.toPickerObj(obj),
                () => {
                },
                { type: EnterpriseTypeEnum[this.row.options.ref] });
        }

        this.ctrl.markAsTouched();
        this.calcAlertClass();
    }

    /**
     * 直接将值toValue会导致将整个object传递给后台，这里做一下处理
     * @param obj
     */
    private toPickerObj(obj): void {
        this.pickerObj = obj;
        this.ctrl.setValue(obj.label);
        // 只当在isCard存在时生效
        if (this.isCard) {
            this.input.nativeElement.value = obj.label;
            this.cardFormat();
        }
        this.ctrlChange.setValue(obj.value);

        if (this.isArray) {
            this.getData(obj);
        }

        this.ctrl.markAsTouched();
        this.calcAlertClass();
        this.showClearBtn = true;
    }

    private fromValue() {
        if (!this.ctrlChange) {
            this.calcAlertClass();
            this.formatLabel(this.ctrl.value);
        } else {
            if (this.isCard) {
                this.input.nativeElement.value = this.ctrl.value;
                this.cardFormat(); // 将拉取到的数据进行money格式化
            } else {
                this.formatLabel(this.ctrl.value);
            }
        }
    }

    private toValue(obj) {
        if (!obj) {
            this.ctrl.setValue('');
            if (this.ctrlChange && this.isCard) {
                this.input.nativeElement.value = '';
            }
        } else {
            if (this.ctrlChange && this.isCard) {
                obj = obj.constructor === String ? obj : obj.toString();
                this.ctrl.setValue(obj.replace(/\s/g, '').replace(/\D/g, ''));
                // 这里用setTimeout是为了改变input的值
                setTimeout(() => {
                    this.input.nativeElement.value = this.ctrl.value;
                    this.cardFormat();
                    this.showClearBtn = !this.ctrl.invalid;
                }, 0);
            } else {
                this.ctrl.setValue(JSON.stringify(obj));
            }

            if (this.isArray) {
                this.getData(obj);
            }
        }
        this.showClearBtn = !this.ctrl.invalid;
        this.ctrl.markAsTouched();
        this.calcAlertClass();

        this.publicCommunicateService.change.emit({ type: this.row.name, value: obj});
    }

    private getData(obj) {
        const url = this.changeGetNewDataApi === '' ? '/amount' : this.changeGetNewDataApi;
        this.xn.api.post(`${url}/?method=get`, {
            enterpriseAppId: obj.value
        }).subscribe(json => {
            if (this.row.options && this.row.options.tochange) {
                for (const row of this.row.options.tochange) {
                    this.lv = this.form.get(row);

                    if (!json.data[row]) {
                        this.lv.setValue('');
                    }
                    this.lv.setValue(json.data[row]);
                }
            }
        });
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

            this.showClearBtn = this.ctrl.invalid ? false : true;
        }
    }

    private calcAlertClass() {
        this.myClass = XnFormUtils.getClass(this.ctrl);
        this.labelClass = this.ctrl.disabled ? 'span-disabled' : '';
        this.alert = XnFormUtils.buildValidatorErrorString(this.ctrl);
    }

    public onClear() {
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

    // 以下是为了兼容卡号控件card
    onInput() {
        this.cardFormat(); // 将输入的数据进行money格式化
        this.toValue(this.input.nativeElement.value);
        this.calcAlertClass();
        this.showClearBtn = !this.ctrl.invalid;
    }

    // 银行卡号自动每4位添加一个空格
    // 过滤任何不可见字符，非数字字符
    cardFormat() {
        // console.log("prev: " + this.input.nativeElement.value);

        let num = this.input.nativeElement.value;

        num = num.replace(/\s/g, '').replace(/\D/g, '').replace(/(\d{4})/g, '$1 ');

        this.input.nativeElement.value = num;

        // console.log("after: " + this.input.nativeElement.value);

    }
}
