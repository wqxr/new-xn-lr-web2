import {Pipe, PipeTransform} from '@angular/core';

@Pipe({name: 'xnPercent'})
export class XnPercentPipe implements PipeTransform {
    transform(arg: number): any {
        if (!!arg) {
            if (arg === 0) {
                return 0;
            }
            return parseFloat(arg.toFixed(2)) * 100 + '%';
        }
        return arg;
    }
}
