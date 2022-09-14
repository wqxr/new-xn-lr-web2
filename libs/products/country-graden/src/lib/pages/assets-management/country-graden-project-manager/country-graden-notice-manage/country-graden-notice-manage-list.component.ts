/*
 * Copyright(c) 2017-2019, 北京希为科技有限公司
 * Beijing Xiwei Technology Co., Ltd.
 * All rights reserved.
 *
 * @file：CountryGradenNoticeManageComponent
 * @summary：多标签页列表项 根据tab-pane.ts中的配置
 * @version: 1.0
 * **********************************************************************
 * revision             author            reason             date
 * 1.0                hucongying       碧桂园数据对接      2020-11-03
 * **********************************************************************
 */

import { Component, OnInit, ViewContainerRef, ChangeDetectorRef, AfterViewInit, OnDestroy, ElementRef } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { BankManagementService } from 'libs/console/src/lib/bank-management/bank-mangement.service';
import { XnFormUtils } from 'libs/shared/src/lib/common/xn-form-utils';
import { XnModalUtils } from 'libs/shared/src/lib/common/xn-modal-utils';
import { XnUtils } from 'libs/shared/src/lib/common/xn-utils';
import { CheckersOutputModel } from 'libs/shared/src/lib/config/checkers';
import { ButtonConfigModel, SubTabListOutputModel, TabListOutputModel } from 'libs/shared/src/lib/config/list-config-model';
import CommUtils from 'libs/shared/src/lib/public/component/comm-utils';
import { EditNoticeConfigModalComponent } from 'libs/shared/src/lib/public/dragon-vanke/modal/edit-notice-config.model';
import { HwModeService } from 'libs/shared/src/lib/services/hw-mode.service';
import { LocalStorageService } from 'libs/shared/src/lib/services/local-storage.service';
import { XnService } from 'libs/shared/src/lib/services/xn.service';
import { fromEvent, Observable } from 'rxjs';

declare const moment: any;
declare const $: any;

@Component({
    selector: 'country-graden-notice-manage',
    templateUrl: `./country-graden-notice-manage-list.component.html`,
    styles: [
        `
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
        .table-display tr td,th {
            width: 150px ;
            vertical-align: middle;
        }
        .relative {
            position: relative
        }
        .head-height {
            position: relative;
        }
        .table-height {
            max-height: 470px;
            overflow: scroll;
        }
        .table {
            table-layout: fixed;
            border-collapse: separate;
            border-spacing: 0;
        }
        .table-display {
            margin: 0;
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
        tbody tr:hover {
            background-color: #e6f7ff;
            transition: all 0.1s linear
          }
        .table>tbody>tr>td {
            vertical-align: middle;
        }
        `
    ]
})
export class CountryGradenNoticeManageComponent implements OnInit {

    public tabConfig: any;  //表格配置
    public currentTab: any;   // 当前标签页tabList
    public defaultValue = 'A';  // 默认激活第一个标签页
    // 页码配置
    public pageConfig = {
        pageSize: 10,
        first: 0,
        total: 0,
    };
    public paging = 0; // 当前页码
    public shows: any[] = [];  // 搜索项
    public form: FormGroup;   //搜索项表单实例
    public formModule: string = 'dragon-input';
    public subDefaultValue = 'DOING'; // 默认子标签页
    public currentSubTab: SubTabListOutputModel = new SubTabListOutputModel(); // 当前子标签页
    public heads: any[]; // 表头
    public searches: any[] = []; // 面板搜索配置项
    public arrObjs = {}; // 缓存后退的变量
    public listInfo: any[] = []; // 表格数据
    public displayShow: boolean = true;
    public queryParams: any; // 路由参数
    public subResize: any;
    public headLeft: number = 0;


    constructor(private xn: XnService,
        private vcr: ViewContainerRef, private er: ElementRef,
        public bankManagementService: BankManagementService,
        private router: ActivatedRoute, private cdr: ChangeDetectorRef,
        public hwModeService: HwModeService,
        private localStorageService: LocalStorageService) {
    }

    ngOnInit(): void {
        this.router.queryParams.subscribe(x => {
            this.queryParams = x;
        });
        this.router.data.subscribe(x => {
            this.tabConfig = x;
            this.initData(this.defaultValue);
            this.subResize = fromEvent(window, 'resize').subscribe((event) => {
                this.formResize();
            });
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
            overflow: scroll;z-index: 1000;overflow-y: scroll;"></div>`).prependTo($("body"));
        const scrollContent = $(`<div class="inner" style="box-sizing: border-box;
            height: 200px;"></div>`).appendTo(scrollContainer);
        //滚动条的宽度
        let scrollBarWidth1 = scrollContainer.outerWidth(true) - scrollContent.outerWidth(true);
        scrollContainer.remove();
        $('.head-height', this.er.nativeElement).attr("style", `width: calc(100% - ${scrollBarWidth1}px`);
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
        let params = this.buildParams();
        this.xn.dragon.post(this.currentTab.post_url, params).subscribe(x => {
            this.listInfo = x.data.data;
            this.pageConfig.total = x.data.count;
        }, () => {
            this.xn.loading.close();
        });

    }

    /**
   *  滚动表头
   *  scrollLeft 滚动条的水平位置
   */
    onScroll($event: any) {
        this.headLeft = $event.srcElement.scrollLeft * -1;
    }

    /**
     * 构建列表请求参数
     */
    private buildParams() {

        let params: any = {
            start: (this.paging - 1) * this.pageConfig.pageSize,
            length: this.pageConfig.pageSize,
            project_manage_id: this.queryParams.project_manage_id
        };

        // 搜索处理
        if (this.searches.length > 0) {

            for (const search of this.searches) {
                if (!XnUtils.isEmpty(this.arrObjs[search.checkerId])) {
                    params[search.checkerId] = this.arrObjs[search.checkerId];
                }
            }
        }
        return params;
    }

    /**
     *  搜索,默认加载第一页
     */
    public searchMsg() {
        this.paging = 1;
        this.pageConfig.first = 0;
        this.onPage({ page: this.paging });
    }

    /**
     * 重置
     */
    public reset() {
        for (const key in this.arrObjs) {
            if (this.arrObjs.hasOwnProperty(key)) {
                delete this.arrObjs[key];
            }
        }
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
        const objList = [];
        for (let i = 0; i < searches.length; i++) {
            const obj = {};
            obj['title'] = searches[i]['title'];
            obj['checkerId'] = searches[i]['checkerId'];
            obj['required'] = false;
            obj['type'] = searches[i]['type'];
            obj['options'] = searches[i]['options'];
            obj['value'] = this.arrObjs[searches[i]['checkerId']];
            objList.push(obj);
        }
        this.shows = $.extend(true, [], objList); // 深拷贝
        XnFormUtils.buildSelectOptions(this.shows);
        this.buildChecker(this.shows);
        this.form = XnFormUtils.buildFormGroup(this.shows);
        this.form.valueChanges.subscribe((v) => {
            const arrObj = {};
            for (const item in v) {
                if (v.hasOwnProperty(item) && v[item] !== '') {
                    arrObj[item] = v[item];
                }
            }
            this.arrObjs = $.extend(true, {}, arrObj); // 深拷贝;要进行搜索的变量
            this.onUrlData();
        });
    }

    /**
     *  列按钮
     * @param item
     */
    public handleRowClick(item: any, btn: ButtonConfigModel, i: number) {
        if (btn.operate === 'edit-config') { // 修改配置
            const noticeInfo = {
                project_manage_id: this.queryParams.project_manage_id,
                remindId: item.remindId,
                title: item.title,
                content: item.content,
                isOpen: item.isOpen,
                isSystemRemind: item.isSystemRemind,
                isEmailRemind: item.isEmailRemind,
                userList: item.userList,
                paramConfig: JSON.parse(item.paramConfig),
                paramDesc:item.paramDesc
            };

            let noticeType: any = [1];              // 提醒类型 默认系统提醒开启
            if (noticeInfo.isEmailRemind === 1) {  // 邮件提醒是否开启 0=关闭 1=开启
                noticeType.push(2);
            }

            const checkers = <CheckersOutputModel[]>[
                {
                    checkerId: 'title',
                    required: 0,
                    type: 'text',
                    title: '提醒事项名称',
                    options: {
                        readonly: true
                    },
                    value: noticeInfo.title
                },
                {
                    checkerId: 'noticeContent',
                    required: 0,
                    type: 'textarea',
                    title: '提醒内容',
                    options: {
                        readonly: true
                    },
                    value: noticeInfo.content
                },
                {
                    checkerId: 'paramConfig',
                    required: 0,
                    type: 'config-params-input',
                    title: '参数项',
                    options: {
                        helpMsg: item.paramType // paramType 参数类型 0=无 1=数值 2=日期
                    },
                    selectOptions: this.paramConfigPip(item),
                    value: item.paramConfig
                },
                {
                    checkerId: 'userList',
                    required: 1,
                    type: 'agency-picker',
                    title: '提醒目标用户',
                    options: {
                        helpMsg: this.queryParams.project_manage_id,
                    },
                    value: noticeInfo.userList.length > 0 ? JSON.stringify(noticeInfo.userList) : ''
                },
                {
                    checkerId: 'noticeType',
                    required: 1,
                    type: 'checkbox',
                    title: '提醒方式',
                    options: { ref: 'noticeType' },
                    value: noticeType.toString()
                },
                {
                    checkerId: 'isOpen',
                    required: 1,
                    type: 'radio',
                    title: '是否启用',
                    options: { ref: 'isOpen' },
                    value: noticeInfo.isOpen
                },
            ];
            XnModalUtils.openInViewContainer(
                this.xn,
                this.vcr,
                EditNoticeConfigModalComponent,
                {
                    checkers,
                    title: '修改配置',
                    type: 'edit',
                    noticeInfo: noticeInfo,

                }
            ).subscribe(x => {
                if (x.action === 'ok') {
                    this.xn.msgBox.open(false, '修改配置成功',
                        () => { // yes-callback
                            this.onPage({ page: this.paging });
                        });

                }
            });
        }
    }

    /**
     *  查看提醒事项
     * @param item 行数据
     */
    public viewNotice(item: any) {

        const noticeInfo = {
            project_manage_id: this.queryParams.project_manage_id,
            remindId: item.remindId,
            title: item.title,
            content: item.content,
            isOpen: item.isOpen,
            isSystemRemind: item.isSystemRemind,
            isEmailRemind: item.isEmailRemind,
            userList: item.userList,
            paramConfig: JSON.parse(item.paramConfig),
            paramDesc:item.paramDesc
        };
        let noticeType: any = [];              // 系统提醒类型
        if (noticeInfo.isSystemRemind === 1) { //系统提醒是否开启 0=关闭 1=开启
            noticeType.push(1);
        }
        if (noticeInfo.isEmailRemind === 1) {  // 邮件提醒是否开启 0=关闭 1=开启
            noticeType.push(2);
        }

        const checkers = <CheckersOutputModel[]>[
            {
                checkerId: 'title',
                required: 0,
                type: 'text',
                title: '提醒事项名称',
                options: {
                    readonly: true
                },
                value: noticeInfo.title
            },
            {
                checkerId: 'noticeContent',
                required: 0,
                type: 'textarea',
                title: '提醒内容',
                options: {
                    readonly: true
                },
                value: noticeInfo.content
            },
            {
                checkerId: 'paramConfig',
                required: 0,
                type: 'config-params-input',
                title: '参数项',
                options: {
                    readonly: true,
                    helpMsg: item.paramType // paramType 参数类型 0=无 1=数值 2=日期
                },
                selectOptions: this.paramConfigPip(item),
                value: item.paramConfig
            },
            {
                checkerId: 'userList',
                required: 1,
                type: 'agency-picker',
                title: '提醒目标用户',
                options: {
                    helpMsg: this.queryParams.project_manage_id,
                    readonly: true
                },
                value: JSON.stringify(noticeInfo.userList)
            },
            {
                checkerId: 'noticeType',
                required: 1,
                type: 'checkbox',
                title: '提醒方式',
                options: { ref: 'noticeType', readonly: true },
                value: noticeType.toString()
            },
            {
                checkerId: 'isOpen',
                required: 1,
                type: 'radio',
                title: '是否启用',
                options: { ref: 'isOpen', readonly: true },
                value: noticeInfo.isOpen
            },
        ];
        XnModalUtils.openInViewContainer(
            this.xn,
            this.vcr,
            EditNoticeConfigModalComponent,
            {
                checkers,
                title: '查看配置',
                type: 'view',
                noticeInfo: noticeInfo,

            }
        ).subscribe(data => {

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
    * 参数项过滤处理
    * @param paramConfig
    */
    private paramConfigPip(item: any) {
        if (typeof item.paramConfig === 'string') {
            if (item.paramType === 2) {
                const config = JSON.parse(item.paramConfig)
                config.forEach(x => { x.value = x.value > 0 ? moment(x.value).format('YYYY-MM-DD') : 0 })
                return config
            }
            return JSON.parse(item.paramConfig)
        }
        if (typeof item.paramConfig === 'object') {
            return item.paramConfig
        }
        return []
    }

    /**
     * 回退操作
     * @param data
     */
    private onUrlData(data?: any) {

    }

    /**
     * 返回
     * @param
     */
    navBack() {
        history.go(-1);
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

    show() {
        this.displayShow = !this.displayShow;
    }
}
