import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NewGemdaleDatalockingComponent } from './pages/new-gemdale-data-docking/new-gemdale-data-docking.component';
import { NewGemdaleEditComponent } from './share/components/record/edit.component';
import { NewComponent } from './share/components/record/new.component';
import { NewGemdaleRecordViewComponent } from './share/components/record/record.component';
import { NewGemdaleViewComponent } from './share/components/record/view.component';
import NewGemdaleDataDockingConfig from './pages/new-gemdale-data-docking/new-gemdale-data.docking';
import { MachineListComponent } from './pages/machine-list/machine-list.component';
import MachineIndexTabConfig from './pages/machine-list/machine-list.config';
import { NewGemdaleFlowDetailComponent } from './share/components/record/flow-detail.component';
import { EstateNewGemdaleComponent } from './pages/estate-new-gemdale/new-gemdale.component';
import TodoNewGemdale from './pages/estate-new-gemdale/TodoNewGemdale';
import { NewGemdaleTransferContractManagerComponent } from './pages/contract-template/contract-template.component';
import NewGemdaleOnceContractTemplateTab from './pages/contract-template/second-contract-template.tab';
import { BusinessMatchmakerListComponent } from './pages/business-matchmaker-manager/business-matchmaker-list.component';
import { NewGemdaleAvengerListComponent } from './pages/approval-list/avenger-list.component';
import NewGemdaleApprovalListIndexTabConfig from './pages/approval-list/index-tab.config';
import { NewGemdaleEnterpoolComponent } from './pages/assets-management/enter-capital-tool/enter-capital-pool-confirmation.component';
import NewGemdaleEnterPoolConfig from './pages/assets-management/enter-capital-tool/enter-pool-capital';
import { NewGemdaleSecondTransferContractManagerComponent } from './pages/assets-management/contract-template/contract-template.component';
import secondContractTemplateTab from './pages/assets-management/contract-template/second-contract-template.tab';
import { NewGemdaleProjectmanageComponent } from './pages/assets-management/new-gemdale-project-manager/new-gemdale-project-management.component';
import { NewGemdaleProjectmanagePlanComponent } from './pages/assets-management/new-gemdale-project-manager/new-gemdale-project-plan-list/new-gemdale-project-plan-list.component';
import { NewGemdaleCapitalpoolComponent } from './pages/assets-management/new-gemdale-project-manager/new-gemdale-capital-pool/new-gemdale-capital-pool.component';
import { CapitalDataAnalyseComponent } from './pages/assets-management/new-gemdale-project-manager/capital-data-analyse/capital-data-analyse.component';
import { CapitalSampleComponent } from './pages/assets-management/new-gemdale-project-manager/capital-sample/capital-sample.component';
import { NewGemdaleNoticeManageComponent } from './pages/assets-management/new-gemdale-project-manager/new-gemdale-notice-manage/new-gemdale-notice-manage-list.component';
import NewGemdaleNoticeManageList from './pages/assets-management/new-gemdale-project-manager/new-gemdale-notice-manage/new-gemdale-notice-manage';
import { NewGemdaleRecordComponent } from './pages/new-gemdale-record/new-gemdale-record.component';
import { GemdaleCapitalPoolIndexComponent } from './pages/capital-pool/capital-pool-index.component';
import { GemdaleCapitalPoolCommListComponent } from './pages/trading-list/capital-pool-comm-list.component';
import CapitalPoolTradingList from './pages/trading-list/capital-pool-trading-list';
import { ComfirmInformationIndexComponent } from './pages/gemdale-mode/confirm-inforamtion-index.component';
import TabConfig from './pages/gemdale-mode/tab-pane';
import { ComfirmationSignComponent } from './pages/gemdale-mode/confirmation-sign-component';
import { NewGemdaleRepaymentComponent } from './pages/repayment/new-gemdale-repayment.component';
import { BatchModifyComponent } from './pages/batch-modify/batch-modify.component';
import { RecepitListComponent } from './pages/gemdale-mode/receiptList.component';

const routes: Routes = [
    // 待办业务列表
    {
        path: 'estate-new-gemdale/:productIdent',
        component: EstateNewGemdaleComponent,
        data: { newGemdaleTodo: TodoNewGemdale, isPerson: false }
    },
    {
        // 保理通-金地-柏霖汇（个人待办）
        path: 'estate-new-gemdale-person/:productIdent',
        component: EstateNewGemdaleComponent,
        data: { newGemdaleTodo: TodoNewGemdale, isPerson: true }
    },
    {
        // 流程
        path: 'record',
        children: [
            {
                path: 'new/:id/:headquarters',
                pathMatch: 'full',
                component: NewComponent,
            },
            {
                path: 'record/:id',
                component: NewGemdaleRecordViewComponent
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
                component: NewGemdaleEditComponent
            },
            {
                path: ':type/view/:id',
                component: NewGemdaleViewComponent
            },
            {
                path: 'view/:id',
                component: NewGemdaleViewComponent
            },
        ]
    },
    // 金地数据对接-数据接口列表
    {
        path: 'data-docking/list',
        component: NewGemdaleDatalockingComponent,
        data: NewGemdaleDataDockingConfig.getConfig('dataDockingList'),
    },
    // 金地-台账
    {
        path: 'machine_list',
        component: MachineListComponent,
        data: MachineIndexTabConfig.getConfig()
    },
    {
        path: 'main-list/detail/:id',
        component: NewGemdaleFlowDetailComponent,
    },
    // 金地一次转让合同管理
    {
        path: 'oncetransfer-contract-manage',
        component: NewGemdaleTransferContractManagerComponent,
        data: { ...NewGemdaleOnceContractTemplateTab.getConfig('onceContract'), hideTitle: false }
    },
    // 金地数据对接-业务对接人配置列表
    {
        path: 'business-matchmaker',
        pathMatch: 'full',
        component: BusinessMatchmakerListComponent,
    },
    // 审批放款
    {
        path: 'approval_list',
        component: NewGemdaleAvengerListComponent,
        data: NewGemdaleApprovalListIndexTabConfig.getConfig('avenger')
    },
    {
        // 资产管理
        path: 'assets-management',
        children: [
            {
                // 拟入池交易列表
                path: 'enter-pool',
                component: NewGemdaleEnterpoolComponent,
                data: NewGemdaleEnterPoolConfig.get('enterPoolList'),
            },
            {   // 二次转让合同管理
                path: 'secondtransfer-contract-manage',
                component: NewGemdaleSecondTransferContractManagerComponent,
                data: { ...secondContractTemplateTab.getConfig('secondContract'), hideTitle: false }
            },
            { // 项目列表
                path: 'project-list',
                component: NewGemdaleProjectmanageComponent,
            },
            { // 项目列表-专项计划列表
                path: 'projectPlan-management',
                component: NewGemdaleProjectmanagePlanComponent,
            },
            { // 项目列表-专项计划列表-交易列表-基础资产、交易文件、尽职调查、产品信息
                path: 'capital-pool',
                component: NewGemdaleCapitalpoolComponent,
            },
            { // 项目列表-提醒管理
                path: 'notice-manage',
                component: NewGemdaleNoticeManageComponent,
                data: NewGemdaleNoticeManageList.getConfig('tabConfig'),
            },
            { // 抽样页面
                path: 'capital-sample',
                component: CapitalSampleComponent
            },
            { // 数据分析页面
                path: 'capital-data-analyse',
                component: CapitalDataAnalyseComponent
            },
        ]
    },
    {
        // 上传付款计划
        path: 'pre_record',
        component: NewGemdaleRecordComponent
    },
    { // 老资产池
        path: 'capital-pool/gemdale',
        pathMatch: 'full',
        component: GemdaleCapitalPoolIndexComponent,

    },
    { // 老资产池-交易列表
        path: 'asset-pool/trading-list',
        component: GemdaleCapitalPoolCommListComponent,
        data: CapitalPoolTradingList,
        runGuardsAndResolvers: 'always',
    },
    { // 金地abs 集团公司确认付款清单
        path: 'gemdale-supports',
        component: ComfirmInformationIndexComponent,
        data: TabConfig.get('paymentList')
    },
    { // 金地abs 集团公司 签署付款确认书
        path: 'gemdale-supports/confirmation',
        component: ComfirmationSignComponent,
        data: TabConfig.get('headquartersSign')
    },
    { // 金地abs 项目公司确认应收账款金额
        path: 'confirm-receivable',
        component: ComfirmInformationIndexComponent,
        data: TabConfig.get('receivable')
    },
    { // 金地abs 项目公司签署回执
        path: 'sign-receipt',
        component: RecepitListComponent,
        data: TabConfig.get('receiptList')
    },
    { // 还款管理
        path: 'repayment',
        component: NewGemdaleRepaymentComponent,
    },
     // 批量补充信息
     {
        path: 'batch-modify',
        component: BatchModifyComponent,
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class NewGemdaleRoutingModule { }
