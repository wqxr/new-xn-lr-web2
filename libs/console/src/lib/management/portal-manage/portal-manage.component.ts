import {Component, OnInit, Input, ViewContainerRef, ElementRef, ViewChild} from '@angular/core';
import {FormGroup, AbstractControl} from '@angular/forms';
import {XnService} from 'libs/shared/src/lib/services/xn.service';
import {PortalData} from 'libs/shared/src/lib/config/mock';
import {XnUtils} from 'libs/shared/src/lib/common/xn-utils';

@Component({
    templateUrl: './portal-manage.component.html',
    styles: [
        `.table { font-size: 13px;}`,
        `.xn-click-a { display: inline-block; padding-left: 5px; padding-right: 5px;}`
    ]
})
export class PortalManageComponent implements OnInit {

    pageTitle = '门户管理';
    pageDesc = '';
    tableTitle = '门户管理';
    cardNo = '';
    items: any;
    newItems: any;
    check: string;

    showEnterprise = true;

    total = 0;
    pageSize = 10;
    ctrl: AbstractControl;
    @ViewChild('checking') checking: ElementRef;

    constructor(private xn: XnService, private vcr: ViewContainerRef) {
    }

    ngOnInit() {
        this.items = PortalData.columns;
        this.xn.api.post('/title/list', {}).subscribe(json => {
            // 改变返回值
            this.newItems = XnUtils.portalCheckLogin(json, this.items);
        });
    }

    checkLogin(event, id) {
        const checkbox = event.target;
        const checked = checkbox.checked;
        const checkedNumber = checked ? 1 : 0;

        this.goCheck(id, checkedNumber);
    }

    goCheck(id: number, checkedNumber: number) {
        this.xn.api.post('/title/update', {
            columnId: id,
            state: checkedNumber
        }).subscribe(json => {
        });
    }
}
