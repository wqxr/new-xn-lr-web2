/*
 * Copyright(c) 2017-2019, 深圳市链融科技股份有限公司
 * Beijing Xiwei Technology Co., Ltd.
 * All rights reserved.
 *
 * @file：AvengerListModule
 * @summary：交易列表 【开票管理】
 * @version: 1.0
 * **********************************************************************
 * revision             author            reason             date
 * 1.0                   tianbao          开票管理         2020-05-22
 * **********************************************************************
 */

import {NgModule} from '@angular/core';
import {AvengerSharedModule} from '../shared/shared.module';
import { AvengerInvoiceRouteModule } from './invoice-management-routing.module';
import { AvengerCommonModule } from '../common/avenger-common.module';
import { DragonInvoiceManagementComponent } from './invoice-management.component';

const COMPONENTS = [
    DragonInvoiceManagementComponent
];
@NgModule({
    imports: [
        AvengerSharedModule,
        AvengerCommonModule,
        AvengerInvoiceRouteModule
    ],
    declarations: [...COMPONENTS],
})
export class AvengerInvoiceManagementModule {
}
