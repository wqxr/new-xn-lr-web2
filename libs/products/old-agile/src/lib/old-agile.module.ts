import { NgModule } from '@angular/core';
import { OldAgileRoutingModule } from './old-agile-routing.module';
import { CommonModule } from '@angular/common';
import { DynamicFormModule } from 'libs/shared/src/lib/common/dynamic-form/dynamic-form.module';
import { PublicModule } from 'libs/shared/src/lib/public/public.module';
import { SortablejsModule } from 'ngx-sortablejs';
import { DragonVankeShareModule } from 'libs/shared/src/lib/public/dragon-vanke/share.module';
import { ConsoleComponents } from './pages/console';
import { CommListComponent } from './pages/upload-pay-plan/comm-list.component';
import { PaymentComponent } from './pages/payment/payment.component';
import { YajvleSignContractComponent } from './pages/sign-contract/yajvle-sign-contract.component';
import { SupplierUnsignedContractComponent } from './pages/unsigned_contract/supplier-unsigned-contract.component';
import { CapitalPoolIndexComponent } from './pages/capital-pool/capital-pool-index.component';
import { ReceiptListVkComponent } from './pages/receipt-list/receipt-list-vk.component';
import { AdditionalMaterialsComponent } from './pages/additional-materials/additional-materials.component';
import { OldAgileTransactionsListComponent } from './pages/machine-list/dragon-transactions-list.component';
import { TransSupplementInfoComponent } from './pages/supplement_info/trans-supplement-info-component';
import { OldAgileProjectmanageComponent } from './pages/oldAgile-project-manager/oldAgile-project-management.component';
import { OldAgileProjectmanagePlanComponent } from './pages/oldAgile-project-manager/oldAgile-project-plan-list/oldAgile-project-plan-list.component';
import { OldAgileCapitalpoolComponent } from './pages/oldAgile-project-manager/oldAgile-capital-pool/oldAgile-capital-pool.component';
import { OldAgileNoticeManageComponent } from './pages/oldAgile-project-manager/oldAgile-notice-manage/oldAgile-notice-manage-list.component';
import { CapitalSampleComponent } from './pages/oldAgile-project-manager/capital-sample/capital-sample.component';
import { CapitalDataAnalyseComponent } from './pages/oldAgile-project-manager/capital-data-analyse/capital-data-analyse.component';
import { OldAgileCapitalProductInfoComponent } from './pages/oldAgile-project-manager/capital-product-info/capital-product-info.component';
import { OldAgileCapitalPoolCommListComponent } from './pages/trading-list/capital-pool-comm-list.component';
import {OldAgileEnterpoolComponent} from './pages/enter-capital-tool/enter-capital-pool-confirmation.component'
import {CapitalPoolUnhandledListComponent} from './pages/capital-pool/capital-pool-unhandled-list/capital-pool-unhandled-list.component'


const COMPONENTS = [
  ...ConsoleComponents,
  CommListComponent,
  PaymentComponent,
  YajvleSignContractComponent,
  SupplierUnsignedContractComponent,
  CapitalPoolIndexComponent,
  ReceiptListVkComponent,
  AdditionalMaterialsComponent,
  OldAgileTransactionsListComponent,
  TransSupplementInfoComponent,
  OldAgileCapitalPoolCommListComponent,
  OldAgileProjectmanageComponent,
  OldAgileProjectmanagePlanComponent,
  OldAgileCapitalpoolComponent,
  OldAgileNoticeManageComponent,
  CapitalSampleComponent,
  CapitalDataAnalyseComponent,
  OldAgileCapitalProductInfoComponent,
  OldAgileEnterpoolComponent,
  CapitalPoolUnhandledListComponent
];

const SERVICES = [
];

@NgModule({
  declarations: [...COMPONENTS],
  imports: [
    CommonModule,
    DynamicFormModule,
    PublicModule,
    SortablejsModule,
    DragonVankeShareModule,
    OldAgileRoutingModule
  ],
  providers: [
    ...SERVICES,
  ],
  exports: [...COMPONENTS]
})
export class OldAgileModule { }
