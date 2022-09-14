/*************************************************************************
* Copyright (c) 2017 - 2021 深圳市链融科技股份有限公司
* Shenzhen Lianrong Technology Co., Ltd.
* All rights reserved.
*
* @file：libs\products\account-system\src\lib\pages\account-list\account-list-routing.component.ts
* @summary：账户体系-账户列表路由配置文件
* @version: 1.0
* *************************************************************************
* revision             author            reason             date
* 1.0                 hucongying          init           2021-10-28
***************************************************************************/

import { NgModule } from "@angular/core";
import { Routes, RouterModule } from '@angular/router'
import { PageTypeEnum } from "libs/shared/src/lib/config/enum";
import { AccountInfoComponent } from "../my-account/account-info/account-info.component";
import { BusinessInfoComponent } from "../my-account/business-info/business-info.component";
import { OperatorInfoComponent } from "../my-account/operator-info/operator-info.component";
import { SupplyAccountInfoComponent } from "../my-account/supply-account-info/supply-account-info.component";
import { AccountDetailComponent } from "./account-detail/account-detail.component";
import { AccountListComponent } from "./account-list.component";
import { TradeDetailComponent } from "./trade-detail/trade-detail.component";
import { UploadAccountListComponent } from "./upload-account-list/upload-account-list.component";


const routes: Routes = [
  { path: '', redirectTo: 'index', pathMatch: 'full' },
  // 账户列表
  {
    path: 'index',
    component: AccountListComponent,
    data: { name: '' }
  },
  // 上传开户企业名单
  {
    path: 'apply-account',
    component: UploadAccountListComponent,
    data: { name: '申请开户' }
  },
  // 查看账户
  {
    path: 'account-detail/:appId',
    component: AccountDetailComponent,
    data: { name: '查看账户' }
  },
  // 电子账本信息
  {
    path: 'account-info/:accountId',
    component: AccountInfoComponent,
    data: { name: '查看电子账本信息' }
  },
  // 查看工商信息
  {
    path: 'business-info/view/:accountId',
    component: BusinessInfoComponent,
    data: { name: '查看工商信息', pageType: PageTypeEnum.READ }
  },
  // 查看经办人信息
  {
    path: 'operator-info/view/:accountId',
    component: OperatorInfoComponent,
    data: { name: '查看经办人信息', pageType: PageTypeEnum.READ }
  },
  // 交易明细
  {
    path: 'trade-detail',
    component: TradeDetailComponent,
    data: { name: '查看交易明细' }
  },
  // 审核开户信息-初审
  {
    path: 'check-account-audit/:accountId',
    component: SupplyAccountInfoComponent,
    data: { name: '审核开户信息', pageType: PageTypeEnum.CHECK_AUDIT }
  },
  // 审核开户信息-复核
  {
    path: 'check-account-review/:accountId',
    component: SupplyAccountInfoComponent,
    data: { name: '审核开户信息', pageType: PageTypeEnum.CHECK_REVIEW }
  },
  // 审核工商信息-初审
  {
    path: 'check-business-audit/:accountId',
    component: BusinessInfoComponent,
    data: { name: '审核工商信息', pageType: PageTypeEnum.CHECK_AUDIT }
  },
  // 审核工商信息-复核
  {
    path: 'check-business-review/:accountId',
    component: BusinessInfoComponent,
    data: { name: '审核工商信息', pageType: PageTypeEnum.CHECK_REVIEW }
  },
  // 审核经办人信息-初审
  {
    path: 'check-operator-audit/:accountId',
    component: OperatorInfoComponent,
    data: { name: '审核经办人信息', pageType: PageTypeEnum.CHECK_AUDIT }
  },
  // 审核经办人信息-复核
  {
    path: 'check-operator-review/:accountId',
    component: OperatorInfoComponent,
    data: { name: '审核经办人信息', pageType: PageTypeEnum.CHECK_REVIEW }
  },
]
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AccountListRoutingModule { }
