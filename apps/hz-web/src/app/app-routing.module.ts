import { NgModule } from '@angular/core';
import {
  Routes,
  NoPreloading,
  PreloadAllModules,
  RouterModule,
} from '@angular/router';
import { AuthGuard } from '../../../../libs/shared/src/lib/services/auth-guard.service';

import { IndexComponent as OaIndexComponent } from './pages/oa/index.component';

import { UnsupportedBrowserComponent } from './pages/unsupported-browser.component';
import { BasicLayoutComponent } from './layout/basic-layout/basic-layout.component';

const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
  navigator.userAgent
);

const routes: Routes = [
  {
    path: '',
    loadChildren: () =>
      import('./pages/portal/portal.module').then((m) => m.PortalModule),
  },
  {
    path: '',
    component: BasicLayoutComponent,
    // component: BasicLayoutComponent,
    canActivate: [AuthGuard],
    canActivateChild: [AuthGuard],
    children: [
      {
        path: 'console',
        data: { name: '首页' },
        canActivate: [AuthGuard],
        canActivateChild: [AuthGuard],
        loadChildren: () =>
          import('../../../../libs/console/src/lib/console.module').then(
            (m) => m.ConsoleModule
          ),
      },
      {
        path: 'home',
        canActivate: [AuthGuard],
        canActivateChild: [AuthGuard],
        loadChildren: () =>
          import('../../../../libs/products/home/src/lib/home.module').then(
            (m) => m.HomeModule
          ),
      },
      {
        // 两票一合同
        path: 'invoice-contract',
        data: { name: '两票一合同' },
        canActivate: [AuthGuard],
        canActivateChild: [AuthGuard],
        loadChildren: () =>
          import(
            '../../../../libs/products/invoice-contract/src/lib/invoice-contract.module'
          ).then((m) => m.InvoiceContractModule),
      },
      {
        // 定向收款保理
        path: 'targete',
        data: { name: '定向收款' },
        canActivate: [AuthGuard],
        canActivateChild: [AuthGuard],
        loadChildren: () =>
          import('../../../../libs/products/targete/src/lib/targete.module').then(
            (m) => m.TargeteModule
          ),
      },
      {
        path: 'vanke',
        data: { name: '保理通万科' },
        canActivate: [AuthGuard],
        canActivateChild: [AuthGuard],
        loadChildren: () =>
          import('../../../../libs/products/vanke/src/lib/vanke.module').then(
            (m) => m.VankeModule
          ),
      },

      {
        path: 'logan',
        data: { name: '保理通龙光' },
        canActivate: [AuthGuard],
        canActivateChild: [AuthGuard],
        loadChildren: () =>
          import('../../../../libs/products/dragon/src/lib/dragon.module').then(
            (m) => m.DragonModule
          ),
      },
      {
        path: 'xnlogan',
        data: { name: '保理通香纳龙光' },
        canActivate: [AuthGuard],
        canActivateChild: [AuthGuard],
        loadChildren: () =>
          import(
            '../../../../libs/products/xn-dragon/src/lib/xn-dragon.module'
          ).then((m) => m.XnDragonModule),
      },
      {
        path: 'machine-account',
        data: { name: '台账' },
        canActivate: [AuthGuard],
        canActivateChild: [AuthGuard],
        loadChildren: () =>
          import(
            '../../../../libs/products/machine-account/src/lib/machine-account.module'
          ).then((m) => m.MachineAccountModule),
      },
      {
        path: 'new-agile',
        data: { name: '星顺' },
        canActivate: [AuthGuard],
        canActivateChild: [AuthGuard],
        loadChildren: () =>
          import(
            '../../../../libs/products/new-agile/src/lib/new-agile.module'
          ).then((m) => m.NewAgileModule),
      },
      {
        path: 'gemdale',
        data: { name: '金地' },
        canActivate: [AuthGuard],
        canActivateChild: [AuthGuard],
        loadChildren: () => import('../../../../libs/products/gemdale/src/lib/gemdale.module').then(m => m.GemdaleModule),
      },
      // 新金地项目-金地数据对接
      {
        path: 'new-gemdale',
        data: { name: '新金地' },
        canActivate: [AuthGuard],
        canActivateChild: [AuthGuard],
        loadChildren: () => import('../../../../libs/products/new-gemdale/src/lib/new-gemdale.module').then(m => m.NewGemdaleModule),
      },
      {
        path: 'old-agile',
        data: { name: '雅居乐' },
        canActivate: [AuthGuard],
        canActivateChild: [AuthGuard],
        loadChildren: () =>
          import('../../../../libs/products/old-agile/src/lib/old-agile.module').then(
            (m) => m.OldAgileModule
          ),
      },
      // 碧桂园
      {
        path: 'country-graden',
        data: { name: '碧桂园' },
        canActivate: [AuthGuard],
        canActivateChild: [AuthGuard],
        loadChildren: () =>
          import(
            '../../../../libs/products/country-graden/src/lib/country-graden.module'
          ).then((m) => m.CountryGradenModule),
      },
      {
        // 客户管理
        path: 'avenger',
        data: { name: '采购融资' },
        canActivate: [AuthGuard],
        canActivateChild: [AuthGuard],
        loadChildren: () =>
          import('../../../../libs/products/avenger/src/lib/avenger-routing.module').then(
            (m) => m.AvengerRouteModule
          ),
      },
      {
        // 上海银行直保
        path: 'bank-shanghai',
        data: { name: '上海银行' },
        canActivate: [AuthGuard],
        canActivateChild: [AuthGuard],
        loadChildren: () =>
          import(
            '../../../../libs/products/bank-shanghai/src/lib/bank-shanghai.module'
          ).then((m) => m.BankShanghaiModule),
      },
      {
        path: 'oct',
        data: { name: '华侨城' },
        canActivate: [AuthGuard],
        canActivateChild: [AuthGuard],
        loadChildren: () =>
          import(
            '../../../../libs/products/huaqiao-city/src/lib/huaqiao-city.module'
          ).then((m) => m.HuaqiaoCityModule),
      },
      // 雅居乐-星顺（雅居乐改造项目）
      {
        path: 'agile-xingshun',
        data: { name: '雅居乐-星顺' },
        canActivate: [AuthGuard],
        canActivateChild: [AuthGuard],
        loadChildren: () => import('../../../../libs/products/agile-xingshun/src/lib/agile-xingshun.module').then(m => m.AgileXingshunModule),
      },
      // 雅居乐-恒泽（雅居乐改造项目）
      {
        path: 'agile-hz',
        data: { name: '雅居乐-恒泽' },
        canActivate: [AuthGuard],
        canActivateChild: [AuthGuard],
        loadChildren: () => import('../../../../libs/products/agile-hz/src/lib/agile-hz.module').then(m => m.AgileHzModule),
      },
      // 新金地项目 金地-香纳
      {
        path: 'xn-gemdale',
        data: { name: '金地-香纳' },
        canActivate: [AuthGuard],
        canActivateChild: [AuthGuard],
        loadChildren: () => import('../../../../libs/products/xn-gemdale/src/lib/xn-gemdale.module').then(m => m.XnGemdaleModule),
      },
      // 新金地项目 金地-前海中晟
      {
        path: 'zs-gemdale',
        data: { name: '金地-前海中晟' },
        canActivate: [AuthGuard],
        canActivateChild: [AuthGuard],
        loadChildren: () => import('../../../../libs/products/zs-gemdale/src/lib/zs-gemdale.module').then(m => m.ZsGemdaleModule),
      },
      // 龙光邮储理财项目 龙光-博时资本
      {
        path: 'pslogan',
        data: { name: '龙光-博时资本' },
        canActivate: [AuthGuard],
        canActivateChild: [AuthGuard],
        loadChildren: () => import('../../../../libs/products/ps-logan/src/lib/ps-logan.module').then((m) => m.PsLoganModule),
      },
    ],
  },
  {
    path: 'oa',
    component: OaIndexComponent,
    loadChildren: () => import('./pages/oa/oa.module').then((m) => m.OAModule),
  },
  {
    path: 'unsupported_browser',
    component: UnsupportedBrowserComponent,
  },
  {
    path: '**',
    redirectTo: '',
    pathMatch: 'full',
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      onSameUrlNavigation: 'reload',
      preloadingStrategy: isMobile ? NoPreloading : PreloadAllModules,
      scrollOffset: [0, 0],
      scrollPositionRestoration: 'enabled',
      anchorScrolling: 'enabled',
    }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule { }
