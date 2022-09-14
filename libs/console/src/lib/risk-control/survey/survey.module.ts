/*
 * Copyright(c) 2017-2019, 深圳市链融科技股份有限公司
 * Beijing Xiwei Technology Co., Ltd.
 * All rights reserved.
 *
 * @file：SurveyModule
 * @summary：风控管理- 客户管理模块
 * @version: 1.0
 * **********************************************************************
 * revision             author            reason             date
 * 1.0                 zhyuanan          新增         2019-05-29
 * **********************************************************************
 */

import {NgModule} from '@angular/core';
import {SurveyRoutingModule} from './survey-routing.module';
import {SurveyIndexComponent} from './survey-index.component';
import {SurveyDetailComponent} from './survey-detail.component';
import {RiskSharedModule} from '../risk-shared.module';
import {SurveyInInfoComponent} from './survey-in-info.component';
import {FinancingMapComponent} from './financing-map.component';
import {ProgressInCreditComponent} from './progress-in-credit.component';
import {SurveyInFinancialComponent} from './survey-in-financial.component';
import {SurveyInCoreComponent} from './survey-in-core.component';
import {AssociationMapComponent} from './association-map.component';
import {RiskMapModule} from '../risk/risk-map.module';
import {BalanceTableComponent} from './balance-table.component';
import {CashTableComponent} from './cash-table.component';
import {ProfitTableComponent} from './profit-table.component';
import {SurveyInOpponentComponent} from './survey-in-opponent.component';

@NgModule({
    imports: [
        SurveyRoutingModule,
        RiskSharedModule,
        RiskMapModule
    ],
    declarations: [
        SurveyIndexComponent,
        SurveyDetailComponent,
        SurveyInInfoComponent,
        FinancingMapComponent,
        ProgressInCreditComponent,
        SurveyInFinancialComponent,
        SurveyInOpponentComponent,
        SurveyInCoreComponent,
        AssociationMapComponent,
        BalanceTableComponent,
        CashTableComponent,
        ProfitTableComponent,
    ],
    exports: [
        FinancingMapComponent,
        ProgressInCreditComponent,
    ]
})
export class SurveyModule {
}
