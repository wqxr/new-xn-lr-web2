/*************************************************************************
* Copyright (c) 2017 - 2021 深圳市链融科技股份有限公司
* Shenzhen Lianrong Technology Co., Ltd.
* All rights reserved.
*
* @file：libs\products\account-system\src\lib\account-system.module.ts
* @summary：AccountSystemModule
* @version: 1.0
* *************************************************************************
* revision             author            reason             date
* 1.0                 hucongying          init           2021-10-19
***************************************************************************/
import { NgModule } from '@angular/core';
import { AccountSystemRoutingModule } from './account-system-routing.component';
import { NgZorroAntDModule } from 'libs/shared/src/lib/ng-zorro-antd.module';
import { XnFormlyModule } from '@lr/ngx-formly'
import { XnTableModule } from '@lr/ngx-table'
import { XnSharedModule } from '@lr/ngx-shared'
import { CommonModule } from '@angular/common';
import { XnLayoutModule } from '@lr/ngx-layout';
import { AccountSystemShareModule } from './shared/shared.module';


const COMPONENTS = []

@NgModule({
  declarations: [...COMPONENTS],
  imports: [
    CommonModule,
    AccountSystemRoutingModule,
    NgZorroAntDModule,
    XnFormlyModule.forRoot(),
    XnTableModule,
    XnSharedModule,
    XnLayoutModule,
    AccountSystemShareModule
  ],
  exports: [...COMPONENTS]
})
export class AccountSystemModule { }
