import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EstateShanghaiComponent } from './pages/estate-shanghai/estate-shanghai.component';
import { ForbiddenRuleComponent } from './pages/forbidden-rule/forbidden-rule.component';
import { ForbiddenEnterpriseComponent } from './pages/forbidden-enterprise/forbidden-enterprise.component';
import ShangHaidataDockingConfig from './logic/shanghai-data-docking';
import ForbiddenRuleConfig from './logic/forbidden-rule';
import PreRecordConfig from './logic/pre_record';
import ForbiddenEnterpriseConfig from './logic/forbidden-enterprise';
import { ShanghaiDataDockingComponent } from './pages/shanghai-data-docking/shanghai-data-docking.component';
import TodoBankShangHai from './logic/todoBankShangHai';
import ShangHaiAccountConfig from './logic/shanghai-account';
import BatchAddInfoConfig from './logic/batch-add-info';
import { ShanghaiAccountListComponent } from './pages/shanghai-account/shanghai-account-list.component';
import { BatchAddInfoComponent } from './pages/batch-add-info/batch-add-info.component';
import { BusinessStateListComponent } from './pages/business-state/business-state-list.component';
import { BusinessMatchmakerListComponent } from './pages/business-matchmaker-manager/business-matchmaker-list.component';
import { ShanghaiReviewListComponent } from './pages/shanghai-review/shanghai-review-list.component';
import { ReviewProcessComponent } from './pages/shanghai-review/review-process/review-process.component';
import { FilesArchiveComponent } from './pages/files-archive/files-archive.component';
import { NewComponent } from './share/components/record/new.component';
import { RecordComponent } from './share/components/record/record.component';
import { EditComponent } from './share/components/record/edit.component';
import { ViewComponent } from './share/components/record/view.component';
import { FlowDetailComponent } from './share/components/record/flow-detail.component';
import ShOnceContractTemplateTab from './logic/sh-once-contract-template';
import { OncetransferContractManageComponent } from './pages/oncetransfer-contract-manage/oncetransfer-contract-manage.component';
import { ShanghaiSupplierDrawingListComponent } from './pages/drawing-list/drawing-list.component';
import DrawListConfig from './logic/draw-list';
import { PaymentPlanComponent } from './pages/payment-plan/payment-plan.component';
import { ViewProcessComponent } from './pages/shanghai-review/view-process/view-process.component';
import { PuhuiAccountManageComponent } from './pages/puhui-account-manage/puhui-account-manage.component';
import { PuhuiNewComponent } from './share/components/record/puhui/new-puhui.component';
import { PuhuiEditComponent } from './share/components/record/puhui/edit-puhui.component';
import { PuhuiCompanyListComponent } from './pages/puhui-company-list/puhui-company-list.component';
import { PuhuiAccountDetailComponent } from './pages/puhui-company-list/account-detail/account-detail.component';

const routes: Routes = [
  {
    // 链融平台,供应商,上海银行 待办列表-上海银行
    path: 'estate-shanghai/:productIdent',
    component: EstateShanghaiComponent,
    data: { shanghaiTodo: TodoBankShangHai, name: '待办列表-上海银行', isPerson: false }
  },
  {
    // 链融平台,供应商,上海银行 待办列表-上海银行(个人待办)
    path: 'estate-shanghai-person/:productIdent',
    component: EstateShanghaiComponent,
    data: { shanghaiTodo: TodoBankShangHai, name: '待办列表-上海银行', isPerson: true }
  },
  // 链融平台 上海银行-万科数据接口列表
  {
    path: 'data-docking/list',
    component: ShanghaiDataDockingComponent,
    data: { ...ShangHaidataDockingConfig.getConfig('dataDockingList'), name: '上海银行-万科数据接口列表' },
  },
  // 链融平台 上传付款计划
  {
    path: 'pre_record/list',
    component: PaymentPlanComponent,
    data: { ...PreRecordConfig.getConfig('preRecordlist'), name: '上海银行-上传付款计划列表', hideTitle: true },
  },
  // 链融平台 上海银行-业务对接人列表
  {
    path: 'business-matchmaker',
    pathMatch: 'full',
    component: BusinessMatchmakerListComponent,
    data: { name: '上海银行-业务对接人列表' }
  },
  {
    path: 'forbidden',
    children: [{
      // 链融平台 上海银行-万科业务提单禁入规则列表
      path: 'rule-list',
      component: ForbiddenRuleComponent,
      data: { ...ForbiddenRuleConfig.getConfig('forbiddenRuleList'), hideTitle: false, name: '上海银行-万科业务提单禁入规则列表' }
    }, {
      // 万科业务提单禁入企业列表
      path: 'enterprise-list',
      component: ForbiddenEnterpriseComponent,
      data: { ...ForbiddenEnterpriseConfig.getConfig('forbiddenEnterpriseList'), hideTitle: true, name: '禁入企业列表' }
    }]
  },
  // 链融平台,供应商 上海银行-台账列表 platAccountlist supplierAccountlist
  {
    path: 'account-list',
    component: ShanghaiAccountListComponent,
    data: { name: "台账-上海银行" }
  },
  // 供应商 待提现列表
  {
    path: 'draw-list',
    component: ShanghaiSupplierDrawingListComponent,
    data: { ...DrawListConfig.getConfig('drawlist'), hideTitle: false, hideTab: true, name: '待提现列表' }
  },
  // 批量补充信息
  {
    path: 'batch-add-info',
    component: BatchAddInfoComponent,
    data: { name: '批量补充信息' }
  },
  // 链融平台 上海银行-工商状态查看页面
  {
    path: 'view-business',
    component: BusinessStateListComponent,
    data: { name: '上海银行-工商状态查看页面' }
  },
  // 上海银行 上海银行复核列表
  {
    path: 'review-list',
    component: ShanghaiReviewListComponent,
    data: { name: '上海银行复核列表' }
  },
  // // 复核流程
  // {
  //   path: 'review-list/review',
  //   component: ReviewProcessComponent,
  //   data: { name: '复核流程列表' },
  // },
  // 上海银行 上海银行企业文件归档列表
  {
    path: 'file-archive-list',
    component: FilesArchiveComponent,
    data: { name: '上海银行企业文件归档列表' }
  },
  // 上海银行 流程
  {
    path: 'record',
    children: [
      {
        path: 'new/:id/:headquarters',
        pathMatch: 'full',
        component: NewComponent,
        data: { name: '流程开始' }
      },
      {
        path: 'record/:id',
        component: RecordComponent
      },
      {
        path: 'new/:id/:relatedRecordId',
        component: NewComponent
      },
      {
        path: 'new',
        component: NewComponent
      },
      {
        path: ':type/edit/:id',
        component: EditComponent
      },
      {
        path: ':type/view/:id',
        component: ViewComponent
      },
      {
        path: 'view/:id',
        component: ViewComponent
      },
      {
        path: 'bank-review',
        component: ReviewProcessComponent,
        data: { name: '复核流程列表' }
      },
      {
        path: 'bank-view',
        component: ViewProcessComponent,
        data: { name: '复核流程列表' }
      },
    ]
  },
  // 上海银行-交易详情
  {
    path: 'main-list/detail/:id',
    component: FlowDetailComponent,
    data: { name: '交易详情' }
  },
  { // 上海银行--一次转让合同管理
    path: 'oncetransfer-contract-manage',
    component: OncetransferContractManageComponent,
    data: { ...ShOnceContractTemplateTab.getConfig('onceContract'), hideTitle: false, name: '一次转让合同管理' }
  },
  { // 普惠账户管理
    path: 'puhui-account-manage',
    component: PuhuiAccountManageComponent,
  },
  // 上海银行普惠开户流程
  {
    path: 'record',
    children: [
      { // 发起开户申请
        path: 'new/puhui',
        component: PuhuiNewComponent
      },
      {
        path: 'puhui/:type/edit/:id',
        component: PuhuiEditComponent
      },
    ]
  },
  { // 普惠开户企业列表
    path: 'puhui-company-list',
    component: PuhuiCompanyListComponent,
  },
  { // 普惠开户详情
    path: 'puhui-account-detail',
    component: PuhuiAccountDetailComponent,
  },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BankShangHaiRoutingModule { }
