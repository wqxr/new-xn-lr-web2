import {Component, OnInit, ViewContainerRef} from '@angular/core';
import {XnService} from 'libs/shared/src/lib/services/xn.service';
import {XnModalUtils} from 'libs/shared/src/lib/common/xn-modal-utils';
import {WhiteListAddModalComponent} from 'libs/shared/src/lib/public/modal/white-list-add-modal.component';
import {WhiteListDeleteModalComponent} from 'libs/shared/src/lib/public/modal/white-list-delete-modal.component';

@Component({
    templateUrl: './white-list-manage.component.html',
    styles: [
        `.table { font-size: 13px; }`,
        `.xn-click-a { display: inline-block; padding-left: 5px; padding-right: 5px;}`
    ]
})
export class WhiteListManageComponent implements OnInit {

    pageTitle = '白名单管理';
    pageDesc = '';
    tableTitle = '白名单管理';
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
        this.checkRole();
    }

    onPage(page: number) {
        page = page || 1;
        this.xn.api.post('/white_list/list', {
            start: (page - 1) * this.pageSize,
            length: this.pageSize
        }).subscribe(json => {
            this.total = json.data.recordsTotal;
            this.items = json.data.data;
        });
    }

    checkRole() {
        const isWindOperator = this.xn.user.roles.indexOf('windOperator') >= 0;
        const isWindReviewer = this.xn.user.roles.indexOf('windReviewer') >= 0;
        this.isOperaReview = isWindOperator || isWindReviewer;
    }

    onViewAdd(item: any) {
        XnModalUtils.openInViewContainer(this.xn, this.vcr, WhiteListAddModalComponent, item).subscribe(v => {
            this.items.unshift(v);
        });
    }

    onViewDelete(item: any) {
        XnModalUtils.openInViewContainer(this.xn, this.vcr, WhiteListDeleteModalComponent, item).subscribe(v => {
            for (let i = 0; i < this.items.length; i++) {
                if (this.items[i].id === v.id) {
                    this.items.splice(i, 1);
                }
            }
        });
    }
}
