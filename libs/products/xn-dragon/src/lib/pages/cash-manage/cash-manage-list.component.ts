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
 * 1.0                 congying            头寸管理            2020-05-05
 * **********************************************************************
 */

import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { XnService } from 'libs/shared/src/lib/services/xn.service';
import { BankManagementService } from 'libs/console/src/lib/bank-management/bank-mangement.service';
import { LocalStorageService } from 'libs/shared/src/lib/services/local-storage.service';
import { SubTabListOutputModel, TabListOutputModel, ButtonConfigModel } from 'libs/shared/src/lib/config/list-config-model';
import CommUtils from 'libs/shared/src/lib/public/component/comm-utils';
import { XnFormUtils } from 'libs/shared/src/lib/common/xn-form-utils';
import { XnUtils } from 'libs/shared/src/lib/common/xn-utils';
declare const $: any;

@Component({
    selector: 'cash-manage-list-component',
    templateUrl: `./cash-manage-list.component.html`,
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
        `
    ]
})
export class CashManageListComponent implements OnInit {

    public tabConfig: any; //
    public defaultValue = 'A';  // 默认激活第一个标签页
    public shows: any[] = []; // 搜索项
    heads: any[]; // 表头
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
            this.tabConfig = v;
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
        this.xn.loading.open();
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
        this.xn.api.post('/ljx/capital_pool/get', {
            length: 10,
            start: this.paging,
            where: {}
        }).subscribe(x => {
            this.listInfo = x.data.data;
            this.pageConfig.total = x.data.recordsTotal;
        }, () => {
            this.xn.loading.close();
        });

    }

    /**
     *  搜索,默认加载第一页
     */
    public searchMsg() {
        this.paging = 1;
        this.onPage({ page: this.paging });
    }

    /**
     * 重置
     */
    public reset() {
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
        this.shows = $.extend(true, [], searches); // 深拷贝;
        XnFormUtils.buildSelectOptions(this.shows);
        this.buildChecker(this.shows);
        this.form = XnFormUtils.buildFormGroup(this.shows);
        this.form.valueChanges.subscribe((v) => {
            this.onUrlData();
        });
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
     * 头按钮
     * @param btn
     */
    private handleHeadClick(btn: any) {
        // 新增头寸
        if (btn.operate === 'add-cash') {

        }
    }

    /**
      *  列按钮
      * @param item
      */
    public handleRowClick(btn: ButtonConfigModel) {
        if (btn.operate === 'edit-cash') { // 修改

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
            this.selectedItems = XnUtils.distinctArray2([...this.selectedItems, ...this.listInfo], 'tradNumber');
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
    public singleChecked(paramItem: any) {
        if (paramItem.checked && paramItem.checked === true) {
            paramItem.checked = false;
            this.selectedItems = this.selectedItems.filter((x: any) => x.mainFlowId !== paramItem.mainFlowId);
        } else {
            paramItem.checked = true;
            this.selectedItems.push(paramItem);
            this.selectedItems = XnUtils.distinctArray2(this.selectedItems, 'tradNumber'); // 去除相同的项
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
    private onUrlData() {

    }

}
