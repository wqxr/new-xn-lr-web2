import {Pipe, PipeTransform} from '@angular/core';
import {XnUtils} from 'libs/shared/src/lib/common/xn-utils';

@Pipe({name: 'xnText'})
export class XnTextPipe implements PipeTransform {
    transform(arg: any, type?: string): any {
        if (!!type && type === 'date') {
            if (arg === null || arg === undefined || arg === '' || Number.isNaN(arg)) {
                return '-';
            }
            arg = arg.toString().substr(0, 10);
            return XnUtils.formatDate(arg);
        }
        if (arg === null || arg === undefined || arg === '' || Number.isNaN(arg)) {
            return '-';
        }
        return arg;
    }
}
