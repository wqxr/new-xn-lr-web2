import {Pipe, PipeTransform} from '@angular/core';

@Pipe({name: 'xnSignerType'})
export class XnSignerTypePipe implements PipeTransform {
    transform(type: number): string {
        // '签署方: 0-总部公司；1-收款单位；2-项目公司；3-保理商'
        let signerType: string;
        switch (type) {
            case 0:
                signerType = '总部公司';
                break;
            case 1:
                signerType = '收款单位';
                break;
            case 2:
                signerType = '项目公司';
                break;
            case 3:
                signerType = '保理商';
                break;
        }
        return signerType;

    }
}
