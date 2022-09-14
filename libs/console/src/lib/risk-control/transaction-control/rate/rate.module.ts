
/*
 * Copyright(c) 2017-2019, 深圳市链融科技股份有限公司
 * Beijing Xiwei Technology Co., Ltd.
 * All rights reserved.
 *
 * @file：RateModule
 * @summary：保理风控-交易控制-费率控制
 * @version: 1.0
 * **********************************************************************
 * revision             author            reason             date
 * 1.0                 zhyuanan          增加功能1         2019-05-30
 * **********************************************************************
 */

import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {RateRoutingModule} from './rate-routing.module';
import {RiskSharedModule} from '../../risk-shared.module';
import {RateControlIndexComponent} from './rate-control-index.component';

@NgModule({
    imports: [
        CommonModule,
        RateRoutingModule,
        RiskSharedModule
    ],
    declarations: [
        RateControlIndexComponent
    ]
})
export class RateModule {
}
