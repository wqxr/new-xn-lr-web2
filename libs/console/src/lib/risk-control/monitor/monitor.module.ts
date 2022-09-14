/*
 * Copyright(c) 2017-2019, 深圳市链融科技股份有限公司
 * Beijing Xiwei Technology Co., Ltd.
 * All rights reserved.
 *
 * @file：MonitorModule
 * @summary：综合检测模块
 * @version: 1.0
 * **********************************************************************
 * revision             author            reason             date
 * 1.0                 zhyuanan          增加功能1         2019-05-29
 * **********************************************************************
 */

import {NgModule} from '@angular/core';
import {PublicModule} from 'libs/shared/src/lib/public/public.module';
import {RiskSharedModule} from '../risk-shared.module';
import {ComprehensiveTestingIndexComponent} from './comprehensive-testing-index.component';
import {MonitorRoutingModule} from './monitor-routing.module';
import {PlatformOperationComponent} from './platform-operation.component';
import {CustomerRatingComponent} from './customer-rating.component';
import {CustomerFluidityComponent} from './customer-fluidity.component';
import {DebtRatingComponent} from './debt-rating.component';
import {ComprehensiveTestingServive} from './comprehensive-testing.servive';
import {CommonModule} from '@angular/common';

@NgModule({
    imports: [
        RiskSharedModule,
        MonitorRoutingModule
    ],
    declarations: [
        ComprehensiveTestingIndexComponent,
        PlatformOperationComponent,
        CustomerRatingComponent,
        CustomerFluidityComponent,
        DebtRatingComponent
    ],
    providers: [
        ComprehensiveTestingServive
    ]
})
export class MonitorModule {
}
