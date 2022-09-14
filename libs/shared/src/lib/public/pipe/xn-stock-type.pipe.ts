import {Pipe, PipeTransform} from '@angular/core';
import {XnUtils} from '../../common/xn-utils';

@Pipe({name: 'xnStock'})
export class XnStockTypePipe implements PipeTransform {
    transform(stocktype: string): string {

        let stockCn = '';
        switch (stocktype) {
            case 'stockIn':
                stockCn = '入仓';
                break;
            case 'stockMove':
                stockCn = '移仓';
                break;
            case 'stockOut':
                stockCn = '出仓';
                break;
        }
        return stockCn;

    }
}
