/*************************************************************************
* Copyright (c) 2017 - 2021 深圳市链融科技股份有限公司
* Shenzhen Lianrong Technology Co., Ltd.
* All rights reserved.
*
* @file：libs\products\account-system\src\lib\pages\my-account\my-account-routing.component.ts
* @summary：我的账户-路由配置文件
* @version: 1.0
* *************************************************************************
* revision             author            reason             date
* 1.0                 hucongying          init           2021-10-19
***************************************************************************/

import { NgModule } from "@angular/core";
import { Routes, RouterModule } from '@angular/router'
import { PageTypeEnum } from "libs/shared/src/lib/config/enum";
import { AccountInfoComponent } from "./account-info/account-info.component";
import { ActiveAccountComponent } from "./active-account/active-account.component";
import { ActiveBusinessInfoComponent } from "./business-info/active-info/active-info.component";
import { BusinessInfoComponent } from "./business-info/business-info.component";
import { MyAccountComponent } from "./my-account.component";
import { ActiveOperatorInfoComponent } from "./operator-info/active-info/active-info.component";
import { OperatorInfoComponent } from "./operator-info/operator-info.component";
import { SupplyAccountInfoComponent } from "./supply-account-info/supply-account-info.component";
import { TradeDetailComponent } from "./trade-detail/trade-detail.component";
import { WithDrawComponent } from "./withdraw/withdraw.component";


const routes: Routes = [
  { path: '', redirectTo: 'index', pathMatch: 'full' },
  // 账户信息
  {
    path: 'index',
    component: MyAccountComponent,
    data: { name: '' }
  },
  // 打款激活
  {
    path: 'active-account/:accountId',
    component: ActiveAccountComponent,
    data: { name: '打款激活' }
  },
  // 电子账本信息
  {
    path: 'account-info/:accountId',
    component: AccountInfoComponent,
    data: { name: '电子账本信息' }
  },
  // 查看经办人信息
  {
    path: 'operator-info/view/:accountId',
    component: OperatorInfoComponent,
    data: { name: '查看经办人信息', pageType: PageTypeEnum.VIEW }
  },
  // 修改经办人信息
  {
    path: 'operator-info/edit/:accountId',
    component: OperatorInfoComponent,
    data: { name: '修改经办人信息', pageType: PageTypeEnum.EDIT }
  },
  // 确认修改经办人信息
  {
    path: 'operator-info/confirm/:accountId',
    component: OperatorInfoComponent,
    data: { name: '确认修改经办人信息', pageType: PageTypeEnum.CONFIRM }
  },
  // 激活经办人信息
  {
    path: 'active-operator/:accountId',
    component: ActiveOperatorInfoComponent,
    data: { name: '激活经办人信息' }
  },
  // 查看工商信息
  {
    path: 'business-info/view/:accountId',
    component: BusinessInfoComponent,
    data: { name: '查看工商信息', pageType: PageTypeEnum.VIEW }
  },
  // 修改工商信息
  {
    path: 'business-info/edit/:accountId',
    component: BusinessInfoComponent,
    data: { name: '修改工商信息', pageType: PageTypeEnum.EDIT }
  },
  // 确认修改工商信息
  {
    path: 'business-info/confirm/:accountId',
    component: BusinessInfoComponent,
    data: { name: '确认工商信息', pageType: PageTypeEnum.CONFIRM }
  },
  // 激活工商信息
  {
    path: 'active-business/:accountId',
    component: ActiveBusinessInfoComponent,
    data: { name: '激活工商信息' }
  },
  // 补充开户信息
  {
    path: 'supply-account-info/:accountId',
    component: SupplyAccountInfoComponent,
    data: { name: '补充开户信息', pageType: PageTypeEnum.EDIT }
  },
  // 确认开户信息
  {
    path: 'confirm-account-info/:accountId',
    component: SupplyAccountInfoComponent,
    data: { name: '确认开户信息', pageType: PageTypeEnum.CONFIRM }
  },
  // 提现
  {
    path: 'withdraw/:accountId',
    component: WithDrawComponent,
    data: { name: '提现' }
  },
  // 绑定银行账户
  {
    path: 'bind-account',
    loadChildren: () => import('./bind-account/bind-account.module').then((m) => m.BindAccountModule),
    data: { name: '绑定银行账户' }
  },
  // 交易明细
  {
    path: 'trade-detail',
    component: TradeDetailComponent,
    data: { name: '交易明细' }
  },
]
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MyAccountRoutingModule { }
