import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PublicModule } from 'libs/shared/src/lib/public/public.module';

import { LimitManageComponent } from '../my-customer/limit-manage.component';
import { LvManageComponent } from './lv-manage.component';
import { LvWanManageComponent } from './lv-wan-manage.component';
import { ApprovalConditionsComponent } from './approval-conditions.component';
import { LvVankePublicComponent } from './lv-vanke-public.component';

const COMPONENTS = [
  LvVankePublicComponent,
  LimitManageComponent,
  LvManageComponent,
  LvWanManageComponent,
  ApprovalConditionsComponent
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
export class MyCustomerModule {

}
