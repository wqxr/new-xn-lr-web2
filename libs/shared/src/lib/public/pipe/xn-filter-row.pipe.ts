import {Pipe, PipeTransform} from '@angular/core';

@Pipe({name: 'xnFilterRow'})
export class XnFilterRowPipe implements PipeTransform {
    transform(data: any, filterCheckers?: string): any {
        const arr = [];
        for (let i = 0; i < data.length; i++) {
            if (filterCheckers.indexOf(data[i].checkerId) === -1) {
                arr.push(data[i]);
            }
        }
        return arr;
    }
}
