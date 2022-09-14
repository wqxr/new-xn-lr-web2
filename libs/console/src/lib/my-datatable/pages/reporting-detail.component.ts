import {Component, OnInit, ViewContainerRef} from '@angular/core';
import {XnService} from 'libs/shared/src/lib/services/xn.service';
import {ActivatedRoute, Params} from '@angular/router';

@Component({
    templateUrl: './reporting-detail.component.html',
    styles: [
        `.table { font-size: 13px; }`,
        `.btn-right { float: right }`,
        `.btn { padding: 4px 12px; }`
    ]
})
export class ReportingDetailComponent implements OnInit {

    pageTitle = '企业上报交易数据详情';
    pageDesc = '';
    tableTitle = '企业上报交易数据详情';

    showEnterprise = true;

    total = 0;
    pageSize = 10;
    items: any[] = [];
    data: any = {} as any;
    platformSeq: any;

    constructor(private xn: XnService, private vcr: ViewContainerRef, private route: ActivatedRoute) {
    }

    ngOnInit() {
        this.route.params.subscribe((params: Params) => {
            this.platformSeq = params.id;
            this.xn.api.post('/account_payable/info', {
                platformSeq: this.platformSeq
            }).subscribe(json => {
                this.data = json.data.data;

                // 将格式进行格式化
                this.data.bills = this.data && this.data.bills && JSON.parse(this.data.bills);
                this.data.invoices = this.data && this.data.invoices && JSON.parse(this.data.invoices);
                this.data.contract = this.data && this.data.contract && JSON.parse(this.data.contract);
                this.data.logistics = this.data && this.data.logistics && JSON.parse(this.data.logistics);
                this.data.receipt = this.data && this.data.logistics && JSON.parse(this.data.receipt);

                // 将commodities进行格式化
                const list = ['listPurchaseOrder', 'liststockIn', 'liststockOut', 'listsupplyOrder'];
                this.formatList(list);
            });
        });
    }

    // 用map的好处是更加简洁
    formatList(list) {
        list.map(v => {
            this.formatData(v);
        });
    }

    // 将格式进行转化
    formatData(item) {
        if (!item) {
            return;
        }

        if (this.data[item] && this.data[item].length > 0) {
            for (const data of this.data[item]) {
                data.commodities = JSON.parse(data.commodities);
            }
        }
    }

}
