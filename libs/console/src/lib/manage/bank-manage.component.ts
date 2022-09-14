import {Component, OnInit, ViewContainerRef} from '@angular/core';
import {XnService} from 'libs/shared/src/lib/services/xn.service';
import {XnModalUtils} from 'libs/shared/src/lib/common/xn-modal-utils';
import {BankAddModalComponent} from 'libs/shared/src/lib/public/modal/bank-add-modal.component';
import {BankDeleteModalComponent} from 'libs/shared/src/lib/public/modal/bank-delete-modal.component';

@Component({
    templateUrl: './bank-manage.component.html',
    styles: [
        `.table { font-size: 13px; }`,
        `.xn-click-a { display: inline-block; padding-left: 5px; padding-right: 5px;}`
    ]
})
export class BankManageComponent implements OnInit {

    pageTitle = '银行账号管理';
    pageDesc = '';
    tableTitle = '银行账号管理';
    cardNo = '';

    total = 0;
    pageSize = 10;
    items: any[] = [];


    constructor(private xn: XnService, private vcr: ViewContainerRef) {
    }

    ngOnInit() {
        this.onPage(1);
    }

    onPage(page: number) {
        page = page || 1;
        this.xn.api.post('/bank_card?method=get', {
            start: (page - 1) * this.pageSize,
            length: this.pageSize
        }).subscribe(json => {
            this.items = json.data.data;
            this.total = json.data.recordsTotal;
        });
    }

    onViewAdd(item: any) {
        XnModalUtils.openInViewContainer(this.xn, this.vcr, BankAddModalComponent, item).subscribe(v => {
            this.items.push(v);
            // 根据银行卡号排序，为了保证增加后的顺序和从后台拉取的顺序是一致的
            this.items.sort(function(a: any, b: any): number {
                if (parseInt(a.cardCode) > parseInt(b.cardCode)) {
                    return 1;
                } else {
                    return -1;
                }
            });
        });
    }

    onViewDelete(item: any) {
        XnModalUtils.openInViewContainer(this.xn, this.vcr, BankDeleteModalComponent, item).subscribe(v => {
            for (let i = 0; i < this.items.length; i++) {
                if (this.items[i].cardCode === v.cardCode) {
                    this.items.splice(i, 1);
                }
            }
        });
    }
}
