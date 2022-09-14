import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DynamicFormModule } from 'libs/shared/src/lib/common/dynamic-form/dynamic-form.module';
import { PublicModule } from 'libs/shared/src/lib/public/public.module';
import { GemdaleRoutingModule } from './gemdale-routing.component';
import { DragonVankeShareModule } from 'libs/shared/src/lib/public/dragon-vanke/share.module';
import { SortablejsModule } from 'ngx-sortablejs';
import { AvengerSharedModule } from 'libs/products/avenger/src/lib/shared/shared.module';

import { GemdaleCommListComponent } from './pages/upload-pay-plan/comm-list.component';
import { GemdalePaymentComponent } from './pages/payment/payment.component';
import {ComfirmInformationIndexComponent} from './pages/gemdale-mode/confirm-inforamtion-index.component';
import {GemdaleCapitalPoolIndexComponent} from './pages/capital-pool/capital-pool-index.component';
import {GemdaleTransactionsListComponent} from './pages/gemdale-transactions/gemdale-transactions-list.component';
import {ReceiptListComponent} from './pages/receipt-list/receipt-list.component';

import { EstateGemdaleComponent } from './pages/estate-gemdale/estate-gemdale.component';
import { GemdaleCapitalPoolCommListComponent } from './pages/trading-list/capital-pool-comm-list.component';
import { GemdaleProjectmanageComponent } from './pages/gemdale-project-manager/gemdale-project-management.component';
import { GemdaleProjectmanagePlanComponent } from './pages/gemdale-project-manager/gemdale-project-plan-list/gemdale-project-plan-list.component';
import { GemdaleCapitalpoolComponent } from './pages/gemdale-project-manager/gemdale-capital-pool/gemdale-capital-pool.component';
import { GemdaleNoticeManageComponent } from './pages/gemdale-project-manager/gemdale-notice-manage/gemdale-notice-manage-list.component';
import { CapitalSampleComponent } from './pages/gemdale-project-manager/capital-sample/capital-sample.component';
import { CapitalDataAnalyseComponent } from './pages/gemdale-project-manager/capital-data-analyse/capital-data-analyse.component';
import { GemdaleCapitalProductInfoComponent } from './pages/gemdale-project-manager/capital-product-info/capital-product-info.component';
import { GemdaleTransferContractManagerComponent } from './pages/contract-template/contract-template.component';
import { ComfirmationSignComponent } from './pages/gemdale-mode/confirmation-sign-component';
import {CapitalPoolUnhandledListComponent} from './pages/capital-pool/capital-pool-unhandled-list/capital-pool-unhandled-list.component'
import {GemdaleEnterpoolComponent} from './pages/enter-capital-tool/enter-capital-pool-confirmation.component'

const COMPONENTS = [
  GemdaleCommListComponent,
  GemdalePaymentComponent,
  ComfirmInformationIndexComponent,
  GemdaleCapitalPoolIndexComponent,
  GemdaleTransactionsListComponent,
  ReceiptListComponent,
  EstateGemdaleComponent,
  GemdaleCapitalPoolCommListComponent,
  GemdaleProjectmanageComponent,
  GemdaleProjectmanagePlanComponent,
  GemdaleCapitalpoolComponent,
  GemdaleNoticeManageComponent,
  CapitalSampleComponent,
  CapitalDataAnalyseComponent,
  GemdaleCapitalProductInfoComponent,
  GemdaleTransferContractManagerComponent,
  ComfirmationSignComponent,
  CapitalPoolUnhandledListComponent,
  GemdaleEnterpoolComponent
];
const SERVICES = [
];


@NgModule({
  declarations: [...COMPONENTS],
  imports: [
    CommonModule,
    DynamicFormModule,
    PublicModule,
    GemdaleRoutingModule,
    SortablejsModule,
    DragonVankeShareModule,
    AvengerSharedModule
  ],
  exports: [...COMPONENTS]
})
export class GemdaleModule { }
