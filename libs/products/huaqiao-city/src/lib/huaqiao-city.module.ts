import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HuaQiaoCityRoutingModule } from './huaqiaocity-routing.component';
import { SortablejsModule } from 'ngx-sortablejs';
import { TransferContractManagerComponent } from './pages/assets-management/contract-template/contract-template.component';
import { RecordHuaQiaoCityComponent } from './pages/record-huaqiao-city/record-huaqiao-city.component';
import { HuaQiaoCityAvengerListComponent } from './pages/approval-list/avenger-list.component';
import { HuaQiaoCityProjectmanageComponent } from './pages/assets-management/huaqiao-city-project-manager/huaqiao-city-project-management.component';
import { HuaQiaoCityProjectmanagePlanComponent } from './pages/assets-management/huaqiao-city-project-manager/huaqiao-city-project-plan-list/huaqiao-city-project-plan-list.component';
import { HuaQiaoCityCapitalpoolComponent } from './pages/assets-management/huaqiao-city-project-manager/huaqiao-city-capital-pool/huaqiao-city-capital-pool.component';
import { HuaQiaoCityNoticeManageComponent } from './pages/assets-management/huaqiao-city-project-manager/huaqiao-city-notice-manage/huaqiao-city-notice-manage-list.component';
import { CapitalSampleComponent } from './pages/assets-management/huaqiao-city-project-manager/capital-sample/capital-sample.component';
import { CapitalDataAnalyseComponent } from './pages/assets-management/huaqiao-city-project-manager/capital-data-analyse/capital-data-analyse.component';
import { DemoListComponent } from './pages/machine-list/machine-list.component';
import { HuaQiaoCityDatalockingComponent } from './pages/huaqiao-city-data-docking/huaqiao-city-data-docking.component';
import { BusinessMatchmakerListComponent } from './pages/business-matchmaker-manager/business-matchmaker-list.component';
import { DragonDownloadPaymentsComponent } from './pages/download-payment-confirmation/download-payment-confirmation.component';
import { DragonVankeShareModule } from 'libs/shared/src/lib/public/dragon-vanke/share.module';
import { PublicModule } from 'libs/shared/src/lib/public/public.module';
import { DynamicFormModule } from 'libs/shared/src/lib/common/dynamic-form/dynamic-form.module';
import { HuaQiaoCityEnterpoolComponent } from './pages/assets-management/enter-capital-tool/enter-capital-pool-confirmation.component';
import { HuaQiaoCityUploadPaymentsComponent } from './pages/upload-payment-confirmation/upload-payment-confirmation.component';
import { HuaQiaoCityCapitalProductInfoComponent } from './pages/assets-management/huaqiao-city-project-manager/capital-product-info/capital-product-info.component';
import { HuaQiaoCityCapitalPoolCommListComponent } from './pages/trading-list/capital-pool-comm-list.component';
import { RouterModule } from '@angular/router';
import { HuaQiaoCityView2Component } from './shared/component/record/view2.component';
import { HuaQiaoCityViewComponent } from './shared/component/record/view.component';
import { HuaQiaoCityRelatedFileComponent } from './shared/component/record/vanke-related-file.component';
import { HuaQiaoCitybusinessComponent } from './shared/component/record/vanke-business-related.component';
import { HuaQiaoCityRecordComponent } from './shared/component/record/record.component';
import { HuaQiaoCityNewComponent } from './shared/component/record/new.component';
import { HuaQiaoCityMemoComponent } from './shared/component/record/memo.component';
import { HuaQiaoCityFlowDetailComponent } from './shared/component/record/flow-detail.component';
import { HuaQiaoCityFlowDetailRecordComponent } from './shared/component/record/flow-detail-record.component';
import { HuaQiaoCityEditComponent } from './shared/component/record/edit.component';
import {HuaQiaoCityCommListComponent} from './pages/huaqiao-city/home-comm-list.component';
import { EstateHuaQiaoCityComponent } from './pages/estate-huaqiao-city/huaqiao-city.component';
import { HuaqiaoCityTransferContractManagerComponent } from './pages/contract-template/contract-template.component';
import { BatchModifyComponent } from './pages/machine-list/batch-modify.component';
const COMPONENTS = [
  HuaQiaoCityEnterpoolComponent,
  TransferContractManagerComponent,
  RecordHuaQiaoCityComponent,
  HuaQiaoCityAvengerListComponent,
  HuaQiaoCityProjectmanageComponent,
  HuaQiaoCityProjectmanagePlanComponent,
  HuaQiaoCityCapitalpoolComponent,
  CapitalSampleComponent,
  CapitalDataAnalyseComponent,
  DemoListComponent,
  HuaQiaoCityUploadPaymentsComponent,
  RecordHuaQiaoCityComponent,
  HuaQiaoCityDatalockingComponent,
  BusinessMatchmakerListComponent,
  DragonDownloadPaymentsComponent,
  HuaQiaoCityNoticeManageComponent,
  HuaQiaoCityCapitalProductInfoComponent,
  HuaQiaoCityCapitalPoolCommListComponent,
  HuaQiaoCityCommListComponent,
  EstateHuaQiaoCityComponent,
  HuaqiaoCityTransferContractManagerComponent,
  BatchModifyComponent,
];
const RecordComponent = [
  HuaQiaoCityEditComponent,
  HuaQiaoCityFlowDetailRecordComponent,
  HuaQiaoCityFlowDetailComponent,
  HuaQiaoCityMemoComponent,
  HuaQiaoCityNewComponent,
  HuaQiaoCityRecordComponent,
  HuaQiaoCitybusinessComponent,
  HuaQiaoCityRelatedFileComponent,
  HuaQiaoCityViewComponent,
  HuaQiaoCityView2Component,
]


@NgModule({
  declarations: [
    ...COMPONENTS,
    ...RecordComponent
  ],
  imports: [
    CommonModule,
    DynamicFormModule,
    PublicModule,
    RouterModule,
    HuaQiaoCityRoutingModule,
    SortablejsModule,
    DragonVankeShareModule,
  ],
  exports: []
})
export class HuaqiaoCityModule { }
