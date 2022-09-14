/*
 * Copyright(c) 2017-2019, 深圳市链融科技股份有限公司
 * Beijing Xiwei Technology Co., Ltd.
 * All rights reserved.
 *
 * @file：AvengerListModule
 * @summary：交易列表 【采购融资，地产abs】
 * @version: 1.0
 * **********************************************************************
 * revision             author            reason             date
 * 1.0                 zhyuanan          增加功能1         2019-05-18
 * **********************************************************************
 */

import {NgModule} from '@angular/core';
import {AvengerListRoutingModule} from './avenger-list-routing.module';
import {AvengerSharedModule} from '../shared/shared.module';
import {InterestModalComponent} from './interest-modal.component';
import { AvengerCommonModule } from '../common/avenger-common.module';

@NgModule({
    imports: [
        AvengerSharedModule,
        AvengerListRoutingModule,
        AvengerCommonModule
    ],
    declarations: [
        InterestModalComponent
    ]
})
export class AvengerListModule {
}
