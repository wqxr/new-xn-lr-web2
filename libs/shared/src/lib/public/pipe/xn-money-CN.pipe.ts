import {Pipe, PipeTransform} from '@angular/core';
import {XnUtils} from '../../common/xn-utils';

/**
 *  数字金额转中文汉字
 */
@Pipe({name: 'xnMoneyCn'})
export class XnMoneyCNPipe implements PipeTransform {
    transform(value: any): any {
        return XnUtils.convertCurrency(value)[1];
    }
}
