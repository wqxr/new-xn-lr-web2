import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'xnArrayTruncate'
})
export class ArrayTruncatePipe implements PipeTransform {
    transform(value: string, limit = 2, ellipsis = '...') {
        if (!value) {
            return '';
        }

        const obj =
            typeof value === 'string'
                ? (this.isJson(value) ? JSON.parse(value) : value.split(','))
                : JSON.parse(JSON.stringify(value));

        return Array.isArray(obj) && obj.length > limit
            ? `${obj.slice(0, limit)} ${ellipsis}`
            : obj;
    }

    private isJson(str) {
        try {
            JSON.parse(str);
        } catch (e) {
            return false;
        }
        return true;
    }
}
