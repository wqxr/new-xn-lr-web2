import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ZsGemdaleDatalockingComponent } from './pages/zs-gemdale-data-docking/zs-gemdale-data-docking.component';
import { ZsGemdaleEditComponent } from './share/components/record/edit.component';
import { NewComponent } from './share/components/record/new.component';
import { ZsGemdaleRecordViewComponent } from './share/components/record/record.component';
import { ZsGemdaleViewComponent } from './share/components/record/view.component';
import ZsGemdaleDataDockingConfig from './pages/zs-gemdale-data-docking/zs-gemdale-data.docking'
import { MachineListComponent } from './pages/machine-list/machine-list.component';
import MachineIndexTabConfig from './pages/machine-list/machine-list.config'
import { ZsGemdaleFlowDetailComponent } from './share/components/record/flow-detail.component';
import { EstateZsGemdaleComponent } from './pages/estate-zs-gemdale/zs-gemdale.component';
import TodoZsGemdale from './pages/estate-zs-gemdale/TodoZsGemdale'
import { ZsGemdaleTransferContractManagerComponent } from './pages/contract-template/contract-template.component';
import ZsGemdaleOnceContractTemplateTab from './pages/contract-template/second-contract-template.tab'
import { BusinessMatchmakerListComponent } from './pages/business-matchmaker-manager/business-matchmaker-list.component';
import { ZsGemdaleAvengerListComponent } from './pages/approval-list/avenger-list.component';
import ZsGemdaleApprovalListIndexTabConfig from './pages/approval-list/index-tab.config';
import { ZsGemdaleEnterpoolComponent } from './pages/assets-management/enter-capital-tool/enter-capital-pool-confirmation.component';
import ZsGemdaleEnterPoolConfig from './pages/assets-management/enter-capital-tool/enter-pool-capital'
import { ZsGemdaleSecondTransferContractManagerComponent } from './pages/assets-management/contract-template/contract-template.component';
import secondContractTemplateTab from './pages/assets-management/contract-template/second-contract-template.tab';
import { ZsGemdaleProjectmanageComponent } from './pages/assets-management/zs-gemdale-project-manager/zs-gemdale-project-management.component';
import { ZsGemdaleProjectmanagePlanComponent } from './pages/assets-management/zs-gemdale-project-manager/zs-gemdale-project-plan-list/zs-gemdale-project-plan-list.component';
import { ZsGemdaleCapitalpoolComponent } from './pages/assets-management/zs-gemdale-project-manager/zs-gemdale-capital-pool/zs-gemdale-capital-pool.component';
import { CapitalDataAnalyseComponent } from './pages/assets-management/zs-gemdale-project-manager/capital-data-analyse/capital-data-analyse.component';
import { CapitalSampleComponent } from './pages/assets-management/zs-gemdale-project-manager/capital-sample/capital-sample.component';
import { ZsGemdaleNoticeManageComponent } from './pages/assets-management/zs-gemdale-project-manager/zs-gemdale-notice-manage/zs-gemdale-notice-manage-list.component';
import ZsGemdaleNoticeManageList from './pages/assets-management/zs-gemdale-project-manager/zs-gemdale-notice-manage/zs-gemdale-notice-manage'
import { ZsGemdaleRecordComponent } from './pages/zs-gemdale-record/zs-gemdale-record.component';
import { ComfirmInformationIndexComponent } from './pages/gemdale-mode/confirm-inforamtion-index.component';
import TabConfig from './pages/gemdale-mode/tab-pane'
import { ComfirmationSignComponent } from './pages/gemdale-mode/confirmation-sign-component';
import { ZsGemdaleRepaymentComponent } from './pages/repayment/zs-gemdale-repayment.component';
import { BatchModifyComponent } from './pages/batch-modify/batch-modify.component';
import { RecepitListComponent } from './pages/gemdale-mode/receiptList.component';

const routes: Routes = [
    // ??????????????????
    {
        path: 'estate-new-gemdale/:productIdent',
        component: EstateZsGemdaleComponent,
        data: { ZsGemdaleTodo: TodoZsGemdale, isPerson: false }
    },
    // ?????????-??????-??????????????????????????????
    {
        path: 'estate-new-gemdale-person/:productIdent',
        component: EstateZsGemdaleComponent,
        data: { ZsGemdaleTodo: TodoZsGemdale, isPerson: true }
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
                component: ZsGemdaleRecordViewComponent
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
                component: ZsGemdaleEditComponent
            },
            {
                path: ':type/view/:id',
                component: ZsGemdaleViewComponent
            },
            {
                path: 'view/:id',
                component: ZsGemdaleViewComponent
            },
        ]
    },
    // ??????????????????-??????????????????
    {
        path: 'data-docking/list',
        component: ZsGemdaleDatalockingComponent,
        data: ZsGemdaleDataDockingConfig.getConfig('dataDockingList'),
    },
    // ??????-??????
    {
        path: 'machine_list',
        component: MachineListComponent,
        data: MachineIndexTabConfig.getConfig()
    },
    {
        path: 'main-list/detail/:id',
        component: ZsGemdaleFlowDetailComponent,
    },
    // ??????????????????????????????
    {
        path: 'oncetransfer-contract-manage',
        component: ZsGemdaleTransferContractManagerComponent,
        data: { ...ZsGemdaleOnceContractTemplateTab.getConfig('onceContract'), hideTitle: false }
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
        component: ZsGemdaleAvengerListComponent,
        data: ZsGemdaleApprovalListIndexTabConfig.getConfig('avenger')
    },
    {
        // ????????????
        path: 'assets-management',
        children: [
            {
                // ?????????????????????
                path: 'enter-pool',
                component: ZsGemdaleEnterpoolComponent,
                data: ZsGemdaleEnterPoolConfig.get('enterPoolList'),
            },
            {   // ????????????????????????
                path: 'secondtransfer-contract-manage',
                component: ZsGemdaleSecondTransferContractManagerComponent,
                data: { ...secondContractTemplateTab.getConfig('secondContract'), hideTitle: false }
            },
            { // ????????????
                path: 'project-list',
                component: ZsGemdaleProjectmanageComponent,
            },
            { // ????????????-??????????????????
                path: 'projectPlan-management',
                component: ZsGemdaleProjectmanagePlanComponent,
            },
            { // ????????????-??????????????????-????????????-?????????????????????????????????????????????????????????
                path: 'capital-pool',
                component: ZsGemdaleCapitalpoolComponent,
            },
            { // ????????????-????????????
                path: 'notice-manage',
                component: ZsGemdaleNoticeManageComponent,
                data: ZsGemdaleNoticeManageList.getConfig('tabConfig'),
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
        component: ZsGemdaleRecordComponent
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
        component: ZsGemdaleRepaymentComponent,
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
export class ZsGemdaleRoutingModule { }
