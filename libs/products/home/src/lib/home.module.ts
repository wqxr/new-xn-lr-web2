import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SortablejsModule } from 'ngx-sortablejs';
import { PublicModule } from 'libs/shared/src/lib/public/public.module';
import { DynamicFormModule } from 'libs/shared/src/lib/common/dynamic-form/dynamic-form.module';

import { HomeRoutingModule } from './home-routing.module';


import { AgileComponent } from './pages/agile/agile.component';
import { GtasksComponent } from './pages/gtasks/gtasks.component';
import { SysMessagesComponent } from './pages/sys-messages/sys-messages.component';
import { SystemUpdateComponent } from './pages/system-update/system-update.component';
import { PaymentMessagesComponent } from './pages/payment-messages/payment-messages.component';
import { AngencyTodoListComponent } from './pages/angency-todolist/angency-todolist.component';
import { ViewRemindComponent } from './pages/view-remind/view-remind.component';
import { AngencyComponent } from './pages/angency/angency.component';
import { RegisterEstateComponent } from './pages/estate-register/estate-register.component';
import { VerifyCompanyInfoEstateComponent } from './pages/estate-verify-company/estate-verify-company.component';


const COMPONENTS = [
  AgileComponent,
  GtasksComponent,
  SysMessagesComponent,
  SystemUpdateComponent,
  PaymentMessagesComponent,
  AngencyTodoListComponent,
  ViewRemindComponent,
  AngencyComponent,
  /** 注册待办 */
  RegisterEstateComponent,
  /** 审核企业资料待办 */
  VerifyCompanyInfoEstateComponent
];
@NgModule({
  declarations: [...COMPONENTS],
  imports: [
    CommonModule,
    SortablejsModule,
    PublicModule,
    DynamicFormModule,
    HomeRoutingModule,
  ],
})
export class HomeModule { }
