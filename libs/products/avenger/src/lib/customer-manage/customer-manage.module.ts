/*
 * Copyright(c) 2017-2019, 深圳市链融科技股份有限公司
 * Beijing Xiwei Technology Co., Ltd.
 * All rights reserved.
 *
 * @file：CustomerManageModule
 * @summary：客户管理功能模块
 * @version: 1.0
 * **********************************************************************
 * revision             author            reason             date
 * 1.0                 zhyuanan          新建                2019-05-05
 * **********************************************************************
 */

import { NgModule } from '@angular/core';
import { CustomerManageRoutingModule } from './customer-manage-routing.module';
import { AvengerSharedModule } from '../shared/shared.module';
import { CustomerTemplateComponent } from './customer-template/customer-template-component';
import { CustomerDetailComponent } from './Custom-Detail-template/Customer-Detail-template-component';
import { CustomerChangeManagerComponent } from './customer-managing-template/customer-managing.component';

const COMPONENTS = [
    CustomerTemplateComponent,
    CustomerDetailComponent,
    CustomerChangeManagerComponent
];

@NgModule({
    imports: [
        AvengerSharedModule,
        CustomerManageRoutingModule,
    ],
    declarations: [...COMPONENTS]
})
export class CustomerManageModule {
}
