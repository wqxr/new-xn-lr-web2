import { Pipe, PipeTransform } from '@angular/core';
import { XnUtils } from '../../common/xn-utils';

@Pipe({ name: 'xnPercentage' })
export class XnPercentagePipe implements PipeTransform {
    transform(data): string {
        return XnUtils.formatPercentage(data);
    }
}
