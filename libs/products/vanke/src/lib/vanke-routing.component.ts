import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { VankeEnterpoolComponent } from './pages/assets-management/enter-capital-tool/enter-capital-pool-confirmation.component';
import vankeEnterPoolConfig from './common/enter-pool-capital';
import { TransferContractManagerComponent } from './pages/assets-management/contract-template/contract-template.component';
import secondContractTemplateTab from './common/second-contract-template.tab';
import { RecordVankeComponent } from './pages/record-vanke/record-vanke.component';
import { VankeAvengerListComponent } from './pages/approval-list/avenger-list.component';
import { VankeProjectmanageComponent } from './pages/assets-management/vanke-project-manager/vanke-project-management.component';
import { VankeProjectmanagePlanComponent } from './pages/assets-management/vanke-project-manager/vanke-project-plan-list/vanke-project-plan-list.component';
import { VankeCapitalpoolComponent } from './pages/assets-management/vanke-project-manager/vanke-capital-pool/vanke-capital-pool.component';
import VankeNoticeManageList from './pages/assets-management/vanke-project-manager/vanke-notice-manage/vanke-notice-manage'

import MachineIndexTabConfig from './pages/machine-list/machine-list.config';
import { DemoListComponent } from './pages/machine-list/machine-list.component';
import { VankeUploadPaymentsComponent } from './pages/upload-payment-confirmation/upload-payment-confirmation.component';
import VankepaymentTabConfig from './pages/upload-payment-confirmation/upload-payment-confirmation'
import ApprovallistIndexTabConfig from './pages/approval-list/approval-list-table';

import { EstateVankeComponent } from './pages/estate-vanke/vanke.component';
import TodoVanke from './TodoVanke';
import { VankeDatalockingComponent } from './pages/vanke-data-docking/vanke-data-docking.component';
import VankedataDockingConfig from './pages/vanke-data-docking/vanke-data.docking'
import { BusinessMatchmakerListComponent } from './pages/business-matchmaker-manager/business-matchmaker-list.component';

import DragonpaymentDownloadTabConfig from './common/download-payment-confirmation';
import { DragonDownloadPaymentsComponent } from './pages/download-payment-confirmation/download-payment-confirmation.component'
import { VankeNoticeManageComponent } from './pages/assets-management/vanke-project-manager/vanke-notice-manage/vanke-notice-manage-list.component';
import { CapitalSampleComponent } from './pages/assets-management/vanke-project-manager/capital-sample/capital-sample.component';
import { CapitalDataAnalyseComponent } from './pages/assets-management/vanke-project-manager/capital-data-analyse/capital-data-analyse.component';
import { VankeCapitalPoolCommListComponent } from './pages/trading-list/capital-pool-comm-list.component';
import CapitalPoolTradingList from './pages/trading-list/capital-pool-trading-list'
import { CapitalPoolUnhandledListComponent } from './pages/capital-pool-unhandled-list/capital-pool-unhandled-list.component';
import CapitalPoolUnhandledMainList from './pages/capital-pool-unhandled-list/capital-pool-unhandled-main-list'
import { VankeNewComponent } from './shared/components/record/new.component';
import { VankeEditComponent } from './shared/components/record/edit.component';
import { VankeRecordComponent } from './shared/components/record/record.component';
import { VankeViewComponent } from './shared/components/record/view.component';
import { VankeFlowDetailComponent } from './shared/components/record/flow-detail.component';
const routes: Routes = [
  {
    // ??????????????????-??????
    path: 'estate-vanke/:productIdent',
    component: EstateVankeComponent,
    data: { dragonTodo: TodoVanke, isPerson: false }
  },
  {
    // ?????????-??????-???????????????????????????
    path: 'estate-vanke-person/:productIdent',
    component: EstateVankeComponent,
    data: { dragonTodo: TodoVanke, isPerson: true }
  },
  {
    // ??????????????????????????????
    path: 'vanke/pre_record/:id',
    pathMatch: 'full',
    component: RecordVankeComponent
  },
  {
    // ??????????????????
    path: 'vanke/approval_list',
    component: VankeAvengerListComponent,
    data: ApprovallistIndexTabConfig.getConfig('avenger')
  },
  {
    // ????????????
    path: 'assets-management',
    children: [{
      // ?????????????????????
      path: 'enter-pool',
      component: VankeEnterpoolComponent,
      data: vankeEnterPoolConfig.get('enterPoolList'),
    },
    {   // ????????????????????????
      path: 'secondtransfer-contract-manage',
      component: TransferContractManagerComponent,
      data: { ...secondContractTemplateTab.getConfig('secondContract'), hideTitle: false }
    },
    { // ????????????
      path: 'project-list',
      component: VankeProjectmanageComponent,
      // data: ProjectManagerList.getConfig('projectManager'),
    },
    { // ????????????-??????????????????
      path: 'projectPlan-management',
      component: VankeProjectmanagePlanComponent,
      // data: ProjectManagerplanList.getConfig('projectplanManager'),
    },
    { // ????????????-??????????????????-????????????-?????????????????????????????????????????????????????????
      path: 'capital-pool',
      component: VankeCapitalpoolComponent,
      // data: ProjectManagerCapitalList.getConfig('vankeCapitallist'),
    },
    { // ????????????-????????????
      path: 'notice-manage',
      component: VankeNoticeManageComponent,
      data: VankeNoticeManageList.getConfig('tabConfig'),
    },
    { // ????????????
      path: 'capital-sample',
      component: CapitalSampleComponent
    },
    { // ??????????????????
      path: 'capital-data-analyse',
      component: CapitalDataAnalyseComponent
    },
    ],
  },
  {
    // ????????????
    path: 'vanke/machine_list',
    component: DemoListComponent,
    data: MachineIndexTabConfig.getConfig()
  },
  // ??????????????????
  {
    path: 'vanke/confirmation-list',
    pathMatch: 'full',
    component: VankeUploadPaymentsComponent,
    data: VankepaymentTabConfig.getConfig('dragon')
  },
  // ??????????????????-??????????????????
  {
    path: 'data-docking/list',
    component: VankeDatalockingComponent,
    data: VankedataDockingConfig.getConfig('dataDockingList'),
  },
  { // ??????????????????-???????????????????????????
    path: 'business-matchmaker',
    pathMatch: 'full',
    component: BusinessMatchmakerListComponent,
  },
  // ????????????
  {
    path: 'confirmation-download',
    pathMatch: 'full',
    component: DragonDownloadPaymentsComponent,
    data: { ...DragonpaymentDownloadTabConfig.getConfig('download_payconfirm'), hideTitle: false }
  },
  { // ???????????? - ???????????????????????????????????????
    path: 'trading-list',
    component: VankeCapitalPoolCommListComponent,
    data: CapitalPoolTradingList,
    runGuardsAndResolvers: 'always',
  },
  { // ???????????? - ??????????????????????????????????????????????????????
    path: 'unhandled-list',
    component: CapitalPoolUnhandledListComponent,
    data: CapitalPoolUnhandledMainList
  },
  {
    // ??????
    path: 'record',
    children: [
      {
        // ????????????
        path: 'new/:id/:headquarters',
        pathMatch: 'full',
        component: VankeNewComponent,
      },
      {
        // ???????????????
        path: 'new/:id/:relatedRecordId',
        component: VankeNewComponent
      },
      {
        // ???????????????
        path: 'new',
        component: VankeNewComponent
      },
      {
        // ????????????
        path: ':type/edit/:id',
        component: VankeEditComponent
      },
      {
        // ??????????????????
        path: 'record/:id',
        component: VankeRecordComponent
      },
      {
        // ??????????????????
        path: ':type/view/:id',
        component: VankeViewComponent
      },
      {
        path: 'view/:id',
        component: VankeViewComponent
      },
    ]
  },
  {
    // ????????????????????????
    path: 'main-list/detail/:id',
    component: VankeFlowDetailComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class NewVankeRoutingModule { }
