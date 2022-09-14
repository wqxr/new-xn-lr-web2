import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { FormGroup } from '@angular/forms';

import { ActivatedRoute } from '@angular/router';


import { CommonPage, PageTypes } from 'libs/shared/src/lib/public/component/comm-page';
import { XnService } from 'libs/shared/src/lib/services/xn.service';
import CommUtils from 'libs/shared/src/lib/public/component/comm-utils';
import { XnFormUtils } from 'libs/shared/src/lib/common/xn-form-utils';
import { XnModalUtils } from 'libs/shared/src/lib/common/xn-modal-utils';
import { XnUtils } from 'libs/shared/src/lib/common/xn-utils';
import { DragonMfilesViewModalComponent } from 'libs/shared/src/lib/public/dragon-vanke/modal/mfiles-view-modal.component';
import { DragonInvoiceDataViewModalComponent } from 'libs/shared/src/lib/public/dragon-vanke/modal/invoice-data-view-modal.component';
import { EditModalComponent } from 'libs/shared/src/lib/public/dragon-vanke/modal/edit-modal.component';
import CommBase from '../comm-base';
import { HwModeService } from 'libs/shared/src/lib/services/hw-mode.service';
import { JsonTransForm } from 'libs/shared/src/lib/public/pipe/xn-json.pipe';
import { DragonPdfSignModalComponent } from 'libs/shared/src/lib/public/dragon-vanke/modal/pdf-sign-modal.component';
import { DragonFinancingContractModalComponent } from 'libs/shared/src/lib/public/dragon-vanke/modal/dragon-asign-contract.modal';
declare const $: any;

@Component({
    selector: 'app-additional-materials',
    templateUrl: './factor-sign-contract.component.html',
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
export class DragonFactorSignComponent extends CommonPage implements OnInit {
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
    selectedItems: any[] = []; // 选中的项
    arrObjs = {} as any; // 缓存后退的变量
    searchArr = [];
    listType: 0 | 1 = 0; // 0: 待补充信息，1：已补充信息
    public formModule = 'dragon-input';

    refreshDataAfterAttachComponent = () => {
        this.onPage({ page: this.paging, pageSize: this.pageSize });
    }

    constructor(
        public xn: XnService,
        public vcr: ViewContainerRef,
        public route: ActivatedRoute,
        public hwModeService: HwModeService
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
            this.onPage({ page: this.paging, pageSize: this.pageSize });
        });
    }

    getList(type: 0 | 1) {
        this.xn.loading.open();
        this.listType = type;
        this.onPage({ page: this.paging, pageSize: this.pageSize });
    }



    buildShow(searches) {
        this.shows = [];
        this.onUrlData();
        this.buildCondition(searches);
    }

    buildCondition(searches) {
        const objList = [];
        for (let i = 0; i < searches.length; i++) {
            const obj = {} as any;
            obj.title = searches[i].title;
            obj.checkerId = searches[i].checkerId;
            obj.required = false;
            obj.type = searches[i].type;
            obj.number = searches[i].number;
            obj.options = { ref: searches[i].selectOptions };

            obj.value = this.arrObjs[searches[i].checkerId];

            objList.push(obj);
        }
        this.shows = $.extend(
            true,
            [],
            objList.sort(function (a, b) {
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

    viewFiles(item) {
        XnModalUtils.openInViewContainer(this.xn, this.vcr, DragonMfilesViewModalComponent, [item]).subscribe(() => {
        });
    }

    // 判断数组
    arrayLength(value: any) {
        if (!value) {
            return false;
        }
        const obj =
            typeof value === 'string'
                ? JSON.parse(value)
                : JSON.parse(JSON.stringify(value));
        return !!obj && obj.length > 2;
    }

    // 查看更多发票
    viewMore(item) {
        if (typeof item === 'string') {
            item = JSON.parse(item);
        }
        XnModalUtils.openInViewContainer(
            this.xn,
            this.vcr,
            DragonInvoiceDataViewModalComponent,
            item
        ).subscribe(() => {
        });
    }
    /**
     *  查看合同，只读
     * @param con
     */
    public showContract(con) {
        const params = Object.assign({}, con, { readonly: true });
        XnModalUtils.openInViewContainer(this.xn, this.vcr, DragonPdfSignModalComponent, params).subscribe(() => {
        });
    }
    // 签署保理商合同
    signContract() {
        this.xn.dragon.post('/factoring_sign/signContracts', { mainFlowIds: this.selectedItems.map((x: any) => x.mainFlowId) }).subscribe(con => {
            const cons = con.data;
            cons.isProxy = 52;
            cons.forEach(element => {
                if (!element.config) {
                    element.config = {
                        text: ''
                    };
                }
            });
            cons.forEach(x => {
                if (x.label === '应收账款转让协议之补充协议') {
                    x.config.text = '代理人（盖章）';
                } else {
                    x.config.text = '（盖章）';
                }
            });
            XnModalUtils.openInViewContainer(this.xn, this.vcr, DragonFinancingContractModalComponent, cons).subscribe(x => {
                if (x === 'ok') {
                    // 保存合同信息
                    this.xn.dragon.post('/factoring_sign/saveContracts',
                        { contracts: con.data, recordIds: this.selectedItems.map((x: any) => x.recordId) })
                        .subscribe((temp: any) => {
                            if (temp.ret === 0) {
                                this.selectedItems = [];
                                this.onPage({ page: this.paging, pageSize: this.pageSize });
                            }

                        });
                }
            });
        });
    }
    onPage(event: { page: number; pageSize: number }): void {
        this.paging = event.page;
        this.pageSize = event.pageSize;
        // 后退按钮的处理
        this.onUrlData();
        const params = this.buildParams();
        params.isLgBoShi = 1; // 0=非龙光博时资本 1=龙光博时资本
        this.xn.dragon.post('/factoring_sign/signList', params)
            .subscribe(json => {
                this.total = json.data.count;
                this.rows = json.data.data;
                this.xn.loading.close();
            });
    }
    /**
     *  判断数据类型
     * @param value
     */
    public judgeDataType(value: any): boolean {
        if (typeof Array.isArray === 'function') {
            return Array.isArray(value);
        } else {
            return Object.prototype.toString.call(value) === '[object Array]';
        }
    }
    /**
   *  格式化数据
   * @param data
   */
    public jsonTransForm(data) {
        return JsonTransForm(data);
    }

    onSort(sort: string): void {
        // 如果已经点击过了，就切换asc 和 desc
        if (this.sorting === sort) {
            this.naming = this.naming === 'desc' ? 'asc' : 'desc';
        } else {
            this.sorting = sort;
            this.naming = 'asc';
        }

        this.onPage({ page: this.paging, pageSize: this.pageSize });
    }

    onSortClass(checkerId: string): string {
        if (checkerId === this.sorting) {
            return 'sorting_' + this.naming;
        } else {
            return 'sorting';
        }
    }

    onTextClass(type) {
        // return type === 'money' ? 'text-right' : '';
    }

    onSearch(): void {
        this.onPage({ page: this.paging, pageSize: this.pageSize });
    }

    onCssClass(status) {
        return status === 1 ? 'active' : '';
    }

    clearSearch() {
        for (const key in this.arrObjs) {
            if (this.arrObjs.hasOwnProperty(key)) {
                delete this.arrObjs[key];
            }
        }

        this.buildCondition(this.searches);
        this.onSearch(); // 清空之后自动调一次search
        this.paging = 1; // 回到第一页
    }




    private buildChecker(stepRows) {
        for (const row of stepRows) {
            XnFormUtils.convertChecker(row);
        }
    }

    /**
     *  构建参数
     */
    private buildParams() {
        // 分页处理
        const params: any = {
            start: (this.paging - 1) * this.pageSize,
            length: this.pageSize
        };
        if (!this.listType) {
            params.hasSign = 0;
        } else {
            params.hasSign = 1;
        }

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
  *  判读列表项是否全部选中
  */
    public isAllChecked(): boolean {
        return !(this.rows.some(x => !x.checked || x.checked && x.checked === false) || this.rows.length === 0);
    }
    /**
      *  全选
      */
    public checkAll() {
        if (!this.isAllChecked()) {
            this.rows.forEach(item => item.checked = true);
            this.selectedItems = XnUtils.distinctArray2([...this.selectedItems, ...this.rows], 'mainFlowId');
        } else {
            this.rows.forEach(item => item.checked = false);
            this.selectedItems = [];
        }
    }
    /**
     * 单选
     * @param paramItem
     * @param index
     */
    public singleChecked(paramItem, index) {
        if (paramItem.checked && paramItem.checked === true) {
            paramItem.checked = false;
            this.selectedItems = this.selectedItems.filter((x: any) => x.mainFlowId !== paramItem.mainFlowId);
        } else {
            paramItem.checked = true;
            this.selectedItems.push(paramItem);
            this.selectedItems = XnUtils.distinctArray2(this.selectedItems, 'mainFlowId'); // 去除相同的项
        }

    }

    // 回退操作
    private onUrlData(data?) {
        const urlData = this.xn.user.getUrlData(this.xn.router.url);
        if (urlData && urlData.pop) {
            this.paging = urlData.data.paging || this.paging;
            this.sorting = urlData.data.sorting || this.sorting;
            this.naming = urlData.data.naming || this.naming;
            this.listType = urlData.data.listType || this.listType;
            this.words = urlData.data.words || this.words;
            this.arrObjs = urlData.data.arrObjs || this.arrObjs;
        } else {
            this.xn.user.setUrlData(this.xn.router.url, {
                paging: this.paging,
                sorting: this.sorting,
                naming: this.naming,
                words: this.words,
                arrObjs: this.arrObjs,
                listType: this.listType
            });
        }
    }
}
