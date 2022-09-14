import { Pipe, PipeTransform } from '@angular/core';
import { XnUtils } from '../../common/xn-utils';

@Pipe({ name: 'xnDate' })
export class XnDatePipe implements PipeTransform {
    transform(timestamp: any, type?: string): string {
        if (!timestamp) { return ''; }
        if (type === 'date') {
            return XnUtils.formatDate(timestamp);
        } else if (type === 'datetime') {
            return XnUtils.formatDatetime(timestamp);
        } else if (type === 'longdatetime') {
            return XnUtils.formatLongDatetime(timestamp);
        } else if (type === 'zh-cn') {
            return XnUtils.formatDateZh(timestamp);
        } else if (type === 'stringtodate') {
            const date = XnUtils.toDate(timestamp);
            return XnUtils.formatDate(Date.parse(date));
        } else {
            return XnUtils.formatShortDatetime(timestamp);
        }
    }
}
