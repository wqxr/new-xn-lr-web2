import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { DynamicFormModule } from 'libs/shared/src/lib/common/dynamic-form/dynamic-form.module';
import { DragonVankeShareModule } from 'libs/shared/src/lib/public/dragon-vanke/share.module';
import { PublicModule } from 'libs/shared/src/lib/public/public.module';
import { SortablejsModule } from 'ngx-sortablejs';
import { AgileHzRoutingModule } from './agile-hz-routing.component';
import { AgileHzComponent } from './agile-hz.component';
import { ShareModule } from './share/share.module';
import { MachineListComponent } from './pages/machine-list/machine-list.component'
import { EstateAgileHzComponent } from './pages/estate-agile-hz/agile-hz.component'
import { TransferContractManagerComponent } from './pages/contract-template/contract-template.component'
import { HomeCommListComponent } from './pages/agile-hz/home-comm-list.component'
import { AvengerListComponent } from './pages/approval-list/avenger-list.component'
import { EnterpoolComponent } from './pages/assets-management/enter-capital-tool/enter-capital-pool-confirmation.component'
import { ProjectmanageComponent } from './pages/assets-management/agile-hz-project-manager/agile-hz-project-management.component'
import { ProjectmanagePlanComponent } from './pages/assets-management/agile-hz-project-manager/agile-hz-project-plan-list/agile-hz-project-plan-list.component'
import { CapitalpoolComponent } from './pages/assets-management/agile-hz-project-manager/agile-hz-capital-pool/agile-hz-capital-pool.component'
import { AgileHzCapitalProductInfoComponent } from './pages/assets-management/agile-hz-project-manager/capital-product-info/capital-product-info.component'
import { CapitalDataAnalyseComponent } from './pages/assets-management/agile-hz-project-manager/capital-data-analyse/capital-data-analyse.component'
import { CapitalSampleComponent } from './pages/assets-management/agile-hz-project-manager/capital-sample/capital-sample.component'
import { NoticeManageComponent } from './pages/assets-management/agile-hz-project-manager/agile-hz-notice-manage/agile-hz-notice-manage-list.component'
import { RecordComponent } from './pages/agile-hz-record/agile-hz-record.component'
import { BatchModifyComponent } from './pages/batch-modify/batch-modify.component'
import { RecepitListComponent } from './pages/agile-hz-mode/receiptList.component'
import { UploadPaymentsComponent } from './pages/upload-payment-confirmation/upload-payment-confirmation.component'


import { NgZorroAntDModule } from './ng-zorro-antd.module';
import { XnFormlyModule } from '@lr/ngx-formly';
import { XnTableModule } from '@lr/ngx-table';
import { XnSharedModule } from '@lr/ngx-shared';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { IconDefinition } from '@ant-design/icons-angular';
import * as AllIcons from '@ant-design/icons-angular/icons';
import { XnACLModule } from '@lr/ngx-acl';
import { AdditionalMaterialsComponent } from './pages/agile-hz-mode/additional-materials.component';

const antDesignIcons = AllIcons as {
  [key: string]: IconDefinition;
};
const ICONS = Object.keys(antDesignIcons).map((key) => antDesignIcons[key]);

const COMPONENTS = [
  AgileHzComponent,
  MachineListComponent,
  EstateAgileHzComponent,
  TransferContractManagerComponent,
  HomeCommListComponent,
  AvengerListComponent,
  EnterpoolComponent,
  ProjectmanageComponent,
  ProjectmanagePlanComponent,
  CapitalpoolComponent,
  AgileHzCapitalProductInfoComponent,
  CapitalDataAnalyseComponent,
  CapitalSampleComponent,
  NoticeManageComponent,
  RecordComponent,
  BatchModifyComponent,
  RecepitListComponent,
  UploadPaymentsComponent,
  AdditionalMaterialsComponent,
]

@NgModule({
  declarations: [...COMPONENTS],
  imports: [
    CommonModule,
    DynamicFormModule,
    PublicModule,
    ShareModule,
    AgileHzRoutingModule,
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
export class AgileHzModule { }
