/*
 * Copyright(c) 2017-2019, 深圳市链融科技股份有限公司
 * Beijing Xiwei Technology Co., Ltd.
 * All rights reserved.
 *
 * @file：CountryGradenAvengerListComponent
 * @summary：碧桂园审批放款列表
 * @version: 1.0
 * **********************************************************************
 * revision             author            reason             date
 * 1.0                 hucongying      碧桂园数据对接      2020-11-02
 * **********************************************************************
 */

import { Component, OnInit, ViewContainerRef, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { XnService } from 'libs/shared/src/lib/services/xn.service';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { XnUtils } from 'libs/shared/src/lib/common/xn-utils';
import { XnModalUtils } from 'libs/shared/src/lib/common/xn-modal-utils';
import { PdfSignModalComponent } from 'libs/shared/src/lib/public/modal/pdf-sign-modal.component';
import { InvoiceDataViewModalComponent } from 'libs/shared/src/lib/public/modal/invoice-data-view-modal.component';
import { XnFormUtils } from 'libs/shared/src/lib/common/xn-form-utils';
import { JsonTransForm } from 'libs/shared/src/lib/public/pipe/xn-json.pipe';
import { HwModeService } from 'libs/shared/src/lib/services/hw-mode.service';
import { FileViewModalComponent } from 'libs/shared/src/lib/public/modal/file-view-modal.component';
import { ButtonConfigModel, SubTabListOutputModel, TabConfigModel, TabListOutputModel } from 'libs/shared/src/lib/config/list-config-model';
import { CheckersOutputModel } from 'libs/shared/src/lib/config/checkers';
import { ApiProxyEnum, SubTabEnum, } from './index-tab.config';
import CommBase from 'libs/shared/src/lib/public/component/comm-base';
import { EditParamInputModel } from 'libs/shared/src/lib/public/avenger/modal/edit-modal.component';
import { LocalStorageService } from 'libs/shared/src/lib/services/local-storage.service';
import CommUtils from 'libs/shared/src/lib/public/component/comm-utils';
import { AvengerFinancingContractModalComponent } from 'libs/shared/src/lib/public/avenger/modal/avenger-asign-contract.modal';
import { AvengerPdfSignModalComponent } from 'libs/shared/src/lib/public/avenger/modal/pdf-sign-modal.component';
import { AvengerapprovalfreeStyleComponent } from 'libs/shared/src/lib/public/avenger/modal/avenger-approval-freeStyle.modal';
import { AvengerChangeAccountComponent } from 'libs/shared/src/lib/public/avenger/modal/avenger-approval-changeAccount.modal';
import { AvengerResultCompareComponent } from 'libs/shared/src/lib/public/avenger/modal/avenger-approval-resultCompare.modal';
import { AvengerExportListModalComponent } from 'libs/shared/src/lib/public/avenger/modal/export-list-modal.component';
import * as _ from 'lodash';
import { SignContractsModalComponent } from 'libs/shared/src/lib/public/form/bank/sign-contracts-modal.component';
import { AvengerIrecordComponent } from 'libs/shared/src/lib/public/avenger/modal/avenger-irecordInfo.modal';
import { DragonFinancingContractModalComponent } from 'libs/shared/src/lib/public/dragon-vanke/modal/dragon-asign-contract.modal';
import { DragonPdfSignModalComponent } from 'libs/shared/src/lib/public/dragon-vanke/modal/pdf-sign-modal.component';
import { AvengerMfilesViewModalComponent } from 'libs/shared/src/lib/public/avenger/modal/mfiles-view-modal.component';
import { DragonMfilesViewModalComponent } from 'libs/shared/src/lib/public/dragon-vanke/modal/mfiles-view-modal.component';
import { LoadingPercentNewService } from 'libs/shared/src/lib/services/loading-percent-new.service';
import { Subscription } from 'rxjs';
import { HeadquartersTypeEnum } from 'libs/shared/src/lib/config/select-options';
import { EditModalComponent } from 'libs/products/avenger/src/lib/shared/components/modal/edit-modal.component';
import { IsCashierType } from 'libs/shared/src/lib/config/enum/common-enum';
declare const moment: any;
declare const $: any;

@Component({
    templateUrl: `./avenger-list.component.html`,
    styles: [`
        .item-box {
            position: relative;
            display: flex;
            margin-bottom: 10px;
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
            width: 100%
        }

        .operate-btn {
            min-width: 90px;
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

        ul.sub-ul {
            margin-bottom: 5px;
            border-bottom: 1px solid #3c8dbc;
        }

        ul.sub-ul > li > a {
            padding: 5px 35px;
            border-top: none;
            background-color: #F2F2F2;
        }

        ul.sub-ul > li.active > a {
            background-color: #3c8dbc;
        }
    `]
})
export class CountryGradenAvengerListComponent implements OnInit {
    @Input() superConfig?: any;
    private arrObjs = {} as any; // 缓存后退的变量
    private paging = 0; // 共享该变量
    private beginTime: any;
    private endTime: any;
    private timeId = [];
    private nowTimeCheckId = '';
    private preChangeTime: any[] = []; // 上次搜索时间段,解决默认时间段搜索请求两次
    private sorting = ''; // 共享该变量 列排序
    private naming = ''; // 共享该变量 列css样式
    private subTabEnum = SubTabEnum; // 子标签参数映射枚举
    private apiProxyEnum = ApiProxyEnum; // 不同业务不同系统
    private searches: CheckersOutputModel[] = []; // 面板搜索配置项暂存
    public tabConfig: TabConfigModel = new TabConfigModel(); // 当前列表配置
    public currentTab: TabListOutputModel = new TabListOutputModel(); // 当前标签页
    public currentSubTab: SubTabListOutputModel = new SubTabListOutputModel(); // 当前子标签页
    public defaultValue = 'A';  // 默认激活第一个标签页
    public subDefaultValue = 'DOING'; // 默认子标签页
    public listInfo: any[] = []; // 数据
    public pageConfig = { pageSize: 10, first: 0, total: 0 }; // 页码配置
    public shows: CheckersOutputModel[] = []; // 搜索项
    public searchForm: FormGroup; // 搜索表单组
    public selectedItems: any[] = []; // 选中的项
    public selectedReceivables = 0; // 所选交易的应收账款金额汇总
    public selectedPayableAmounts = 0; // 所选交易的转让价款汇总
    public allReceivables = 0; // 所有交易的应收账款金额汇总
    public allPayableAmounts = 0; // 所有交易的转让价款汇总
    public completedCount = 0;
    public unfinishedCount = 0;
    public total = 0;
    formModule = 'dragon-input';
    modal: any;
    viewModal: any;
    base: CommBase;
    loanDate: string;
    approvalMemo: string;
    valueDate: string;
    is_jindie = -1;
    businessinvoice = false;
    isFirst = false;
    heads: any[];
    pageNum = [5, 10, 20, 30, 50, 100];
    currentParams: any;
    isshow = false;
    watchApproval_msg = '';
    pushApproval_msg = '';
    rooterChange: Subscription;
    timed: any;
    timedpush: any;
    public shieldArray = ['approval_ok', 'approval_reject', 'loan_ok', 'loan_fail', 'finance_approval_ok', 'finance_approval_fail'];
    public params = {
        mainFlowId: '',
        headquarters: '',
        pdfProjectFiles: '',
        payCompareStatus: '',
        stopStatus: '',
        changeStatus: '',
        isSupplierSign: '',
        valueDate: '',
    };
    constructor(private xn: XnService,
        private vcr: ViewContainerRef,
        private router: ActivatedRoute,
        private routers: Router,
        public hwModeService: HwModeService,
        public localStorageService: LocalStorageService,
        private loading: LoadingPercentNewService,
    ) {
    }

    ngOnInit(): void {

        this.router.data.subscribe((res: TabConfigModel) => {
            this.tabConfig = res;
            this.initData(this.defaultValue, true);
        });
    }

    /**
     *  标签页，加载列表信息
     * @param paramTabValue
     * @param init 是否为初始加载，true 不检查切换属性值与当前标签值
    */
    public initData(paramTabValue: string, init?: boolean,) {
        this.businessinvoice = paramTabValue === 'E' ? true : false; // 商票匹配

        if (this.defaultValue === paramTabValue && !init) {
            return;
        } else { // 重置全局变量
            this.selectedItems = [];
            this.selectedReceivables = 0;
            this.selectedPayableAmounts = 0;
            this.listInfo = [];
            this.allReceivables = 0;
            this.allPayableAmounts = 0;
            this.naming = '';
            this.sorting = '';
            this.paging = 1;
            for (const key in this.arrObjs) {
                if (this.arrObjs.hasOwnProperty(key)) {
                    delete this.arrObjs[key];
                }
            }
            this.buildCondition(this.searches);
            this.pageConfig = { pageSize: 10, first: 0, total: 0 };
        }
        this.defaultValue = paramTabValue;
        if (this.tabConfig.title.includes('审批放款-碧桂园') && (this.defaultValue === 'A' || this.defaultValue === 'C')) {
            this.xn.api.post('/tool/is_jindie', {}).subscribe(x => {
                if (x.data) {
                    this.is_jindie = x.data.isOpen;
                    if (this.is_jindie === 1) {
                        this.tabConfig.title = '审批放款-碧桂园(已开启金蝶云审批)';
                    } else {
                        this.tabConfig.title = '审批放款-碧桂园(线下人工审批)';
                    }
                }
            });
        }
        this.subDefaultValue = 'DOING'; // 重置子标签默认
        if (this.defaultValue === 'C' && this.tabConfig.title.includes('审批放款-碧桂园') && !!!init) {
            this.pushApproval(1);
        } else if (this.defaultValue === 'A' && this.tabConfig.title.includes('审批放款-碧桂园')) {
            this.watchApproval(1);
        } else {
        }
        this.onPage({ page: this.paging });
    }


    /**
     *  子标签tab切换，加载列表
     * @param paramSubTabValue
     */
    public handleSubTabChange(paramSubTabValue: string) {

        if (this.subDefaultValue === paramSubTabValue) {
            return;
        } else if (paramSubTabValue === 'SPECIAL') {
            this.cancelSpecial(paramSubTabValue);
            return;
        } else {
            this.selectedItems = [];
            this.selectedReceivables = 0;
            this.selectedPayableAmounts = 0;
            this.listInfo = [];
            this.allReceivables = 0;
            this.allPayableAmounts = 0;
            this.naming = '';
            this.sorting = '';
            this.paging = 1;
            this.pageConfig = { pageSize: 10, first: 0, total: 0 };
            // 重置全局变量
        }

        this.subDefaultValue = paramSubTabValue;
        this.onPage({ page: this.paging }, 5);



    }

    /**
     * @param e  page: 新页码、 pageSize: 页面显示行数、first: 新页面之前的总行数、pageCount : 页码总数
     * @summary 采购融资，地产abs  请求api有区别，采购融资：avenger 、地产abs：api
     */
    public onPage(e?: { page: number, first?: number, pageSize?: number, pageCount?: number }, types?: number) {
        if (this.tabConfig.title.includes('审批放款-碧桂园') && this.defaultValue === 'A') {
            this.pageNum = [5, 10, 20, 30, 50, 100, 500, 1000];
        } else {
            this.pageNum = [5, 10, 20, 30, 50, 100];
        }
        this.paging = e.page || 1;
        this.pageConfig = Object.assign({}, this.pageConfig, e);

        this.onUrlData(); // 导航回退取值
        if (this.subDefaultValue === 'SPECIAL') {
            this.cancelSpecial(this.subDefaultValue);
            return;
        }
        this.businessinvoice = this.defaultValue === 'E' ? true : false; // 商票匹配
        // 页面配置
        const find = this.tabConfig.tabList.find(tab => tab.value === this.defaultValue);
        this.currentTab = !!find ? find : new TabListOutputModel();
        // 子页面配置
        const subFind = this.currentTab.subTabList.find(sub => sub.value === this.subDefaultValue);
        this.currentSubTab = !!subFind ? subFind : new SubTabListOutputModel();
        this.heads = CommUtils.getListFields(this.currentSubTab.headText);
        this.searches = this.currentSubTab.searches; // 当前标签页的搜索项
        this.buildShow(this.searches);

        // 构建参数
        const params = this.buildParams(this.currentTab.params);
        this.currentParams = params;
        if (this.currentTab.post_url === '') {
            // 固定值
            this.listInfo = [];
            this.pageConfig.total = 0;
            return;
        }
        this.selectedItems = [];
        this.selectedReceivables = 0;
        this.selectedPayableAmounts = 0;
        // 采购融资 ：avenger,  地产abs ：api
        this.getList(this.currentParams);




    }
    getList(params: any) {
        this.xn.loading.open();
        this.xn[this.apiProxyEnum[this.defaultValue]].post(this.currentTab.post_url, params).subscribe(x => {
            if (x.data && x.data.data && x.data.data.length) {
                this.listInfo = x.data.data;
                this.selectedItems = [];
                this.allReceivables = x.data.receivable ? x.data.receivable : 0;
                this.allPayableAmounts = x.data.changePrice ? x.data.changePrice : 0;
                if (x.data.recordsTotal === undefined) {
                    this.pageConfig.total = x.data.count;
                } else {
                    this.pageConfig.total = x.data.recordsTotal;
                }
            } else if (x.data && x.data.lists && x.data.lists.length) {
                this.selectedItems = [];
                this.listInfo = x.data.lists;
                this.allReceivables = x.data.receivable ? x.data.receivable : 0;
                this.allPayableAmounts = x.data.changePrice ? x.data.changePrice : 0;
                this.pageConfig.total = x.data.count;
            } else {
                // 固定值
                this.selectedItems = [];
                this.listInfo = [];
                this.allReceivables = 0;
                this.allPayableAmounts = 0;
                this.pageConfig.total = 0;
            }
        }, () => {
            // 固定值
            this.listInfo = [];
            this.pageConfig.total = 0;
        }, () => {
            this.xn.loading.close();
        });

    }
    // 审批放款进度查看
    watchApproval(type?: number) {

        this.xn.avenger.post2('/jd/approval_progress', {
        }).subscribe(data => {
            if (data.ret !== 0) {
                if (this.subDefaultValue === 'SPECIAL') {
                    this.cancelSpecial(this.subDefaultValue);
                } else {
                    this.getList(this.currentParams);
                }
            } else {
                if (data.data.isCompleted === true && type && type === 1) {
                    this.watchApproval_msg = ``;
                } else if (data.data.isCompleted === true
                    && type === undefined) {
                    if (this.subDefaultValue === 'SPECIAL') {
                        this.cancelSpecial(this.subDefaultValue);
                    } else {
                        this.getList(this.currentParams);
                    }
                    this.watchApproval_msg = ``;
                } else if (data.data.isCompleted === false) {
                    setTimeout(() => {
                        this.watchApproval();
                    }, 5000);
                    this.watchApproval_msg = `请求正在进行中，其中总审批数据${data.data.total},
                            已完成${data.data.completedCount},未完成${data.data.unfinishedCount}`;
                }

            }
        });


    }
    // 推送数据进度查看
    pushApproval(type?: number) {
        const that = this;
        this.xn.avenger.post2('/jd/push_progress', {
        }).subscribe(data => {
            if (data.ret !== 0) {
                this.pushApproval_msg = ``;
            } else {
                if (data.data.isCompleted === true && type && type === 1) {
                    this.pushApproval_msg = ``;
                } else if (data.data.isCompleted === true
                    && type === undefined) {
                    this.getList(that.currentParams);
                    this.pushApproval_msg = ``;
                } else if (data.data.isCompleted === false) {
                    this.pushApproval_msg = `请求正在进行中，其中总推送数据${data.data.total},
                            已完成${data.data.completedCount},未完成${data.data.unfinishedCount}`;
                    setTimeout(() => {
                        this.pushApproval();
                    }, 5000);
                } else if (data.data.isCompleted === true) {
                }
            }
        });

    }

    /**
     *  搜索,默认加载第一页
     */
    public searchMsg() {
        this.selectedItems = [];
        this.selectedReceivables = 0;
        this.selectedPayableAmounts = 0;
        this.paging = 1;
        this.onPage({ page: this.paging });
    }

    /**
     * 重置
     */
    public reset() {
        this.selectedItems = [];
        this.selectedReceivables = 0;
        this.selectedPayableAmounts = 0;
        // this.searchForm.reset(); // 清空
        for (const key in this.arrObjs) {
            if (this.arrObjs.hasOwnProperty(key)) {
                delete this.arrObjs[key];
            }
        }
        this.buildCondition(this.searches);
        this.searchMsg(); // 清空之后自动调一次search
    }

    /**
     *  列表头样式
     * @param paramsKey
     */
    public onSortClass(paramsKey: string): string {
        if (paramsKey === this.sorting) {
            return 'sorting_' + this.naming;
        } else {
            return 'sorting';
        }
    }

    /**
     *  按当前列排序
     * @param sort
     */
    public onSort(sort: string) {
        if (this.sorting === sort) {
            this.naming = this.naming === 'desc' ? 'asc' : 'desc';
        } else {
            this.sorting = sort;
            this.naming = 'asc';
        }
        this.onPage({ page: this.paging });
    }


    public cancelSpecial(paramSubTabValue?: string) {
        this.selectedItems = [];
        this.selectedReceivables = 0;
        this.selectedPayableAmounts = 0;
        this.listInfo = [];
        this.naming = '';
        this.sorting = '';
        // this.paging = 1;
        // this.pageConfig = { pageSize: 10, first: 0, total: 0 };
        const find = this.tabConfig.tabList.find(tab => tab.value === this.defaultValue);
        this.currentTab = !!find ? find : new TabListOutputModel();
        // 子页面配置
        const subFind = this.currentTab.subTabList.find(sub => sub.value === 'SPECIAL');
        this.currentSubTab = !!subFind ? subFind : new SubTabListOutputModel();
        this.heads = CommUtils.getListFields(this.currentSubTab.headText);
        this.searches = this.currentSubTab.searches; // 当前标签页的搜索项
        this.buildShow(this.searches);
        const params = this.buildParams(10);
        this.xn.loading.open();
        this.xn[this.apiProxyEnum[this.defaultValue]].post('/aprloan/approval/list', params).subscribe(x => {
            this.selectedItems = [];
            this.selectedReceivables = 0;
            this.selectedPayableAmounts = 0;
            if (x.data) {
                if (x.data && x.data.data && x.data.data.length) {
                    this.listInfo = x.data.data;
                    // this.selectedItems = [];
                    this.allReceivables = x.data.receivable ? x.data.receivable : 0;
                    this.allPayableAmounts = x.data.changePrice ? x.data.changePrice : 0;
                    if (x.data.recordsTotal === undefined) {
                        this.pageConfig.total = x.data.count;
                    } else {
                        this.pageConfig.total = x.data.recordsTotal;
                    }

                } else {
                    // 固定值
                    this.listInfo = [];
                    this.allReceivables = 0;
                    this.allPayableAmounts = 0;
                    this.pageConfig.total = 0;
                }
            }
            this.xn.loading.close();
            this.subDefaultValue = paramSubTabValue;
        });
    }
    /**
     * 计算表格合并项
     * currentSubTab.headText.length + 可选择1 + 序号1 + 行操作+1
     */
    public calcAttrColspan(): number {
        let nums: number = this.currentSubTab.headText.length + 1;
        const boolArray = [this.currentSubTab.canChecked,
        this.currentSubTab.edit && this.currentSubTab.edit.rowButtons && this.currentSubTab.edit.rowButtons.length > 0];
        nums += boolArray.filter(arr => arr === true).length;
        return nums;
    }

    /**
     *  判断列表项是否全部选中
     */
    public isAllChecked(): boolean {
        return !(this.listInfo.some(x => !x.checked || x.checked && x.checked === false) || this.listInfo.length === 0);
    }

    /**
     *  全选
     */
    public checkAll() {
        if (!this.isAllChecked()) {
            this.listInfo.forEach(item => item.checked = true);
            this.selectedItems = XnUtils.distinctArray2([...this.selectedItems, ...this.listInfo], 'mainFlowId');
            this.selectedReceivables = 0;
            this.selectedPayableAmounts = 0;
            this.selectedItems.forEach(item => {
                this.selectedReceivables = Number((this.selectedReceivables + item.receivable).toFixed(2)); // 勾选交易总额
                this.selectedPayableAmounts = Number((this.selectedPayableAmounts + (item.changePrice ? item.changePrice : 0)).toFixed(2));
            });
        } else {
            this.listInfo.forEach(item => item.checked = false);
            this.selectedItems = [];
            this.selectedReceivables = 0;
            this.selectedPayableAmounts = 0;
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
            this.selectedReceivables = Number((this.selectedReceivables - paramItem.receivable).toFixed(2)); // 勾选交易总额
            this.selectedPayableAmounts = Number((this.selectedPayableAmounts - (paramItem.changePrice ? paramItem.changePrice : 0)).toFixed(2));
        } else {
            paramItem.checked = true;
            this.selectedItems.push(paramItem);
            this.selectedItems = XnUtils.distinctArray2(this.selectedItems, 'mainFlowId'); // 去除相同的项
            this.selectedReceivables = Number((this.selectedReceivables + paramItem.receivable).toFixed(2)); // 勾选交易总额
            this.selectedPayableAmounts = Number((this.selectedPayableAmounts + (paramItem.changePrice ? paramItem.changePrice : 0)).toFixed(2));
        }

    }

    /**
     *  查看合同，只读
     * @param paramContractInfo
     */
    public showContract(paramContractInfo, type: string, proxy: number) {
        if ((proxy === 52 || proxy === 53 || proxy === 54) && type !== 'receivetable') {
            this.viewModal = DragonPdfSignModalComponent;
        } else if (proxy === 50 || type === 'receivetable') {
            this.viewModal = AvengerPdfSignModalComponent;
        } else {
            this.viewModal = PdfSignModalComponent;
        }
        const params = Object.assign({}, paramContractInfo, { readonly: true });
        XnModalUtils.openInViewContainer(this.xn, this.vcr, this.viewModal, params).subscribe(() => {
        });
    }

    /**
     *  查看更多发票
     * @param paramItem
     */
    public viewMore(paramItem) {
        if (typeof paramItem === 'string') {
            paramItem = JSON.parse(paramItem);
        }
        XnModalUtils.openInViewContainer(
            this.xn,
            this.vcr,
            InvoiceDataViewModalComponent,
            paramItem
        ).subscribe(() => {
        });
    }

    /**
     *  查看文件信息
     * @param paramFile
     */
    public viewFiles(paramFile) {
        XnModalUtils.openInViewContainer(this.xn, this.vcr, FileViewModalComponent, paramFile).subscribe();
    }
    // 查看付款确认书
    viewMFiles(paramFile, proxy: number) {
        let params;
        if (proxy === 52 || proxy === 53 || proxy === 54) {
            this.viewModal = DragonMfilesViewModalComponent;
            params = JSON.parse(paramFile);
        } else if (proxy === 50) {
            params = [{ file: paramFile }];
            this.viewModal = AvengerMfilesViewModalComponent;
        } else {
            this.viewModal = FileViewModalComponent;
        }


        XnModalUtils.openInViewContainer(this.xn, this.vcr, this.viewModal, params).subscribe();

    }

    /**
     *  判断数据类型
     * @param paramValue
     */
    public judgeDataType(paramValue: any): boolean {
        if (typeof Array.isArray === 'function') {
            return Array.isArray(paramValue);
        } else {
            return Object.prototype.toString.call(paramValue) === '[object Array]';
        }
    }

    /**
     *  格式化数据
     * @param paramData
     */
    public jsonTransForm(paramData) {
        return JsonTransForm(paramData);
    }

    /**
     *  判断数据是否长度大于显示最大值
     * @param paramFileInfos
     */
    public arrayLength(paramFileInfos: any) {
        if (!paramFileInfos) {
            return false;
        }
        const obj =
            typeof paramFileInfos === 'string'
                ? JSON.parse(paramFileInfos)
                : JSON.parse(JSON.stringify(paramFileInfos));
        return !!obj && obj.length > 2;
    }
  // 人工审核条件下管理员能操作的权限
  adminControl(){
    return this.is_jindie===0 && this.xn.user.roles.includes('admin');
}
    /**
     *  表头按钮组事件
     * @param paramBtnOperate
     */
    public handleHeadClick(paramBtnOperate: ButtonConfigModel) {
        if (paramBtnOperate.operate !== 'download_approval_list' && this.selectedItems.length === 0) {
            this.xn.msgBox.open(false, '请选择交易');
            return;
        }
        if(this.shieldArray.includes(paramBtnOperate.operate) && this.xn.user.roles.indexOf('admin')<0 ){
            this.xn.msgBox.open(false,'非管理员不能操作,请联系管理员');
            return;
        }
        if (paramBtnOperate.operate === 'initiate_examination') {

            const params: EditParamInputModel = {
                title: '选择起息日',
                checker: [
                    {
                        title: '起息时间',
                        checkerId: 'valueDate',
                        type: 'date4',
                        validators: {},
                        required: 1,
                        options: {},
                        value: '',
                    },
                    {
                        title: '审批注释',
                        checkerId: 'memo',
                        type: 'textarea',
                        validators: {},
                        required: 1,
                        options: {},
                        value: '',
                    },
                ] as CheckersOutputModel[],
                buttons: ['取消', '确定']
            };
            XnModalUtils.openInViewContainer(this.xn, this.vcr, EditModalComponent, params).subscribe(v => {
                if (v === null) {

                    return;
                } else {
                    this.valueDate = v.valueDate;   // 起息日时间
                    this.approvalMemo = v.memo;
                    const list = this.selectedItems.map(item => {
                        item.valueDate = this.valueDate; // 将弹窗的起息日时间塞进去；
                        item.approvalMemo = this.approvalMemo;
                        const {
                            mainFlowId,
                            headquarters,
                            pdfProjectFiles,
                            payCompareStatus,
                            stopStatus,
                            changeStatus,
                            isSupplierSign,
                            isUpstreamSign,
                            valueDate,
                            approvalMemo
                        } = item;
                        return {
                            mainFlowId,
                            headquarters,
                            pdfProjectFiles,
                            payCompareStatus,
                            stopStatus,
                            changeStatus,
                            isSupplierSign,
                            isUpstreamSign,
                            valueDate,
                            approvalMemo
                        };
                    });
                    this.xn[this.apiProxyEnum[this.defaultValue]].post(paramBtnOperate.post_url, { list }).subscribe(x => {
                        if (x.ret === 0) {
                            if (this.subDefaultValue === 'SPECIAL') {
                                this.subDefaultValue = 'DOING';
                                this.handleSubTabChange('SPECIAL');
                            } else {
                                // this.onPage({ page: this.paging });
                                if (this.subDefaultValue === 'SPECIAL') {
                                    this.cancelSpecial(this.subDefaultValue);
                                    // return;
                                } else {
                                    this.getList(this.currentParams);
                                }
                                // this.getList(this.currentParams);
                                this.localStorageService.setCacheValue('isstartStatus', { startStatus: true });
                                clearInterval(this.timed);
                                this.watchApproval();
                            }
                        }
                    });
                }
            });

        } else if (paramBtnOperate.operate === 'approval_ok') { // 审批成功
            const mainflowIdlist = [];
            this.selectedItems.map(item => {
                item.creditStatus = 1;
                item.financeStatus = 1;
                mainflowIdlist.push(item.mainFlowId);
            });
            this.xn[this.apiProxyEnum[this.defaultValue]].post(paramBtnOperate.post_url, { type: 1, mainFlowIds: mainflowIdlist })
                .subscribe(x => {
                    if (x.data) {
                        this.initData('F', true);
                    }
                });
        } else if (paramBtnOperate.operate === 'approval_reject') {  // 审批拒绝
            const mainflowIdlist = [];
            this.selectedItems.map(item => {
                item.creditStatus = 2;
                item.financeStatus = 2;
                mainflowIdlist.push(item.mainFlowId);
            });
            this.xn[this.apiProxyEnum[this.defaultValue]].post(paramBtnOperate.post_url, { type: 0, mainFlowIds: mainflowIdlist })
                .subscribe(x => {
                    if (x.data) {
                        this.initData('F', true);
                    }
                });
        } else if (paramBtnOperate.operate === 'sign_contract') { // 批量签署合同
            this.batchSign(paramBtnOperate);
        } else if (paramBtnOperate.operate === 'loan_ok') {      // 放款成功
            const params: EditParamInputModel = {
                title: '放款信息',
                checker: [
                    {
                        title: '放款时间',
                        checkerId: 'loanDate',
                        type: 'date4',
                        validators: {},
                    },
                ] as CheckersOutputModel[],
                buttons: ['取消', '确定']
            };
            XnModalUtils.openInViewContainer(this.xn, this.vcr, EditModalComponent, params).subscribe(v => {
                if (v === null) {

                    return;
                } else {
                    this.loanDate = v.loanDate;
                    this.xn[this.apiProxyEnum[this.defaultValue]].post(paramBtnOperate.post_url,
                        { mainFlowIds: this.selectedItems.map((x: any) => x.mainFlowId), loanDate: this.loanDate, type: 1 })
                        .subscribe(con => {
                            this.initData('D', true);
                        });
                }
            });

        } else if (paramBtnOperate.operate === 'loan_fail') {        // 放款失败
            this.xn[this.apiProxyEnum[this.defaultValue]].post(paramBtnOperate.post_url,
                { mainFlowIds: this.selectedItems.map((x: any) => x.mainFlowId), type: 0 })
                .subscribe(con => {
                    this.initData('D', true);
                });
        } else if (paramBtnOperate.operate === 'approval_again') {   // 重新审批
            this.xn.router.navigate([`/console/record/avenger/new/sub_approval_again_530`],
                {
                    queryParams: {
                        id: 'sub_approval_again_530',
                        relate: 'mainIds',
                        relateValue: this.selectedItems.map((x: any) => x.mainFlowId),
                    }
                });
        } else if (paramBtnOperate.operate === 'download_approval_list') {// 导出清单
            this.downloadApprovallist(paramBtnOperate);
        } else if (paramBtnOperate.operate === 'accountDownload') {
            this.xn.avenger.download('/aprloan/approval/accountDownload',
                { mainFlowIds: this.selectedItems.map((x: any) => x.mainFlowId), isProxy: this.listInfo.map((x: any) => x.isProxy)[0] })
                .subscribe((x: any) => {
                    this.xn.api.save(x._body, '会计下载表格.xlsx');
                    this.selectedItems.forEach(x => {
                        x.kjDownTimes += 1;
                    });
                });


        } else if (paramBtnOperate.operate === 'loadFinancing') {
            const mainFlowIds = this.selectedItems.map((x: any) => x.mainFlowId);
            const onemainFlowIds = mainFlowIds[0].split('_');
            const firstSign = onemainFlowIds[onemainFlowIds.length - 1];
            mainFlowIds.forEach(x => {
                if (x.indexOf(firstSign) < 0) {
                    this.xn.msgBox.open(false, '请选择同种类型的交易');
                    return;
                }

            });
            const params = {
                title: '出纳下载表格',
                checker: [
                    {
                        title: '请选择下载模板',
                        checkerId: 'cashierDown',
                        type: 'radio',
                        options: { ref: 'cashierDownTemplate' },
                        required: 1,
                    },

                ]
            };
            XnModalUtils.openInViewContainer(this.xn, this.vcr, EditModalComponent, params).subscribe(v => {
                if (v === null) {
                    return;
                }
                if (v.cashierDown === IsCashierType.Wei_fang) {
                    this.xn.avenger.download('/aprloan/approval/loadFinancingWf',
                        {
                            mainFlowIds: this.selectedItems.map((x: any) => x.mainFlowId),
                            isProxy: this.selectedItems[0].isProxy
                        }).subscribe((x: any) => {
                            this.xn.api.save(x._body, '出纳下载表格(潍坊模板).xlsx');
                            this.selectedItems.forEach(x => {
                                x.cnDownTimes += 1;
                            });
                        });
                } else if (v.cashierDown === IsCashierType.Pu_fa) {
                    this.xn.avenger.download('/aprloan/approval/loadFinancingPf',
                        {
                            mainFlowIds: this.selectedItems.map((x: any) => x.mainFlowId),
                            isProxy: this.selectedItems[0].isProxy
                        }).subscribe((x: any) => {
                            this.xn.api.save(x._body, '出纳下载表格(浦发模板).xlsx');
                            this.selectedItems.forEach(x => {
                                x.cnDownTimes += 1;
                            });
                        });
                } else {
                    this.xn.avenger.download('/aprloan/approval/loadFinancing',
                        {
                            mainFlowIds: this.selectedItems.map((x: any) => x.mainFlowId),
                            isProxy: this.selectedItems[0].isProxy
                        }).subscribe((x: any) => {
                            this.xn.api.save(x._body, '出纳下载表格(工行模板).xlsx');
                            this.selectedItems.forEach(x => {
                                x.cnDownTimes += 1;
                            });
                        });
                }
            });

        } else if (paramBtnOperate.operate === 'finish_sign_contract') {

            this.finishSignContract();

        } else if (paramBtnOperate.operate === 'finance_approval_ok' || paramBtnOperate.operate === 'finance_approval_fail') {
            const type = paramBtnOperate.operate === 'finance_approval_ok' ? 1 : 0;
            const mainFlowId = this.selectedItems.map(item => item.mainFlowId);
            this.xn[this.apiProxyEnum[this.defaultValue]].post(paramBtnOperate.post_url, { type: type, mainFlowIds: mainFlowId })
                .subscribe(x => {
                    if (x.data) {
                        this.initData('G', true);
                    }
                });

        }
    }

    /**
     * 行按钮组事件
     * @param paramItem 当前行数据
     * @param paramBtnOperate 按钮操作配置
     * @param i 下标
     */
    public handleRowClick(paramItem, paramBtnOperate: ButtonConfigModel, i: number) {
        paramBtnOperate.click(this.base, paramItem, this.xn, this.hwModeService);
    }

    /**
     * 构建搜索项
     * @param searches
     */
    private buildShow(searches) {
        this.shows = [];
        this.onUrlData();
        this.buildCondition(searches);
    }


    /**
   * 批量签署合同
   * @param btn
   */
    private batchSign(btn) {
        let isOk1 = false;
        let alert1 = '';
        const isFactoringsignStatus = this.selectedItems.map(x => ({ isFactoringSign: x.isFactoringSign, mainFlowId: x.mainFlowId }));
        isFactoringsignStatus.forEach(x => {
            if (x.isFactoringSign === 1) {
                alert1 += x.mainFlowId + '、';
                isOk1 = true;
            }
        });
        if (isOk1) {
            this.xn.msgBox.open(false, `此${alert1}的保理商已签署合同`);
            return;
        }
        let proxyType = '';
        const mainFlowIds = this.selectedItems.map((x: any) => x.mainFlowId);
        const onemainFlowIds = mainFlowIds[0].split('_');
        const firstSign = onemainFlowIds[onemainFlowIds.length - 1];
        mainFlowIds.forEach(x => {
            if (x.indexOf(firstSign) < 0) {
                this.xn.msgBox.open(false, '请选择同种类型的交易');
                return;
            }

        });

        if (mainFlowIds[0].endsWith('bgy')) {
            proxyType = 'avenger';
            this.modal = DragonFinancingContractModalComponent;
        }

        this.xn[proxyType].post(btn.post_url, { mainFlowIds })
            .subscribe(con => {
                const cons = JSON.parse(con.data.contracts);
                cons.isProxy = 54;
                cons.forEach(element => {
                    if (!element.config) {
                        element.config = {
                            text: ''
                        };
                    }
                });
                cons.forEach(x => {
                    if (x.label.includes('国内商业保理合同-标准版')) {
                        x.config.text = '甲方(电子签章、数字签名)';
                    } else {
                        x.config.text = '（盖章）';
                    }
                });
                XnModalUtils.openInViewContainer(this.xn, this.vcr, this.modal, cons).subscribe(x => {
                    if (x === 'ok') {
                        // 保存合同信息
                        this.SaveContract();
                    }
                });

            });


    }


    /**
     *
     * @param paramsValue 进入资产池  --资产池名称
     */
    enterCapitalPool(paramsValue) {
        const params = {
            mainFlowId: paramsValue
        };
        this.xn.dragon.post('/trade/get_mainflowid_pool_info', params).subscribe(x => {
            if (x.ret === 0 && x.data.capitalPoolId !== '') {
                this.xn.router.navigate(['/country-graden/assets-management/capital-pool'], {
                    queryParams: {
                        title: '项目管理-碧桂园>' + (x.data.type === 1 ? 'ABS储架项目' : '再保理银行项目') + '>'
                            + x.data.projectName + '-' + x.data.headquarters,
                        projectId: x.data.project_manage_id,
                        headquarters: x.data.headquarters,
                        fitProject: x.data.projectName,
                        capitalPoolId: x.data.capitalPoolId,
                        capitalPoolName: x.data.capitalPoolName,
                        isMachineenter: true,
                    }
                });
            } else if (x.ret === 0 && !x.data.capitalPoolId) {
                this.onPage({ page: this.paging });
            }
        });
    }
    // 完成签署，推送数据
    finishSignContract() {
        let isOk1 = false;
        let isOk2 = false;
        let alert1 = '';
        let alert2 = '';
        const isFactoringsignStatus = this.selectedItems.map(x => ({
            isFactoringSign: x.isFactoringSign,
            mainFlowId: x.mainFlowId, freezeTwo: x.freezeTwo
        }));
        isFactoringsignStatus.forEach(x => {
            if (x.isFactoringSign === 0) {
                alert1 += x.mainFlowId + '、';
                isOk1 = true;
            }
            if (x.freezeTwo === 1) {
                alert2 += x.mainFlowId + '、';
                isOk2 = true;
            }
        });
        if (isOk2) {
            this.xn.msgBox.open(false, `此${alert1}的交易被冻结，不可推送数据`);
            return;
        }
        if (isOk1) {
            this.xn.msgBox.open(false, `此${alert1}的保理商未签署合同，不可推送数据`);
            return;
        }
        const mainFlowIds = this.selectedItems.map((x: any) => x.mainFlowId);
        // let isCanLoan = this.selectedItems.map((x: any) => x.isCanLoan);
        // let msgs = [];
        // for (let i in isCanLoan) {
        //     if (isCanLoan[i] === 0) {
        //         msgs.push('交易id：' + mainFlowIds[i] + '，未具备放款条件，不可推送数据');
        //     }
        // }
        // if (msgs.length !== 0) {
        //     this.xn.msgBox.open(false, msgs);
        // } else {

        this.xn.avenger.post('/jd/jd_finish_sign', { mainFlowIds }).subscribe(x => {
            if (x.ret === 0) {
                this.initData('C', true);
                this.localStorageService.setCacheValue('ispushStatus', { startStatus: true });
                clearInterval(this.timedpush);
                this.pushApproval();
            }
        });
        // }
    }

    private SaveContract() {
        // 保存合同信息
        this.xn.avenger.post('/jd/signOver', { mainFlowIds: this.selectedItems.map(main => main.mainFlowId) })
            .subscribe((temp: any) => {
                if (temp.ret === 0) {
                    this.selectedItems = [];
                    this.selectedReceivables = 0;
                    this.selectedPayableAmounts = 0;
                    this.onPage({ page: this.paging });
                }

            });
    }
    /**
     * 搜索项值格式化
     * @param searches
     */
    private buildCondition(searches) {
        const tmpTime = {
            beginTime: this.beginTime,
            endTime: this.endTime
        };
        const objList = [];
        this.timeId = $.extend(true, [], this.searches.filter(v => v.type === 'quantum').map(v => v.checkerId));
        for (let i = 0; i < searches.length; i++) {
            const obj = {} as any;
            obj.title = searches[i].title;
            obj.checkerId = searches[i].checkerId;
            obj.required = false;
            obj.type = searches[i].type;
            obj.sortOrder = searches[i].sortOrder;
            obj.options = searches[i].options;
            if (searches[i].checkerId === this.timeId[0]) {
                obj.value = JSON.stringify(tmpTime);
            } else {
                obj.value = this.arrObjs[searches[i].checkerId];
            }
            objList.push(obj);
        }
        this.shows = $.extend(true, [], objList.sort(function (a, b) {
            return a.sortOrder - b.sortOrder;
        })); // 深拷贝，并排序;
        XnFormUtils.buildSelectOptions(this.shows);
        this.buildChecker(this.shows);
        this.searchForm = XnFormUtils.buildFormGroup(this.shows);
        const time = this.searches.filter(v => v.type === 'quantum');
        const timeCheckId = time[0] && time[0].checkerId;
        this.nowTimeCheckId = timeCheckId;
        this.searchForm.valueChanges.subscribe((v) => {
            // 时间段
            const changeId = v[timeCheckId];
            delete v[timeCheckId];
            if (changeId !== '' && this.nowTimeCheckId) {
                const paramsTime = JSON.parse(changeId);
                const beginTime = parseInt(paramsTime.beginTime);
                const endTime = parseInt(paramsTime.endTime);
                // 保存每次的时间值。
                this.preChangeTime.unshift({ begin: beginTime, end: endTime });
                // 默认创建时间
                this.beginTime = beginTime;
                this.endTime = endTime;
                if (this.preChangeTime.length > 1) {
                    if (this.preChangeTime[1].begin === this.beginTime &&
                        this.preChangeTime[1].end === this.endTime) {
                        // return;
                    } else {
                        this.beginTime = beginTime;
                        this.endTime = endTime;
                        this.paging = 1;
                        this.onPage({ page: this.paging });
                    }
                }
            }
            const arrObj = {} as any;
            for (const item in v) {
                if (v.hasOwnProperty(item) && v[item] !== '') {
                    const searchFilter = this.searches.filter(v1 => v1 && v1.base === 'number')
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

    /**
     * 构建列表请求参数
     */
    private buildParams(addparams: number) {
        let params = null;
        if (addparams !== undefined) {
            params = {
                start: (this.paging - 1) * this.pageConfig.pageSize,
                length: this.pageConfig.pageSize,
                startTime: this.beginTime,
                endTime: this.endTime,
                flag: addparams,
            };
        } else {
            params = {
                start: (this.paging - 1) * this.pageConfig.pageSize,
                length: this.pageConfig.pageSize,
                startTime: this.beginTime,
                endTime: this.endTime,
            };
        }


        // 分页处理

        // 排序处理
        if (this.sorting && this.naming) {
            params.order = [this.sorting + ' ' + this.naming];
        }
        // 搜索处理
        if (this.searches.length > 0) {
            for (const search of this.searches) {
                if (!XnUtils.isEmpty(this.arrObjs[search.checkerId])) {
                    if (search.checkerId === 'cnDownTimes' || search.checkerId === 'kjDownTimes') {
                        params[search.checkerId] = Number(this.arrObjs[search.checkerId]);
                    } else if (search.checkerId === 'startTime' || search.checkerId === 'createTime') {
                        const date = JSON.parse(this.arrObjs[search.checkerId]);
                        params.startTime = date.beginTime;
                        params.endTime = date.endTime;
                    } else if (search.checkerId === 'headPreDate') {
                        const date = JSON.parse(this.arrObjs[search.checkerId]);
                        params.headPreDateStart = date.beginTime;
                        params.headPreDateEnd = date.endTime;
                    } else if (search.checkerId === 'realLoanDate') {
                        const date = JSON.parse(this.arrObjs[search.checkerId]);
                        params.realLoanDateStart = date.beginTime;
                        params.realLoanDateEnd = date.endTime;
                    } else if (search.checkerId === 'type') {
                        const obj = JSON.parse(this.arrObjs[search.checkerId]);
                        params.type = Number(obj.proxy);
                        if (obj.status !== undefined) {
                            params.selectBank = Number(obj.status);

                        }
                    } else if (search.checkerId === 'valueDate') {
                        const date = JSON.parse(this.arrObjs[search.checkerId]);
                        params.valueStart = date.beginTime;
                        params.valueEnd = date.endTime;
                    } else if (search.checkerId === 'capitalPoolName') {
                        const info = JSON.parse(this.arrObjs[search.checkerId]);
                        if (info.status === '0') {
                            params.capitalPoolStatus = 0;
                        } else {
                            params.capitalPoolStatus = 1;
                            params.capitalPoolName = info.text;
                        }
                    } else if (search.checkerId === 'isPriorityLoanDate') {
                        const priorityLoanDate = JSON.parse(this.arrObjs[search.checkerId]);
                        if (priorityLoanDate.isPriorityLoanDate === 0) {
                            params.isPriorityLoanDate = priorityLoanDate.isPriorityLoanDate;
                        } else if (priorityLoanDate.isPriorityLoanDate > 0) {
                            params.priorityLoanDateStart = priorityLoanDate.priorityLoanDateStart;
                            params.priorityLoanDateEnd = priorityLoanDate.priorityLoanDateEnd;
                            params.isPriorityLoanDate = priorityLoanDate.isPriorityLoanDate;
                        }
                    } else if (search.checkerId === 'changePrice') { // 转让价款过滤
                        let changePrice = '';
                        this.arrObjs[search.checkerId].split(',').forEach(v => {
                            changePrice += v;
                        });
                        params.changePrice = Number(changePrice);
                    } else {
                        params[search.checkerId] = this.arrObjs[search.checkerId];
                    }

                }
            }
        }
        // 列表子标签页，构建参数 ,当且子标签状态有大于2中时,添加状态参数
        if (this.currentTab.subTabList.length >= 2) {
            params.status = this.subTabEnum[this.subDefaultValue];
        }
        params.isProxy = 54;
        return params;
    }

    private buildChecker(stepRows) {
        for (const row of stepRows) {
            XnFormUtils.convertChecker(row);
        }
    }
    public handleClick(type: number) {
        if (type === 1) {
            this.xn.router.navigate([`/console/record/avenger/new/sub_approval_honor_530`]);
        } else if (type === 2) {
            this.xn.router.navigate([`/console/record/avenger/new/sub_approval_return_530`]);
        } else if (type === 3) {

        }
    }

    handlerowInvoiceClick(row, isProsy: number) {
        if (isProsy === undefined || isProsy !== 50) {
            this.xn.router.navigate([`/console/invoice-display/invoice-list`], {
                queryParams: {
                    isNew: false
                }
            });
        } else {
            this.xn.router.navigate([`/console/invoice-display/invoice-list`], {
                queryParams: {
                    isNew: true
                }
            });
        }

        this.localStorageService.setCacheValue('invoices_mainFlowId', row.mainFlowId); // 暂存mainFlowId
    }
    /**
     * 回退操作，路由存储
     * @param data
     */
    private onUrlData(data?) {
        const urlData = this.xn.user.getUrlData(this.xn.router.url);
        if (urlData && urlData.pop) {
            this.paging = urlData.data.paging || this.paging;
            this.pageConfig = urlData.data.pageConfig || this.pageConfig;
            this.beginTime = urlData.data.beginTime || this.beginTime;
            this.endTime = urlData.data.endTime || this.endTime;
            this.arrObjs = urlData.data.arrObjs || this.arrObjs;
            this.defaultValue = urlData.data.defaultValue || this.defaultValue;
            this.subDefaultValue = urlData.data.subDefaultValue || this.subDefaultValue;
        } else {
            this.xn.user.setUrlData(this.xn.router.url, {
                paging: this.paging,
                pageConfig: this.pageConfig,
                beginTime: this.beginTime,
                endTime: this.endTime,
                arrObjs: this.arrObjs,
                defaultValue: this.defaultValue,
                subDefaultValue: this.subDefaultValue
            });
        }
    }

    // 弹出实收费用详情窗口
    openInterest(item: any) {
        const checkers = [
            {
                title: '',
                checkerId: 'contractNum',
                type: 'interestRate',
                required: false,
                options: { readonly: true },
                value: item
            },
        ];
        const params = {
            checker: checkers,
            title: '实收费用',
            buttons: ['关闭'],

        };
        XnModalUtils.openInViewContainer(this.xn, this.vcr, EditModalComponent, params)
            .subscribe(v => {

                // if (v.action === 'cancel') {
                //     return;
                // } else {
                // }
            });
    }
    // 打开当前信贷信息窗口
    openApproval(Paramitem: any) {
        this.xn.avenger.post('/jd/approval_info', { mainFlowId: Paramitem.mainFlowId }).subscribe(x => {
            if (x.ret === 0) {
                XnModalUtils.openInViewContainer(this.xn, this.vcr, AvengerIrecordComponent, x.data)
                    .subscribe(v => {
                    });

            }
        });


    }

    // 审批放款弹出费用情况
    openFrees(Paramitem: any) {
        this.xn.avenger.post('/jd/fee_info', { mainFlowId: Paramitem.mainFlowId }).subscribe(x => {
            if (x.ret === 0) {
                XnModalUtils.openInViewContainer(this.xn, this.vcr, AvengerapprovalfreeStyleComponent, x.data)
                    .subscribe(v => {

                        // if (v.action === 'cancel') {
                        //     return;
                        // } else {
                        // }
                    });
            }
        });

    }

    // 变更记录弹窗

    openChangedetail(paramItem: any) {
        if (paramItem.ischangeAccount === 0) {
            return;
        }
        this.xn.avenger.post('/aprloan/approval/changeList', { mainFlowId: paramItem.mainFlowId }).subscribe(x => {
            if (x.ret === 0) {
                XnModalUtils.openInViewContainer(this.xn, this.vcr, AvengerChangeAccountComponent, x.data.data)
                    .subscribe(v => {

                        // if (v.action === 'cancel') {
                        //     return;
                        // } else {
                        // }
                    });
            }
        });


    }
    // 打开付确信息比对结果弹窗
    openResultcompare(paramItem: any) {
        this.xn.avenger.post('/aprloan/approval/fkqrsList', { mainFlowId: paramItem.mainFlowId }).subscribe(x => {
            if (x.ret === 0) {
                XnModalUtils.openInViewContainer(this.xn, this.vcr, AvengerResultCompareComponent, x.data.data)
                    .subscribe(v => {

                    });

            }
        });

    }
    // 导出清单

    downloadApprovallist(paramItem: any) {
        const params = { hasSelect: !!this.selectedItems && this.selectedItems.length > 0 };
        XnModalUtils.openInViewContainer(
            this.xn,
            this.vcr,
            AvengerExportListModalComponent,
            params
        ).subscribe(x => {
            if (x === '') {
                return;
            }
            this.xn.loading.open();
            const param = {
                flag: paramItem.flag,
                mainFlowIds: [],
                type: '',
            };
            if (x.exportList === 'all') {
                param.type = 'all';
                param.mainFlowIds = [];
            } else if (x.exportList === 'selected') {
                param.type = 'selected';
                param.mainFlowIds = this.selectedItems.map(c => c.mainFlowId);
            }
            this.xn.api.download(paramItem.post_url,
                param)
                .subscribe((con: any) => {
                    this.xn.api.save(con._body, '审批放款清单.xlsx');
                    this.xn.loading.close();
                });
        });



    }


}
