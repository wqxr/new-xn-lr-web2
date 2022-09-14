import {Component, OnInit, ViewContainerRef} from '@angular/core';
import {XnService} from 'libs/shared/src/lib/services/xn.service';
import {XnModalUtils} from 'libs/shared/src/lib/common/xn-modal-utils';
import {HonourDetailModalComponent} from 'libs/shared/src/lib/public/modal/honour-detail-modal.component';

@Component({
    templateUrl: './honour-factory-list.component.html',
    styles: [
        `.table { font-size: 13px; }`,
        `.xn-click-a { display: inline-block; padding-left: 5px; padding-right: 5px;}`,
        `.plege { color: #3c8dbc }`,
        `.plege.active { color: #ff3000; }`
    ]
})
export class HonourFactoryListComponent implements OnInit {

    pageTitle = '商票展示';
    pageDesc = '';
    tableTitle = '商票展示';
    cardNo = '';

    total = 0;
    pageSize = 1;
    items: any[] = [];


    constructor(private xn: XnService, private vcr: ViewContainerRef) {
    }

    ngOnInit() {
        this.getMoneyOrder();
    }

    getMoneyOrder() {
        this.xn.api.post('/tool/money_order_get', {}).subscribe(json => {
            this.items = json.data;
        });
    }

    onView(item: any) {
        XnModalUtils.openInViewContainer(this.xn, this.vcr, HonourDetailModalComponent, item).subscribe(v => {

        });
    }

    onpledge(item: any) {
        this.xn.api.post('/tool/money_order_get', {}).subscribe(json => {
            this.items = json.data;
        });
    }

    checkPledge(event, billNumber, i) {
        const checkbox = event.target;
        const checked = checkbox.checked;
        const checkedNumber = checked ? 1 : 0;

        this.goCheck(billNumber, checkedNumber, i);
    }

    goCheck(billNumber: number, checkedNumber: number, i: number) {
        this.xn.api.post('/tool/money_order_status', {
            billNumber,
            status: checkedNumber
        }).subscribe(json => {
            this.items[i].status = checkedNumber;
        });
    }

    onCssClass(status) {
        return status === 1 ? 'active' : '';
    }
}
