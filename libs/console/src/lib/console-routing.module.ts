import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AvengerEditComponent } from 'libs/products/avenger/src/lib/shared/components/record/edit.component';
import { AvengerNewComponent } from 'libs/products/avenger/src/lib/shared/components/record/new.component';
import { AvengerRecordComponent } from 'libs/products/avenger/src/lib/shared/components/record/record.component';
import { AvengerViewComponent } from 'libs/products/avenger/src/lib/shared/components/record/view.component';
import TodoDragon from 'libs/products/dragon/src/lib/Tododragon';
import NewAgileToDo from 'libs/products/new-agile/src/lib/pages/console/todo';
import AccountReceipt from 'libs/shared/src/lib/logic/account-receipt';
import AdditionalMaterials from 'libs/shared/src/lib/logic/additional-materials';
import BankList from 'libs/shared/src/lib/logic/bank-card';
import CapitalPoolTradingList from 'libs/shared/src/lib/logic/capital-pool-trading-list';
import CapitalPoolUnhandledMainList from 'libs/shared/src/lib/logic/capital-pool-unhandled-main-list';
import Deposit from 'libs/shared/src/lib/logic/deposit';
import DirectedPayment from 'libs/shared/src/lib/logic/directed-payment';
import HonourList from 'libs/shared/src/lib/logic/honour-list';
import InstitutionalReview from 'libs/shared/src/lib/logic/institutional-review';
import InvoiceDisplayList from 'libs/shared/src/lib/logic/invoice-display-list';
import InvoiceList from 'libs/shared/src/lib/logic/invoice-list';
import InvoiceUnfillList from 'libs/shared/src/lib/logic/invoice-unfill-list';
import LimitList from 'libs/shared/src/lib/logic/limit-list';
import MainList from 'libs/shared/src/lib/logic/main-list';
import MainDepositList from 'libs/shared/src/lib/logic/main-list-deposit';
import PayPlan from 'libs/shared/src/lib/logic/pay-plan';
import PaymentMessages from 'libs/shared/src/lib/logic/payment-messages';
import SupplierUnsignedContract from 'libs/shared/src/lib/logic/supplierUnsignedContract';
import SysMessages from 'libs/shared/src/lib/logic/sys-messages';
import Todo from 'libs/shared/src/lib/logic/todo';
import TodoAvenger from 'libs/shared/src/lib/logic/todo-avenger';
import { AccountReceiptListComponent } from 'libs/shared/src/lib/public/component/account-receipt-list.component';
import { CapitalPoolCommListComponent } from 'libs/shared/src/lib/public/component/capital-pool-comm-list.component';
import { CapitalPoolUnhandledListComponent } from 'libs/shared/src/lib/public/component/capital-pool-unhandled-list.component';
import { CommAddComponent } from 'libs/shared/src/lib/public/component/comm-add.component';
import { CommDetailComponent } from 'libs/shared/src/lib/public/component/comm-detail.component';
import { CommEditComponent } from 'libs/shared/src/lib/public/component/comm-edit.component';
import { CommListComponent } from 'libs/shared/src/lib/public/component/comm-list.component';
import { InvoiceDisplayDetailComponent } from 'libs/shared/src/lib/public/component/invoice-display-detail.component';
import { XnTabsComponent } from 'libs/shared/src/lib/public/component/tabs/tabs.component';
import { InvoiceReplaceRecordComponent } from 'libs/shared/src/lib/public/form/hw-mode/invoice-replace-record.component';
import { InvoiceReplaceComponent } from 'libs/shared/src/lib/public/form/hw-mode/invoice-replace.component';
import { RegisterDetailComponent } from 'libs/shared/src/lib/public/modal/register-detail.component';
import { ComfirmInformationIndexComponent } from '../../../products/gemdale/src/lib/pages/gemdale-mode/confirm-inforamtion-index.component';
import { ComfirmationSignComponent } from '../../../products/gemdale/src/lib/pages/gemdale-mode/confirmation-sign-component';
import TabConfig from '../../../products/gemdale/src/lib/pages/gemdale-mode/tab-pane';
import { TransSupplementInfoComponent } from '../../../products/gemdale/src/lib/pages/gemdale-mode/trans-supplement-info-component';
import { ClientIndexComponent } from './bank-management/clients/client-index.component';
import { InvoicesIndexComponent } from './bank-management/invoices/invoices-index.component';
import { PaymentNoticeIndexComponent } from './bank-management/payment-notice/payment-notice-index.component';
import { ProtocolManagementIndexComponent } from './bank-management/portocol-management/protocol-management-index.component';
import { DiscountManageComponent } from './bank/discount-manage/discount-manage.component';
import { FinancingManageComponent } from './bank/financing-manage/financing-manage.component';
import { BillReceiveListComponent } from './bill/bill-receive-list.component';
import { BillTradeListComponent } from './bill/bill-trade-list.component';
import { CapitalPoolIndexComponent } from './capital-pool/capital-pool-index.component';
import { CfcaCompanyListComponent } from './cfca/cfca-company-list.component';
import { EstateCfcaComponent } from './cfca/cfca-estate/cfca-estate.component';
import TodoCfca from './cfca/cfca-estate/todo-cfca';
import CfcaConfig from './cfca/cfca-list-config';
import CfcaOperateConfig from './cfca/cfca-operate-list/cfca-operate-config';
import { CfcaOperateListComponent } from './cfca/cfca-operate-list/cfca-operate-list.component';
import { CapitalMapComponent } from './data/capital-map.component';
import { DriveComponent } from './data/drive.component';
import { FactoringEfficiencyComponent } from './data/factoring-efficiency.component';
import { ReportFormDetailComponent } from './data/report-form-detail.component';
import { DepositMessageComponent } from './deposit/deposit-message.component';
import { FlowDetailComponent } from './flow/flow-detail.component';
import { MainFlowComponent } from './flow/main-flow.component';
import { HomeComponent as ConsoleHomeComponent } from './home.component';
import { AdditionalMaterialsComponent } from './manage/additional-materials.component';
import { BankManageComponent } from './manage/bank-manage.component';
import { CaDetailComponent } from './manage/ca-detail.component';
import { HonourFactoryListComponent } from './manage/honour-factory-list.component';
import { HonourListComponent } from './manage/honour-list.component';
import { InvoiceManageComponent } from './manage/invoice-manage.component';
import { InvoicesManageComponent } from './manage/invoices-manage.component';
import { MessageComponent } from './manage/message.component';
import { PaymentComponent } from './manage/payment.component';
import { SupplierUnsignedContractComponent } from './manage/supplier-unsigned-contract.component';
import { ApprovalConditionsComponent } from './my-customer/approval-conditions.component';
import { LimitManageComponent } from './my-customer/limit-manage.component';
import { LvManageComponent } from './my-customer/lv-manage.component';
import { LvWanManageComponent } from './my-customer/lv-wan-manage.component';
import { ReportFormListComponent } from './my-datatable/pages/report-form-list.component';
import { InfoComponent } from './my-information/info.component';
import { RegisterCompanyDetailComponent } from './pages/register-company/register-company-detail/register-company-detail.component';
import { RegisterCompanyListComponent } from './pages/register-company/register-company-list.component';
import { BankEditComponent } from './record/bank/edit.component';
import { BankNewComponent } from './record/bank/new.component';
import { BankRecordComponent } from './record/bank/record.component.component';
import { EditComponent } from './record/edit.component';
import { NewComponent } from './record/new.component';
import { RecordComponent } from './record/record.component';
import { TradeComponent } from './record/trade.component';
import { ViewComponent } from './record/view.component';
import { View2Component } from './record/view2.component';
import { FinancingDetailComponent } from './risk-control/progress/financing-detail.component';
import { InvoiceShowListComponent } from './risk-control/risk-warning/invoice-show-list.component';
import { ServiceFeePromisePayComponent } from './service-fee-promise-pay/service-fee-promise-pay.component';
import { ServiceFeeComponent } from './service-fee/service-fee.component';
import { InterestComponent } from './tools/interest.component';
import { RiskComponent } from './tools/risk.component';
import { ZhongdengTaggingComponent } from './tools/zhongdeng-tagging/zhongdeng-tagging.component';
import { AccountingLoadComponent } from './vnake-mode/contract-template/accounting-load.component';
import { ContractTemplateIndexComponent } from './vnake-mode/contract-template/contract-template-index.component';
import { VankeYjlSupplierSignComponent } from './vnake-mode/vanke-yjl-supplier-sign.component';
import { YajvleSignContractComponent } from './vnake-mode/yajvle-sign-contract.component';
import { RegisterCompanyRelateRightComponent } from './pages/register-company-relate-right/register-company-relate-right.component';
import { CheckTaskManagementListComponent } from './pages/check-task-management/check-task-list.component';
const routes: Routes = [
  {
    path: '',
    component: ConsoleHomeComponent,
    data: {
      todo: Todo,
      sysMsg: SysMessages,
      payMsg: PaymentMessages,
      avengertodo: TodoAvenger,
      dragonTodo: TodoDragon,
      newAgileToDo: NewAgileToDo,
      cfcaTodo: TodoCfca,
    },
  },
  {
    path: 'record/record/:id',
    component: RecordComponent,
  },
  {
    path: 'record/new/:id',
    component: NewComponent,
  },
  {
    path: 'record/new/:id/:relatedRecordId',
    component: NewComponent,
  },
  {
    path: 'record/new',
    component: NewComponent,
  },
  {
    path: 'record/:type/edit/:id',
    component: EditComponent,
  },
  {
    path: 'record/:type/view/:id',
    component: ViewComponent,
  },
  {
    path: 'record/view/:id',
    component: ViewComponent,
  },
  {
    // ?????????????????? ???????????????
    path: 'record/view',
    component: View2Component,
  },
  {
    // ????????????
    path: 'record/info',
    component: InfoComponent,
  },
  {
    path: 'cfca/companylist',
    component: CfcaCompanyListComponent,
    data: CfcaConfig.getConfig('cfcaList'),
  },
  {
    // ??????????????????-cfca????????????
    path: 'cfca/estate-cfca/:productIdent',
    component: EstateCfcaComponent,
    data: { cfcaTodo: TodoCfca },
  },
  {
    path: 'cfca/operate/companylist',
    component: CfcaOperateListComponent,
    data: CfcaOperateConfig.getConfig('cfcaList'),
  },
  // {
  //     path: 'blockchain/home',
  //     component: BlockchainHomeComponent
  // },
  // {
  //     path: 'blockchain/detail/:type/:ledger/:id',
  //     component: BlockchainDetailComponent
  // },
  // {
  //     path: 'blockchain/blocks/:ledger/:id',
  //     component: BlocksComponent
  // },
  {
    path: 'flow/main',
    component: MainFlowComponent,
  },
  {
    path: 'flow/detail/:id',
    component: FlowDetailComponent,
  },
  // {
  //     path: 'data/piaojc',
  //     component: PiaojcComponent
  // },
  // {
  //     path: 'data/money-table',
  //     component: MoneyTableComponent
  // },
  {
    path: 'data/drive',
    component: DriveComponent,
  },
  {
    path: 'data/factoring-efficiency',
    component: FactoringEfficiencyComponent,
  },
  {
    path: 'data/capital-map',
    component: CapitalMapComponent,
  },
  {
    // ????????????-????????????
    path: 'manage/limit-manage',
    component: LimitManageComponent,
  },
  {
    // ????????????-????????????-??????????????????
    path: 'manage/limit-manage/:id',
    component: NewComponent,
  },
  {
    // ????????????-????????????
    path: 'manage/approval-conditions',
    component: ApprovalConditionsComponent,
  },
  {
    // ????????????-?????????????????????
    path: 'manage/lv-manage',
    component: LvManageComponent,
  },
  {
    // ????????????-?????????????????????-??????????????????
    path: 'manage/lv-manage/:id',
    component: NewComponent,
  },
  {
    // ????????????-??????????????????
    path: 'manage/lv-wan-manage',
    component: LvWanManageComponent,
  },
  {
    // ????????????-??????????????????-????????????
    path: 'manage/lv-wan-manage/:id',
    component: NewComponent,
  },
  {
    path: 'manage/invoice-manage',
    component: InvoiceManageComponent,
  },
  {
    path: 'manage/message',
    component: MessageComponent,
  },

  {
    // ca??????
    path: 'szca/ca-status/detail/:id',
    component: CaDetailComponent,
  },
  {
    path: 'manage/bank-manage',
    component: BankManageComponent,
  },
  {
    path: 'manage/invoices-manage',
    component: InvoicesManageComponent,
  },

  {
    path: 'data/report-form-list',
    component: ReportFormListComponent,
  },
  {
    path: 'data/report-form-list/:mainFlowId/:honourNum',
    component: ReportFormDetailComponent,
  },
  {
    path: 'data/honour-list',
    component: HonourListComponent,
  },
  {
    path: 'data/honour-factory-list',
    component: HonourFactoryListComponent,
  },
  {
    // ??????????????????
    path: 'data/register-company',
    component: RegisterCompanyListComponent,
  },
  {
    // ????????????????????????
    path: 'data/register-company-relate-right',
    component: RegisterCompanyRelateRightComponent,
  },
  {
    // ????????????????????????
    path: 'data/register-company/:id',
    component: RegisterCompanyDetailComponent,
    // component: RegisterDetailComponent
  },
  {
    // ????????????-???????????????
    path: 'tools/interest',
    component: InterestComponent,
  },
  {
    // ????????????-??????????????????
    path: 'tools/zhongdeng-tagging',
    component: ZhongdengTaggingComponent,
  },
  {
    // ????????????-????????????
    path: 'tools/risk',
    component: RiskComponent,
  },
  {
    path: 'bank-card/list',
    component: CommListComponent,
    data: BankList,
  },
  {
    path: 'bank-card/detail/:cardCode',
    component: CommDetailComponent,
    data: BankList,
  },
  {
    path: 'bank-card/add',
    component: CommAddComponent,
    data: BankList,
  },
  {
    path: 'bank-card/edit/:cardCode',
    component: CommEditComponent,
    data: BankList,
  },

  {
    path: 'honour-list/detail/:billNumber',
    component: CommDetailComponent,
    data: HonourList,
  },
  {
    // invoice-unfill-list
    path: 'invoice-unifll-list/list',
    component: CommListComponent,
    data: InvoiceUnfillList,
  },
  {
    // main-list
    path: 'main-list/list',
    component: CommListComponent,
    data: MainList,
  },
  {
    // main-list-abs
    path: 'main-list-abs/list',
    component: CommListComponent,
    data: MainList,
  },
  {
    // ????????? - ????????????
    path: 'capital-pool/trading-list',
    component: CapitalPoolCommListComponent,
    data: CapitalPoolTradingList,
    runGuardsAndResolvers: 'always',
  },
  {
    // ???????????????
    path: 'capital-pool/main-list',
    component: CapitalPoolUnhandledListComponent,
    data: CapitalPoolUnhandledMainList,
  },
  {
    // ????????????
    path: 'manage/institutional-review',
    component: CapitalPoolCommListComponent,
    data: InstitutionalReview,
  },
  {
    path: 'main-list/detail/:id/:proxy',
    component: FlowDetailComponent,
  },
  {
    path: 'main-list/detail/:id',
    component: FlowDetailComponent,
  },
  {
    path: 'bill/bill-trade-list',
    component: BillTradeListComponent,
  },
  {
    path: 'bill/bill-receive-list',
    component: BillReceiveListComponent,
  },
  {
    // ??????????????????
    path: 'trade/detail/:mainFlowId',
    component: TradeComponent,
  },
  {
    // ????????????
    path: 'invoice-list/list',
    component: CommListComponent,
    data: InvoiceList,
  },
  {
    path: 'invoice-list/detail/:taxpayerSegistrationNumber',
    component: CommDetailComponent,
    data: InvoiceList,
  },
  {
    path: 'invoice-list/add',
    component: CommAddComponent,
    data: InvoiceList,
  },
  {
    path: 'invoice-list/edit/:taxpayerSegistrationNumber',
    component: CommEditComponent,
    data: InvoiceList,
  },
  {
    // limit-list
    path: 'limit-list/list',
    component: CommListComponent,
    data: LimitList,
  },
  {
    // vanke-????????????????????????
    path: 'export/account-receipt',
    component: AccountReceiptListComponent,
    data: AccountReceipt,
  },
  {
    // ??????abs ????????????????????????????????????
    path: 'gemdale/confirm-receivable',
    component: ComfirmInformationIndexComponent,
    data: TabConfig.get('receivable'),
  },
  {
    // ??????abs ??????????????????????????????
    path: 'gemdale/gemdale-supports',
    component: ComfirmInformationIndexComponent,
    data: TabConfig.get('paymentList'),
  },
  {
    // ??????abs ???????????? ?????????????????????
    path: 'gemdale/gemdale-supports/confirmation',
    component: ComfirmationSignComponent,
    data: TabConfig.get('headquartersSign'),
  },
  // { // ??????abs ???????????????????????????
  //     path: 'gemdale/sign-contract',
  //     component: ComfirmInformationIndexComponent,
  //     data: TabConfig.get('signContract')
  // },
  {
    // ??????abs??????????????? ???????????????????????????
    path: 'yajvle/sign-contract',
    component: YajvleSignContractComponent,
    data: TabConfig.get('yajvleSignContract'),
  },
  {
    // ????????? - abs?????? - ????????????
    path: 'standard_factoring/trans_lists',
    component: ComfirmInformationIndexComponent,
    data: TabConfig.get('standardFactoringList'),
  },
  {
    // ????????? - ???????????? - ???????????? - ????????????
    path: 'standard_factoring/trans_lists/supplement_info',
    component: TransSupplementInfoComponent,
    data: TabConfig.get('standardFactoringSupplementInfo'),
  },
  {
    // ????????? - ???????????? - ????????????
    path: 'vanke/supplement_info',
    component: ComfirmInformationIndexComponent,
    data: TabConfig.get('vankeFactoringSupplementInfo'),
  },
  {
    // ????????? - ????????????????????????????????????
    path: 'estate_chain/supplementary_agreement',
    component: ComfirmInformationIndexComponent,
    data: TabConfig.get('estateSupplyChainSupplementaryAgreement'),
  },
  {
    // ???????????????
    path: 'pay/pay-plan',
    component: CommListComponent,
    data: PayPlan,
  },

  {
    // ????????????-vanke ??????,??????
    path: 'payment/vanke/:type',
    component: PaymentComponent,
  },

  {
    // abs ?????????????????????????????? - ??????????????????
    path: 'payment/pending/load',
    component: AccountingLoadComponent,
  },
  {
    path: 'invoice-display/detail/:invoiceNum',
    component: InvoiceDisplayDetailComponent,
  },
  {
    path: 'invoice-display/invoice-list',
    component: InvoiceShowListComponent, // ????????????
  },
  {
    path: 'member/member/:id',
    component: RegisterDetailComponent,
  },
  {
    // ????????????
    path: 'digital/invoice-display',
    component: CommListComponent,
    data: InvoiceDisplayList,
  },
  {
    // ????????????
    path: 'digital/honour-list',
    component: HonourListComponent,
  },
  {
    // ?????????
    path: 'capital-pool',
    component: XnTabsComponent,
    data: {
      title: '?????????????????????????????????????????????',
      tabs: [
        {
          label: '??????????????????',
          link: 'capital-pool',
          index: 0,
        },
        // {
        //     label: '??????',
        //     link: 'dragon/capital-pool/capital-pool-main-list',
        //     index: 1
        // }
      ],
    },
    children: [
      {
        path: 'logan',
        loadChildren: () =>
          import('libs/products/dragon/src/lib/dragon.module').then(
            (m) => m.DragonModule
          ),
      },
      {
        path: 'capital-pool',
        pathMatch: 'full',
        component: CapitalPoolIndexComponent,
      },
      {
        path: '',
        pathMatch: 'full',
        component: CapitalPoolIndexComponent,
      },
    ],
  },
  // ??????????????????????????????
  // ??????????????????
  {
    path: 'record/record-directed/:id',
    component: CommListComponent,
    data: DirectedPayment,
  },

  // ????????????>????????????>??????????????????
  {
    path: 'additional-materials',
    component: AdditionalMaterialsComponent,
    data: AdditionalMaterials,
  },
  // ????????????>??????????????????????????????
  {
    path: 'record/unsigned_contract',
    component: SupplierUnsignedContractComponent,
    data: SupplierUnsignedContract,
  },
  // ???????????????????????????
  {
    path: 'record/record-change/:id',
    component: InvoiceReplaceComponent,
  },
  // ??????????????????
  {
    path: 'record/invoice-change/:mainFlowId',
    component: InvoiceReplaceRecordComponent,
  },
  {
    // ??????3.0 ??????????????????????????????
    path: 'main-list-vanke/list',
    component: CommListComponent,
    data: MainList,
  },
  {
    // ?????????????????????
    path: 'service-fee',
    component: ServiceFeeComponent,
  },
  {
    // ???????????????????????????
    path: 'service-fee-promise-pay',
    component: ServiceFeePromisePayComponent,
  },
  {
    // ????????????????????????
    path: 'bank/discount',
    component: DiscountManageComponent,
  },
  {
    // ??????????????????
    path: 'bank/financing',
    component: FinancingManageComponent,
  },
  {
    // ????????????
    path: 'bank/record/:id',
    component: BankRecordComponent,
  },
  {
    // ???????????? ????????????
    path: 'bank/record/new/:id',
    component: BankNewComponent,
  },
  {
    // ???????????? edit
    path: 'bank/record/:type/edit/:id',
    component: BankEditComponent,
  },
  {
    // ???????????????
    path: 'manage/deposit-manage',
    component: CommListComponent,
    data: Deposit,
  },
  {
    // ???????????????
    path: 'deposit/list',
    component: CommListComponent,
    data: MainDepositList,
  },
  {
    // ???????????????
    path: 'deposit/detail/:mainFlowId',
    component: DepositMessageComponent,
  },
  {
    path: 'management/protocol-management',
    component: ProtocolManagementIndexComponent,
  },
  {
    path: 'management/payment-notice',
    component: PaymentNoticeIndexComponent,
  },
  {
    path: 'management/client',
    component: ClientIndexComponent,
  },
  {
    path: 'management/invoices',
    component: InvoicesIndexComponent,
  },
  {
    // vanke ????????????
    path: 'vanke-model/contract-template',
    component: ContractTemplateIndexComponent,
  },
  {
    // ?????????????????????
    path: 'record/supplier_sign/:id',
    component: VankeYjlSupplierSignComponent,
  },
  // ????????????
  {
    path: 'risk/risk-map',
    loadChildren: () =>
      import('./risk-control/risk/risk-map.module').then(
        (m) => m.RiskMapModule
      ),
  },
  {
    // ????????????
    path: 'progress/progress',
    loadChildren: () =>
      import('./risk-control/progress/progress.module').then(
        (m) => m.ProgressModule
      ),
  },
  {
    // ????????????
    path: 'risk-control/risk-warning/:id',
    component: FinancingDetailComponent,
  },
  {
    // ????????????
    path: 'survey/survey',
    loadChildren: () =>
      import('./risk-control/survey/survey.module').then((m) => m.SurveyModule),
  },
  {
    // ????????????
    path: 'risk-control/risk-warning',
    loadChildren: () =>
      import('./risk-control/risk-warning/risk-warning.module').then(
        (m) => m.RiskWarningModule
      ),
  },
  {
    // ????????????
    path: 'transaction-control/contract',
    loadChildren: () =>
      import(
        './risk-control/transaction-control/contract/contract.module'
      ).then((m) => m.ContractModule),
  },
  {
    // ????????????
    path: 'transaction-control/amount',
    loadChildren: () =>
      import('./risk-control/transaction-control/amount/amount.module').then(
        (m) => m.AmountModule
      ),
  },
  {
    // ????????????
    path: 'transaction-control/transaction',
    loadChildren: () =>
      import(
        './risk-control/transaction-control/transaction/transaction.module'
      ).then((m) => m.TransactionModule),
  },
  {
    // ????????????
    path: 'transaction-control/rate',
    loadChildren: () =>
      import('./risk-control/transaction-control/rate/rate.module').then(
        (m) => m.RateModule
      ),
  },
  {
    // ????????????
    path: 'risk-control/comprehensive-testing',
    loadChildren: () =>
      import('./risk-control/monitor/monitor.module').then(
        (m) => m.MonitorModule
      ),
  },
  /** ???????????? */
  {
    path: 'record/avenger/record/:id',
    component: AvengerRecordComponent,
  },
  {
    path: 'record/avenger/new/:id',
    component: AvengerNewComponent,
  },
  {
    path: 'record/avenger/new/:id/:relatedRecordId',
    component: AvengerNewComponent,
  },
  {
    path: 'record/avenger/new',
    component: AvengerNewComponent,
  },
  {
    path: 'record/avenger/:type/edit/:id',
    component: AvengerEditComponent,
  },
  {
    path: 'record/avenger/:type/view/:id',
    component: AvengerViewComponent,
  },
  {
    path: 'bank-puhuitong',
    loadChildren: () =>
      import('libs/products/bank-puhuitong/src/lib/bank-puhuitong.module').then(
        (m) => m.BankPuhuitongModule
      ),
  },
  // ???????????? lazyload
  {
    path: 'main',
    component: XnTabsComponent,
    data: {
      title: '????????????',
      tabs: [
        {
          label: '???????????????', // ????????????
          link: 'dragon/dragon-list',
          index: 0,
        },
        // {
        //     label: '???????????????????????????',  // ?????????
        //     link: 'avenger-list',
        //     index: 1
        // },

        // {
        //     label: '????????????????????????',   //???????????????
        //     link: 'trans_lists',
        //     index: 1
        // },
      ],
    },
    children: [
      {
        path: 'logan',
        loadChildren: () =>
          import('libs/products/dragon/src/lib/dragon.module').then(
            (m) => m.DragonModule
          ),
      },
      // {
      //     path: 'avenger-list',
      //     loadChildren: () => import('libs/products/avenger/src/lib/avenger-list/avenger-list.module').then(m => m.AvengerListModule),
      // },
      {
        path: 'new-agile',
        loadChildren: () =>
          import('libs/products/new-agile/src/lib/new-agile.module').then(
            (m) => m.NewAgileModule
          ),
      },
    ],
  },

  // ????????????
  {
    path: 'invoice-list',
    loadChildren: () =>
      import(
        'libs/products/avenger/src/lib/invoice-management/invoice-management.module'
      ).then((m) => m.AvengerInvoiceManagementModule),
  },
  // ????????????
  {
    path: 'approvalloans-manager',
    loadChildren: () =>
      import(
        'libs/products/avenger/src/lib/approval-loans/approval-loan-manage.module'
      ).then((m) => m.AvengerApprovalLoanModule),
  },
  {
    path: 'payment-management',
    loadChildren: () =>
      import(
        'libs/products/avenger/src/lib/payment-management/payment-management.module'
      ).then((m) => m.AvengerpaymentManagementModule),
  },

  // ????????????
  {
    path: 'manage',
    loadChildren: () =>
      import('./management/management.module').then((m) => m.ManagementModule),
  },
  // ??????????????????
  {
    path: 'manage/check-task-list',
    component: CheckTaskManagementListComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ConsoleRoutingModule {}
