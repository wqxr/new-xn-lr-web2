/*
 * Copyright(c) 2017-2019, 深圳市链融科技股份有限公司
 * Beijing Xiwei Technology Co., Ltd.
 * All rights reserved.
 *
 * @file：ProgressModule
 * @summary：保理风控-过程控制
 * @version: 1.0
 * **********************************************************************
 * revision             author            reason             date
 * 1.0                 zhyuanan          增加功能1         2019-05-30
 * **********************************************************************
 */

import {NgModule} from '@angular/core';
import {ProgressRoutingModule} from './progress-routing.module';
import {RiskSharedModule} from '../risk-shared.module';
import {ProgressIndexComponent} from './progress-index.component';
import {ProgressDetailComponent} from './progress-detail.component';
import {ProgressInNormalComponent} from './progress-in-normal.component';
import {SurveyModule} from '../survey/survey.module';
import {ProgressInDealComponent} from './progress-in-deal.component';
import {ProgressInFlowComponent} from './progress-in-flow.component';
import {ProgressInCashComponent} from './progress-in-cash.component';
import {ProgressInHouseHoldComponent} from './progress-in-houseHold.component';
import {ProgressInHouseHoldAddComponent} from './progress-in-houseHold-add.component';
import {ProgressInHouseHoldHomeComponent} from './progress-in-houseHold-home.component';
import {ProgressInHouseHoldEditComponent} from './progress-in-houseHold-edit.component';
import {ProgressInHouseHoldViewComponent} from './progress-in-houseHold-view.component';
import {RiskWarningModule} from '../risk-warning/risk-warning.module';

@NgModule({
    imports: [
        RiskSharedModule,
        ProgressRoutingModule,
        SurveyModule,
        RiskWarningModule
    ],
    declarations: [
        ProgressIndexComponent,
        ProgressDetailComponent,
        ProgressInNormalComponent,
        ProgressInDealComponent,
        ProgressInFlowComponent,
        ProgressInCashComponent,
        ProgressInHouseHoldComponent,
        ProgressInHouseHoldAddComponent,
        ProgressInHouseHoldHomeComponent,
        ProgressInHouseHoldEditComponent,
        ProgressInHouseHoldViewComponent,
    ]

})
export class ProgressModule {
}
