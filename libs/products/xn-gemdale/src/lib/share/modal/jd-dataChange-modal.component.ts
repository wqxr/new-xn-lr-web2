
/*
 * Copyright(c) 2017-2020, 深圳市链融科技股份有限公司
 * Beijing Xiwei Technology Co., Ltd.
 * All rights reserved.
 *
 * @file：customer-template-component.ts
 * @summary：金地数据对接情况弹窗
 * @version: 1.0
 * **********************************************************************
 * revision             author            reason             date
 * 1.0                hucongying       金地数据对接      2020-12-07
 * **********************************************************************
 */

import { Component, OnInit, ViewContainerRef, ElementRef, ViewChild, ChangeDetectorRef, AfterViewInit, OnDestroy } from '@angular/core';
import { ModalComponent, ModalSize } from 'libs/shared/src/lib/common/modal/components/modal';
import { XnModalUtils } from 'libs/shared/src/lib/common/xn-modal-utils';
import { SubTabListOutputModel, TabConfigModel, TabListOutputModel } from 'libs/shared/src/lib/config/list-config-model';
import CommUtils from 'libs/shared/src/lib/public/component/comm-utils';
import { HwModeService } from 'libs/shared/src/lib/services/hw-mode.service';
import { XnService } from 'libs/shared/src/lib/services/xn.service';
import { Observable, of, fromEvent } from 'rxjs';
import JdDataChangeList from './jd-dataChange'
import { SingleListParamInputModel, XnGemdaleSingleSearchListModalComponent } from './single-searchList-modal.component';

declare const moment: any;
declare const $: any;
@Component({
    templateUrl: `./jd-dataChange-modal.component.html`,
    styles: [`
        .modal-title{
            height:25px;
        }
        .title {
            font-weight:bold;
        }
        ul>li{
            list-style:none;
            font-weight:bold;
        }
        .label {
            font-weight: normal;
            flex: 1;
            color: black;
        }

        .flex {
            display: flex;
        }

        .input-check {
            width: 100px;
        }

        .head-height .sorting, .table-head .sorting_asc, .table-head .sorting_desc {
            /*position: relative;*/
            cursor: pointer
        }

        .head-height .sorting:after, .table-head .sorting_asc:after, .table-head .sorting_desc:after {
            font-family: 'Glyphicons Halflings';
            opacity: 0.5;
        }

        .head-height .sorting:after {
            content: "\\e150";
            opacity: 0.2
        }

        .head-height .sorting_asc:after {
            content: "\\e155"
        }

        .head-height .sorting_desc:after {
            content: "\\e156"
        }
        .table-body table tr td{
            border:1px solid #cccccc30;
            text-align: center;
        }
        .table-display tr td {
            vertical-align: middle;
        }
        .height {
            overflow-x: hidden;
            clear:both;
        }
        .relative {
            position: relative
        }
        .head-height {
            position: relative;
            overflow: hidden;
        }
        .table-height {
            max-height: 400px;
            overflow-x: auto;
            overflow-y: scroll;
        }
        .table {
            table-layout: fixed;
        }
        .table-display {
            margin: 0;
        }
        .active{
            background-color: #3c8dbc;
            color: #fff;
        }
        .change,.change a{
            color:#cc0000;
        }
    `]
})
export class JdDataChangeModalComponent implements OnInit, AfterViewInit, OnDestroy {
    @ViewChild('modal') modal: ModalComponent;

    // 数组字段
    private observer: any;
    public datalist: any[] = []; // 列表数据
    public datalist_original: any; // 原始列表数据
    public params: any; // 参数
    public selectedItems: any[] = []; // 选中项
    public defaultValue = 'A';
    public headLeft = 0;
    public subDefaultValue = 'DOING';
    public tabConfig: TabConfigModel = new TabConfigModel(); // 当前列表配置
    public currentTab: TabListOutputModel = new TabListOutputModel(); // 当前标签页
    public currentSubTab: SubTabListOutputModel = new SubTabListOutputModel(); // 当前子标签页
    public pageConfig = {
        start: 0,
        length: 2,
        total: 0
    }; // 页码配置
    public heads: any[];
    subResize: any;
    constructor(
        private xn: XnService,
        private vcr: ViewContainerRef,
        private er: ElementRef,
        private cdr: ChangeDetectorRef,
        public hwModeService: HwModeService,
    ) {
    }

    ngOnInit(): void {
        this.subResize = fromEvent(window, 'resize').subscribe((event) => {
            this.formResize();
        });
    }

    /**
     *  打开模态框
     * @param params
     */
    open(params: any): Observable<any> {

        this.params = params;
        // console.log(params);
        // 台账-线上数据B-碧桂园数据对接情况A  平台审核C
        this.defaultValue = params.defaultValue || 'A';
        // 台账platmachineAccount  平台审核platVerify
        this.tabConfig = JdDataChangeList.getConfig(params.type);
        this.initData(this.defaultValue);
        this.modal.open(ModalSize.Large);
        this.formResize();
        return Observable.create(observer => {
            this.observer = observer;
        });
    }

    // 滚动表头
    onScroll($event) {
        this.headLeft = $event.srcElement.scrollLeft * -1;
        // this.headLeft = 0;
    }

    /**
     *  @param value
     *  初始化数据
     */
    initData(value: any): void {
        this.defaultValue = value;
        this.pageConfig.start = 0;
        this.pageConfig.length = (this.defaultValue === 'B' || this.defaultValue === 'C') ? 2 : 5;
        this.onPage({ start: this.pageConfig.start, length: this.pageConfig.length });
    }

    /**
     * page: 新页码、 pageSize: 页面显示行数、first: 新页面之前的总行数、pageCount : 页码总数
     *  @param event 请求api有区别
     *
     */
    onPage(e?: { start?: number, length?: number }): void {
        this.datalist = [];
        this.xn.loading.open();
        this.pageConfig.start = e.start || 0;
        if (this.defaultValue === 'B' || this.defaultValue === 'C') {
            this.pageConfig.length = e.length || 2;
        } else {
            this.pageConfig.length = e.length || 5;
        }
        this.pageConfig = Object.assign({}, this.pageConfig, e);
        // 页面配置
        const find = this.tabConfig.tabList.find((tab: any) => tab.value === this.defaultValue);
        this.currentTab = !!find ? find : new TabListOutputModel();
        // 子页面配置
        const subFind = this.currentTab.subTabList.find((sub: any) => sub.value === this.subDefaultValue);
        this.currentSubTab = !!subFind ? subFind : new SubTabListOutputModel();
        const params = this.buildParams();
        this.xn.dragon.post(this.currentTab.post_url, params).subscribe(x => {
            if (x.ret === 0) {
                this.datalist_original = x.data;
                if (x.data && x.data.list && x.data.list.length) {
                    // 动态构建表头
                    const headText = JSON.stringify(this.currentSubTab.headText);
                    const newHead = [...JSON.parse(headText)].slice(0, 2);
                    x.data.list.forEach((t: any, i: number) => {
                        if (i > 0) {
                            newHead.push(
                                { label: moment(t.versionsTime).format('YYYY-MM-DD HH:mm:ss'), value: `field${i}`, type: `field${i}` }
                            );
                        }
                    });
                    const newheadText = JSON.stringify(newHead);
                    this.currentSubTab.headText = [...JSON.parse(newheadText)];
                    const heads = CommUtils.getListFields(newHead.slice(2));
                    this.datalist = JdDataChangeList.reorganizeData(x.data, heads); // 组装数据
                    this.pageConfig.total = x.data.count;
                } else if (x.data && x.data.data && x.data.data.length) {
                    this.datalist = x.data.data;
                    this.pageConfig.total = x.data.count;
                }
                this.heads = CommUtils.getListFields(this.currentSubTab.headText);

            }

        }, () => {
            this.xn.loading.close();
        });
    }

    /**
     * 构建列表请求参数
     */
    private buildParams() {
        let params: any = {
            mainFlowId: this.params.mainFlowId,
            start: this.pageConfig.start,
            length: this.pageConfig.length,
        };
        if (this.defaultValue === 'B' || this.defaultValue === 'C') {
            params = {
                mainFlowId: this.params.mainFlowId,
                billNumber: this.params.billNumber,
            };
        }
        return params;
    }

    /**
     * 往前翻页
     */
    preChange() {
        this.pageConfig.start = (this.defaultValue === 'B' || this.defaultValue === 'C') ? this.pageConfig.start - 2 : this.pageConfig.start - 5;
        this.onPage({ start: this.pageConfig.start, length: this.pageConfig.length });
    }

    /**
     * 往后翻页
     */
    nextChange() {
        this.pageConfig.start = (this.defaultValue === 'B' || this.defaultValue === 'C') ? this.pageConfig.start + 2 : this.pageConfig.start + 5;
        this.onPage({ start: this.pageConfig.start, length: this.pageConfig.length });
    }

    /**
     * 计算表格合并项
     *
     */
    public calcAttrColspan(): number {
        let num = 5;
        return (num = this.defaultValue === 'A' ? 6 : 5);
    }

    onOk() {
        this.modal.close();
    }

    /**
     *  判断数据是否长度大于显示最大值
     * @param paramFileInfos
     */
    public arrayLength(paramFileInfos: any): any[] {
        if (!paramFileInfos) {
            return [];
        }
        paramFileInfos;
        let obj = [];
        if (JSON.stringify(paramFileInfos).includes('[')) {
            obj = typeof paramFileInfos === 'string'
                ? JSON.parse(paramFileInfos)
                : paramFileInfos;
        } else {
            obj = typeof paramFileInfos === 'string'
                ? paramFileInfos.split(',')
                : [paramFileInfos];
        }
        return obj;
    }

    /**
     *  判断时间数组最大值
     * @param timeArry
     */
    public getMaxtime(timeArry: any[]): any {
        let maxTime = 21000101000000; // 后台设置的默认时间
        const numberArry = timeArry.map(t => Number(t)).sort((a, b) => b - a);
        maxTime = maxTime === numberArry[0] ? numberArry[1] : numberArry[0];
        return moment(maxTime, 'YYYYMMDDHHmmss').format('YYYY-MM-DD HH:mm:ss');
    }

    /**
     * 发票列表处理
     * @param invoiceList
     */
    public invoiceListFilter(invoiceList) {
        const arr = invoiceList.map(list => list.invoiceNumber);
        return arr;
    }

    /**
     *  查看更多发票
     * @param paramItem
     */
    public viewMore(paramItem: any[]) {
        // 打开弹框
        const params: SingleListParamInputModel = {
            title: '发票详情',
            get_url: '',
            get_type: '',
            multiple: null,
            heads: [
                { label: '发票代码', value: 'invoiceCode', type: 'text' },
                { label: '发票号码', value: 'invoiceNumber', type: 'text' },
                { label: '发票含税金额', value: 'taxFreeMoney', type: 'money' },
                { label: '发票不含税金额', value: 'money', type: 'money' },
                { label: '发票开票日期', value: 'billingDate', type: 'text' },
            ],
            searches: [],
            key: 'invoiceCode',
            data: paramItem || [],
            total: paramItem.length || 0,
            inputParam: {},
            rightButtons: [{ label: '确定', value: 'submit' }]
        };
        XnModalUtils.openInViewContainer(this.xn, this.vcr, XnGemdaleSingleSearchListModalComponent, params).subscribe(v => {
            if (v === null) { return }
        });
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
        $('.head-height').attr('style', `width: calc(100% - ${scrollBarWidth1}px`);
    }
}
