import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { VankeEnterpoolComponent } from './pages/assets-management/enter-capital-tool/enter-capital-pool-confirmation.component';
import vankeEnterPoolConfig from './common/enter-pool-capital';
import { TransferContractManagerComponent } from './pages/assets-management/contract-template/contract-template.component';
import secondContractTemplateTab from './common/second-contract-template.tab';
import { RecordVankeComponent } from './pages/record-vanke/record-vanke.component';
import { VankeAvengerListComponent } from './pages/approval-list/avenger-list.component';
import { VankeProjectmanageComponent } from './pages/assets-management/vanke-project-manager/vanke-project-management.component';
import { VankeProjectmanagePlanComponent } from './pages/assets-management/vanke-project-manager/vanke-project-plan-list/vanke-project-plan-list.component';
import { VankeCapitalpoolComponent } from './pages/assets-management/vanke-project-manager/vanke-capital-pool/vanke-capital-pool.component';
import VankeNoticeManageList from './pages/assets-management/vanke-project-manager/vanke-notice-manage/vanke-notice-manage'

import MachineIndexTabConfig from './pages/machine-list/machine-list.config';
import { DemoListComponent } from './pages/machine-list/machine-list.component';
import { VankeUploadPaymentsComponent } from './pages/upload-payment-confirmation/upload-payment-confirmation.component';
import VankepaymentTabConfig from './pages/upload-payment-confirmation/upload-payment-confirmation'
import ProjectManagerList from './common/project-management'
import ProjectManagerplanList from './pages/assets-management/vanke-project-manager/vanke-project-plan-list/vanke-project-plan'
import ProjectManagerCapitalList from './pages/assets-management/vanke-project-manager/vanke-capital-pool/vanke-capital-pool'
import ApprovallistIndexTabConfig from './pages/approval-list/approval-list-table';

import { EstateVankeComponent } from './pages/estate-vanke/vanke.component';
import TodoXnVanke from './TodoXnVanke';
import { VankeDatalockingComponent } from './pages/vanke-data-docking/vanke-data-docking.component';
import VankedataDockingConfig from './pages/vanke-data-docking/vanke-data.docking'
import { BusinessMatchmakerListComponent } from './pages/business-matchmaker-manager/business-matchmaker-list.component';

import DragonpaymentDownloadTabConfig from './common/download-payment-confirmation';
import { DragonDownloadPaymentsComponent } from './pages/download-payment-confirmation/download-payment-confirmation.component'
import { VankeNoticeManageComponent } from './pages/assets-management/vanke-project-manager/vanke-notice-manage/vanke-notice-manage-list.component';
import { CapitalSampleComponent } from './pages/assets-management/vanke-project-manager/capital-sample/capital-sample.component';
import { CapitalDataAnalyseComponent } from './pages/assets-management/vanke-project-manager/capital-data-analyse/capital-data-analyse.component';
import { VankeCapitalPoolCommListComponent } from './pages/trading-list/capital-pool-comm-list.component';
import CapitalPoolTradingList from './pages/trading-list/capital-pool-trading-list';
import { CapitalPoolUnhandledListComponent } from './pages/capital-pool-unhandled-list/capital-pool-unhandled-list.component';
import CapitalPoolUnhandledMainList from './pages/capital-pool-unhandled-list/capital-pool-unhandled-main-list'
import onceContractTemplateTab from './common/once-contract-template.tab';
import { XNVankeNewComponent } from './shared/components/record/new.component';
import { XNVankeRecordComponent } from './shared/components/record/record.component';
import { XNVankeEditComponent } from './shared/components/record/edit.component';
import { XNVankeViewComponent } from './shared/components/record/view.component';
import { FlowDetailLogsComponent } from 'libs/products/new-agile/src/lib/share/components/flow/flow-detail-logs.component';
const routes: Routes = [
    {
        // 地产业务列表-万科
        path: 'estate-vanke/:productIdent',
        component: EstateVankeComponent,
        data: { dragonTodo: TodoXnVanke, isPerson: false }
    },
    {
        // 保理通-万科-香纳（个人待办）
        path: 'estate-vanke-person/:productIdent',
        component: EstateVankeComponent,
        data: { dragonTodo: TodoXnVanke, isPerson: true }
    },
    {
        // 房地产供应链标准保理
        path: 'pre_record/:id',
        pathMatch: 'full',
        component: RecordVankeComponent
    },
    {
        // 万科审批放款
        path: 'approval_list',
        component: VankeAvengerListComponent,
        data: ApprovallistIndexTabConfig.getConfig('avenger')
    },
    {
        // 资产管理
        path: 'assets-management',
        children: [{
            // 拟入池交易列表
            path: 'enter-pool',
            component: VankeEnterpoolComponent,
            data: vankeEnterPoolConfig.get('enterPoolList'),
        },
        {   // 二次转让合同管理
            path: 'secondtransfer-contract-manage',
            component: TransferContractManagerComponent,
            data: { ...secondContractTemplateTab.getConfig('secondContract'), hideTitle: false }
        },
        { // 项目列表
            path: 'project-list',
            component: VankeProjectmanageComponent,
            // data: ProjectManagerList.getConfig('projectManager'),
        },
        { // 项目列表-专项计划列表
            path: 'projectPlan-management',
            component: VankeProjectmanagePlanComponent,
            // data: ProjectManagerplanList.getConfig('projectplanManager'),
        },
        { // 项目列表-专项计划列表-交易列表-基础资产、交易文件、尽职调查、产品信息
            path: 'capital-pool',
            component: VankeCapitalpoolComponent,
            // data: ProjectManagerCapitalList.getConfig('vankeCapitallist'),
        },
        { // 项目列表-提醒管理
            path: 'notice-manage',
            component: VankeNoticeManageComponent,
            data: VankeNoticeManageList.getConfig('tabConfig'),
        },
        { // 抽样页面
            path: 'capital-sample',
            component: CapitalSampleComponent
        },
        { // 数据分析页面
            path: 'capital-data-analyse',
            component: CapitalDataAnalyseComponent
        },
        ],
    },
    {
        // 万科台账
        path: 'machine_list',
        component: DemoListComponent,
        data: MachineIndexTabConfig.getConfig()
    },
    { // 一次转让合同管理
      path: 'oncetransfer-contract-manage',
      component: TransferContractManagerComponent,
      data: { ...onceContractTemplateTab.getConfig('onceContract'), hideTitle: false }
    },
    // 万科上传付确
    {
        path: 'confirmation-list',
        pathMatch: 'full',
        component: VankeUploadPaymentsComponent,
        data: VankepaymentTabConfig.getConfig('dragon')
    },
    // 万科数据对接-数据接口列表
    {
        path: 'data-docking/list',
        component: VankeDatalockingComponent,
        data: VankedataDockingConfig.getConfig('dataDockingList'),
    },
    { // 万科数据对接-业务对接人配置列表
        path: 'business-matchmaker',
        pathMatch: 'full',
        component: BusinessMatchmakerListComponent,
    },
    // 下载付确
    {
        path: 'confirmation-download',
        pathMatch: 'full',
        component: DragonDownloadPaymentsComponent,
        data: { ...DragonpaymentDownloadTabConfig.getConfig('download_payconfirm'), hideTitle: false }
    },
    { // 老资产池 - 交易列表（用于查看老资产）
        path: 'trading-list',
        component: VankeCapitalPoolCommListComponent,
        data: CapitalPoolTradingList,
        runGuardsAndResolvers: 'always',
    },
    { // 老资产池 - 未入池交易列表（用于老资产添加交易）
        path: 'unhandled-list',
        component: CapitalPoolUnhandledListComponent,
        data: CapitalPoolUnhandledMainList
    },

  {
    // 流程
    path: 'record',
    children: [
      {
        path: 'new/:id/:headquarters',
        pathMatch: 'full',
        component: XNVankeNewComponent,
      },
      {
        path: 'record/:id',
        component: XNVankeRecordComponent
      },
      {
        path: 'new/:id/:relatedRecordId',
        component: XNVankeNewComponent
      },
      {
        path: 'new',
        component: XNVankeNewComponent
      },
      {
        path: ':type/edit/:id',
        component: XNVankeEditComponent
      },
      {
        path: ':type/view/:id',
        component: XNVankeViewComponent
      },
      {
        path: 'view/:id',
        component: XNVankeViewComponent
      },
    ]
  },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class NewVankeRoutingModule { }
