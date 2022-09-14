import { Pipe, PipeTransform } from '@angular/core';
import { XNCurrency } from '../../common/xncurrency';

@Pipe({name: 'xnCurrencyValue'})
/**
 * 对没有千分的数字，变成带有千分位的数字字符串
 */
export class XnCurrencyValue implements PipeTransform {
  transform(paramValue: number | string | XNCurrency): string {
      const s = new XNCurrency(paramValue);
      return s.format();
  }
}
