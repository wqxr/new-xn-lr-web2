/*************************************************************************
* Copyright (c) 2017 - 2021 深圳市链融科技股份有限公司
* Shenzhen Lianrong Technology Co., Ltd.
* All rights reserved.
*
* @file：libs\shared\src\lib\config\options\rule-engine.option.ts
* @summary：规则引擎审核结果模块用到的枚举
* @version: 1.0
* *************************************************************************
* revision             author            reason             date
* 1.0                 hucongying          init           2021-09-08
***************************************************************************/

import { SelectItemsModel } from "../checkers";
import { RuleValidTypeEnum } from "../enum";

/** 规则校验类型状态 */
export const VaildTypeOptions: SelectItemsModel[] = [
  { label: '硬控', value: RuleValidTypeEnum.HARD_CONTROL },
  { label: '非硬控', value: RuleValidTypeEnum.NON_HARD_CONTROL },
  { label: '强提醒', value: RuleValidTypeEnum.STRONG_REMINDER },
]
