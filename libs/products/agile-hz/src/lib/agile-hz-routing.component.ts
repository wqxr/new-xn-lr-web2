import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EditComponent } from './share/components/record/edit.component';
import { NewComponent } from './share/components/record/new.component';
import { RecordViewComponent } from './share/components/record/record.component';
import { ViewComponent } from './share/components/record/view.component';
import { MachineListComponent } from './pages/machine-list/machine-list.component';
import MachineIndexTabConfig from './pages/machine-list/machine-list.config'
import { FlowDetailComponent } from './share/components/record/flow-detail.component';
import { EstateAgileHzComponent } from './pages/estate-agile-hz/agile-hz.component';
import TodoAgileHz from './pages/estate-agile-hz/TodoAgileHz'
import { TransferContractManagerComponent } from './pages/contract-template/contract-template.component';
import OnceContractTemplateTab from './pages/contract-template/second-contract-template.tab'
import { AvengerListComponent } from './pages/approval-list/avenger-list.component';
import ApprovalListIndexTabConfig from './pages/approval-list/index-tab.config';
import { EnterpoolComponent } from './pages/assets-management/enter-capital-tool/enter-capital-pool-confirmation.component';
import EnterPoolConfig from './pages/assets-management/enter-capital-tool/enter-pool-capital'
import { ProjectmanageComponent } from './pages/assets-management/agile-hz-project-manager/agile-hz-project-management.component';
import { ProjectmanagePlanComponent } from './pages/assets-management/agile-hz-project-manager/agile-hz-project-plan-list/agile-hz-project-plan-list.component';
import { CapitalpoolComponent } from './pages/assets-management/agile-hz-project-manager/agile-hz-capital-pool/agile-hz-capital-pool.component';
import { CapitalDataAnalyseComponent } from './pages/assets-management/agile-hz-project-manager/capital-data-analyse/capital-data-analyse.component';
import { CapitalSampleComponent } from './pages/assets-management/agile-hz-project-manager/capital-sample/capital-sample.component';
import { NoticeManageComponent } from './pages/assets-management/agile-hz-project-manager/agile-hz-notice-manage/agile-hz-notice-manage-list.component';
import NoticeManageList from './pages/assets-management/agile-hz-project-manager/agile-hz-notice-manage/agile-hz-notice-manage'
import { RecordComponent } from './pages/agile-hz-record/agile-hz-record.component';
import TabConfig from './pages/agile-hz-mode/tab-pane'
import { BatchModifyComponent } from './pages/batch-modify/batch-modify.component';
import { RecepitListComponent } from './pages/agile-hz-mode/receiptList.component';
import { UploadPaymentsComponent } from './pages/upload-payment-confirmation/upload-payment-confirmation.component';
import PaymentTabConfig from './pages/upload-payment-confirmation/upload-payment-confirmation';
import { AdditionalMaterialsComponent } from './pages/agile-hz-mode/additional-materials.component';

const routes: Routes = [

    {
        // 待办业务列表
        path: 'estate-agile-xingshun/:productIdent',
        component: EstateAgileHzComponent,
        data: { TodoAgileHz: TodoAgileHz, isPerson: false }
    },
    {
        // 待办业务列表（个人待办）
        path: 'estate-agile-xingshun-person/:productIdent',
        component: EstateAgileHzComponent,
        data: { TodoAgileHz: TodoAgileHz, isPerson: true }
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
                component: RecordViewComponent
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
        ]
    },
    {
        // 雅居乐-恒泽-台账
        path: 'machine_list',
        component: MachineListComponent,
        data: MachineIndexTabConfig.getConfig()
    },
    {
        path: 'main-list/detail/:id',
        component: FlowDetailComponent,
    },
    {
        // 一次转让合同管理
        path: 'oncetransfer-contract-manage',
        component: TransferContractManagerComponent,
        data: { ...OnceContractTemplateTab.getConfig('onceContract'), hideTitle: false }
    },
    {
        // 二次转让合同管理
        path: 'secondtransfer-contract-manage',
        component: TransferContractManagerComponent,
        data: { ...OnceContractTemplateTab.getConfig('secondContract'), hideTitle: false }
    },
    {
        // 审批放款
        path: 'approval_list',
        component: AvengerListComponent,
        data: ApprovalListIndexTabConfig.getConfig('avenger')
    },
    {
        // 资产管理
        path: 'assets-management',
        children: [
            {
                // 拟入池交易列表
                path: 'enter-pool',
                component: EnterpoolComponent,
                data: EnterPoolConfig.get('enterPoolList'),
            },
            { // 项目列表
                path: 'project-list',
                component: ProjectmanageComponent,
            },
            { // 项目列表-专项计划列表
                path: 'projectPlan-management',
                component: ProjectmanagePlanComponent,
            },
            { // 项目列表-专项计划列表-交易列表-基础资产、交易文件、尽职调查、产品信息
                path: 'capital-pool',
                component: CapitalpoolComponent,
            },
            { // 项目列表-提醒管理
                path: 'notice-manage',
                component: NoticeManageComponent,
                data: NoticeManageList.getConfig('tabConfig'),
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
        component: RecordComponent
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
        component: UploadPaymentsComponent,
        data: PaymentTabConfig.getConfig('agileXingshun')
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
export class AgileHzRoutingModule { }
