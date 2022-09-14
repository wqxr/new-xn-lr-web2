/*
 * Copyright(c) 2017-2019, 深圳市链融科技股份有限公司
 * Beijing Xiwei Technology Co., Ltd.
 * All rights reserved.
 *
 * @file：ContractManageModule
 * @summary：平台合同管理
 * @version: 1.0
 * **********************************************************************
 * revision             author            reason             date
 * 1.0                 zhyuanan          新增模块         2019-05-05
 * **********************************************************************
 */

import {NgModule} from '@angular/core';
import {ContractManageRoutingModule} from './contract-manage-routing.module';
import { ContractManagerComponent } from './contract-template/contract-template.component';
import { AvengerSharedModule } from '../shared/shared.module';
const COMPONENTS = [
    ContractManagerComponent
];

@NgModule({
    imports: [
        AvengerSharedModule,
        ContractManageRoutingModule
    ],
    declarations: [...COMPONENTS],
})
export class ContractManageModule {
}
