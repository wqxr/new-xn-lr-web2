import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SortablejsModule } from 'ngx-sortablejs';
import { PublicModule } from 'libs/shared/src/lib/public/public.module';
import { InvoiceContractRoutingModule } from './invoice-contract-routing.module';
import { ServiceFeeComponent } from './pages/service-fee/service-fee.component';
import { ServiceFeePromisePayComponent } from './pages/service-fee-promise-pay/service-fee-promise-pay.component';



const COMPONENTS = [
  ServiceFeeComponent,
  ServiceFeePromisePayComponent,
];
@NgModule({
  declarations: [...COMPONENTS],
  imports: [
    CommonModule,
    SortablejsModule,
    PublicModule,
    InvoiceContractRoutingModule,
  ],
})
export class InvoiceContractModule { }
