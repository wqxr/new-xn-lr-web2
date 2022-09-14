/*
 * Copyright(c) 2017-2019, 深圳市链融科技股份有限公司
 * Beijing Xiwei Technology Co., Ltd.
 * All rights reserved.
 *
 * @file：AmountModule
 * @summary：保理风控-交易控制-额度控制
 * @version: 1.0
 * **********************************************************************
 * revision             author            reason             date
 * 1.0                 zhyuanan          增加功能1         2019-05-30
 * **********************************************************************
 */

import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {AmountRoutingModule} from './amount-routing.module';
import {RiskSharedModule} from '../../risk-shared.module';
import {AmountControlIndexComponent} from './amount-control-index.component';
import {AmountControlEnterpriseListComponent} from './amount-control-enterprise-list.component';
import { AmountControlCommService } from './amount-control-comm.service';

@NgModule({
    imports: [
        CommonModule,
        AmountRoutingModule,
        RiskSharedModule
    ],
    declarations: [
        AmountControlIndexComponent,
        AmountControlEnterpriseListComponent
    ],
})
export class AmountModule {
}
