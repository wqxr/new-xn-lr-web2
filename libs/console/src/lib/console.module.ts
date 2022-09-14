import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { IconDefinition } from '@ant-design/icons-angular';
import * as AllIcons from '@ant-design/icons-angular/icons';
import { XnFormlyModule } from '@lr/ngx-formly';
import { XnSharedModule } from '@lr/ngx-shared';
import { XnTableModule } from '@lr/ngx-table';
import { FactoringBusinessModule } from 'libs/products/avenger/src/lib/factoring-business/factoring-business.module';
import { AvengerSharedModule } from 'libs/products/avenger/src/lib/shared/shared.module';
import { TransSupplementInfoComponent } from 'libs/products/gemdale/src/lib/pages/gemdale-mode/trans-supplement-info-component';
import { NewAgileShareModule } from 'libs/products/new-agile/src/lib/share/share.module';
import { PublicModule } from 'libs/shared/src/lib/public/public.module';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { BankManagementModule } from './bank-management/bank-management.module';
import { DiscountManageComponent } from './bank/discount-manage/discount-manage.component';
import { FinancingManageComponent } from './bank/financing-manage/financing-manage.component';
import { BillReceiveListComponent } from './bill/bill-receive-list.component';
import { BillTradeListComponent } from './bill/bill-trade-list.component';
import { BlocksComponent } from './blockchain/blocks.component';
import { DetailComponent as BlockchainDetailComponent } from './blockchain/detail.component';
import { HomeComponent as BlockchainHomeComponent } from './blockchain/home.component';
import { CapitalPoolIndexComponent } from './capital-pool/capital-pool-index.component';
import { CfcaCompanyListComponent } from './cfca/cfca-company-list.component';
import { EstateCfcaComponent } from './cfca/cfca-estate/cfca-estate.component';
import { CfcaOperateListComponent } from './cfca/cfca-operate-list/cfca-operate-list.component';
import { ConsoleRoutingModule } from './console-routing.module';
import { DataModule } from './data/data.module';
import { RegisterCompanyComponent } from './data/register-company.component';
import { ReportFormDetailComponent } from './data/report-form-detail.component';
import { DepositMessageComponent } from './deposit/deposit-message.component';
import { FlowDetailChartComponent } from './flow/flow-detail-chart.component';
import { FlowDetailDataComponent } from './flow/flow-detail-data.component';
import { FlowDetailLogsComponent } from './flow/flow-detail-logs.component';
import { FlowDetailRecordComponent } from './flow/flow-detail-record.component';
import { FlowDetailComponent } from './flow/flow-detail.component';
import { MainFlowComponent } from './flow/main-flow.component';
import { HomeComponent as ConsoleHomeComponent } from './home.component';
import { ManageModule } from './manage/manage.module';
import { ManagementModule } from './management/management.module';
import { MyCustomerModule } from './my-customer/my-customer.module';
import { MyDataModule } from './my-datatable/mydata.module';
import { CaStatusComponent } from './my-datatable/pages/ca-status.component';
import { InfoComponent } from './my-information/info.component';
import { NgZorroAntDModule } from './ng-zorro-antd.module';
import { RegisterCompanyDetailComponent } from './pages/register-company/register-company-detail/register-company-detail.component';
import { RegisterCompanyListComponent } from './pages/register-company/register-company-list.component';
import { BankFormService } from './record/bank/bank.form.service';
import { BankEditComponent } from './record/bank/edit.component';
import { BankNewComponent } from './record/bank/new.component';
import { BankRecordComponent } from './record/bank/record.component.component';
import { Contract3MessageComponent } from './record/contract3-message.component';
import { Contract3Component } from './record/contract3.component';
import { Contract4Component } from './record/contract4.component';
import { Contract5Component } from './record/contract5.component';
import { EditComponent } from './record/edit.component';
import { MemoComponent } from './record/memo.component';
import { NewComponent } from './record/new.component';
import { RecordComponent } from './record/record.component';
import { RegisterCodeInfoViewComponent } from './record/register-code-info-view.component';
import { RegisterCodeInfoComponent } from './record/register-code-info.component';
import { TradeComponent } from './record/trade.component';
import { TransferAccountsViewComponent } from './record/transfer-accounts-view.component';
import { TransferAccountsComponent } from './record/transfer-accounts.component';
import { TransferInfoViewComponent } from './record/transfer-info-view.component';
import { TransferInfoComponent } from './record/transfer-info.component';
import { ViewComponent } from './record/view.component';
import { View2Component } from './record/view2.component';
import { EnsureComponent } from './risk-control/progress/ensure.component';
import { FinancingDetailComponent } from './risk-control/progress/financing-detail.component';
import { RiskControlService } from './risk-control/risk-control.service';
import { InvoiceShowListComponent } from './risk-control/risk-warning/invoice-show-list.component';
import { AmountControlCommService } from './risk-control/transaction-control/amount/amount-control-comm.service';
import { ServiceFeePromisePayComponent } from './service-fee-promise-pay/service-fee-promise-pay.component';
import { ServiceFeeComponent } from './service-fee/service-fee.component';
import { InterestComponent } from './tools/interest.component';
import { RiskComponent } from './tools/risk.component';
import { ZhongdengTaggingComponent } from './tools/zhongdeng-tagging/zhongdeng-tagging.component';
import { AccountingLoadComponent } from './vnake-mode/contract-template/accounting-load.component';
import { ContractTemplateIndexComponent } from './vnake-mode/contract-template/contract-template-index.component';
import { RegisterCompanyRelateRightComponent } from './pages/register-company-relate-right/register-company-relate-right.component';
import { SearchFormModule } from '@lr/ngx-shared';
import { CheckTaskManagementListComponent } from './pages/check-task-management/check-task-list.component';
import { DragonVankeShareModule } from 'libs/shared/src/lib/public/dragon-vanke/share.module';


const antDesignIcons = AllIcons as {
  [key: string]: IconDefinition;
};
const ICONS = Object.keys(antDesignIcons).map((key) => antDesignIcons[key]);

const COMPONENTS = [
    FinancingManageComponent,
    DiscountManageComponent,
    CaStatusComponent,

    ConsoleHomeComponent,
    RecordComponent,
    NewComponent,
    EditComponent,
    BankEditComponent,
    ViewComponent,
    View2Component,
    MemoComponent,
    Contract3Component,
    Contract4Component,
    Contract5Component,
    Contract3MessageComponent,
    BlockchainHomeComponent,
    BlockchainDetailComponent,
    MainFlowComponent,
    BlocksComponent,
    EnsureComponent,
    DepositMessageComponent,
    BillTradeListComponent,
    BillReceiveListComponent,
    InfoComponent,
    TradeComponent,
    FlowDetailComponent,
    FlowDetailRecordComponent,
    FlowDetailChartComponent,
    FlowDetailLogsComponent,
    FlowDetailDataComponent,
    // FlowDetailDataShowComponent,
    ReportFormDetailComponent,
    RegisterCompanyComponent,
    InterestComponent,
    RiskComponent,
    InvoiceShowListComponent, // 发票列表展示
    // 融资详情
    FinancingDetailComponent,
    CapitalPoolIndexComponent, // 资金池
    CfcaCompanyListComponent,  // cfca企业列表
    EstateCfcaComponent,   // cfca代办列表
    CfcaOperateListComponent,
    ServiceFeeComponent, // 平台服务费管理
    ServiceFeePromisePayComponent, // 保证付款服务管理

    TransferInfoComponent, // 出让信息
    TransferAccountsComponent, // 应收账款转让
    RegisterCodeInfoComponent, // 录入编码信息
    RegisterCodeInfoViewComponent,
    TransferAccountsViewComponent,
    TransferInfoViewComponent,
    BankRecordComponent,
    BankNewComponent,
    ContractTemplateIndexComponent, // vanke 合同管理
    // ReceiptListComponent, // 金地优化-项目公司批量签署回执,
    AccountingLoadComponent,
    // 保理商补充标准保理交易保理到期日
    TransSupplementInfoComponent,
    /** 注册公司列表 */
    RegisterCompanyListComponent,
    /** 注册公司详情 */
    RegisterCompanyDetailComponent,
    /** 新版注册公司页面 */
    RegisterCompanyRelateRightComponent,
    /** 审核任务管理页面 */
    CheckTaskManagementListComponent,

];

@NgModule({
    imports: [
        CommonModule,
        PublicModule,
        ManagementModule,
        ConsoleRoutingModule,
        FactoringBusinessModule,
        ManageModule,
        BankManagementModule,
        DataModule,
        MyCustomerModule,
        AvengerSharedModule,
        NewAgileShareModule,
        MyDataModule,
        NgZorroAntDModule,
        NzIconModule.forChild(ICONS),
        XnFormlyModule.forRoot(),
        XnTableModule,
        XnSharedModule,
        SearchFormModule,
        DragonVankeShareModule
    ],
    declarations: [...COMPONENTS, ZhongdengTaggingComponent],
    providers: [BankFormService, AmountControlCommService, RiskControlService]
})
export class ConsoleModule { }
