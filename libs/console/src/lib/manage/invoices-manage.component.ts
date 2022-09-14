import {Component, OnInit, ViewContainerRef} from '@angular/core';
import {XnService} from 'libs/shared/src/lib/services/xn.service';
import {XnModalUtils} from 'libs/shared/src/lib/common/xn-modal-utils';
import {InvoicesAddModalComponent} from 'libs/shared/src/lib/public/modal/invoices-add-modal.component';
import {InvoicesEditModalComponent} from 'libs/shared/src/lib/public/modal/invoices-edit-modal.component';
import {InvoicesDeleteModalComponent} from 'libs/shared/src/lib/public/modal/invoices-delete-modal.component';

@Component({
    templateUrl: './invoices-manage.component.html',
    styles: [
        `.table { font-size: 13px; }`,
        `.xn-click-a { display: inline-block; padding-left: 5px; padding-right: 5px;}`
    ]
})
export class InvoicesManageComponent implements OnInit {

    pageTitle = '发票管理';
    pageDesc = '';
    tableTitle = '发票管理';
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
        this.xn.api.post('/making_invoice_info?method=get', {
            start: (page - 1) * this.pageSize,
            length: this.pageSize
        }).subscribe(json => {
            this.items = json.data.data;
            this.total = json.data.recordsTotal;
        });
    }

    onViewAdd(item: any) {
        XnModalUtils.openInViewContainer(this.xn, this.vcr, InvoicesAddModalComponent, item).subscribe(v => {
            this.items.push(v);
            // 根据银行卡号排序，为了保证增加后的顺序和从后台拉取的顺序是一致的
            this.items.sort(function(a: any, b: any): number {
                if (parseInt(a.taxpayerSegistrationNumber, 0) > parseInt(b.taxpayerSegistrationNumber, 0)) {
                    return 1;
                } else {
                    return -1;
                }
            });
        });
    }

    onViewEdit(item: any) {
        XnModalUtils.openInViewContainer(this.xn, this.vcr, InvoicesEditModalComponent, item).subscribe(v => {
            this.items.toString();
        });
    }

    onViewDelete(item: any) {
        XnModalUtils.openInViewContainer(this.xn, this.vcr, InvoicesDeleteModalComponent, item).subscribe(v => {
            for (let i = 0; i < this.items.length; i++) {
                if (this.items[i].taxpayerSegistrationNumber === v.taxpayerSegistrationNumber) {
                    this.items.splice(i, 1);
                }
            }
        });
    }
}
