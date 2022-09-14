/*************************************************************************
* Copyright (c) 2017 - 2021 深圳市链融科技股份有限公司
* Shenzhen Lianrong Technology Co., Ltd.
* All rights reserved.
*
* @file：libs\products\account-system\src\lib\pages\my-account\bind-account\bind-account.module.ts
* @summary：BindAccountModule
* @version: 1.0
* *************************************************************************
* revision             author            reason             date
* 1.0                HuCongying           init           2021-11-02
***************************************************************************/
import { NgModule } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NgZorroAntDModule } from 'libs/shared/src/lib/ng-zorro-antd.module';
import { XnFormlyModule } from '@lr/ngx-formly'
import { XnTableModule } from '@lr/ngx-table'
import { XnSharedModule } from '@lr/ngx-shared'
import { CommonModule } from '@angular/common';
import { XnLayoutModule } from '@lr/ngx-layout';
import { BindAccountRoutingModule } from './bind-account-routing.component';
import { BindAccountComponent } from './bind-account.component';
import { AddBindAccountComponent } from './add-bind-account/add-bind-account.component';
import { ModifyBindAccountComponent } from './modify-bind-account/modify-bind-account.component';
import { AccountSystemShareModule } from '../../../shared/shared.module';
import { ActiveAccountComponent } from './active-account/active-account.component';

const COMPONENTS = [
  BindAccountComponent,
  AddBindAccountComponent,
  ModifyBindAccountComponent,
  ActiveAccountComponent
]

@NgModule({
  declarations: [...COMPONENTS],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    BindAccountRoutingModule,
    NgZorroAntDModule,
    XnFormlyModule.forRoot(),
    XnTableModule,
    XnSharedModule,
    XnLayoutModule,
    AccountSystemShareModule
  ],
  exports: [...COMPONENTS]
})
export class BindAccountModule { }
