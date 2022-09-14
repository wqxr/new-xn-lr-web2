
/*
 * Copyright(c) 2017-2019, 深圳市链融科技股份有限公司
 * Beijing Xiwei Technology Co., Ltd.
 * All rights reserved.
 *
 * @file：customer-template-component.ts
 * @summary：银行账号选择
 * @version: 1.0
 * **********************************************************************
 * revision             author            reason             date
 * 1.0                 wangqing             添加         2019-08-28
 * **********************************************************************
 */

import { Component, OnInit, ViewContainerRef, ElementRef, ViewChild } from '@angular/core';
import { ModalComponent, ModalSize } from '../../../common/modal/components/modal';
import { XnService } from '../../../services/xn.service';
import { XnModalUtils } from '../../../common/xn-modal-utils';
import { BankCardAddComponent } from './bank-card-add.component';
import { Observable, of } from 'rxjs';
import { DeletematerialEditModalComponent } from './delete-material-modal.component';
import { SelectOptions } from '../../../config/select-options';

@Component({
    templateUrl: `./chose-capitalPool-modal.component.html`,
    selector: 'chose-capitalPool-modal',
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
export class DragonChoseCapitalinfoComponent implements OnInit {
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
    paging = 1; // 共享该变量
    pageSize = 10;
    beginTime: any;
    endTime: any;
    sorting = ''; // 共享该变量
    naming = ''; // 共享该变量
    total = 0;
    paramType: number;
    headquarters: string; // 总部公司
    projectName: string;
    capitalPoolName: string;
    styleList: any[] = [];
    type: number;

    constructor(private xn: XnService,
        private vcr: ViewContainerRef, private er: ElementRef,) {
    }

    ngOnInit(): void {
        this.styleList = SelectOptions.get('productType_dw');
    }




    /**
         * 单选
         * @param paramItem
         * @param index
         */
    public singleChecked(paramItem, index) {
        this.selectedItems = [];
        if (paramItem.checked && paramItem.checked === true) {
            paramItem.checked = false;
            this.selectedItems = this.selectedItems.filter((x: any) => x.cardCode !== paramItem.cardCode);
        } else {
            paramItem.checked = true;
            this.selectedItems.push(paramItem);
            // this.datalist01.push(paramItem);
        }

    }
    onInput(e) {
        this.projectName = e.target.value;
        this.onPage({ page: 1 });

    }
    onInput1(e) {
        this.capitalPoolName = e.target.value;
        this.onPage({ page: 1 });

    }
    changeSignType(e) {
        if (e.target.value === '') {
            this.type = undefined;
        } else {
            this.type = Number(e.target.value);

        }
        this.onPage({ page: 1 });

    }

    /**
     *  打开模态框
     * @param params
     */
    open(params: any): Observable<any> {

        this.params = params.selectedItems;
        this.headquarters = params.headquarters;
        this.paramType = params.type;
        this.onPage(1);
        this.modal.open(ModalSize.XLarge);
        return Observable.create(observer => {
            this.observer = observer;
        });
    }


    /**
  *  @param event
  *       event.page: 新页码
  *       event.pageSize: 页面显示行数
  *       event.first: 新页面之前的总行数,下一页开始下标
  *       event.pageCount : 页码总数
  */
    onPage(event: any): void {
        this.paging = event.page || 1;
        this.pageSize = event.pageSize || this.pageSize;
        // 后退按钮的处理
        this.first = (this.paging - 1) * this.pageSize;
        const params = this.buildParams();
        this.xn.dragon.post('/project_manage/pool/project_pool_select', params).subscribe(x => {
            if (x.ret === 0) {
                this.datalist01 = x.data.data;
                this.total = x.data.count;
            }
        });
    }

    oncancel() {
        this.modal.close();
    }
    onOk() {
        this.modal.close();
        const capitalName = this.selectedItems.map((x: any) => x.capitalPoolName)[0];
        const capitalId = this.selectedItems.map((x: any) => x.capitalPoolId)[0];
        XnModalUtils.openInViewContainer(this.xn, this.vcr, DeletematerialEditModalComponent,
            { selectedItems: this.params, type: this.paramType, capitalName, capitalPoolId: capitalId }).subscribe((x) => {
                if (x === null) {
                    this.observer.next(null);
                    this.observer.complete();
                } else {
                    this.observer.next({ action: 'ok' });
                    this.observer.complete();
                }

            });
        // this.observer.next(this.selectedItems);
        // this.observer.complete();
    }
    private buildParams() {
        if (this.headquarters.includes('龙光')) {
            this.headquarters = '龙光';
        }
        // 分页处理
        const params: any = {
            pageNo: this.paging,
            pageSize: this.pageSize,
            beginTime: this.beginTime,
            endTime: this.endTime,
            type: this.type,
            projectName: this.projectName,
            capitalPoolName: this.capitalPoolName,
            headquarters: this.headquarters,
        };
        // 排序处理
        if (this.sorting && this.naming) {
            params.order = [this.sorting + ' ' + this.naming];
        }
        return params;
    }


}
