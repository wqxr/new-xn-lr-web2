import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { XnGemdaleDatalockingComponent } from './pages/xn-gemdale-data-docking/xn-gemdale-data-docking.component';
import { XnGemdaleEditComponent } from './share/components/record/edit.component';
import { NewComponent } from './share/components/record/new.component';
import { XnGemdaleRecordViewComponent } from './share/components/record/record.component';
import { XnGemdaleViewComponent } from './share/components/record/view.component';
import XnGemdaleDataDockingConfig from './pages/xn-gemdale-data-docking/xn-gemdale-data.docking';
import { MachineListComponent } from './pages/machine-list/machine-list.component';
import MachineIndexTabConfig from './pages/machine-list/machine-list.config';
import { XnGemdaleFlowDetailComponent } from './share/components/record/flow-detail.component';
import { EstateXnGemdaleComponent } from './pages/estate-xn-gemdale/xn-gemdale.component';
import TodoXnGemdale from './pages/estate-xn-gemdale/TodoXnGemdale';
import { XnGemdaleTransferContractManagerComponent } from './pages/contract-template/contract-template.component';
import XnGemdaleOnceContractTemplateTab from './pages/contract-template/second-contract-template.tab';
import { BusinessMatchmakerListComponent } from './pages/business-matchmaker-manager/business-matchmaker-list.component';
import { XnGemdaleAvengerListComponent } from './pages/approval-list/avenger-list.component';
import XnGemdaleApprovalListIndexTabConfig from './pages/approval-list/index-tab.config';
import { XnGemdaleEnterpoolComponent } from './pages/assets-management/enter-capital-tool/enter-capital-pool-confirmation.component';
import XnGemdaleEnterPoolConfig from './pages/assets-management/enter-capital-tool/enter-pool-capital';
import { XnGemdaleSecondTransferContractManagerComponent } from './pages/assets-management/contract-template/contract-template.component';
import secondContractTemplateTab from './pages/assets-management/contract-template/second-contract-template.tab';
import { XnGemdaleProjectmanageComponent } from './pages/assets-management/xn-gemdale-project-manager/xn-gemdale-project-management.component';
import { XnGemdaleProjectmanagePlanComponent } from './pages/assets-management/xn-gemdale-project-manager/xn-gemdale-project-plan-list/xn-gemdale-project-plan-list.component';
import { XnGemdaleCapitalpoolComponent } from './pages/assets-management/xn-gemdale-project-manager/xn-gemdale-capital-pool/xn-gemdale-capital-pool.component';
import { CapitalDataAnalyseComponent } from './pages/assets-management/xn-gemdale-project-manager/capital-data-analyse/capital-data-analyse.component';
import { CapitalSampleComponent } from './pages/assets-management/xn-gemdale-project-manager/capital-sample/capital-sample.component';
import { XnGemdaleNoticeManageComponent } from './pages/assets-management/xn-gemdale-project-manager/xn-gemdale-notice-manage/xn-gemdale-notice-manage-list.component';
import XnGemdaleNoticeManageList from './pages/assets-management/xn-gemdale-project-manager/xn-gemdale-notice-manage/xn-gemdale-notice-manage';
import { XnGemdaleRecordComponent } from './pages/xn-gemdale-record/xn-gemdale-record.component';
import { ComfirmInformationIndexComponent } from './pages/gemdale-mode/confirm-inforamtion-index.component';
import TabConfig from './pages/gemdale-mode/tab-pane';
import { ComfirmationSignComponent } from './pages/gemdale-mode/confirmation-sign-component';
import { XnGemdaleRepaymentComponent } from './pages/repayment/xn-gemdale-repayment.component';
import { BatchModifyComponent } from './pages/batch-modify/batch-modify.component';
import { RecepitListComponent } from './pages/gemdale-mode/receiptList.component';

const routes: Routes = [
    // 待办业务列表
    {
        path: 'estate-new-gemdale/:productIdent',
        component: EstateXnGemdaleComponent,
        data: { xnGemdaleTodo: TodoXnGemdale, isPerson: false }
    },
    {   // 保理通-金地-香纳（个人待办）
        path: 'estate-new-gemdale-person/:productIdent',
        component: EstateXnGemdaleComponent,
        data: { xnGemdaleTodo: TodoXnGemdale, isPerson: true }
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
                component: XnGemdaleRecordViewComponent
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
                component: XnGemdaleEditComponent
            },
            {
                path: ':type/view/:id',
                component: XnGemdaleViewComponent
            },
            {
                path: 'view/:id',
                component: XnGemdaleViewComponent
            },
        ]
    },
    // 金地数据对接-数据接口列表
    {
        path: 'data-docking/list',
        component: XnGemdaleDatalockingComponent,
        data: XnGemdaleDataDockingConfig.getConfig('dataDockingList'),
    },
    // 金地-台账
    {
        path: 'machine_list',
        component: MachineListComponent,
        data: MachineIndexTabConfig.getConfig()
    },
    {
        path: 'main-list/detail/:id',
        component: XnGemdaleFlowDetailComponent,
    },
    // 金地一次转让合同管理
    {
        path: 'oncetransfer-contract-manage',
        component: XnGemdaleTransferContractManagerComponent,
        data: { ...XnGemdaleOnceContractTemplateTab.getConfig('onceContract'), hideTitle: false }
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
        component: XnGemdaleAvengerListComponent,
        data: XnGemdaleApprovalListIndexTabConfig.getConfig('avenger')
    },
    {
        // 资产管理
        path: 'assets-management',
        children: [
            {
                // 拟入池交易列表
                path: 'enter-pool',
                component: XnGemdaleEnterpoolComponent,
                data: XnGemdaleEnterPoolConfig.get('enterPoolList'),
            },
            {   // 二次转让合同管理
                path: 'secondtransfer-contract-manage',
                component: XnGemdaleSecondTransferContractManagerComponent,
                data: { ...secondContractTemplateTab.getConfig('secondContract'), hideTitle: false }
            },
            { // 项目列表
                path: 'project-list',
                component: XnGemdaleProjectmanageComponent,
            },
            { // 项目列表-专项计划列表
                path: 'projectPlan-management',
                component: XnGemdaleProjectmanagePlanComponent,
            },
            { // 项目列表-专项计划列表-交易列表-基础资产、交易文件、尽职调查、产品信息
                path: 'capital-pool',
                component: XnGemdaleCapitalpoolComponent,
            },
            { // 项目列表-提醒管理
                path: 'notice-manage',
                component: XnGemdaleNoticeManageComponent,
                data: XnGemdaleNoticeManageList.getConfig('tabConfig'),
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
        component: XnGemdaleRecordComponent
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
        component: XnGemdaleRepaymentComponent,
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
export class XnGemdaleRoutingModule { }
