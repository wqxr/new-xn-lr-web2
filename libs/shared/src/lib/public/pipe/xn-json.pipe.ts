import {Pipe, PipeTransform} from '@angular/core';

@Pipe({name: 'xnJson'})
export class XnJsonPipe implements PipeTransform {
    transform(data: any): any {

        return JsonTransForm(data);
    }
}

export function JsonTransForm(data) {
    if (!data) {
        return;
    }
    if (typeof data === 'string') {
        try {
            return JSON.parse(data);
        } catch (e) {
            return false;
        }
    } else {
        return JSON.parse(JSON.stringify(data));
    }
}
