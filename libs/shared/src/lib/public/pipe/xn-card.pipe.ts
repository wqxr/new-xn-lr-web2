import {Pipe, PipeTransform} from '@angular/core';
import {XnUtils} from '../../common/xn-utils';

@Pipe({name: 'xnCard'})
export class XnCardPipe implements PipeTransform {
    transform(value: string): string {
        if (value.length) {
            value = value.replace(/\s/g, '').replace(/\D/g, '').replace(/(\d{4})/g, '$1 ');
        }
        return value;
    }
}
