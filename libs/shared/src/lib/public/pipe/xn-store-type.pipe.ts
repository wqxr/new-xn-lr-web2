import {Pipe, PipeTransform} from '@angular/core';
import {XnUtils} from '../../common/xn-utils';

@Pipe({name: 'xnStore'})
export class XnStoreTypePipe implements PipeTransform {
    transform(storetype: string): string {

        let stockCn = '';
        switch (Number(storetype)) {
            case 1:
                stockCn = '自有';
                break;
            case 2:
                stockCn = '租用';
                break;
            case 3:
                stockCn = '其他';
                break;
        }
        return stockCn;

    }
}
