import {Component, OnInit, ViewContainerRef} from '@angular/core';
import {XnService} from 'libs/shared/src/lib/services/xn.service';

@Component({
    templateUrl: './report-form-list.component.html',
    styles: [
        `.table { font-size: 13px; }`,
        `.xn-click-a { display: inline-block; padding-left: 5px; padding-right: 5px;}`
    ]
})
export class ReportFormListComponent implements OnInit {

    pageTitle = '主流程详情报表';
    pageDesc = '';
    tableTitle = '主流程详情报表';
    cardNo = '';

    total = 0;
    pageSize = 10;
    items: any[] = [];
    orgType: any = '';
    roles: any[] = [];

    constructor(private xn: XnService, private vcr: ViewContainerRef) {
    }

    ngOnInit() {
        this.onPage(1);
    }

    onPage(page: number) {
        page = page || 1;
        this.xn.api.post('/flow/bill_main/all', {
            start: (page - 1) * this.pageSize,
            length: this.pageSize
        }).subscribe(json => {
            this.total = json.data.recordsTotal;
            this.items = json.data.data;
        });
    }

}
