/*
 * Copyright(c) 2017-2019, 深圳市链融科技股份有限公司
 * Beijing Xiwei Technology Co., Ltd.
 * All rights reserved.
 *
 * @file：comfirm-information-index-component
 * @summary：多标签页列表项 根据tab-pane.ts中的配置
 * @version: 1.0
 * **********************************************************************
 * revision             author            reason             date
 * 1.0                 wangqing           推广列表        2019-12-2
 * **********************************************************************
 */

import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { HwModeService } from 'libs/shared/src/lib/services/hw-mode.service';
import { XnModalUtils } from 'libs/shared/src/lib/common/xn-modal-utils';
import { XnService } from 'libs/shared/src/lib/services/xn.service';
import { BankWhiteStatusComponent } from '../../share/modal/white-status-modal.component';
import { RecommendationLetterComponent } from '../../share/modal/recommendation-letter-modal.component';

@Component({
    selector: 'app-comfirm-information-index-component',
    templateUrl: `./bank-extension-list.component.html`,
    styles: [`
        .title {
            width: 100px;
        }

        .label {
            font-weight: normal;
            flex: 1;
        }

        .flex {
            display: flex;
        }

        .input-check {
            width: 100px;
        }

        .table-head .sorting, .table-head .sorting_asc, .table-head .sorting_desc {
            /*position: relative;*/
            cursor: pointer
        }

        .table-head .sorting:after, .table-head .sorting_asc:after, .table-head .sorting_desc:after {
            font-family: 'Glyphicons Halflings';
            opacity: 0.5;
        }

        .table-head .sorting:after {
            content: "\\e150";
            opacity: 0.2
        }

        .table-head .sorting_asc:after {
            content: "\\e155"
        }

        .table-head .sorting_desc:after {
            content: "\\e156"
        }
    `]
})
export class BankExtensionListComponent implements OnInit {
    // 页码配置
    pageConfig = {
        pageSize: 10,
        first: 0,
        total: 0,
    };
    data: any[] = [];
    paging = 0; // 共享该变量

    constructor(
        private xn: XnService,
        private vcr: ViewContainerRef,
        public hwModeService: HwModeService,
    ) {
    }

    ngOnInit(): void {
        this.onPage({ page: this.paging });


    }
    onPage(e?) {
        this.paging = e.page || 1;
        this.pageConfig = Object.assign({}, this.pageConfig, e);
        const params = {
            start: (this.paging - 1) * this.pageConfig.pageSize,
            length: this.pageConfig.pageSize,
        };
        this.xn.api.avenger.post('/bankpush/list/push_list', params).subscribe(x => {
            if (x.ret === 0) {
                this.data = x.data.data;
                this.pageConfig.total = x.data.count;
            } else {
                this.data = [];
                this.pageConfig.total = 0;
            }
        });
    }
    openWhite(paramItem: any) {
        this.xn.avenger.post('/bankpush/list/get_url', { id: paramItem.id }).subscribe(x => {
            if (x.ret === 0) {
                x.data.status = paramItem.status;
                XnModalUtils.openInViewContainer(this.xn, this.vcr, RecommendationLetterComponent, { value: x.data }).subscribe(x => {
                    if (x.action === 'cancel') {
                        this.onPage({ page: this.paging });
                    }
                });
            }
        });

    }

}
