import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RecordDragonComponent } from './pages/record-dragon/record-dragon.component';
import { NewComponent } from 'libs/shared/src/lib/public/dragon-vanke/components/record/new.component';
import { DragonRecordComponent } from 'libs/shared/src/lib/public/dragon-vanke/components/record/record.component';
import { DragonEditComponent } from 'libs/shared/src/lib/public/dragon-vanke/components/record/edit.component';
import { DragonViewComponent } from 'libs/shared/src/lib/public/dragon-vanke/components/record/view.component';
import { CapitalPoolComponent } from './pages/capital-pool/capital-pool.component';
import { CapitalPoolCommListComponent } from './pages/capital-pool/capital-pool-comm-list/capital-pool-comm-list.component';
import CapitalPoolTradingList from './pages/capital-pool/capital-pool-comm-list/capital-pool-trading-list';
import { ReceiptListComponent } from './pages/receipt-list/receipt-list.component';
import ReceiptList from './pages/receipt-list/receipt-list';
import { DragonProjectInfoComponent } from './pages/project-company-supplierInfo/additional-materials.component';
import DragonAdditionalMaterials from './common/additional-materials';
import { DragonTransactionsListComponent } from './pages/common/dragon-transactions-list.component';
import DragonTransactionTabConfig from './common/transaction.config';
import { BatchModifyComponent } from './pages/capital-pool/capital-pool-comm-list/batch-modify.component';
import { DragonFlowDetailComponent } from 'libs/shared/src/lib/public/dragon-vanke/components/record/flow-detail.component';
import DragonpaymentTabConfig from './common/upload-payment-confirmation';
import { DragonIntermediaryManagementComponent } from './pages/intermediary-management/intermediary-management-list.componment';
import { DragonIntermediaryUserManagementComponent } from './pages/intermediary-management/intermediary-user-management/intermediary-user-management-list.componment';
import IntermediaryManagementTabConfig from './common/intermediary-management';
import IntermediaryUserManagementTabConfig from './common/intermediary-user-management';
import { DragonUploadPaymentsComponent } from './pages/upload-payment-confirmation/upload-payment-confirmation.component';
import { DragonFactorSignComponent } from './pages/factor-sign-contract/factor-sign-contract.component';
import DragonFactorSign from './pages/factor-sign-contract/factor-sign-contract-data';
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

import TodoDragon from './Tododragon';
import { EstateDragonComponent } from './pages/estate-dragon/dragon.component';
import DragononceContractTemplateTab from './common/dragon-once-contract-template.tab';
import DragonsecondContractTemplateTab from './common/dragon-second-contract-template.tab';
// ????????????
import { FileClassificationComponent } from 'libs/shared/src/lib/public/component/fileClassification/file-classification.component';

const routes: Routes = [
  {
    // ??????????????????-??????
    path: 'estate-dragon/:productIdent',
    component: EstateDragonComponent,
    data: { dragonTodo: TodoDragon, name: '??????????????????', isPerson: false }
  },
  {
    // ?????????-??????-???????????????????????????
    path: 'estate-dragon-person/:productIdent',
    component: EstateDragonComponent,
    data: { dragonTodo: TodoDragon, name: '??????????????????', isPerson: true }
  },
  {
    // ??????????????????????????????
    path: 'pre_record/:id',
    pathMatch: 'full',
    component: RecordDragonComponent,
  },
  {
    // ??????????????????
    path: 'approval_list',
    component: DragonAvengerListComponent,
    data: DragonApprovallistIndexTabConfig.getConfig('avenger'),
  },
  {
    // ????????????
    path: 'machine_list',
    component: DragonMachineListComponent,
    data: { ...MachineIndexTabConfig.getConfig(), name: '??????' },
  },
  {
    // ?????????
    path: 'capital-pool',
    children: [
      {
        path: 'capital-pool-main-list',
        component: CapitalPoolComponent,
      },
      {
        // ????????? - ????????????
        path: 'trading-list',
        component: CapitalPoolCommListComponent,
        data: CapitalPoolTradingList,
        runGuardsAndResolvers: 'always',
      },
      {
        // ????????? - ???????????? - ????????????
        path: 'batch-modify',
        component: BatchModifyComponent,
      },
    ],
  },
  {
    // ??????????????????????????????
    path: 'projectCompany-addInfo',
    component: DragonProjectInfoComponent,
    data: DragonAdditionalMaterials,
  },
  // ??????????????????
  {
    path: 'dragon-list',
    pathMatch: 'full',
    component: DragonTransactionsListComponent,
    data: {
      ...DragonTransactionTabConfig.get('dragonProjectList'),
      hideTitle: true,
    },
  },
  // ??????????????????
  {
    path: 'intermediary',
    children: [
      {
        path: 'intermediary-list',
        component: DragonIntermediaryManagementComponent,
        data: {
          ...IntermediaryManagementTabConfig.getConfig('intermediary'),
          hideTitle: false,
        },
      },
      {
        path: 'intermediary-user-list',
        component: DragonIntermediaryUserManagementComponent,
        data: {
          ...IntermediaryUserManagementTabConfig.getConfig('intermediary'),
          hideTitle: true,
        },
      },
    ],
  },
  // ??????????????????
  {
    path: 'confirmation-list',
    pathMatch: 'full',
    component: DragonUploadPaymentsComponent,
    data: DragonpaymentTabConfig.getConfig('dragon'),
  },
  {
    path: 'factorSign/sign-contract',
    component: DragonFactorSignComponent,
    data: DragonFactorSign,
  },
  {
    // ??????????????????????????????
    path: 'oncetransfer-contract-manage',
    component: DragonTransferContractManagerComponent,
    data: {
      ...DragononceContractTemplateTab.getConfig('onceContract'),
      hideTitle: false,
      name: '????????????????????????',
    },
  },
  {
    path: 'secondtransfer-contract-manage',
    component: DragonTransferContractManagerComponent,
    data: {
      ...DragonsecondContractTemplateTab.getConfig('secondContract'),
      hideTitle: false,
    },
  },
  {
    // ????????????
    path: 'assets-management',
    children: [
      {
        // ?????????????????????
        path: 'enter-pool',
        component: DragonEnterpoolComponent,
        data: DragonEnterPoolConfig.get('enterPoolList'),
      },
      {
        // ????????????????????????
        path: 'secondtransfer-contract-manage',
        component: DragonTransferContractManagerComponent,
        data: {
          ...secondContractTemplateTab.getConfig('secondContract'),
          hideTitle: false,
        },
      },
      {
        // ????????????
        path: 'project-list',
        component: DragonProjectmanageComponent,
      },
      {
        // ????????????-??????????????????
        path: 'projectPlan-management',
        component: DragonProjectmanagePlanComponent,
      },
      {
        // ????????????-??????????????????-????????????-?????????????????????????????????????????????????????????
        path: 'capital-pool',
        component: DragonCapitalpoolComponent,
      },
      {
        // ????????????-????????????
        path: 'notice-manage',
        component: DragonNoticeManageComponent,
        data: DragonNoticeManageList.getConfig('tabConfig'),
      },
      {
        // ????????????
        path: 'capital-sample',
        component: CapitalSampleComponent,
      },
      {
        // ??????????????????
        path: 'capital-data-analyse',
        component: CapitalDataAnalyseComponent,
      },
    ],
  },
  {
    // ??????
    path: 'record',
    children: [
      {
        path: 'file-classification/:id',
        component: FileClassificationComponent,
      },
      {
        path: 'new/:id/:headquarters',
        pathMatch: 'full',
        component: NewComponent,
      },
      {
        path: 'record/:id',
        component: DragonRecordComponent,
      },
      {
        path: 'new/:id/:relatedRecordId',
        component: NewComponent,
      },
      {
        path: 'new',
        component: NewComponent,
      },
      {
        path: ':type/edit/:id',
        component: DragonEditComponent,
      },
      {
        path: ':type/view/:id',
        component: DragonViewComponent,
      },
      {
        path: 'view/:id',
        component: DragonViewComponent,
      },
    ],
  },
  {
    path: 'main-list/detail/:id',
    component: DragonFlowDetailComponent,
  },
  {
    // ????????????????????????
    path: 'receipt-list',
    component: ReceiptListComponent,
    data: ReceiptList,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DragonRoutingModule { }
