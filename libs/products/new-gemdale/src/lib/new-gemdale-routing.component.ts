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
    // ??????????????????
    {
        path: 'estate-new-gemdale/:productIdent',
        component: EstateNewGemdaleComponent,
        data: { newGemdaleTodo: TodoNewGemdale, isPerson: false }
    },
    {
        // ?????????-??????-???????????????????????????
        path: 'estate-new-gemdale-person/:productIdent',
        component: EstateNewGemdaleComponent,
        data: { newGemdaleTodo: TodoNewGemdale, isPerson: true }
    },
    {
        // ??????
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
    // ??????????????????-??????????????????
    {
        path: 'data-docking/list',
        component: NewGemdaleDatalockingComponent,
        data: NewGemdaleDataDockingConfig.getConfig('dataDockingList'),
    },
    // ??????-??????
    {
        path: 'machine_list',
        component: MachineListComponent,
        data: MachineIndexTabConfig.getConfig()
    },
    {
        path: 'main-list/detail/:id',
        component: NewGemdaleFlowDetailComponent,
    },
    // ??????????????????????????????
    {
        path: 'oncetransfer-contract-manage',
        component: NewGemdaleTransferContractManagerComponent,
        data: { ...NewGemdaleOnceContractTemplateTab.getConfig('onceContract'), hideTitle: false }
    },
    // ??????????????????-???????????????????????????
    {
        path: 'business-matchmaker',
        pathMatch: 'full',
        component: BusinessMatchmakerListComponent,
    },
    // ????????????
    {
        path: 'approval_list',
        component: NewGemdaleAvengerListComponent,
        data: NewGemdaleApprovalListIndexTabConfig.getConfig('avenger')
    },
    {
        // ????????????
        path: 'assets-management',
        children: [
            {
                // ?????????????????????
                path: 'enter-pool',
                component: NewGemdaleEnterpoolComponent,
                data: NewGemdaleEnterPoolConfig.get('enterPoolList'),
            },
            {   // ????????????????????????
                path: 'secondtransfer-contract-manage',
                component: NewGemdaleSecondTransferContractManagerComponent,
                data: { ...secondContractTemplateTab.getConfig('secondContract'), hideTitle: false }
            },
            { // ????????????
                path: 'project-list',
                component: NewGemdaleProjectmanageComponent,
            },
            { // ????????????-??????????????????
                path: 'projectPlan-management',
                component: NewGemdaleProjectmanagePlanComponent,
            },
            { // ????????????-??????????????????-????????????-?????????????????????????????????????????????????????????
                path: 'capital-pool',
                component: NewGemdaleCapitalpoolComponent,
            },
            { // ????????????-????????????
                path: 'notice-manage',
                component: NewGemdaleNoticeManageComponent,
                data: NewGemdaleNoticeManageList.getConfig('tabConfig'),
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
        component: NewGemdaleRecordComponent
    },
    { // ????????????
        path: 'capital-pool/gemdale',
        pathMatch: 'full',
        component: GemdaleCapitalPoolIndexComponent,

    },
    { // ????????????-????????????
        path: 'asset-pool/trading-list',
        component: GemdaleCapitalPoolCommListComponent,
        data: CapitalPoolTradingList,
        runGuardsAndResolvers: 'always',
    },
    { // ??????abs ??????????????????????????????
        path: 'gemdale-supports',
        component: ComfirmInformationIndexComponent,
        data: TabConfig.get('paymentList')
    },
    { // ??????abs ???????????? ?????????????????????
        path: 'gemdale-supports/confirmation',
        component: ComfirmationSignComponent,
        data: TabConfig.get('headquartersSign')
    },
    { // ??????abs ????????????????????????????????????
        path: 'confirm-receivable',
        component: ComfirmInformationIndexComponent,
        data: TabConfig.get('receivable')
    },
    { // ??????abs ????????????????????????
        path: 'sign-receipt',
        component: RecepitListComponent,
        data: TabConfig.get('receiptList')
    },
    { // ????????????
        path: 'repayment',
        component: NewGemdaleRepaymentComponent,
    },
     // ??????????????????
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
