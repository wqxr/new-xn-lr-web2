import {Component, OnInit, ViewContainerRef} from '@angular/core';
import {XnService} from 'libs/shared/src/lib/services/xn.service';

@Component({
    templateUrl: './reporting-list.component.html',
    styles: [
        `.table { font-size: 13px; }`,
        `.xn-click-a { display: inline-block; padding-left: 5px; padding-right: 5px;}`
    ]
})
export class ReportingListComponent implements OnInit {

    pageTitle = '企业上报交易数据';
    pageDesc = '';
    tableTitle = '企业上报交易数据';
    cardNo = '';

    total = 0;
    pageSize = 10;
    items: any[] = [];
    readonlyMan = '只读用户';
    orgType: any = '';
    roles: any[] = [];
    isOperaReview = false;

    constructor(private xn: XnService, private vcr: ViewContainerRef) {
    }

    ngOnInit() {
        this.onPage(1);
    }

    onPage(page: number) {
        page = page || 1;
        this.xn.api.post('/account_payable/get_list', {
            start: (page - 1) * this.pageSize,
            length: this.pageSize
        }).subscribe(json => {
            this.total = json.data.recordsTotal;
            this.items = json.data.data;
        });
    }

}
