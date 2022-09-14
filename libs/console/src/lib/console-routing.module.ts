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
    // 资产证券平台 查看子流程
    path: 'record/view',
    component: View2Component,
  },
  {
    // 企业资料
    path: 'record/info',
    component: InfoComponent,
  },
  {
    path: 'cfca/companylist',
    component: CfcaCompanyListComponent,
    data: CfcaConfig.getConfig('cfcaList'),
  },
  {
    // 地产业务列表-cfca审核待办
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
    // 我的客户-额度管理
    path: 'manage/limit-manage',
    component: LimitManageComponent,
  },
  {
    // 我的客户-额度管理-额度变更申请
    path: 'manage/limit-manage/:id',
    component: NewComponent,
  },
  {
    // 我的客户-审批条件
    path: 'manage/approval-conditions',
    component: ApprovalConditionsComponent,
  },
  {
    // 我的客户-两票一合同利率
    path: 'manage/lv-manage',
    component: LvManageComponent,
  },
  {
    // 我的客户-两票一合同利率-额度变更申请
    path: 'manage/lv-manage/:id',
    component: NewComponent,
  },
  {
    // 我的客户-标准保理利率
    path: 'manage/lv-wan-manage',
    component: LvWanManageComponent,
  },
  {
    // 我的客户-标准保理利率-新增利率
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
    // ca详情
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
    // 平台注册公司
    path: 'data/register-company',
    component: RegisterCompanyListComponent,
  },
  {
    // 新版注册公司页面
    path: 'data/register-company-relate-right',
    component: RegisterCompanyRelateRightComponent,
  },
  {
    // 平台注册公司详情
    path: 'data/register-company/:id',
    component: RegisterCompanyDetailComponent,
    // component: RegisterDetailComponent
  },
  {
    // 我的工具-利息计算器
    path: 'tools/interest',
    component: InterestComponent,
  },
  {
    // 我的工具-中登数据标注
    path: 'tools/zhongdeng-tagging',
    component: ZhongdengTaggingComponent,
  },
  {
    // 我的工具-智能风控
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
    // 资产池 - 交易列表
    path: 'capital-pool/trading-list',
    component: CapitalPoolCommListComponent,
    data: CapitalPoolTradingList,
    runGuardsAndResolvers: 'always',
  },
  {
    // 未入池交易
    path: 'capital-pool/main-list',
    component: CapitalPoolUnhandledListComponent,
    data: CapitalPoolUnhandledMainList,
  },
  {
    // 机构审核
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
    // 转账流水详情
    path: 'trade/detail/:mainFlowId',
    component: TradeComponent,
  },
  {
    // 发票管理
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
    // vanke-生成应收账款回执
    path: 'export/account-receipt',
    component: AccountReceiptListComponent,
    data: AccountReceipt,
  },
  {
    // 金地abs 项目公司确认应收账款金额
    path: 'gemdale/confirm-receivable',
    component: ComfirmInformationIndexComponent,
    data: TabConfig.get('receivable'),
  },
  {
    // 金地abs 集团公司确认付款清单
    path: 'gemdale/gemdale-supports',
    component: ComfirmInformationIndexComponent,
    data: TabConfig.get('paymentList'),
  },
  {
    // 金地abs 集团公司 签署付款确认书
    path: 'gemdale/gemdale-supports/confirmation',
    component: ComfirmationSignComponent,
    data: TabConfig.get('headquartersSign'),
  },
  // { // 金地abs 保理商批量签署合同
  //     path: 'gemdale/sign-contract',
  //     component: ComfirmInformationIndexComponent,
  //     data: TabConfig.get('signContract')
  // },
  {
    // 万科abs（雅居乐） 保理商批量签署合同
    path: 'yajvle/sign-contract',
    component: YajvleSignContractComponent,
    data: TabConfig.get('yajvleSignContract'),
  },
  {
    // 保理商 - abs地产 - 交易列表
    path: 'standard_factoring/trans_lists',
    component: ComfirmInformationIndexComponent,
    data: TabConfig.get('standardFactoringList'),
  },
  {
    // 保理商 - 标准保理 - 交易列表 - 补充信息
    path: 'standard_factoring/trans_lists/supplement_info',
    component: TransSupplementInfoComponent,
    data: TabConfig.get('standardFactoringSupplementInfo'),
  },
  {
    // 保理商 - 万科模式 - 补充信息
    path: 'vanke/supplement_info',
    component: ComfirmInformationIndexComponent,
    data: TabConfig.get('vankeFactoringSupplementInfo'),
  },
  {
    // 保理商 - 地产供应链雅居乐补充协议
    path: 'estate_chain/supplementary_agreement',
    component: ComfirmInformationIndexComponent,
    data: TabConfig.get('estateSupplyChainSupplementaryAgreement'),
  },
  {
    // 付款计划表
    path: 'pay/pay-plan',
    component: CommListComponent,
    data: PayPlan,
  },

  {
    // 付款管理-vanke 万科,金地
    path: 'payment/vanke/:type',
    component: PaymentComponent,
  },

  {
    // abs 付款管理已打印带放款 - 下载会计下载
    path: 'payment/pending/load',
    component: AccountingLoadComponent,
  },
  {
    path: 'invoice-display/detail/:invoiceNum',
    component: InvoiceDisplayDetailComponent,
  },
  {
    path: 'invoice-display/invoice-list',
    component: InvoiceShowListComponent, // 发票展示
  },
  {
    path: 'member/member/:id',
    component: RegisterDetailComponent,
  },
  {
    // 发票认证
    path: 'digital/invoice-display',
    component: CommListComponent,
    data: InvoiceDisplayList,
  },
  {
    // 商票认证
    path: 'digital/honour-list',
    component: HonourListComponent,
  },
  {
    // 资产池
    path: 'capital-pool',
    component: XnTabsComponent,
    data: {
      title: '资产池（房地产供应链标准保理）',
      tabs: [
        {
          label: '万科、雅居乐',
          link: 'capital-pool',
          index: 0,
        },
        // {
        //     label: '龙光',
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
  // 万科模式改用通用列表
  // 定向收款保理
  {
    path: 'record/record-directed/:id',
    component: CommListComponent,
    data: DirectedPayment,
  },

  // 项目公司>标准保理>补充业务资料
  {
    path: 'additional-materials',
    component: AdditionalMaterialsComponent,
    data: AdditionalMaterials,
  },
  // 我的交易>供应商待签署合同交易
  {
    path: 'record/unsigned_contract',
    component: SupplierUnsignedContractComponent,
    data: SupplierUnsignedContract,
  },
  // 待替换发票交易列表
  {
    path: 'record/record-change/:id',
    component: InvoiceReplaceComponent,
  },
  // 替换发票记录
  {
    path: 'record/invoice-change/:mainFlowId',
    component: InvoiceReplaceRecordComponent,
  },
  {
    // 万科3.0 临时所有交易（会改）
    path: 'main-list-vanke/list',
    component: CommListComponent,
    data: MainList,
  },
  {
    // 平台服务费管理
    path: 'service-fee',
    component: ServiceFeeComponent,
  },
  {
    // 保证付款服务费管理
    path: 'service-fee-promise-pay',
    component: ServiceFeePromisePayComponent,
  },
  {
    // 银行保理保证管理
    path: 'bank/discount',
    component: DiscountManageComponent,
  },
  {
    // 银行融资管理
    path: 'bank/financing',
    component: FinancingManageComponent,
  },
  {
    // 保证付款
    path: 'bank/record/:id',
    component: BankRecordComponent,
  },
  {
    // 保证付款 发起交易
    path: 'bank/record/new/:id',
    component: BankNewComponent,
  },
  {
    // 保证付款 edit
    path: 'bank/record/:type/edit/:id',
    component: BankEditComponent,
  },
  {
    // 保证金管理
    path: 'manage/deposit-manage',
    component: CommListComponent,
    data: Deposit,
  },
  {
    // 保证金列表
    path: 'deposit/list',
    component: CommListComponent,
    data: MainDepositList,
  },
  {
    // 保证金详情
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
    // vanke 合同模版
    path: 'vanke-model/contract-template',
    component: ContractTemplateIndexComponent,
  },
  {
    // 供应商补充资料
    path: 'record/supplier_sign/:id',
    component: VankeYjlSupplierSignComponent,
  },
  // 保理风控
  {
    path: 'risk/risk-map',
    loadChildren: () =>
      import('./risk-control/risk/risk-map.module').then(
        (m) => m.RiskMapModule
      ),
  },
  {
    // 过程管理
    path: 'progress/progress',
    loadChildren: () =>
      import('./risk-control/progress/progress.module').then(
        (m) => m.ProgressModule
      ),
  },
  {
    // 融资详情
    path: 'risk-control/risk-warning/:id',
    component: FinancingDetailComponent,
  },
  {
    // 客户调查
    path: 'survey/survey',
    loadChildren: () =>
      import('./risk-control/survey/survey.module').then((m) => m.SurveyModule),
  },
  {
    // 风险预警
    path: 'risk-control/risk-warning',
    loadChildren: () =>
      import('./risk-control/risk-warning/risk-warning.module').then(
        (m) => m.RiskWarningModule
      ),
  },
  {
    // 合同控制
    path: 'transaction-control/contract',
    loadChildren: () =>
      import(
        './risk-control/transaction-control/contract/contract.module'
      ).then((m) => m.ContractModule),
  },
  {
    // 额度控制
    path: 'transaction-control/amount',
    loadChildren: () =>
      import('./risk-control/transaction-control/amount/amount.module').then(
        (m) => m.AmountModule
      ),
  },
  {
    // 交易控制
    path: 'transaction-control/transaction',
    loadChildren: () =>
      import(
        './risk-control/transaction-control/transaction/transaction.module'
      ).then((m) => m.TransactionModule),
  },
  {
    // 费率控制
    path: 'transaction-control/rate',
    loadChildren: () =>
      import('./risk-control/transaction-control/rate/rate.module').then(
        (m) => m.RateModule
      ),
  },
  {
    // 综合监测
    path: 'risk-control/comprehensive-testing',
    loadChildren: () =>
      import('./risk-control/monitor/monitor.module').then(
        (m) => m.MonitorModule
      ),
  },
  /** 采购融资 */
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
  // 采购融资 lazyload
  {
    path: 'main',
    component: XnTabsComponent,
    data: {
      title: '交易列表',
      tabs: [
        {
          label: '地产类业务', // 龙光业务
          link: 'dragon/dragon-list',
          index: 0,
        },
        // {
        //     label: '万科供应商保理业务',  // 普惠通
        //     link: 'avenger-list',
        //     index: 1
        // },

        // {
        //     label: '雅居乐、金地业务',   //地产类业务
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

  // 开票管理
  {
    path: 'invoice-list',
    loadChildren: () =>
      import(
        'libs/products/avenger/src/lib/invoice-management/invoice-management.module'
      ).then((m) => m.AvengerInvoiceManagementModule),
  },
  // 审批放款
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

  // 管理功能
  {
    path: 'manage',
    loadChildren: () =>
      import('./management/management.module').then((m) => m.ManagementModule),
  },
  // 审核任务管理
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
