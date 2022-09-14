import { TextInputComponent } from './text-input.component';
import { CommonMfileInputComponent } from './mfile-input.component';
import { QuantumInputComponent } from './quantum-input.component';
import { DateInputComponent } from './date-input.component';
import { SelectInputComponent } from './select-input.component';
import { CheckboxInputComponent } from './checkbox-input.component';
import { RadioInputComponent } from './radio-input.component';
import { MoneyInputComponent } from './money-input.component';
import { DragonTextIdInputComponent } from './text-id.component';
import { DragonFileInputComponent } from './file-input.component';
import { TradeTypeComponent } from './transaction-status.componet';
import { Quantum1InputComponent } from './quantum1-input.component';
import { NumberRangeComponent } from './number-range-input.component';
import { TextareaFilesComponent } from './textarea-files.component';
import { PreInvoiceComponent } from './machine-pre-invoice.component';
import { VankeTextRateComponent } from './text-rate-input.component';
import { LoanDateComponent } from './loan-date.component';
import { DragonTableComponent } from './table-input.component';
import { VankePickerInputComponent } from './picker-input.component';
import { VankeInputSelectComponent } from './vanke-text-select-input.component';
import { Date4InputComponent } from './date4-input.component';
import { TextNumberInputComponent } from './number-input.component';
import { NumerControlInputComponent } from './number-range-control.component';
import { ChoseCompanyNotifyComponent } from './chose-cpmpany-notify.component';
import { TextareaInputComponent } from './textarea-input.component';
import { TextareaLimitInputComponent } from './textarea-limit-input.component';
import { Quantum2InputComponent } from './quantum2-input.component';
import { MultipLinkageSelectInputComponent } from './multip-linkage-select.component';
import { RateInputComponent } from './rate-input.component';
import { SelectInputTimeComponent } from './select-input-time.component';
import { CommonFlowTableComponent } from './common-plat-contract.component';
import { MultipleTwoLinkageSelectInputComponent } from './two-select-multiple.component';
import { TableInputChangeComponent } from './table-input-change.component';
import {CommonTableShareComponent} from './common-table.component';
import {DragonTextInputSearchComponent} from './input-search.component';
export const InputForms = [
    TextInputComponent,
    TextareaInputComponent,
    TextareaFilesComponent,
    CommonMfileInputComponent,
    QuantumInputComponent,
    DateInputComponent,
    SelectInputComponent,
    CheckboxInputComponent,
    RadioInputComponent,
    MoneyInputComponent,
    DragonTextIdInputComponent,
    DragonFileInputComponent,
    TradeTypeComponent,
    Quantum1InputComponent,
    NumberRangeComponent,
    TextNumberInputComponent,
    PreInvoiceComponent,
    VankeTextRateComponent,
    LoanDateComponent,
    DragonTableComponent,
    VankePickerInputComponent,
    VankeInputSelectComponent,
    Date4InputComponent,
    NumerControlInputComponent,
    ChoseCompanyNotifyComponent,
    TextareaLimitInputComponent,
    Quantum2InputComponent,
    MultipLinkageSelectInputComponent,
    RateInputComponent,
    SelectInputTimeComponent,
    /**流程中配置公共表格项的组件 */
    CommonFlowTableComponent,
    /**两级联动select框，后者框可以多选 */
    MultipleTwoLinkageSelectInputComponent,
    TableInputChangeComponent,
    CommonTableShareComponent,
    /** 文本框搜索调用接口 */
    DragonTextInputSearchComponent
];
