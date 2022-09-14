import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { OctEstateShanghaiComponent } from './pages/estate-shanghai/estate-shanghai.component';
import PreRecordConfig from './logic/pre_record';
import TodoBankShangHai from './logic/todoBankShangHai';
import { OctShanghaiAccountListComponent } from './pages/shanghai-account/shanghai-account-list.component';
import { OctBusinessStateListComponent } from './pages/business-state/business-state-list.component';
import { OctBusinessMatchmakerListComponent } from './pages/business-matchmaker-manager/business-matchmaker-list.component';
import { OctShanghaiReviewListComponent } from './pages/shanghai-review/shanghai-review-list.component';
import { OctReviewProcessComponent } from './pages/shanghai-review/review-process/review-process.component';
import { OctFilesArchiveComponent } from './pages/files-archive/files-archive.component';
import { OctNewComponent } from './share/components/record/new.component';
import { OctRecordComponent } from './share/components/record/record.component';
import { OctEditComponent } from './share/components/record/edit.component';
import { OctViewComponent } from './share/components/record/view.component';
import { OctFlowDetailComponent } from './share/components/record/flow-detail.component';
import { OctShanghaiSupplierDrawingListComponent } from './pages/drawing-list/drawing-list.component';
import DrawListConfig from './logic/draw-list';
import { OctPaymentPlanComponent } from './pages/payment-plan/payment-plan.component';
import { OctViewProcessComponent } from './pages/shanghai-review/view-process/view-process.component';
import { OctPuhuiAccountManageComponent } from './pages/puhui-account-manage/puhui-account-manage.component';
import { OctPuhuiNewComponent } from './share/components/record/puhui/new-puhui.component';
import { OctPuhuiEditComponent } from './share/components/record/puhui/edit-puhui.component';
import { OctPuhuiCompanyListComponent } from './pages/puhui-company-list/puhui-company-list.component';
import { OctPuhuiAccountDetailComponent } from './pages/puhui-company-list/account-detail/account-detail.component';

const routes: Routes = [
  {
    // 链融平台,供应商,上海银行 待办列表-上海银行华侨城
    path: 'estate-shanghai/:productIdent',
    component: OctEstateShanghaiComponent,
    data: { shanghaiTodo: TodoBankShangHai, name: '待办列表-上海银行', isPerson: false }
  },
  {
    // 链融平台,供应商,上海银行个人待办列表-上海银行华侨城
    path: 'estate-shanghai-person/:productIdent',
    component: OctEstateShanghaiComponent,
    data: { shanghaiTodo: TodoBankShangHai, name: '待办列表-上海银行', isPerson: true }
  },
  // 链融平台 上传付款计划
  {
    path: 'pre_record/list',
    component: OctPaymentPlanComponent,
    data: { ...PreRecordConfig.getConfig('preRecordlist'), name: '华侨城-上海银行-上传付款计划列表', hideTitle: true },
  },
  // 链融平台 上海银行-业务对接人列表
  {
    path: 'business-matchmaker',
    pathMatch: 'full',
    component: OctBusinessMatchmakerListComponent,
    data: { name: '上海银行-业务对接人列表' }
  },
  // 链融平台,供应商 上海银行-台账列表 platAccountlist supplierAccountlist
  {
    path: 'account-list',
    component: OctShanghaiAccountListComponent,
    data: { name: "台账-华侨城-上海银行" }
  },
  // 供应商 待提现列表
  {
    path: 'draw-list',
    component: OctShanghaiSupplierDrawingListComponent,
    data: { ...DrawListConfig.getConfig('drawlist'), hideTitle: false, hideTab: true, name: '待提现列表' }
  },
  // 链融平台 上海银行-工商状态查看页面
  {
    path: 'view-business',
    component: OctBusinessStateListComponent,
    data: { name: '上海银行-工商状态查看页面' }
  },
  // 上海银行 上海银行复核列表
  {
    path: 'review-list',
    component: OctShanghaiReviewListComponent,
    data: { name: '上海银行复核列表' }
  },
  // 上海银行 上海银行企业文件归档列表
  {
    path: 'file-archive-list',
    component: OctFilesArchiveComponent,
    data: { name: '上海银行企业文件归档列表' }
  },
  // 上海银行 流程(包括上海银行普惠开户流程)
  {
    path: 'record',
    children: [
      {
        path: 'new/:id/:headquarters',
        pathMatch: 'full',
        component: OctNewComponent,
        data: { name: '流程开始' }
      },
      {
        path: 'new/:id',
        pathMatch: 'full',
        component: OctNewComponent,
      },
      {
        path: 'record/:id',
        component: OctRecordComponent
      },
      {
        path: 'new/:id/:relatedRecordId',
        component: OctNewComponent
      },
      {
        path: 'new',
        component: OctNewComponent
      },
      {
        path: ':type/edit/:id',
        component: OctEditComponent
      },
      {
        path: ':type/view/:id',
        component: OctViewComponent
      },
      {
        path: 'view/:id',
        component: OctViewComponent
      },
      {
        path: 'bank-review',
        component: OctReviewProcessComponent,
        data: { name: '复核流程列表' }
      },
      {
        path: 'bank-view',
        component: OctViewProcessComponent,
        data: { name: '复核流程列表' }
      },
      { // 发起开户申请
        path: 'puhui/new',
        component: OctPuhuiNewComponent
      },
      {
        path: 'puhui/:type/edit/:id',
        component: OctPuhuiEditComponent
      },
    ]
  },
  // 上海银行-交易详情
  {
    path: 'main-list/detail/:id',
    component: OctFlowDetailComponent,
    data: { name: '交易详情' }
  },
  { // 普惠账户管理
    path: 'puhui-account-manage',
    component: OctPuhuiAccountManageComponent,
  },
  { // 普惠开户企业列表
    path: 'puhui-company-list',
    component: OctPuhuiCompanyListComponent,
  },
  { // 普惠开户详情
    path: 'puhui-account-detail',
    component: OctPuhuiAccountDetailComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HuaQiaoShangHaiRoutingModule { }
