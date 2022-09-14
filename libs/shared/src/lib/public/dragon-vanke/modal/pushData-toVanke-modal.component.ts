
/*
 * Copyright(c) 2017-2020, 深圳市链融科技股份有限公司
 * Beijing Xiwei Technology Co., Ltd.
 * All rights reserved.
 *
 * @file：customer-template-component.ts
 * @summary：向万科推送清单弹窗
 * @version: 1.0
 * **********************************************************************
 * revision             author            reason             date
 * 1.0                 congying            新增           2020-05-11
 * **********************************************************************
 */

import { Component, OnInit, ViewContainerRef, ElementRef, ViewChild, ChangeDetectorRef } from '@angular/core';
import { Observable, of, fromEvent } from 'rxjs';
import { ModalComponent, ModalSize } from '../../../common/modal/components/modal';
import { XnService } from '../../../services/xn.service';

@Component({
    templateUrl: `./pushData-toVanke-modal.component.html`,
    selector: 'pushData-toVanke-modal',
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
            word-break: break-all;
            white-space:normal;
        }
        .table-display tr td {
            vertical-align: middle;
        }
        .height {
            overflow-x: hidden;
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
            overflow: scroll;
        }
        .table {
            table-layout: fixed;
        }
        .table tr td{
            word-break: break-all;
            white-space:normal;
        }
        .table-display {
            margin: 0;
        }
        .active{
            background-color: #3c8dbc;
            color: #fff;
        }
        .change{
            color:#cc0000;
        }
    `]
})
export class PushDataToVankeModalComponent implements OnInit {
    @ViewChild('modal') modal: ModalComponent;

    // 数组字段
    private observer: any;
    public datalist: any[] = []; //列表数据
    public params: any; // 参数
    public headLeft = 0;
    public unPushList: any[]; // 不可推送数据
    public pushList: any[]; // 可推送数据
    public type: number = 0; // 推送内容 1-可放款批次号 2-实际付款批次号 3-推送融资信息
    public heads: any[];
    public subResize: any;

    constructor(
        private xn: XnService,
        private vcr: ViewContainerRef,
        private er: ElementRef,
        private cdr: ChangeDetectorRef,
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
        this.initData();
        this.modal.open(ModalSize.XLarge);
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
        this.params.title = '向万科推送数据：';
        this.params.type = 1;
    }

    /**
     * 选择推送数据
     * @param e
     *
     */
    typeChecked(e: any) {
        this.type = Number(e.target.value);
    }

    // 取消推送
    onCancel1() {
        this.close({ action: 'cancel' });
    }

    // 取消/关闭弹窗
    onCancel(type: number, oprate?: string) {
        this.params.type = type;
        this.close({ action: oprate });
    }

    // 确定推送
    onOk() {
        let mainFlowIdList = this.params.selectedItems.map(v => {
            return v.mainFlowId;
        });
        this.xn.loading.open();
        // 查验推送数据
        this.xn.dragon.post('/sub_system/vanke_system/verify_realy_pay_batch', { mainFlowIdList: mainFlowIdList, type: this.type }).subscribe(x => {
            if (x.ret === 0 && x.data && x.data.data.length) {
                this.params.type = 2;
                this.params.title = '以下业务无法发起推送：';
                this.unPushList = x.data.data;
                this.datalist = this.unPushList;
            } else if (x.data.data.length < 1) {
                this.xn.loading.open();
                // 批量向万科推送清单
                this.xn.dragon.post('/sub_system/vanke_system/push_realy_pay_batch', { mainFlowIdList: mainFlowIdList, type: this.type }).subscribe(x => {
                    if (x.ret === 0 && x.data && x.data.data.length > 0) {
                        this.datalist = x.data.data;
                        this.params.type = 3;
                        this.params.title = '推送结果如下：';
                    } else {
                        this.params.title = '向万科推送数据：';
                        this.params.type = 1;
                        this.datalist = [];
                    }

                }, () => {
                    this.xn.loading.close();
                });
            }
        }, () => {
            this.xn.loading.close();
        });

    }

    private close(value: any) {
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
            overflow: scroll;z-index: 1000;overflow-y: scroll;"></div>`).prependTo($("body"));
        const scrollContent = $(`<div class="inner" style="box-sizing: border-box;
            height: 200px;"></div>`).appendTo(scrollContainer);
        //滚动条的宽度
        let scrollBarWidth1 = scrollContainer.outerWidth(true) - scrollContent.outerWidth(true);
        scrollContainer.remove();
        $('.head-height').attr("style", `width: calc(100% - ${scrollBarWidth1}px`);
    }
}
