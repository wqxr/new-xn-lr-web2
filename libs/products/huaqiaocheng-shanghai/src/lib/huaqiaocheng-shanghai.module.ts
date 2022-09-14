import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DynamicFormModule } from 'libs/shared/src/lib/common/dynamic-form/dynamic-form.module';
import { PublicModule } from 'libs/shared/src/lib/public/public.module';
import { DragonVankeShareModule } from 'libs/shared/src/lib/public/dragon-vanke/share.module';
import { HuaQiaoShangHaiRoutingModule } from './huaqiaocheng-shanghai.routing.module';
import { NgZorroAntDModule } from './ng-zorro-antd.module';
import { XnACLModule } from '@lr/ngx-acl';
import { XnFormlyModule } from '@lr/ngx-formly';
import { XnTableModule } from '@lr/ngx-table';
import { XnSharedModule } from '@lr/ngx-shared';

import { HuaqiaochengShanghaiComponent } from './huaqiaocheng-shanghai.component';
import { OctEstateShanghaiComponent } from './pages/estate-shanghai/estate-shanghai.component';
import { OctShanghaiReviewListComponent } from './pages/shanghai-review/shanghai-review-list.component';
import { OctShanghaiAccountListComponent } from './pages/shanghai-account/shanghai-account-list.component';
import { OctBusinessStateListComponent } from './pages/business-state/business-state-list.component';
import { OctBusinessMatchmakerListComponent } from './pages/business-matchmaker-manager/business-matchmaker-list.component';
import { OctReviewProcessComponent } from './pages/shanghai-review/review-process/review-process.component';
import { OctViewProcessComponent } from './pages/shanghai-review/view-process/view-process.component';
import { OctFilesArchiveComponent } from './pages/files-archive/files-archive.component';
import { OctShangHaiHomeCommListComponent } from './pages/home-list/home-comm-list.component';
import { OctShanghaiSupplierDrawingListComponent } from './pages/drawing-list/drawing-list.component';

import { NzIconModule } from 'ng-zorro-antd/icon';
import { IconDefinition } from '@ant-design/icons-angular';
import * as AllIcons from '@ant-design/icons-angular/icons';
import { OctBankShanghaiShareModule } from './share/share.module';
import { OctPaymentPlanComponent } from './pages/payment-plan/payment-plan.component';
import { OctPuhuiAccountManageComponent } from './pages/puhui-account-manage/puhui-account-manage.component';
import { OctPuhuiCompanyListComponent } from './pages/puhui-company-list/puhui-company-list.component';
import { OctPuhuiAccountDetailComponent } from './pages/puhui-company-list/account-detail/account-detail.component';

const antDesignIcons = AllIcons as {
  [key: string]: IconDefinition;
};
const ICONS = Object.keys(antDesignIcons).map((key) => antDesignIcons[key]);

const COMPONENTS = [
  HuaqiaochengShanghaiComponent,
  OctEstateShanghaiComponent,
  OctShanghaiReviewListComponent,
  OctShanghaiAccountListComponent,
  OctBusinessStateListComponent,
  OctBusinessMatchmakerListComponent,
  OctReviewProcessComponent,
  OctViewProcessComponent,
  OctFilesArchiveComponent,
  OctShangHaiHomeCommListComponent,
  OctShanghaiSupplierDrawingListComponent,
  OctPaymentPlanComponent,
  OctPuhuiAccountManageComponent,
  OctPuhuiCompanyListComponent,
  OctPuhuiAccountDetailComponent
];

/**
 *  外部可用模块
 */
const EXPORT_MODULE = [
  OctBankShanghaiShareModule
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
    HuaQiaoShangHaiRoutingModule,
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
export class HuaqiaochengShanghaiModule { }
