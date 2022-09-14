import {Pipe, PipeTransform} from '@angular/core';
import XnLogicUtils from '../../common/xn-logic-utils';

@Pipe({name: 'xnCaStep'})
export class XnCaStepPipe implements PipeTransform {
    transform(step): string {
        return XnLogicUtils.formatCaStep(step);
    }
}
