import {Pipe, PipeTransform} from '@angular/core';
import {XnUtils} from '../../common/xn-utils';

@Pipe({name: 'xnZichan'})
export class XnZichanPipe implements PipeTransform {
    transform(asset: string): string {

        let cnName = '';
        switch (asset) {
            case 'purchase_order':
                cnName = '下游向核心企业下订单';
                break;
            case 'supply_order':
                cnName = '核心企业向上游供应商下订单';
                break;
            case 'stock_in':
                cnName = '商品入库到核心企业';
                break;
            case 'stock_out':
                cnName = '核心企业商品出库';
                break;
            case 'transfer_stock':
                cnName = '寄库';
                break;
            case 'accounts_payable_registration':
                cnName = '应付账款登记';
                break;
            case 'upload_attachment':
                cnName = '上传附件';
                break;
            case 'Accounts_receivable_registration':
                cnName = '应收账款登记';
                break;
            case 'purchase_finance':
                cnName = '下游账务付款';
                break;
            case 'supply_finance':
                cnName = '向上游账务付款';
                break;
        }
        return cnName;

    }
}
