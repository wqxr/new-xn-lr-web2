import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HuaQiaoCityEnterpoolComponent } from './pages/assets-management/enter-capital-tool/enter-capital-pool-confirmation.component';
import vankeEnterPoolConfig from './common/enter-pool-capital';
import { TransferContractManagerComponent } from './pages/assets-management/contract-template/contract-template.component';
import secondContractTemplateTab from './common/second-contract-template.tab';
import { RecordHuaQiaoCityComponent } from './pages/record-huaqiao-city/record-huaqiao-city.component';
import { HuaQiaoCityAvengerListComponent } from './pages/approval-list/avenger-list.component';
import { HuaQiaoCityProjectmanageComponent } from './pages/assets-management/huaqiao-city-project-manager/huaqiao-city-project-management.component';
import { HuaQiaoCityProjectmanagePlanComponent } from './pages/assets-management/huaqiao-city-project-manager/huaqiao-city-project-plan-list/huaqiao-city-project-plan-list.component';
import { HuaQiaoCityCapitalpoolComponent } from './pages/assets-management/huaqiao-city-project-manager/huaqiao-city-capital-pool/huaqiao-city-capital-pool.component';
import VankeNoticeManageList from './pages/assets-management/huaqiao-city-project-manager/huaqiao-city-notice-manage/huaqiao-city-notice-manage'

import MachineIndexTabConfig from './pages/machine-list/machine-list.config';
import { DemoListComponent } from './pages/machine-list/machine-list.component';
import { HuaQiaoCityUploadPaymentsComponent } from './pages/upload-payment-confirmation/upload-payment-confirmation.component';
import VankepaymentTabConfig from './pages/upload-payment-confirmation/upload-payment-confirmation'
import ProjectManagerList from './common/project-management';
import ProjectManagerplanList from './pages/assets-management/huaqiao-city-project-manager/huaqiao-city-project-plan-list/huaqiao-city-project-plan';
import ProjectManagerCapitalList from './pages/assets-management/huaqiao-city-project-manager/huaqiao-city-capital-pool/huaqiao-city-capital-pool';
import ApprovallistIndexTabConfig from './pages/approval-list/approval-list-table';
import TodoHuaQiaoCity from './TodoHuaqiao';
import { HuaQiaoCityDatalockingComponent } from './pages/huaqiao-city-data-docking/huaqiao-city-data-docking.component';
import VankedataDockingConfig from './pages/huaqiao-city-data-docking/huaqiao-city-data.docking'
import { BusinessMatchmakerListComponent } from './pages/business-matchmaker-manager/business-matchmaker-list.component';

import DragonpaymentDownloadTabConfig from './common/download-payment-confirmation';
import { DragonDownloadPaymentsComponent } from './pages/download-payment-confirmation/download-payment-confirmation.component';
import { HuaQiaoCityNoticeManageComponent } from './pages/assets-management/huaqiao-city-project-manager/huaqiao-city-notice-manage/huaqiao-city-notice-manage-list.component';
import { CapitalSampleComponent } from './pages/assets-management/huaqiao-city-project-manager/capital-sample/capital-sample.component';
import { CapitalDataAnalyseComponent } from './pages/assets-management/huaqiao-city-project-manager/capital-data-analyse/capital-data-analyse.component';
import CapitalPoolTradingList from './pages/trading-list/capital-pool-trading-list';
import { EstateHuaQiaoCityComponent } from './pages/estate-huaqiao-city/huaqiao-city.component';
import { HuaQiaoCityCapitalPoolCommListComponent } from './pages/trading-list/capital-pool-comm-list.component';
import { HuaQiaoCityNewComponent } from './shared/component/record/new.component';
import { HuaQiaoCityViewComponent } from './shared/component/record/view.component';
import { HuaQiaoCityEditComponent } from './shared/component/record/edit.component';
import { HuaQiaoCityRecordComponent } from './shared/component/record/record.component';
import { HuaqiaoCityTransferContractManagerComponent } from './pages/contract-template/contract-template.component';
import onceContractTemplateTab from './common/once-contract-template.tab';
import { HuaQiaoCityFlowDetailRecordComponent } from './shared/component/record/flow-detail-record.component';
import { HuaQiaoCityFlowDetailComponent } from './shared/component/record/flow-detail.component';
import { BatchModifyComponent } from './pages/machine-list/batch-modify.component';
const routes: Routes = [
    {
        // 地产业务列表-华侨城
        path: 'estate-oct/:productIdent',
        component: EstateHuaQiaoCityComponent,
        data: { dragonTodo: TodoHuaQiaoCity, name: '代办列表-华侨城', isPerson: false }
    },
    {
        // 地产业务列表-华侨城(个人待办)
        path: 'estate-oct-person/:productIdent',
        component: EstateHuaQiaoCityComponent,
        data: { dragonTodo: TodoHuaQiaoCity, name: '代办列表-华侨城', isPerson: true }
    },
    {
        // 房地产供应链标准保理
        path: 'oct/pre_record/:id',
        pathMatch: 'full',
        component: RecordHuaQiaoCityComponent,
        // data:{name:''}
    },
    {
        // 万科审批放款
        path: 'oct/approval_list',
        component: HuaQiaoCityAvengerListComponent,
        data: { ...ApprovallistIndexTabConfig.getConfig('avenger'), name: '审批放款' }
    },
    {
        // 流程
        path: 'record',
        children: [
            {
                path: 'new/:id/:headquarters',
                pathMatch: 'full',
                component: HuaQiaoCityNewComponent,
            },
            {
                path: 'record/:id',
                component: HuaQiaoCityRecordComponent
            },
            {
                path: 'new/:id/:relatedRecordId',
                component: HuaQiaoCityNewComponent
            },
            {
                path: 'new',
                component: HuaQiaoCityNewComponent
            },
            {
                path: ':type/edit/:id',
                component: HuaQiaoCityEditComponent
            },
            {
                path: ':type/view/:id',
                component: HuaQiaoCityViewComponent
            },
            {
                path: 'view/:id',
                component: HuaQiaoCityViewComponent
            },
        ]
    },
    {
        // 资产管理
        path: 'assets-management',
        children: [{
            // 拟入池交易列表
            path: 'enter-pool',
            component: HuaQiaoCityEnterpoolComponent,
            data: { ...vankeEnterPoolConfig.get('enterPoolList'), name: '拟入池交易列表' },
        },
        {   // 二次转让合同管理
            path: 'secondtransfer-contract-manage',
            component: TransferContractManagerComponent,
            data: { ...secondContractTemplateTab.getConfig('secondContract'), hideTitle: false, name: '二次转让合同' }
        },
        { // 项目列表
            path: 'project-list',
            component: HuaQiaoCityProjectmanageComponent,
            data: { name: '项目管理' }
            // data: ProjectManagerList.getConfig('projectManager'),
        },
        { // 项目列表-专项计划列表
            path: 'projectPlan-management',
            component: HuaQiaoCityProjectmanagePlanComponent,
            data: { name: '专项计划列表' }
            // data: ProjectManagerplanList.getConfig('projectplanManager'),
        },
        { // 项目列表-专项计划列表-交易列表-基础资产、交易文件、尽职调查、产品信息
            path: 'capital-pool',
            component: HuaQiaoCityCapitalpoolComponent,
            data: { name: '交易列表' }
            // data: ProjectManagerCapitalList.getConfig('vankeCapitallist'),
        },
        { // 项目列表-提醒管理
            path: 'notice-manage',
            component: HuaQiaoCityNoticeManageComponent,
            data: { ...VankeNoticeManageList.getConfig('tabConfig'), name: '提醒管理' },
        },
        { // 抽样页面
            path: 'capital-sample',
            component: CapitalSampleComponent,
            data: { name: '抽样' }
        },
        { // 数据分析页面
            path: 'capital-data-analyse',
            component: CapitalDataAnalyseComponent,
            data: { name: '数据分析' }
        },
        ],
    },
    {
        // 万科台账
        path: 'oct/machine_list',
        component: DemoListComponent,
        data: { ...MachineIndexTabConfig.getConfig(), name: '台账' }
    },
    { // 资产池 - 交易列表 - 批量补充
      path: 'oct/machine_list/batch-modify',
      component: BatchModifyComponent,
    },
    // 万科上传付确
    {
        path: 'oct/confirmation-list',
        pathMatch: 'full',
        component: HuaQiaoCityUploadPaymentsComponent,
        data: { ...VankepaymentTabConfig.getConfig('dragon'), name: '上传付确' },
    },
    // 万科数据对接-数据接口列表
    {
        path: 'data-docking/list',
        component: HuaQiaoCityDatalockingComponent,
        data: { ...VankedataDockingConfig.getConfig('dataDockingList'), name: '数据接口列表' },
    },
    { // 万科数据对接-业务对接人配置列表
        path: 'business-matchmaker',
        pathMatch: 'full',
        component: BusinessMatchmakerListComponent,
        data: { name: '业务对接人配置列表' }
    },
    // 下载付确
    {
        path: 'confirmation-download',
        pathMatch: 'full',
        component: DragonDownloadPaymentsComponent,
        data: { ...DragonpaymentDownloadTabConfig.getConfig('download_payconfirm'), hideTitle: false, name: '下载付确' }
    },
    { // 老资产池 - 交易列表（用于查看老资产）
        path: 'trading-list',
        component: HuaQiaoCityCapitalPoolCommListComponent,
        data: CapitalPoolTradingList,
        runGuardsAndResolvers: 'always',
    },

    { // 龙光一次转让合同管理
        path: 'oncetransfer-contract-manage',
        component: HuaqiaoCityTransferContractManagerComponent,
        data: { ...onceContractTemplateTab.getConfig('onceContract'), hideTitle: false, name: '一次转让合同管理' }
    },
    {
        path: 'main-list/detail/:id',
        component: HuaQiaoCityFlowDetailComponent,
        data: { name: '交易详情' }
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class HuaQiaoCityRoutingModule { }
