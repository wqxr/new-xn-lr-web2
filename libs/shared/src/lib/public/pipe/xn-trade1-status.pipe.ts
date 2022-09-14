import { Pipe, PipeTransform } from '@angular/core';
import { XnUtils } from '../../common/xn-utils';

@Pipe({ name: 'xnTrade1Status' })
export class XnTrade1StatusPipe implements PipeTransform {
    transform(status: string): string {

        let type = '';
        switch (Number(status)) {
            case -1: type = '终止交易'; break;
            case 0: type = '发起订单'; break;
            case 1: type = '保理自动转账到平台'; break;
            case 2: type = '保理手动转账到平台'; break;
        }
        return type;

    }
}
