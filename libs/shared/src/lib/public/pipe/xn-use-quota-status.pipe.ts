import {Pipe, PipeTransform} from '@angular/core';
import XnFlowUtils from '../../common/xn-flow-utils';

@Pipe({name: 'xnUseQuotaStatus'})
export class XnUseQuotaStatusPipe implements PipeTransform {
    transform(type): string {
        return XnFlowUtils.formatIsUseQuotaStatus(type);
    }
}
