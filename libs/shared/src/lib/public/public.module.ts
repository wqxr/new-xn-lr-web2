import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { QuestionOutline } from '@ant-design/icons-angular/icons';

import { FlowDetailDataShowComponent } from 'libs/console/src/lib/flow/flow-detail-data-show.component';
import { ReceiptListVkComponent } from 'libs/console/src/lib/manage/receipt-list-vk.component';
import { SupplierUnsignedContractComponent } from 'libs/console/src/lib/manage/supplier-unsigned-contract.component';
import { ContractComponent } from 'libs/console/src/lib/record/contract.component';
import { HouseHoldStaffModel } from 'libs/console/src/lib/risk-control/progress/progress-in-houseHold-pop-staff.component';
import { BankCreditModalComponent } from 'libs/console/src/lib/risk-control/survey/bank-credit-modal.component';
import { InfoDetailModalComponent } from 'libs/console/src/lib/risk-control/survey/info-detail-modal.component';
import { OpponentModalComponent } from 'libs/console/src/lib/risk-control/survey/opponent-modal.component';
import { EnterpriseContractModalComponent } from 'libs/console/src/lib/risk-control/transaction-control/contract/enterprise-contract-modal.component';
import { EnterpriseTransactionControlModalComponent } from 'libs/console/src/lib/risk-control/transaction-control/transaction/enterprise-transaction-control-modal.component';
import { VankeYjlSupplierSignComponent } from 'libs/console/src/lib/vnake-mode/vanke-yjl-supplier-sign.component';
import { YajvleSignContractComponent } from 'libs/console/src/lib/vnake-mode/yajvle-sign-contract.component';
import { AgencyTypeTransform } from 'libs/products/dragon/src/lib/pipe/agencyType.pipe';
import { RoleTypeTransform } from 'libs/products/dragon/src/lib/pipe/roleType.pipe';
import { VankeModelId } from 'libs/products/dragon/src/lib/pipe/vanke-modeld.pipe';
import { DragonCfcaCustomModalComponent } from 'libs/shared/src/lib/public/dragon-vanke/modal/cfca-custom/dragon-cfca-custom-modal.component';
import { NzAutocompleteModule } from 'ng-zorro-antd/auto-complete';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzUploadModule } from 'ng-zorro-antd/upload';
import { Ng2Bs3ModalModule } from '../common/modal/ng2-bs3-modal';
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzRadioModule } from 'ng-zorro-antd/radio';
import { NzSpaceModule } from 'ng-zorro-antd/space';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzInputNumberModule } from 'ng-zorro-antd/input-number';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzPaginationModule } from 'ng-zorro-antd/pagination';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
// 定向保理支付
import { AccountReceiptListComponent } from './component/account-receipt-list.component';
import { BankCardAddComponent } from './component/bank-card-add.component';
import { BankCardEditComponent } from './component/bank-card-edit.component';
// 资产池
import { CapitalPoolCommListComponent } from './component/capital-pool-comm-list.component';
import { CapitalPoolUnhandledListComponent } from './component/capital-pool-unhandled-list.component';
import { CommAddComponent } from './component/comm-add.component';
import { CommDetailComponent } from './component/comm-detail.component';
import { CommEditComponent } from './component/comm-edit.component';
import { CommListComponent } from './component/comm-list.component';
import { DateInputDayComponent } from './component/date-input.component';
import { DatePickerComponent } from './component/date-picker/date-picker.component';
import { EditInfoModalComponent } from './component/edit-info-modal.component';
import { EditTableComponent } from './component/edit-table.component';
import { HomeCommListComponent } from './component/home-comm-list.component';
import { InstitutionalReviewListComponent } from './component/institutional-review-list.component';
import { InvoiceDisplayDetailComponent } from './component/invoice-display-detail.component';
import { DragonPageComponent } from './component/newpage.component';
import { PageComponent } from './component/page.component';
import { PaginationModule } from './component/pagination/pagination.module';
import { SearchListComponent } from './component/search-list.component';
import { XnTabsComponent } from './component/tabs/tabs.component';
import { TreeviewModule } from './component/treeview/treeview.module';
import { FileClassificationComponent } from './component/fileClassification/file-classification.component';
import { QrcodeComponent } from './custom/qrcode.component';
import { DaterangepickerModule } from './directive/date-range-picker/date-range-picker.module';
import { InputMaskDirective } from './directive/input-mask';
import { MoneyMaskDirective } from './directive/money-mask';
import { TooltipModule } from './directive/tooltip/tooltip.module';
import { FlowProcess0Component } from './flow/flow-process-0.component';
import { FlowProcess1Component } from './flow/flow-process-1.component';
import { FlowProcess11Component } from './flow/flow-process-11.component';
import { FlowProcess12Component } from './flow/flow-process-12.component';
import { FlowProcess13Component } from './flow/flow-process-13.component';
import { FlowProcess14Component } from './flow/flow-process-14.component';
import { FlowProcess3Component } from './flow/flow-process-3.component';
import { FlowProcess5Component } from './flow/flow-process-5.component';
import { FlowProcess6Component } from './flow/flow-process-6.component';
import { FlowProcess7Component } from './flow/flow-process-7.component';
import { FlowProcessUploadBaseComponent } from './flow/flow-process-upload-base.component';
import { FlowProcessComponent } from './flow/flow-process.component';
import { AssignorInfoComponent } from './form/assignor-info.component';
import { CustomerWhiteStatusModalComponent } from './form/avenger/customer-whiteStatus.modal.component';
import { GuarantEarningFormComponent } from './form/avenger/guarant-earningForm-table.component';
import { GuarantReportComponent } from './form/avenger/guarant-report.component';
import { CheckFormInputComponent } from './form/avenger/xn-check-form-input.component';
import { InputTableComponent } from './form/avenger/xn-input-tabel.component'; // 客户管理表单引入
import { BankListComponent } from './form/bank-list.component';
import { BankSelectInputComponent } from './form/bank/bank-select-input.component';
import { CalculateServiceFeeComponent } from './form/bank/calculate-service-fee.component';
import { BankContractInputComponent } from './form/bank/contract-input.component';
import { BankContractNewModalComponent } from './form/bank/contract-new-modal.component';
import { BankContractViewModalComponent } from './form/bank/contract-view-modal.component';
import { FileConsistencyComponent } from './form/bank/file-consistency.component';
import { FileLogicalComponent } from './form/bank/file-logical.component';
import { BankHonourInputComponent } from './form/bank/honour-input.component';
import { BankHonourNewModalComponent } from './form/bank/honour-new-modal.component';
import { BankHonourViewModalComponent } from './form/bank/honour-view-modal.component';
import { BankInvoiceInputComponent } from './form/bank/invoice-input.component';
import { BankInvoiceNewModalComponent } from './form/bank/invoice-new-modal.component';
import { BankInvoiceViewModalComponent } from './form/bank/invoice-view-modal.component';
import { BackFileComponent } from './form/bank/mfile-input-back-file.component';
import { ScanFileComponent } from './form/bank/scan-file.component';
import { SignContractsModalComponent } from './form/bank/sign-contracts-modal.component';
import { SignContractsComponent } from './form/bank/sign-contracts.component';
import { BillInputComponent } from './form/bill-input.component';
import { CardInputComponent } from './form/card-input.component';
import { CheckboxInputComponent } from './form/checkbox-input.component';
import { ConditionsInputComponent } from './form/conditions-input.component';
import { ContractInputComponent } from './form/contract-input.component';
import { ContractVankeInputComponent } from './form/contract-vanke-input.component';
import { ContractVankeInput1Component } from './form/contract-vanke-input1.component';
import { ContractVankeOfficeInputComponent } from './form/contract-vanke-office-input.component';
import { DataContentComponent } from './form/data-content.component';
import { DataContent1Component } from './form/data-content1.component';
import { DataContent3Component } from './form/data-content3.component';
import { DateInputControlNullComponent } from './form/date-input-control-null.component';
import { DateInputNullComponent } from './form/date-input-null.component';
import { DateInputWindComponent } from './form/date-input-wind.component';
import { DateInputComponent } from './form/date-input.component';
import { Date1InputComponent } from './form/date1-input.component';
import { Date2InputComponent } from './form/date2-input.component';
import { Date3InputComponent } from './form/date3-input.component';
import { Date4InputComponent } from './form/date4-input.component';
import { DatetimeInputComponent } from './form/datetime-input.component';
import { DcheckboxInputComponent } from './form/dcheckbox-input.component';
import { DselectInputWindComponent } from './form/dselect-input-wind.component';
import { DselectInputComponent } from './form/dselect-input.component';
import { EndInputComponent } from './form/end-input.component';
import { EnterSelectInputComponent } from './form/enter-select-input.component';
import { FactoringListComponent } from './form/factoring-list.component';
import { FeeBankDiscountComponent } from './form/fee-bank-discount.component';
import { FeeBankFinancingComponent } from './form/fee-bank-financing.component';
import { FeePromisePayComponent } from './form/fee-promise-pay.component';
import { FeeComponent } from './form/fee.component';
import { FileInputComponent } from './form/file-input.component';
import { AssetsTableInputComponent } from './form/financial-report-info/assets-table-input-component';
import { CashTableInputComponent } from './form/financial-report-info/cash-table-input.component';
import { ProfitTableInputComponent } from './form/financial-report-info/profit-table-input.component';
import { UploadTableInputComponent } from './form/financial-report-info/upload-table-input.component';
import { FixedfileInputComponent } from './form/fixedfile-input.component';
import { Fixedfile1InputComponent } from './form/fixedfile1-input.component';
import { GroupInputComponent } from './form/group-input.component';
import { Group5InputComponent } from './form/group5-input.component';
import { HeadquartersSelectInputComponent } from './form/headquarters-select-input.component';
import { HonourInputComponent } from './form/honour-input.component';
import { AccountsReceivableComponent } from './form/hw-mode/accounts-receivable.component';
import { AccountsReceivable1Component } from './form/hw-mode/accounts-receivable1.component';
import { BankCardSingleInputComponent } from './form/hw-mode/bank-card-single-input.component';
import { BankCardSingleInput1Component } from './form/hw-mode/bank-card-single-input1.component';
import { ContractHwInputComponent } from './form/hw-mode/contract-hw-input.component';
import { EditSelectInputComponent } from './form/hw-mode/edit-select-input.component';
import { FileEditInput1Component } from './form/hw-mode/file-edit-input1.component';
import { FileEditInput2Component } from './form/hw-mode/file-edit-input2.component';
import { HwExcelInputComponent } from './form/hw-mode/hw-excel-input.component';
import { InfoChangeComponent } from './form/hw-mode/info-change.component';
import { InvoiceReplaceRecordComponent } from './form/hw-mode/invoice-replace-record.component';
import { InvoiceReplaceComponent } from './form/hw-mode/invoice-replace.component';
import { AuditCriteriaModalComponent } from './form/hw-mode/modal/audit-criteria-modal.component';
import { ContractHwNewModalComponent } from './form/hw-mode/modal/contract-hw-new-modal.component';
import { FileEditInput1ModalComponent } from './form/hw-mode/modal/file-edit-input1-modal.component';
import { InvoiceReplaceViewModalComponent } from './form/hw-mode/modal/invoice-replace-view-modal.component';
import { InvoiceSearchCompanyModalComponent } from './form/hw-mode/modal/invoice-search-company-modal.component';
import { NewFileModalComponent } from './form/hw-mode/modal/new-file-modal.component';
import { PayBackInputModalComponent } from './form/hw-mode/modal/pay-back-input-modal.component';
import { SupplementFileModalComponent } from './form/hw-mode/modal/supplement-file.modal.component';
import { MultipleSelectInputComponent } from './form/hw-mode/multiple-select-input.component';
import { Select1InputComponent } from './form/hw-mode/select1-input.component';
import { InputSwitchComponent } from './form/input-switch.component';
import { InvoiceInputComponent } from './form/invoice-input.component';
import { InvoiceReplaceInputComponent } from './form/invoice-replace-input.component';
import { InvoiceVankeInputComponent } from './form/invoice-vanke-input.component';
import { InvoiceVankePreInputComponent } from './form/invoice-vanke-pre-input.component';
import { LabelDselectInputComponent } from './form/label-dselect-component';
import { LinkageSelectInputComponent } from './form/linkage-select-input.component';
import { MfileInputComponent } from './form/mfile-input.component';
import { MfileViewInputComponent } from './form/mfile-view-input.component';
import { MflowInputComponent } from './form/mflow-input.component';
import { MoneyControlInputComponent } from './form/money-control-input.component';
import { MoneyInputComponent } from './form/money-input.component';
import { MselectInputComponent } from './form/mselect-input.component';
import { MultistageSelectInputComponent } from './form/multistage-select-input.component';
import { MultistageSelectInput1Component } from './form/multistage-select-input1.component';
import { NzDemoUploadDragComponent } from './form/new-file-input.component';
import { NumberInputComponent } from './form/number-input.component';
import { OrderInputComponent } from './form/order-input.component';
import { Order5InputComponent } from './form/order5-input.component';
import { OrgRightInputModalComponent } from './form/org-right-input-modal.component';
import { OrgRightInputComponent } from './form/org-right-input.component';
import { OrgRightShowComponent } from './form/org-right-show.component';
import { PasswordInputComponent } from './form/password-input.component';
import { PerformanceInputComponent } from './form/performance-input.component';
import { PickerInputComponent } from './form/picker-input.component';
import { PlatformRateViewComponent } from './form/platform-rate-view.component';
import { QuantumInputComponent } from './form/quantum-input.component';
import { Quantum1InputComponent } from './form/quantum1-input.component';
import { RadioBillingTypeInputComponent } from './form/radio-billingType-input.component';
import { RadioInputComponent } from './form/radio-input.component';
import { SelectInputWindComponent } from './form/select-input-wind.component';
import { SelectInputComponent } from './form/select-input.component';
import { NzDemoSelectSearchComponent } from './form/select-search-info.component';
import { NzDemoSelectSearchMoreComponent } from './form/select-search-info1.component';
import { SearchSelectInputComponent } from './form/select-search.component';
import { ShowInputComponent } from './form/show-input.component';
import { SmsInputComponent } from './form/sms-input.component';
import { StorageRackSelectInputComponent } from './form/storage-rack-select-input.component';
import { SupervisorInputComponent } from './form/supervisor-input.component';
import { TextIconInputComponent } from './form/text-icon-input.component';
import { TextInputWindComponent } from './form/text-input-wind.component';
import { TextInputComponent } from './form/text-input.component';
import { TextareaInputComponent } from './form/textarea-input.component';
import { THeadFixedComponent } from './form/thead-fixed.component';
import { ToArrayInputComponent } from './form/toArray-input.component';
import { TselectInputComponent } from './form/tselect-input.component';
import { AvengerInterestComponent } from './form/vanke/avenger-interest.component';
import { CompanyDetailUploadComponent } from './form/vanke/company-detail-upload.component';
import { DownFileTableInputComponent } from './form/vanke/down-file-table-input.component';
import { InvoiceTransferInputComponent } from './form/vanke/invoice-transfer-input';
import { ManagerInformationInputComponent } from './form/vanke/manager-information-input.component';
import { CommonMfileInputComponent } from './form/vanke/mfile-changeinput.component';
import { CommonFileDownUploadComponent } from './form/vanke/mfile-down-upload.component';
import { MultiplePickerInputComponent } from './form/vanke/multiple-picker-input.component';
import { MultiplePickerModalComponent } from './form/vanke/multiple-picker-modal.component';
import { LabelInfoComponent } from './form/vanke/show-label.component';
import { UploadFileTableInputComponent } from './form/vanke/upload-file-table-input.component';
import { UploadPaymentInputComponent } from './form/vanke/upload-payment-input.component';
import { VankeTypeSelectInputComponent } from './form/vanke/vanke-input-chose.component';
import { VkSelectInputComponent } from './form/vk-select-input.component';
import { VkSelect1InputComponent } from './form/vk-select1-input.component';
import { VkSelect2InputComponent } from './form/vk-select2-input.component';
import { WselectInputComponent } from './form/wselect-input.component';
import { XnInputWindComponent } from './form/xn-input-wind.component';
import { XnInputComponent } from './form/xn-input.component';
import { XnInput1Component } from './form/xn-input1.component';
import { XnQuantumShowComponent } from './form/quantum-show.component';
import { AdminMoveModalComponent } from './modal/admin-move-modal.component';
import { ApprovalAddModalComponent } from './modal/approval-add-modal.component';
import { ApprovalDeleteModalComponent } from './modal/approval-delete-modal.component';
import { ApprovalEditModalComponent } from './modal/approval-edit-modal.component';
import { ApprovalReadModalComponent } from './modal/approval-read-modal.component';
import { ArticleAddModalComponent } from './modal/article-add-modal.component';
import { ArticleDeleteModalComponent } from './modal/article-delete-modal.component';
import { ArticleEditModalComponent } from './modal/article-edit-modal.component';
import { AssetAddModalComponent } from './modal/asset-add-modal.component';
import { VankeAuditStandardModalComponent } from './modal/audit-standard-modal.component';
import { BankAddModalComponent } from './modal/bank-add-modal.component';
import { BankCardAddModalComponent } from './modal/bank-card-add-modal.component';
import { BankDeleteModalComponent } from './modal/bank-delete-modal.component';
import { BillEditModalComponent } from './modal/bill-edit-modal.component';
import { BillViewModalComponent } from './modal/bill-view-modal.component';
import { BuildXmlModalComponent } from './modal/build-xml-modal.component';
import { BulkUploadModalComponent } from './modal/bulk-upload-modal.component';
import { BusinessDetailComponent } from './modal/businessLicense-view-modal.component';
import { CancellationCompanyModalComponent } from './modal/cancellation-company-cfca-modal.component';
import { CapitalPoolAlertRatioModalComponent } from './modal/capital-pool-alert-ratio-modal.component';
import { CapitalPoolIntermediaryAgencyModalComponent } from './modal/capital-pool-intermediary-agency-modal.component';
import { CapitalPoolNameModalComponent } from './modal/capital-pool-name-modal.component';
import { CertInfoChangeModelComponent } from './modal/certInfo-change-model.component';
import { CfcaCertFileUploadModalComponent } from './modal/cfca-certFileupload-modal.component';
import { CfcaCodeModalComponent } from './modal/cfca-code-modal.component';
import { NzDemoModalBasicComponent } from './modal/cfca-result-modal.component';
import { CfcaValidModalComponent } from './modal/cfca-valid-modal.component';
import { ChangeCfcaCompanyComponent } from './modal/change-companydetail-cfca.component';
import { ContractEditModalComponent } from './modal/contract-edit-modal.component';
import { ContractEdit1ModalComponent } from './modal/contract-edit1-modal.component';
import { ContractFilesViewModalComponent } from './modal/contract-files-view-modal.component';
import { ContractNewModalComponent } from './modal/contract-new-modal.component';
import { ContractVankeEditModalComponent } from './modal/contract-vanke-edit-modal.component';
import { VankeViewContractModalComponent } from './modal/contract-vanke-mfile-detail.modal';
import { ContractVankeNewModalComponent } from './modal/contract-vanke-new-modal.component';
import { ContractVankeSupplementModalComponent } from './modal/contract-vanke-supplement-modal.component';
import { ContractViewModalComponent } from './modal/contract-view-modal.component';
import { ContractView1ModalComponent } from './modal/contract-view1-modal.component';
import { DataViewModalComponent } from './modal/data-view-modal.component';
import { DescEditModalComponent } from './modal/desc-edit-modal.component';
import { DownloadAttachmentsmodalComponent } from './modal/download-attachmentsmodal.component';
import { ExportListModalComponent } from './modal/export-list-modal.component';
import { ExportListModal01Component } from './modal/export-list-modal01.component';
import { FileViewModalComponent } from './modal/file-view-modal.component';
import { FinancingFactoringModalComponent } from './modal/financing-factoring-modal.component';
import { FinancingFactoringVankeModalComponent } from './modal/financing-factoring-vanke-modal.component';
import { GeneratingContractModalComponent } from './modal/generating-contract-modal.component';
import { GeneratingContractStampModalComponent } from './modal/generating-contract-stamp-modal.component';
import { GroupEditModalComponent } from './modal/group-edit-modal.component';
import { GroupNewModalComponent } from './modal/group-new-modal.component';
import { GroupViewModalComponent } from './modal/group-view-modal.component';
import { Group5EditModalComponent } from './modal/group5-edit-modal.component';
import { Group5ViewModalComponent } from './modal/group5-view-modal.component';
import { HonourDetailModalComponent } from './modal/honour-detail-modal.component';
import { HonourEditModalComponent } from './modal/honour-edit-modal.component';
import { HonourNewModalComponent } from './modal/honour-new-modal.component';
import { HonourViewModalComponent } from './modal/honour-view-modal.component';
import { HtmlModalComponent } from './modal/html-modal.component';
import { InvoiceDataViewModalComponent } from './modal/invoice-data-view-modal.component';
import { InvoiceDirectionViewModalComponent } from './modal/invoice-direction-view-modal.component';
import { InvoiceEditModalComponent } from './modal/invoice-edit-modal.component';
import { InvoiceFactoryEditModalComponent } from './modal/invoice-factory-edit-modal.component';
import { InvoiceVankeEditModalComponent } from './modal/invoice-vanke-edit-modal.component';
import { InvoiceViewModalComponent } from './modal/invoice-view-modal.component';
import { InvoicesAddModalComponent } from './modal/invoices-add-modal.component';
import { InvoicesDeleteModalComponent } from './modal/invoices-delete-modal.component';
import { InvoicesEditModalComponent } from './modal/invoices-edit-modal.component';
import { LoadwordEditModalComponent } from './modal/loadword-edit-modal.component';
import { LogDetailModalComponent } from './modal/log-detail-modal.component';
import { LoginModalComponent } from './modal/login-modal.component';
import { CfcaLoginPreReadComponent } from './modal/login-pre-read-modal.component';
import { LoginSelectModalComponent } from './modal/login-select-modal.component';
import { MapAddModalComponent } from './modal/map-add-modal.component';
import { AppFileInfoModalComponent } from './modal/mfile-info-modal.component';
import { MfilesViewModalComponent } from './modal/mfiles-view-modal.component';
import { OrgRightModalComponent } from './modal/org-right-modal.component';
import { PdfSignModalComponent } from './modal/pdf-sign-modal.component';
import { PlanAddModalComponent } from './modal/plan-add-modal.component';
import { PlanDeleteModalComponent } from './modal/plan-delete-modal.component';
import { PlanEditModalComponent } from './modal/plan-edit-modal.component';
import { PowerEditModalComponent } from './modal/power-edit-modal.component';
import { QrcodeViewModalComponent } from './modal/qrcode-view-modal.component';
import { RatesDateStartModalComponent } from './modal/rates-date-start-modal.component';
import { RatesPreModalComponent } from './modal/rates-pre-modal.component';
import { RegisterDetailComponent } from './modal/register-detail.component';
import { RegisterSubmitListModalComponent } from './modal/register-submit-list-modal.component';
import { RepaymentInputModalComponent } from './modal/repayment-input-modal.component';
import { ReportExcelModalComponent } from './modal/report-excel-modal.component';
import { ShowPhotoModalComponent } from './modal/show-photo-modal.component';
import { ShowViewModalComponent } from './modal/show-view-modal.component';
import { SupervisorEditModalComponent } from './modal/supervisor-edit-modal.component';
import { SupervisorViewModalComponent } from './modal/supervisor-view-modal.component';
import { UserAddModalComponent } from './modal/user-add-modal.component';
import { UserDeleteModalComponent } from './modal/user-delete-modal.component';
import { UserEditModalComponent } from './modal/user-edit-modal.component';
import { ViewPdfModalComponent } from './modal/view-pdf.modal.component';
import { WhiteListAddModalComponent } from './modal/white-list-add-modal.component';
import { WhiteListDeleteModalComponent } from './modal/white-list-delete-modal.component';
import { WselectEditModalComponent } from './modal/wselect-edit-modal.component';
import { ReconciliationDetailModalComponent } from './modal/reconciliation-detail-modal';
import { XnFormlyModule } from '@lr/ngx-formly';
import { XnSharedModule } from '@lr/ngx-shared';
import { XnTableModule } from '@lr/ngx-table';
import { XnFormlyUserOrgRolesModule } from './form/user-org-roles/user-org-roles.module';
import { UserManageFormModalComponent } from './modal/user-manage-form-modal/user-manage-form-modal.component';
import { XnFormlyModeEditProductModule } from './form/mode-edit-product/mode-edit-product.module';
import { NewFileClassifyModalComponent } from './modal/new-fileClassify-modal/new-fileclassify-modal.component';
import { UserDeleteRelateRightModalComponent } from './modal/user-delete-relate-right-modal';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NgxViewerModule } from 'ngx-viewer';
import { PipeModule } from './pipe/pipe.module';
/**
 *  组件
 */
const CONST_COMPONENTS = [
  DatePickerComponent,
  InvoiceDisplayDetailComponent,
  CapitalPoolCommListComponent,
  QrcodeComponent,
  AccountReceiptListComponent,
  InvoiceReplaceComponent,
  InvoiceReplaceRecordComponent,
  HomeCommListComponent,
  CapitalPoolUnhandledListComponent,
  CheckFormInputComponent,
  GuarantReportComponent,
  GuarantEarningFormComponent,
  InputTableComponent,
  XnInputComponent,
  XnInput1Component,
  TextInputComponent,
  TextIconInputComponent,
  EndInputComponent,
  MoneyInputComponent,
  CardInputComponent,
  RadioInputComponent,
  RadioBillingTypeInputComponent,
  CheckboxInputComponent,
  SelectInputComponent,
  MselectInputComponent,
  FileInputComponent,
  CommonFileDownUploadComponent,
  LabelInfoComponent,
  NzDemoUploadDragComponent,
  NzDemoModalBasicComponent,
  HonourInputComponent,
  BankHonourInputComponent,
  InvoiceInputComponent,
  BankInvoiceInputComponent,
  OrderInputComponent,
  Order5InputComponent,
  MfileInputComponent,
  MfileViewInputComponent,
  PickerInputComponent,
  WselectInputComponent,
  TextareaInputComponent,
  ToArrayInputComponent,
  ShowInputComponent,
  SmsInputComponent,
  DselectInputComponent,
  LabelDselectInputComponent,
  TselectInputComponent,
  VkSelectInputComponent,
  VkSelect1InputComponent,
  VkSelect2InputComponent,
  NzDemoSelectSearchComponent,
  NzDemoSelectSearchMoreComponent,
  DcheckboxInputComponent,
  ConditionsInputComponent,
  PasswordInputComponent,
  DateInputComponent,
  Date2InputComponent,
  Date1InputComponent,
  Date3InputComponent,
  Date4InputComponent,
  DatetimeInputComponent,
  VankeModelId,
  RoleTypeTransform, // 平台角色id管道
  AgencyTypeTransform, // 中介机构类型多类型展示管道
  PlatformRateViewComponent,
  PageComponent,
  DragonPageComponent,
  ContractInputComponent,
  BankContractInputComponent,
  GroupInputComponent,
  Group5InputComponent,
  FixedfileInputComponent,
  Fixedfile1InputComponent,
  SupervisorInputComponent,
  NumberInputComponent,
  BillInputComponent,
  AssignorInfoComponent,
  FlowProcessComponent,
  FlowProcess0Component,
  FlowProcess1Component,
  FlowProcess3Component,
  FlowProcess6Component,
  FlowProcess7Component,
  CommListComponent,
  CommAddComponent,
  CommDetailComponent,
  CommEditComponent,
  QuantumInputComponent,
  Quantum1InputComponent,
  InputSwitchComponent,
  EnterSelectInputComponent,
  DataContentComponent,
  DataContent3Component,
  ContractVankeInputComponent,
  ContractVankeOfficeInputComponent,
  InvoiceVankePreInputComponent,
  DateInputDayComponent,
  InputMaskDirective,
  MoneyMaskDirective,
  FeeComponent,
  FeePromisePayComponent,
  FeeBankDiscountComponent,
  FeeBankFinancingComponent,
  BankListComponent,
  FactoringListComponent,
  FileConsistencyComponent,
  FileLogicalComponent,
  SignContractsComponent,
  ScanFileComponent,
  BackFileComponent,
  BankSelectInputComponent,
  HwExcelInputComponent,
  EditSelectInputComponent,
  BankCardSingleInputComponent,
  THeadFixedComponent,
  FlowProcess5Component,
  FlowProcess11Component,
  FileEditInput1Component,
  FlowProcess12Component,
  FlowProcess13Component,
  FlowProcess14Component,
  FlowProcessUploadBaseComponent,
  InfoChangeComponent,
  Select1InputComponent,
  DataContent1Component,
  AccountsReceivableComponent, // 应收账款证明
  AccountsReceivable1Component,
  BankCardSingleInput1Component,

  InstitutionalReviewListComponent,
  FileEditInput2Component,
  MultiplePickerInputComponent,
  DownFileTableInputComponent,
  UploadFileTableInputComponent,
  UploadPaymentInputComponent,
  ContractHwInputComponent,
  ManagerInformationInputComponent,
  CompanyDetailUploadComponent,
  InvoiceReplaceInputComponent,
  CommonMfileInputComponent,
  SearchListComponent,
  XnInputWindComponent,
  DateInputWindComponent,
  TextInputWindComponent,
  SelectInputWindComponent,
  DselectInputWindComponent,
  MultistageSelectInputComponent,
  MultistageSelectInput1Component,
  MflowInputComponent,
  LinkageSelectInputComponent,
  StorageRackSelectInputComponent,
  DateInputNullComponent,
  PerformanceInputComponent,
  MoneyControlInputComponent,
  DateInputControlNullComponent,
  MultipleSelectInputComponent,
  VankeYjlSupplierSignComponent, // todo 雅居乐 供应商补充协议 [暂时存在]
  YajvleSignContractComponent,
  ContractComponent,
  UploadTableInputComponent,
  AssetsTableInputComponent,
  CashTableInputComponent,
  ProfitTableInputComponent,
  InvoiceTransferInputComponent,

  OrgRightInputComponent,
  OrgRightInputModalComponent,
  OrgRightShowComponent,
  XnTabsComponent,
  SearchSelectInputComponent,
];
/**
 *  module
 */
const EXPORT_MODULES = [
  CommonModule,
  RouterModule, // 要引入RouterModule，才能让本Module的组件有routerLink功能
  FormsModule,
  ReactiveFormsModule,
  Ng2Bs3ModalModule,
  PaginationModule,
  DaterangepickerModule,
  TooltipModule,
  TreeviewModule,
  PipeModule,
  XnFormlyUserOrgRolesModule,
  XnFormlyModeEditProductModule,
];

/**
 * 动态组建-模态框
 */
const ENTRY_COMPONENTS = [
  OrgRightModalComponent,
  AppFileInfoModalComponent, // 信息查看框
  EditTableComponent,
  InvoiceReplaceViewModalComponent,
  InvoiceEditModalComponent,
  InvoiceDataViewModalComponent,
  HtmlModalComponent,
  HonourEditModalComponent,
  InvoiceViewModalComponent,
  HonourViewModalComponent,
  FileViewModalComponent,
  DataViewModalComponent,
  FlowDetailDataShowComponent,
  ShowViewModalComponent,
  ShowPhotoModalComponent,
  FinancingFactoringModalComponent,
  UserEditModalComponent,
  WselectEditModalComponent,
  PowerEditModalComponent,
  QrcodeViewModalComponent,
  HonourDetailModalComponent,
  RegisterDetailComponent,
  InvoiceFactoryEditModalComponent,
  UserAddModalComponent,
  WhiteListAddModalComponent,
  AssetAddModalComponent,
  MapAddModalComponent,
  WhiteListDeleteModalComponent,
  ArticleAddModalComponent,
  ArticleEditModalComponent,
  ArticleDeleteModalComponent,
  UserDeleteModalComponent,
  AdminMoveModalComponent,
  BankAddModalComponent,
  InvoicesAddModalComponent,
  BankInvoiceNewModalComponent,
  ReportExcelModalComponent,
  PlanAddModalComponent,
  ApprovalAddModalComponent,
  ApprovalEditModalComponent,
  ApprovalReadModalComponent,
  ApprovalDeleteModalComponent,
  PlanDeleteModalComponent,
  PlanEditModalComponent,
  InvoicesEditModalComponent,
  LoadwordEditModalComponent,
  LogDetailModalComponent,
  BankDeleteModalComponent,
  InvoicesDeleteModalComponent,
  HonourNewModalComponent,
  BankHonourNewModalComponent,
  LoginModalComponent,
  ContractNewModalComponent,
  BankContractNewModalComponent,
  GroupNewModalComponent,
  ContractViewModalComponent,
  BillViewModalComponent,
  ContractEditModalComponent,
  SupervisorEditModalComponent,
  GroupEditModalComponent,
  Group5EditModalComponent,
  GroupViewModalComponent,
  Group5ViewModalComponent,
  SupervisorViewModalComponent,
  BillEditModalComponent,
  PdfSignModalComponent,
  LoginSelectModalComponent,
  RegisterSubmitListModalComponent,
  RepaymentInputModalComponent,
  BuildXmlModalComponent,
  ContractVankeNewModalComponent,
  VankeAuditStandardModalComponent,
  InvoiceVankeInputComponent,
  ContractVankeEditModalComponent,
  FinancingFactoringVankeModalComponent,
  ContractFilesViewModalComponent,
  InvoiceVankeEditModalComponent,
  RatesDateStartModalComponent,
  RatesPreModalComponent,
  EditInfoModalComponent,
  BankHonourViewModalComponent,
  BankContractViewModalComponent,
  BankInvoiceViewModalComponent,
  SignContractsModalComponent,
  CalculateServiceFeeComponent,
  BankCardAddModalComponent,
  BankCardAddComponent,
  BankCardEditComponent,
  DescEditModalComponent,
  DownloadAttachmentsmodalComponent,
  FileEditInput1ModalComponent,
  NewFileModalComponent,
  SupplementFileModalComponent,
  PayBackInputModalComponent,
  ContractEdit1ModalComponent,
  ContractView1ModalComponent,
  AuditCriteriaModalComponent, // 两票一同，保理商初审-审核标准
  CapitalPoolNameModalComponent,
  CapitalPoolAlertRatioModalComponent,
  CapitalPoolIntermediaryAgencyModalComponent,
  MultiplePickerModalComponent,
  ContractHwNewModalComponent,
  HeadquartersSelectInputComponent,
  ContractVankeInput1Component,
  GeneratingContractModalComponent,
  GeneratingContractStampModalComponent,
  ExportListModalComponent,
  ExportListModal01Component,
  BulkUploadModalComponent,
  SupplierUnsignedContractComponent,
  ContractVankeSupplementModalComponent,
  MfilesViewModalComponent,
  InvoiceDirectionViewModalComponent,
  InvoiceSearchCompanyModalComponent,
  CustomerWhiteStatusModalComponent,
  InvoiceTransferInputComponent,
  AvengerInterestComponent,
  BusinessDetailComponent,
  VankeViewContractModalComponent,
  CfcaCodeModalComponent,
  CfcaLoginPreReadComponent,
  CfcaCertFileUploadModalComponent,
  ChangeCfcaCompanyComponent,
  CertInfoChangeModelComponent,
  CancellationCompanyModalComponent,
  ViewPdfModalComponent,
  CfcaValidModalComponent,
  ReconciliationDetailModalComponent,
  DragonCfcaCustomModalComponent,
  UserManageFormModalComponent,
  NewFileClassifyModalComponent,
  UserDeleteRelateRightModalComponent,
];

/**
 * 保理风控-模态框
 */
const EXPORT_RISK_ENTRY_COMPONENT_MODAL = [
  OpponentModalComponent,
  BankCreditModalComponent,
  InfoDetailModalComponent,
  HouseHoldStaffModel,
  EnterpriseContractModalComponent,
  EnterpriseTransactionControlModalComponent,
];

// @ts-ignore
@NgModule({
  imports: [
    ...EXPORT_MODULES,
    NzUploadModule,
    NzIconModule.forChild([QuestionOutline]),
    NzRadioModule,
    NzFormModule,
    NzTabsModule,
    NzSpaceModule,
    NzModalModule,
    NzSelectModule,
    NzAutocompleteModule,
    NzCheckboxModule,
    NzTableModule,
    NzButtonModule,
    NzInputModule,
    XnFormlyModule.forRoot(),
    XnSharedModule,
    XnTableModule,
    NzDropDownModule,
    NzFormModule,
    NzInputNumberModule,
    NzDatePickerModule,
    NzPaginationModule,
    NzToolTipModule,
    NzSpinModule,
    NgxViewerModule
  ],
  declarations: [
    ...CONST_COMPONENTS,
    ...ENTRY_COMPONENTS,
    ...EXPORT_RISK_ENTRY_COMPONENT_MODAL,
    VankeTypeSelectInputComponent,
    XnInputComponent,
    XnInput1Component,
    TextInputComponent,
    TextIconInputComponent,
    EndInputComponent,
    MoneyInputComponent,
    CardInputComponent,
    RadioInputComponent,
    RadioBillingTypeInputComponent,
    CheckboxInputComponent,
    SelectInputComponent,
    MselectInputComponent,
    FileInputComponent,
    CommonFileDownUploadComponent,
    LabelInfoComponent,
    HonourInputComponent,
    BankHonourInputComponent,
    BankHonourViewModalComponent,
    InvoiceInputComponent,
    BankInvoiceInputComponent,
    BankContractViewModalComponent,
    OrderInputComponent,
    Order5InputComponent,
    MfileInputComponent,
    MfileViewInputComponent,
    PickerInputComponent,
    WselectInputComponent,
    TextareaInputComponent,
    ToArrayInputComponent,
    ShowInputComponent,
    SmsInputComponent,
    DselectInputComponent,
    LabelDselectInputComponent,
    TselectInputComponent,
    VkSelectInputComponent,
    VkSelect1InputComponent,
    VkSelect2InputComponent,
    DcheckboxInputComponent,
    ConditionsInputComponent,
    PasswordInputComponent,
    DateInputComponent,
    Date2InputComponent,
    Date1InputComponent,
    Date3InputComponent,
    Date4InputComponent,
    DatetimeInputComponent,
    VankeModelId,
    InvoiceEditModalComponent,
    InvoiceDataViewModalComponent,
    HtmlModalComponent,
    HonourEditModalComponent,
    InvoiceViewModalComponent,
    HonourViewModalComponent,
    FileViewModalComponent,
    DataViewModalComponent,
    FlowDetailDataShowComponent,
    ShowViewModalComponent,
    ShowPhotoModalComponent,
    PlatformRateViewComponent,
    FinancingFactoringModalComponent,
    PageComponent,
    DragonPageComponent,
    UserEditModalComponent,
    WselectEditModalComponent,
    PowerEditModalComponent,
    HonourDetailModalComponent,
    RegisterDetailComponent,
    InvoiceFactoryEditModalComponent,
    UserAddModalComponent,
    WhiteListAddModalComponent,
    AssetAddModalComponent,
    MapAddModalComponent,
    WhiteListDeleteModalComponent,
    ArticleAddModalComponent,
    ArticleEditModalComponent,
    ArticleDeleteModalComponent,
    UserDeleteModalComponent,
    AdminMoveModalComponent,
    BankAddModalComponent,
    InvoicesAddModalComponent,
    ReportExcelModalComponent,
    PlanAddModalComponent,
    ApprovalAddModalComponent,
    ApprovalEditModalComponent,
    ApprovalReadModalComponent,
    ApprovalDeleteModalComponent,
    PlanDeleteModalComponent,
    PlanEditModalComponent,
    InvoicesEditModalComponent,
    BankInvoiceNewModalComponent,
    LoadwordEditModalComponent,
    LogDetailModalComponent,
    BankDeleteModalComponent,
    InvoicesDeleteModalComponent,
    HonourNewModalComponent,
    BankHonourNewModalComponent,
    LoginModalComponent,
    ContractNewModalComponent,
    BankContractNewModalComponent,
    GroupNewModalComponent,
    ContractViewModalComponent,
    BillViewModalComponent,
    ContractEditModalComponent,
    SupervisorEditModalComponent,
    GroupEditModalComponent,
    Group5EditModalComponent,
    GroupViewModalComponent,
    Group5ViewModalComponent,
    SupervisorViewModalComponent,
    BillEditModalComponent,
    ContractInputComponent,
    BankContractInputComponent,
    GroupInputComponent,
    Group5InputComponent,
    FixedfileInputComponent,
    Fixedfile1InputComponent,
    SupervisorInputComponent,
    NumberInputComponent,
    BillInputComponent,
    AssignorInfoComponent,
    PdfSignModalComponent,
    LoginSelectModalComponent,
    RegisterSubmitListModalComponent,
    FlowProcessComponent,
    FlowProcess0Component,
    FlowProcess1Component,
    FlowProcess3Component,
    FlowProcess6Component,

    FlowProcess7Component,
    InvoiceReplaceViewModalComponent,
    InvoiceSearchCompanyModalComponent,
    RepaymentInputModalComponent,
    BuildXmlModalComponent,
    CommListComponent,
    CommAddComponent,
    CommDetailComponent,
    CommEditComponent,
    QuantumInputComponent,
    Quantum1InputComponent,
    InputSwitchComponent,
    // 可编辑下拉选项框
    EnterSelectInputComponent,
    DataContentComponent,
    DataContent3Component,
    ContractVankeInputComponent,
    ContractVankeInput1Component,
    ContractVankeNewModalComponent,
    VankeAuditStandardModalComponent,
    InvoiceVankeInputComponent,
    InvoiceTransferInputComponent,
    ContractVankeEditModalComponent,
    ContractVankeOfficeInputComponent,
    FinancingFactoringVankeModalComponent,
    InvoiceVankePreInputComponent,
    ContractFilesViewModalComponent,
    InvoiceVankeEditModalComponent,
    VankeViewContractModalComponent,
    QrcodeViewModalComponent,
    RatesDateStartModalComponent,
    RatesPreModalComponent,
    DateInputDayComponent,
    InputMaskDirective,
    MoneyMaskDirective,
    FeeComponent,
    FeePromisePayComponent,
    FeeBankDiscountComponent,
    FeeBankFinancingComponent,
    BankListComponent,
    FactoringListComponent,
    BankInvoiceViewModalComponent,
    FileConsistencyComponent,
    FileLogicalComponent,
    SignContractsComponent,
    SignContractsModalComponent,
    ScanFileComponent,
    BackFileComponent,
    BankSelectInputComponent,
    HwExcelInputComponent,
    EditSelectInputComponent,
    CalculateServiceFeeComponent,
    BankCardSingleInputComponent,
    THeadFixedComponent,
    BankCardAddModalComponent, // 添加银行卡信息-资产池
    DownloadAttachmentsmodalComponent,
    FlowProcess5Component,
    FlowProcess11Component,
    FileEditInput1Component,
    FileEditInput1ModalComponent,
    FlowProcess12Component,
    FlowProcess13Component,
    FlowProcess14Component,
    FlowProcessUploadBaseComponent,
    InfoChangeComponent,
    Select1InputComponent,
    DataContent1Component,
    AccountsReceivableComponent, // 应收账款证明
    NewFileModalComponent,
    SupplementFileModalComponent,
    PayBackInputModalComponent,
    AccountsReceivable1Component,
    BankCardSingleInput1Component,

    InstitutionalReviewListComponent,
    FileEditInput2Component,
    ContractEdit1ModalComponent,
    ContractView1ModalComponent,
    AuditCriteriaModalComponent,
    CapitalPoolNameModalComponent,
    CapitalPoolAlertRatioModalComponent,
    CapitalPoolIntermediaryAgencyModalComponent,
    MultiplePickerInputComponent,
    MultiplePickerModalComponent,
    DownFileTableInputComponent,
    UploadFileTableInputComponent,
    EditInfoModalComponent,
    UploadPaymentInputComponent,
    ContractHwInputComponent,
    ContractHwNewModalComponent,
    ManagerInformationInputComponent,
    InvoiceReplaceInputComponent,
    HeadquartersSelectInputComponent,
    BulkUploadModalComponent,
    SearchListComponent,
    BankCreditModalComponent,
    InfoDetailModalComponent,
    OpponentModalComponent,
    XnInputWindComponent,
    DateInputWindComponent,
    TextInputWindComponent,
    SelectInputWindComponent,
    DselectInputWindComponent,
    EnterpriseContractModalComponent,
    EnterpriseTransactionControlModalComponent,
    HouseHoldStaffModel,
    MultistageSelectInputComponent,
    MultistageSelectInput1Component,
    MflowInputComponent,
    GeneratingContractModalComponent,
    GeneratingContractStampModalComponent,
    ExportListModalComponent,
    ReceiptListVkComponent,
    LinkageSelectInputComponent,
    SupplierUnsignedContractComponent,
    StorageRackSelectInputComponent,
    DateInputNullComponent,
    PerformanceInputComponent,
    ContractVankeSupplementModalComponent,
    MfilesViewModalComponent,
    MoneyControlInputComponent,
    DateInputControlNullComponent,
    MultipleSelectInputComponent,
    InvoiceDirectionViewModalComponent,
    VankeYjlSupplierSignComponent, // todo 雅居乐 供应商补充协议 [暂时存在]
    YajvleSignContractComponent,
    ContractComponent,
    XnQuantumShowComponent,
    FileClassificationComponent,
  ],
  // 要动态创建的组件在这里声明
  entryComponents: [...EXPORT_RISK_ENTRY_COMPONENT_MODAL, ...ENTRY_COMPONENTS],
  exports: [
    ...EXPORT_MODULES,
    ...CONST_COMPONENTS,
    ...ENTRY_COMPONENTS,
    ...EXPORT_RISK_ENTRY_COMPONENT_MODAL,
    PaginationModule,
    XnInputComponent,
    XnInput1Component,
    ShowInputComponent,
    VankeModelId,
    PageComponent,
    DragonPageComponent,
    FlowProcessComponent,
    FlowProcess0Component,
    FlowProcess1Component,
    FlowProcess3Component,
    FlowProcess6Component,
    FlowProcess7Component,
    CommListComponent,
    CommAddComponent,
    CommDetailComponent,
    CommEditComponent,
    InputSwitchComponent,
    EnterSelectInputComponent,
    DataContentComponent,
    DataContent3Component,
    ContractVankeInputComponent,
    ContractVankeInput1Component,
    ContractVankeNewModalComponent,
    VankeAuditStandardModalComponent,
    InvoiceVankeInputComponent,
    InvoiceTransferInputComponent,
    ContractVankeEditModalComponent,
    ContractVankeOfficeInputComponent,
    FinancingFactoringVankeModalComponent,
    InvoiceVankePreInputComponent,
    ContractFilesViewModalComponent,
    InvoiceVankeEditModalComponent,
    RatesDateStartModalComponent,
    RatesPreModalComponent,
    DateInputDayComponent,
    InputMaskDirective,
    MoneyMaskDirective,
    InvoiceReplaceViewModalComponent,
    FeeComponent,
    FeePromisePayComponent,
    FeeBankDiscountComponent,
    FeeBankFinancingComponent,
    BankListComponent,
    FactoringListComponent,
    FileConsistencyComponent,
    FileLogicalComponent,
    BackFileComponent,
    BankSelectInputComponent,
    HwExcelInputComponent,
    EditSelectInputComponent,
    CalculateServiceFeeComponent,
    BankCardSingleInputComponent,
    THeadFixedComponent,
    BankCardAddModalComponent,
    DownloadAttachmentsmodalComponent,
    NewFileModalComponent,
    SupplementFileModalComponent,
    InstitutionalReviewListComponent,
    FileEditInput2Component,
    MultiplePickerInputComponent,
    MultiplePickerModalComponent,
    EditInfoModalComponent,
    UploadPaymentInputComponent,
    VankeTypeSelectInputComponent,
    InvoiceDataViewModalComponent,
    SearchListComponent,
    BankCreditModalComponent,
    InfoDetailModalComponent,
    OpponentModalComponent,
    XnInputWindComponent,
    DateInputWindComponent,
    TextInputWindComponent,
    SelectInputWindComponent,
    DselectInputWindComponent,
    EnterpriseContractModalComponent,
    EnterpriseTransactionControlModalComponent,
    HouseHoldStaffModel,
    MultistageSelectInputComponent,
    MultistageSelectInput1Component,
    MflowInputComponent,
    GeneratingContractModalComponent,
    GeneratingContractStampModalComponent,
    ExportListModalComponent,
    BulkUploadModalComponent,
    ReceiptListVkComponent,
    LinkageSelectInputComponent,
    SupplierUnsignedContractComponent,
    DateInputNullComponent,
    PerformanceInputComponent,
    MoneyControlInputComponent,
    DateInputControlNullComponent,
    MultipleSelectInputComponent,
    InvoiceDirectionViewModalComponent,
    VankeYjlSupplierSignComponent,
    YajvleSignContractComponent,
    ContractComponent,
  ],
})
export class PublicModule {}
