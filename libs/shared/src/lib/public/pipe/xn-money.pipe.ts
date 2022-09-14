import { Pipe, PipeTransform } from '@angular/core';
import { XnUtils } from '../../common/xn-utils';

@Pipe({ name: 'xnMoney' })
export class XnMoneyPipe implements PipeTransform {
    transform(money: any, float?: boolean | string): any {
        if (float && (float === true || float === 'float')) {
            return XnUtils.formatMoneyFloat(money);
        }
        return XnUtils.formatMoney(money);
    }
}
