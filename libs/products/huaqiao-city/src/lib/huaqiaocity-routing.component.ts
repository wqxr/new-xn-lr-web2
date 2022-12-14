import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HuaQiaoCityEnterpoolComponent } from './pages/assets-management/enter-capital-tool/enter-capital-pool-confirmation.component';
import vankeEnterPoolConfig from './common/enter-pool-capital';
import { TransferContractManagerComponent } from './pages/assets-management/contract-template/contract-template.component';
import secondContractTemplateTab from './common/second-contract-template.tab';
import { RecordHuaQiaoCityComponent } from './pages/record-huaqiao-city/record-huaqiao-city.component';
import { HuaQiaoCityAvengerListComponent } from './pages/approval-list/avenger-list.component';
import { HuaQiaoCityProjectmanageComponent } from './pages/assets-management/huaqiao-city-project-manager/huaqiao-city-project-management.component';
import { HuaQiaoCityProjectmanagePlanComponent } from './pages/assets-management/huaqiao-city-project-manager/huaqiao-city-project-plan-list/huaqiao-city-project-plan-list.component';
import { HuaQiaoCityCapitalpoolComponent } from './pages/assets-management/huaqiao-city-project-manager/huaqiao-city-capital-pool/huaqiao-city-capital-pool.component';
import VankeNoticeManageList from './pages/assets-management/huaqiao-city-project-manager/huaqiao-city-notice-manage/huaqiao-city-notice-manage'

import MachineIndexTabConfig from './pages/machine-list/machine-list.config';
import { DemoListComponent } from './pages/machine-list/machine-list.component';
import { HuaQiaoCityUploadPaymentsComponent } from './pages/upload-payment-confirmation/upload-payment-confirmation.component';
import VankepaymentTabConfig from './pages/upload-payment-confirmation/upload-payment-confirmation'
import ProjectManagerList from './common/project-management';
import ProjectManagerplanList from './pages/assets-management/huaqiao-city-project-manager/huaqiao-city-project-plan-list/huaqiao-city-project-plan';
import ProjectManagerCapitalList from './pages/assets-management/huaqiao-city-project-manager/huaqiao-city-capital-pool/huaqiao-city-capital-pool';
import ApprovallistIndexTabConfig from './pages/approval-list/approval-list-table';
import TodoHuaQiaoCity from './TodoHuaqiao';
import { HuaQiaoCityDatalockingComponent } from './pages/huaqiao-city-data-docking/huaqiao-city-data-docking.component';
import VankedataDockingConfig from './pages/huaqiao-city-data-docking/huaqiao-city-data.docking'
import { BusinessMatchmakerListComponent } from './pages/business-matchmaker-manager/business-matchmaker-list.component';

import DragonpaymentDownloadTabConfig from './common/download-payment-confirmation';
import { DragonDownloadPaymentsComponent } from './pages/download-payment-confirmation/download-payment-confirmation.component';
import { HuaQiaoCityNoticeManageComponent } from './pages/assets-management/huaqiao-city-project-manager/huaqiao-city-notice-manage/huaqiao-city-notice-manage-list.component';
import { CapitalSampleComponent } from './pages/assets-management/huaqiao-city-project-manager/capital-sample/capital-sample.component';
import { CapitalDataAnalyseComponent } from './pages/assets-management/huaqiao-city-project-manager/capital-data-analyse/capital-data-analyse.component';
import CapitalPoolTradingList from './pages/trading-list/capital-pool-trading-list';
import { EstateHuaQiaoCityComponent } from './pages/estate-huaqiao-city/huaqiao-city.component';
import { HuaQiaoCityCapitalPoolCommListComponent } from './pages/trading-list/capital-pool-comm-list.component';
import { HuaQiaoCityNewComponent } from './shared/component/record/new.component';
import { HuaQiaoCityViewComponent } from './shared/component/record/view.component';
import { HuaQiaoCityEditComponent } from './shared/component/record/edit.component';
import { HuaQiaoCityRecordComponent } from './shared/component/record/record.component';
import { HuaqiaoCityTransferContractManagerComponent } from './pages/contract-template/contract-template.component';
import onceContractTemplateTab from './common/once-contract-template.tab';
import { HuaQiaoCityFlowDetailRecordComponent } from './shared/component/record/flow-detail-record.component';
import { HuaQiaoCityFlowDetailComponent } from './shared/component/record/flow-detail.component';
import { BatchModifyComponent } from './pages/machine-list/batch-modify.component';
const routes: Routes = [
    {
        // ??????????????????-?????????
        path: 'estate-oct/:productIdent',
        component: EstateHuaQiaoCityComponent,
        data: { dragonTodo: TodoHuaQiaoCity, name: '????????????-?????????', isPerson: false }
    },
    {
        // ??????????????????-?????????(????????????)
        path: 'estate-oct-person/:productIdent',
        component: EstateHuaQiaoCityComponent,
        data: { dragonTodo: TodoHuaQiaoCity, name: '????????????-?????????', isPerson: true }
    },
    {
        // ??????????????????????????????
        path: 'oct/pre_record/:id',
        pathMatch: 'full',
        component: RecordHuaQiaoCityComponent,
        // data:{name:''}
    },
    {
        // ??????????????????
        path: 'oct/approval_list',
        component: HuaQiaoCityAvengerListComponent,
        data: { ...ApprovallistIndexTabConfig.getConfig('avenger'), name: '????????????' }
    },
    {
        // ??????
        path: 'record',
        children: [
            {
                path: 'new/:id/:headquarters',
                pathMatch: 'full',
                component: HuaQiaoCityNewComponent,
            },
            {
                path: 'record/:id',
                component: HuaQiaoCityRecordComponent
            },
            {
                path: 'new/:id/:relatedRecordId',
                component: HuaQiaoCityNewComponent
            },
            {
                path: 'new',
                component: HuaQiaoCityNewComponent
            },
            {
                path: ':type/edit/:id',
                component: HuaQiaoCityEditComponent
            },
            {
                path: ':type/view/:id',
                component: HuaQiaoCityViewComponent
            },
            {
                path: 'view/:id',
                component: HuaQiaoCityViewComponent
            },
        ]
    },
    {
        // ????????????
        path: 'assets-management',
        children: [{
            // ?????????????????????
            path: 'enter-pool',
            component: HuaQiaoCityEnterpoolComponent,
            data: { ...vankeEnterPoolConfig.get('enterPoolList'), name: '?????????????????????' },
        },
        {   // ????????????????????????
            path: 'secondtransfer-contract-manage',
            component: TransferContractManagerComponent,
            data: { ...secondContractTemplateTab.getConfig('secondContract'), hideTitle: false, name: '??????????????????' }
        },
        { // ????????????
            path: 'project-list',
            component: HuaQiaoCityProjectmanageComponent,
            data: { name: '????????????' }
            // data: ProjectManagerList.getConfig('projectManager'),
        },
        { // ????????????-??????????????????
            path: 'projectPlan-management',
            component: HuaQiaoCityProjectmanagePlanComponent,
            data: { name: '??????????????????' }
            // data: ProjectManagerplanList.getConfig('projectplanManager'),
        },
        { // ????????????-??????????????????-????????????-?????????????????????????????????????????????????????????
            path: 'capital-pool',
            component: HuaQiaoCityCapitalpoolComponent,
            data: { name: '????????????' }
            // data: ProjectManagerCapitalList.getConfig('vankeCapitallist'),
        },
        { // ????????????-????????????
            path: 'notice-manage',
            component: HuaQiaoCityNoticeManageComponent,
            data: { ...VankeNoticeManageList.getConfig('tabConfig'), name: '????????????' },
        },
        { // ????????????
            path: 'capital-sample',
            component: CapitalSampleComponent,
            data: { name: '??????' }
        },
        { // ??????????????????
            path: 'capital-data-analyse',
            component: CapitalDataAnalyseComponent,
            data: { name: '????????????' }
        },
        ],
    },
    {
        // ????????????
        path: 'oct/machine_list',
        component: DemoListComponent,
        data: { ...MachineIndexTabConfig.getConfig(), name: '??????' }
    },
    { // ????????? - ???????????? - ????????????
      path: 'oct/machine_list/batch-modify',
      component: BatchModifyComponent,
    },
    // ??????????????????
    {
        path: 'oct/confirmation-list',
        pathMatch: 'full',
        component: HuaQiaoCityUploadPaymentsComponent,
        data: { ...VankepaymentTabConfig.getConfig('dragon'), name: '????????????' },
    },
    // ??????????????????-??????????????????
    {
        path: 'data-docking/list',
        component: HuaQiaoCityDatalockingComponent,
        data: { ...VankedataDockingConfig.getConfig('dataDockingList'), name: '??????????????????' },
    },
    { // ??????????????????-???????????????????????????
        path: 'business-matchmaker',
        pathMatch: 'full',
        component: BusinessMatchmakerListComponent,
        data: { name: '???????????????????????????' }
    },
    // ????????????
    {
        path: 'confirmation-download',
        pathMatch: 'full',
        component: DragonDownloadPaymentsComponent,
        data: { ...DragonpaymentDownloadTabConfig.getConfig('download_payconfirm'), hideTitle: false, name: '????????????' }
    },
    { // ???????????? - ???????????????????????????????????????
        path: 'trading-list',
        component: HuaQiaoCityCapitalPoolCommListComponent,
        data: CapitalPoolTradingList,
        runGuardsAndResolvers: 'always',
    },

    { // ??????????????????????????????
        path: 'oncetransfer-contract-manage',
        component: HuaqiaoCityTransferContractManagerComponent,
        data: { ...onceContractTemplateTab.getConfig('onceContract'), hideTitle: false, name: '????????????????????????' }
    },
    {
        path: 'main-list/detail/:id',
        component: HuaQiaoCityFlowDetailComponent,
        data: { name: '????????????' }
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class HuaQiaoCityRoutingModule { }
