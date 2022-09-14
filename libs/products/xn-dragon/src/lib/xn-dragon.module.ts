import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PublicModule } from 'libs/shared/src/lib/public/public.module';
import { DragonVankeShareModule } from 'libs/shared/src/lib/public/dragon-vanke/share.module';
import { RecordDragonComponent } from './pages/record-dragon/record-dragon.component';
import { DynamicFormModule } from 'libs/shared/src/lib/common/dynamic-form/dynamic-form.module';
import { ReceiptListComponent } from './pages/receipt-list/receipt-list.component';
import { DragonProjectInfoComponent } from './pages/project-company-supplierInfo/additional-materials.component';
import { DragonTransactionsListComponent } from './pages/common/dragon-transactions-list.component';
import { DragonUploadPaymentsComponent } from './pages/upload-payment-confirmation/upload-payment-confirmation.component';
import { DragonInvoiceManagementComponent } from './pages/invoice-management/invoice-management.component';
import { DragonFactorSignComponent } from './pages/factor-sign-contract/factor-sign-contract.component';
import { DragonIntermediaryManagementComponent } from './pages/intermediary-management/intermediary-management-list.componment';
import { DragonIntermediaryUserManagementComponent } from './pages/intermediary-management/intermediary-user-management/intermediary-user-management-list.componment';
import { SortablejsModule } from 'ngx-sortablejs';
import { DragonProjectmanageComponent } from './pages/assets-management/dragon-project-manager/dragon-project-management.component';
import { DragonProjectmanagePlanComponent } from './pages/assets-management/dragon-project-manager/dragon-project-plan-list/dragon-project-plan-list.component';
import { DragonCapitalpoolComponent } from './pages/assets-management/dragon-project-manager/dragon-capital-pool/dragon-capital-pool.component';
import { CashManageListComponent } from './pages/cash-manage/cash-manage-list.component';
import { DragonNoticeManageComponent } from './pages/assets-management/dragon-project-manager/dragon-notice-manage/dragon-notice-manage-list.component';
import { CapitalSampleComponent } from './pages/assets-management/dragon-project-manager/capital-sample/capital-sample.component';
import { CapitalDataAnalyseComponent } from './pages/assets-management/dragon-project-manager/capital-data-analyse/capital-data-analyse.component';
import { DragonCapitalProductInfoComponent } from './pages/assets-management/dragon-project-manager/capital-product-info/capital-product-info.component';
import { RouterModule } from '@angular/router';
import { BatchModifyComponent } from './pages/capital-pool/capital-pool-comm-list/batch-modify.component';
import { DragonEnterpoolComponent } from './pages/assets-management/enter-capital-tool/enter-capital-pool-confirmation.component';
import { DragonAvengerListComponent } from './pages/approval-list/avenger-list.component';
import { AvengerSharedModule } from 'libs/products/avenger/src/lib/shared/shared.module';
import { DragonMachineListComponent } from './pages/machine-list/machine-list.component';
import { DragonTransferContractManagerComponent } from './pages/assets-management/contract-template/contract-template.component';
import { EstateDragonComponent } from './pages/estate-dragon/dragon.component';
import { XNDragonRoutingModule } from './xn-dragon-routing.module';
import { XNDragonEditComponent } from './shared/component/record/edit.component';
import { XNFlowDetailRecordComponent } from './shared/component/record/flow-detail-record.component';
import { XNDragonFlowDetailComponent } from './shared/component/record/flow-detail.component';
import { XNDragonMemoComponent } from './shared/component/record/memo.component';
import { XNNewComponent } from './shared/component/record/new.component';
import { XNVankebusinessComponent } from './shared/component/record/vanke-business-related.component';
import { XNVankeRelatedFileComponent } from './shared/component/record/vanke-related-file.component';
import { XNDragonViewComponent } from './shared/component/record/view.component';
import { XNDragonView2Component } from './shared/component/record/view2.component';
import { XNDragonRecordComponent } from './shared/component/record/record.component';
import {XnDragonCommListComponent} from './pages/xn-dragon/home-comm-list.component';
const COMPONENTS = [
  EstateDragonComponent,
  RecordDragonComponent,
  ReceiptListComponent,
  DragonProjectInfoComponent,
  DragonTransactionsListComponent,
  DragonIntermediaryManagementComponent,
  DragonIntermediaryUserManagementComponent,
  BatchModifyComponent,
  DragonUploadPaymentsComponent,
  DragonInvoiceManagementComponent,
  DragonFactorSignComponent,
  DragonEnterpoolComponent,
  DragonProjectmanageComponent,
  DragonProjectmanagePlanComponent,
  DragonCapitalpoolComponent,
  CashManageListComponent,
  DragonNoticeManageComponent,
  CapitalSampleComponent,
  CapitalDataAnalyseComponent,
  DragonCapitalProductInfoComponent,
  DragonAvengerListComponent,
  DragonMachineListComponent,
  DragonTransferContractManagerComponent,
  XnDragonCommListComponent,
];
const RECORDCOMPONNET = [
  XNDragonEditComponent,
  XNFlowDetailRecordComponent,
  XNDragonFlowDetailComponent,
  XNDragonMemoComponent,
  XNNewComponent,
  XNDragonRecordComponent,
  XNVankebusinessComponent,
  XNVankeRelatedFileComponent,
  XNDragonViewComponent,
  XNDragonView2Component
];

@NgModule({
  imports: [
    XNDragonRoutingModule,
    CommonModule,
    PublicModule,
    RouterModule,
    DynamicFormModule,
    SortablejsModule,
    DragonVankeShareModule
  ],
  exports: [],
  declarations: [
    ...COMPONENTS,
    ...RECORDCOMPONNET,
  ]
})
export class XnDragonModule { }
