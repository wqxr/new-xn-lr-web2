import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AgileXingshunEditComponent } from './share/components/record/edit.component';
import { NewComponent } from './share/components/record/new.component';
import { AgileXingshunRecordViewComponent } from './share/components/record/record.component';
import { AgileXingshunViewComponent } from './share/components/record/view.component';
import { MachineListComponent } from './pages/machine-list/machine-list.component';
import MachineIndexTabConfig from './pages/machine-list/machine-list.config'
import { AgileXingshunFlowDetailComponent } from './share/components/record/flow-detail.component';
import { EstateAgileXingshunComponent } from './pages/estate-agile-xingshun/agile-xingshun.component';
import TodoAgileXingshun from './pages/estate-agile-xingshun/TodoAgileXingshun'
import { AgileXingshunTransferContractManagerComponent } from './pages/contract-template/contract-template.component';
import AgileXingshunOnceContractTemplateTab from './pages/contract-template/second-contract-template.tab'
import { AgileXingshunAvengerListComponent } from './pages/approval-list/avenger-list.component';
import AgileXingshunApprovalListIndexTabConfig from './pages/approval-list/index-tab.config';
import { AgileXingshunEnterpoolComponent } from './pages/assets-management/enter-capital-tool/enter-capital-pool-confirmation.component';
import AgileXingshunEnterPoolConfig from './pages/assets-management/enter-capital-tool/enter-pool-capital'
import { AgileXingshunProjectmanageComponent } from './pages/assets-management/agile-xingshun-project-manager/agile-xingshun-project-management.component';
import { AgileXingshunProjectmanagePlanComponent } from './pages/assets-management/agile-xingshun-project-manager/agile-xingshun-project-plan-list/agile-xingshun-project-plan-list.component';
import { AgileXingshunCapitalpoolComponent } from './pages/assets-management/agile-xingshun-project-manager/agile-xingshun-capital-pool/agile-xingshun-capital-pool.component';
import { CapitalDataAnalyseComponent } from './pages/assets-management/agile-xingshun-project-manager/capital-data-analyse/capital-data-analyse.component';
import { CapitalSampleComponent } from './pages/assets-management/agile-xingshun-project-manager/capital-sample/capital-sample.component';
import { AgileXingshunNoticeManageComponent } from './pages/assets-management/agile-xingshun-project-manager/agile-xingshun-notice-manage/agile-xingshun-notice-manage-list.component';
import AgileXingshunNoticeManageList from './pages/assets-management/agile-xingshun-project-manager/agile-xingshun-notice-manage/agile-xingshun-notice-manage'
import { AgileXingshunRecordComponent } from './pages/agile-xingshun-record/agile-xingshun-record.component';
import TabConfig from './pages/agile-xingshun-mode/tab-pane'
import { BatchModifyComponent } from './pages/batch-modify/batch-modify.component';
import { RecepitListComponent } from './pages/agile-xingshun-mode/receiptList.component';
import { AgileXingshunUploadPaymentsComponent } from './pages/upload-payment-confirmation/upload-payment-confirmation.component';
import AgileXingshunPaymentTabConfig from './pages/upload-payment-confirmation/upload-payment-confirmation';
import { AdditionalMaterialsComponent } from './pages/agile-xingshun-mode/additional-materials.component';
import { CapitalPoolCommListComponent } from './pages/capital-pool/comm-list/capital-pool-comm-list.component';
import { CapitalPoolIndexComponent } from './pages/capital-pool/capital-pool-index.component';
import CapitalPoolTradingList from './pages/trading-list/capital-pool-trading-list';
import { CapitalPoolUnhandledListComponent } from './pages/capital-pool/unhandled-list/capital-pool-unhandled-list.component';
import CapitalPoolUnhandledMainList from './logic/capital-pool-unhandled-main-list';

const routes: Routes = [

    {
        // 待办业务列表
        path: 'estate-agile-xingshun/:productIdent',
        component: EstateAgileXingshunComponent,
        data: { AgileXingshunTodo: TodoAgileXingshun, isPerson: false }
    },
    {
        // 保理通-雅居乐-星顺待办列表（个人待办）
        path: 'estate-agile-xingshun-person/:productIdent',
        component: EstateAgileXingshunComponent,
        data: { AgileXingshunTodo: TodoAgileXingshun, isPerson: true }
    },
    {
        // 流程相关
        path: 'record',
        children: [
            {
                path: 'new/:id/:headquarters',
                pathMatch: 'full',
                component: NewComponent,
            },
            {
                path: 'record/:id',
                component: AgileXingshunRecordViewComponent
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
                component: AgileXingshunEditComponent
            },
            {
                path: ':type/view/:id',
                component: AgileXingshunViewComponent
            },
            {
                path: 'view/:id',
                component: AgileXingshunViewComponent
            },
        ]
    },
    {
        // 雅居乐-星顺-台账
        path: 'machine_list',
        component: MachineListComponent,
        data: MachineIndexTabConfig.getConfig()
    },
    {
        path: 'main-list/detail/:id',
        component: AgileXingshunFlowDetailComponent,
    },
    {
        // 一次转让合同管理
        path: 'oncetransfer-contract-manage',
        component: AgileXingshunTransferContractManagerComponent,
        data: { ...AgileXingshunOnceContractTemplateTab.getConfig('onceContract'), hideTitle: false }
    },
    {
        // 二次转让合同管理
        path: 'secondtransfer-contract-manage',
        component: AgileXingshunTransferContractManagerComponent,
        data: { ...AgileXingshunOnceContractTemplateTab.getConfig('secondContract'), hideTitle: false }
    },
    {
        // 审批放款
        path: 'approval_list',
        component: AgileXingshunAvengerListComponent,
        data: AgileXingshunApprovalListIndexTabConfig.getConfig('avenger')
    },
    {
        // 老资产池(仅用于雅居乐旧交易)
        path: 'capital-pool',
        pathMatch: 'full',
        component: CapitalPoolIndexComponent,
    },
    {
        // 老资产池 - 交易列表(仅用于雅居乐旧交易)
        path: 'capital-pool/trading-list',
        component: CapitalPoolCommListComponent,
        data: CapitalPoolTradingList,
        runGuardsAndResolvers: 'always',
    },
    {
        // 老资产池-未入池交易(仅用于雅居乐旧交易)
        path: 'capital-pool/main-list',
        component: CapitalPoolUnhandledListComponent,
        data: CapitalPoolUnhandledMainList
    },
    {
        // 资产管理
        path: 'assets-management',
        children: [
            {
                // 拟入池交易列表
                path: 'enter-pool',
                component: AgileXingshunEnterpoolComponent,
                data: AgileXingshunEnterPoolConfig.get('enterPoolList'),
            },
            { // 项目列表
                path: 'project-list',
                component: AgileXingshunProjectmanageComponent,
            },
            { // 项目列表-专项计划列表
                path: 'projectPlan-management',
                component: AgileXingshunProjectmanagePlanComponent,
            },
            { // 项目列表-专项计划列表-交易列表-基础资产、交易文件、尽职调查、产品信息
                path: 'capital-pool',
                component: AgileXingshunCapitalpoolComponent,
            },
            { // 项目列表-提醒管理
                path: 'notice-manage',
                component: AgileXingshunNoticeManageComponent,
                data: AgileXingshunNoticeManageList.getConfig('tabConfig'),
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
        component: AgileXingshunRecordComponent
    },
    {
        // 批量补充信息
        path: 'batch-modify',
        component: BatchModifyComponent,
    },
    {
        // 上传付款确认书
        path: 'confirmation-list',
        pathMatch: 'full',
        component: AgileXingshunUploadPaymentsComponent,
        data: AgileXingshunPaymentTabConfig.getConfig('agileXingshun')
    },
    {
        // 项目公司签署回执
        path: 'sign-receipt',
        component: RecepitListComponent,
        data: TabConfig.get('receiptList')
    },
    {
        // 项目公司补充业务资料
        path: 'project-company-addInfo',
        component: AdditionalMaterialsComponent,
        data: TabConfig.get('addInfo')
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class AgileXingshunRoutingModule { }
