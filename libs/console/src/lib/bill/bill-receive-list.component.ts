import {Component, OnInit, ViewContainerRef} from '@angular/core';
import {XnService} from 'libs/shared/src/lib/services/xn.service';

@Component({
    templateUrl: './bill-receive-list.component.html',
    styles: [
            `.table {
            font-size: 13px;
        }`,
            `.xn-click-a {
            display: inline-block;
            padding-left: 5px;
            padding-right: 5px;
        }`
    ]
})
export class BillReceiveListComponent implements OnInit {

    pageTitle = '商票接收';
    pageDesc = '';
    tableTitle = '商票接收';
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
        this.xn.api.post('/bill_receive?method=get', {
            start: (page - 1) * this.pageSize,
            length: this.pageSize
        }).subscribe(json => {
            this.total = json.data.recordsTotal;
            this.items = json.data.data;
        });
    }

}
