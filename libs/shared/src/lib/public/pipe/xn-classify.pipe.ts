import {Pipe, PipeTransform} from '@angular/core';
import {XnUtils} from '../../common/xn-utils';

@Pipe({name: 'xnClassify'})
export class XnClassfyPipe implements PipeTransform {
    transform(enName: string): string {

        let cnName = '';
        switch (enName) {
            case 'manage':
                cnName = '管理型';
                break;
            case 'transaction':
                cnName = '交易型';
                break;
        }
        return cnName;

    }
}
