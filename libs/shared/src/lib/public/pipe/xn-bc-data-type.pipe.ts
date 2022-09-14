import {Pipe, PipeTransform} from '@angular/core';
import XnLogicUtils from '../../common/xn-logic-utils';

@Pipe({name: 'xnBcDataType'})
export class XnBcDataTypePipe implements PipeTransform {
    transform(type): string {
        return XnLogicUtils.formatBcDataType(type);
    }
}
