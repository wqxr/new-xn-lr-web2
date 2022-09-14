import { Pipe, PipeTransform } from '@angular/core';
import { XnUtils } from '../../common/xn-utils';

@Pipe({ name: 'xnTradeStatus' })
export class XnTradeStatusPipe implements PipeTransform {
    transform(status: string): string {

        let type = '';
        switch (Number(status)) {
            case -1: type = '签收失败'; break;
            case 0: type = '发起签收'; break;
            case 1: type = '签收成功'; break;
            case 2: type = '线下签收'; break;
        }
        return type;

    }
}
