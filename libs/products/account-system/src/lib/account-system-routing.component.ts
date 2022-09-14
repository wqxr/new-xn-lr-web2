/*************************************************************************
* Copyright (c) 2017 - 2021 深圳市链融科技股份有限公司
* Shenzhen Lianrong Technology Co., Ltd.
* All rights reserved.
*
* @file：libs\products\account-system\src\lib\account-system-routing.component.ts
* @summary：账户体系-路由配置文件
* @version: 1.0
* *************************************************************************
* revision             author            reason             date
* 1.0                 hucongying          init           2021-10-19
***************************************************************************/

import { NgModule } from "@angular/core";
import { Routes, RouterModule } from '@angular/router'


const routes: Routes = [
  { path: '', redirectTo: 'my-account', pathMatch: 'full' },
  // 账户列表
  {
    path: 'account-list',
    loadChildren: () => import('./pages/account-list/account-list.module').then((m) => m.AccountListModule),
    data: { name: '电子账本列表' }
  },
  // 我的账户
  {
    path: 'my-account',
    loadChildren: () => import('./pages/my-account/my-account.module').then((m) => m.MyAccountModule),
    data: { name: '我的电子账本' }
  }
]
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AccountSystemRoutingModule { }
