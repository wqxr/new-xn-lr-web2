import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
const routes: Routes = [
  { // 保后管理
    path: 'guarant-manage',
    loadChildren: () => import('libs/products/avenger/src/lib/guarant-management/guarant-management.module')
      .then(m => m.GuarantManagementModule),
  }, { // 合同管理
    path: 'contract-manage',
    loadChildren: () => import('libs/products/avenger/src/lib/contract-manage/contract-manage.module')
      .then(m => m.ContractManageModule),

  },
  { // 客户管理
    path: 'customer-manage',
    loadChildren: () => import('libs/products/avenger/src/lib/customer-manage/customer-manage.module')
      .then(m => m.CustomerManageModule),
  },
  {
    path: 'avenger-list',
    loadChildren: () => import('libs/products/avenger/src/lib/avenger-list/avenger-list.module')
      .then(m => m.AvengerListModule),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AvengerRouteModule {
}
