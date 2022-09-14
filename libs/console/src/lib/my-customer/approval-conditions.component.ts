import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { XnService } from 'libs/shared/src/lib/services/xn.service';
import { XnModalUtils } from 'libs/shared/src/lib/common/xn-modal-utils';
import { ApprovalAddModalComponent } from 'libs/shared/src/lib/public/modal/approval-add-modal.component';
import { ApprovalEditModalComponent } from 'libs/shared/src/lib/public/modal/approval-edit-modal.component';
import { ApprovalReadModalComponent } from 'libs/shared/src/lib/public/modal/approval-read-modal.component';
import { ApprovalDeleteModalComponent } from 'libs/shared/src/lib/public/modal/approval-delete-modal.component';

@Component({
    templateUrl: './approval-conditions.component.html',
    styles: [
        `.table { font-size: 13px; margin-bottom: 0px; }
        tr th, tr td { vertical-align: middle; }
        .in-content { text-overflow: -o-ellipsis-lastline; overflow: hidden;
            text-overflow: ellipsis; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical;  }
            `,
    ]
})
export class ApprovalConditionsComponent implements OnInit {

    pageTitle = '审批条件管理';
    pageDesc = '';
    tableTitle = '审批条件管理';

    items: any[] = [];
    apps: any[] = [];


    constructor(private xn: XnService, private vcr: ViewContainerRef) {
    }

    ngOnInit() {
        this.getCondition();
    }

    getCondition() {
        this.xn.api.post('/tool/condition_all', {
        }).subscribe(json => {
            this.items = json.data;
            this.apps = this.buildSameApp(this.items);
        });
    }

    buildSameApp(items) {
        const obj: any = {} as any;
        const apps: any[] = [];
        for (const item of items) {
            if (!obj[item.appId]) { // appId 比 appName 更安全
                obj[item.appId] = [];
                obj[item.appId].push(item);
            } else {
                obj[item.appId].push(item);
            }
        }
        for (const key in obj) {
            if (obj.hasOwnProperty(key)) {
                const temp = {} as any;
                temp.appName = obj[key] && obj[key].length > 0 && obj[key][0].appName;
                temp.appId = obj[key] && obj[key].length > 0 && obj[key][0].appId;
                temp.items = obj[key];
                apps.push(temp);
            }
        }
        return apps;
    }

    onViewAdd(item: any) {
        XnModalUtils.openInViewContainer(this.xn, this.vcr, ApprovalAddModalComponent, item).subscribe(v => {
            this.items.push(v);
            // 根据id排序，为了保证增加后的顺序和从后台拉取的顺序是一致的
            this.apps = this.buildSameApp(this.items);
            this.apps.sort(function(a: any, b: any): number {
                if (parseInt(a.appId, 10) > parseInt(b.appId, 10)) {
                    return 1;
                } else {
                    return -1;
                }
            });
        });
    }

    onViewEdit(item: any) {
        XnModalUtils.openInViewContainer(this.xn, this.vcr, ApprovalEditModalComponent, item).subscribe(v => {
            this.apps = this.buildSameApp(this.items);
        });
    }

    onViewRead(item: any) {
        XnModalUtils.openInViewContainer(this.xn, this.vcr, ApprovalReadModalComponent, item).subscribe(v => {
        });
    }

    onViewDelete(item: any) {
        XnModalUtils.openInViewContainer(this.xn, this.vcr, ApprovalDeleteModalComponent, item).subscribe(v => {
            for (let i = 0; i < this.items.length; i++) {
                if (parseInt(this.items[i].id, 10) === parseInt(v.id, 10)) {
                    this.items.splice(i, 1);
                }
            }
            this.apps = this.buildSameApp(this.items);
        });
    }
}
