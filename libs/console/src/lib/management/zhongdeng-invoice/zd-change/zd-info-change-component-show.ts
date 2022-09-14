import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { XnUtils } from 'libs/shared/src/lib/common/xn-utils';
import { LoadingService } from 'libs/shared/src/lib/services/loading.service';
import { PublicCommunicateService } from 'libs/shared/src/lib/services/public-communicate.service';
import { XnService } from 'libs/shared/src/lib/services/xn.service';

@Component({
    selector: 'zd-change-info-show',
    templateUrl: `./zd-info-change-component-show.html`,
    styleUrls: ['./zd-change-new-component.less'],

})
export class ZdInfoChangeShowComponent implements OnInit {
    @Input() formGroups: FormGroup;
    @Input() data?: any;
    @Input() svrConfig?: any;
    @Input() registerNo?: string;
    invoiceList: ItemData[] = [];
    contractList: ItemData[] = [];
    debtorList: ItemData[] = [];
    isInvoice: boolean[] = [];
    contractListLength: number;

    alert = '';
    constructor(
        private publicCommunicateService: PublicCommunicateService,
        private xn: XnService,
        private loadingService: LoadingService) { }
    ngOnInit(): void {

        this.invoiceList = JSON.parse(this.data.filter(x => x.checkerId === 'invoiceList')[0].data);
        this.contractList = JSON.parse(this.data.filter(x => x.checkerId === 'contractList')[0].data);
        this.debtorList = JSON.parse(this.data.filter(x => x.checkerId === 'debtorList')[0].data);



    }


    /**
     * 导出清单 type：类型
     */
    downExcel(types: string) {
        this.loadingService.open();
        const formatName = {
            invoice: '发票',
            contract: '合同',
            debtor: '债务人'
        }
        this.xn.api.download(`/custom/zhongdeng/zd/down_excel`, {
            type: types,
            recordId: this.svrConfig.record.recordId
        }).subscribe((v: any) => {
            this.xn.api.save(v._body, `${formatName[types]}.xlsx`);
            this.loadingService.close();
        });
    }
}
interface ItemData {
    invoiceCode?: string;
    invoiceMoney?: string;
    invoicechangePrice?: string;
    contractName?: string;
    contractId?: string;
    debtor?: string;
}
