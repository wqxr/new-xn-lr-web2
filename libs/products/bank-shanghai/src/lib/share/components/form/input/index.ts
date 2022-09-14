/*
 * @Description:
 * @Version: 1.0
 * @Author: yutianbao./ant-files-input.component
 * @Date: 2020-11-14 18:06:10
 * @LastEditors: yutianbao
 * @LastEditTime: 2020-12-09 11:59:02
 * @FilePath: \xn-lr-web2\libs\products\bank-shanghai\src\lib\share\components\form\input\index.ts
 * @copyright: Copyright(C) 2017-2020, 深圳市链融科技股份有限公司
 */

import { AntFilesInputComponent } from './ant-files-input.component';
import { AnTSingleListComponent } from './ant-single-list.component';
import { AntTextInputComponent } from './ant-text-input.component';
import { ChargeBackComponent } from './charge-back-list.component';
import { CommonSingleListComponent } from './common-single-list.component';
import { ShangHaiContractComponent } from './contract.component';
import { ShDateInputComponent } from './date-input.component';
import { ExcelUploadComponent } from './excel-upload.component';
import { NumberInputComponent } from './input-number.component';
import { LinkageRadioComponent } from './linkage-radio.component';
import { PlatlvyueComponent } from './lvyue-performance.component';
import { PlanTableInputComponent } from './plan-table-input.component';
import { PlatTradeContractComponent } from './plat-trade-contract.component';
import { ReadonlyTextInputComponent } from './readonly-text-input.component';
import { ShangHaiSmsInputComponent } from './sms-input.component';
import { StatusDisplayInputComponent } from './status-display-input.component';
import { TwoInputComponent } from './two-input.component';
import { PuhuiInputForms } from './puhui/puhui';
import { WithdrawCalcComponent } from './withdraw-calc.component';

export const InputForms = [
    AnTSingleListComponent,
    AntTextInputComponent,
    AntFilesInputComponent,
    ShangHaiSmsInputComponent,
    ShangHaiContractComponent,
    ReadonlyTextInputComponent,
    LinkageRadioComponent,
    CommonSingleListComponent,
    StatusDisplayInputComponent,
    ExcelUploadComponent,
    ChargeBackComponent,
    NumberInputComponent,
    ShDateInputComponent,
    PlanTableInputComponent,
    PlatTradeContractComponent,
    PlatlvyueComponent,
    TwoInputComponent,
    WithdrawCalcComponent,
    ...PuhuiInputForms
];
