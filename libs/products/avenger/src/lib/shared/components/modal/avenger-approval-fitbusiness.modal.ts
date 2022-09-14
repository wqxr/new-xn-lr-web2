
/*
 * Copyright(c) 2017-2019, 深圳市链融科技股份有限公司
 * Beijing Xiwei Technology Co., Ltd.
 * All rights reserved.
 *
 * @file：customer-template-component.ts
 * @summary：多标签页列表项 根据TabConfig.ts中的配置
 * @version: 1.0
 * **********************************************************************
 * revision             author            reason             date
 * 1.0                 wangqing             添加         2019-05-13
 * **********************************************************************
 */

import { Component, OnInit, ViewContainerRef, ElementRef, ViewChild } from '@angular/core';
import { ModalComponent, ModalSize } from 'libs/shared/src/lib/common/modal/components/modal';
import { Observable, of } from 'rxjs';
import { XnService } from 'libs/shared/src/lib/services/xn.service';
import { XnUtils } from 'libs/shared/src/lib/common/xn-utils';
import { XnFormUtils } from 'libs/shared/src/lib/common/xn-form-utils';

@Component({
    templateUrl: `./avenger-approval-fitbusiness.modal.html`,
    selector: 'customer-whiteStatus-table',
    styles: [`
    .modal-title{
        height:50px;
    }
        .title {
            font-weight:bold;
        }
        ul>li{
            list-style:none;
            font-weight:bold;
        }
        .label {
            font-weight: normal;
            flex: 1;
            color: black;
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
export class AvengerapprovalFitComponent implements OnInit {
    @ViewChild('modal') modal: ModalComponent;
    // 数据
    // tslint:disable-next-line: no-use-before-declare
    label: string;
    // 数组字段
    heads: any[] = [];
    private observer: any;
    datalist01: any[] = [];
    orgName = '';
    appId = '';
    selectedItems: any[] = [];
    public params: any;

    constructor(private xn: XnService,
                private vcr: ViewContainerRef, private er: ElementRef, ) {
    }

    ngOnInit(): void {
    }




    /**
         * 单选
         * @param paramItem
         * @param index
         */
    public singleChecked(paramItem, index) {
        this.datalist01 = [];
        if (paramItem.checked && paramItem.checked === true) {
            paramItem.checked = false;
            this.selectedItems = this.selectedItems.filter((x: any) => x.mainFlowId !== paramItem.mainFlowId);
        } else {
            paramItem.checked = true;
            this.datalist01.push(paramItem);
        }

    }
    /**
     *  打开模态框
     * @param params
     */
    open(params: any): Observable<any> {
        this.selectedItems = params.params;

        // this.pageTitle = params.title;
        // this.buildFormGroup();
        // if (JSON.parse(this.params.contractFile) && JSON.parse(this.params.contractFile).length > 0) {
        //     this.onPage(1);
        // }

        this.modal.open(ModalSize.XLarge);
        return Observable.create(observer => {
            this.observer = observer;
        });
    }

    oncancel() {
        this.modal.close();
    }
    onOk() {
        this.modal.close();
        this.observer.next({ mainFlowId: this.datalist01[0].mainFlowId });
        this.observer.complete();
    }

}
