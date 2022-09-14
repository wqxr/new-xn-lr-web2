/*************************************************************************
 * Copyright (c) 2017 - 2021 深圳市链融科技股份有限公司
 * Shenzhen Lianrong Technology Co., Ltd.
 * All rights reserved.
 *
 * @file：libs\products\abs-gj\src\lib\check-config\change-program.config.ts
 * @summary：change-program.config.ts
 * @version: 1.0
 * *************************************************************************
 * revision             author            reason             date
 * 1.0                  DengPei           init               2021-12-03
 ***************************************************************************/

import {
  IChangeProgram
} from '../../../../machine-account/src/lib/share/components/form/show/chang-program.component';

export const ChangeItemConfig: IChangeProgram[] = [
  {label: '应收账款金额', value: 'isReceive', checked: false},
];
