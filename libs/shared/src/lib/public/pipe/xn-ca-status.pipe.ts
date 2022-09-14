import {Pipe, PipeTransform} from '@angular/core';
import XnLogicUtils from '../../common/xn-logic-utils';

@Pipe({name: 'xnCaStatus'})
export class XnCaStatusPipe implements PipeTransform {
    transform(status, step): string {
        return XnLogicUtils.formatCaStatus(status, step);
    }
}
