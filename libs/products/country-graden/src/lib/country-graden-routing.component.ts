import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CountryGradenDatalockingComponent } from './pages/country-graden-data-docking/country-graden-data-docking.component';
import { CountryGradenEditComponent } from './share/components/record/edit.component';
import { NewComponent } from './share/components/record/new.component';
import { CountryGradenRecordComponent } from './share/components/record/record.component';
import { CountryGradenViewComponent } from './share/components/record/view.component';
import CountryGradendataDockingConfig from './pages/country-graden-data-docking/country-graden-data.docking'
import { MachineListComponent } from './pages/machine-list/machine-list.component';
import MachineIndexTabConfig from './pages/machine-list/machine-list.config'
import { CountryGradenFlowDetailComponent } from './share/components/record/flow-detail.component';
import { BatchModifyComponent } from './pages/batch-modify/batch-modify.component';
import { CountryGradenUploadPaymentsComponent } from './pages/upload-payment-confirmation/upload-payment-confirmation.component';
import CountryGradenPaymentTabConfig from './pages/upload-payment-confirmation/upload-payment-confirmation'
import { EstateCountryGradenComponent } from './pages/estate-country-graden/country-graden.component';
import TodoCountryGraden from './pages/estate-country-graden/TodoCountryGraden'
import { CountryGradenTransferContractManagerComponent } from './pages/contract-template/contract-template.component';
import CountryGradenOnceContractTemplateTab from './pages/contract-template/second-contract-template.tab'
import { BusinessMatchmakerListComponent } from './pages/business-matchmaker-manager/business-matchmaker-list.component';
import { CountryGradenAvengerListComponent } from './pages/approval-list/avenger-list.component';
import CountryGradenApprovalListIndexTabConfig from './pages/approval-list/index-tab.config';
import { CountryGradenEnterpoolComponent } from './pages/assets-management/enter-capital-tool/enter-capital-pool-confirmation.component';
import CountryGradenEnterPoolConfig from './pages/assets-management/enter-capital-tool/enter-pool-capital'
import { CountryGradenSecondTransferContractManagerComponent } from './pages/assets-management/contract-template/contract-template.component';
import secondContractTemplateTab from './pages/assets-management/contract-template/second-contract-template.tab';
import { CountryGradenProjectmanageComponent } from './pages/assets-management/country-graden-project-manager/country-graden-project-management.component';
import { CountryGradenProjectmanagePlanComponent } from './pages/assets-management/country-graden-project-manager/country-graden-project-plan-list/country-graden-project-plan-list.component';
import { CountryGradenCapitalpoolComponent } from './pages/assets-management/country-graden-project-manager/country-graden-capital-pool/country-graden-capital-pool.component';
import { CapitalDataAnalyseComponent } from './pages/assets-management/country-graden-project-manager/capital-data-analyse/capital-data-analyse.component';
import { CapitalSampleComponent } from './pages/assets-management/country-graden-project-manager/capital-sample/capital-sample.component';
import { CountryGradenNoticeManageComponent } from './pages/assets-management/country-graden-project-manager/country-graden-notice-manage/country-graden-notice-manage-list.component';
import CountryGradenNoticeManageList from './pages/assets-management/country-graden-project-manager/country-graden-notice-manage/country-graden-notice-manage'

const routes: Routes = [
    // ??????????????????
    {
        path: 'estate-country-graden/:productIdent',
        component: EstateCountryGradenComponent,
        data: { countryGradenTodo: TodoCountryGraden, isPerson: false }
    },
    // ??????????????????(????????????)
    {
        path: 'estate-country-graden-person/:productIdent',
        component: EstateCountryGradenComponent,
        data: { countryGradenTodo: TodoCountryGraden, isPerson: true }
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
                component: CountryGradenRecordComponent
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
                component: CountryGradenEditComponent
            },
            {
                path: ':type/view/:id',
                component: CountryGradenViewComponent
            },
            {
                path: 'view/:id',
                component: CountryGradenViewComponent
            },
        ]
    },
    // ?????????????????????-??????????????????
    {
        path: 'data-docking/list',
        component: CountryGradenDatalockingComponent,
        data: CountryGradendataDockingConfig.getConfig('dataDockingList'),
    },
    // ???????????????
    {
        path: 'machine_list',
        component: MachineListComponent,
        data: MachineIndexTabConfig.getConfig()
    },
    {
        path: 'main-list/detail/:id',
        component: CountryGradenFlowDetailComponent,
    },
    // ??????????????????
    {
        path: 'batch-modify',
        component: BatchModifyComponent,
    },
    // ?????????????????????
    {
        path: 'confirmation-list',
        pathMatch: 'full',
        component: CountryGradenUploadPaymentsComponent,
        data: CountryGradenPaymentTabConfig.getConfig('countryGraden')
    },
    // ?????????????????????????????????
    {
        path: 'oncetransfer-contract-manage',
        component: CountryGradenTransferContractManagerComponent,
        data: { ...CountryGradenOnceContractTemplateTab.getConfig('onceContract'), hideTitle: false }
    },
    // ?????????????????????-???????????????????????????
    {
        path: 'business-matchmaker',
        pathMatch: 'full',
        component: BusinessMatchmakerListComponent,
    },
    // ????????????
    {
        path: 'approval_list',
        component: CountryGradenAvengerListComponent,
        data: CountryGradenApprovalListIndexTabConfig.getConfig('avenger')
    },
    {
        // ????????????
        path: 'assets-management',
        children: [
            {
                // ?????????????????????
                path: 'enter-pool',
                component: CountryGradenEnterpoolComponent,
                data: CountryGradenEnterPoolConfig.get('enterPoolList'),
            },
            {   // ????????????????????????
                path: 'secondtransfer-contract-manage',
                component: CountryGradenSecondTransferContractManagerComponent,
                data: { ...secondContractTemplateTab.getConfig('secondContract'), hideTitle: false }
            },
            { // ????????????
                path: 'project-list',
                component: CountryGradenProjectmanageComponent,
            },
            { // ????????????-??????????????????
                path: 'projectPlan-management',
                component: CountryGradenProjectmanagePlanComponent,
            },
            { // ????????????-??????????????????-????????????-?????????????????????????????????????????????????????????
                path: 'capital-pool',
                component: CountryGradenCapitalpoolComponent,
            },
            { // ????????????-????????????
                path: 'notice-manage',
                component: CountryGradenNoticeManageComponent,
                data: CountryGradenNoticeManageList.getConfig('tabConfig'),
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
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class CountryGradenRoutingModule { }
