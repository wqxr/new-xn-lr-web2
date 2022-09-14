/*
 * Copyright(c) 2017-2019, 深圳市链融科技股份有限公司
 * Beijing Xiwei Technology Co., Ltd.
 * All rights reserved.
 *
 * @file：FactoringBusinessModule
 * @summary：万科供应商保理业务信息
 * @version: 1.0
 * **********************************************************************
 * revision             author            reason             date
 * 1.0                 zhyuanan          增加功能1         2019-05-15
 * **********************************************************************
 */

import {NgModule} from '@angular/core';
import {IndexComponent} from './index.component';
import {AvengerSharedModule} from '../shared/shared.module';
import {PromotionInformationModalComponent} from './promotion-information.modal.component';
import {SupplierExpirationReminderModalComponentComponent} from './supplier-expiration-reminder-modal.component';
import {ExpirationReminderModalComponent} from './expiration-reminder-modal.component';
import {QueryCorporateDetailsComponent} from './query-corporate-details.component';

@NgModule({
    imports: [
        AvengerSharedModule,
    ],
    declarations: [
        IndexComponent,
        PromotionInformationModalComponent,
        SupplierExpirationReminderModalComponentComponent,
        ExpirationReminderModalComponent,
        QueryCorporateDetailsComponent
    ],
    exports: [
        IndexComponent,
        QueryCorporateDetailsComponent
    ],
})
export class FactoringBusinessModule {
}
