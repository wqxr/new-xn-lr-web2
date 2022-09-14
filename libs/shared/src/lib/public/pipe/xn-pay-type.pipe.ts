import {Pipe, PipeTransform} from '@angular/core';

@Pipe({name: 'xnPayType'})
export class XnPayTypePipe implements PipeTransform {
    transform(orgNumber: number): string {

        if (isNaN(orgNumber)) {
            orgNumber = Number(orgNumber);
        }

        let payType = '';
        switch (orgNumber) {
            case 0:
                payType = '现金支付';
                break;
            case 1:
                payType = '银行卡转账';
                break;
            case 2:
                payType = '其他';
                break;
        }
        return payType;

    }
}
