
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
import { Observable, of } from 'rxjs';
import { SortablejsModule, SortablejsOptions } from 'ngx-sortablejs';
import { ModalComponent, ModalSize } from 'libs/shared/src/lib/common/modal/components/modal';
import { XnService } from 'libs/shared/src/lib/services/xn.service';
import { XnUtils } from 'libs/shared/src/lib/common/xn-utils';

@Component({
    templateUrl: `./custom-list-modal.component.html`,
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
export class NewGemdalegetCustomListComponent implements OnInit {
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

    public canFixedNumber = 0; // 可冻结的列数(默认0列)

    constructor(private xn: XnService,
                private vcr: ViewContainerRef, private er: ElementRef, ) {

    }

    ngOnInit(): void {

    }


    /**
     *  判断列表项是否全部选中
     */
    public isAllChecked(): boolean {
        return !(this.datalist01.some(x => !x.checked || x.checked && x.checked === false) || this.datalist01.length === 0);
    }
    // 滚动表头
    onScroll($event) {
        this.headLeft = $event.srcElement.scrollLeft * -1;
    }

    /**
 *  全选
 */
    public checkAll() {
        if (!this.isAllChecked()) {
            this.datalist01.forEach(item => item.checked = true);
            this.selectedItems = XnUtils.distinctArray2([...this.selectedItems, ...this.datalist01], 'label');
        } else {
            this.datalist01.forEach(item => item.checked = false);
            this.datalist01.forEach(item => item.fixed = false);
            this.canFixedNumber = 0;
            this.selectedItems = [];
        }

    }

    /**
 * 单选
 * @param paramItem
 * @param index
 */
    public singleChecked(paramItem) {

        if (paramItem.checked && paramItem.checked === true) {
            paramItem.checked = false;
            this.selectedItems = this.selectedItems.filter((x: any) => x.label !== paramItem.label);
        } else {
            paramItem.checked = true;
            this.selectedItems.push(paramItem);
            this.selectedItems = XnUtils.distinctArray2(this.selectedItems, 'label'); // 去除相同的项
        }
    }



    getData() {
    }
    setData() {
        // console.info('datalistsetdata=>', this.datalist01);
        this.selectedItems = [];
        this.datalist01.forEach(x => { // 拖动后更新列表数据
            x.fixed = false;
            if (x.checked) {
                this.selectedItems.push(x);
            }
        });
        if (this.canFixedNumber > 0) { // 冻结项默认勾选
            this.datalist01.forEach((x, i) => {
                if (this.canFixedNumber >= i + 1) {
                    x.fixed = true;
                    x.checked = true;
                    this.selectedItems.push(this.datalist01[i]);
                    this.selectedItems = XnUtils.distinctArray2(this.selectedItems, 'label'); // 去除相同的项
                }
            });
        }

    }
    /**
     *  打开模态框
     * @param params
     */
    open(params: any): Observable<any> {
        this.selectedItems = [];
        this.params = params;
        const selectHead = JSON.parse(params.selectHead);
        this.datalist01 = selectHead.concat(JSON.parse(params.headText)); // 获取上次自定义排序列表
        this.datalist01 = XnUtils.distinctArray2(this.datalist01, 'label'); // 去除相同的项
        this.canFixedNumber = params.FixedNumber || 0; // 获取上次固定列数量
        this.datalist01.forEach((x, i) => {
            x.checked = false;
            x.fixed = false;
            if (this.canFixedNumber > i + 1) {
                x.fixed = true;
            }
        });

        selectHead.forEach((x: any) => {
            this.datalist01.forEach((t: any) => {
                if (t.value === x.value) {
                    t.checked = true;
                    this.selectedItems.push(t);
                }
            });

        });

        this.modal.open(ModalSize.Small);
        return Observable.create(observer => {
            this.observer = observer;
        });
    }

    /**
     *  冻结表格列
     * @param item
     * @param index 下标
     */
    fixedHead(item: any, index: number): void {

        const canFixedNumber = 5;
        if (canFixedNumber < index) { // 最多冻结前5列
            return;
        }

        if (item.fixed && !this.datalist01[index].fixed) { // 取消冻结
            item.fixed = false;
            item.checked = false;
            this.selectedItems = this.selectedItems.filter((x: any) => x.label !== item.label);
            this.canFixedNumber = index - 1;

        } else if (this.datalist01[index].fixed) { return; }
        else {
            item.fixed = true;
            item.checked = true;
            this.selectedItems.push(item);
            this.selectedItems = XnUtils.distinctArray2(this.selectedItems, 'label'); // 去除相同的项
            this.canFixedNumber = index;
        }
    }

    oncancel() {
        this.modal.close();
    }

    private close(value) {
        this.modal.close();
        this.observer.next(value);
        this.observer.complete();
    }
    onOk() {

        this.modal.close();
        this.xn.dragon.post('/trade/set_column',
            {
                column: JSON.stringify(this.selectedItems.map((x: any) => x.value)),
                status: this.params.status,
                lockCount: this.canFixedNumber
            }
        ).subscribe(x => {
            if (x.ret === 0) {
                this.close({
                    action: 'ok',
                    value: this.selectedItems,
                    status: this.params.status
                });
            }
        });

    }
}
