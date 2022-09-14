import {Pipe, PipeTransform} from '@angular/core';
import XnFlowUtils from '../../common/xn-flow-utils';

@Pipe({name: 'xnProxyStatus'})
export class XnProxyStatusPipe implements PipeTransform {
    transform(type): string {
        return XnFlowUtils.formatProxyStatus(type);
    }
}
