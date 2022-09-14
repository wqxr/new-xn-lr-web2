/*
 * Copyright(c) 2017-2019, 深圳市链融科技股份有限公司
 * Beijing Xiwei Technology Co., Ltd.
 * All rights reserved.
 *
 * @file：checkbox-input.component.ts
 * @summary：复选框   type = 'checkbox'
 * @version: 1.0
 * **********************************************************************
 * revision             author            reason             date
 * 1.0                 zhyuanan          增加          2019-04-22
 * **********************************************************************
 */

import {
    Component, OnInit, ElementRef, Input, ViewChildren, QueryList, AfterViewInit,
} from '@angular/core';
import { FormGroup, AbstractControl } from '@angular/forms';
import { XnInputOptions } from 'libs/shared/src/lib/public/form/xn-input.options';
import { XnFormUtils } from 'libs/shared/src/lib/common/xn-form-utils';
import { DynamicForm } from 'libs/shared/src/lib/common/dynamic-form/dynamic.decorators';

@Component({
    selector: 'xn-avenger-checkbox-input-component',
    templateUrl: './checkbox-input.component.html',
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
@DynamicForm({ type: 'checkbox', formModule: 'avenger-input' })
export class AvengerCheckboxInputComponent implements OnInit, AfterViewInit {

    @Input() row: any;
    @Input() form: FormGroup;
    @ViewChildren('checkbox') checkbox: QueryList<ElementRef>;  // 因为有多个checkbox，所以需要用到ViewChildren

    myClass = '';
    alert = '';
    showClearBtn = false;
    ctrl: AbstractControl;
    xnOptions: XnInputOptions;
    selected: string[] = [];
    selectedArr: any[] = [];
    selectedBooleanArr: any[] = [];


    constructor(private er: ElementRef) {
    }

    ngOnInit() {
        this.ctrl = this.form.get(this.row.name);
        // 初始化的时候保证新建的数组的长度和checkbox的长度是一样的
        for (let i = 0; i < this.row.selectOptions.length; i++) {
            this.selectedBooleanArr.push(false);
        }
        this.selected.length = this.row.selectOptions.length;
        this.calcAlertClass();
        this.xnOptions = new XnInputOptions(this.row, this.form, this.ctrl, this.er);
    }

    /**
     * 因为checkbox的值在ngOnInit的时候还读不出来，在页面渲染完成后可以读出
     */
    ngAfterViewInit() {
        setTimeout(() => {
            this.fromValue();
        }, 0);
    }


    private calcAlertClass() {
        this.myClass = XnFormUtils.getClass(this.ctrl);
        this.alert = XnFormUtils.buildValidatorErrorString(this.ctrl);
    }

    /**
     *  清除选择项
     */
    public onClear() {
        this.showClearBtn = false;
        this.ctrl.setValue(null);
        for (let i = 0; i < this.row.selectOptions.length; i++) {
            this.selectedArr[i].nativeElement.checked = false;
        }
    }

    /**
     * 读取来自后台或编辑之后的checkboxValue
     */
    private fromValue() {
        const ctrlValueArr = this.ctrl.value.split(',');
        const ctrlValueArrTemp = [];
        for (let i = 0; i < this.row.selectOptions.length; i++) {
            if (this.row.selectOptions[i].value === ctrlValueArr[i]) {
                ctrlValueArrTemp[i] = true;
            } else {
                ctrlValueArrTemp[i] = false;
            }
        }
        this.selectedBooleanArr = ctrlValueArrTemp;

        for (let i = 0; i < this.selectedBooleanArr.length; i++) {
            if (this.selectedBooleanArr[i] === true) {
                this.selected[i] = this.row.selectOptions[i].value;
            }
        }
        this.selectedArr = this.checkbox.toArray();
        for (let i = 0; i < ctrlValueArrTemp.length; i++) {
            this.selectedArr[i].nativeElement.checked = ctrlValueArrTemp[i];
        }

        // 控件checkbox不能点击
        for (let i = 0; i < this.row.selectOptions.length; i++) {
            if (this.row.selectOptions[i].disabled) {
                this.selectedArr[i].nativeElement.disabled = 'disabled';
            }
        }

        this.alert = XnFormUtils.buildValidatorErrorString(this.ctrl);
    }

    /**
     * 将数据保存至control
     */
    private toValue() {
        if (this.selected.length === 0) {
            this.ctrl.setValue('');
        } else {
            this.ctrl.setValue(this.selected.toString());
        }
        this.ctrl.markAsTouched();
        this.alert = XnFormUtils.buildValidatorErrorString(this.ctrl);
    }

    /**
     * 是否被选中
     * @param value
     */
    public isChecked(value): boolean {
        return this.selected.indexOf(value) >= 0;
    }

    /**
     * 更新checkbox的值，原理：传值的时候，同时匹配一个boolean数组，true的时候将checked置为true
     * @param event
     * @param value
     * @param i
     */
    public updateSelection(event, value, i) {

        const checkbox = event.target;
        const checked = checkbox.checked;
        if (checked) {
            this.selectedBooleanArr[i] = true;
            this.selected[i] = value;
        } else {
            this.selectedBooleanArr[i] = false;
            this.selected[i] = '';
        }
        if (this.selected.length !== 0) {
            this.showClearBtn = true;
            this.calcAlertClass();
        }

        // 如果为空，将整个数组清空
        if (this.selectedBooleanArr.indexOf(true) === -1) {
            this.onClear();
            this.selected = [];
        }

        this.toValue();
    }
}
