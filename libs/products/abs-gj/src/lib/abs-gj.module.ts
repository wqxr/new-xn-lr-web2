/*************************************************************************
 * Copyright (c) 2017 - 2021 深圳市链融科技股份有限公司
 * Shenzhen Lianrong Technology Co., Ltd.
 * All rights reserved.
 *
 * @file：libs\products\abs-gj\src\lib\abs-gj.module.ts
 * @summary：abs-gj.module.ts
 * @version: 1.0
 * *************************************************************************
 * revision             author            reason             date
 * 1.0                  DengPei           init               2021-11-22
 ***************************************************************************/
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { SearchFormModule } from '@lr/ngx-shared';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { SortablejsModule } from 'ngx-sortablejs';
import { PublicModule } from 'libs/shared/src/lib/public/public.module';
import { DragonVankeShareModule } from 'libs/shared/src/lib/public/dragon-vanke/share.module';
import { AbsGjRoutingModule } from './abs-gj-routing.module';
import { DynamicFormModule } from 'libs/shared/src/lib/common/dynamic-form/dynamic-form.module';
import { AvengerSharedModule } from 'libs/products/avenger/src/lib/shared/shared.module';
import { AbsGjComponentsModule } from './components/components.module';
import { GjServicesModule } from './services/services.module';

import { GjApprovalListComponent } from './pages/approval-list/list.component';
import { GjReceiptListComponent } from './pages/receipt-list/list.component';
import { GjRecordComponent } from './pages/record/record-gj.component';
import { GjHomeTaskComponent } from './pages/home-task/index.component';
import { GjProjectManageComponent } from './pages/assets-manage/project-manager/project-manage.component';
import {
  GjProjectCapitalPoolComponent
} from './pages/assets-manage/project-manager/capital-pool/capital-pool.component';
import { GjNoticeManageComponent } from './pages/assets-manage/project-manager/notice-manage/notice-manage.component';
import {
  GjCapitalSampleComponent
} from './pages/assets-manage/project-manager/capital-sample/capital-sample.component';
import {
  GjCapitalDataAnalyseComponent
} from './pages/assets-manage/project-manager/capital-data-analyse/capital-data-analyse.component';
import {
  GjProjectPlanComponent
} from './pages/assets-manage/project-manager/project-plan-list/project-plan-list.component';
import {
  GjEnterCapitalPoolComponent
} from './pages/assets-manage/enter-capital-tool/enter-capital-pool-confirmation.component';
import { GjContractManageComponent } from './pages/assets-manage/contract-template/contract-template.component';
import { GjMachineListComponent } from './pages/machine-list/machine-list.component';
import { GjCompanyAddInfoComponent } from './pages/company-add-info/company-add-info.component';
import { GjUploadPaymentBillComponent } from './pages/upload-payment-bill/upload-payment-bill.component';
import { GjBatchModifyComponent } from './pages/capital-pool/batch-modify/batch-modify.component';

import {
  InputDataContentConfig
} from '../../../../shared/src/lib/public/dragon-vanke/components/form/input/data-content.component';
import {
  GjInputDataContentConfig,
  GjShowDataContentConfig
} from './check-config/data-content.config';
import {
  ShowDataContentConfig
} from 'libs/shared/src/lib/public/dragon-vanke/components/form/show/data-content.component';
import { ChangeItemConfig } from './check-config/change-program.config';
import {
  ShowChangeProgramConfig
} from 'libs/products/machine-account/src/lib/share/components/form/show/chang-program.component';
import {
  InputChangeProgramConfig
} from 'libs/products/machine-account/src/lib/share/components/form/input/chang-program.component';
import {
  GjOnceContractManageComponent
} from './pages/assets-manage/once-contract-template/once-contract-template.component';
import { GjPushReceiptListComponent } from './pages/push-receipt-list/push-receipt-list.component';
import { XnTableModule } from '@lr/ngx-table';

const COMPONENTS = [
  GjHomeTaskComponent,
  GjRecordComponent,
  GjProjectManageComponent,
  GjApprovalListComponent,
  GjReceiptListComponent,
  GjProjectCapitalPoolComponent,
  GjNoticeManageComponent,
  GjCapitalSampleComponent,
  GjCapitalDataAnalyseComponent,
  GjMachineListComponent,
  GjContractManageComponent,
  GjOnceContractManageComponent,
  GjEnterCapitalPoolComponent,
  GjProjectPlanComponent,
  GjCompanyAddInfoComponent,
  GjUploadPaymentBillComponent,
  GjBatchModifyComponent,
  GjPushReceiptListComponent,
];

@NgModule({
  imports: [
    CommonModule,
    PublicModule,
    RouterModule,
    AbsGjRoutingModule,
    DynamicFormModule,
    SortablejsModule,
    DragonVankeShareModule,
    AvengerSharedModule,
    AbsGjComponentsModule,
    SearchFormModule,
    NzGridModule,
    NzButtonModule,
    NzIconModule,
    GjServicesModule,
    XnTableModule
  ],
  declarations: [...COMPONENTS],
  providers: [
    {provide: InputDataContentConfig, useValue: GjInputDataContentConfig},
    {provide: ShowDataContentConfig, useValue: GjShowDataContentConfig},
    {provide: ShowChangeProgramConfig, useValue: ChangeItemConfig},
    {provide: InputChangeProgramConfig, useValue: ChangeItemConfig},
  ]
})
export class AbsGjModule {}
