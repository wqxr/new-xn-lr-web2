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
import { DynamicForm } from 'libs/shared/src/lib/common/dynamic-form/dynamic.decorators';

/**
 *  exp: ref='StandardFactoringMode'
 *    StandardFactoringMode: [
 *  {
 *      label: '标准保理（金地）', value: '14', children: [
 *          { label: '保理商预录入', value: '1' },
 *          { label: '供应商上传资料并签署合同', value: '2' },
 *          { label: '保理商审核', value: '3' },
 *          { label: '项目公司确认应收账款金额', value: '4' },
 *          // {label: '集团公司签署付款确认书', value: '5'},
 *          { label: '保理商签署合同', value: '6' },
 *          { label: '交易完成', value: '7' },
 *          { label: '终止', value: '8' },
 *      ]
 *  },
 *  {
 *      label: '房地产供应链标准保理', value: '6', children: [
 *          { label: '保理商预录入', value: '1' },
 *          { label: '供应商上传资料并签署合同', value: '2' },
 *          { label: '保理商审核并签署合同', value: '3' },
 *          { label: '交易完成', value: '4' },
 *          { label: '终止', value: '8' }
 *      ]
 *  }
 *  ]
 */
@Component({
    selector: 'xn-avenger-linkage-select-input-component',
    template: `
        <xn-linkage-select-input [form]="form" [row]="row"></xn-linkage-select-input>
    `
})
@DynamicForm({ type: 'linkage-select', formModule: 'avenger-input' })
export class AvengerLinkageSelectInputComponent {
    @Input() row: any;
    @Input() form: FormGroup;
}
