/*
 * Copyright(c) 2017-2019, 深圳市链融科技股份有限公司
 * Beijing Xiwei Technology Co., Ltd.
 * All rights reserved.
 *
 * @file：DynamicDirective
 * @summary：动态表单指令
 * @version: 1.0
 * **********************************************************************
 * revision             author            reason             date
 * 1.0                WuShenghui    移除表单 ngSwitchCase   2019-06-24
 * **********************************************************************
 */
import { Directive, ViewContainerRef } from '@angular/core';

@Directive({
    selector: '[dynamic-host]',
})
export class DynamicDirective {
    constructor(public viewContainerRef: ViewContainerRef) { }
}
