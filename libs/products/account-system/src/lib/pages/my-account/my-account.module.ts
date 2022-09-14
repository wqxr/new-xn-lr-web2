/*************************************************************************
* Copyright (c) 2017 - 2021 深圳市链融科技股份有限公司
* Shenzhen Lianrong Technology Co., Ltd.
* All rights reserved.
*
* @file：libs\products\account-system\src\lib\account-system.module.ts
* @summary：我的账户module
* @version: 1.0
* *************************************************************************
* revision             author            reason             date
* 1.0                 hucongying          init           2021-10-20
***************************************************************************/
import { NgModule } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NgZorroAntDModule } from 'libs/shared/src/lib/ng-zorro-antd.module';
import { XnFormlyModule } from '@lr/ngx-formly'
import { XnTableModule } from '@lr/ngx-table'
import { XnSharedModule } from '@lr/ngx-shared'
import { CommonModule } from '@angular/common';
import { MyAccountComponent } from './my-account.component';
import { MyAccountRoutingModule } from './my-account-routing.component';
import { ActiveAccountComponent } from './active-account/active-account.component';
import { AccountInfoComponent } from './account-info/account-info.component';
import { OperatorInfoComponent } from './operator-info/operator-info.component';
import { XnLayoutModule } from '@lr/ngx-layout';
import { BusinessInfoComponent } from './business-info/business-info.component';
import { SupplyAccountInfoComponent } from './supply-account-info/supply-account-info.component';
import { WithDrawComponent } from './withdraw/withdraw.component';
import { TradeDetailComponent } from './trade-detail/trade-detail.component';
import { AccountSystemShareModule } from '../../shared/shared.module';
import { ActiveBusinessInfoComponent } from './business-info/active-info/active-info.component';
import { ActiveOperatorInfoComponent } from './operator-info/active-info/active-info.component';


const COMPONENTS = [
  MyAccountComponent,
  ActiveAccountComponent,
  AccountInfoComponent,
  OperatorInfoComponent,
  BusinessInfoComponent,
  SupplyAccountInfoComponent,
  WithDrawComponent,
  TradeDetailComponent,
  ActiveBusinessInfoComponent,
  ActiveOperatorInfoComponent
]

@NgModule({
  declarations: [...COMPONENTS],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    MyAccountRoutingModule,
    NgZorroAntDModule,
    XnFormlyModule.forRoot(),
    XnTableModule,
    XnSharedModule,
    XnLayoutModule,
    AccountSystemShareModule
  ],
  exports: [...COMPONENTS]
})
export class MyAccountModule { }
