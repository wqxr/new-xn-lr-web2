/*************************************************************************
* Copyright (c) 2017 - 2021 深圳市链融科技股份有限公司
* Shenzhen Lianrong Technology Co., Ltd.
* All rights reserved.
*
* @file：libs\products\account-system\src\lib\pages\account-list\account-list.module.ts
* @summary：AccountListModule
* @version: 1.0
* *************************************************************************
* revision             author            reason             date
* 1.0                 hucongying          init           2021-10-28
***************************************************************************/
import { NgModule } from '@angular/core';
import { NgZorroAntDModule } from 'libs/shared/src/lib/ng-zorro-antd.module';
import { XnFormlyModule } from '@lr/ngx-formly'
import { XnTableModule } from '@lr/ngx-table'
import { XnSharedModule } from '@lr/ngx-shared'
import { CommonModule } from '@angular/common';
import { XnLayoutModule } from '@lr/ngx-layout';
import { AccountListRoutingModule } from './account-list-routing.component';
import { UploadAccountListComponent } from './upload-account-list/upload-account-list.component';
import { AccountListComponent } from './account-list.component';
import { AccountDetailComponent } from './account-detail/account-detail.component';
import { AccountSystemShareModule } from '../../shared/shared.module';
import { TradeDetailComponent } from './trade-detail/trade-detail.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AccountFlowListComponent } from './flow-list/flow-list.component';


const COMPONENTS = [
  UploadAccountListComponent,
  AccountListComponent,
  AccountDetailComponent,
  TradeDetailComponent,
  AccountFlowListComponent
]

@NgModule({
  declarations: [...COMPONENTS],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    AccountListRoutingModule,
    NgZorroAntDModule,
    XnFormlyModule.forRoot(),
    XnTableModule,
    XnSharedModule,
    XnLayoutModule,
    AccountSystemShareModule
  ],
  exports: [...COMPONENTS]
})
export class AccountListModule { }
