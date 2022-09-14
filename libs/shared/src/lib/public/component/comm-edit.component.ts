import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { XnService } from '../../services/xn.service';
import { ActivatedRoute, Params } from '@angular/router';
import { FormGroup } from '@angular/forms';
import CommUtils from './comm-utils';
import CommBase from './comm-base';
import { CommonPage, PageTypes } from './comm-page';

@Component({
    templateUrl: './comm-edit.component.html',
    styles: [
        `label {font-weight: normal;}`,
        `.box-body {padding-bottom: 30px;}`,
        `.control-label {font-size: 12px; font-weight: bold}`,
        `.control-desc {font-size: 12px; padding-top: 7px; margin-bottom: 0; color: #999}`,
        `.xn-block {display: block}`,
    ]
})
export class CommEditComponent extends CommonPage implements OnInit {

    fields: any[];
    params: Params;
    mainForm: FormGroup;
    record: any;
    rows: any[];

    base: CommBase;

    constructor(public xn: XnService, public vcr: ViewContainerRef, public route: ActivatedRoute) {
        super(PageTypes.Edit);
    }

    ngOnInit() {
        this.route.data.subscribe((superConfig: any) => {
            this.base = new CommBase(this, superConfig);
            this.fields = CommUtils.getListFields(superConfig.fields);
            this.route.params.subscribe((params: Params) => {
                this.params = params; // 保存参数
                this.base.onDetail();
            });
        });
    }
}
