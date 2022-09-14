/*
 * Copyright(c) 2017-2019, 深圳市链融科技股份有限公司
 * Beijing Xiwei Technology Co., Ltd.
 * All rights reserved.
 *
 * @file：avenger-date-input-component.ts
 * @summary：日期选项  type = 'date'
 * @version: 1.0
 * **********************************************************************
 * revision             author            reason             date
 * 1.0                 zhyuanan          增加功能1         2019-04-22
 * **********************************************************************
 */

import {ChangeDetectionStrategy, Component, OnInit, Input, ElementRef, OnDestroy, OnChanges} from '@angular/core';
import {FormGroup, AbstractControl} from '@angular/forms';
import {XnInputOptions} from 'libs/shared/src/lib/public/form/xn-input.options';
import {XnFormUtils} from 'libs/shared/src/lib/common/xn-form-utils';
import { DynamicForm } from 'libs/shared/src/lib/common/dynamic-form/dynamic.decorators';

declare let $: any;
import * as moment from 'moment';

@Component({
    selector: 'xn-avenger-date-input-component',
    templateUrl: './date-input.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    styles: [
            `.enable-input {
            background-color: #ffffff
        }

        .input-group-addon {
            border-bottom-right-radius: 3px;
            border-top-right-radius: 3px;
        }

        .input-group > .bg {
            background-color: #eee;
            opacity: 1;
        }
        `
    ]
})
@DynamicForm({ type: 'date', formModule: 'avenger-input' })
export class AvengerDateInputComponent implements OnInit, OnChanges, OnDestroy {

    @Input() row: any;
    @Input() form: FormGroup;

    myClass = '';
    myClass2 = 'input-group-addon';
    alert = '';
    ctrl: AbstractControl;
    xnOptions: XnInputOptions;

    input: any;

    constructor(private er: ElementRef) {
    }

    ngOnChanges() {
    }

    ngOnInit() {
        if (!this.row.placeholder) {
            this.row.placeholder = '';
        }

        this.ctrl = this.form.get(this.row.name);
        // 日期组件的默认配置在AppComponent里配置
        this.input = $(this.er.nativeElement).find('input');

        if (this.ctrl.value === '') {
            this.input.val('');
            this.ctrl.setValue('');
        } else {
            this.input.val(this.ctrl.value);
        }

        this.input.on('change', (e) => {
            e.preventDefault();
            if (this.ctrl.disabled) {
                this.input.val(this.ctrl.value);
            } else {
                const val = this.input.val();
                if (val !== this.ctrl.value) {
                    this.input.focus();
                    this.input.blur();
                }
            }
        });

        this.calcAlertClass();

        this.xnOptions = new XnInputOptions(this.row, this.form, this.ctrl, this.er);
    }

    ngOnDestroy() {
        if (this.input) {
            this.input.off();
        }
    }

    onBlur(): void {
        if (this.ctrl.disabled) {
            this.input.val(this.ctrl.value);
        } else {
            const val = this.input.val();
            if (val !== this.ctrl.value) {
                this.ctrl.markAsTouched();
                this.ctrl.setValue(val);
            }

            this.calcAlertClass();
        }
    }

    calcAlertClass(): void {
        this.myClass = (this.ctrl.disabled ? '' : 'enable-input ') + XnFormUtils.getClass(this.ctrl);
        this.myClass2 = 'input-group-addon ' + this.myClass;
        this.alert = XnFormUtils.buildValidatorErrorString(this.ctrl);
    }
}
