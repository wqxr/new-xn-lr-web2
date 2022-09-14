/*
 * Copyright(c) 2017-2019, 深圳市链融科技股份有限公司
 * Beijing Xiwei Technology Co., Ltd.
 * All rights reserved.
 *
 * @file：NewGemdaleTransferContractManagerComponent
 * @summary：金地-一次转让合同管理
 * @version: 1.0
 * **********************************************************************
 * revision             author            reason             date
 * 1.0                hucongying      一次转让合同管理      2020-12-03
 * **********************************************************************
 */

import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { XnService } from 'libs/shared/src/lib/services/xn.service';
import { BankManagementService } from 'libs/console/src/lib/bank-management/bank-mangement.service'; import { XnModalUtils } from 'libs/shared/src/lib/common/xn-modal-utils';
import { JsonTransForm } from 'libs/shared/src/lib/public/pipe/xn-json.pipe';
import { XnUtils } from 'libs/shared/src/lib/common/xn-utils';
import { XnFormUtils } from 'libs/shared/src/lib/common/xn-form-utils';
import { TabListOutputModel, SubTabListOutputModel, ButtonConfigModel } from 'libs/shared/src/lib/config/list-config-model';
import CommUtils from 'libs/shared/src/lib/public/component/comm-utils';
import { DragonMfilesViewModalComponent } from 'libs/shared/src/lib/public/dragon-vanke/modal/mfiles-view-modal.component';
import { DragonPdfSignModalComponent } from 'libs/shared/src/lib/public/dragon-vanke/modal/pdf-sign-modal.component';
import { HwModeService } from 'libs/shared/src/lib/services/hw-mode.service';
import * as moment from 'moment';
import { applyFactoringTtype, HeadquartersTypeEnum } from 'libs/shared/src/lib/config/select-options';
import { ContractManagerEnum } from 'libs/shared/src/lib/config/enum/common-enum';
declare const $:any;
import * as _ from 'lodash';

@Component({
    templateUrl: `./contract-template.component.html`,
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
    .file-view {
        max-height: 150px;
        overflow-y: auto;
    }
    `]
})
export class NewGemdaleTransferContractManagerComponent implements OnInit {
    tabConfig: any;
    // 默认激活第一个标签页 {do_not,do_down}
    label = 'do_not';
    public defaultValue = 'A';  // 默认激活第一个标签页
    // 数据
    data: any[] = [];
    // 页码配置
    pageConfig = {
        pageSize: 10,
        first: 0,
        total: 0,
    };
    // 搜索项
    shows        : any[] = [];
    form         : FormGroup;
    searches     : any[] = [];  // 面板搜索配置项项
    selectedItems: any[] = [];  // 选中的项
    currentTab   : any;         // 当前标签页

    arrObjs = {} as any;  // 缓存后退的变量
    paging  = 0;          // 共享该变量
    beginTime: any;
    endTime  : any;
    timeId         = [];
    nowTimeCheckId = '';
    // 上次搜索时间段
    preChangeTime: any[]          = [];
    public        listInfo: any[] = [];    // 数据
                  displayShow     = true;
                  sorting         = '';    // 共享该变量
                  naming          = '';    // 共享该变量
    heads: any[];
    public currentSubTab: SubTabListOutputModel = new SubTabListOutputModel();  // 当前子标签页
    public subDefaultValue                      = 'DOING';                      // 默认子标签页
    public formModule                           = 'dragon-input';
    tabValue:string;//判断是一次转让合同，还是二次转让合同

    constructor(
        private xn: XnService,
        private vcr: ViewContainerRef,
        public bankManagementService: BankManagementService,
        private router: ActivatedRoute,
        public hwModeService: HwModeService) {

    }

    ngOnInit(): void {
        this.router.data.subscribe(x => {
            this.tabConfig = x;
            this.tabValue=ContractManagerEnum[_.toUpper(x.value)];
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
    /**
     *  查看文件信息
     * @param paramFile
     */
    public viewFiles(paramFile) {
        XnModalUtils.openInViewContainer(this.xn, this.vcr, DragonMfilesViewModalComponent, [paramFile]).subscribe();
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
            this.listInfo      = [];
            this.naming        = '';
            this.sorting       = '';
            this.paging        = 1;
            this.pageConfig    = { pageSize: 10, first: 0, total: 0 };
        }
        this.defaultValue = paramTabValue;
        this.subDefaultValue = 'DOING'; // 重置子标签默认
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
        const params = this.buildParams(this.currentSubTab.params, this.currentTab.value);
        if (this.currentTab.post_url === '') {
            // 固定值
            this.listInfo = [];
            this.pageConfig.total = 0;
            return;
        }
        this.xn.loading.open();
        if (this.tabConfig.value === 'once_contract_manage' && this.defaultValue === 'B'
            || this.tabConfig.value === 'second_contract_manage' && this.defaultValue === 'A') {
            const init_url = 'once_contract_manage' && this.defaultValue === 'B' ? '/contract/first_contract_info/init_first_template' : '/contract/second_contract_info/init_second_template';
            this.xn.dragon.post(init_url, {}).subscribe(x => {
                this.requestInterface(params);
            });
        } else {
            this.requestInterface(params);
        }
    }

    /**
     * 请求接口
     */
    public requestInterface(params) {
        // 采购融资 ：avenger,  地产abs ：api
        this.xn.dragon.post(this.currentTab.post_url, params).subscribe(x => {
            if (x.data && x.data.data && x.data.data.length) {
                this.listInfo = x.data.data;
                if (x.data.recordsTotal === undefined) {
                    this.pageConfig.total = x.data.count;
                } else {
                    this.pageConfig.total = x.data.recordsTotal;
                }
            } else if (x.data && x.data.lists && x.data.lists.length) {
                this.listInfo = x.data.lists;
                this.pageConfig.total = x.data.count;
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
  *  子标签tab切换，加载列表
  * @param paramSubTabValue
  */
    public handleSubTabChange(paramSubTabValue: string) {

        if (this.subDefaultValue === paramSubTabValue) {
            return;
        } else {
            this.selectedItems = [];
            this.listInfo      = [];
            this.naming        = '';
            this.sorting       = '';
            this.paging        = 1;
            this.pageConfig    = { pageSize: 10, first: 0, total: 0 };
            // 重置全局变量
        }
        this.subDefaultValue = paramSubTabValue;
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
     *  判读列表项是否全部选中
     */
    public isAllChecked(): boolean {
        return !(this.listInfo.some(x => !x.checked || x.checked && x.checked === false) || this.listInfo.length === 0);
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
     *  查看合同，只读
     * @param con
     */
    public showContract(con,paramId:string) {
        const newId=con.contractId?con.contractId:paramId; // 获取合同编号
           this.xn.loading.open();
           this.xn.dragon.post('/contract/first_contract_info/get_first_temlate_file',{id:newId,type:this.tabValue}).subscribe(x=>{
               if(x.ret===0){
                   this.xn.loading.close();
                   const data=JSON.parse(x.data)[0];
                   const params = Object.assign({}, data, { readonly: true });
                   XnModalUtils.openInViewContainer(this.xn, this.vcr, DragonPdfSignModalComponent, params).subscribe(() => {
                   });
               }
           })

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
            const obj           = {} as any;
                  obj.title     = searches[i].title;
                  obj.checkerId = searches[i].checkerId;
                  obj.required  = false;
                  obj.type      = searches[i].type;
                  obj.number    = searches[i].number;
                  obj.options   = searches[i].options;
            if (searches[i].checkerId === this.timeId[0]) {
                obj.value = JSON.stringify(tmpTime);
            } else {
                obj.value = this.arrObjs[searches[i].checkerId];
            }
            objList.push(obj);
        }
        this.shows = $.extend(true, [], objList.sort(function (a, b) {
            return a.number - b.number;
        })); // 深拷贝，并排序;
        XnFormUtils.buildSelectOptions(this.shows);
        this.buildChecker(this.shows);
              this.form           = XnFormUtils.buildFormGroup(this.shows);
        const time                = this.searches.filter(v => v.type === 'quantum');
        const timeCheckId         = time[0] && time[0].checkerId;
              this.nowTimeCheckId = timeCheckId;
        this.form.valueChanges.subscribe((v) => {
            // 时间段
            const changeId = v[timeCheckId];
            // delete v[timeCheckId];
            if (changeId !== '' && this.nowTimeCheckId) {
                const paramsTime = JSON.parse(changeId);
                const beginTime  = paramsTime.beginTime;
                const endTime    = paramsTime.endTime;
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
                        this.endTime   = endTime;
                        this.paging    = 1;
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
        *  全选
        */
    public checkAll() {
        if (!this.isAllChecked()) {
            this.listInfo.forEach(item => item.checked = true);
            this.selectedItems = XnUtils.distinctArray2([...this.selectedItems, ...this.listInfo], 'mainFlowId');
        } else {
            this.listInfo.forEach(item => item.checked = false);
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
    /**
     * 构建参数
     */
    private buildParams(flag, type) {
        // 分页处理
        const params: any = {
            start: (this.paging - 1) * this.pageConfig.pageSize,
            length: this.pageConfig.pageSize,
        };
        // 排序处理
        if (this.sorting && this.naming) {
            params.order = [this.sorting + ' ' + this.naming];
        }
        // 搜索处理
        if (this.searches.length > 0) {
            for (const search of this.searches) {
                if (!XnUtils.isEmpty(this.arrObjs[search.checkerId])) {
                    params[search.checkerId] = this.arrObjs[search.checkerId];
                }
            }
        }
        params['factoringAppId'] = applyFactoringTtype['深圳市柏霖汇商业保理有限公司'];
        params['headquarters'] = HeadquartersTypeEnum[2]
        params.isProxy = 56;
        return params;
    }

    private buildChecker(stepRows) {
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
            this.paging     = urlData.data.paging || this.paging;
            this.pageConfig = urlData.data.pageConfig || this.pageConfig;
            this.beginTime  = urlData.data.beginTime || this.beginTime;
            this.endTime    = urlData.data.endTime || this.endTime;
            this.arrObjs    = urlData.data.arrObjs || this.arrObjs;
            this.label      = urlData.data.label || this.label;
        } else {
            this.xn.user.setUrlData(this.xn.router.url, {
                paging    : this.paging,
                pageConfig: this.pageConfig,
                beginTime : this.beginTime,
                endTime   : this.endTime,
                arrObjs   : this.arrObjs,
                label     : this.label
            });
        }
    }
    show() {
        this.displayShow = !this.displayShow;
    }
    /**
     * 头按钮组事件
     * @param paramItem 当前行数据
     * @param paramBtnOperate 按钮操作配置
     * @param i 下标
     */
    public handleHeadClick(paramBtnOperate: ButtonConfigModel) {
        paramBtnOperate.click(this.xn, []);
    }
    /**
     * 行按钮组事件
     * @param item 当前行数据
     * @param btn {label:string,operate:string,value:string,value2?:string}
     * @param i 下标
     */
    public handleRowClick(item, btn: ButtonConfigModel, i: number) {
        const mainFlowIds = item.id;
        switch (btn.operate) {
            // 修改
            case 'sub_first_contract_modify':
                btn.click(this.xn, mainFlowIds);
                break;
            // 删除
            case 'sub_first_contract_delete':
                btn.click(this.xn, mainFlowIds);
                break;
        }
    }
}
