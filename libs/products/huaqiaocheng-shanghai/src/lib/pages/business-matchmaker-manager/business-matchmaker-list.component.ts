/*
 * Copyright(c) 2017-2020, 深圳市链融科技股份有限公司
 * Beijing Xiwei Technology Co., Ltd.
 * All rights reserved.
 *
 * @file：comfirm-information-index-component
 * @summary：多标签页列表项 根据tab-pane.ts中的配置
 * @version: 1.0
 * **********************************************************************
 * revision             author              reason                date
 * 1.0                 congying          业务对接人配置         2020-05-04
 * **********************************************************************
 */

import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { XnService } from 'libs/shared/src/lib/services/xn.service';
import { LocalStorageService } from 'libs/shared/src/lib/services/local-storage.service';
import { SubTabListOutputModel, TabListOutputModel, TabConfigModel } from 'libs/shared/src/lib/config/list-config-model';
import CommUtils from 'libs/shared/src/lib/public/component/comm-utils';
import { XnFormUtils } from 'libs/shared/src/lib/common/xn-form-utils';
import { XnUtils } from 'libs/shared/src/lib/common/xn-utils';
import { XnModalUtils } from 'libs/shared/src/lib/common/xn-modal-utils';
import BusinessMatchmakerList from '../../logic/business-matchmaker';
import { BankManagementService } from 'libs/console/src/lib/bank-management/bank-mangement.service';
import { ShangHaiBusinessMatchmakerChooseComponent } from 'libs/products/bank-shanghai/src/lib/share/modal/business-choose-matchmaker-modal.component';

@Component({
    selector: 'oct-business-matchmaker-list-component',
    templateUrl: `./business-matchmaker-list.component.html`,
    styleUrls: ['./business-matchmaker-list.component.css']
})
export class OctBusinessMatchmakerListComponent implements OnInit {

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


    constructor(private xn: XnService,
                private vcr: ViewContainerRef,
                public bankManagementService: BankManagementService,
                private router: ActivatedRoute,
                private localStorageService: LocalStorageService) {
    }

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
                name: MatchmakerListOrderEnum[XnUtils.string2FirstUpper(this.sorting)],
                asc: BusinessMatchmakerSort[XnUtils.string2FirstUpper(this.naming)],
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
                    if (this.currentTab.params === 1) { // 市场部对接人
                        if (search.checkerId === 'isMarket') {
                            params[search.checkerId] = Number(JSON.parse(this.arrObjs[search.checkerId]).status);
                        }
                        if (search.checkerId === 'isMarket' && JSON.parse(this.arrObjs[search.checkerId]).status === '1') {
                            if (JSON.parse(this.arrObjs[search.checkerId]).text !== '') {
                                params.marketName = JSON.parse(this.arrObjs[search.checkerId]).text;
                            }
                        }
                    } else { // 运营部对接人
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
        }
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
            XnModalUtils.openInViewContainer(this.xn, this.vcr, ShangHaiBusinessMatchmakerChooseComponent, params)
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
            XnModalUtils.openInViewContainer(this.xn, this.vcr, ShangHaiBusinessMatchmakerChooseComponent, params)
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

/** 排序名： 键为字段名，故用小写 */
enum MatchmakerListOrderEnum {
    UpdateTime = 1,
    DebtUnitCount = 2,
}
// 排序方式
enum BusinessMatchmakerSort {
    Asc = 0, // 升序
    Desc = 1 // 降序
}

// 不同角色-tabConfig
enum RoleList {
    MachineAccount = 3, // 保理商
    PlatmachineAccount = 99 // 平台
}
