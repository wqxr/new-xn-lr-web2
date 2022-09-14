import {Pipe, PipeTransform} from '@angular/core';
import {XnUtils} from '../../common/xn-utils';

@Pipe({name: 'xnZhiya'})
export class xnZhiyaPipe implements PipeTransform {
    transform(status: string): string {

        let type = '';
        switch (Number(status)) {
            case 0:
                type = '未质押';
                break;
            case 1:
                type = '已质押';
                break;
        }
        return type;

    }
}
