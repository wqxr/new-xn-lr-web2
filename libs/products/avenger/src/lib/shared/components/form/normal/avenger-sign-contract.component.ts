/*
 * Copyright(c) 2017-2019, 深圳市链融科技股份有限公司
 * Beijing Xiwei Technology Co., Ltd.
 * All rights reserved.
 *
 * @file：select-input.component.ts
* @summary：下拉选项-单选  type = 'select
 * @version: 1.0
 * **********************************************************************
 * revision             author            reason             date
 * 1.0                 wq          增加                   2019-06-10
 * **********************************************************************
 */

import { Component, OnInit, ElementRef, Input } from '@angular/core';
import { FormGroup, AbstractControl } from '@angular/forms';
import { XnInputOptions } from 'libs/shared/src/lib/public/form/xn-input.options';
import { XnFormUtils } from 'libs/shared/src/lib/common/xn-form-utils';
import { SelectOptions } from 'libs/shared/src/lib/config/select-options';
import { XnUtils } from 'libs/shared/src/lib/common/xn-utils';
import { DynamicForm } from 'libs/shared/src/lib/common/dynamic-form/dynamic.decorators';
import { PublicCommunicateService } from 'libs/shared/src/lib/services/public-communicate.service';

class InputModel {
    firstValue = '';
    secondValue = '';
    thirdValue = '';

}

@Component({
    selector: 'xn-avenger-signselect-input-component',
    templateUrl: './avenger-sign-contract.component.html',
    styles: [`
    .floatselect{
            float: left;
            width: 33%;
        }
    `]
})
@DynamicForm({ type: 'moreselect', formModule: 'avenger-input' })
export class AvengerSignSelectInputComponent implements OnInit {

    @Input() row: any;
    @Input() form: FormGroup;

    myClass = '';
    alert = '';
    xnOptions: XnInputOptions;
    originOptions = [];
    change: AbstractControl;
    ctrl: AbstractControl;
    secondSelect: any[] = [];
    thirdSelect: any[] = [];
    firstselect: any[] = [];
    public formValue: InputModel = new InputModel();

    constructor(private er: ElementRef, private publicCommunicateService: PublicCommunicateService) {
    }

    ngOnInit() {
        this.ctrl = this.form.get(this.row.name);
        this.change = this.row.options && this.row.options.change && this.form.get(this.row.options.change);
        this.originOptions = this.row.selectOptions;
        // 获取模式配置（前端配置）
        this.row.selectOptions = SelectOptions.get('moneyType');
        this.firstselect = SelectOptions.get('moneyType');
        this.ctrl.statusChanges.subscribe(v => {
            this.calcAlertClass();

        });

        this.xnOptions = new XnInputOptions(this.row, this.form, this.ctrl, this.er);
        this.fromValue();
        if (this.row.value) {
            this.secondSelect = this.row.value.twoselect;
            this.thirdSelect = this.row.value.threeselect;
            this.formValue = JSON.parse(this.row.value.valueinfo);
        }
    }


    public onBlur() {
        this.toValue();
    }
    private calcAlertClass() {
        this.myClass = XnFormUtils.getClass(this.ctrl);
        this.alert = XnFormUtils.buildValidatorErrorString(this.ctrl);
    }
    public inputChange(e?, key?) {
        // this.formValue[key] = e.target.value;
        this.formValue[key] = e.target.value;
        this.secondSelect = this.firstselect.filter(item => {
            return item.value === this.formValue.firstValue;
        });
        this.secondSelect = this.secondSelect[0].children;
        this.thirdSelect = this.secondSelect.filter(item => {
            return item.value === this.formValue.secondValue;
        });
        if (this.thirdSelect.length > 0) {
            this.thirdSelect = this.thirdSelect[0].children;
        }




    }

    private fromValue() {
        const data = XnUtils.parseObject(this.ctrl.value, {});
        if (!XnUtils.isEmptyObject(data)) {
            this.formValue = data;
        }
        this.toValue();
    }
    private toValue() {
        if (!this.formValue.firstValue || this.formValue.secondValue === '' || this.formValue.thirdValue === '') {
            this.ctrl.setValue('');
        } else {
            this.ctrl.setValue({ valueinfo: this.formValue, twoselect: this.secondSelect, threeselect: this.thirdSelect });
        }
        this.calcAlertClass();
        this.ctrl.markAsTouched();
    }
}
