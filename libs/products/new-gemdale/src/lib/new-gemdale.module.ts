import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { DynamicFormModule } from 'libs/shared/src/lib/common/dynamic-form/dynamic-form.module';
import { DragonVankeShareModule } from 'libs/shared/src/lib/public/dragon-vanke/share.module';
import { PublicModule } from 'libs/shared/src/lib/public/public.module';
import { SortablejsModule } from 'ngx-sortablejs';
import { NewGemdaleRoutingModule } from './new-gemdale-routing.component';
import { NewGemdaleComponent } from './new-gemdale.component';
import { NewGemdaleDatalockingComponent } from './pages/new-gemdale-data-docking/new-gemdale-data-docking.component';
import { NewGemdaleShareModule } from './share/share.module';
import { MachineListComponent } from './pages/machine-list/machine-list.component'
import { EstateNewGemdaleComponent } from './pages/estate-new-gemdale/new-gemdale.component'
import { NewGemdaleTransferContractManagerComponent } from './pages/contract-template/contract-template.component'
import { BusinessMatchmakerListComponent } from './pages/business-matchmaker-manager/business-matchmaker-list.component'
import { NewGemdaleHomeCommListComponent } from './pages/new-gemdale/home-comm-list.component'
import { NewGemdaleAvengerListComponent } from './pages/approval-list/avenger-list.component'
import { NewGemdaleEnterpoolComponent } from './pages/assets-management/enter-capital-tool/enter-capital-pool-confirmation.component'
import { NewGemdaleSecondTransferContractManagerComponent } from './pages/assets-management/contract-template/contract-template.component'
import { NewGemdaleProjectmanageComponent } from './pages/assets-management/new-gemdale-project-manager/new-gemdale-project-management.component'
import { NewGemdaleProjectmanagePlanComponent } from './pages/assets-management/new-gemdale-project-manager/new-gemdale-project-plan-list/new-gemdale-project-plan-list.component'
import { NewGemdaleCapitalpoolComponent } from './pages/assets-management/new-gemdale-project-manager/new-gemdale-capital-pool/new-gemdale-capital-pool.component'
import { NewGemdaleCapitalProductInfoComponent } from './pages/assets-management/new-gemdale-project-manager/capital-product-info/capital-product-info.component'
import { CapitalDataAnalyseComponent } from './pages/assets-management/new-gemdale-project-manager/capital-data-analyse/capital-data-analyse.component'
import { CapitalSampleComponent } from './pages/assets-management/new-gemdale-project-manager/capital-sample/capital-sample.component'
import { NewGemdaleNoticeManageComponent } from './pages/assets-management/new-gemdale-project-manager/new-gemdale-notice-manage/new-gemdale-notice-manage-list.component'
import { NewGemdaleRecordComponent } from './pages/new-gemdale-record/new-gemdale-record.component'
import { GemdaleCapitalPoolIndexComponent } from './pages/capital-pool/capital-pool-index.component'
import { GemdaleCapitalPoolCommListComponent } from './pages/trading-list/capital-pool-comm-list.component'
import { ComfirmInformationIndexComponent } from './pages/gemdale-mode/confirm-inforamtion-index.component'
import { ComfirmationSignComponent } from './pages/gemdale-mode/confirmation-sign-component'
import { NewGemdaleRepaymentComponent } from './pages/repayment/new-gemdale-repayment.component'
import { BatchModifyComponent } from './pages/batch-modify/batch-modify.component'
import { RecepitListComponent } from './pages/gemdale-mode/receiptList.component'
import { NgZorroAntDModule } from './ng-zorro-antd.module';
import { XnFormlyModule } from '@lr/ngx-formly';
import { XnTableModule } from '@lr/ngx-table';
import { XnSharedModule } from '@lr/ngx-shared';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { IconDefinition } from '@ant-design/icons-angular';
import * as AllIcons from '@ant-design/icons-angular/icons';
import { XnACLModule } from '@lr/ngx-acl';

const antDesignIcons = AllIcons as {
  [key: string]: IconDefinition;
};
const ICONS = Object.keys(antDesignIcons).map((key) => antDesignIcons[key]);

const COMPONENTS = [
  NewGemdaleComponent,
  NewGemdaleDatalockingComponent,
  MachineListComponent,
  EstateNewGemdaleComponent,
  NewGemdaleTransferContractManagerComponent,
  BusinessMatchmakerListComponent,
  NewGemdaleHomeCommListComponent,
  NewGemdaleAvengerListComponent,
  NewGemdaleEnterpoolComponent,
  NewGemdaleSecondTransferContractManagerComponent,
  NewGemdaleProjectmanageComponent,
  NewGemdaleProjectmanagePlanComponent,
  NewGemdaleCapitalpoolComponent,
  NewGemdaleCapitalProductInfoComponent,
  CapitalDataAnalyseComponent,
  CapitalSampleComponent,
  NewGemdaleNoticeManageComponent,
  NewGemdaleRecordComponent,
  GemdaleCapitalPoolIndexComponent,
  GemdaleCapitalPoolCommListComponent,
  ComfirmInformationIndexComponent,
  ComfirmationSignComponent,
  NewGemdaleRepaymentComponent,
  BatchModifyComponent,
  RecepitListComponent
]

@NgModule({
  declarations: [...COMPONENTS],
  imports: [
    CommonModule,
    DynamicFormModule,
    PublicModule,
    NewGemdaleShareModule,
    NewGemdaleRoutingModule,
    SortablejsModule,
    DragonVankeShareModule,
    NgZorroAntDModule,
    NzIconModule.forChild(ICONS),
    XnACLModule,
    XnFormlyModule.forRoot(),
    XnTableModule,
    XnSharedModule,
  ],
  exports: [...COMPONENTS]
})
export class NewGemdaleModule { }
