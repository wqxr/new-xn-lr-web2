/*************************************************************************
* Copyright (c) 2017 - 2021 深圳市链融科技股份有限公司
* Shenzhen Lianrong Technology Co., Ltd.
* All rights reserved.
*
* @file：libs\products\account-system\src\lib\pages\my-account\bind-account\bind-account-routing.component.ts
* @summary：绑定银行账户路由
* @version: 1.0
* *************************************************************************
* revision             author            reason             date
* 1.0                HuCongying           init           2021-11-02
***************************************************************************/

import { NgModule } from "@angular/core";
import { Routes, RouterModule } from '@angular/router'
import { ActiveAccountComponent } from "./active-account/active-account.component";
import { AddBindAccountComponent } from "./add-bind-account/add-bind-account.component";
import { BindAccountComponent } from "./bind-account.component";
import { ModifyBindAccountComponent } from "./modify-bind-account/modify-bind-account.component";


const routes: Routes = [
  { path: '', redirectTo: 'index', pathMatch: 'full' },
  // 绑定银行账户
  {
    path: 'list/:accountId',
    component: BindAccountComponent,
    data: { name: '账户列表' }
  },
  // 添加绑定银行账户
  {
    path: 'add/:accountId',
    component: AddBindAccountComponent,
    data: { name: '添加绑定银行账户' }
  },
  // 修改绑定银行账户
  {
    path: 'modify/:accountId',
    component: ModifyBindAccountComponent,
    data: { name: '修改绑定银行账户' }
  },
  // 打款激活
  {
    path: 'active-account/:bankId',
    component: ActiveAccountComponent,
    data: { name: '打款激活' }
  },
]
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BindAccountRoutingModule { }
