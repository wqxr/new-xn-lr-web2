/*
 * @Description:
 * @Version: 1.0
 * @Author: yutianbao
 * @Date: 2020-11-14 18:06:08
 * @LastEditors: yutianbao
 * @LastEditTime: 2020-12-29 14:41:54
 * @FilePath: \xn-lr-web2\libs\products\bank-shanghai\src\lib\bank-shanghai.module.ts
 * @copyright: Copyright(C) 2017-2020, 深圳市链融科技股份有限公司
 */
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DynamicFormModule } from 'libs/shared/src/lib/common/dynamic-form/dynamic-form.module';
import { PublicModule } from 'libs/shared/src/lib/public/public.module';
import { DragonVankeShareModule } from 'libs/shared/src/lib/public/dragon-vanke/share.module';
import { BankShangHaiRoutingModule } from './bank-shanghai.routing.module';
import { NgZorroAntDModule } from './ng-zorro-antd.module';
import { XnACLModule } from '@lr/ngx-acl';
import { XnFormlyModule } from '@lr/ngx-formly';
import { XnTableModule } from '@lr/ngx-table';
import { XnSharedModule } from '@lr/ngx-shared';

import { BankShanghaiComponent } from './bank-shanghai.component';
import { EstateShanghaiComponent } from './pages/estate-shanghai/estate-shanghai.component';
import { ShanghaiDataDockingComponent } from './pages/shanghai-data-docking/shanghai-data-docking.component';
import { ForbiddenRuleComponent } from './pages/forbidden-rule/forbidden-rule.component';
import { ForbiddenEnterpriseComponent } from './pages/forbidden-enterprise/forbidden-enterprise.component';
import { ShanghaiReviewListComponent } from './pages/shanghai-review/shanghai-review-list.component';
import { ShanghaiAccountListComponent } from './pages/shanghai-account/shanghai-account-list.component';
import { BatchAddInfoComponent } from './pages/batch-add-info/batch-add-info.component';
import { BusinessStateListComponent } from './pages/business-state/business-state-list.component';
import { BusinessMatchmakerListComponent } from './pages/business-matchmaker-manager/business-matchmaker-list.component';
import { ReviewProcessComponent } from './pages/shanghai-review/review-process/review-process.component';
import { ViewProcessComponent } from './pages/shanghai-review/view-process/view-process.component';
import { FilesArchiveComponent } from './pages/files-archive/files-archive.component';
import { ShangHaiHomeCommListComponent } from './pages/home-list/home-comm-list.component';
import { ShanghaiSupplierDrawingListComponent } from './pages/drawing-list/drawing-list.component';

import { NzIconModule } from 'ng-zorro-antd/icon';
import { IconDefinition } from '@ant-design/icons-angular';
import * as AllIcons from '@ant-design/icons-angular/icons';
import { BankShanghaiShareModule } from './share/share.module';
import { OncetransferContractManageComponent } from './pages/oncetransfer-contract-manage/oncetransfer-contract-manage.component';
import { PaymentPlanComponent } from './pages/payment-plan/payment-plan.component';
import { PuhuiAccountManageComponent } from './pages/puhui-account-manage/puhui-account-manage.component';
import { PuhuiCompanyListComponent } from './pages/puhui-company-list/puhui-company-list.component';
import { PuhuiAccountDetailComponent } from './pages/puhui-company-list/account-detail/account-detail.component';

const antDesignIcons = AllIcons as {
  [key: string]: IconDefinition;
};
const ICONS = Object.keys(antDesignIcons).map((key) => antDesignIcons[key]);

const COMPONENTS = [
  BankShanghaiComponent,
  EstateShanghaiComponent,
  ShanghaiDataDockingComponent,
  ForbiddenRuleComponent,
  ForbiddenEnterpriseComponent,
  ShanghaiReviewListComponent,
  ShanghaiAccountListComponent,
  BatchAddInfoComponent,
  BusinessStateListComponent,
  BusinessMatchmakerListComponent,
  ReviewProcessComponent,
  ViewProcessComponent,
  FilesArchiveComponent,
  ShangHaiHomeCommListComponent,
  OncetransferContractManageComponent,
  ShanghaiSupplierDrawingListComponent,
  PaymentPlanComponent,
  PuhuiAccountManageComponent,
  PuhuiCompanyListComponent,
  PuhuiAccountDetailComponent
];

/**
 *  外部可用模块
 */
const EXPORT_MODULE = [
  BankShanghaiShareModule
];

@NgModule({
  declarations: [
    ...COMPONENTS,
  ],
  imports: [
    CommonModule,
    DynamicFormModule,
    PublicModule,
    DragonVankeShareModule,
    BankShangHaiRoutingModule,
    NgZorroAntDModule,
    NzIconModule.forChild(ICONS),
    XnACLModule,
    XnFormlyModule.forRoot(),
    XnTableModule,
    XnSharedModule,
    ...EXPORT_MODULE
  ],
  exports: [
    ...COMPONENTS,
    ...EXPORT_MODULE
  ],
})
export class BankShanghaiModule { }
