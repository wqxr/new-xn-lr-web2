import { Pipe, PipeTransform } from '@angular/core';
import XnFlowUtils from '../../common/xn-flow-utils';

@Pipe({ name: 'xnTransfer' })
export class XntransFer implements PipeTransform {
    transform(key, type): string {
        return XnFlowUtils.formatRecordEveryStatus(type, key);
    }
}
