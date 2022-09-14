import { Pipe, PipeTransform } from '@angular/core';
import { XnUtils } from '../../common/xn-utils';

@Pipe({ name: 'xnTrade2Status' })
export class XnTrade2StatusPipe implements PipeTransform {
    transform(status: string): string {

        let type = '';
        switch (Number(status)) {
            case -1: type = '终止交易'; break;
            case 0: type = '发起订单'; break;
            case 1: type = '平台自动转账到企业'; break;
            case 2: type = '平台手动转账到企业'; break;
        }
        return type;

    }
}
