import {Component, Input, OnInit, ViewContainerRef} from '@angular/core';
import {XnService} from 'libs/shared/src/lib/services/xn.service';

@Component({
    selector: 'app-lv-mange-component',
    templateUrl: './lv-manage.component.html',
    styles: [
            `.table {
            font-size: 13px;
        }`,
    ]
})
export class LvManageComponent implements OnInit {
    @Input() hiddenTitle: boolean;
    pageTitle = '利率管理';
    pageDesc = '';
    tableTitle = '利率管理';

    showEnterprise = true;

    total = 0;
    pageSize = 10;
    items: any[] = [];
    roles: any[] = [];
    showEditOperator = false;

    constructor(private xn: XnService, private vcr: ViewContainerRef) {
    }

    ngOnInit() {
        this.onPage(1);
        // console.log("orgType: ", this.xn.user.orgType);
        let showEditOperatorTemp = false;
        this.roles = this.xn.user.roles;
        // console.log("userRoles: ", this.roles);
        for (const i in this.roles) {
            if (this.roles[i] === 'windOperator') {
                showEditOperatorTemp = true;
                this.showEditOperator = showEditOperatorTemp;
            }
        }
    }

    onPage(page: number) {
        page = page || 1;
        this.xn.api.post('/quota/quotalist', {
            start: (page - 1) * this.pageSize,
            length: this.pageSize
        }).subscribe(json => {
            this.total = json.data.recordsTotal;
            this.items = json.data.data;
        });
    }

}
