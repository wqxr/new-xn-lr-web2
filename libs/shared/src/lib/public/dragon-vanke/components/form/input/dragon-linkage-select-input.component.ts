/*
 * Copyright(c) 2017-2019, 深圳市链融科技股份有限公司
 * Beijing Xiwei Technology Co., Ltd.
 * All rights reserved.
 *
 * @file：avenger-linkage-select-input.component.ts
 * @summary：多级联动
 * @version: 1.0
 * **********************************************************************
 * revision             author            reason             date
 * 1.0                 zhyuanan             新增         2019-05-18
 * **********************************************************************
 */

import {Component, Input} from '@angular/core';
import {FormGroup} from '@angular/forms';
import { DynamicForm } from '../../../../../common/dynamic-form/dynamic.decorators';

@Component({
    selector: 'xn-dragon-linkage-select-input-component',
    template: `
        <xn-linkage-select-input [form]="form" [row]="row"></xn-linkage-select-input>
    `
})
@DynamicForm({ type: 'linkage-select', formModule: 'dragon-input' })
export class DargonLinkageSelectInputComponent {
    @Input() row: any;
    @Input() form: FormGroup;
}
