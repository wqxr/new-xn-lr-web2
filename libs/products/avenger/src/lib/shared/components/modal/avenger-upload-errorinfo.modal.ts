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
import * as lodashall from 'lodash';

@Component({
    templateUrl: `./avenger-upload-errorinfo.modal.html`,
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
export class AvengeruploadErrorInfoComponent implements OnInit {
    @ViewChild('modal') modal: ModalComponent;
    // 数据
    // tslint:disable-next-line: no-use-before-declare
    label: string;
    // 数组字段
    heads: any[] = [];
    private observer: any;
    vanke = {
        contract: [],
        invoiceticket: [],
    };
    upstream = {
        contract: [],
        invoiceticket: [],
    };
    invoiceticketsame: any;
    contractsame: any;
    constructor(private xn: XnService,
                private vcr: ViewContainerRef, private er: ElementRef, ) {
    }

    ngOnInit(): void {
    }

    /**
       * 打开查看窗口
       * @param params
       * @returns {any}
       */
    open(params: any): Observable<any> {
        this.contractsame = lodashall.intersection(params.vanke.contract, params.upstream.contract);
        this.invoiceticketsame = lodashall.intersection(params.vanke.invoiceticket, params.upstream.invoiceticket);

        params.vanke.contract.forEach(i => {
            this.vanke.contract.push(i);
        });
        params.vanke.invoiceticket.forEach(i => {
            this.vanke.invoiceticket.push(i);
        });
        params.upstream.contract.forEach(i => {
            this.upstream.contract.push(i);
        });
        params.upstream.invoiceticket.forEach(i => {
            this.upstream.invoiceticket.push(i);
        });
        // this.vanke.invoiceticket = params.vanke.invoiceticket;
        // this.upstream.contract = params.upstream.contract;
        // this.upstream.invoiceticket = params.upstream.invoiceticket;
        // this.upstream = params.upstream;
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
        this.observer.next('ok');
        this.observer.complete();
    }
}
