import {Pipe, PipeTransform} from '@angular/core';

@Pipe({name: 'xnPay'})
export class XnPayPipe implements PipeTransform {
    transform(orgNumber: string): string {

        let orgType = '';
        switch (parseInt(orgNumber)) {
            case 0:
                orgType = '其他';
                break;
            case 1:
                orgType = '商业承兑汇票';
                break;
            case 2:
                orgType = '银行承兑汇票';
                break;
            case 3:
                orgType = '转账';
                break;
            case 4:
                orgType = '信用证';
                break;
            case 5:
                orgType = '现金';
                break;
        }
        return orgType;

    }
}
