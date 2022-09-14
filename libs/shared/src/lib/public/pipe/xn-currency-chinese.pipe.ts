import { Pipe, PipeTransform } from '@angular/core';
import { XNCurrency } from '../../common/xncurrency';

@Pipe({name: 'xnCurrencyChinese'})
/**
 * 将货币，转为中文大写
 */
export class XnCurrencyChinese implements PipeTransform {
  transform(paramValue: number | string | XNCurrency): string {
      const s = new XNCurrency(paramValue);
      return s.Chinese({prefix: ''});
  }
}
