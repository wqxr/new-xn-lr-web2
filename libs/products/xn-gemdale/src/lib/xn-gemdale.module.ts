import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { DynamicFormModule } from 'libs/shared/src/lib/common/dynamic-form/dynamic-form.module';
import { DragonVankeShareModule } from 'libs/shared/src/lib/public/dragon-vanke/share.module';
import { PublicModule } from 'libs/shared/src/lib/public/public.module';
import { SortablejsModule } from 'ngx-sortablejs';
import { XnGemdaleRoutingModule } from './xn-gemdale-routing.component';
import { XnGemdaleComponent } from './xn-gemdale.component';
import { XnGemdaleDatalockingComponent } from './pages/xn-gemdale-data-docking/xn-gemdale-data-docking.component';
import { XnGemdaleShareModule } from './share/share.module';
import { MachineListComponent } from './pages/machine-list/machine-list.component'
import { EstateXnGemdaleComponent } from './pages/estate-xn-gemdale/xn-gemdale.component'
import { XnGemdaleTransferContractManagerComponent } from './pages/contract-template/contract-template.component'
import { BusinessMatchmakerListComponent } from './pages/business-matchmaker-manager/business-matchmaker-list.component'
import { XnGemdaleHomeCommListComponent } from './pages/xn-gemdale/home-comm-list.component'
import { XnGemdaleAvengerListComponent } from './pages/approval-list/avenger-list.component'
import { XnGemdaleEnterpoolComponent } from './pages/assets-management/enter-capital-tool/enter-capital-pool-confirmation.component'
import { XnGemdaleSecondTransferContractManagerComponent } from './pages/assets-management/contract-template/contract-template.component'
import { XnGemdaleProjectmanageComponent } from './pages/assets-management/xn-gemdale-project-manager/xn-gemdale-project-management.component'
import { XnGemdaleProjectmanagePlanComponent } from './pages/assets-management/xn-gemdale-project-manager/xn-gemdale-project-plan-list/xn-gemdale-project-plan-list.component'
import { XnGemdaleCapitalpoolComponent } from './pages/assets-management/xn-gemdale-project-manager/xn-gemdale-capital-pool/xn-gemdale-capital-pool.component'
import { XnGemdaleCapitalProductInfoComponent } from './pages/assets-management/xn-gemdale-project-manager/capital-product-info/capital-product-info.component'
import { CapitalDataAnalyseComponent } from './pages/assets-management/xn-gemdale-project-manager/capital-data-analyse/capital-data-analyse.component'
import { CapitalSampleComponent } from './pages/assets-management/xn-gemdale-project-manager/capital-sample/capital-sample.component'
import { XnGemdaleNoticeManageComponent } from './pages/assets-management/xn-gemdale-project-manager/xn-gemdale-notice-manage/xn-gemdale-notice-manage-list.component'
import { XnGemdaleRecordComponent } from './pages/xn-gemdale-record/xn-gemdale-record.component'
import { ComfirmInformationIndexComponent } from './pages/gemdale-mode/confirm-inforamtion-index.component'
import { ComfirmationSignComponent } from './pages/gemdale-mode/confirmation-sign-component'
import { XnGemdaleRepaymentComponent } from './pages/repayment/xn-gemdale-repayment.component'
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
  XnGemdaleComponent,
  XnGemdaleDatalockingComponent,
  MachineListComponent,
  EstateXnGemdaleComponent,
  XnGemdaleTransferContractManagerComponent,
  BusinessMatchmakerListComponent,
  XnGemdaleHomeCommListComponent,
  XnGemdaleAvengerListComponent,
  XnGemdaleEnterpoolComponent,
  XnGemdaleSecondTransferContractManagerComponent,
  XnGemdaleProjectmanageComponent,
  XnGemdaleProjectmanagePlanComponent,
  XnGemdaleCapitalpoolComponent,
  XnGemdaleCapitalProductInfoComponent,
  CapitalDataAnalyseComponent,
  CapitalSampleComponent,
  XnGemdaleNoticeManageComponent,
  XnGemdaleRecordComponent,
  ComfirmInformationIndexComponent,
  ComfirmationSignComponent,
  XnGemdaleRepaymentComponent,
  BatchModifyComponent,
  RecepitListComponent
]

@NgModule({
  declarations: [...COMPONENTS],
  imports: [
    CommonModule,
    DynamicFormModule,
    PublicModule,
    XnGemdaleShareModule,
    XnGemdaleRoutingModule,
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
export class XnGemdaleModule { }
