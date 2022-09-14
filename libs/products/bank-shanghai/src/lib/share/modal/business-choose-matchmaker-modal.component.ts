
/*
 * Copyright(c) 2017-2019, 深圳市链融科技股份有限公司
 * Beijing Xiwei Technology Co., Ltd.
 * All rights reserved.
 *
 * @file：customer-template-component.ts
 * @summary：选择业务对接人弹窗
 * @version: 1.0
 * **********************************************************************
 * revision             author            reason             date
 * 1.0                 congying            新增           2020-05-09
 * **********************************************************************
 */

import { Component, OnInit, ViewContainerRef, ElementRef, ViewChild, ChangeDetectorRef, AfterViewInit, OnDestroy } from '@angular/core';
import { ModalComponent, ModalSize } from 'libs/shared/src/lib/common/modal/components/modal';
import { XnService } from 'libs/shared/src/lib/services/xn.service';
import { fromEvent, Observable } from 'rxjs';
import { FormGroup } from '@angular/forms';
import RoleType from '../../logic/roleIdList';


@Component({
    templateUrl: `./business-choose-matchmaker-modal.component.html`,
    selector: 'sh-choose-matchmaker-modal',
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
    .table-body table tr td{
        border:1px solid #cccccc30;
        text-align: center;
    }
    .table-display tr td {
        vertical-align: middle;
    }
    .relative {
        position: relative
    }

    .table-body {
        max-height: 400px;
        overflow: scroll;
    }
    .table {
        table-layout: fixed;
    }
    .table-display {
        margin: 0;
    }
    `]
})
export class ShangHaiBusinessMatchmakerChooseComponent implements OnInit, AfterViewInit, OnDestroy {
    @ViewChild('modal') modal: ModalComponent;
    @ViewChild('listHead') listHead: ElementRef;
    @ViewChild('listBody') listBody: ElementRef;
    @ViewChild('listTbody') listTbody: ElementRef;

    // 数组字段
    public form: FormGroup;
    private observer: any;
    public datalist: any[] = []; // 列表数据
    public params: any; // 参数
    public selectedItems: any[] = []; // 选中项
    public userName = ''; // 用户姓名
    public roleId = ''; // 用户角色
    public headLeft = 0;
    public selectOptions: any;
    subResize: any;

    constructor(private xn: XnService,
        private vcr: ViewContainerRef, private er: ElementRef, private cdr: ChangeDetectorRef,) {
    }

    ngOnInit(): void {
        this.subResize = fromEvent(window, 'resize').subscribe((event) => {
            this.formResize();
        });
    }

    ngAfterViewInit() {
        this.formResize();
    }

    formResize() {
        const scrollContainer = $(`<div class="custom-scrollbar" style="box-sizing: border-box;
            position: absolute;height: 100px;width: 100px;top: -3000px;left: -3000px;
            overflow: scroll;z-index: 1000;overflow-y: scroll;"></div>`).prependTo($('body'));
        const scrollContent = $(`<div class="inner" style="box-sizing: border-box;
            height: 200px;"></div>`).appendTo(scrollContainer);
        // 滚动条的宽度
        const scrollBarWidth = scrollContainer.outerWidth(true) - scrollContent.outerWidth(true);
        scrollContainer.remove();
        $(this.listHead.nativeElement).attr('style', `width: calc(100% - ${scrollBarWidth}px)`);
    }

    ngOnDestroy() {
        // 在组件生命周期销毁里取消事件，防止出现页面多次执行之后卡顿
        if (this.subResize) {
            this.subResize.unsubscribe();
        }
    }


    /**
     *  打开模态框
     * @param params
     */
    open(params: any): Observable<any> {
        this.params = params;
        this.selectedItems = [];
        this.selectOptions = RoleType.getConfig();
        this.onPage();
        this.modal.open(ModalSize.Small);
        this.formResize();
        return Observable.create(observer => {
            this.observer = observer;
        });
    }


    /** 获取列表数据
     *  @param event
     *
     */
    onPage(): void {
        this.selectedItems = [];
        this.xn.loading.open();
        const params = this.buildParams();
        this.xn.dragon.post('/sub_system/docking_people/user_list', params).subscribe(x => { //  获取用户列表（平台，保理商）
            this.datalist = x.data.data;
        }, () => {
            this.xn.loading.close();
        });
    }

    /**
     * 构建列表请求参数
     */
    private buildParams() {

        if (this.params.type === 'select-helpUserName') {
            // 台账-选择协助人
            const params: any = {
                roleId: this.params.roleId,
            };
            return params;
        }

        const params: any = {
            userName: this.userName,
            roleId: this.roleId,
        };

        return params;
    }

    /**
     * 搜索 选择用户角色
     * @param e 失去焦点事件
     *
     */
    public searchRoleId(e: any) {
        this.onPage();
    }

    /**
     * 搜索 用户姓名
     * @param e 失去焦点事件
     *
     */
    public searchUserName(e: any) {
        this.onPage();

    }

    // 滚动表头
    onScroll($event) {
        // this.headLeft = $event.srcElement.scrollLeft * -1;
        this.headLeft = 0;
    }

    /**
     * 单选
     * @param paramItem 行info
     * @param index 行下标
     */
    public singleChecked(paramItem: any, index: number) {
        this.datalist.forEach(item => item.checked = false);
        paramItem.checked = true;
        this.selectedItems.push(paramItem);
        this.selectedItems = this.selectedItems.slice(-1);
    }

    /**
     * 计算表格合并项
     * headText.length + 可选择1 + 序号1 + 行操作+1
     */
    public calcAttrColspan(): number {
        return 4;
    }

    public oncancel() {
        this.datalist.forEach(item => item.checked = false);
        this.datalist = [];
        this.selectedItems = [];
        this.modal.close();
    }

    public onOk() {
        this.xn.loading.open();
        const params: any = {
            idList: this.params.idList,
            userId: this.selectedItems[0].userId
        };

        if (this.params.type === 'select-marklinker') { //  选择市场部对接人
            this.xn.dragon.post('/sub_system/docking_people/market_choose', params).subscribe(x => {
                this.close(x.data);
            }, () => {
                this.xn.loading.close();
            });
        }
        if (this.params.type === 'select-operalinker') { //  选择运营部对接人
            this.xn.dragon.post('/sub_system/docking_people/operator_choose', params).subscribe(x => {
                this.close(x.data);
            }, () => {
                this.xn.loading.close();
            });
        }
        if (this.params.type === 'select-helpUserName') { // 台账-添加协助人
            const query: any = {
                mainFlowIdList: this.params.mainFlowIdList,
                userId: this.selectedItems[0].userId
            };
            this.xn.dragon.post('/sub_system/docking_people/help_choose', query).subscribe(x => {
                this.close(x.data);
            }, () => {
                this.xn.loading.close();
            });
        }

    }

    public close(value: any) {
        this.datalist.forEach(item => item.checked = false);
        this.modal.close();
        this.observer.next(value);
        this.observer.complete();
    }
}
