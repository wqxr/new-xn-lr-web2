/*************************************************************************
 * Copyright (c) 2017 - 2021 深圳市链融科技股份有限公司
 * Shenzhen Lianrong Technology Co., Ltd.
 * All rights reserved.
 *
 * @file：libs\console\src\lib\management\management-routing.module.ts
 * @summary：management-routing.module.ts
 * @version: 1.0
 * *************************************************************************
 * revision             author            reason             date
 * 1.0                  DengPei           init               2021-07-12
 ***************************************************************************/
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { UserManageComponent } from './user-manage/user-manage.component';
import { UserManageRelateRightComponent } from './user-manage-relate-right/user-manage-relate-right.component';
import { RoleManageComponent } from './role-manage/role-manage.component';
import UploadInvoicePdf from 'libs/shared/src/lib/logic/upload-inovice-pdf';
import { CommListComponent } from 'libs/shared/src/lib/public/component/comm-list.component';
import { ManageIntermediaryManagementComponent } from './intermediary-management/intermediary-management-list.componment';
import { DragonIntermediaryUserManagementComponent } from './intermediary-management/intermediary-user-management/intermediary-user-management-list.componment';

import IntermediaryManagementTabConfig from './common/intermediary-management';
import IntermediaryUserManagementTabConfig from './common/intermediary-user-management';
import { ExportDataComponent } from './export-data/export-data.component';
import { PortalManageComponent } from './portal-manage/portal-manage.component';
import { PortalListManageComponent } from './portal-manage/portal-list-manage.component';
import { PowerManageComponent } from './power-manage/power-manage.component';
import { ModeModificationComponent } from './mode-modification/mode-modification.component';
import { WhiteListManageComponent } from './white-list-manage/white-list-manage.component';
import CreateAuth from 'libs/shared/src/lib/logic/create-auth';
import { SystemUpdateComponent } from './system-update/system-update.component';
import { SamplingmanageComponent } from './sampling-manager/samping-manager-list.component';
import { ModuleListAddComponent } from './sampling-manager/module-list/module-list-add.component';
import { ModuleListLookComponent } from './sampling-manager/module-list/module-list-look.component';
import { RuleListAddComponent } from './sampling-manager/rule-list/rule-list-add.component';
import { RuleListLookComponent } from './sampling-manager/rule-list/rule-list-look.component';
import SamplingManagerList from './common/sampling-management';
import onceContractTemplateTab from './common/once-contract-template.tab';
import { TransferContractManagerComponent } from './contract-template/contract-template.component';
import { AddCompanyComponent } from './add-company/add-company.component';
import { BankAccountManageComponent } from './bank-account-manage/bank-account-manage.component';
import BankAccountManageTabConfig from './common/bank-account-manage';

import { InvoiceCheckListComponent } from './invoice-check-list/invoice-check-list.component';
import InvoiceCheckListData from './invoice-check-list/invoice-check-list.data';
import { InvoiceSearchListComponent } from './invoice-check-list/invoice-search-list.component';
import { InvoiceSearchDetailComponent } from './invoice-check-list/invoice-search-detail.component';
import { ZdSearchComponent } from './zhongdeng-invoice/zd-search/zd-search-component';
import ZdSearchData from './zhongdeng-invoice/zd-search/zd-search-data';
import { ZhongdengRecordViewComponent } from './zhongdeng-invoice/zd-search/zd-record/zd-record-component';
import { ZdUpdateComponent } from './zhongdeng-invoice/zd-update/zd-update-component';
import { ZdChangeNewComponent } from './zhongdeng-invoice/zd-change/zd-change-new-component';
import { ZdRecordComponent } from './zhongdeng-invoice/zd-change/zd-change-record-component';
import { ZdEditComponent } from './zhongdeng-invoice/zd-change/zd-change-edit-component';
import { ZdViewComponent } from './zhongdeng-invoice/zd-change/zd-change-view-component';
import { ZdOperateComponent } from './zhongdeng-invoice/zd-operate-list/zd-operate-component';
import { ZdRejectComponent } from './zhongdeng-invoice/zd-reject-list/zd-reject-component';
import ZdOperateData from './zhongdeng-invoice/zd-operate-list/zd-operate-data';
import ZdRejectData from './zhongdeng-invoice/zd-reject-list/zd-reject-data';
import { InvoceSearchRecordComponent } from './zhongdeng-invoice/invoceSearch/invoce-Search-component';
import { InvoceSingleInfoComponent } from './zhongdeng-invoice/invoceSearch/invoce-single-info-component';
import { ZdChangedemoComponent } from './zhongdeng-invoice/zd-search/zd-change-price-demo/zd-change-price-demo.component';
import { InvoiceSearchComponent } from './invoice-search/invoice-search.component';
import { ReconciliationManageComponent } from './reconciliation-manage/reconciliation-manage.component';
import { CfcaSignListComponent } from './common-cfca-signlist/common-cfca-signlist.component';
import CfcaSignConfig from './common-cfca-signlist/common-cfcalist-data';
import { EstateSignComponent } from './common-cfca-signlist/sign-estate/sign-estate.component';
import CfcaSignEstateConfig from './common-cfca-signlist/sign-estate/todo-sign';
import { ModeEditRelateRightComponent } from './mode-edit-relate-right/mode-edit-relate-right.component';
import { ScreenshotInvoiceComponent } from './screenshot-invoice/screenshot-invoice-list.component';
import { DetailScreenshotInvoiceComponent } from './screenshot-invoice/detail-screenshot-invoice/detail-screenshot-invoice.component';
import {ZdSearchRecordComponent} from './zhongdeng-invoice/zd-search-record/zd-search-record.component';
import {ZdSearchRecordDetailComponent} from './zhongdeng-invoice/zd-search-record/zd-search-record-detail/zd-search-record-detail.component';
import { StatisticsComponent } from './statistics/statistics.component'
import { InvoiceViewPlatComponent } from './plat-invoice-view/view-invoice.component';
import { VankeDocumentFeedbackComponent } from './vanke-document-feedback/vanke-document-feedback.component';
import { EntryCertifyComponent } from './cettify-file-manage/entry-certify-file/entry-certify-file.component';
import { EstateCertifyComponent } from './cettify-file-manage/estate-certify-file/estate-certify-file.component';
import TodoCertify from './cettify-file-manage/estate-certify-file/estate-certify-file';
const routes: Routes = [
  { // 用户权限
    path: 'user-manage',
    component: UserManageComponent
  },
  { // 用户管理关联到权限系统
    path: 'user-manage-relate-right',
    component: UserManageRelateRightComponent
  },
  { // 角色权限
    path: 'role-manage',
    component: RoleManageComponent
  },
  { // 上传中登网文件
    path: 'upload-invoice-pdf',
    component: CommListComponent,
    data: UploadInvoicePdf
  },
  // 通用签章列表
  {
    path: 'common/signlist',
    component: CfcaSignListComponent,
    data: CfcaSignConfig.getConfig('cfcaSignsearch')
  },
  {
    // 通用签章待办
    path: 'eatate-sign/:productIdent',
    component: EstateSignComponent,
    data: CfcaSignEstateConfig.getConfig('cfcaSignEstatesearch')
  },
  {
    // 中登查询
    path: 'invoice-search',
    children: [
      {
        path: 'main/list',
        component: ZdSearchComponent,
        data: ZdSearchData.getConfig('zhongdengsearch'),
      },
      {
        path: 'record',  // 批量查询发票记录表
        component: InvoceSearchRecordComponent
      },
      {
        path: 'record/single',  // 详情发票记录
        component: InvoceSingleInfoComponent,
      },
      {
        path: 'records/list',
        component: ZhongdengRecordViewComponent,
      },
      {
        path: 'records/search/list',
        component: ZdSearchRecordComponent,
      },
      {
        path: 'records/search/detail/:id',
        component: ZdSearchRecordDetailComponent,
      },
      {
        path: 'record/:id',
        component: ZdRecordComponent,
      },
      {
        path: 'record/:type/edit/:id',
        component: ZdEditComponent,
      },
      {
        path: 'record/:type/view/:id',
        component: ZdViewComponent,
      },
      { // 发票查询
        path: 'new/change-zd',
        component: ZdChangeNewComponent,
      },
      {
        path: 'update-zd',
        component: ZdUpdateComponent,
      },
      {
        path: 'operate-zd',
        component: ZdOperateComponent,
        data: ZdOperateData.getConfig('zhongdengsearch')

      },
      {
        path: 'reject-zd',
        component: ZdRejectComponent,
        data: ZdRejectData.getConfig('zhongdengsearch')

      },
      {
        path: 'zd/changeprice/demo',
        component: ZdChangedemoComponent,
      },
      {
        path: 'old/main/list',
        component: InvoiceSearchComponent,
      }
    ]
  },
  {
    // 批量获取发票截图
    path: 'screenshot-invoice',
    children: [
      {
        path: 'list',
        component: ScreenshotInvoiceComponent,
      },
      {
        path: 'detail/:id',  // 批量获取发票截图详情
        component: DetailScreenshotInvoiceComponent,
      },
    ]
  },
  // {
  //   path: 'screenshot-invoice',
  //   component: ScreenshotInvoiceComponent,
  // },
  // 中介机构管理
  {
    path: 'intermediary',
    children: [{
      path: 'intermediary-list',
      component: ManageIntermediaryManagementComponent,  // ManageIntermediaryManagementComponent,
      data: { ...IntermediaryManagementTabConfig.getConfig('intermediary'), hideTitle: false } // IntermediaryManagementTabConfig
    }, {
      path: 'intermediary-user-list',
      component: DragonIntermediaryUserManagementComponent,
      data: { ...IntermediaryUserManagementTabConfig.getConfig('intermediary'), hideTitle: true }
    }]
  },

  { // 数据导出
    path: 'export-data',
    component: ExportDataComponent
  },
  { // 审核机构创建
    path: 'record/create_auth',
    component: CommListComponent,
    data: CreateAuth
  },
  { // 审核机构创建
    path: 'record/create_company',
    component: AddCompanyComponent,
  },
  { // 门户管理
    path: 'portal-manage',
    component: PortalManageComponent
  },
  { // 对账管理
    path: 'reconciliation-management',
    // path: 'portal-manage',
    component: ReconciliationManageComponent
  },
  {
    path: 'manage/portal-manage/:id',
    component: PortalListManageComponent
  },
  { // 接口管理
    path: 'power-manage',
    component: PowerManageComponent
  },
  { // 保后管理-普惠通
    path: 'guarant-manage',
    // tslint:disable-next-line: max-line-length
    loadChildren: () => import('libs/products/avenger/src/lib/guarant-management/guarant-management.module').then(m => m.GuarantManagementModule),
  },
  { // 合同管理-普惠通
    path: 'contract-manage',
    loadChildren: () => import('libs/products/avenger/src/lib/contract-manage/contract-manage.module')
      .then(m => m.ContractManageModule),
  },
  { // 模式修改【产品配置】
    path: 'mode-modification',
    component: ModeModificationComponent
  },
  { // 模式修改【产品配置】关联到权限系统
    path: 'mode-edit-relate-right',
    component: ModeEditRelateRightComponent
  },
  { // 白名单管理
    path: 'white-list-manage',
    component: WhiteListManageComponent
  },
  { // 一次转让合同管理
    path: 'oncetransfer-contract-manage',
    component: TransferContractManagerComponent,
    data: { ...onceContractTemplateTab.getConfig('onceContract'), hideTitle: false }
  },
  {
    // 抽样模型管理
    path: 'sampling',
    children: [
      {
        // 管理列表
        path: 'management-list',
        component: SamplingmanageComponent,
        data: SamplingManagerList.getConfig('projectManager'),
      },
      { // 模型列表-新增抽样模型
        path: 'add-newModule',
        component: ModuleListAddComponent,
        data: SamplingManagerList.getConfig('addModule'),
      },
      { // 模型列表-查看抽样模型
        path: 'look-newModule',
        component: ModuleListLookComponent,
        data: SamplingManagerList.getConfig('lookModule'),
      },
      { // 规则列表-新增规则
        path: 'add-newRule',
        component: RuleListAddComponent,
        data: SamplingManagerList.getConfig('addRule'),
      },
      { // 规则列表-查看规则
        path: 'look-newRule',
        component: RuleListLookComponent,
        data: SamplingManagerList.getConfig('lookRule'),
      },
    ]
  },
  { // 通用通知功能
    path: 'system-update',
    component: SystemUpdateComponent
  },
  { // 银行账户维护
    path: 'bank-account-manage',
    component: BankAccountManageComponent,
    data: BankAccountManageTabConfig.getConfig('bankAccountManage'),
  },
  {
    // 发票查验
    path: 'invoice-check-list',
    component: InvoiceCheckListComponent,
    data: InvoiceCheckListData.getConfig('invoiceCheck'),
  },
  {
    // 发票批量查询
    path: 'invoice-check-list/search',
    component: InvoiceSearchListComponent,
  },
  {
    // 发票批量查询详情
    path: 'invoice-check-list/search/detail',
    component: InvoiceSearchDetailComponent,
  },
  {
    // 埋点数据分析
    path: 'statistics',
    component: StatisticsComponent,
  },
  // 平台查看发票
  {
    path:'plat/invoice-view/:id',
    component:InvoiceViewPlatComponent
  },
  // 万科问题反馈
  {
    path: 'vanke-document-feedback',
    component: VankeDocumentFeedbackComponent,
  },
  /** 资质文件录入 */
  {
    path:'entry-certfile',
    component:EntryCertifyComponent
  },
  {
    // 地产业务列表-资质文件审核待办
    path: 'estate-certfile/:productIdent',
    component: EstateCertifyComponent,
    data:TodoCertify.getConfig('certifyEstatesearch')
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ManagementRoutingModule { }
