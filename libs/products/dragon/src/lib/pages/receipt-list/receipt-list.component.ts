import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { map } from 'rxjs/operators';
import { CommonPage, PageTypes } from 'libs/shared/src/lib/public/component/comm-page';
import CommBase from '../comm-base';
import { FormGroup } from '@angular/forms';
import { XnService } from 'libs/shared/src/lib/services/xn.service';
import { ActivatedRoute } from '@angular/router';
import { LoadingService } from 'libs/shared/src/lib/services/loading.service';
import CommUtils from 'libs/shared/src/lib/public/component/comm-utils';
import { XnModalUtils } from 'libs/shared/src/lib/common/xn-modal-utils';
import { XnFormUtils } from 'libs/shared/src/lib/common/xn-form-utils';
import { XnUtils } from 'libs/shared/src/lib/common/xn-utils';
import { DragonPdfSignModalComponent } from 'libs/shared/src/lib/public/dragon-vanke/modal/pdf-sign-modal.component';
import { ReceiptSignReturnModalComponent } from 'libs/shared/src/lib/public/dragon-vanke/modal/receipt-sign-return-modal.component';
import { DragonFinancingContractModalComponent } from 'libs/shared/src/lib/public/dragon-vanke/modal/dragon-asign-contract.modal';
import { applyFactoringTtype } from 'libs/shared/src/lib/config/select-options';

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
    paging = 1; // 共享该变量
    heads: any[];
    searches: any[];
    shows: any[];
    base: CommBase;
    mainForm: FormGroup;
    arr = {} as any; // 缓存后退的变量
    searchArr = [];
    public allChecked = false; // 全选，取消全选
    listType = 1; // 0: 未签署，1：已签署
    // 复核角色
    public isReviewer = false;

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
        this.isReviewer = this.xn.user.roles.includes('reviewer');
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

    getList(type: number) {
        this.listType = type;
        this.onPage({ page: this.paging, pageSize: this.pageSize });
    }

    // 查看交易流程
    public viewProcess(item: any) {
        this.xn.router.navigate([`logan/main-list/detail/${item}`]);
    }
    /**
        * 是否已审核通过
        */
    public isAudited(item) {
        if (this.listType === 1) {
            return item.signCheckPerson;
        } else if (this.listType === 3) {
            return item.signCheckPersonTwo;
        } else if (this.listType === 5) {
            return item.signCheckPersonAdd;
        }

    }

    public audit(items?) {
        const selectedRows = items
            ? [items]
            : this.rows.filter(
                (x: any) => x.checked && x.checked === true && !this.isAudited(x)
            );

        if (!selectedRows || selectedRows.length === 0) {
            this.xn.msgBox.open(false, '没有需要审核通过的数据或者该数据已审核通过，不能执行此操作！');
            return;
        }

        const params = {
            mainFlowIds: selectedRows.map(r => r.mainFlowId),
            hasSign: this.listType
        };
        this.loadingService.open();
        this.xn.api.dragon
            .post(`/project_add_file/signPass`, params)
            .subscribe(() => {
                this.onPage({ page: this.paging, pageSize: this.pageSize });
                this.loadingService.close();
            });
    }

    public getLabel(input): string {
        return input
            ? typeof input === 'string'
                ? Object.prototype.toString.call(JSON.parse(input)) == '[object Object]'
                    ? JSON.parse(input).label : JSON.parse(input)[0].label
                : input.label
            : '';
    }

    public viewContracts(row) {
        const params = typeof row === 'string' ? JSON.parse(row)[0] : row;

        params.readonly = true;
        XnModalUtils.openInViewContainer(
            this.xn,
            this.vcr,
            DragonPdfSignModalComponent,
            params
        ).subscribe(() => {
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

            obj.value = this.arr[searches[i].checkerId];

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
            this.arr = $.extend(true, {}, arrObj); // 深拷贝;要进行搜索的变量
            this.onUrlData();
        });
    }

    private buildChecker(stepRows) {
        for (const row of stepRows) {
            XnFormUtils.convertChecker(row);
        }
    }

    // 回退操作
    onUrlData() {
        const urlData = this.xn.user.getUrlData(this.xn.router.url);
        if (urlData && urlData.pop) {
            this.paging = urlData.data.paging || this.paging;
            this.sorting = urlData.data.sorting || this.sorting;
            this.naming = urlData.data.naming || this.naming;
            this.words = urlData.data.words || this.words;
            this.arr = urlData.data.arrObjs || this.arr;
        } else {
            this.xn.user.setUrlData(this.xn.router.url, {
                paging: this.paging,
                sorting: this.sorting,
                naming: this.naming,
                words: this.words,
                arrObjs: this.arr
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
            hasSign: this.listType,
        };

        // 排序处理
        // if (this.sorting && this.naming) {
        //     params.order = [this.sorting + ' ' + this.naming];
        // }

        // 搜索处理
        this.searches
            .filter(x => !XnUtils.isEmpty(this.arr[x.checkerId]))
            .forEach(search => {
                if (search.checkerId === 'receive' || search.checkerId === 'changePrice') {
                    params[search.checkerId] = String(this.arr[search.checkerId]).replace(/\,/g, '');
                } else {
                    params[search.checkerId] = this.arr[search.checkerId];
                }
            });
        params.factoringAppId = applyFactoringTtype.深圳市柏霖汇商业保理有限公司;
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
        for (const key in this.arr) {
            if (this.arr.hasOwnProperty(key)) {
                delete this.arr[key];
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
    public inputChange(val: any) {
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



    /**
     * 退回
     */
    public signReturn(item) {
        XnModalUtils.openInViewContainer(
            this.xn,
            this.vcr,
            ReceiptSignReturnModalComponent,
            { hasSign: this.listType, }
        ).subscribe(x => {
            if (x === '') {

            } else {
                const params = {
                    mainFlowId: item.mainFlowId,
                    returnReason: x,
                };
                this.loadingService.open();
                this.xn.api.dragon.post('/project_add_file/signReturn', params)
                    .subscribe(() => {
                        this.onPage({ page: this.paging, pageSize: this.pageSize });
                        this.loadingService.close();
                    });
            }

        });
    }

    /**
     * 签署
     */
    public signContracts() {
        // console.info('this.rows')
        // if (this.rows.length === 0) {
        //     this.xn.msgBox.open(false, '没有需要签署的数据，不能执行此操作！');
        //     return;
        // }
        const rows = this.rows.filter((x: any) => x.checked && x.checked === true);

        if (rows.length === 0) {
            this.xn.msgBox.open(false, '没有需要签署的数据，不能执行此操作！');
            return;
        }
        const selectedRows = rows.filter(x => this.isAudited(x));

        if (!selectedRows || selectedRows.length === 0) {
            this.xn.msgBox.open(false, '数据审核不通过，不能执行此操作！');
            return;
        }

        const params = {
            mainFlowIds: selectedRows.map(r => r.mainFlowId)
        };
        this.xn.api.dragon.post('/project_add_file/signContracts', params)
            .pipe(
                map(con => {
                    this.xn.loading.close();
                    const contracts = con.data.contracts;
                    const result = JSON.parse(JSON.stringify(contracts));
                    result.isProxy = 52;
                    if (result.length) {
                        result.forEach(tracts => {
                            if(tracts.label.includes('债权转让及账户变更通知的补充说明【直接债务人模板】')){
                                tracts.config = { text: '(盖章)' };
                            }else if (tracts.label.includes('债权转让及账户变更通知的补充说明')) {
                                tracts.config = { text: '【项目公司】(盖章)' };
                            } else {
                                tracts.config = { text: '（盖章）' };

                            }
                        });
                        XnModalUtils.openInViewContainer(
                            this.xn,
                            this.vcr,
                            DragonFinancingContractModalComponent,
                            result
                        ).subscribe((x) => {
                            if (x.action && x.action === 'cancel') {

                            } else {
                                this.xn.api.dragon.post('/project_add_file/updateContracts', {
                                    contracts
                                }).subscribe(() => {
                                    this.onPage({ page: this.paging, pageSize: this.pageSize });
                                });
                            }
                        });
                    } else {
                        this.xn.msgBox.open(false, '没有需要签署的合同，不能执行此操作！');
                    }
                })
            ).subscribe();
    }

    againSignCons(paramCons: any): void {
        const contract = JSON.parse(paramCons);
        contract.isProxy = 52;
        if (contract.length === 0) {
            return this.xn.msgBox.open(false, '未找到需要补充签署的合同');
        }
        //  contract = contract.filter((x: any) => x.label.includes('国内无追索权商业保理合同'));

        contract.forEach(tracts => {
            if (tracts.label.includes('债权转让及账户变更通知的补充说明')) {
                tracts.config = { text: '【项目公司】(盖章)' };
            } else {
                tracts.config = { text: '（盖章）' };

            }
        });
        XnModalUtils.openInViewContainer(this.xn, this.vcr, DragonFinancingContractModalComponent, contract)
            .subscribe(() => {
            });

    }
    isreSign(mainFlowId: string) {
        return (mainFlowId === 'contract_20200312_31706_lg' || mainFlowId === 'contract_20200311_31550_lg' || mainFlowId === 'contract_20200308_31509_lg'
            || mainFlowId === 'contract_20200308_31521_lg' || mainFlowId === 'contract_20200308_31496_lg') && this.listType === 4;
    }
}
