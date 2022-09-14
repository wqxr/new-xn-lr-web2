import {Component, OnInit, ViewContainerRef} from '@angular/core';
import {XnService} from 'libs/shared/src/lib/services/xn.service';
import {XnModalUtils} from 'libs/shared/src/lib/common/xn-modal-utils';
import {PlanAddModalComponent} from 'libs/shared/src/lib/public/modal/plan-add-modal.component';
import {PlanEditModalComponent} from 'libs/shared/src/lib/public/modal/plan-edit-modal.component';
import {PlanDeleteModalComponent} from 'libs/shared/src/lib/public/modal/plan-delete-modal.component';

@Component({
    templateUrl: './plan-manage.component.html',
    styles: [
        `.table { font-size: 13px; }`,
        `.xn-click-a { display: inline-block; padding-left: 5px; padding-right: 5px;}`
    ]
})
export class PlanManageComponent implements OnInit {

    pageTitle = '客户计划表';
    pageDesc = '';
    tableTitle = '客户计划表';
    cardNo = '';

    total = 0;
    pageSize = 10;
    items: any[] = [];
    showBtn = false;
    enterprise = false;

    constructor(private xn: XnService, private vcr: ViewContainerRef) {
    }

    ngOnInit() {
        this.showBtn = this.xn.user.orgType === 3;
        this.enterprise = this.xn.user.orgType === 2;
        this.onPage(1);
    }

    onPage(page: number) {
        page = page || 1;
        this.xn.api.post('/tool/plan_list', {
            start: (page - 1) * this.pageSize,
            length: this.pageSize
        }).subscribe(json => {
            this.items = json.data.plans;
            this.total = json.data.recordsTotal;
        });
    }

    onViewAdd(item: any) {
        XnModalUtils.openInViewContainer(this.xn, this.vcr, PlanAddModalComponent, item).subscribe(v => {
            this.items.push(v);
        });
    }

    onViewEdit(item: any) {
        XnModalUtils.openInViewContainer(this.xn, this.vcr, PlanEditModalComponent, item).subscribe(v => {
            this.items.toString();
        });
    }

    onViewDelete(item: any) {
        XnModalUtils.openInViewContainer(this.xn, this.vcr, PlanDeleteModalComponent, item).subscribe(v => {
            for (let i = 0; i < this.items.length; i++) {
                if (this.items[i].id === v.id) {
                    this.items.splice(i, 1);
                }
            }
        });
    }
}
