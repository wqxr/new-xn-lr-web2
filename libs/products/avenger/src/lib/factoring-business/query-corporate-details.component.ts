/*
 * Copyright(c) 2017-2019, 深圳市链融科技股份有限公司
 * Beijing Xiwei Technology Co., Ltd.
 * All rights reserved.
 *
 * @file：query-corporate-details.component.ts
 * @summary：平台，供应商 首页浮动弹框  - 查询企业舆情信息
 * @version: 1.0
 * **********************************************************************
 * revision             author            reason             date
 * 1.0                 zhyuanan            新增           2019-05-18
 * **********************************************************************
 */

import {Component, OnInit, ViewContainerRef} from '@angular/core';
import {XnService} from 'libs/shared/src/lib/services/xn.service';
import {XnModalUtils} from 'libs/shared/src/lib/common/xn-modal-utils';
import {CheckersOutputModel} from 'libs/shared/src/lib/config/checkers';
import { EditParamInputModel, EditModalComponent } from '../shared/components/modal/edit-modal.component';

@Component({
    selector: 'xn-query-corporate-details-component',
    template: `

    `,
    styles: [`
        .position {
            position: fixed;
            bottom: 30px;
            right: 30px;
            display: block;
            width: 30px;
            height: 30px;
            border-radius: 50%;
            line-height: 30px;
            text-align: center;
            background-color: #7DB2D0;
            color: #FFFFFF;
            font-size: 16px;
            font-weight: bold;
            z-index: 10001;
            opacity: .6;
            transition: all 0.5s ease-in-out;
        }

        .position:hover {
            opacity: 1;
            transform: scale(1.5);
        }
    `]
})

export class QueryCorporateDetailsComponent implements OnInit {
    constructor(protected xn: XnService, private vcr: ViewContainerRef) {
    }

    public ngOnInit() {
    }

    /**
     *  查看企业舆情/ 双击打开查询框
     */
    public handleQuery() {
        const params: EditParamInputModel = {
            title: '查询企业舆情',
            checker: [
                {
                    title: '企业名称',
                    checkerId: 'orgName',
                    type: 'text',
                    validators: {},
                }
            ] as CheckersOutputModel[],
            buttons: ['取消', '查询']
        };
        XnModalUtils.openInViewContainer(this.xn, this.vcr, EditModalComponent, params).subscribe(v => {
            if (v === null) {
                return;
            }
            // 查询企业舆情 v.orgName
        });
    }
}
