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
import { Routes, RouterModule } from '@angular/router';
import { PortalComponent } from './portal.component';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { RunmiaotieComponent } from './runmiaotie/runmiaotie.component';
import { BhtDetailComponent } from './bht-detail/bht-detail.component';
import { ProductSystemComponent } from './product/system/system.component';
import { ProductSolutionComponent } from './product/solution/solution.component';
import { TechnologyComponent } from './technology/technology.component';
import { NewsComponent } from './news/news.component';
import { AboutComponent } from './about/about.component';
import { JoinComponent } from './join/join.component';
import { HelpComponent } from './help/help.component';
import { NewsDetailComponent } from './news/news-detail/news-detail.component';
import { RegistryComponent } from './registry/registry.component';
import { VankePreComponent } from './other/vanke-pre/vanke-pre.component';
import { ProductNoteComponent } from './product/note/note.component';
import { VankePre2Component } from './other/vanke-pre2/vanke-pre2.component';
const routes: Routes = [
  { path: '', redirectTo: 'portal/home', pathMatch: 'full' },
  {
    path: 'portal',
    component: PortalComponent,
    children: [

      {
        path: 'home',
        component: HomeComponent,
        data: {
          breadcrumb: '首页',
        },
      },
      {
        path: 'runmiaotie',
        component: RunmiaotieComponent,
        data: {
          breadcrumb: '润秒贴',
        },
      },
      {
        path: 'bht-detail',
        component: BhtDetailComponent,
        data: {
          breadcrumb: '保函通详情',
        },
      },
      {
        path: 'product',
        data: {
          breadcrumb: '产品服务',
        },
        children: [
          { path: '', redirectTo: 'system', pathMatch: 'full' },
          {
            path: 'system',
            component: ProductSystemComponent,
            data: {
              breadcrumb: '平台产品',
            },
          },
          {
            path: 'solution',
            component: ProductSolutionComponent,
            data: {
              breadcrumb: '解决方案',
            },
          },
          // {
          //   path: 'note',
          //   component: ProductNoteComponent,
          //   data: {
          //     breadcrumb: '票据通',
          //   },
          // },
        ],
      },
      {
        path: 'technology',
        component: TechnologyComponent,
        data: {
          breadcrumb: '技术服务',
        },
      },
      {
        path: 'news',
        data: {
          breadcrumb: '新闻中心',
        },
        children: [
          {
            path: '',
            component: NewsComponent,
          },
          {
            path: 'detail/:id',
            component: NewsDetailComponent,
            data: { breadcrumb: '新闻详情', showBreadcrumb: 'xx' },
          }
        ],
      },
      {
        path: 'about',
        component: AboutComponent,
        data: {
          breadcrumb: '关于我们',
        },
      },
      {
        path: 'join',
        component: JoinComponent,
        data: {
          breadcrumb: '加入我们',
        },
      },
      {
        path: 'help',
        component: HelpComponent,
        data: {
          breadcrumb: '帮助中心',
        },
      },
    ],
  },
  {
    path: 'block-chain-info',
    loadChildren: () =>
      import('./block-chain-browser/block-chain-browser.module').then(
        (m) => m.BlockChainBrowserModule
      ),
  },
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
    path: 'guide',
    component: VankePreComponent,
    data: {
      name: '万科柏霖汇进度款融资业务指引',
    },
  },
  {
    path: 'pre',
    component: VankePre2Component,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PortalRoutingModule {}
