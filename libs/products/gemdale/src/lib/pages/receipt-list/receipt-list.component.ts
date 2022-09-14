import { Component, OnInit, ViewContainerRef } from '@angular/core';
import CommBase from 'libs/shared/src/lib/public/component/comm-base';
import { FormGroup } from '@angular/forms';
import { XnService } from 'libs/shared/src/lib/services/xn.service';
import { ActivatedRoute } from '@angular/router';
import { LoadingService } from 'libs/shared/src/lib/services/loading.service';
import { CommonPage, PageTypes } from 'libs/shared/src/lib/public/component/comm-page';
import CommUtils from 'libs/shared/src/lib/public/component/comm-utils';
import { XnUtils } from 'libs/shared/src/lib/common/xn-utils';
import { XnFormUtils } from 'libs/shared/src/lib/common/xn-form-utils';
import { XnModalUtils } from 'libs/shared/src/lib/common/xn-modal-utils';
import { PdfSignModalComponent } from 'libs/shared/src/lib/public/modal/pdf-sign-modal.component';
import { FinancingFactoringVankeModalComponent } from 'libs/shared/src/lib/public/modal/financing-factoring-vanke-modal.component';
import { map } from 'rxjs/operators';

@Component({
    selector: 'app-receipt-list',
    templateUrl: './receipt-list.component.html',
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
export class ReceiptListComponent extends CommonPage implements OnInit {
    total = 0;
    pageSize = 10;
    first = 0;
    rows: any[] = [];
    words = '';

    sorting = ''; // 共享该变量
    naming = ''; // 共享该变量
    paging = 0; // 共享该变量
    heads: any[];
    searches: any[];
    shows: any[];
    base: CommBase;
    mainForm: FormGroup;
    arrObjs = {} as any; // 缓存后退的变量
    searchArr = [];
    public allChecked = false; // 全选，取消全选
    listType: 0 | 1 = 0; // 0: 未签署，1：已签署

    refreshDataAfterAttachComponent = () => {
        this.onPage({ page: this.paging, pageSize: this.pageSize });
    }

    constructor(
        public xn: XnService,
        public vcr: ViewContainerRef,
        public route: ActivatedRoute,
        private loadingService: LoadingService
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
        this.listType = type;
        this.onPage({ page: this.paging, pageSize: this.pageSize });
    }

    // 查看交易流程
    public viewProcess(item: any) {
        this.xn.router.navigate([`console/main-list/detail/${item}`]);
    }

    // 生成通知书(type - 1: 致总部公司通知书, 2: 致项目公司通知书, 3: 总部公司回执, 4: 项目公司回执)
    public generate(type) {
        if (!this.rows || this.rows.length === 0) {
            this.xn.msgBox.open(false, '资产池内没有数据，不能执行此操作！');
            return;
        }

        const selectedRows = this.rows.filter(
            (x: any) => x.checked && x.checked === true
        );
        // 致项目公司通知书、项目公司回执只给选择的行生成
        const rows = type !== 1 ? selectedRows : this.rows;
        if (!rows || rows.length === 0) {
            this.xn.msgBox.open(false, '没有选择数据，不能执行此操作！');
            return;
        }
        const params = {
            list: rows.map(r => {
                return {
                    mainFlowId: r.mainFlowId,
                    capitalPoolId: r.capitalPoolId
                };
            })
        };
        this.loadingService.open();
        this.xn.api
            .post(`/llz/capital_list/capital0${type}`, params)
            .pipe(
                map(con => {
                    const contractList =
                        con.data.contractList || con.data.list[0].contractList;
                    const result = JSON.parse(JSON.stringify(contractList));
                    result.isProxy = 14;
                    const postInfo = con.data;                           // 直接作为更新合同的post 参数
                    if (result.length) {
                        result.forEach(tracts => {
                            tracts.config = {} as any;
                        });
                        result.forEach(text => {
                            text.config.text = '（盖章）';
                        });
                        XnModalUtils.openInViewContainer(
                            this.xn,
                            this.vcr,
                            FinancingFactoringVankeModalComponent,
                            result
                        ).subscribe(x => {
                            // 生成总部/项目通知书之后，更新添加到库
                            if (x === 'ok') {
                                const temp = {
                                    contractList,
                                    mainIdList: rows.map(r => r.mainFlowId)
                                };
                                const p = postInfo;
                                this.xn.api
                                    .post(
                                        `/llz/capital_list/update_capital0${type}`,
                                        p
                                    )
                                    .subscribe(() => {
                                        this.loadingService.close();
                                        this.onPage({
                                            page: this.paging,
                                            pageSize: this.pageSize
                                        });
                                    });
                            }
                        });
                    }
                })
            )
            .subscribe();
    }

    public getLabel(input): string {
        return input
            ? typeof input === 'string'
                ? JSON.parse(input)[0].label
                : input.label
            : '';
    }

    public viewConstracts(row) {
        const params = typeof row === 'string' ? JSON.parse(row)[0] : row;

        params.readonly = true;
        XnModalUtils.openInViewContainer(
            this.xn,
            this.vcr,
            PdfSignModalComponent,
            params
        ).subscribe(x => {
            // do nothing
        });
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

    private buildChecker(stepRows) {
        for (const row of stepRows) {
            XnFormUtils.convertChecker(row);
        }
    }

    // 回退操作
    onUrlData(data?) {
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

    onPage(event: { page: number; pageSize: number }): void {
        this.paging = event.page;
        this.pageSize = event.pageSize;

        // 后退按钮的处理
        this.onUrlData();

        const params = this.buildParams();
        this.base.onList(params);
    }

    buildParams() {
        // 分页处理
        const params: any = {
            start: (this.paging - 1) * this.pageSize,
            length: this.pageSize,
            flag: this.listType,
        };
        // 排序处理
        if (this.sorting && this.naming) {
            params.order = [this.sorting + ' ' + this.naming];
        }
        // 搜索处理
        if (this.searches.length > 0) {
            if (!$.isEmptyObject(this.arrObjs)) {
                // 如果参数已存在where属性，不重新添加新属性
                if (!params.where) {
                    params.where = {
                        _complex: {
                            _logic: 'AND' // 搜索时是AND查询
                        }
                    };
                }
            }

            for (const search of this.searches) {
                if (!XnUtils.isEmpty(this.arrObjs[search.checkerId])) {
                    if (search.type && search.type === 'select') {
                        params.where._complex[search.checkerId] = this.arrObjs[search.checkerId];
                    } else {
                        params.where._complex[search.checkerId] = ['like', `%${this.arrObjs[search.checkerId]}%`];
                    }
                }
            }
        }
        console.log(params);
        return params;
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
        return type === 'money' ? 'text-right' : '';
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

    // 全选，取消全选
    public handleAllSelect() {
        this.allChecked = !this.allChecked;
        if (this.allChecked) {
            this.rows.map(item => (item.checked = true));
        } else {
            this.rows.map(item => (item.checked = false));
        }
    }

    // 选择框改变
    public inputChange(val: any, index: number) {
        if (val.checked && val.checked === true) {
            val.checked = false;
        } else {
            val.checked = true;
        }
        // 当数组中不具有clicked 且为false。没有找到则表示全选中。
        const find = this.rows.find(
            (x: any) => x.checked === undefined || x.checked === false
        );
        if (!find) {
            this.allChecked = true;
        } else {
            this.allChecked = false;
        }
    }
}
