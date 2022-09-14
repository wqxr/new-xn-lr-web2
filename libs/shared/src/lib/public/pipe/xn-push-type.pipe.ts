import {Pipe, PipeTransform} from '@angular/core';

@Pipe({name: 'xnPushType'})
// 资产池中是否推送至企业
export class XnPushTypePipe implements PipeTransform {
    transform(data: number): string {
        let type = '';
        if (data === 0) {
            type = '否';
        } else {
            type = '是';
        }
        return type;

    }
}
