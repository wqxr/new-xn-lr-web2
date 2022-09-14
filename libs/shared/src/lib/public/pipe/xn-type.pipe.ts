import {Pipe, PipeTransform} from '@angular/core';
import {XnUtils} from '../../common/xn-utils';

@Pipe({name: 'xnType'})
export class XnTypePipe implements PipeTransform {
    transform(orgNumber: string): string {

        let type = '';
        switch (orgNumber) {
            case 'A':
                type = '传统模式，有发票';
                break;
            case 'B':
                type = '传统模式，无发票';
                break;
            case 'C':
                type = '传统模式，有发票';
                break;
            case 'D':
                type = '传统模式，无发票';
                break;
            case 'E':
                type = '传统模式，有发票';
                break;
            case 'F':
                type = '传统模式，无发票';
                break;
        }
        return type;

    }
}
