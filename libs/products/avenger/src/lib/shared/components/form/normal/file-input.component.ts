/*
 * Copyright(c) 2017-2019, 深圳市链融科技股份有限公司
 * Beijing Xiwei Technology Co., Ltd.
 * All rights reserved.
 *
 * @file：file-input.component.ts
 * @summary：文件上传 单个  type = 'file'
 * @version: 1.0
 * **********************************************************************
 * revision             author            reason             date
 * 1.0                 zhyuanan          增加功能1         2019-04-22
 * **********************************************************************
 */

import {
    Component,
    Input
} from '@angular/core';
import {FormGroup} from '@angular/forms';
import { DynamicForm } from 'libs/shared/src/lib/common/dynamic-form/dynamic.decorators';

declare let $: any;

@Component({
    selector: 'xn-avenger-file-input-component',
    template: `
        <xn-file-input [row]="row" [form]="form"></xn-file-input>`,
})
@DynamicForm({ type: 'file', formModule: 'avenger-input' })
export class AvengerFileInputComponent {
    @Input() row: any;
    @Input() form: FormGroup;
}
