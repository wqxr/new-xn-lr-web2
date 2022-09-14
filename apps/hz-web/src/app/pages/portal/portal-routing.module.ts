/*************************************************************************
 * Copyright (c) 2017 - 2020 深圳市链融科技股份有限公司
 * Shenzhen Lianrong Technology Co., Ltd.
 * All rights reserved.
 *
 * @file：xn-lr-web\apps\src\app\pages\portal\portal-routing.module.ts
 * @summary：init portal-routing.module.ts
 * @version: 1.0
 * *************************************************************************
 * revision             author            reason             date
 * 1.0                  zigui             init             2020-11-16
 ***************************************************************************/
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HelpComponent } from './help/help.component';
import { LoginComponent } from './login/login.component';
import { RegistryComponent } from './registry/registry.component';

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  {
    path: 'login',
    component: LoginComponent,
    data: {
      name: '登入页面',
    },
  },
  {
    path: 'registry',
    component: RegistryComponent,
    data: {
      name: '注册页面',
    },
  },
  {
    path: 'help',
    component: HelpComponent,
    data: {
      breadcrumb: '帮助中心',
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PortalRoutingModule {}
