import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PublicModule } from 'libs/shared/src/lib/public/public.module';
import { ManagementRoutingModule } from './management-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { UserManageComponent } from './user-manage/user-manage.component';
import { RoleManageComponent } from './role-manage/role-manage.component';
import { InvoceSearchRecordComponent } from './zhongdeng-invoice/invoceSearch/invoce-Search-component';
import { InvoceSingleInfoComponent } from './zhongdeng-invoice/invoceSearch/invoce-single-info-component';
import { ManageIntermediaryManagementComponent } from './intermediary-management/intermediary-management-list.componment';
import { OldIntermediaryManagementComponent } from './intermediary-management/old-intermediary-management-list.componment';
import { DragonIntermediaryUserManagementComponent } from './intermediary-management/intermediary-user-management/intermediary-user-management-list.componment';
import { ExportDataComponent } from './export-data/export-data.component';
import { SelectBoxComponent } from './export-data/select-box.component';
import { SelectChartComponent } from './export-data/select-chart.component';
import { PortalManageComponent } from './portal-manage/portal-manage.component';
import { PortalListManageComponent } from './portal-manage/portal-list-manage.component';
import { PowerManageComponent } from './power-manage/power-manage.component';
import { ModeModificationComponent } from './mode-modification/mode-modification.component';
import { WhiteListManageComponent } from './white-list-manage/white-list-manage.component';
import { SystemUpdateComponent } from './system-update/system-update.component';
import { SamplingmanageComponent } from './sampling-manager/samping-manager-list.component';
import { RuleListAddComponent } from './sampling-manager/rule-list/rule-list-add.component';
import { RuleListLookComponent } from './sampling-manager/rule-list/rule-list-look.component';
import { ModuleListAddComponent } from './sampling-manager/module-list/module-list-add.component';
import { ModuleListLookComponent } from './sampling-manager/module-list/module-list-look.component';
import { TransferContractManagerComponent } from './contract-template/contract-template.component';
import { DragonVankeShareModule } from 'libs/shared/src/lib/public/dragon-vanke/share.module';
import { AddCompanyComponent } from './add-company/add-company.component';
import { BankAccountManageComponent } from './bank-account-manage/bank-account-manage.component';
import { BankAccountAddModalComponent } from './bank-account-manage/bank-account-add-modal.component';
import { InvoiceCheckListComponent } from './invoice-check-list/invoice-check-list.component';
import { InvoiceSearchListComponent } from './invoice-check-list/invoice-search-list.component';
import { InvoiceSearchDetailComponent } from './invoice-check-list/invoice-search-detail.component';
import { ZdSearchComponent } from './zhongdeng-invoice/zd-search/zd-search-component';
import { ZhongdengRecordViewComponent } from './zhongdeng-invoice/zd-search/zd-record/zd-record-component';
import { ZdUpdateComponent } from './zhongdeng-invoice/zd-update/zd-update-component';
import { ZdInfoChangeComponent } from './zhongdeng-invoice/zd-change/zd-info-change-component';
import { ZdInfoChangeShowComponent } from './zhongdeng-invoice/zd-change/zd-info-change-component-show';
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { NzTableModule } from 'ng-zorro-antd/table';
import { ZdChangeNewComponent } from './zhongdeng-invoice/zd-change/zd-change-new-component';
import { InvoiceFileViewlComponent } from './zhongdeng-invoice/zd-change/zd-mfile-component';
import { ZdRecordComponent } from './zhongdeng-invoice/zd-change/zd-change-record-component';
import { ZdEditComponent } from './zhongdeng-invoice/zd-change/zd-change-edit-component';
import { ZdOperateComponent } from './zhongdeng-invoice/zd-operate-list/zd-operate-component';
import { ZdRejectComponent } from './zhongdeng-invoice/zd-reject-list/zd-reject-component';
import { ZdViewComponent } from './zhongdeng-invoice/zd-change/zd-change-view-component';
import { ZdChangedemoComponent } from './zhongdeng-invoice/zd-search/zd-change-price-demo/zd-change-price-demo.component';
import { InvoiceSearchComponent } from './invoice-search/invoice-search.component';
import { ReconciliationManageComponent } from './reconciliation-manage/reconciliation-manage.component';
import { NzPopoverModule } from 'ng-zorro-antd/popover';
import { CfcaSignListComponent } from './common-cfca-signlist/common-cfca-signlist.component';
import { EstateSignComponent } from './common-cfca-signlist/sign-estate/sign-estate.component';
import { CfcaSignCustomModalComponent } from './common-cfca-signlist/modal/cfca-sign-custom-modal.component';
import { CfcaSetTextContractModalComponent } from './common-cfca-signlist/modal/cfca-set-text-contract.modal';
import { CfcaCommonSignCodeModalComponent } from './common-cfca-signlist/modal/common-sign-cfca-code-modal.component';
import { DynamicFormModule } from 'libs/shared/src/lib/common/dynamic-form/dynamic-form.module';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { UserManageRelateRightComponent } from './user-manage-relate-right/user-manage-relate-right.component';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzEmptyModule } from 'ng-zorro-antd/empty';
import { ModeEditRelateRightComponent } from './mode-edit-relate-right/mode-edit-relate-right.component';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { FormlyModule, XnFormlyModule } from '@lr/ngx-formly';
import { SharedModule } from 'apps/xn-lr-web/src/app/pages/portal/shared/shared.module';
import { NumberInvoiceInputComponent } from './zhongdeng-invoice/zd-change/serial-invoicenumber-search';
import { XnSharedModule } from '@lr/ngx-shared';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { XnTableModule } from '@lr/ngx-table';
import { XnACLModule } from '@lr/ngx-acl';
import { ScreenshotInvoiceComponent } from './screenshot-invoice/screenshot-invoice-list.component';
import {DetailScreenshotInvoiceComponent} from './screenshot-invoice/detail-screenshot-invoice/detail-screenshot-invoice.component';
import {ZdSearchRecordComponent} from './zhongdeng-invoice/zd-search-record/zd-search-record.component';
import {ZdSearchRecordDetailComponent} from './zhongdeng-invoice/zd-search-record/zd-search-record-detail/zd-search-record-detail.component';
import { StatisticsComponent } from './statistics/statistics.component'
import { NzRadioModule } from 'ng-zorro-antd/radio';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { VankeDocumentFeedbackComponent } from './vanke-document-feedback/vanke-document-feedback.component';
import { NzDescriptionsModule } from 'ng-zorro-antd/descriptions';
import { XnFormlyInvoiceFeedbackModule } from './vanke-document-feedback/components/formly-form/vanke-invoice-table/vanke-invoice-feedback.component.module';
import {InvoiceViewPlatComponent} from './plat-invoice-view/view-invoice.component';
import  {EntryCertifyComponent} from './cettify-file-manage/entry-certify-file/entry-certify-file.component';
import {EstateCertifyComponent} from './cettify-file-manage/estate-certify-file/estate-certify-file.component';
const COMPONENTS = [
  UserManageComponent,
  UserManageRelateRightComponent,
  RoleManageComponent,
  InvoceSearchRecordComponent,
  InvoceSingleInfoComponent,
  ManageIntermediaryManagementComponent,
  OldIntermediaryManagementComponent,
  DragonIntermediaryUserManagementComponent,
  ExportDataComponent,
  SelectBoxComponent,
  SelectChartComponent,
  PortalManageComponent,
  PortalListManageComponent,
  PowerManageComponent,
  ModeModificationComponent,
  ModeEditRelateRightComponent,
  WhiteListManageComponent,
  SystemUpdateComponent,
  SamplingmanageComponent,
  RuleListAddComponent,
  RuleListLookComponent,
  ModuleListAddComponent,
  ModuleListLookComponent,
  TransferContractManagerComponent,
  AddCompanyComponent,
  BankAccountManageComponent,
  BankAccountAddModalComponent,
  InvoiceCheckListComponent,
  InvoiceSearchListComponent,
  InvoiceSearchDetailComponent,
  /** 中登查询组件 */
  ZdSearchComponent,
  ZhongdengRecordViewComponent,
  ZdUpdateComponent,
  ZdInfoChangeComponent,
  ZdInfoChangeShowComponent,
  ZdChangeNewComponent,
  InvoiceFileViewlComponent,
  ZdRecordComponent,
  ZdEditComponent,
  ZdOperateComponent,
  ZdRejectComponent,
  ZdViewComponent,
  NumberInvoiceInputComponent,
  ZdChangedemoComponent,
  InvoiceSearchComponent,

  CfcaSignListComponent,
  EstateSignComponent,
  CfcaSignCustomModalComponent,
  CfcaSetTextContractModalComponent,
  CfcaCommonSignCodeModalComponent,
  /**批量获取发票截图组件 */
  ScreenshotInvoiceComponent,
  DetailScreenshotInvoiceComponent,
  /**中登查询记录组件 */
  ZdSearchRecordComponent,
  ZdSearchRecordDetailComponent,
  /**埋点数据分析组件 */
  StatisticsComponent,
  /** 平台查看发票 */
  InvoiceViewPlatComponent,
  /** 万科问题反馈页面 */
  VankeDocumentFeedbackComponent,
   /** 资质文件录入 */
   EntryCertifyComponent,
   /** 资质文件录入代办 */
   EstateCertifyComponent
];

const NgZorroModules = [
  NzTabsModule,
  NzTableModule,
  NzPopoverModule,
  NzSelectModule,
  NzButtonModule,
  NzCheckboxModule,
  NzGridModule,
  NzEmptyModule,
  NzFormModule,
  NzInputModule,
  NzDividerModule,
  NzRadioModule,
  NzDatePickerModule,
  NzTagModule,
  NzIconModule,
  NzDescriptionsModule,
  NzRadioModule,
  NzDatePickerModule,
  NzTagModule,
  NzIconModule,
];

@NgModule({
  imports: [
    CommonModule,
    PublicModule,
    DragonVankeShareModule,
    ManagementRoutingModule,
    ReactiveFormsModule,
    DynamicFormModule,
    FormsModule,
    FormlyModule,
    SharedModule,
    XnSharedModule,
    XnTableModule,
    XnACLModule,
    ...NgZorroModules,
    XnFormlyInvoiceFeedbackModule,
    HttpClientModule,
    XnFormlyModule.forRoot(),
    FormlyModule.forChild({
      types: [
        {
          name: 'serial-invoice-search',
          component: NumberInvoiceInputComponent,
          wrappers: ['form-field-horizontal'],
        },
      ],
    }),
  ],
  declarations: [
    ...COMPONENTS,
    ReconciliationManageComponent,
  ],
  exports: [
    ...COMPONENTS,
  ]
})
export class ManagementModule { }
