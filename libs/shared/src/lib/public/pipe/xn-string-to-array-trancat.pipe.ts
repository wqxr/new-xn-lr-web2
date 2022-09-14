import {Pipe, PipeTransform} from '@angular/core';

/**
 *  字符串转数组
 */
@Pipe({
    name: 'xnStringToArray'
})
export class XnStringToArrayPipe implements PipeTransform {
    transform(value: string, limit = 2, ellipsis = '...') {
        if (!value) {
            return '';
        }
        const obj = value.split(',');
        return Array.isArray(obj) && obj.length > limit
            ? `${obj.slice(0, limit)} ${ellipsis}`
            : obj;
    }
}
