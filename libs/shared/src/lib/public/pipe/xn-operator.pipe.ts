import {Pipe, PipeTransform} from '@angular/core';
import XnFlowUtils from '../../common/xn-flow-utils';

@Pipe({name: 'xnOperator'})
export class XnOperatorPipe implements PipeTransform {
    transform(operator: number, procedureId: string): string {
        return XnFlowUtils.formatOperator(operator, procedureId);
    }
}
