
/*
 * Copyright(c) 2017-2020, 深圳市链融科技股份有限公司
 * Beijing Xiwei Technology Co., Ltd.
 * All rights reserved.
 *
 * @file：customer-template-component.ts
 * @summary：碧桂园-平台审核暂停弹窗
 * @version: 1.0
 * **********************************************************************
 * revision             author            reason             date
 * 1.0                hucongying       碧桂园数据对接      2020-11-02
 * **********************************************************************
 */

import { Component, OnInit, ViewContainerRef, ElementRef, ViewChild, ChangeDetectorRef, AfterViewInit, OnDestroy } from '@angular/core';
import { ModalComponent, ModalSize } from 'libs/shared/src/lib/common/modal/components/modal';
import { XnModalUtils } from 'libs/shared/src/lib/common/xn-modal-utils';
import { XnUtils } from 'libs/shared/src/lib/common/xn-utils';
import { CheckersOutputModel } from 'libs/shared/src/lib/config/checkers';
import { ItemModel } from 'libs/shared/src/lib/public/dragon-vanke/components/form/input/datatable-content.component';
import { EditModalComponent } from 'libs/shared/src/lib/public/dragon-vanke/modal/edit-modal.component';
import { HwModeService } from 'libs/shared/src/lib/services/hw-mode.service';
import { XnService } from 'libs/shared/src/lib/services/xn.service';
import { Observable, of, fromEvent } from 'rxjs';

declare const moment: any;
declare const $: any;
@Component({
    templateUrl: `./bgy-suspend-modal.component.html`,
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
export class BgySuspendModalComponent implements OnInit, AfterViewInit, OnDestroy {
    @ViewChild('modal') modal: ModalComponent;

    // 数组字段
    private observer: any;
    public datalist: any[] = []; // 列表数据
    public params: any; // 参数
    public selectedItems: any[] = []; // 选中项
    public headLeft = 0;
    public pageConfig = {
        start: 0,
        length: 2,
        total: 0
    }; // 页码配置
    public heads: any[] = [];
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

        this.params = Object.assign({}, this.params, params);
        this.heads = params.heads || [];
        // console.log(params);
        this.initData();
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
    initData(): void {
        this.onPage()
    }

    /**
     * page: 新页码、 pageSize: 页面显示行数、first: 新页面之前的总行数、pageCount : 页码总数
     *  @param event 请求api有区别
     *
     */
    onPage(e?: any): void {
        this.xn.loading.open();
        this.xn.dragon.post('/sub_system/bgy_system/bgy_invoice_list', { mainFlowId: this.params.mainFlowId }).subscribe(x => {
            this.xn.loading.close();
            if (x.data && x.data.data && x.data.data.length) {
                this.datalist = x.data.data;
            } else {
                this.datalist = [];
            }
            this.cdr.markForCheck();
        }, () => {
            this.xn.loading.close();
        });
    }

    /**
     *  批量输入发票更换原因
     * @param
     */
    multipChageReason() {
        if (this.selectedItems.length < 1) { return this.xn.msgBox.open(false, '请先勾选发票'); }
        const params = {
            checker: [
                {
                    title: '发票更换原因',
                    checkerId: 'reason',
                    type: 'text-area',
                    options: {},
                    placeholder: '请输入不超过255个字符',
                    validators: {
                        maxlength: 255,
                    },
                    value: '',
                    required: 1
                },
            ] as CheckersOutputModel[],
            title: '批量输入发票更换原因',
            buttons: ['取消', '确定'],
        };
        XnModalUtils.openInViewContainer(this.xn, this.vcr, EditModalComponent, params).subscribe((v3) => {
            if (v3 !== null) {
                const invoiceList = this.selectedItems.map(c => c.bgyInvoiceNo);
                this.datalist.forEach(x => { x.reason = invoiceList.includes(x.bgyInvoiceNo) ? v3.reason : '' })
            }
        });
    }

    /**
     *  输入发票更换原因
     * @param info 发票信息
     */
    inputChangeReason(info: any) {
        const params = {
            checker: [
                {
                    title: '发票更换原因',
                    checkerId: 'reason',
                    type: 'text-area',
                    options: {},
                    placeholder: '请输入不超过255个字符',
                    validators: {
                        maxlength: 255,
                    },
                    value: '',
                    required: 1
                },
            ] as CheckersOutputModel[],
            title: '输入更换原因',
            buttons: ['取消', '确定'],
        };
        XnModalUtils.openInViewContainer(this.xn, this.vcr, EditModalComponent, params).subscribe((v3) => {
            if (v3 !== null) {
                info.reason = v3.reason
            }
        });
    }

    /**
     *  判读列表项是否全部选中
     */
    public isAllChecked(): boolean {
        return !(this.datalist.some(x => !x.checked || x.checked && x.checked === false) || this.datalist.length === 0);
    }

    /**
     *  全选
     * @param e
     */
    public checkAll() {
        if (!this.isAllChecked()) {
            this.datalist.forEach(item => item.checked = true);
            this.selectedItems = XnUtils.distinctArray2([...this.selectedItems, ...this.datalist], this.params.key);
        } else {
            this.datalist.forEach(item => item.checked = false);
            this.selectedItems = [];
        }
    }

    /**
     * 单选
     * @param e
     * @param item
     * @param index
     */
    public singelChecked(e, item, index) {
        if (item.checked && item.checked === true) {
            item.checked = false;
            this.selectedItems = this.selectedItems.filter((x: any) => x[this.params.key] !== item[this.params.key]);
        } else {
            item.checked = true;
            this.selectedItems.push(item);
            this.selectedItems = XnUtils.distinctArray2(this.selectedItems, this.params.key); // 去除相同的项
        }
        this.isAllChecked();
    }

    /**
     * 计算表格合并项
     *
     */
    public calcAttrColspan(): number {
        return this.heads.length ? this.heads.length + 3 : 3;
    }

    /**
     * 确定
     *
     */
    onOk() {
        const invoiceList = this.datalist.filter(v => { return v.reason })
            .map(x => { return { bgy_id: x.bgy_id, bgyInvoiceCode: x.bgyInvoiceCode, bgyInvoiceNo: x.bgyInvoiceNo, reason: x.reason } })
        this.close({
            action: 'ok',
            invoiceList: invoiceList
        });
    }

    /**
     * 取消
     *
     */
    onCancel() {
        this.close({
            action: 'cancel',
            invoiceList: []
        });
    }

    /**
     * close
     *
     */
    close(value: { action: string, invoiceList: any[] }) {
        this.modal.close();
        this.observer.next(value);
        this.observer.complete();
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
