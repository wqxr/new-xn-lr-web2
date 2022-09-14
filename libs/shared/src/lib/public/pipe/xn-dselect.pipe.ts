import {Pipe, PipeTransform} from '@angular/core';
import {XnUtils} from '../../common/xn-utils';

@Pipe({name: 'xnDselect'})
export class XnDselectPipe implements PipeTransform {
    transform(data: string): string {

        if (!data) {
            return;
        }

        let select = '';
        select = JSON.parse(data).first + ',' + JSON.parse(data).second;
        return select;

    }
}
