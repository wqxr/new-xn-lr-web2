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
 * 1.0                 wangqing          CFCA企业列表         2020-09-20

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
import { ChangeCfcaCompanyComponent } from 'libs/shared/src/lib/public/modal/change-companydetail-cfca.component';
import { CancellationCompanyModalComponent } from 'libs/shared/src/lib/public/modal/cancellation-company-cfca-modal.component';
import { NzDemoModalBasicComponent } from 'libs/shared/src/lib/public/modal/cfca-result-modal.component';

@Component({
    selector: 'cfca-list',
    templateUrl: `./cfca-company-list.component.html`,
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
export class CfcaCompanyListComponent implements OnInit {
    tabConfig: any;
    // 默认激活第一个标签页 {do_not,do_down}
    label = 'A';
    // 数据
    listInfo: any[] = [];
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
    heads: any[] = [];
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

    downLoad() {
        const params = this.buildParams();
        this.xn.dragon.download('/cfca/down_list', params).subscribe(
            (v: any) => {
                this.xn.loading.close();
                this.xn.api.dragon.save(v._body, 'cfca企业列表附件.xlsx');
            }
        );
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
        this.heads = this.currentTab.headText;
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
        this.xn.dragon.post(this.currentTab.post_url, params).subscribe(x => {
            if (x.data && x.data.data && x.data.data.length) {
                this.listInfo = x.data.data;
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
     *  全选
     * @param e
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
        this.shows = $.extend(true, [], objList.sort(function (a, b) {
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
            pageNo: this.paging,
            pageSize: this.pageConfig.pageSize,
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
                        params[search.checkerId] = Number(this.arrObjs[search.checkerId]);
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
    // 查验
    operate(item) {
        const successinfo = {
            title: '查验结果',
            okButton: '确定',
            cancelButton: null,
            img: '',
            info: '查验成功',
            reason: '',
            text: '',
        }
        // 修改中
        if (item.status === 7) {
            this.xn.api.dragon.post('/cfca/check_status_info', { id: item.id }).subscribe(x => {
                if (x.ret === 0) {
                    if (x.data && x.data.authFile) {
                        XnModalUtils.openInViewContainer(this.xn, this.vcr, ChangeCfcaCompanyComponent,
                            {
                                type: 2,
                                id: item.id,
                                getTime: item.createTime,
                                userName: item.userName,
                                authFile: x.data.authFile,
                                businessLicenseFile: x.data.businessLicenseFile,
                                changeFile: x.data.changeFile,
                            }).subscribe(v => {
                                if (v && v.action === 'search') {
                                    this.xn.dragon.post('/cfca/check_status', { id: item.id }).subscribe(x => {
                                        if (x.ret === 0) {
                                            XnModalUtils.openInViewContainer(this.xn, this.vcr, NzDemoModalBasicComponent, successinfo)
                                                .subscribe(ret => {
                                                    if (ret && ret.action === 'ok') {
                                                        this.onPage({ page: this.paging });
                                                    }
                                                });
                                        }
                                    });
                                }

                            });
                    }
                }
            });
        } else if (item.status === 8) { // 注销中
            this.xn.api.dragon.post('/cfca/check_status_info', { id: item.id }).subscribe(x => {
                if (x.ret === 0) {
                    if (x.data && x.data.authFile) {
                        XnModalUtils.openInViewContainer(this.xn, this.vcr, CancellationCompanyModalComponent,
                            {
                                type: 2,
                                id: item.id,
                                getTime: item.createTime,
                                userName: item.userName,
                                authFile: x.data.authFile,
                                businessLicenseFile: x.data.businessLicenseFile
                            }).subscribe(v => {
                                if (v && v.action === 'search') {
                                    this.xn.dragon.post('/cfca/check_status', { id: item.id }).subscribe(x => {
                                        if (x.ret === 0) {
                                            XnModalUtils.openInViewContainer(this.xn, this.vcr, NzDemoModalBasicComponent, successinfo)
                                                .subscribe(ret => {
                                                    if (ret && ret.action === 'ok') {
                                                        this.onPage({ page: this.paging });
                                                    }
                                                });
                                        }
                                    });
                                }
                            });
                    }
                }
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

    public calcAttrColspan(tabconfig): number {
        const nums: number = tabconfig.headText.length + 2;
        return nums;
    }
    //  查看数字证书变更记录
    view(paramId: number) {
        this.xn.api.dragon.post('/cfca/history_record', { id: paramId }).subscribe(x => {
            // 打开弹框
            const params: SingleListParamInputModel = {
                title: '数字证书变更记录',
                get_url: '',
                get_type: '',
                multiple: null,
                heads: [
                    { label: '操作人', value: 'updateUserName', type: 'text' },
                    { label: '操作时间', value: 'createTime', type: 'date' },
                    { label: '更改内容', value: 'content', type: 'text' },
                ],
                searches: [],
                key: 'cfcaInfo',
                data: x.data || [],
                total: x.data.length || 0,
                inputParam: {
                },
                rightButtons: [{ label: '确定', value: 'submit' }]
            };
            XnModalUtils.openInViewContainer(this.xn, this.vcr, SingleSearchListModalComponent, params).subscribe(v => {
                if (v === null) {
                    return;
                }
            });
        });
    }
}
