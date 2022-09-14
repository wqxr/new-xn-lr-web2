import {Pipe, PipeTransform} from '@angular/core';
import {XnUtils} from '../../common/xn-utils';

@Pipe({name: 'xnOrg'})
export class XnOrgPipe implements PipeTransform {
    transform(orgNumber: string): string {

        let orgType = '';
        switch (parseInt(orgNumber)) {
            case 1:
                orgType = '供应商';
                break;
            case 2:
                orgType = '核心企业';
                break;
            case 3:
                orgType = '保理商';
                break;
            case 4:
                orgType = '金融机构';
                break;
            case 99:
                orgType = '平台';
                break;
        }
        return orgType;

    }
}
