/*
 * Copyright(c) 2017-2019, 深圳市链融科技股份有限公司
 * Beijing Xiwei Technology Co., Ltd.
 * All rights reserved.
 *
 * @file：CreditReportUploadModule
 * @summary：征信报告上传
 * @version: 1.0
 * **********************************************************************
 * revision             author            reason             date
 * 1.0                 zhyuanan          增加功能1         2019-05-18
 * **********************************************************************
 */

import {NgModule} from '@angular/core';
import {AvengerSharedModule} from '../shared/shared.module';

const COMPONENTS = [];

@NgModule({
    imports: [
        AvengerSharedModule
    ],
    declarations: [
        ...COMPONENTS
    ]
})
export class CreditReportUploadModule {
}
