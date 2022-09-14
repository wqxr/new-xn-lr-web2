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

import { Component, OnInit, ElementRef, Input } from '@angular/core';
import { FormGroup, AbstractControl } from '@angular/forms';
import { XnInputOptions } from 'libs/shared/src/lib/public/form/xn-input.options';
import { SelectOptions } from 'libs/shared/src/lib/config/select-options';
import { XnFormUtils } from 'libs/shared/src/lib/common/xn-form-utils';
import { XnUtils } from 'libs/shared/src/lib/common/xn-utils';
import { DynamicForm } from 'libs/shared/src/lib/common/dynamic-form/dynamic.decorators';

class InputModel {
    factoringUser = 0;
    factoringServicer = 0;
    platformServicer = 0;
}

@Component({
    selector: 'xn-avenger-moreselect-input-component',
    templateUrl: './more-select-info.html',
    styles: [`
    .flex-row { display: flex; margin-bottom: 15px;},
    .this-title { width: 90px; text-align: right; padding-top: 7px;},
    .this-padding { padding-left: 10px; padding-right: 10px;},
    .this-flex-1 { flex: 1; },
    .this-flex-2 { flex: 2; },
    .this-flex-3 { flex: 3; },
    .titlestyle{
        width:12% !important;
        margin-left:20px !important;
   }
   .readonlystyle{
       background:#eee;
   }
        `
    ]
})
@DynamicForm({ type: 'royalty', formModule: 'avenger-input' })
export class AvengerMoreselectInputComponent implements OnInit {

    @Input() row: any;
    @Input() form: FormGroup;

    myClass = '';
    alert = '';
    ctrl: AbstractControl;
    xnOptions: XnInputOptions;
    isreadonly = false;
    originOptions = [];
    valuelist: any[] = [];
    public formValue: InputModel = new InputModel();

    constructor(private er: ElementRef) {
    }

    ngOnInit() {

        this.ctrl = this.form.get(this.row.name);
        if (this.row.options.readonly !== undefined) {
            this.isreadonly = this.row.options.readonly;
            this.valuelist = JSON.parse(this.row.value);

        } else {
            this.originOptions = this.row.selectOptions;



            // 获取模式配置（前端配置）
            this.row.selectOptions = SelectOptions.get('payCompany');
            this.ctrl.statusChanges.subscribe(v => {
                this.calcAlertClass();
            });
            this.xnOptions = new XnInputOptions(this.row, this.form, this.ctrl, this.er);
            this.fromValue();

        }


    }


    public onBlur() {
        this.toValue();
    }
    private calcAlertClass() {
        this.myClass = XnFormUtils.getClass(this.ctrl);
        this.alert = XnFormUtils.buildValidatorErrorString(this.ctrl);
    }
    public inputChange(e, key) {
        this.formValue[key] = parseInt(e.target.value);
    }

    private fromValue() {
        const data = XnUtils.parseObject(this.ctrl.value, {});
        if (!XnUtils.isEmptyObject(data)) {
            this.formValue = data;
        }
        this.toValue();
    }
    private toValue() {

        if (!this.formValue.factoringUser || !this.formValue.factoringServicer || !this.formValue.platformServicer) {
            this.ctrl.setValue('');
            // this.alert = '必填字段';
        } else {
            this.ctrl.setValue(JSON.stringify(this.formValue));
            // this.alert = '';
        }
        this.ctrl.markAsTouched();
        this.calcAlertClass();
    }
}
