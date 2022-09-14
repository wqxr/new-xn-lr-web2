import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PublicModule } from 'libs/shared/src/lib/public/public.module';

import { ClientIndexComponent } from './clients/client-index.component';
import { InvoicesIndexComponent } from './invoices/invoices-index.component';
import { PaymentNoticeIndexComponent } from './payment-notice/payment-notice-index.component';
import { ProtocolManagementIndexComponent } from './portocol-management/protocol-management-index.component';

const COMPONENTS = [
  ClientIndexComponent,
  InvoicesIndexComponent,
  PaymentNoticeIndexComponent,
  ProtocolManagementIndexComponent,
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
export class BankManagementModule {}
