import {Pipe, PipeTransform} from '@angular/core';

/**
 * 发票管理列表中发票验证状态
 * */
@Pipe({name: 'xnInvoiceStatus1'})
export class XnInvoiceStatus1Pipe implements PipeTransform {
    transform(status: any): any {
        let invoiceStatus: any = '';
        switch (status) {
            case 1:
                invoiceStatus = '人工验证';
                break;
            case 3:
                invoiceStatus = '验证通过';
                break;
        }
        return invoiceStatus;
    }
}
