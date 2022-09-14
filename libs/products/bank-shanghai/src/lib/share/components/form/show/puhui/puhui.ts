/*************************************************************************
* Copyright (c) 2017 - 2021 深圳市链融科技股份有限公司
* Shenzhen Lianrong Technology Co., Ltd.
* All rights reserved.
*
* @file：libs\products\bank-shanghai\src\lib\share\components\form\input\puhui\puhui.ts
* @summary：上海银行普惠开户流程show组件
* @version: 1.0
* *************************************************************************
* revision             author            reason             date
* 1.0                 hucongying           init          2021-07-14
***************************************************************************/

import { DragonNzFileUploadShowComponent } from "./dargon-nzfile-upload-show.component";
import { EarningOwnerListShowComponent } from "./earningOwner-list-show.component";
import { EarningOwnerShowComponent } from "./earningOwner-show.component";
import { PujuiMultipLinkageSelectShowComponent } from "./multip-linkage-select-puhui.component";
import { ShareholderListShowComponent } from "./shareholder-list-show.component";
import { ShareholderShowComponent } from "./shareholder-show.component";
import { DragonVideoFileShowComponent } from "./video-upload-show.component";
import { DragonCascaderSearchShowComponent } from "./dragon-cascader-search-show.component";
import { DragonSelectSearchShowComponent } from "./dragon-select-search-show.component";
import { CodePhoneShowComponent } from "./phone-code-show.component";
import { DragonNzDateShowComponent } from "./dragon-nzdate-picker-show.component";



export const PuhuiShowForms = [
  PujuiMultipLinkageSelectShowComponent,
  DragonVideoFileShowComponent,
  ShareholderShowComponent,
  ShareholderListShowComponent,
  EarningOwnerShowComponent,
  EarningOwnerListShowComponent,
  DragonNzFileUploadShowComponent,
  DragonCascaderSearchShowComponent,
  DragonSelectSearchShowComponent,
  CodePhoneShowComponent,
  DragonNzDateShowComponent
];
