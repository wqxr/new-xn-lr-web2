import { Pipe, PipeTransform } from '@angular/core';
import { XnUtils } from '../../common/xn-utils';

@Pipe({ name: 'xnTrade3Status' })
export class XnTrade3StatusPipe implements PipeTransform {
    transform(status: string): string {

        let type = '';
        switch (Number(status)) {
            case 0: type = '无效'; break;
            case 1: type = '未进行'; break;
            case 2: type = '进行中'; break;
            case 3: type = '已完成'; break;
            case 99: type = '终止'; break;
        }
        return type;

    }
}
