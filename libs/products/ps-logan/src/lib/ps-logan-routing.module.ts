import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RecordDragonComponent } from './pages/record-dragon/record-dragon.component';
import { ReceiptListComponent } from './pages/receipt-list/receipt-list.component';
import ReceiptList from './pages/receipt-list/receipt-list';
import { DragonProjectInfoComponent } from './pages/project-company-supplierInfo/additional-materials.component';
import DragonAdditionalMaterials from './common/additional-materials';
import { BatchModifyComponent } from './pages/capital-pool/capital-pool-comm-list/batch-modify.component';
import { DragonUploadPaymentsComponent } from './pages/upload-payment-confirmation/upload-payment-confirmation.component';
import DragonEnterPoolConfig from './common/enter-pool-capital';
import { DragonProjectmanageComponent } from './pages/assets-management/dragon-project-manager/dragon-project-management.component';
import DragonNoticeManageList from './pages/assets-management/dragon-project-manager/dragon-notice-manage/dragon-notice-manage';
import { DragonProjectmanagePlanComponent } from './pages/assets-management/dragon-project-manager/dragon-project-plan-list/dragon-project-plan-list.component';
import { DragonCapitalpoolComponent } from './pages/assets-management/dragon-project-manager/dragon-capital-pool/dragon-capital-pool.component';
import { CapitalSampleComponent } from './pages/assets-management/dragon-project-manager/capital-sample/capital-sample.component';
import { CapitalDataAnalyseComponent } from './pages/assets-management/dragon-project-manager/capital-data-analyse/capital-data-analyse.component';
import { DragonEnterpoolComponent } from './pages/assets-management/enter-capital-tool/enter-capital-pool-confirmation.component';
import { DragonAvengerListComponent } from './pages/approval-list/avenger-list.component';
import { DragonNoticeManageComponent } from './pages/assets-management/dragon-project-manager/dragon-notice-manage/dragon-notice-manage-list.component';
import DragonApprovallistIndexTabConfig from './pages/approval-list/index-tab.config';
import { DragonMachineListComponent } from './pages/machine-list/machine-list.component';
import MachineIndexTabConfig from './pages/machine-list/machine-list.config';
import { DragonTransferContractManagerComponent } from './pages/assets-management/contract-template/contract-template.component';
import secondContractTemplateTab from './pages/assets-management/contract-template/second-contract-template.tab';
import TodoPsLogan from './TodoPsLogan';
import { EstateDragonComponent } from './pages/estate-dragon/dragon.component';
import DragononceContractTemplateTab from './common/dragon-once-contract-template.tab';
import DragonsecondContractTemplateTab from './common/dragon-second-contract-template.tab';
import { PsLoganNewComponent } from './shared/component/record/new.component';
import { PsLoganRecordComponent } from './shared/component/record/record.component';
import { PsLoganEditComponent } from './shared/component/record/edit.component';
import { PsLoganViewComponent } from './shared/component/record/view.component';
import { PsLoganFlowDetailComponent } from './shared/component/record/flow-detail.component';
import DragonpaymentTabConfig from './common/upload-payment-confirmation';
import { DragonFactorSignComponent } from './pages/factor-sign-contract/factor-sign-contract.component';
import DragonFactorSign from './pages/factor-sign-contract/factor-sign-contract-data';
import { SignFilesComponent } from './pages/supplier-sign-files/signFiles.component';
import TabConfig from './pages/supplier-sign-files/tab-pane';

const routes: Routes = [
    {
        // 地产业务列表-龙光
        path: 'estate-dragon/:productIdent',
        component: EstateDragonComponent,
        data: { dragonTodo: TodoPsLogan, isPerson: false }
    },
    {
        // 保理通-龙光-博时资本（个人待办）
        path: 'estate-dragon-person/:productIdent',
        component: EstateDragonComponent,
        data: { dragonTodo: TodoPsLogan, isPerson: true }
    },
    {
        // 房地产供应链标准保理
        path: 'pre_record',
        component: RecordDragonComponent
    },
    {
        // 龙光审批放款
        path: 'approval_list',
        component: DragonAvengerListComponent,
        data: DragonApprovallistIndexTabConfig.getConfig('avenger')
    },
    {
        // 龙光台账
        path: 'machine_list',
        component: DragonMachineListComponent,
        data: MachineIndexTabConfig.getConfig()
    },
    {
        // 资产池
        path: 'capital-pool',
        children: [
        { // 资产池 - 交易列表 - 批量补充
            path: 'batch-modify',
            component: BatchModifyComponent,
        },
        ]
    },
    {
        // 项目公司补充业务资料
        path: 'projectCompany-addInfo',
        component: DragonProjectInfoComponent,
        data: DragonAdditionalMaterials
    },
    // 龙光上传付确
    {
        path: 'confirmation-list',
        pathMatch: 'full',
        component: DragonUploadPaymentsComponent,
        data: DragonpaymentTabConfig.getConfig('dragon')
    },
    {
        path: 'factorSign/sign-contract',
        component: DragonFactorSignComponent,
        data: DragonFactorSign,
    },
    { // 龙光一次转让合同管理
        path: 'oncetransfer-contract-manage',
        component: DragonTransferContractManagerComponent,
        data: { ...DragononceContractTemplateTab.getConfig('onceContract'), hideTitle: false }
    },
    {
        path: 'secondtransfer-contract-manage',
        component: DragonTransferContractManagerComponent,
        data: { ...DragonsecondContractTemplateTab.getConfig('secondContract'), hideTitle: false }
    },
    {
        // 资产管理
        path: 'assets-management',
        children: [{
            // 拟入池交易列表
            path: 'enter-pool',
            component: DragonEnterpoolComponent,
            data: DragonEnterPoolConfig.get('enterPoolList'),
        },
        {   // 二次转让合同管理
            path: 'secondtransfer-contract-manage',
            component: DragonTransferContractManagerComponent,
            data: { ...secondContractTemplateTab.getConfig('secondContract'), hideTitle: false }
        },
        { // 项目列表
            path: 'project-list',
            component: DragonProjectmanageComponent,
        },
        { // 项目列表-专项计划列表
            path: 'projectPlan-management',
            component: DragonProjectmanagePlanComponent,
        },
        { // 项目列表-专项计划列表-交易列表-基础资产、交易文件、尽职调查、产品信息
            path: 'capital-pool',
            component: DragonCapitalpoolComponent,
        },
        { // 项目列表-提醒管理
            path: 'notice-manage',
            component: DragonNoticeManageComponent,
            data: DragonNoticeManageList.getConfig('tabConfig'),
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
        // 流程
        path: 'record',
        children: [
            {
                path: 'new/:id/:headquarters',
                pathMatch: 'full',
                component: PsLoganNewComponent,
            },
            {
                path: 'record/:id',
                component: PsLoganRecordComponent
            },
            {
                path: 'new/:id/:relatedRecordId',
                component: PsLoganNewComponent
            },
            {
                path: 'new',
                component: PsLoganNewComponent
            },
            {
                path: ':type/edit/:id',
                component: PsLoganEditComponent
            },
            {
                path: ':type/view/:id',
                component: PsLoganViewComponent
            },
            {
                path: 'view/:id',
                component: PsLoganViewComponent
            },
        ]
    },
    {
        path: 'main-list/detail/:id',
        component: PsLoganFlowDetailComponent,
    },
    // 生成应收账款回执
    {
        path: 'receipt-list',
        component: ReceiptListComponent,
        data: ReceiptList,
    },
    // 供应商基础文件盖章
    {
        path: 'sign-files',
        component: SignFilesComponent,
        data: TabConfig.get('signFilesList'),
    },

];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class PsLoganRoutingModule { }
