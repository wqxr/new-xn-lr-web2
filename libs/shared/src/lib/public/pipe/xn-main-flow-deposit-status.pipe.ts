import {Pipe, PipeTransform} from '@angular/core';
import XnFlowUtils from '../../common/xn-flow-utils';

@Pipe({name: 'xnDepositMainFlowStatus'})
export class XnDepositMainFlowStatusPipe implements PipeTransform {
    transform(type): string {
        return XnFlowUtils.formatMainFlowStatus(type);
    }
}
