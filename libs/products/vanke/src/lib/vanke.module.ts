import { NgModule } from '@angular/core';
import { VankeComponent } from './vanke.component';
import { CommonModule } from '@angular/common';
import { DynamicFormModule } from 'libs/shared/src/lib/common/dynamic-form/dynamic-form.module';
import { PublicModule } from 'libs/shared/src/lib/public/public.module';
import { NewVankeRoutingModule } from './vanke-routing.component';
import { SortablejsModule } from 'ngx-sortablejs';
import { DragonVankeShareModule } from 'libs/shared/src/lib/public/dragon-vanke/share.module';
import { VankeEnterpoolComponent } from './pages/assets-management/enter-capital-tool/enter-capital-pool-confirmation.component';
import { TransferContractManagerComponent } from './pages/assets-management/contract-template/contract-template.component';
import { RecordVankeComponent } from './pages/record-vanke/record-vanke.component';
import { VankeAvengerListComponent } from './pages/approval-list/avenger-list.component';
import { VankeProjectmanageComponent } from './pages/assets-management/vanke-project-manager/vanke-project-management.component';
import { VankeProjectmanagePlanComponent } from './pages/assets-management/vanke-project-manager/vanke-project-plan-list/vanke-project-plan-list.component';
import { VankeCapitalpoolComponent } from './pages/assets-management/vanke-project-manager/vanke-capital-pool/vanke-capital-pool.component';
import { VankeNoticeManageComponent } from './pages/assets-management/vanke-project-manager/vanke-notice-manage/vanke-notice-manage-list.component';
import { CapitalSampleComponent } from './pages/assets-management/vanke-project-manager/capital-sample/capital-sample.component';
import { CapitalDataAnalyseComponent } from './pages/assets-management/vanke-project-manager/capital-data-analyse/capital-data-analyse.component';
import { DemoListComponent } from './pages/machine-list/machine-list.component';
import { VankeUploadPaymentsComponent } from './pages/upload-payment-confirmation/upload-payment-confirmation.component'
import { AvengerSharedModule } from 'libs/products/avenger/src/lib/shared/shared.module';

import { EstateVankeComponent } from './pages/estate-vanke/vanke.component';
import { VankeDatalockingComponent } from './pages/vanke-data-docking/vanke-data-docking.component';
import { BusinessMatchmakerListComponent } from './pages/business-matchmaker-manager/business-matchmaker-list.component';
import { DragonDownloadPaymentsComponent } from './pages/download-payment-confirmation/download-payment-confirmation.component';
import { VankeCapitalProductInfoComponent } from './pages/assets-management/vanke-project-manager/capital-product-info/capital-product-info.component';
import { VankeCapitalPoolCommListComponent } from './pages/trading-list/capital-pool-comm-list.component'
import { CapitalPoolUnhandledListComponent } from './pages/capital-pool-unhandled-list/capital-pool-unhandled-list.component'
import { NgZorroAntDModule } from './ng-zorro-antd.module';
import { VankeShareModule } from './shared/share.module';
import { VankeHomeCommListComponent } from './pages/vanke-home-comm-list/home-comm-list.component';

const COMPONENTS = [
  VankeComponent,
  VankeEnterpoolComponent,
  TransferContractManagerComponent,
  RecordVankeComponent,
  VankeAvengerListComponent,
  VankeProjectmanageComponent,
  VankeProjectmanagePlanComponent,
  VankeCapitalpoolComponent,
  CapitalSampleComponent,
  CapitalDataAnalyseComponent,
  DemoListComponent,
  VankeUploadPaymentsComponent,
  EstateVankeComponent,
  VankeDatalockingComponent,
  BusinessMatchmakerListComponent,
  DragonDownloadPaymentsComponent,
  VankeNoticeManageComponent,
  VankeCapitalProductInfoComponent,
  VankeCapitalPoolCommListComponent,
  CapitalPoolUnhandledListComponent,
  VankeHomeCommListComponent
];
const SERVICES = [
];

@NgModule({
  declarations: [...COMPONENTS],
  imports: [
    CommonModule,
    DynamicFormModule,
    PublicModule,
    NewVankeRoutingModule,
    SortablejsModule,
    DragonVankeShareModule,
    AvengerSharedModule,
    NgZorroAntDModule,
    VankeShareModule
  ],
  exports: [...COMPONENTS]
})
export class VankeModule { }
