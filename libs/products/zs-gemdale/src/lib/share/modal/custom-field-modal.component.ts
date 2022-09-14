
/*
 * Copyright(c) 2017-2019, 深圳市链融科技股份有限公司
 * Beijing Xiwei Technology Co., Ltd.
 * All rights reserved.
 *
 * @file：customer-template-component.ts
 * @summary：台账自定义列表
 * @version: 1.0
 * **********************************************************************
 * revision             author            reason             date
 * 1.0                 wangqing             添加         2020-01-06
 * **********************************************************************
 */

import { Component, OnInit, ViewContainerRef, ElementRef, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import { Observable, of, fromEvent } from 'rxjs';
import { SortablejsModule, SortablejsOptions } from 'ngx-sortablejs';
import { ModalComponent, ModalSize } from 'libs/shared/src/lib/common/modal/components/modal';
import { XnService } from 'libs/shared/src/lib/services/xn.service';
import { XnUtils } from 'libs/shared/src/lib/common/xn-utils';
declare const $:any;

@Component({
    templateUrl: `./custom-field-modal.component.html`,
    styles: [`

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

        .table-display tr td {
            vertical-align: middle;
        }

        .table {
            table-layout: fixed;
            width: 100%;
        }

        .table-height {
            max-height: 380px;
            overflow-y: scroll;
        }

        .head-height {
            position: relative;
            overflow: hidden;
        }

        .table-display {
            margin: 0;
        }

        .relative {
            position: relative
        }

        .red {
            color: #f20000
        }

        .table tbody tr td:nth-child(5) {
            word-wrap: break-word
        }
        .slect-count {
            height: 20px;
            margin-top: 10px;
        }
    `]
})
export class ZsGemdalegetCustomFiledComponent implements OnInit, AfterViewInit, OnDestroy {
    @ViewChild('modal') modal: ModalComponent;
    @ViewChild('tableHead') tableHead: ElementRef;
    // 数据
    datalist01: any[] = [];   // 所有字段数据
    selectedItems: any[] = [];  // 已选字段

    private observer: any;
    public params: any;
    subResize: any;

    headLeft = 0;
    options: SortablejsOptions;

    constructor(private xn: XnService,
                private vcr: ViewContainerRef, private er: ElementRef, ) {
    }

    ngOnInit(): void {
        this.subResize = fromEvent(window, 'resize').subscribe((event) => {
            this.formResize();
        });
    }


    getData() {
    }

    setData() {
        // console.info('datalistsetdata=>', this.datalist01);
        this.selectedItems = [];
        this.datalist01.forEach(x => { // 拖动后更新列表数据
            if (x.checked) {
                this.selectedItems.push(x);
            }
        });
    }


    /**
     *  打开模态框
     * @param params
     */
    open(params: any): Observable<any> {
        this.selectedItems = [];
        this.params = params;
        if (params.type === 3) { // 台账-选择协助对接人
            this.onPage();
            this.modal.open(ModalSize.Small);
            return Observable.create(observer => {
                this.observer = observer;
            });
        }

        const selectArr = JSON.parse(params.selectHead);
        this.datalist01 = selectArr.concat(JSON.parse(params.headText)); // 获取上次自定义排序列表
        this.datalist01 = XnUtils.distinctArray2(this.datalist01, 'checkerId'); // 去除相同的项
        this.datalist01.forEach((x) => {
            x.checked = false;
        });
        selectArr.forEach((x: any) => {
            this.datalist01.forEach((t: any) => {
                if (t[params.label] === x[params.label]) {
                    t.checked = true;
                    this.selectedItems.push(t);
                }
            });
        });
        this.modal.open(ModalSize.Small);
        return Observable.create(observer => {
            this.observer = observer;
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
        $(this.tableHead.nativeElement).attr('style', `width: calc(100% - ${scrollBarWidth1}px`);
    }

    /** 获取列表数据 获取用户列表
    *  @param event
    *
    */
    onPage(): void {

        this.xn.loading.open();
        this.xn.dragon.post('/sub_system/docking_people/user_list', {
            userName: '',
            roleId: '',
        }).subscribe(x => { //  获取用户列表（平台，保理商）
            this.datalist01 = x.data.data;
        }, () => {
            this.xn.loading.close();
        });
    }

    /**
     *  判断列表项是否全部选中
     */
    public isAllChecked(): boolean {
        return !(this.datalist01.some(x => !x.checked || x.checked && x.checked === false) || this.datalist01.length === 0);
    }

    /**
     *  全选
     */
    public checkAll() {
        if (!this.isAllChecked()) {
            this.datalist01.forEach(item => item.checked = true);
            this.selectedItems = XnUtils.distinctArray2([...this.selectedItems, ...this.datalist01], this.params.label);
        } else {
            this.datalist01.forEach(item => item.checked = false);
            this.selectedItems = [];
        }
    }

    /**
     * 单选
     * @param paramItem
     * @param index
     */
    public singleChecked(paramItem) {
        if (paramItem.checked && paramItem.checked === true) {
            paramItem.checked = false;
            this.selectedItems = this.selectedItems.filter((x: any) => x[this.params.label] !== paramItem[this.params.label]);
        } else {
            paramItem.checked = true;
            this.selectedItems.push(paramItem);
            this.selectedItems = XnUtils.distinctArray2(this.selectedItems, this.params.label); // 去除相同的项
        }
    }

    // 滚动表头
    onScroll($event) {
        this.headLeft = $event.srcElement.scrollLeft * -1;
    }

    /**
     * 复制列表字段配置
     */
    onCopyField() {
        const fieldArr = this.params.selectField.map(f => f.value);
        const fieldArr2 = this.params.selectField.map(f => f.label); // checkerId不一致时 判断字段名
        this.datalist01.forEach(item => item.checked = false);
        this.selectedItems = this.datalist01.filter(obj => (fieldArr.includes(obj.checkerId) || fieldArr2.includes(obj.title)));
        this.selectedItems.forEach(item => item.checked = true);
    }

    oncancel() {
        this.close({
            action: 'cancel'
        });
    }

    onOk() {

        if (this.params.type === 3) { // 台账-选择协助对接人
            this.close({
                action: 'ok',
                value: this.selectedItems,
            });
            return;
        }
        const param = {
            column: '',
            status: this.params.status
        } as any;
        if (this.params.type === 1) {
            param.column = JSON.stringify(this.selectedItems.map((x: any) => x.checkerId));
            param.lockCount = 0;
        } else {
            param.column = JSON.stringify(this.selectedItems.map((x: any) => x.value));
        }

        this.xn.dragon.post('/trade/set_column', param).subscribe(x => {
            if (x.ret === 0) {
                this.close({
                    action: 'ok',
                    value: this.selectedItems,
                    status: this.params.status
                });
            }
        });
        // this.close({
        //     action: 'ok',
        //     value: this.selectedItems,
        //     status: this.params.status
        // });
    }

    private close(value) {
        this.modal.close();
        this.observer.next(value);
        this.observer.complete();
    }
}
