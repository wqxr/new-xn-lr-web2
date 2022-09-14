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
import { HwModeService } from 'libs/shared/src/lib/services/hw-mode.service';

@Component({
    selector: 'xn-avenger-text-id-component',
    templateUrl: './text-id.component.html',
})
@DynamicForm({ type: 'text-id', formModule: 'avenger-input' })
export class AvengerTextIdInputComponent implements OnInit {

    @Input() row: any;
    @Input() form: FormGroup;

    myClass = '';
    alert = '';
    ctrl: AbstractControl;
    xnOptions: XnInputOptions;
    public label = '';

    constructor(private er: ElementRef, private xn: XnService, private localStorageService: LocalStorageService,
        private publicCommunicateService: PublicCommunicateService, hwModeService: HwModeService) {
    }
    ngOnInit() {
        this.ctrl = this.form.get(this.row.name);
        this.label = this.row.value;
        this.toValue();

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
        if (this.label === '') {
            this.ctrl.setValue('');
        } else {
            this.ctrl.setValue(this.label);
        }
        this.ctrl.markAsTouched();
        this.calcAlertClass();

    }

    /**
     * 查看流程记录
     * @param paramMainFloId
     */
    public viewProcess(paramMainFloId: string, isProxy?: any, currentStatus?: string) {
        if (paramMainFloId.endsWith('lg') || paramMainFloId.endsWith('wk')) {
            this.xn.router.navigate([
                `logan/main-list/detail/${paramMainFloId}`
            ]);
        } else if (paramMainFloId.endsWith('bgy')) {
            this.xn.router.navigate([
                `country-graden/main-list/detail/${paramMainFloId}`
            ]);
        } else if (paramMainFloId.endsWith('oct')) {
            this.xn.router.navigate([
                `oct/main-list/detail/${paramMainFloId}`
            ]);
        } else if (paramMainFloId.endsWith('sh')) {
            this.xn.router.navigate([
                `bank-shanghai/main-list/detail/${paramMainFloId}`
            ]);
        } else if (paramMainFloId.endsWith('jd')) { // 金地查看流程详情
            this.xn.router.navigate([
                `new-gemdale/main-list/detail/${paramMainFloId}`
            ]);
        } else if (paramMainFloId.endsWith('yjl')) { // 雅居乐-星顺查看流程详情
            this.xn.router.navigate([
                `agile-xingshun/main-list/detail/${paramMainFloId}`
            ]);
        } else if (paramMainFloId.endsWith('hz')) { // 雅居乐-恒泽查看流程详情
            this.xn.router.navigate([
                `agile-hz/main-list/detail/${paramMainFloId}`
            ]);
        } else {
            const routeparams = isProxy === undefined ? `${paramMainFloId}` : `${paramMainFloId}/${isProxy}/${currentStatus}`;
            this.xn.router.navigate([
                `console/main-list/detail/${routeparams}`
            ]);
        }
    }

}
