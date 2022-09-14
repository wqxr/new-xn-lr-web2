/*
 * Copyright(c) 2017-2019, 深圳市链融科技股份有限公司
 * Beijing Xiwei Technology Co., Ltd.
 * All rights reserved.
 *
 * @file：AvengerListModule
 * @summary：交易列表 【采购融资，地产abs】
 * @version: 1.0
 * **********************************************************************
 * revision             author            reason             date
 * 1.0                 zhyuanan          增加功能1         2019-05-18
 * **********************************************************************
 */

import { NgModule } from '@angular/core';
import { AvengerListComponent } from './avenger-list.component';
import { AvengerSharedModule } from '../shared/shared.module';

/**
 *  组件
 */
const COMPONENT = [
    AvengerListComponent,
];

/**
 *  外部可用组件
 */
const EXPORT_COMPONENT = [
    AvengerListComponent,
];

@NgModule({
    imports: [
        AvengerSharedModule,
    ],
    declarations: [
        ...COMPONENT
    ],
    exports: [
        ...EXPORT_COMPONENT
    ]
})
export class AvengerCommonModule {
}
