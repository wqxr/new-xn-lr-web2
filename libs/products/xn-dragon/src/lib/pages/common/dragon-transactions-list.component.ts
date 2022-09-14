/*
 * Copyright(c) 2017-2019, 深圳市链融科技股份有限公司
 * Beijing Xiwei Technology Co., Ltd.
 * All rights reserved.
 *
 * @file：comfirm-information-index-component
 * @summary：多标签页列表项 根据tab-pane.ts中的配置
 * @version: 1.0
 * **********************************************************************
 * revision             author            reason             date
 * 1.0                 zhyuanan          添加注释         2019-04-11
 * 1.1                 zhyuanan          点击表头可按列排序  2019-04-11
 * **********************************************************************
 */

import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { XnService } from 'libs/shared/src/lib/services/xn.service';
import { LocalStorageService } from 'libs/shared/src/lib/services/local-storage.service';
import { XnModalUtils } from 'libs/shared/src/lib/common/xn-modal-utils';
import { JsonTransForm } from 'libs/shared/src/lib/public/pipe/xn-json.pipe';
import { ButtonConfigModel } from 'libs/shared/src/lib/config/list-config-model';
import { FileViewModalComponent } from 'libs/shared/src/lib/public/modal/file-view-modal.component';
import { SingleListParamInputModel, SingleSearchListModalComponent } from 'libs/shared/src/lib/public/dragon-vanke/modal/single-searchList-modal.component';
import { XnUtils } from 'libs/shared/src/lib/common/xn-utils';
import { PdfSignModalComponent } from 'libs/shared/src/lib/public/modal/pdf-sign-modal.component';
import { XnFormUtils } from 'libs/shared/src/lib/common/xn-form-utils';
import { HwModeService } from 'libs/shared/src/lib/services/hw-mode.service';
import CommBase from 'libs/shared/src/lib/public/component/comm-base';
import { MachineInvoiceListComponent } from 'libs/shared/src/lib/public/dragon-vanke/modal/machine-invoice-list-modal.component';
import { HeadquartersTypeEnum } from 'libs/shared/src/lib/config/select-options';

@Component({
    selector: 'app-comfirm-information-index-component',
    templateUrl: `./dragon-transactions-list.component.html`,
    styles: [`
        .title {
            width: 100px;
        }

        .label {
            font-weight: normal;
            flex: 1;
        }

        .flex {
            display: flex;
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
export class DragonTransactionsListComponent implements OnInit {
    tabConfig: any;
    // 默认激活第一个标签页 {do_not,do_down}
    label = 'do_not';
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
    // 上次搜索时间段
    preChangeTime: any[] = [];
    public formModule = 'dragon-input';
    sorting = ''; // 共享该变量
    naming = ''; // 共享该变量
    displayShow = true;
    base: CommBase;
    public yjlSelectItems: any[] = [];
    public notYjlSelectItems: any[] = [];
    constructor(private xn: XnService,
                private vcr: ViewContainerRef,
                public hwModeService: HwModeService,
                private router: ActivatedRoute,
                private localStorageService: LocalStorageService) {
    }

    ngOnInit(): void {
        this.router.data.subscribe(x => {
            this.tabConfig = x;
            this.initData(this.label);
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
        XnModalUtils.openInViewContainer(this.xn, this.vcr, FileViewModalComponent, paramFile).subscribe();
    }
    /**
     *  加载信息
     * @param val
     */
    public initData(val: string) {
        if (this.label !== val) {
            this.selectedItems = []; // 切换标签页是清空选中的项
            this.naming = '';
            this.sorting = '';
        }
        this.label = val;
        this.onPage({ page: this.paging });
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
        this.currentTab = this.tabConfig.tabList.find((x: any) => x.value === this.label); // 当前标签页
        this.searches = this.currentTab.searches; // 当前标签页的搜索项
        this.buildShow(this.searches);
        // 构建参数
        const params = this.buildParams();
        if (this.currentTab.get_url === '') {
            // 固定值
            this.data = [];
            this.pageConfig.total = 0;
            return;
        }
        this.xn.loading.open();
        this.xn.dragon.post(this.currentTab.get_url, params).subscribe(x => {
            if (x.data && x.data.data && x.data.data.length) {
                this.data = x.data.data;
                this.pageConfig.total = x.data.count;
                this.data.forEach(item => item.receive = item.receive.toFixed(2));
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
    show() {
        this.displayShow = !this.displayShow;
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
        console.log('paramsKey====>', paramsKey);
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
            this.selectedItems = XnUtils.distinctArray2([...this.selectedItems, ...this.data], 'mainFlowId');
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
            this.selectedItems = this.selectedItems.filter((x: any) => x.mainFlowId !== item.mainFlowId);
        } else {
            item.checked = true;
            this.selectedItems.push(item);
            this.selectedItems = XnUtils.distinctArray2(this.selectedItems, 'mainFlowId'); // 去除相同的项
        }

    }

    /**
     *  查看合同，只读
     * @param con
     */
    public showContract(con) {
        const params = Object.assign({}, con, { readonly: true });
        XnModalUtils.openInViewContainer(this.xn, this.vcr, PdfSignModalComponent, params).subscribe(() => {
        });
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
            obj.number = searches[i].number;
            obj.options = searches[i].options;
            if (searches[i].checkerId === this.timeId[0]) {
                obj.value = JSON.stringify(tmpTime);
            } else {
                obj.value = this.arrObjs[searches[i].checkerId];
            }
            objList.push(obj);
        }
        this.shows = $.extend(true, [], objList.sort(function(a, b) {
            return a.number - b.number;
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
                    if (search.checkerId === 'status') {
                        const obj = JSON.parse(this.arrObjs[search.checkerId]);
                        if (obj.isProxy !== 14 && obj.isProxy !== 6) {
                            params.isProxy = obj.isProxy;
                            if (Number(obj.tradeStatus) === 99) {
                                params.retreatStatus = 0;
                                params.status = Number(obj.tradeStatus);

                            } else if (Number(obj.tradeStatus) === 100) {
                                params.status = 99;
                                params.retreatStatus = 4;

                            } else {
                                params.flowId = obj.tradeStatus;
                            }
                        } else {
                            params.isProxy = obj.isProxy;
                            params.status = Number(obj.tradeStatus);
                        }

                        // params = Object.assign(params, obj);
                    } else if (search.checkerId === 'createTime') {
                        const date = JSON.parse(this.arrObjs[search.checkerId]);
                        params.beginTime = date.beginTime;
                        params.endTime = date.endTime;
                    } else {
                        params[search.checkerId] = this.arrObjs[search.checkerId];
                    }
                }
            }
        }
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
    private onUrlData() {
        const urlData = this.xn.user.getUrlData(this.xn.router.url);
        if (urlData && urlData.pop) {
            this.paging = urlData.data.paging || this.paging;
            this.pageConfig = urlData.data.pageConfig || this.pageConfig;
            this.beginTime = urlData.data.beginTime || this.beginTime;
            this.endTime = urlData.data.endTime || this.endTime;
            this.arrObjs = urlData.data.arrObjs || this.arrObjs;
            this.label = urlData.data.label || this.label;
        } else {
            this.xn.user.setUrlData(this.xn.router.url, {
                paging: this.paging,
                pageConfig: this.pageConfig,
                beginTime: this.beginTime,
                endTime: this.endTime,
                arrObjs: this.arrObjs,
                label: this.label
            });
        }
    }

    /**
     * 保理商 对标准保理补充信息
     */
    public supplementTransInfo() {
        if (this.selectedItems.length < 1) {
            this.xn.msgBox.open(false, '请选择交易');
            return false;
        }
        this.yjlSelectItems = this.selectedItems.filter(x => String(x.isProxy) === '6' && x.headquarters === HeadquartersTypeEnum[3]); // 雅居乐业务
        this.notYjlSelectItems = this.selectedItems.filter(x => String(x.isProxy) !== '6' || x.headquarters !== HeadquartersTypeEnum[3]); // 非雅居乐业务
        if (this.yjlSelectItems.length > 0) {
            if (this.yjlSelectItems.some(x => (!x.factoringEndDate || x.factoringEndDate === '' || x.factoringEndDate === '0')
                || (!x.discountRate || x.discountRate === ''))) {
                if (this.notYjlSelectItems.length > 0) {
                    this.xn.msgBox.open(false, [
                        '您选择的交易，存在' + this.notYjlSelectItems.length + '笔非雅居乐交易',
                        ...this.notYjlSelectItems.map(o => o.mainFlowId),
                        '将不能进行"补充信息"操作'
                    ], () => {
                        this.localStorageService.setCacheValue('staySupplementSelected', this.yjlSelectItems);
                        this.xn.router.navigate(['console/standard_factoring/trans_lists/supplement_info']);
                    });
                } else {
                    this.localStorageService.setCacheValue('staySupplementSelected', this.yjlSelectItems);
                    this.xn.router.navigate(['console/standard_factoring/trans_lists/supplement_info']);
                }

            } else {
                this.xn.msgBox.open(false, `无需要补充项`, () => {
                    // 取消选中状态
                    this.data.forEach(item => item.checked = false);
                    this.selectedItems = [];
                });
            }
        } else {
            this.xn.msgBox.open(false, [
                '您选择的交易，存在' + this.notYjlSelectItems.length + '笔非雅居乐交易',
                ...this.notYjlSelectItems.map(o => o.mainFlowId),
                '不能进行"补充信息"操作'
            ], () => {
                // 取消选中状态
                this.data.forEach(item => item.checked = false);
                this.selectedItems = [];
            });
        }

    }

    /**
     * 行按钮组事件
     * @param item 当前行数据
     * @param btn {label:string,operate:string,value:string,value2?:string}
     * @param i 下标
     */
    public handleRowClick(item, paramBtnOperate: ButtonConfigModel) {
        // let mainFlowId = this.selectedItems.find((x: any) => x.mainFlowId);
        paramBtnOperate.click(this.base, item, this.xn, this.hwModeService);
    }

    // 查看发票详情
    handlerowInvoiceClick(item) {
        if (item.isProxy === 50 || item.isProxy === 52 || item.isProxy === 53) {
            XnModalUtils.openInViewContainer(
                this.xn,
                this.vcr,
                MachineInvoiceListComponent,
                { mainFlowId: item.mainFlowId }
            ).subscribe(() => {
            });
        } else {
            this.xn.api.post('/llz/risk_warning/invoice_management/invoice_all', { mainFlowId: item.mainFlowId }).subscribe(x => {
                // 打开弹框
                const params: SingleListParamInputModel = {
                    title: '发票详情',
                    get_url: '',
                    get_type: '',
                    multiple: null,
                    heads: [
                        { label: '发票代码', value: 'invoiceCode', type: 'text' },
                        { label: '发票号码', value: 'invoiceNum', type: 'text' },
                        { label: '发票含税金额', value: 'invoiceAmount', type: 'money' },
                        { label: '发票转让金额', value: 'transferMoney', type: 'money' },
                        // { label: '发票文件', value: 'invoiceFile',type: 'file' },
                    ],
                    searches: [],
                    key: 'invoiceCode',
                    data: x.data || [],
                    total: x.data.length || 0,
                    inputParam: {
                        mainFlowId: item.mainFlowId
                    },
                    rightButtons: [{label: '确定', value: 'submit'}]
                };
                XnModalUtils.openInViewContainer(this.xn, this.vcr, SingleSearchListModalComponent, params).subscribe(v => {
                    if (v === null) {
                        return;
                    }
                });
            });
        }

    }
}
