import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'xnFilterDone' })
export class XnFilterDonePipe implements PipeTransform {
    transform(data: any): any {

        if (data.length <= 0) {
            return;
        }
        const arr = [];
        for (let i = 0; i < data.length; i++) {
            if (data[i].done && data[i].done === true) {

            } else {
                arr.push(data[i]);
            }
        }
        return arr;

    }
}
