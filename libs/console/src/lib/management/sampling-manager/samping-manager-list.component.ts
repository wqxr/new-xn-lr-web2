/*
 * Copyright(c) 2017-2020, 深圳市链融科技股份有限公司
 * Beijing Xiwei Technology Co., Ltd.
 * All rights reserved.
 *
 * @file：sampling-manager-list-component
 * @summary：中介机构（律所）设置抽样模型 保理通（万科-龙光）项目管理共用该模块
 * @version: 1.0
 * **********************************************************************
 * revision             author            reason             date
 * 1.0                   hcy            抽样模型管理       2020-03-24
 * **********************************************************************
 */

import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { XnService } from 'libs/shared/src/lib/services/xn.service';
import { XnModalUtils } from 'libs/shared/src/lib/common/xn-modal-utils';
import { JsonTransForm } from 'libs/shared/src/lib/public/pipe/xn-json.pipe';
import { XnUtils } from 'libs/shared/src/lib/common/xn-utils';
import { XnFormUtils } from 'libs/shared/src/lib/common/xn-form-utils';
import { TabListOutputModel, SubTabListOutputModel, ButtonConfigModel } from 'libs/shared/src/lib/config/list-config-model';
import CommUtils from 'libs/shared/src/lib/public/component/comm-utils';
import { SamplingEditRuleComponent } from 'libs/shared/src/lib/public/dragon-vanke/modal/sampling-edit-rule.component';

@Component({
    selector: 'sampling-manager-list-component',
    templateUrl: `./samping-manager-list.component.html`,
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
        min-width: 60px;
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
    .center-block{
        clear: both;
        border-bottom: 1px solid #ccc;
        width: 43.9%;
        height: 1px;
    }
    .showClass{
        width: 12.5%;
        margin: 0 auto;
        border: 1px solid #ccc;
        text-align: center;
        border-top: 0px;
        clear:both;
        border-bottom-left-radius: 10px;
        border-bottom-right-radius: 10px;
    }
    `]
})
export class SamplingmanageComponent implements OnInit {
    tabConfig: any;
    // 默认激活第一个标签页 {do_not,do_down}
    label = 'do_not';
    public defaultValue = 'A';  // 默认激活第一个标签页

    // 数据
    data: any[] = [];
    // 页码配置
    pageConfig = {
        pageSize: 5,
        first: 0,
        total: 0,
    };
    // 搜索项
    shows: any[] = [];
    form: FormGroup;
    searches: any[] = []; // 面板搜索配置项项
    selectedItems: any[] = []; // 选中的项
    currentTab: any; // 当前标签页
    displayShow = true;
    arrObjs = {} as any; // 缓存后退的变量
    paging = 0; // 共享该变量
    public listInfo: any[] = []; // 数据
    sorting = ''; // 共享该变量
    naming = ''; // 共享该变量
    heads: any[];
    public currentSubTab: SubTabListOutputModel = new SubTabListOutputModel(); // 当前子标签页
    public subDefaultValue = 'DOING'; // 默认子标签页
    public formModule = 'dragon-input';

    public queryParams: any; // 路由参数
    public isRouteBack = false; // 路由返回

    constructor(
        private xn: XnService,
        private vcr: ViewContainerRef,
        private router: ActivatedRoute, ) {
    }

    ngOnInit(): void {

        // 路由参数
        this.router.queryParams.subscribe(v => {
            this.isRouteBack = Object.keys(v).length > 0 ? true : false;
            this.queryParams = this.isRouteBack ? v : {};
            this.defaultValue = this.isRouteBack ? this.queryParams.defaultValue : this.defaultValue;
        });

        this.router.data.subscribe(x => {
            this.tabConfig = x;
            this.initData(this.defaultValue, true);
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

    show() {
        this.displayShow = !this.displayShow;
    }

    /**
     *  查看使用此规则的模型
     * @param item 行内容
     */
    lookRuleModule(item: any) {
        const params = {
            type: 'view',
            ruleId: item.ruleId,
        };
        XnModalUtils.openInViewContainer(this.xn, this.vcr, SamplingEditRuleComponent, params)
            .subscribe((v: any) => { });
    }

    /**
     *  查看抽样规则
     * @param
     */
    lookRule(item: any) {
        this.xn.router.navigate(['/console/manage/sampling/look-newRule'], {
            queryParams: {
                ruleConfig: item.ruleConfig,
                ruleName: item.ruleName,
                ruleId: item.ruleId,
                ruleStatus: item.ruleStatus,
                pageing: this.paging
            }
        });
    }

    /**
     *  查看抽样模型
     * @param item 行信息
     */
    lookModule(item: any) {
        this.xn.router.navigate(['/console/manage/sampling/look-newModule'], {
            queryParams: {
                modelId: item.modelId,
                modelName: item.modelName,
                pageing: this.paging
            }
        });
    }

    /**
     *  列按钮
     * @param item
     */
    public handleRowClick(item: any, btn: ButtonConfigModel, i: number) {

        switch (btn.operate) {

            case 'edit-rule':
                this.editRule(item); // 修改规则
                break;

            case 'delete-rule':
                this.deleteRule(item); // 删除规则
                break;

            case 'edit-module':  // 修改模型
                this.xn.router.navigate(['/console/manage/sampling/add-newModule'],
                    { queryParams: { modelName: item.modelName, modelId: item.modelId, pageing: this.paging } }
                );
                break;

            case 'delete-module':  // 删除模型
                const params = { type: 'delete-module', modelName: item.modelName, modelId: item.modelId };
                XnModalUtils.openInViewContainer(this.xn, this.vcr, SamplingEditRuleComponent, params)
                    .subscribe((v: any) => {
                        if (v.action) { this.onPage({ page: this.paging }); }
                    });
                break;

            default:
                break;
        }
    }

    /**
     *  修改规则
     * @param item 行信息
     * @param
     */
    editRule(item: any) {
        if (item.ruleStatus === 0) { // 修改未使用规则
            this.xn.router.navigate(['/console/manage/sampling/add-newRule'],
                {
                    queryParams: {
                        ruleConfig: item.ruleConfig,
                        ruleName: item.ruleName,
                        ruleId: item.ruleId,
                        pageing: this.paging
                    }
                }
            );
        }
        if (item.ruleStatus === 1) { // 修改使用中规则
            const params = {
                type: 'edit',
                ruleId: item.ruleId,
            };
            XnModalUtils.openInViewContainer(this.xn, this.vcr, SamplingEditRuleComponent, params)
                .subscribe((v: any) => {
                    if (v.action) {
                        this.xn.router.navigate(['/console/manage/sampling/add-newRule'],
                            {
                                queryParams: {
                                    ruleConfig: item.ruleConfig,
                                    ruleName: item.ruleName,
                                    ruleId: item.ruleId,
                                    pageing: this.paging
                                }
                            }
                        );
                    }
                });
        }
    }

    /**
     *  删除规则
     * @param item 行信息
     * @param
     */
    deleteRule(item: any) {

        if (item.ruleStatus === 0) { // 删除未使用规则
            const params = {
                type: 'delete-unuse-rule',
                ruleId: item.ruleId,
                ruleName: item.ruleName,
            };
            XnModalUtils.openInViewContainer(this.xn, this.vcr, SamplingEditRuleComponent, params)
                .subscribe((v: any) => {
                    if (v.action) {
                        this.onPage({ page: this.paging });
                    }
                });
        }

        if (item.ruleStatus === 1) { // 删除使用中规则
            const params = {
                type: 'delete',
                ruleId: item.ruleId,
            };
            XnModalUtils.openInViewContainer(this.xn, this.vcr, SamplingEditRuleComponent, params)
                .subscribe((v: any) => {
                    if (v.action) {
                        this.onPage({ page: this.paging });
                    }
                });
        }
    }

    /**
      *  标签页，加载列表信息
      * @param paramTabValue
      * @param init 是否为初始加载，true 不检查切换属性值与当前标签值
      */
    public initData(paramTabValue: string, init?: boolean) {

        if (this.defaultValue === paramTabValue && !init) {
            return;
        } else { // 重置全局变量
            this.selectedItems = [];
            this.listInfo = [];
            this.naming = '';
            this.sorting = '';
            this.paging = 1;
            this.pageConfig = { pageSize: 5, first: 0, total: 0 };
        }
        this.defaultValue = paramTabValue;
        this.subDefaultValue = 'DOING'; // 重置子标签默认
        this.paging = this.isRouteBack ? Number(this.queryParams.pageing) : 0; // 路由参数查询
        this.pageConfig.first = this.isRouteBack ? (this.paging - 1) * this.pageConfig.pageSize : this.pageConfig.first; // 设置当前页码
        this.onPage({ page: this.paging });
    }

    /**
      * @param e  page: 新页码、 pageSize: 页面显示行数、first: 新页面之前的总行数、pageCount : 页码总数
      * @summary 采购融资，地产abs  请求api有区别，采购融资：avenger 、地产abs：api
      */
    public onPage(e?: { page: number, first?: number, pageSize?: number, pageCount?: number }) {
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
            this.listInfo = [];
            this.pageConfig.total = 0;
            return;
        }
        this.xn.loading.open();
        // 采购融资 ：avenger,  地产abs ：api
        this.xn.dragon.post(this.currentTab.post_url, params).subscribe(x => {
            if (x.data && x.data.data && x.data.data.length) {
                this.listInfo = x.data.data;
                this.pageConfig.total = x.data.count;
                return;
            } else {
                // 固定值
                this.listInfo = [];
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

    /**
     *  搜索,默认加载第一页
     */
    public searchMsg() {
        this.selectedItems = [];
        this.paging = 1;
        this.onPage({ page: this.paging });
    }

    /**
     * 重置
     */
    public reset() {
        this.selectedItems = [];
        for (const key in this.arrObjs) {
            if (this.arrObjs.hasOwnProperty(key)) {
                delete this.arrObjs[key];
            }
        }
        this.buildCondition(this.searches);
        this.searchMsg(); // 清空之后自动调一次search
    }

    /**
  *  子标签tab切换，加载列表
  * @param paramSubTabValue
  */
    public handleSubTabChange(paramSubTabValue: string) {

        if (this.subDefaultValue === paramSubTabValue) {
            return;
        } else {
            this.selectedItems = [];
            this.listInfo = [];
            this.naming = '';
            this.sorting = '';
            this.paging = 1;
            this.pageConfig = { pageSize: 10, first: 0, total: 0 };
            // 重置全局变量
        }
        this.onPage({ page: this.paging });
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
        const objList = [];
        for (let i = 0; i < searches.length; i++) {
            const obj = {} as any;
            obj.title = searches[i].title;
            obj.checkerId = searches[i].checkerId;
            obj.required = false;
            obj.type = searches[i].type;
            obj.number = searches[i].number;
            obj.options = searches[i].options;
            obj.value = this.arrObjs[searches[i].checkerId];
            objList.push(obj);
        }
        this.shows = $.extend(true, [], objList.sort(function(a, b) {
            return a.number - b.number;
        })); // 深拷贝，并排序;
        XnFormUtils.buildSelectOptions(this.shows);
        this.buildChecker(this.shows);
        this.form = XnFormUtils.buildFormGroup(this.shows);
        this.form.valueChanges.subscribe((v) => {
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
        const params: any = {
            start: (this.paging - 1) * this.pageConfig.pageSize,
            length: this.pageConfig.pageSize,
        };
        // 排序处理
        if (!!this.naming) {
            params.orderType = sortType[this.naming];
        }
        // 搜索处理
        if (this.searches.length > 0) {
            for (const search of this.searches) {
                if (!XnUtils.isEmpty(this.arrObjs[search.checkerId])) {
                    params[search.checkerId] = this.arrObjs[search.checkerId];
                }
            }
        }
        return params;
    }

    private buildChecker(stepRows: any) {
        for (const row of stepRows) {
            XnFormUtils.convertChecker(row);
        }
    }

    /**
     * 回退操作
     * @param data
     */
    private onUrlData(data?) {
        const urlData = this.xn.user.getUrlData(this.xn.router.url);
        if (urlData && urlData.pop) {
            this.paging = urlData.data.paging || this.paging;
            this.pageConfig = urlData.data.pageConfig || this.pageConfig;
            this.arrObjs = urlData.data.arrObjs || this.arrObjs;
            this.label = urlData.data.label || this.label;
        } else {
            this.xn.user.setUrlData(this.xn.router.url, {
                paging: this.paging,
                pageConfig: this.pageConfig,
                arrObjs: this.arrObjs,
                label: this.label
            });
        }
    }

    /**
     * 行按钮组事件
     * @param paramItem 当前行数据
     * @param paramBtnOperate 按钮操作配置
     * @param i 下标
     */
    public handleHeadClick(paramBtnOperate: ButtonConfigModel) {

        if (paramBtnOperate.operate === 'add-module') { // 新增抽样模型
            this.xn.router.navigate(['/console/manage/sampling/add-newModule']);
        }
        if (paramBtnOperate.operate === 'add-rule') { // 新增规则
            this.xn.router.navigate(['/console/manage/sampling/add-newRule']);
        }

    }

}

/**
 * 排序
 * @param asc 1 升序
 * @param desc 0 降序
 */
enum sortType {
    asc = 1,
    desc = 0
}
