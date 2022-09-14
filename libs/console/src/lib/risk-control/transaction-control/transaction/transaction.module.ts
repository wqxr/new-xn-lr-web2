/*
 * Copyright(c) 2017-2019, 深圳市链融科技股份有限公司
 * Beijing Xiwei Technology Co., Ltd.
 * All rights reserved.
 *
 * @file：TransactionModule
 * @summary：保理风控 - 交易控制-交易控制
 * @version: 1.0
 * **********************************************************************
 * revision             author            reason             date
 * 1.0                 zhyuanan          增加功能1         2019-05-30
 * **********************************************************************
 */

import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {TransactionRoutingModule} from './transaction-routing.module';
import {RiskSharedModule} from '../../risk-shared.module';
import {TransactionControlIndexComponent} from './transaction-control-index.component';
import {TransactionControlEnterpriseComponent} from './transaction-control-enterprise.component';
import {EnterpriseTransactionControlModalComponent} from './enterprise-transaction-control-modal.component';

@NgModule({
    imports: [
        CommonModule,
        RiskSharedModule,
        TransactionRoutingModule,
    ],
    declarations: [
        TransactionControlIndexComponent,
        TransactionControlEnterpriseComponent
    ]
})
export class TransactionModule {
}
