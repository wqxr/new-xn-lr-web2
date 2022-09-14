/*
 * Copyright(c) 2017-2019, 深圳市链融科技股份有限公司
 * Beijing Xiwei Technology Co., Ltd.
 * All rights reserved.
 *
 * @file：supplier-unsigned-contract
 * @summary：雅居乐 供应商签署合同
 * @version: 1.0
 * **********************************************************************
 * revision             author            reason             date
 * 1.0                 zhyuanan          修改签署合同关键字         2019-03-28
 * **********************************************************************
 */

import {Component, OnInit, ViewContainerRef} from '@angular/core';
import CommBase from 'libs/shared/src/lib/public/component/comm-base';
import {FormGroup} from '@angular/forms';
import {XnService} from 'libs/shared/src/lib/services/xn.service';
import {ActivatedRoute} from '@angular/router';
import {LoadingService} from 'libs/shared/src/lib/services/loading.service';
import {CommonPage, PageTypes} from 'libs/shared/src/lib/public/component/comm-page';
import CommUtils from 'libs/shared/src/lib/public/component/comm-utils';
import {XnUtils} from 'libs/shared/src/lib/common/xn-utils';
import {XnFormUtils} from 'libs/shared/src/lib/common/xn-form-utils';
import {XnModalUtils} from 'libs/shared/src/lib/common/xn-modal-utils';
import {FinancingFactoringVankeModalComponent} from 'libs/shared/src/lib/public/modal/financing-factoring-vanke-modal.component';
import {InvoiceDataViewModalComponent} from 'libs/shared/src/lib/public/modal/invoice-data-view-modal.component';

@Component({
    selector: 'app-supplier-unsigned-contract',
    templateUrl: './supplier-unsigned-contract.component.html',
    styles: [
            `
            .table {
                font-size: 13px;
            }

            .table-head .sorting,
            .table-head .sorting_asc,
            .table-head .sorting_desc {
                position: relative;
                cursor: pointer;
            }

            .table-head .sorting:after,
            .table-head .sorting_asc:after,
            .table-head .sorting_desc:after {
                position: absolute;
                bottom: 8px;
                right: 8px;
                display: block;
                font-family: 'Glyphicons Halflings';
                opacity: 0.5;
            }

            .table-head .sorting:after {
                content: '\\e150';
                opacity: 0.2;
            }

            .table-head .sorting_asc:after {
                content: '\\e155';
            }

            .table-head .sorting_desc:after {
                content: '\\e156';
            }

            .tab-heads {
                margin-bottom: 10px;
                display: flex;
            }

            .tab-buttons {
                flex: 1;
            }

            .tab-search {
                text-align: right;
            }

            .form-control {
                display: inline-block;
                border-radius: 4px;
                box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.075);
                width: 200px;
            }

            .btn {
                vertical-align: top;
            }

            .small-font {
                font-size: 12px;
            }

            .item-box {
                position: relative;
                display: flex;
                margin-bottom: 10px;
            }

            .item-box i {
                position: absolute;
                top: 11px;
                right: 23px;
                opacity: 0.5;
                cursor: pointer;
            }

            .plege {
                color: #3c8dbc;
            }

            .plege.active {
                color: #ff3000;
            }

            tbody tr:hover {
                background-color: #e6f7ff;
                transition: all 0.1s linear;
            }

            .item-label label {
                min-width: 150px;
                padding-right: 8px;
                font-weight: normal;
                line-height: 34px;
                text-align:right;

            }

            .item-control {
                flex: 1;
            }

            .item-control select {
                width: 100%;
            }

            .fr {
                float: right;
            }

            .money-control {
                display: flex;
                line-height: 35px;
            }

            .text-right {
                text-align: right;
            }

            ul li {
                list-style-type: none;
            }

            .item-list {
                position: absolute;
                max-height: 200px;
                width: 375px;
                padding: 0px;
                z-index: 1;
                background: #fff;
                overflow-y: auto;
                border: 1px solid #ddd;
            }

            .item-list li {
                padding: 2px 12px;
            }

            .item-list li:hover {
                background-color: #ccc;
            }

            .btn-label {
                margin-bottom: 10px;
            }

            .btn-more {
                margin-top: 10px;
            }

            .btn-more-a {
                position: relative;
                left: 50%;
                transform: translateX(-50%);
            }

            .btn-cus {
                border: 0;
                margin: 0;
                padding: 0;
            }

            .capital-pool-check {
                position: relative;
                top: 2px;
                left: 20px;
            }

            .a-block {
                display: block;
            }

            .ml {
                margin-left: 30px;
            }
        `
    ]
})
export class SupplierUnsignedContractComponent extends CommonPage implements OnInit {
    total = 0;
    pageSize = 10;
    first = 0;
    rows: any[] = [];
    words = '';

    sorting = ''; // 共享该变量
    naming = ''; // 共享该变量
    paging = 1; // 共享该变量
    heads: any[];
    searches: any[];
    shows: any[];
    base: CommBase;
    mainForm: FormGroup;
    arrObjs = {} as any; // 缓存后退的变量
    searchArr = [];

    refreshDataAfterAttachComponent = () => {
        this.onPage({page: this.paging, pageSize: this.pageSize});
    }

    constructor(
        public xn: XnService,
        public vcr: ViewContainerRef,
        public route: ActivatedRoute,
        private loading: LoadingService
    ) {
        super(PageTypes.List);
    }

    ngOnInit() {
        this.route.data.subscribe(superConfig => {
            this.base = new CommBase(this, superConfig);
            this.heads = CommUtils.getListFields(superConfig.fields);
            this.searches = CommUtils.getSearchFields(superConfig.fields);
            this.buildShow(this.searches);
            this.pageSize =
                (superConfig.list && superConfig.list.pageSize) ||
                this.pageSize;
            this.onPage({page: this.paging, pageSize: this.pageSize});
        });
        this.xn.msgBox.open(false, '仅雅居乐供应商需在此页面签署合同。');
    }

    public getList() {
        this.xn.loading.open();
        this.onPage({page: this.paging, pageSize: this.pageSize});
    }

    // 查看交易流程
    public viewProcess(item: any) {
        this.xn.router.navigate([`console/main-list/detail/${item}`]);
    }

    /**
     *  翻页
     * @param event
     */
    public onPage(event: { page: number; pageSize: number }): void {
        this.paging = event.page;
        this.pageSize = event.pageSize;

        // 后退按钮的处理
        this.onUrlData();

        const params = this.buildParams();
        const url = '/custom/vanke_v5/project/supplier_sign_list';
        this.xn.api.post(url, params)
            .subscribe(json => {
                this.total = json.data.count;
                this.rows = json.data.data.map(c => {
                    const invoiceArr = c.realInvoiceNum && c.realInvoiceNum !== '' ? JSON.parse(c.realInvoiceNum) : [];
                    c.invoiceNumLocal = '';
                    if (invoiceArr.length > 2) {
                        c.invoiceNumLocal = `${invoiceArr[0]};${invoiceArr[1]}等`;
                    } else {
                        invoiceArr.forEach(x => {
                            c.invoiceNumLocal += `${x};`;
                            c.invoiceNumLocal = c.invoiceNumLocal.replace(/;$/, '');
                        });
                    }
                    c.invoiceLength = invoiceArr.length;
                    return c;
                });
                this.xn.loading.close();
            });
    }

    /**
     *  查看所有发票
     * @param e
     */
    public viewAllInvoice(e) {
        XnModalUtils.openInViewContainer(
            this.xn,
            this.vcr,
            InvoiceDataViewModalComponent,
            JSON.parse(e.realInvoiceNum)
        ).subscribe(() => {
        });
    }

    /**
     *  列排序
     * @param sort
     */
    public onSort(sort: string): void {
        // 如果已经点击过了，就切换asc 和 desc
        if (this.sorting === sort) {
            this.naming = this.naming === 'desc' ? 'asc' : 'desc';
        } else {
            this.sorting = sort;
            this.naming = 'asc';
        }

        this.onPage({page: this.paging, pageSize: this.pageSize});
    }

    public onSortClass(checkerId: string): string {
        if (checkerId === this.sorting) {
            return 'sorting_' + this.naming;
        } else {
            return 'sorting';
        }
    }

    public onSearch(): void {
        this.onPage({page: this.paging, pageSize: this.pageSize});
    }

    public onCssClass(status) {
        return status === 1 ? 'active' : '';
    }

    /**
     *  清楚搜索值
     */

    public clearSearch() {
        for (const key in this.arrObjs) {
            if (this.arrObjs.hasOwnProperty(key)) {
                delete this.arrObjs[key];
            }
        }

        this.buildCondition(this.searches);
        this.onSearch(); // 清空之后自动调一次search
        this.paging = 1; // 回到第一页
    }

    /**
     *  供应商签署合同
     * @param item
     */
    public sign(item) {
        this.loading.open();
        this.xn.api.post('/custom/vanke_v5/project/supplier_sign_contracts',
            {mainFlowId: item.mainFlowId}).subscribe(json => {
            const contracts = json.data.contractList.map(c => {
                if (!('config' in c)) {
                    c.config = {text: ''};
                }
                if (c.label.includes('应收账款转让协议书')) {
                    c.config.text = '甲方（出让方）';
                } else if (c.label.includes('应收账款转让登记协议')) {
                    c.config.text = '甲方（电子签章、数字签名）';
                } else if (c.label.includes('应收账款转让合同')) {
                    c.config.text = '转让方（全称）';
                } else if (c.label.includes('确认函')) {
                    c.config.text = '确认方(公章)';
                } else if (c.label.includes('授权书')) {
                    c.config.text = '授权方/我司（公章）';
                } else {
                    c.config.text = '（盖章）';
                }
                return c;
            });
            XnModalUtils.openInViewContainer(this.xn, this.vcr, FinancingFactoringVankeModalComponent, contracts)
                .subscribe((x) => {
                    if (x === 'ok') {
                        this.loading.open();
                        this.xn.api.post('/custom/vanke_v5/project/update_supplier_contracts', {
                            mainFlowId: item.mainFlowId,
                            contracts: json.data.contracts
                        }).subscribe((v) => {
                            if (v.ret === 0) {
                                this.xn.msgBox.open(false, '已签署', () => {
                                    this.onPage({page: this.paging, pageSize: this.pageSize});
                                });
                            }
                        }, () => {
                        }, () => {
                            this.loading.close();
                        });
                    }
                });
        }, () => {
        }, () => {
            this.loading.close();
        });
    }

    private buildShow(searches) {
        this.shows = [];
        this.onUrlData();
        this.buildCondition(searches);
    }

    private buildCondition(searches) {
        const objList = [];
        for (let i = 0; i < searches.length; i++) {
            const obj = {} as any;
            obj.title = searches[i].title;
            obj.checkerId = searches[i].checkerId;
            obj.required = false;
            obj.type = searches[i].type;
            obj.number = searches[i].number;
            obj.options = {ref: searches[i].selectOptions};

            obj.value = this.arrObjs[searches[i].checkerId];

            objList.push(obj);
        }
        this.shows = $.extend(
            true,
            [],
            objList.sort(function(a, b) {
                return a.number - b.number;
            })
        ); // 深拷贝;
        XnFormUtils.buildSelectOptions(this.shows);
        this.buildChecker(this.shows);
        this.mainForm = XnFormUtils.buildFormGroup(this.shows);

        const forSearch = this.searches.map(v => v && v.checkerId);
        this.searchArr = $.extend(true, [], forSearch); // 深拷贝;

        this.mainForm.valueChanges.subscribe(v => {
            const arrObj = {} as any;
            for (const item in v) {
                if (v.hasOwnProperty(item) && v[item] !== '') {
                    const searchFilter = this.searches
                        .filter(vv => vv && vv.base === 'number')
                        .map(c => c.checkerId);
                    if (searchFilter.indexOf(item) >= 0) {
                        arrObj[item] = Number(v[item]);
                    } else {
                        arrObj[item] = v[item];
                    }
                }
            }
            this.arrObjs = $.extend(true, {}, arrObj); // 深拷贝;要进行搜索的变量
            this.onUrlData();
        });
    }

    private buildChecker(stepRows) {
        for (const row of stepRows) {
            XnFormUtils.convertChecker(row);
        }
    }

    /**
     *  构建请求参数
     */
    private buildParams() {
        // 分页处理
        const params: any = {
            start: (this.paging - 1) * this.pageSize,
            length: this.pageSize
        };

        // 搜索处理
        if (this.searches.length > 0) {
            if (!$.isEmptyObject(this.arrObjs)) {
                // 判断是否有缓存变量
            }

            for (const search of this.searches) {
                if (!XnUtils.isEmpty(this.arrObjs[search.checkerId])) {
                    params[search.checkerId] = this.arrObjs[search.checkerId];
                }
            }
        }
        return params;
    }


    /**
     * 回退操作
     * @param data
     */
    private onUrlData(data?) {
        const urlData = this.xn.user.getUrlData(this.xn.router.url);
        if (urlData && urlData.pop) {
            this.paging = urlData.data.paging || this.paging;
            this.sorting = urlData.data.sorting || this.sorting;
            this.naming = urlData.data.naming || this.naming;
            this.words = urlData.data.words || this.words;
            this.arrObjs = urlData.data.arrObjs || this.arrObjs;
        } else {
            this.xn.user.setUrlData(this.xn.router.url, {
                paging: this.paging,
                sorting: this.sorting,
                naming: this.naming,
                words: this.words,
                arrObjs: this.arrObjs
            });
        }
    }
}
