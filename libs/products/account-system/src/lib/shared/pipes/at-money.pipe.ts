/*************************************************************************
* Copyright (c) 2017 - 2021 深圳市链融科技股份有限公司
* Shenzhen Lianrong Technology Co., Ltd.
* All rights reserved.
*
* @file：libs\products\account-system\src\lib\shared\pipes\at-money.pipe.ts
* @summary：金额格式化
* @version: 1.0
* *************************************************************************
* revision             author            reason             date
* 1.0                HuCongying           init           2021-11-26
***************************************************************************/
import { Pipe, PipeTransform } from '@angular/core';
import { MinUtils } from '../utils';

@Pipe({ name: 'atMoney' })
export class AtMoneyPipe implements PipeTransform {
  transform(money: any, float?: boolean | string): any {
    if ([null, undefined, ''].includes(money)) {
      return "--"
    }
    if (float && (float === true || float === 'float')) {
      return MinUtils.formatMoneyFloat(money);
    }
    return MinUtils.formatMoney(money);
  }
}
