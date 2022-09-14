/*
 * Copyright(c) 2017-2019, 深圳市链融科技股份有限公司
 * Beijing Xiwei Technology Co., Ltd.
 * All rights reserved.
 *
 * @file：RiskMapModule
 * @summary：保理风控-风险地图
 * @version: 1.0
 * **********************************************************************
 * revision             author            reason             date
 * 1.0                 zhyuanan          增加功能1         2019-05-30
 * **********************************************************************
 */

import {NgModule} from '@angular/core';
import {PublicModule} from 'libs/shared/src/lib/public/public.module';
import {RiskSharedModule} from '../risk-shared.module';
import {RiskMapRoutingModule} from './risk-map-routing.module';
import {RiskMapCardComponent} from './risk-map-card.component';
import {RiskMapDDComponent} from './risk-map-dd.component';
import {RiskMapIndexComponent} from './risk-map-index.component';
import {RiskMapCard1Component} from './risk-map-card1.component';
import {RiskMapCard2Component} from './risk-map-card2.component';
import {RiskMapDD3Component} from './risk-map-dd3.component';

@NgModule({
    imports: [
        PublicModule,
        RiskSharedModule,
        RiskMapRoutingModule
    ],
    declarations: [
        RiskMapIndexComponent,
        RiskMapCardComponent,
        RiskMapDDComponent,
        RiskMapCard1Component,
        RiskMapCard2Component,
        RiskMapDD3Component
    ],
    exports: [
        RiskMapIndexComponent,
        RiskMapCardComponent,
        RiskMapDDComponent,
        RiskMapCard1Component,
        RiskMapCard2Component,
        RiskMapDD3Component
    ]
})
export class RiskMapModule {
}
