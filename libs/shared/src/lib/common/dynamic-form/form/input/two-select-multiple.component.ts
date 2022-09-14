/*
 * Copyright(c) 2017-2019, 深圳市链融科技股份有限公司
 * Beijing Xiwei Technology Co., Ltd.
 * All rights reserved.
 *
 * @file：AvengerMFileInputComponent
 * @summary：两级联动Select框，后者框可以多选
 * @version: 1.0
 * **********************************************************************
 * revision             author            reason             date
 * 1.0                  wangqing          增加功能1         2021-09-09
 * **********************************************************************
 */
import { Component, OnInit, ElementRef, Input, ChangeDetectorRef } from '@angular/core';
import { FormGroup, AbstractControl } from '@angular/forms';
import { XnInputOptions } from 'libs/shared/src/lib/public/form/xn-input.options';
import { XnFormUtils } from 'libs/shared/src/lib/common/xn-form-utils';
import { DynamicForm } from '../../dynamic.decorators';
import { XnUtils } from 'libs/shared/src/lib/common/xn-utils';
/**
 *  多级(3级)联动选择
 *  return {first: '', second: '', third: ''}
 */
@Component({
    selector: 'two-multip-linkage-select',
    templateUrl: './two-select-multiple.component.html',
    styles: [
        `.xn-mselect-right {
            padding-right: 2px;
        }
        .xn-mselect-left {
            padding-left: 2px;
        }
        nz-select {
            width: 100%;
          }
          ::ng-deep .cdk-overlay-container {
            pointer-events: none;
            top: 0;
            left: 0;
            height: 100%;
            width: 100%;
            position: fixed;
            z-index: 1500;
          }
        `
    ]
})
@DynamicForm({ type: 'multiple-two-select', formModule: 'default-input' })
export class MultipleTwoLinkageSelectInputComponent implements OnInit {

    @Input() row: any;
    @Input() form: FormGroup;

    selectModel: {
        first: number | string,
        second:  string[],
    } = {
            first: '',
            second: [],
        };
    secondOptions: Array<{ label: string; value: string }> = [{ label: '请选择', value: '' }];
    ctrl: AbstractControl;
    alert = '';
    myClass = '';
    xnOptions: XnInputOptions;

    constructor(private er: ElementRef, private cdr: ChangeDetectorRef) {
    }

    ngOnInit() {
        this.ctrl = this.form.get(this.row.name);
        this.calcAlertClass();
        // 设置初始值
        if (!!this.ctrl.value) {
            const valObj = XnUtils.parseObject(this.ctrl.value);
            this.initOptions(valObj);
            this.selectModel = { ...valObj };
            this.toValue();
            this.calcAlertClass();
            this.cdr.markForCheck();
        }
        this.xnOptions = new XnInputOptions(this.row, this.form, this.ctrl, this.er);
    }

    initOptions(valObj: any = {}) {
        const secondObj = this.row.selectOptions.find((x: any) => x.value.toString() === valObj.first?.toString());
        this.secondOptions = secondObj ? secondObj.children : [];
    }

    onBlur(event: any): void {
        this.calcAlertClass();
    }

    onChange(event: any, type: string) {
        switch (type) {
            case 'first':
                const secondObj = this.row.selectOptions.find((x: any) => x.value.toString() === this.selectModel.first.toString());
                this.secondOptions = secondObj ? secondObj.children : [];
                this.selectModel.second = [];
                this.cdr.markForCheck();
                break;
            default:
                break;
        }
        this.toValue();
    }

    private calcAlertClass() {
        this.myClass = XnFormUtils.getClass(this.ctrl);
        this.alert = XnFormUtils.buildValidatorErrorString(this.ctrl);
    }

    private toValue() {
        if (this.selectModel.second.length>0) {
            this.ctrl.setValue(this.selectModel);
        } else {
            this.ctrl.setValue('');
        }
    }
}
