/*
 * Copyright(c) 2017-2020, 深圳市链融科技股份有限公司
 * Beijing Xiwei Technology Co., Ltd.
 * All rights reserved.
 *
 * @file：BusinessMatchmakerListComponent
 * @summary：碧桂园-业务对接人配置(运营部对接人)
 * @version: 1.0
 * **********************************************************************
 * revision             author              reason                date
 * 1.0                hucongying         碧桂园数据对接          2020-10-29
 * **********************************************************************
 */

import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { XnService } from 'libs/shared/src/lib/services/xn.service';
import { SubTabListOutputModel, TabListOutputModel, TabConfigModel } from 'libs/shared/src/lib/config/list-config-model';
import CommUtils from 'libs/shared/src/lib/public/component/comm-utils';
import { XnFormUtils } from 'libs/shared/src/lib/common/xn-form-utils';
import { XnUtils } from 'libs/shared/src/lib/common/xn-utils';
import { XnModalUtils } from 'libs/shared/src/lib/common/xn-modal-utils';
import { BusinessMatchmakerChooseComponent } from 'libs/shared/src/lib/public/dragon-vanke/modal/business-choose-matchmaker-modal.component';
import BusinessMatchmakerList from './business-matchmaker';
import { HeadquartersTypeEnum } from 'libs/shared/src/lib/config/select-options';
declare const $: any;

@Component({
    templateUrl: `./business-matchmaker-list.component.html`,
    styles: [
        `
        item-box {
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
        .disabled {
            pointer-events: none;
            filter: alpha(opacity=50); /*IE滤镜，透明度50%*/
            -moz-opacity: 0.5; /*Firefox私有，透明度50%*/
            opacity: 0.5; /*其他，透明度50%*/
        }
        tbody tr:hover {
            background-color: #e6f7ff;
            transition: all 0.1s linear
          }
        `
    ]
})
export class BusinessMatchmakerListComponent implements OnInit {

    public arrObjs = {} as any; // 缓存后退的变量
    private sortObjs = []; // 缓存后退的排序项
    private sorting = ''; // 共享该变量 列排序
    private naming = ''; // 共享该变量 列css样式
    public tabConfig: TabConfigModel; //
    public defaultValue = 'A';  // 默认激活第一个标签页
    public shows: any[] = []; // 搜索项
    public heads: any[]; // 表头
    public form: FormGroup;
    public searches: any[] = []; // 面板搜索配置项
    public currentSubTab: SubTabListOutputModel = new SubTabListOutputModel(); // 当前子标签页
    public currentTab: any; // 当前标签页
    public subDefaultValue = 'DOING'; // 默认子标签页
    public formModule = 'dragon-input';
    // 页码配置
    public pageConfig = {
        pageSize: 10,
        first: 0,
        total: 0,
    };
    public paging = 0;
    public listInfo: any[] = []; // 表格数据
    public selectedItems: any[] = []; // 选中项


    constructor(
        private xn: XnService,
        private vcr: ViewContainerRef,
        private router: ActivatedRoute) { }

    ngOnInit(): void {

        this.router.data.subscribe(v => {
            this.tabConfig = BusinessMatchmakerList.getConfig(RoleList[this.xn.user.orgType]);
            this.initData(this.defaultValue);
        });

    }


    /**
   *  标签页，加载列表信息
   * @param paramTabValue
   * @param init 是否为初始加载，true 不检查切换属性值与当前标签值
   */
    public initData(paramTabValue: string, init?: boolean) {
        this.defaultValue = paramTabValue;
        this.subDefaultValue = 'DOING'; // 重置子标签默认
        this.onPage({ page: this.paging });
    }

    /**
     * @param e  page: 新页码、 pageSize: 页面显示行数、first: 新页面之前的总行数、pageCount : 页码总数
     * @summary
     */
    public onPage(e?: { page: number, first?: number, pageSize?: number, pageCount?: number }) {
        this.selectedItems = [];
        this.xn.loading.open();
        this.paging = e.page || 1;
        this.onUrlData(); // 导航回退取值
        if (this.sortObjs.length !== 0) {
            this.sorting = MatchmakerListOrderEnum[this.sortObjs[0].name];
            this.naming = BusinessMatchmakerSort[this.sortObjs[0].asc];
        }
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
        const params = this.buildParams();
        this.xn.dragon.post(this.currentTab.post_url, params).subscribe(x => {
            this.listInfo = x.data.data;
            this.listInfo.forEach(x => { // 没有配置更新人的 不展示更新时间
                if (x.updateName === '') {
                    x.updateTime = 0;
                }
            });
            this.pageConfig.total = x.data.count;
        }, () => {
            this.xn.loading.close();
        });

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
        this.sortObjs = [
            {
                name: MatchmakerListOrderEnum[this.sorting],
                asc: BusinessMatchmakerSort[this.naming],
            }
        ];
        this.onPage({ page: this.paging });
    }

    /**
     *  搜索,默认加载第一页
     */
    public searchMsg() {
        this.paging = 1;
        this.pageConfig.first = 0;
        this.onPage({ page: this.paging });
    }

    /**
     * 重置
     */
    public reset() {
        for (const key in this.arrObjs) {
            if (this.arrObjs.hasOwnProperty(key)) {
                delete this.arrObjs[key];
            }
        }
        this.buildCondition(this.searches);
        this.searchMsg(); // 清空之后自动调一次search
    }

    /**
     * 构建搜索项
     * @param searches
     */
    private buildShow(searches: any) {
        this.shows = [];
        this.onUrlData();
        this.buildCondition(searches);
    }

    /**
     * 搜索项值格式化
     * @param searches
     */
    private buildCondition(searches: any) {
        const objList = [];
        for (let i = 0; i < searches.length; i++) {
            const obj = {} as any;
            obj.title = searches[i].title;
            obj.checkerId = searches[i].checkerId;
            obj.required = false;
            obj.type = searches[i].type;
            obj.options = searches[i].options;
            obj.value = this.arrObjs[searches[i].checkerId];
            objList.push(obj);
        }
        this.shows = $.extend(true, [], objList); // 深拷贝
        XnFormUtils.buildSelectOptions(this.shows);
        this.buildChecker(this.shows);
        this.form = XnFormUtils.buildFormGroup(this.shows);
        this.form.valueChanges.subscribe((v) => {
            const arrObj = {} as any;
            for (const item in v) {
                if (v.hasOwnProperty(item) && v[item] !== '') {
                    arrObj[item] = v[item];
                }
            }
            this.arrObjs = $.extend(true, {}, arrObj); // 深拷贝;要进行搜索的变量
            this.onUrlData();
        });
    }

    /**
     * 构建列表请求参数
     */
    private buildParams() {

        const params: any = {
            start: (this.paging - 1) * this.pageConfig.pageSize,
            length: this.pageConfig.pageSize,
        };

        // 排序处理
        if (this.sortObjs.length !== 0) {
            params.orderList = [
                {
                    name: this.sorting,
                    value: this.sortObjs[0].asc,
                }
            ];
        }
        // 搜索处理
        if (this.searches.length > 0) {
            for (const search of this.searches) {
                if (!XnUtils.isEmpty(this.arrObjs[search.checkerId])) {
                    params[search.checkerId] = this.arrObjs[search.checkerId];
                    // 运营部对接人
                    if (search.checkerId === 'isOperator') {
                        params[search.checkerId] = Number(JSON.parse(this.arrObjs[search.checkerId]).status);
                    }
                    if (search.checkerId === 'isOperator' && JSON.parse(this.arrObjs[search.checkerId]).status === '1') {
                        if (JSON.parse(this.arrObjs[search.checkerId]).text !== '') {
                            params.operatorName = JSON.parse(this.arrObjs[search.checkerId]).text;
                        }
                    }
                    if (search.checkerId === 'debtUnitCount') {
                        delete params[search.checkerId];
                        params.debtUnitCountStart = Number(JSON.parse(this.arrObjs[search.checkerId]).firstValue);
                        if (JSON.parse(this.arrObjs[search.checkerId]).secondValue !== '') {
                            params.debtUnitCountEnd = Number(JSON.parse(this.arrObjs[search.checkerId]).secondValue);
                        }
                    }

                }
            }
        }
        params['headquarters'] = HeadquartersTypeEnum[9]
        return params;
    }

    /**
     * 构建表单check项
     * @param stepRows
     */
    private buildChecker(stepRows: any) {
        for (const row of stepRows) {
            XnFormUtils.convertChecker(row);
        }
    }

    /**
     * 批量操作
     * @param btn
     */
    private handleHeadClick(btn: any) {
        // 选择市场部对接人
        if (btn.operate === 'select-marklinker') {
            if (this.selectedItems.length < 1) {
                this.xn.msgBox.open(false, '请勾选列表');
                return false;
            }
            const idList = this.selectedItems.map(x => {
                return x.id;
            });
            const params = {
                type: 'select-marklinker',
                idList
            };
            XnModalUtils.openInViewContainer(this.xn, this.vcr, BusinessMatchmakerChooseComponent, params)
                .subscribe((v) => {
                    this.reset();
                    this.selectedItems = [];
                });
        }
        // 选择运营部对接人
        if (btn.operate === 'select-operalinker') {
            if (this.selectedItems.length < 1) {
                this.xn.msgBox.open(false, '请勾选列表');
                return false;
            }
            const idList = this.selectedItems.map(x => {
                return x.id;
            });
            const params = {
                type: 'select-operalinker',
                idList
            };
            XnModalUtils.openInViewContainer(this.xn, this.vcr, BusinessMatchmakerChooseComponent, params)
                .subscribe((v) => {
                    this.reset();
                    this.selectedItems = [];
                });
        }
    }

    /**
     *  判读列表项是否全部选中
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
            this.selectedItems = XnUtils.distinctArray2([...this.selectedItems, ...this.listInfo], 'id');
        } else {
            this.listInfo.forEach(item => item.checked = false);
            this.selectedItems = [];
        }
    }

    /**
    * 单选
    * @param paramItem 行info
    * @param index 行下标
    */
    public singleChecked(paramItem: any, index: number) {
        if (paramItem.checked && paramItem.checked === true) {
            paramItem.checked = false;
            this.selectedItems = this.selectedItems.filter((x: any) => x.mainFlowId !== paramItem.mainFlowId);
        } else {
            paramItem.checked = true;
            this.selectedItems.push(paramItem);
            this.selectedItems = XnUtils.distinctArray2(this.selectedItems, 'id'); // 去除相同的项
        }

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
     * 回退操作
     * @param data
     */
    private onUrlData(data?: any) {

    }

}

// 排序名
enum MatchmakerListOrderEnum {
    updateTime = 1,
    debtUnitCount = 2,
}
// 排序方式
enum BusinessMatchmakerSort {
    asc = 0, // 升序
    desc = 1 // 降序
}

// 不同角色-tabConfig
enum RoleList {
    machineAccount = 3, // 保理商
    platmachineAccount = 99 // 平台
}
