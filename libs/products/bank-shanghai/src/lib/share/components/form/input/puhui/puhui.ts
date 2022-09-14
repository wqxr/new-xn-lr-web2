

/*************************************************************************
* Copyright (c) 2017 - 2021 深圳市链融科技股份有限公司
* Shenzhen Lianrong Technology Co., Ltd.
* All rights reserved.
*
* @file：libs\products\bank-shanghai\src\lib\share\components\form\input\puhui\puhui.ts
* @summary：上海银行普惠开户流程组件
* @version: 1.0
* *************************************************************************
* revision             author            reason             date
* 1.0                 hucongying           init          2021-07-13
***************************************************************************/

import { DragonNzFileUploadInputComponent } from "./dragon-nzfile-upload.component";
import { EarningOwnerInputComponent } from "./earningOwner-input.component";
import { EarningOwnerListInputComponent } from "./earningOwner-list-input.component";
import { PuhuiMultipLinkageSelectInputComponent } from "./multip-linkage-select-puhui.component";
import { CodePhoneInputComponent } from "./phone-code-input.component";
import { ShareholderInputComponent } from "./shareholder-input.component";
import { ShareholderListInputComponent } from "./shareholder-list-input.component";
import { DragonVideoFileInputComponent } from "./video-upload-input.component";
import { DragonCascaderSearchInputComponent } from "./dragon-cascader-search-input.component";
import { DragonSelectSearchInputComponent } from "./dragon-select-search-input.component";
import { DragonNzDateInputComponent } from "./dragon-nzdate-picker-input.component";

export const PuhuiInputForms = [
  ShareholderListInputComponent,
  EarningOwnerListInputComponent,
  DragonVideoFileInputComponent,
  PuhuiMultipLinkageSelectInputComponent,
  ShareholderInputComponent,
  EarningOwnerInputComponent,
  CodePhoneInputComponent,
  DragonNzFileUploadInputComponent,
  DragonCascaderSearchInputComponent,
  DragonSelectSearchInputComponent,
  DragonNzDateInputComponent
];
