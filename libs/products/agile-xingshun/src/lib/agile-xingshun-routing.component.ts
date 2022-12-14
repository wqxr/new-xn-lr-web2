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
        // ??????????????????
        path: 'estate-agile-xingshun/:productIdent',
        component: EstateAgileXingshunComponent,
        data: { AgileXingshunTodo: TodoAgileXingshun, isPerson: false }
    },
    {
        // ?????????-?????????-????????????????????????????????????
        path: 'estate-agile-xingshun-person/:productIdent',
        component: EstateAgileXingshunComponent,
        data: { AgileXingshunTodo: TodoAgileXingshun, isPerson: true }
    },
    {
        // ????????????
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
        // ?????????-??????-??????
        path: 'machine_list',
        component: MachineListComponent,
        data: MachineIndexTabConfig.getConfig()
    },
    {
        path: 'main-list/detail/:id',
        component: AgileXingshunFlowDetailComponent,
    },
    {
        // ????????????????????????
        path: 'oncetransfer-contract-manage',
        component: AgileXingshunTransferContractManagerComponent,
        data: { ...AgileXingshunOnceContractTemplateTab.getConfig('onceContract'), hideTitle: false }
    },
    {
        // ????????????????????????
        path: 'secondtransfer-contract-manage',
        component: AgileXingshunTransferContractManagerComponent,
        data: { ...AgileXingshunOnceContractTemplateTab.getConfig('secondContract'), hideTitle: false }
    },
    {
        // ????????????
        path: 'approval_list',
        component: AgileXingshunAvengerListComponent,
        data: AgileXingshunApprovalListIndexTabConfig.getConfig('avenger')
    },
    {
        // ????????????(???????????????????????????)
        path: 'capital-pool',
        pathMatch: 'full',
        component: CapitalPoolIndexComponent,
    },
    {
        // ???????????? - ????????????(???????????????????????????)
        path: 'capital-pool/trading-list',
        component: CapitalPoolCommListComponent,
        data: CapitalPoolTradingList,
        runGuardsAndResolvers: 'always',
    },
    {
        // ????????????-???????????????(???????????????????????????)
        path: 'capital-pool/main-list',
        component: CapitalPoolUnhandledListComponent,
        data: CapitalPoolUnhandledMainList
    },
    {
        // ????????????
        path: 'assets-management',
        children: [
            {
                // ?????????????????????
                path: 'enter-pool',
                component: AgileXingshunEnterpoolComponent,
                data: AgileXingshunEnterPoolConfig.get('enterPoolList'),
            },
            { // ????????????
                path: 'project-list',
                component: AgileXingshunProjectmanageComponent,
            },
            { // ????????????-??????????????????
                path: 'projectPlan-management',
                component: AgileXingshunProjectmanagePlanComponent,
            },
            { // ????????????-??????????????????-????????????-?????????????????????????????????????????????????????????
                path: 'capital-pool',
                component: AgileXingshunCapitalpoolComponent,
            },
            { // ????????????-????????????
                path: 'notice-manage',
                component: AgileXingshunNoticeManageComponent,
                data: AgileXingshunNoticeManageList.getConfig('tabConfig'),
            },
            { // ????????????
                path: 'capital-sample',
                component: CapitalSampleComponent
            },
            { // ??????????????????
                path: 'capital-data-analyse',
                component: CapitalDataAnalyseComponent
            },
        ]
    },
    {
        // ??????????????????
        path: 'pre_record',
        component: AgileXingshunRecordComponent
    },
    {
        // ??????????????????
        path: 'batch-modify',
        component: BatchModifyComponent,
    },
    {
        // ?????????????????????
        path: 'confirmation-list',
        pathMatch: 'full',
        component: AgileXingshunUploadPaymentsComponent,
        data: AgileXingshunPaymentTabConfig.getConfig('agileXingshun')
    },
    {
        // ????????????????????????
        path: 'sign-receipt',
        component: RecepitListComponent,
        data: TabConfig.get('receiptList')
    },
    {
        // ??????????????????????????????
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
