/*
 * Copyright(c) 2017-2019, 深圳市链融科技股份有限公司
 * Beijing Xiwei Technology Co., Ltd.
 * All rights reserved.
 *
 * @file：AvengerListModule
 * @summary：交易列表 【采购融资，审批放款】
 * @version: 1.0
 * **********************************************************************
 * revision             author            reason             date
 * 1.0                   wangqing          审批放款         2019-06-14
 * **********************************************************************
 */

import {NgModule} from '@angular/core';
import {AvengerSharedModule} from '../shared/shared.module';
import { AvengerApprovalLoanRouteModule } from './approval-loan-manage-routing.module';
import { AvengerCommonModule } from '../common/avenger-common.module';

@NgModule({
    imports: [
        AvengerSharedModule,
        AvengerApprovalLoanRouteModule,
        AvengerCommonModule
    ],
    declarations: [
    ]
})
export class AvengerApprovalLoanModule {
}
