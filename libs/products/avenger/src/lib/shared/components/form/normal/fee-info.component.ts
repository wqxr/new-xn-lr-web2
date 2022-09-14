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
import AvengerapprovalTable from '../approval-normal/approval.fitall.tab';

@Component({
    selector: 'xn-avenger-fee-info-component',
    templateUrl: './fee-info.component.html',
})
@DynamicForm({ type: 'fee-info', formModule: 'avenger-input' })
export class AvengerFeeInfoInputComponent implements OnInit {

    @Input() row: any;
    @Input() form: FormGroup;

    myClass = '';
    alert = '';
    ctrl: AbstractControl;
    xnOptions: XnInputOptions;
    public Tabconfig: any;
    public items: any;

    constructor(private er: ElementRef, private xn: XnService, private localStorageService: LocalStorageService,
                private publicCommunicateService: PublicCommunicateService, hwModeService: HwModeService) {
    }
    ngOnInit() {
        this.Tabconfig = AvengerapprovalTable.tableFormlist;
        this.items = this.row.value && JSON.parse(this.row.value);
        this.ctrl = this.form.get(this.row.name);
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
        if (this.items === '') {
            this.ctrl.setValue('');
        } else {
            this.ctrl.setValue(this.items);
        }
        this.ctrl.markAsTouched();
        this.calcAlertClass();

    }

    /**
     * 查看流程记录
     * @param paramMainFloId
     */
    public viewProcess(paramMainFloId: string, isProxy?: any, currentStatus?: string) {
        const routeparams = isProxy === undefined ? `${paramMainFloId}` : `${paramMainFloId}/${isProxy}/${currentStatus}`;
        this.xn.router.navigate([
            `console/main-list/detail/${routeparams}`
        ]);

    }
}
