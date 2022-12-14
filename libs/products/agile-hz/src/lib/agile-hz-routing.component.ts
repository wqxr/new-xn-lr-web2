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
        // ??????????????????
        path: 'estate-agile-xingshun/:productIdent',
        component: EstateAgileHzComponent,
        data: { TodoAgileHz: TodoAgileHz, isPerson: false }
    },
    {
        // ????????????????????????????????????
        path: 'estate-agile-xingshun-person/:productIdent',
        component: EstateAgileHzComponent,
        data: { TodoAgileHz: TodoAgileHz, isPerson: true }
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
        // ?????????-??????-??????
        path: 'machine_list',
        component: MachineListComponent,
        data: MachineIndexTabConfig.getConfig()
    },
    {
        path: 'main-list/detail/:id',
        component: FlowDetailComponent,
    },
    {
        // ????????????????????????
        path: 'oncetransfer-contract-manage',
        component: TransferContractManagerComponent,
        data: { ...OnceContractTemplateTab.getConfig('onceContract'), hideTitle: false }
    },
    {
        // ????????????????????????
        path: 'secondtransfer-contract-manage',
        component: TransferContractManagerComponent,
        data: { ...OnceContractTemplateTab.getConfig('secondContract'), hideTitle: false }
    },
    {
        // ????????????
        path: 'approval_list',
        component: AvengerListComponent,
        data: ApprovalListIndexTabConfig.getConfig('avenger')
    },
    {
        // ????????????
        path: 'assets-management',
        children: [
            {
                // ?????????????????????
                path: 'enter-pool',
                component: EnterpoolComponent,
                data: EnterPoolConfig.get('enterPoolList'),
            },
            { // ????????????
                path: 'project-list',
                component: ProjectmanageComponent,
            },
            { // ????????????-??????????????????
                path: 'projectPlan-management',
                component: ProjectmanagePlanComponent,
            },
            { // ????????????-??????????????????-????????????-?????????????????????????????????????????????????????????
                path: 'capital-pool',
                component: CapitalpoolComponent,
            },
            { // ????????????-????????????
                path: 'notice-manage',
                component: NoticeManageComponent,
                data: NoticeManageList.getConfig('tabConfig'),
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
        component: RecordComponent
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
        component: UploadPaymentsComponent,
        data: PaymentTabConfig.getConfig('agileXingshun')
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
export class AgileHzRoutingModule { }
