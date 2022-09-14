/*
 * Copyright(c) 2017-2019, 深圳市链融科技股份有限公司
 * Beijing Xiwei Technology Co., Ltd.
 * All rights reserved.
 *
 * @file：RiskWarningModule
 * @summary：保理风控- 风险警告
 * @version: 1.0
 * **********************************************************************
 * revision             author            reason             date
 * 1.0                 zhyuanan          增加功能1         2019-05-30
 * **********************************************************************
 */

import {NgModule} from '@angular/core';
import {RiskWarningRoutingModule} from './risk-warning-routing.module';
import {RiskSharedModule} from '../risk-shared.module';
import {RiskWarningIndexComponent} from './risk-warning-index.component';
import {CollectionReminderIndex2Component} from './collection-reminder-index2.component';
import {CollectionReminderIndex1Component} from './collection-reminder-index1.component';
import {RiskInvoiceManagementComponent} from './invoice-management.component';
import {TicketManagementComponent} from './ticket-management.component';
import {DueReminderComponent} from './due-reminder.component';
import {CollectionReminderComponent} from './collection-reminder.component';
import {CollectionReminderIndexComponent} from './collection-reminder-index.component';

@NgModule({
    imports: [
        RiskWarningRoutingModule,
        RiskSharedModule,
    ],
    declarations: [
        RiskWarningIndexComponent,
        CollectionReminderIndex2Component,
        CollectionReminderIndex1Component,
        RiskInvoiceManagementComponent,
        TicketManagementComponent,
        DueReminderComponent,
        CollectionReminderComponent,
        CollectionReminderIndexComponent
    ],
    exports: [
        CollectionReminderIndexComponent,
        CollectionReminderComponent,
    ]
})
export class RiskWarningModule {
}
