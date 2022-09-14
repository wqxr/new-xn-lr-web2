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
 * 1.0                    wq          增加         2019-04-22
 * **********************************************************************
 */

import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, FormGroup } from '@angular/forms';
import { XnInputOptions } from 'libs/shared/src/lib/public/form/xn-input.options';
import { DynamicForm } from 'libs/shared/src/lib/common/dynamic-form/dynamic.decorators';

class InputModel {
    factoringUser = 0;
    factoringServicer = 0;
}

@Component({
    selector: 'xn-avenger-twoselect-input-component',
    templateUrl: './avenger-twoselect-info.html',
    styles: [`
    .readonlystyle{
        background:#eee;
      }
        `
    ]
})
@DynamicForm({ type: 'payer', formModule: 'avenger-input' })
export class AvengerTwoselectInputComponent implements OnInit {

    @Input() row: any;
    @Input() form: FormGroup;
    @ViewChild('input') input: ElementRef;
    myClass = '';
    alert = '';
    ctrl: AbstractControl;
    xnOptions: XnInputOptions;
    valuelist: any;
    inMemo = '';
    datalist: any[] = [];

    constructor(private er: ElementRef) {
    }



    ngOnInit() {
        if (!this.row.placeholder) {
            this.row.placeholder = '';
            if (this.row.type === 'text' && this.row.value === 0) {
                this.row.placeholder = 0;
            }
        }

        this.ctrl = this.form.get(this.row.name);
        this.valuelist = JSON.parse(this.row.value);
        this.xnOptions = new XnInputOptions(this.row, this.form, this.ctrl, this.er);

    }
}
