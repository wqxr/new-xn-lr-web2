import { Pipe, PipeTransform } from '@angular/core';
import { Contract } from '../../config/contract';

@Pipe({ name: 'xnContractFilter' })
export class XnContractFilterPipe implements PipeTransform {
    transform(data: any, type?: string): any {


        let datas = [];
        if (data && data !== '') {
            datas = JSON.parse(data);
        }

        if (datas.length <= 0) {
            return [];
        }

        const contractName: any[] = Contract.getNames();

        if (type === 'wanke' || type === 'financing_wk4' || type === 'financing_factoring_two4') {
            datas = datas.filter(v => v && v.label === contractName[0] || v
                && v.label === contractName[1] || v && v.label === contractName[2]);
            return JSON.stringify(datas);
        }

        if (type === 'financing_supplier6' || type === 'sub_customer_verify_520') {
            // datas = datas.filter(v => v.label !== contractName[3] && v.label !== contractName[4]);
            return JSON.stringify(datas);
        }

        for (let i = 0; i < contractName.length; i++) {
            datas = datas.filter(v => v && v.label !== contractName[i]);
        }
        return JSON.stringify(datas);

    }
}
