
/*
 * Copyright(c) 2017-2019, 深圳市链融科技股份有限公司
 * Beijing Xiwei Technology Co., Ltd.
 * All rights reserved.
 *
 * @file：customer-template-component.ts
 * @summary：台账自定义列表
 * @version: 1.0
 * **********************************************************************
 * revision             author            reason             date
 * 1.0                 wangqing             添加         2020-01-06
 * **********************************************************************
 */

import { Component, OnInit, ViewContainerRef, ElementRef, ViewChild } from '@angular/core';
import { ModalComponent, ModalSize } from '../../../common/modal/components/modal';
import { XnService } from '../../../services/xn.service';
import { XnModalUtils } from '../../../common/xn-modal-utils';
import { Observable, of } from 'rxjs';
import { XnUtils } from '../../../common/xn-utils';
import { SortablejsModule, SortablejsOptions } from 'ngx-sortablejs';

@Component({
    templateUrl: `./machine-invoice-list-modal.component.html`,
    selector: 'dragon-custom-list',
    styles: [`

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

        .table-display tr td {
            vertical-align: middle;
        }

        .table {
            table-layout: fixed;
            width: 100%;
        }

        .table-height {
            max-height: 380px;
            overflow-y: auto;
        }

        .head-height {
            position: relative;
            overflow: hidden;
        }

        .table-display {
            margin: 0;
        }

        .relative {
            position: relative
        }

        .red {
            color: #f20000
        }

        .table tbody tr td:nth-child(5) {
            word-wrap: break-word
        }
    `]
})
export class MachineInvoiceListComponent implements OnInit {
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
    first = 0;
    paging = 0; // 共享该变量
    pageSize = 10;
    beginTime: any;
    endTime: any;
    sorting = ''; // 共享该变量
    naming = ''; // 共享该变量
    total = 0;
    headLeft = 0;
    options: SortablejsOptions;

    constructor(private xn: XnService,
                private vcr: ViewContainerRef, private er: ElementRef, ) {

    }

    ngOnInit(): void {

    }



    // 滚动表头
    onScroll($event) {
        this.headLeft = $event.srcElement.scrollLeft * -1;
    }






    /**
     *  打开模态框
     * @param params
     */
    open(params: any): Observable<any> {
        this.params = params.mainFlowId;
        this.xn.dragon.post('/trade/get_invoice_list', { mainFlowId: this.params }).subscribe(x => {
            if (x.ret === 0) {
                this.datalist01 = x.data.data;
            }
        });
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
        this.observer.next(this.selectedItems);
        this.observer.complete();
    }
}
