import { NgModule } from '@angular/core';
import { PsLoganComponent } from './ps-logan.component';
import { CommonModule } from '@angular/common';
import { PublicModule } from 'libs/shared/src/lib/public/public.module';
import { DragonVankeShareModule } from 'libs/shared/src/lib/public/dragon-vanke/share.module';
import { RecordDragonComponent } from './pages/record-dragon/record-dragon.component';
import { DynamicFormModule } from 'libs/shared/src/lib/common/dynamic-form/dynamic-form.module';
import { ReceiptListComponent } from './pages/receipt-list/receipt-list.component';
import { DragonProjectInfoComponent } from './pages/project-company-supplierInfo/additional-materials.component';
import { DragonUploadPaymentsComponent } from './pages/upload-payment-confirmation/upload-payment-confirmation.component';
import { DragonFactorSignComponent } from './pages/factor-sign-contract/factor-sign-contract.component';
import { SortablejsModule } from 'ngx-sortablejs';
import { DragonProjectmanageComponent } from './pages/assets-management/dragon-project-manager/dragon-project-management.component';
import { DragonProjectmanagePlanComponent } from './pages/assets-management/dragon-project-manager/dragon-project-plan-list/dragon-project-plan-list.component';
import { DragonCapitalpoolComponent } from './pages/assets-management/dragon-project-manager/dragon-capital-pool/dragon-capital-pool.component';
import { DragonNoticeManageComponent } from './pages/assets-management/dragon-project-manager/dragon-notice-manage/dragon-notice-manage-list.component';
import { CapitalSampleComponent } from './pages/assets-management/dragon-project-manager/capital-sample/capital-sample.component';
import { CapitalDataAnalyseComponent } from './pages/assets-management/dragon-project-manager/capital-data-analyse/capital-data-analyse.component';
import { DragonCapitalProductInfoComponent } from './pages/assets-management/dragon-project-manager/capital-product-info/capital-product-info.component';
import { RouterModule } from '@angular/router';
import { BatchModifyComponent } from './pages/capital-pool/capital-pool-comm-list/batch-modify.component';
import { DragonEnterpoolComponent } from './pages/assets-management/enter-capital-tool/enter-capital-pool-confirmation.component';
import { DragonAvengerListComponent } from './pages/approval-list/avenger-list.component';
import { DragonMachineListComponent } from './pages/machine-list/machine-list.component';
import { DragonTransferContractManagerComponent } from './pages/assets-management/contract-template/contract-template.component';
import { EstateDragonComponent } from './pages/estate-dragon/dragon.component';
import { PsLoganEditComponent } from './shared/component/record/edit.component';
import { PsLoganFlowDetailRecordComponent } from './shared/component/record/flow-detail-record.component';
import { PsLoganFlowDetailComponent } from './shared/component/record/flow-detail.component';
import { PsLoganMemoComponent } from './shared/component/record/memo.component';
import { PsLoganNewComponent } from './shared/component/record/new.component';
import { PsLoganVankebusinessComponent } from './shared/component/record/vanke-business-related.component';
import { PsLoganVankeRelatedFileComponent } from './shared/component/record/vanke-related-file.component';
import { PsLoganViewComponent } from './shared/component/record/view.component';
import { PsLoganView2Component } from './shared/component/record/view2.component';
import { PsLoganRecordComponent } from './shared/component/record/record.component';
import { PsLoganCommListComponent } from './pages/ps-logan/home-comm-list.component';
import { PsLoganRoutingModule } from './ps-logan-routing.module';
import { SignFilesComponent } from './pages/supplier-sign-files/signFiles.component';
const COMPONENTS = [
  EstateDragonComponent,
  RecordDragonComponent,
  ReceiptListComponent,
  DragonProjectInfoComponent,
  BatchModifyComponent,
  DragonUploadPaymentsComponent,
  DragonFactorSignComponent,
  DragonEnterpoolComponent,
  DragonProjectmanageComponent,
  DragonProjectmanagePlanComponent,
  DragonCapitalpoolComponent,
  DragonNoticeManageComponent,
  CapitalSampleComponent,
  CapitalDataAnalyseComponent,
  DragonCapitalProductInfoComponent,
  DragonAvengerListComponent,
  DragonMachineListComponent,
  DragonTransferContractManagerComponent,
  PsLoganCommListComponent,
  SignFilesComponent
];
const RECORDCOMPONNET = [
  PsLoganEditComponent,
  PsLoganFlowDetailRecordComponent,
  PsLoganFlowDetailComponent,
  PsLoganMemoComponent,
  PsLoganNewComponent,
  PsLoganRecordComponent,
  PsLoganVankebusinessComponent,
  PsLoganVankeRelatedFileComponent,
  PsLoganViewComponent,
  PsLoganView2Component
];


@NgModule({
  imports: [
    PsLoganRoutingModule,
    CommonModule,
    PublicModule,
    RouterModule,
    DynamicFormModule,
    SortablejsModule,
    DragonVankeShareModule
  ],
  exports: [PsLoganComponent],
  declarations: [
    ...COMPONENTS,
    ...RECORDCOMPONNET,
    PsLoganComponent
  ]
})
export class PsLoganModule { }
