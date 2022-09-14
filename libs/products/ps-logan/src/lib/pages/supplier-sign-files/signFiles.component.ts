/*
 * Copyright(c) 2017-2019, 深圳市链融科技股份有限公司
 * Beijing Xiwei Technology Co., Ltd.
 * All rights reserved.
 *
 * @file：RecepitListComponent
 * @summary：供应商签署基础文件页面
 * @version: 1.0
 * **********************************************************************
 * revision             author            reason             date
 * 1.0                hucongying        龙光-博时资本       2021-01-05
 * **********************************************************************
 */

import { Component, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { XnFormUtils } from 'libs/shared/src/lib/common/xn-form-utils';
import { XnService } from 'libs/shared/src/lib/services/xn.service';
import { XnUtils } from 'libs/shared/src/lib/common/xn-utils';
import { XnModalUtils } from 'libs/shared/src/lib/common/xn-modal-utils';
import { ActivatedRoute } from '@angular/router';
import { JsonTransForm } from 'libs/shared/src/lib/public/pipe/xn-json.pipe';
import { FileViewModalComponent } from 'libs/shared/src/lib/public/modal/file-view-modal.component';
import { HwModeService } from 'libs/shared/src/lib/services/hw-mode.service';
import { DragonPdfSignModalComponent } from 'libs/shared/src/lib/public/dragon-vanke/modal/pdf-sign-modal.component';
import { DragonFinancingContractModalComponent } from 'libs/shared/src/lib/public/dragon-vanke/modal/dragon-asign-contract.modal';
import { ElementRef } from '@angular/core';
import { fromEvent } from 'rxjs';
import { ChangeDetectorRef } from '@angular/core';
declare const $: any;

@Component({
    templateUrl: `./signFiles.component.html`,
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

        tbody tr:hover {
            background-color: #e6f7ff;
            transition: all 0.1s linear
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
        .height {
            overflow-x: hidden;
            clear:both;
        }
        .table-body table tr td{
            border:1px solid #cccccc30;
            text-align: center;
          }
          .table-display tr td {
            width: 150px ;
            vertical-align: middle;
          }
          .relative {
            position: relative
          }
          .head-height {
            position: relative;
            overflow: hidden;
          }
          .table-height {
            max-height: 600px;
            overflow: scroll;
          }
          .table {
            table-layout: fixed;
            width: 3000px;
            border-collapse: separate;
            border-spacing: 0;
          }
          .table-display {
            margin: 0;
          }
    `]
})
export class SignFilesComponent implements OnInit {
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
    currentTab: any; // 当前标签页

    arrObjs = {} as any; // 缓存后退的变量
    paging = 1; // 共享该变量
    beginTime: any;
    endTime: any;
    timeId = [];
    nowTimeCheckId = '';
    // 上次搜索时间段
    preChangeTime: any[] = [];
    headLeft: number;
    public subResize: any;
    public scroll_x = 0;   // 滚动条滚动距离
    @ViewChild('tables') tables: ElementRef;

    constructor(
        private xn: XnService,
        private vcr: ViewContainerRef,
        public hwModeService: HwModeService,
        private router: ActivatedRoute,
        private er: ElementRef,
        private cdr: ChangeDetectorRef) { }

    ngOnInit(): void {
        this.router.data.subscribe(x => {
            this.tabConfig = x;
            this.initData(this.label, true);
        });
        this.subResize = fromEvent(window, 'resize').subscribe((event) => {
            this.formResize();
        });
    }

    /**
    * 查看流程记录
    * @param mainFlowId 交易id
    */
    public viewProcess(mainFlowId: string) {
        this.xn.router.navigate([
            `pslogan/main-list/detail/${mainFlowId}`
        ]);
    }

    ngAfterViewInit() {
        this.formResize();
    }
    ngOnDestroy() {
        // 在组件生命周期销毁里取消事件，防止出现页面多次执行之后卡顿
        if (this.subResize) {
            this.subResize.unsubscribe();
        }
    }
    formResize() {
        const scrollContainer = $(`<div class="custom-scrollbar" style="box-sizing: border-box;
            position: absolute;height: 100px;width: 100px;top: -3000px;left: -3000px;
            overflow: scroll;z-index: 1000;overflow-y: scroll;"></div>`).prependTo($('body'));
        const scrollContent = $(`<div class="inner" style="box-sizing: border-box;
            height: 200px;"></div>`).appendTo(scrollContainer);
        // 滚动条的宽度
        const scrollBarWidth1 = scrollContainer.outerWidth(true) - scrollContent.outerWidth(true);
        scrollContainer.remove();
        $('.head-height', this.er.nativeElement).attr('style', `width: calc(100% - ${scrollBarWidth1}px)`);
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
     * @param paramFile 文件信息
     */
    public viewFiles(paramFile: any) {
        XnModalUtils.openInViewContainer(this.xn, this.vcr, FileViewModalComponent, paramFile).subscribe();
    }
    /**
     *  加载信息
     * @param val
     */
    public initData(val: string, init?: boolean) {
        if (this.label === val && !init) { return }
        this.label = val;
        this.paging = 1;
        this.pageConfig = { pageSize: 10, first: 0, total: 0 };
        for (const key in this.arrObjs) {
            if (this.arrObjs.hasOwnProperty(key)) {
                delete this.arrObjs[key];
            }
        }
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
            this.getLast();
            this.xn.loading.close();
        });
    }

    /**
     * 加载表格数据滚动表格 固定操作列
     */
    getLast() {
        const newtables = $(this.tables.nativeElement);
        newtables.scrollLeft(0);
        setTimeout(() => {
            newtables.scrollLeft(5);
        }, 500);
        this.cdr.markForCheck();
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
        this.paging = 1;
        this.pageConfig = { pageSize: 10, first: 0, total: 0 };
        this.form.reset(); // 清空
        for (const key in this.arrObjs) {
            if (this.arrObjs.hasOwnProperty(key)) {
                delete this.arrObjs[key];
            }
        }
        this.buildCondition(this.searches);
        this.searchMsg(); // 清空之后自动调一次search
    }

    /**
     *  查看合同，只读
     * @param con 合同信息
     * @param 
     */
    public showContract(con: any) {
        const params = Object.assign({}, con, { readonly: true });
        XnModalUtils.openInViewContainer(this.xn, this.vcr, DragonPdfSignModalComponent, params).subscribe(() => { });
    }

    /**
     *  表头按钮组
     * @param btn {label:string,operate:string,value:string,value2?:string,disabled:boolean}
     */
    public handleHeadClick(btn) {
        switch (btn.operate) {
        }
    }

    /**
     * 行按钮组事件
     * @param item 当前行数据
     * @param btn {label:string,operate:string,value:string,value2?:string}
     * @param i 下标
     */
    public handleRowClick(item: any, btn: any, i: number) {
        switch (btn.operate) {
            // 盖章
            case 'sign_file':
                this.signFile(btn, item.mainFlowId)
                break;
        }
    }

    /**
     * 签署应收账款转让回执
     * @param btn 按钮信息
     * @param mainFlowId 交易id
     */
    private signFile(btn: any, mainFlowId: string) {
        this.xn.loading.open();
        this.xn.dragon.post('/sub_system/lg_system/stamp', { mainFlowId })
            .subscribe(x => {
                this.xn.loading.close();
                const contract = x.data;
                contract.isProxy = 52;
                contract.forEach(element => {
                    element.mainFlowId = mainFlowId;
                    if (!element.config) {
                        element.config = {
                            text: '(供应商基础资料盖章)'
                        };
                    }
                });
                XnModalUtils.openInViewContainer(this.xn, this.vcr, DragonFinancingContractModalComponent, contract)
                    .subscribe(v => {
                        if (v === 'ok') {
                            // 回传合同
                            this.xn.dragon.post('/sub_system/lg_system/stamp_save', { contract }).subscribe(() => {
                                this.onPage({ page: this.paging });
                            });
                        }
                    });
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
        const params: any = {
            pageNo: this.paging,
            pageSize: this.pageConfig.pageSize,
            lgBasicFlieStatus: this.currentTab.lgBasicFlieStatus, // 签署状态  1= 未签署 2=已签署
        };
        // 搜索处理
        if (this.searches.length > 0) {
            for (const search of this.searches) {
                if (!XnUtils.isEmpty(this.arrObjs[search.checkerId])) {
                    if (search.checkerId === 'transactionStatus') {
                        params.flowId = this.arrObjs[search.checkerId];
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
    private onUrlData(data?) {
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
    *  滚动表头
    *  scrollLeft 滚动条的水平位置
    *  scrollWidth 元素的宽度且包括滚动部分及滚动条的宽度
    *  offsetWidth 元素可见区域的宽度 + 元素边框宽度（如果有滚动条还要包括滚动条的宽度）
    */
    onScroll($event: any) {
        this.headLeft = $event.srcElement.scrollLeft * -1;
        const ColumFirst = $('.height').find('.head-height tr th:nth-child(1),.table-height tr td:nth-child(1)');  // 勾选列
        const ColumLast = $('.height').find('.head-height tr th:last-child,.table-height tr td:last-child');      // 操作列
        if ($event.srcElement.scrollLeft !== this.scroll_x) {
            this.scroll_x = $event.srcElement.scrollLeft;
            const lastHead_X = -($event.srcElement.scrollWidth - $event.srcElement.offsetWidth) + $event.srcElement.scrollLeft;

            if (this.currentTab.canChecked) {
                ColumFirst.each((index, col: any) => { // 固定第一列
                    col.style.transform = 'translateX(' + this.scroll_x + 'px)';
                    col.style.backgroundColor = '#fff';
                });
            }

            if (this.currentTab.edit && this.currentTab.edit.rowButtons && this.currentTab.edit.rowButtons.length) {
                ColumLast.each((index, col: any) => { // 固定最后一列
                    col.style.transform = 'translateX(' + lastHead_X + 'px)';
                    col.style.backgroundColor = '#fff';
                });
            }

        }
    }
}
