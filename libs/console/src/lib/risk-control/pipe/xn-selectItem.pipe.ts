import {Pipe, PipeTransform} from '@angular/core';

@Pipe({name: 'transformSelectPipe'})
export class XnSelectItemPipe implements PipeTransform {
    transform(value, list?) {
        if (list && list.length) {
            list.map(x => {
                if (x.value === value) {
                    value = x.label;
                }
            });
        }
        return value;
    }
}
