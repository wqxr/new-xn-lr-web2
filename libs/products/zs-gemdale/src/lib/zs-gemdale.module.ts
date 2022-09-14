import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { DynamicFormModule } from 'libs/shared/src/lib/common/dynamic-form/dynamic-form.module';
import { DragonVankeShareModule } from 'libs/shared/src/lib/public/dragon-vanke/share.module';
import { PublicModule } from 'libs/shared/src/lib/public/public.module';
import { SortablejsModule } from 'ngx-sortablejs';
import { ZsGemdaleRoutingModule } from './zs-gemdale-routing.component';
import { ZsGemdaleComponent } from './zs-gemdale.component';
import { ZsGemdaleDatalockingComponent } from './pages/zs-gemdale-data-docking/zs-gemdale-data-docking.component';
import { ZsGemdaleShareModule } from './share/share.module';
import { MachineListComponent } from './pages/machine-list/machine-list.component'
import { EstateZsGemdaleComponent } from './pages/estate-zs-gemdale/zs-gemdale.component'
import { ZsGemdaleTransferContractManagerComponent } from './pages/contract-template/contract-template.component'
import { BusinessMatchmakerListComponent } from './pages/business-matchmaker-manager/business-matchmaker-list.component'
import { ZsGemdaleHomeCommListComponent } from './pages/zs-gemdale/home-comm-list.component'
import { ZsGemdaleAvengerListComponent } from './pages/approval-list/avenger-list.component'
import { ZsGemdaleEnterpoolComponent } from './pages/assets-management/enter-capital-tool/enter-capital-pool-confirmation.component'
import { ZsGemdaleSecondTransferContractManagerComponent } from './pages/assets-management/contract-template/contract-template.component'
import { ZsGemdaleProjectmanageComponent } from './pages/assets-management/zs-gemdale-project-manager/zs-gemdale-project-management.component'
import { ZsGemdaleProjectmanagePlanComponent } from './pages/assets-management/zs-gemdale-project-manager/zs-gemdale-project-plan-list/zs-gemdale-project-plan-list.component'
import { ZsGemdaleCapitalpoolComponent } from './pages/assets-management/zs-gemdale-project-manager/zs-gemdale-capital-pool/zs-gemdale-capital-pool.component'
import { ZsGemdaleCapitalProductInfoComponent } from './pages/assets-management/zs-gemdale-project-manager/capital-product-info/capital-product-info.component'
import { CapitalDataAnalyseComponent } from './pages/assets-management/zs-gemdale-project-manager/capital-data-analyse/capital-data-analyse.component'
import { CapitalSampleComponent } from './pages/assets-management/zs-gemdale-project-manager/capital-sample/capital-sample.component'
import { ZsGemdaleNoticeManageComponent } from './pages/assets-management/zs-gemdale-project-manager/zs-gemdale-notice-manage/zs-gemdale-notice-manage-list.component'
import { ZsGemdaleRecordComponent } from './pages/zs-gemdale-record/zs-gemdale-record.component'
import { ComfirmInformationIndexComponent } from './pages/gemdale-mode/confirm-inforamtion-index.component'
import { ComfirmationSignComponent } from './pages/gemdale-mode/confirmation-sign-component'
import { ZsGemdaleRepaymentComponent } from './pages/repayment/zs-gemdale-repayment.component'
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
  ZsGemdaleComponent,
  ZsGemdaleDatalockingComponent,
  MachineListComponent,
  EstateZsGemdaleComponent,
  ZsGemdaleTransferContractManagerComponent,
  BusinessMatchmakerListComponent,
  ZsGemdaleHomeCommListComponent,
  ZsGemdaleAvengerListComponent,
  ZsGemdaleEnterpoolComponent,
  ZsGemdaleSecondTransferContractManagerComponent,
  ZsGemdaleProjectmanageComponent,
  ZsGemdaleProjectmanagePlanComponent,
  ZsGemdaleCapitalpoolComponent,
  ZsGemdaleCapitalProductInfoComponent,
  CapitalDataAnalyseComponent,
  CapitalSampleComponent,
  ZsGemdaleNoticeManageComponent,
  ZsGemdaleRecordComponent,
  ComfirmInformationIndexComponent,
  ComfirmationSignComponent,
  ZsGemdaleRepaymentComponent,
  BatchModifyComponent,
  RecepitListComponent
]

@NgModule({
  declarations: [...COMPONENTS],
  imports: [
    CommonModule,
    DynamicFormModule,
    PublicModule,
    ZsGemdaleShareModule,
    ZsGemdaleRoutingModule,
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
export class ZsGemdaleModule { }
