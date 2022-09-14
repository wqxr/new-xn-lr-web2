import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PublicModule } from 'libs/shared/src/lib/public/public.module';

import { AdditionalMaterialsComponent } from './additional-materials.component';
import { BankManageComponent } from './bank-manage.component';
import { CaDetailComponent } from './ca-detail.component';
import { HonourFactoryListComponent } from './honour-factory-list.component';
import { HonourListComponent } from './honour-list.component';
import { InvoiceManageComponent } from './invoice-manage.component';
import { InvoicesManageComponent } from './invoices-manage.component';
import { LoadWordManageComponent } from './load-word-manage.component';
import { MessageComponent } from './message.component';
import { PaymentComponent } from './payment.component';
// import { ReceiptListVkComponent } from './receipt-list-vk.component';
// import { SupplierUnsignedContractComponent } from './supplier-unsigned-contract.component';

const COMPONENTS = [
  AdditionalMaterialsComponent,
  BankManageComponent,
  CaDetailComponent,
  HonourFactoryListComponent,
  HonourListComponent,
  InvoiceManageComponent,
  InvoicesManageComponent,
  LoadWordManageComponent,
  MessageComponent,
  PaymentComponent,
  // ReceiptListVkComponent,
  // SupplierUnsignedContractComponent,
];

@NgModule({
  imports: [
    CommonModule,
    PublicModule,
  ],
  declarations: [
    ...COMPONENTS,
  ],
  exports: [
    ...COMPONENTS,
  ]
})
export class ManageModule {

}
