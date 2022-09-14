import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { DynamicFormModule } from 'libs/shared/src/lib/common/dynamic-form/dynamic-form.module';
import { DragonVankeShareModule } from 'libs/shared/src/lib/public/dragon-vanke/share.module';
import { PublicModule } from 'libs/shared/src/lib/public/public.module';
import { SortablejsModule } from 'ngx-sortablejs';
import { AgileXingshunRoutingModule } from './agile-xingshun-routing.component';
import { AgileXingshunComponent } from './agile-xingshun.component';
import { AgileXingshunShareModule } from './share/share.module';
import { MachineListComponent } from './pages/machine-list/machine-list.component'
import { EstateAgileXingshunComponent } from './pages/estate-agile-xingshun/agile-xingshun.component'
import { AgileXingshunTransferContractManagerComponent } from './pages/contract-template/contract-template.component'
import { AgileXingshunHomeCommListComponent } from './pages/agile-xingshun/home-comm-list.component'
import { AgileXingshunAvengerListComponent } from './pages/approval-list/avenger-list.component'
import { AgileXingshunEnterpoolComponent } from './pages/assets-management/enter-capital-tool/enter-capital-pool-confirmation.component'
import { AgileXingshunProjectmanageComponent } from './pages/assets-management/agile-xingshun-project-manager/agile-xingshun-project-management.component'
import { AgileXingshunProjectmanagePlanComponent } from './pages/assets-management/agile-xingshun-project-manager/agile-xingshun-project-plan-list/agile-xingshun-project-plan-list.component'
import { AgileXingshunCapitalpoolComponent } from './pages/assets-management/agile-xingshun-project-manager/agile-xingshun-capital-pool/agile-xingshun-capital-pool.component'
import { AgileXingshunCapitalProductInfoComponent } from './pages/assets-management/agile-xingshun-project-manager/capital-product-info/capital-product-info.component'
import { CapitalDataAnalyseComponent } from './pages/assets-management/agile-xingshun-project-manager/capital-data-analyse/capital-data-analyse.component'
import { CapitalSampleComponent } from './pages/assets-management/agile-xingshun-project-manager/capital-sample/capital-sample.component'
import { AgileXingshunNoticeManageComponent } from './pages/assets-management/agile-xingshun-project-manager/agile-xingshun-notice-manage/agile-xingshun-notice-manage-list.component'
import { AgileXingshunRecordComponent } from './pages/agile-xingshun-record/agile-xingshun-record.component'
import { BatchModifyComponent } from './pages/batch-modify/batch-modify.component'
import { RecepitListComponent } from './pages/agile-xingshun-mode/receiptList.component'
import { AgileXingshunUploadPaymentsComponent } from './pages/upload-payment-confirmation/upload-payment-confirmation.component'


import { NgZorroAntDModule } from './ng-zorro-antd.module';
import { XnFormlyModule } from '@lr/ngx-formly';
import { XnTableModule } from '@lr/ngx-table';
import { XnSharedModule } from '@lr/ngx-shared';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { IconDefinition } from '@ant-design/icons-angular';
import * as AllIcons from '@ant-design/icons-angular/icons';
import { XnACLModule } from '@lr/ngx-acl';
import { AdditionalMaterialsComponent } from './pages/agile-xingshun-mode/additional-materials.component';
import { CapitalPoolIndexComponent } from './pages/capital-pool/capital-pool-index.component';
import { CapitalPoolUnhandledListComponent } from './pages/capital-pool/unhandled-list/capital-pool-unhandled-list.component';
import { CapitalPoolCommListComponent } from './pages/capital-pool/comm-list/capital-pool-comm-list.component';

const antDesignIcons = AllIcons as {
  [key: string]: IconDefinition;
};
const ICONS = Object.keys(antDesignIcons).map((key) => antDesignIcons[key]);

const COMPONENTS = [
  AgileXingshunComponent,
  MachineListComponent,
  EstateAgileXingshunComponent,
  AgileXingshunTransferContractManagerComponent,
  AgileXingshunHomeCommListComponent,
  AgileXingshunAvengerListComponent,
  AgileXingshunEnterpoolComponent,
  AgileXingshunProjectmanageComponent,
  AgileXingshunProjectmanagePlanComponent,
  AgileXingshunCapitalpoolComponent,
  AgileXingshunCapitalProductInfoComponent,
  CapitalDataAnalyseComponent,
  CapitalSampleComponent,
  AgileXingshunNoticeManageComponent,
  AgileXingshunRecordComponent,
  BatchModifyComponent,
  RecepitListComponent,
  AgileXingshunUploadPaymentsComponent,
  AdditionalMaterialsComponent,
  CapitalPoolIndexComponent,
  CapitalPoolCommListComponent,
  CapitalPoolUnhandledListComponent
]

@NgModule({
  declarations: [...COMPONENTS],
  imports: [
    CommonModule,
    DynamicFormModule,
    PublicModule,
    AgileXingshunShareModule,
    AgileXingshunRoutingModule,
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
export class AgileXingshunModule { }
