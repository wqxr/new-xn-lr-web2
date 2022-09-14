/*
 * Copyright(c) 2017-2019, 深圳市链融科技股份有限公司
 * Beijing Xiwei Technology Co., Ltd.
 * All rights reserved.
 *
 * @file：contract-input.component.ts
 * @summary：保后管理模块
 * @version: 1.0
 * **********************************************************************
 * revision             author            reason             date
 * 1.0                 zhyuanan          增加功能1         2019-05-05
 * **********************************************************************
 */

import {NgModule} from '@angular/core';
import {GuarantManagementRoutingModule} from './guarant-management.routing.module';
import { GuarantManagementTemplateComponent } from './guarant-management.template/guarant-management.template.component';
import { GuarantManagementReportTemplateComponent } from './guarant-management-report.template/guarant-management-report.template';
import { ReportDetailComponent } from './guarant-report-detail.template/report-detail.component';
import { CheckDetailComponent } from './guarant-check-detail.template/check-detail.component';
import { AvengerSharedModule } from '../shared/shared.module';

const COMPONENTS = [
    GuarantManagementTemplateComponent,
    GuarantManagementReportTemplateComponent,
    ReportDetailComponent,
    CheckDetailComponent

];

@NgModule({
    imports: [
        AvengerSharedModule,
        GuarantManagementRoutingModule
    ],
    declarations: [...COMPONENTS]
})
export class GuarantManagementModule {
}
