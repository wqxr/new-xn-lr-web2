/*
 * Copyright(c) 2017-2019, 深圳市链融科技股份有限公司
 * Beijing Xiwei Technology Co., Ltd.
 * All rights reserved.
 *
 * @file：comfirm-information-index-component
 * @summary：多标签页列
 * 表项 根据tab-pane.ts中的配置
 * @version: 1.0
 * **********************************************************************
 * revision             author            reason             date
 * 1.0                 wangqing        A产品客户管理功能列表         2019-12-2
 * **********************************************************************
 */

import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { XnService } from 'libs/shared/src/lib/services/xn.service';
import { LocalStorageService } from 'libs/shared/src/lib/services/local-storage.service';
import { XnModalUtils } from 'libs/shared/src/lib/common/xn-modal-utils';
import { JsonTransForm } from 'libs/shared/src/lib/public/pipe/xn-json.pipe';
import { BanksMfilesViewModalComponent } from '../../share/modal/bank-mfiles-view-modal.component';
import { XnUtils } from 'libs/shared/src/lib/common/xn-utils';
import { XnFormUtils } from 'libs/shared/src/lib/common/xn-form-utils';
import { HwModeService } from 'libs/shared/src/lib/services/hw-mode.service';
import { TabConfigModel, TabListOutputModel, SubTabListOutputModel, ButtonConfigModel } from 'libs/shared/src/lib/config/list-config-model';
import CommUtils from 'libs/shared/src/lib/public/component/comm-utils';
import CommBase from 'libs/shared/src/lib/public/component/comm-base';
import { BankExportListModalComponent } from '../../share/modal/export-list-modal.component';
import { BankWhiteStatusComponent } from '../../share/modal/white-status-modal.component';
import { BankFinancingContractModalComponent } from '../../share/modal/bank-asign-contract.modal';

@Component({
    selector: 'app-comfirm-information-index-component',
    templateUrl: `./bank-custom-manager.component.html`,
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
export class BankPuhuiTongComponent implements OnInit {
    // 默认激活第一个标签页 {do_not,do_down}
    defaultValue = 'A';
    subDefaultValue = 'do_not';
    // 数据
    data: any[] = [];
    // 页码配置
    pageConfig = {
        pageSize: 10,
        first: 0,
        total: 0,
    };
    // 搜索项
    shows: any[] = [];
    form: FormGroup;
    searches: any[] = []; // 面板搜索配置项项
    selectedItems: any[] = []; // 选中的项
    currentTab: any; // 当前标签页
    arrObjs = {} as any; // 缓存后退的变量
    paging = 0; // 共享该变量
    beginTime: any;
    endTime: any;
    timeId = [];
    nowTimeCheckId = '';
    heads: any[];
    base: CommBase;

    // 上次搜索时间段
    preChangeTime: any[] = [];
    public formModule = 'dragon-input';
    sorting = ''; // 共享该变量
    naming = ''; // 共享该变量
    public tabConfig: TabConfigModel = new TabConfigModel(); // 当前列表配置
    public currentSubTab: SubTabListOutputModel = new SubTabListOutputModel(); // 当前子标签页

    constructor(private xn: XnService,
                private vcr: ViewContainerRef,
                public hwModeService: HwModeService,
                private router: ActivatedRoute) {
    }

    ngOnInit(): void {
        this.router.data.subscribe((x: TabConfigModel) => {
            this.tabConfig = x;
            this.initData(this.defaultValue);
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
    /**
     *  查看文件信息
     * @param paramFile
     */
    public viewFiles(paramFile) {
        XnModalUtils.openInViewContainer(this.xn, this.vcr, BanksMfilesViewModalComponent, JSON.parse(paramFile)).subscribe();
    }
    /**
     *  加载信息
     * @param val
     */
    public initData(val: string) {
        if (this.defaultValue !== val) {
            this.selectedItems = []; // 切换标签页是清空选中的项
            this.naming = '';
            this.sorting = '';
        }
        this.defaultValue = val;
        this.onPage({ page: this.paging });
    }
    openWhiteStatus(paramItem: any) {
        XnModalUtils.openInViewContainer(this.xn, this.vcr, BankWhiteStatusComponent,
            { value: { orgName: paramItem.orgName, appId: paramItem.appId } }).subscribe(() => {
            });
    }

    /**
     * @param e  event.page: 新页码 <br> event.pageSize: 页面显示行数<br>event.first: 新页面之前的总行数<br>event.pageCount : 页码总数
     * @param type 标签页
     */
    public onPage(e?) {
        this.paging = e.page || 1;
        this.onUrlData(); // 导航回退取值
        this.pageConfig = Object.assign({}, this.pageConfig, e);
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
        const params = this.buildParams();
        if (this.currentTab.post_url === '') {
            // 固定值
            this.data = [];
            this.pageConfig.total = 0;
            return;
        }
        this.xn.loading.open();
        this.xn.avenger.post(this.currentTab.post_url, params).subscribe(x => {
            if (x.data && x.data.data && x.data.data.length) {
                this.data = x.data.data;
                this.data.forEach(x => {
                    x.loanLimit = Number(x.loanLimit).toFixed(2);
                });
                this.pageConfig.total = x.data.count;
            } else {
                // 固定值
                this.data = [];
                this.pageConfig.total = 0;
            }
        }, () => {
            // 固定值
            this.data = [];
            this.pageConfig.total = 0;
        }, () => {
            this.xn.loading.close();
        });
    }

    /**
     *  搜索,默认加载第一页
     */
    public searchMsg() {
        this.selectedItems = [];
        this.paging = 1;
        this.onPage({ page: this.paging, first: 0 });
    }

    /**
     * 重置
     */
    public reset() {
        this.selectedItems = [];
        // this.form.reset(); // 清空
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
        this.onPage({ page: 1 });
    }

    /**
     *  判读列表项是否全部选中
     */
    public isAllChecked(): boolean {
        return !(this.data.some(x => !x.checked || x.checked && x.checked === false) || this.data.length === 0);
    }

    /**
     *  全选
     * @param e
     */
    public checkAll() {
        if (!this.isAllChecked()) {
            this.data.forEach(item => item.checked = true);
            this.selectedItems = XnUtils.distinctArray2([...this.selectedItems, ...this.data], 'appId');
        } else {
            this.data.forEach(item => item.checked = false);
            this.selectedItems = [];
        }
    }

    /**
     * 单选
     * @param e
     * @param item
     * @param index
     */
    public singelChecked(item) {
        if (item.checked && item.checked === true) {
            item.checked = false;
            this.selectedItems = this.selectedItems.filter((x: any) => x.appId !== item.appId);
        } else {
            item.checked = true;
            this.selectedItems.push(item);
            this.selectedItems = XnUtils.distinctArray2(this.selectedItems, 'appId'); // 去除相同的项
        }

    }

    /**
     *  查看合同，只读
     * @param con
     */
    public showContract(con) {
        const contractLsit = JSON.parse(con);
        contractLsit.forEach(x => {
            x.readonly = true;

        });
        // const params = Object.assign({}, con, { readonly: true });
        XnModalUtils.openInViewContainer(this.xn, this.vcr, BankFinancingContractModalComponent, contractLsit).subscribe(() => {
        });
    }


    handleHeadClick(paramBtnOperate: ButtonConfigModel) {
        if (this.selectedItems.length === 0) {
            this.xn.msgBox.open(false, '请选择企业');
            return;
        } else {
            if ((paramBtnOperate.operate === 'openPush'
                || paramBtnOperate.operate === 'closePush') && this.userAuthJudge(this.xn.user.roles)) {
                const flag = paramBtnOperate.operate === 'openPush' ? 1 : 0;
                const appIds = this.selectedItems.map((x: any) => x.appId);
                const msgStr = flag ? '开启推广' : '关闭推广';
                this.xn.avenger.post(paramBtnOperate.post_url, { appIds, pushStatus: flag }).subscribe(x => {
                    if (x.ret === 0) {
                        this.xn.msgBox.open(false, msgStr + '成功');
                        this.selectedItems = [];
                        this.onPage({ page: this.paging });
                    }
                });
            } else if (paramBtnOperate.operate === 'upload_file' && this.userAuthJudge(this.xn.user.roles)) {// 上传文件
                const hasUploadedArr = this.selectedItems.filter((item) => {
                    return item.bankAccreditFile != '' || item.bankReplyFile != '' || item.financingFile != '' || item.otherFile != '';
                });
                if (hasUploadedArr && hasUploadedArr.length) {
                    const supplierStr = hasUploadedArr.slice(0, 10).map((y) => {
                        return y.orgName;
                    }).join(',');
                    this.xn.msgBox.open(false, supplierStr + '等' + hasUploadedArr.length + '家企业已经上传过文件，请重新选择');
                    return;
                }
                const appIds = this.selectedItems.map((x: any) => x.appId);
                this.xn.router.navigate([`/console/bank-puhuitong/record/new`],
                    {
                        queryParams: {
                            id: 'sub_bank_platform_add_file',
                            relate: 'appIds',
                            relateValue: appIds,
                        }
                    });

            } else if (paramBtnOperate.operate === 'download_approval_list') {
                this.downloadApprovallist(paramBtnOperate);
            }
        }
    }

    /**
     * 用户权限判断
     * @param searches
     */
    private userAuthJudge(roles: any[]): Boolean {
        const rolesArr = roles.filter((x) => {
            return x === 'customerOperator' || x === 'customerReviewer';
        });
        if (!(rolesArr && rolesArr.length)) {
            this.xn.msgBox.open(false, '您好，您的权限不够，仅【客户经理经办人、客户经理复核人】可进行操作');
        }
        return rolesArr && rolesArr.length ? true : false;
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
            obj.options = searches[i].options;
            obj.sortOrder = searches[i].sortOrder;
            if (searches[i].checkerId === this.timeId[0]) {
                obj.value = JSON.stringify(tmpTime);
            } else {
                obj.value = this.arrObjs[searches[i].checkerId];
            }
            objList.push(obj);
        }
        this.shows = $.extend(true, [], objList.sort(function(a, b) {
            return a.sortOrder - b.sortOrder;
        })); // 深拷贝，并排序;
        XnFormUtils.buildSelectOptions(this.shows);
        this.buildChecker(this.shows);
        this.form = XnFormUtils.buildFormGroup(this.shows);
        const time = this.searches.filter(v => v.type === 'quantum');
        const timeCheckId = time[0] && time[0].checkerId;
        this.nowTimeCheckId = timeCheckId;
        this.form.valueChanges.subscribe((v) => {
            // 时间段
            const changeId = v[timeCheckId];
            delete v[timeCheckId];
            if (changeId !== '' && this.nowTimeCheckId) {
                const paramsTime = JSON.parse(changeId);
                const beginTime = paramsTime.beginTime;
                const endTime = paramsTime.endTime;
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
                    const searchFilter = this.searches.filter(v1 => v1 && v1.base === 'number').map(c => c.checkerId);
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
     * 构建参数
     */
    private buildParams() {
        // 分页处理
        let params = null;
        params = {
            start: (this.paging - 1) * this.pageConfig.pageSize,
            length: this.pageConfig.pageSize,
            beginTime: this.beginTime,
            endTime: this.endTime
        };
        // 排序处理
        if (this.sorting && this.naming) {
            params.order = [this.sorting + ' ' + this.naming];
        }
        // 搜索处理
        if (this.searches.length > 0) {
            for (const search of this.searches) {
                if (!XnUtils.isEmpty(this.arrObjs[search.checkerId])) {
                    if (search.checkerId === 'day') {
                        const data = JSON.parse(this.arrObjs[search.checkerId]);
                        params.startDate = data.firstValue;
                        params.endDate = data.secondValue;
                    } else if (search.checkerId === 'receive') {
                        const data = JSON.parse(this.arrObjs[search.checkerId]);
                        params.startAmount = data.firstValue;
                        params.endAmount = data.secondValue;
                    } else if (search.checkerId === 'rateRange') {
                        const data = JSON.parse(this.arrObjs[search.checkerId]);
                        params.startRate = data.firstValue;
                        params.endRate = data.secondValue;
                    } else {
                        params[search.checkerId] = this.arrObjs[search.checkerId];

                    }
                }
            }
        }
        return params;
    }


    // 导出清单
    downloadApprovallist(paramItem: any) {
        const params = { hasSelect: !!this.selectedItems && this.selectedItems.length > 0 };
        XnModalUtils.openInViewContainer(
            this.xn,
            this.vcr,
            BankExportListModalComponent,
            params
        ).subscribe(x => {
            if (x === '') {
                return;
            }
            this.xn.loading.open();
            const param = {
                appIds: [],
                isProxy: 0,
            };
            if (x.exportList === 'all') {
                param.isProxy = 2;
                param.appIds = [];
            } else if (x.exportList === 'selected') {
                param.isProxy = 1;
                param.appIds = this.selectedItems.map(c => c.appId);
            }
            this.xn.avenger.download(paramItem.post_url,
                param)
                .subscribe((con: any) => {
                    this.xn.api.save(con._body, '银行列表.xlsx');
                    this.xn.loading.close();
                });
        });



    }

    private buildChecker(stepRows) {
        for (const row of stepRows) {
            XnFormUtils.convertChecker(row);
        }
    }
    /**
   * 行按钮组事件
   * @param paramItem 当前行数据
   * @param paramBtnOperate 按钮操作配置
   * @param i 下标
   */
    public handleRowClick(paramItem, paramBtnOperate: ButtonConfigModel) {
        paramBtnOperate.click(this.base, paramItem, this.xn, this.hwModeService);
    }
    /**
     * 回退操作
     * @param data
     */
    private onUrlData() {
        const urlData = this.xn.user.getUrlData(this.xn.router.url);
        if (urlData && urlData.pop) {
            this.paging = urlData.data.paging || this.paging;
            this.pageConfig = urlData.data.pageConfig || this.pageConfig;
            this.beginTime = urlData.data.beginTime || this.beginTime;
            this.endTime = urlData.data.endTime || this.endTime;
            this.arrObjs = urlData.data.arrObjs || this.arrObjs;
            this.defaultValue = urlData.data.defaultValue || this.defaultValue;
        } else {
            this.xn.user.setUrlData(this.xn.router.url, {
                paging: this.paging,
                pageConfig: this.pageConfig,
                beginTime: this.beginTime,
                endTime: this.endTime,
                arrObjs: this.arrObjs,
                defaultValue: this.defaultValue
            });
        }
    }
}
