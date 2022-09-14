/*************************************************************************
 * Copyright (c) 2017 - 2020 深圳市链融科技股份有限公司
 * Shenzhen Lianrong Technology Co., Ltd.
 * All rights reserved.
 *
 * @file：xn-lr-web\apps\src\app\pages\portal\block-chain-browser\block-chain-browser-routing.module.ts
 * @summary：init block-chain-browser-routing.module.ts
 * @version: 1.0
 * *************************************************************************
 * revision             author            reason             date
 * 1.0                  zigui              init             2020-11-11
 ***************************************************************************/
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BlockChainBrowserComponent } from './block-chain-browser.component';
import { LayoutComponent } from './layout/layout.component';
import { InfoComponent } from './info/info.component';
import { DetailComponent } from './detail/detail.component';
const routes: Routes = [
  { path: '', redirectTo: 'index', pathMatch: 'full' },
  { path: 'index/:id', redirectTo: 'index', pathMatch: 'full' },
  {
    path: 'index',
    component: BlockChainBrowserComponent,
  },
  {
    path: 'index/:id',
    data: { name: '查询结果', breadcrumb: '区块链浏览器' },
    component: LayoutComponent,
    children: [
      {
        path: 'info',
        data: { name: '查询结果', breadcrumb: '查询结果' },
        children: [
          {
            path: '',
            component: InfoComponent,
          },
          {
            path: 'detail',
            component: DetailComponent,
            data: { name: '区块链详情', breadcrumb: '区块链详情' },
          },
        ],
      },
      {
        path: 'detail',
        component: DetailComponent,
        data: { name: '区块链详情', breadcrumb: '区块链详情' },
      },
    ],
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BlockChainBrowserRoutingModule { }
