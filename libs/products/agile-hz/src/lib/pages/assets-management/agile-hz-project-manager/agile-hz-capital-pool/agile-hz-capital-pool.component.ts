/**
 * Copyright(c) 2017-2019, 深圳市链融科技股份有限公司
 * Beijing Xiwei Technology Co., Ltd.
 * All rights reserved.
 *
 * @file：CapitalpoolComponent
 * @summary：雅居乐-恒泽-项目管理-基础资产列表
 * @version: 1.0
 * **********************************************************************
 * revision             author            reason             date
 * 1.0                 hucongying      雅居乐改造项目      2021-02-03
 * **********************************************************************
 */

import { Component, OnInit, ViewContainerRef, ChangeDetectorRef, AfterViewInit, OnDestroy, ElementRef } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { BankManagementService } from 'libs/console/src/lib/bank-management/bank-mangement.service';
import { CapitalType, SelectRange, SelectContent } from 'libs/shared/src/lib/common/dragon-vanke/emus';
import { XnFormUtils } from 'libs/shared/src/lib/common/xn-form-utils';
import { XnModalUtils } from 'libs/shared/src/lib/common/xn-modal-utils';
import { XnUtils } from 'libs/shared/src/lib/common/xn-utils';
import { CheckersOutputModel } from 'libs/shared/src/lib/config/checkers';
import { ButtonConfigModel, SubTabListOutputModel, TabConfigModel, TabListOutputModel } from 'libs/shared/src/lib/config/list-config-model';
import { HeadquartersTypeEnum } from 'libs/shared/src/lib/config/select-options';
import CommUtils from 'libs/shared/src/lib/public/component/comm-utils';
import { CapitalPoolDownloadAttachmentsModalComponent } from 'libs/shared/src/lib/public/dragon-vanke/modal/capital-pool-download-attachmentsmodal.component';
import {
    CapitalPoolExportListModalComponent
} from 'libs/shared/src/lib/public/dragon-vanke/modal/capital-pool-export-list-modal.component';
import { DragonFinancingContractModalComponent } from 'libs/shared/src/lib/public/dragon-vanke/modal/dragon-asign-contract.modal';
import { DragonOcrEditModalComponent, EditParamInputModel } from 'libs/shared/src/lib/public/dragon-vanke/modal/dragon-ocr-edit-modal.component';
import { EditModalComponent } from 'libs/shared/src/lib/public/dragon-vanke/modal/edit-modal.component';
import { DragonMfilesViewModalComponent } from 'libs/shared/src/lib/public/dragon-vanke/modal/mfiles-view-modal.component';
import { NewFileModalComponent } from 'libs/shared/src/lib/public/dragon-vanke/modal/new-file-modal.component';
import { DragonPdfSignModalComponent } from 'libs/shared/src/lib/public/dragon-vanke/modal/pdf-sign-modal.component';
import { VankeCapitalPoolGeneratingContractModalComponent } from 'libs/shared/src/lib/public/dragon-vanke/modal/vanke-capitalPool-generate-contract.component';
import { VankeDeleteTransactionEditModalComponent } from 'libs/shared/src/lib/public/dragon-vanke/modal/vanke-delete-transaction-modal.component';
import { JsonTransForm } from 'libs/shared/src/lib/public/pipe/xn-json.pipe';
import { HwModeService } from 'libs/shared/src/lib/services/hw-mode.service';
import { LocalStorageService } from 'libs/shared/src/lib/services/local-storage.service';
import { XnService } from 'libs/shared/src/lib/services/xn.service';
import { fromEvent, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { SingleSearchListModalComponent, SingleListParamInputModel } from '../../../../share/modal/single-searchList-modal.component';
import ProjectManagerCapitalList from './agile-hz-capital-pool';
import { ContractSignStatus } from "../../../../share/enums";

declare const moment: any;
declare const $: any;

@Component({
    selector: 'agile-hz-capital-management',
    templateUrl: `./agile-hz-capital-pool.component.html`,
    styleUrls: ['./agile-hz-capital-pool.component.css']
})
export class CapitalpoolComponent implements OnInit, AfterViewInit, OnDestroy {
    // 表格配置
    tabConfig: any;
    // 当前标签页tabList
    currentTab: any;
    // 默认激活第一个标签页 {do_not,do_down}
    label = 'do_not';
    // 默认激活第一个标签页
    public defaultValue = 'A';
    // 页码配置
    pageConfig = {
        pageSize: 10,
        first: 0,
        total: 0,
    };
    // 当前页码
    paging = 0;
    // 搜索项
    shows: any[] = [];
    // 搜索项表单实例
    form: FormGroup;
    // 面板搜索配置项项
    searches: any[] = [];
    // 选中的项
    selectedItems: any[] = [];
    // 搜索条件显示或隐藏
    displayShow = true;
    // 缓存后退的变量
    arrObjs = {};
    beginTime: any;
    endTime: any;
    timeId = [];
    nowTimeCheckId = '';
    // 上次搜索时间段
    preChangeTime: any[] = [];
    // 下载附件列表
    downLoadList: any[] = [];
    // 列表数据
    public listInfo: any[] = [];
    // 表头排序
    sorting = '';
    naming = '';
    // 表头配置
    heads: any[];
    // 页面标题
    title = '';
    // 交易详情配置
    params = {
        checker: [],
        title: '交易详情',
    };
    private tooltip$ = new Subject<string>();
    // 横向滚动
    headLeft = 0;
    // 标识资产池内交易是否有变动
    public tradeStatusFlag = false;
    // 当前子标签页subTabList
    public currentSubTab: SubTabListOutputModel = new SubTabListOutputModel();
    // 默认子标签页
    public subDefaultValue = 'DOING';
    // 所属模块
    public formModule = 'dragon-input';
    // 默认总部公司
    private defaultHeadquarter = HeadquartersTypeEnum[4];
    // 总部公司
    headquarters = '';
    // 所选项目
    fitProject = '';
    // 资产池id
    capitalPoolId: string;
    // 资产池名称
    capitalPoolName: string;
    // 业务模式
    public proxy: any;
    // 路由数据
    public queryParams: any;
    // 路由数据projectId
    public projectId: any;
    // 资产池选中的项 的mainflowId集合
    public capitalSelecteds: any[];
    // 是否从台账跳转过来
    isMachineenter = false;
    // 统计信息
    sumReceive = 0;
    sumChangePrice = 0;
    selectSumReceive = 0;
    selectSumChangePrice = 0;
    // 页面竖向滚动条事件
    subResize: any;
    // 产品信息页面参数
    productParams: any;

    constructor(private xn: XnService,
        private vcr: ViewContainerRef, private er: ElementRef,
        public bankManagementService: BankManagementService,
        private router: ActivatedRoute, private cdr: ChangeDetectorRef,
        public hwModeService: HwModeService,
        private localStorageService: LocalStorageService) {
    }

    ngOnInit(): void {
        this.router.queryParams.subscribe(x => {
            this.queryParams = { ...x };
            this.title = x.title;
            this.headquarters = x.headquarters;
            this.proxy = 57;
            this.fitProject = x.fitProject;
            this.capitalPoolId = x.capitalPoolId;
            this.capitalPoolName = x.capitalPoolName;
            this.projectId = x.projectId;
            this.isMachineenter = x.isMachineenter !== undefined;
        });
        this.router.data.subscribe(x => {
            const undetermTabConfig = ProjectManagerCapitalList.getTabConfig(this.localStorageService, this.xn, 'cpaitalTadeList');
            this.tabConfig = !!undetermTabConfig ? undetermTabConfig : new TabConfigModel();
            this.initData(this.defaultValue, true);
            this.formResize();
        });
        this.subResize = fromEvent(window, 'resize').subscribe((event) => {
            this.formResize();
        });
        this.tooltip$.pipe(
            debounceTime(300),   // 请求防抖 300毫秒
            distinctUntilChanged()  // 节流
        ).subscribe((param) => { this.viewDetailFunc(param) });
    }

    /**
     * 需要回传文件的合同
     * 应收账款转让通知书（适用于保理商向雅居乐下属公司出具） second_yjl_xs_05_contractYyj
     * 应收账款转让通知书（适用于保理商向雅居乐控股出具） second_yjl_xs_06_contractYyj
     */
    needReturnFile(head: any) {
        return ['second_yjl_xs_05_contractYyj', 'second_yjl_xs_06_contractYyj'].includes(head.bodyContractYyj);
    }

    /**
     * 未签署状态判断
     * 不判断“02”号合同状态 second_yjl_xs_02_contractYyj 付款确认书（适用于雅居乐控股向供应商出具）
     */
    noSign(head: any, item: any) {
        return head.contractStatus && item[head.contractStatus] === ContractSignStatus.NoSign
            && head.bodyContractYyj !== 'second_yjl_xs_02_contractYyj';
    }

    /**
     *  标签页，加载列表信息
     * @param paramTabValue string
     * @param init 是否为初始加载，true 不检查切换属性值与当前标签值
     */
    public initData(paramTabValue: string, init?: boolean) {
        if (this.defaultValue === paramTabValue && !init) {
            return;
        } else { // 重置全局变量
            this.selectedItems = [];
            this.listInfo = [];
            this.naming = '';
            this.sorting = '';
            this.paging = 1;
            this.pageConfig = { pageSize: 10, first: 0, total: 0 };
        }
        this.defaultValue = paramTabValue;
        this.subDefaultValue = 'DOING'; // 重置子标签默认
        this.onUrlData(); // 导航回退取值
        const find = this.tabConfig.tabList.find(tab => tab.value === this.defaultValue);
        this.currentTab = !!find ? find : new TabListOutputModel();
        // 子页面配置
        const subFind = this.currentTab.subTabList.find(sub => sub.value === this.subDefaultValue);
        this.currentSubTab = !!subFind ? subFind : new SubTabListOutputModel();
        if (this.defaultValue === 'B') {
            this.getHeadorSearch(this.currentSubTab);
        } else if (this.defaultValue === 'D') {
            // 产品信息页面传值
            this.productParams = {
                capitalPoolId: this.capitalPoolId
            };
        } else {
            this.onPage({ page: this.paging });
        }
        this.tradeChanges();
    }

    /**
      * 表格分页展示
      * @param e  page: 新页码、 pageSize: 页面显示行数、first: 新页面之前的总行数、pageCount : 页码总数
      * @summary 采购融资，地产abs  请求api有区别，采购融资：avenger 、地产abs：api
      */
    public onPage(e?: { page: number, first?: number, pageSize?: number, pageCount?: number }, newCurrent?: any) {
        this.selectSumReceive = 0;
        this.selectSumChangePrice = 0;
        this.selectedItems = [];

        this.paging = e.page || 1;
        this.onUrlData(); // 导航回退取值
        this.formResize();
        this.pageConfig = Object.assign({}, this.pageConfig, e);
        // 页面配置
        if (this.defaultValue === 'B') {
            this.heads = CommUtils.getListFields(newCurrent.headText);
            this.searches = newCurrent.searches; // 当前标签页的搜索项
        } else {
            this.heads = CommUtils.getListFields(this.currentSubTab.headText);
            this.searches = this.currentSubTab.searches; // 当前标签页的搜索项
        }

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
                this.sumReceive = x.data.sumReceive || 0;
                this.sumChangePrice = x.data.sumChangePrice || 0;
                if (x.data.recordsTotal === undefined) {
                    this.pageConfig.total = x.data.count;
                } else {
                    this.pageConfig.total = x.data.recordsTotal;
                }
            } else if (x.data && x.data.rows && x.data.rows.length) {
                this.listInfo = x.data.rows;
                this.pageConfig.total = x.data.count;
                this.sumReceive = x.data.sumReceive || 0;
                this.sumChangePrice = x.data.sumChangePrice || 0;
            } else {
                // 固定值
                this.listInfo = [];
                this.pageConfig.total = 0;
                this.sumReceive = 0;
                this.sumChangePrice = 0;
            }
        }, () => {
            // 固定值
            this.listInfo = [];
            this.pageConfig.total = 0;
            this.sumReceive = 0;
            this.sumChangePrice = 0;
        }, () => {
            this.xn.loading.close();
        });
    }

    tradeChanges() {
        if (this.defaultValue === 'A') {
            this.xn.dragon.post('/project_manage/pool/trade_change_tip', { capitalPoolId: this.capitalPoolId }).subscribe(x => {
                if (x.ret === 0 && x.data) {
                    this.tradeStatusFlag = x.data.changeTip || false;
                }
            });
        }
    }
    /**
     * 分页处理
     * @param e
     */
    onPageChange(e?: { page: number, first?: number, pageSize?: number, pageCount?: number }) {
        this.paging = e.page || 1;
        this.pageConfig = Object.assign({}, this.pageConfig, e);
        if (this.defaultValue === 'B') {
            this.getHeadorSearch(this.currentSubTab);
        } else {
            this.onPage({ page: this.paging });
        }
    }

    /**
     *  搜索,默认加载第一页
     */
    public searchMsg() {
        this.selectedItems = [];
        this.selectSumReceive = 0;
        this.selectSumChangePrice = 0;
        this.paging = this.paging || 1;
        if (this.defaultValue === 'B') {
            this.getHeadorSearch(this.currentSubTab);
        } else {
            this.onPage({ page: this.paging });
        }
        // this.paging = 1; // 回到第一页
    }

    // 滚动表头
    onScroll($event: Event) {
        this.headLeft = $event.srcElement['scrollLeft'] * -1;
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

    /**
     * 页面size变化即重设竖向滚动条宽度
     */
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
     * 查看回传文件 [批量]
     * @param paramFiles
     */
    public fileView(paramFiles) {
        XnModalUtils.openInViewContainer(this.xn, this.vcr, DragonMfilesViewModalComponent, JsonTransForm(paramFiles))
            .subscribe(() => {
            });
    }

    /**
    * 查看合同
    * @param row
    */
    public viewContract(row: any) {
        let params = row;
        if (typeof row === 'string') {
            const obj = JSON.parse(row);
            params = Array.isArray(obj) ? obj[0] : obj;
        }
        params['readonly'] = true;
        XnModalUtils.openInViewContainer(
            this.xn,
            this.vcr,
            DragonPdfSignModalComponent,
            params
        ).subscribe(() => {
            // do nothing
        });
    }

    /**
     * 交易文件列表搜索项根据接口返回动态设置
     * @param Tabconfig
     */
    getHeadorSearch(Tabconfig: any) {
        let newCurrentsubTab = XnUtils.deepCopy(this.currentSubTab);
        this.xn.dragon.post('/project_manage/file_contract/list_search', { project_manage_id: this.projectId }).subscribe(y => {
            if (y.ret === 0) {

                y.data.forEach(z => {
                    newCurrentsubTab.headText.push({
                        label: z.label, value: z.bodyContract, show: true, type: 'contract',
                        bodyContractYyj: z.bodyContractYyj, templateFlag: z.templateFlag,
                        contractStatus: z.searchContract
                    });
                });
                y.data.forEach(z => {
                    newCurrentsubTab.searches.push({
                        title: z.label, checkerId: z.searchContract, type: 'select', required: false, sortOrder: 10, show: true,
                        options: { ref: z.selectFlag },
                    });
                });
                this.onPage({ page: this.paging }, newCurrentsubTab);
            }
        });
    }



    /**
     * 判断总部公司是否一致
     */
    private isDifferentCompany() {
        const company = XnUtils.distinctArray(this.listInfo.filter(x => x.isProxy).map(c => c.isProxy)) || [];
        return company.length > 1;
    }

    /**
     * 判断是否已勾选交易
     */
    private hasSelectRow() {
        const selectedRows = this.listInfo.filter(x => x.checked && x.checked === true);
        return !!selectedRows && selectedRows.length > 0;
    }

    /**
     * 上传文件
     * @param row
     * @param head
     */
    public uploadContract(row, head) {
        const params = {
            title: `上传${head.label}`,
            checker: [
                {
                    title: `${head.label}`, checkerId: 'proveImg', type: 'mfile',
                    options: {
                        filename: `${head.label}`,
                        fileext: 'jpg, jpeg, png, pdf',
                        picSize: '500'
                    }, memo: '请上传图片、PDF'
                },
            ]
        };
        XnModalUtils.openInViewContainer(this.xn, this.vcr, NewFileModalComponent, params).subscribe(v => {
            this.xn.loading.open();
            if (v === null) {
                this.xn.loading.close();
                return;
            }
            let param = {};
            let url = '';
            if (this.proxy === 57) {
                param = {
                    fileList: v.files,
                    mainFlowId: row.mainFlowId,
                    yyjTableName: head.bodyContractYyj
                };
                url = '/project_manage/file_contract/upload_file';
            }
            this.xn.api.dragon.post(url, param).subscribe(() => {
                this.xn.loading.close();
                if (this.defaultValue === 'B') {
                    this.getHeadorSearch(this.currentSubTab);
                } else {
                    this.onPage({ page: this.paging });
                }
            });
        });
    }

    /**
     * 重置
     */
    public reset() {
        this.selectedItems = [];
        this.selectSumReceive = 0;
        this.selectSumChangePrice = 0;
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
            this.selectSumReceive = 0;
            this.selectSumChangePrice = 0;
            this.listInfo = [];
            this.naming = '';
            this.sorting = '';
            this.paging = 1;
            this.pageConfig = { pageSize: 10, first: 0, total: 0 };
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
     * 搜索条件是否显示
     */
    show() {
        this.displayShow = !this.displayShow;
    }

    /**
     *  查看文件信息
     * @param paramFile
     */
    public viewFiles(paramFile) {
        let params = JSON.parse(paramFile);
        XnModalUtils.openInViewContainer(this.xn, this.vcr, DragonMfilesViewModalComponent, params).subscribe();
    }

    /**
     *  判读列表项是否全部选中
     */
    public isAllChecked(): boolean {
        return !(this.listInfo.some(x => !x['checked'] || x['checked'] && x['checked'] === false) || this.listInfo.length === 0);
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
    public showContract(con) {
        const params = Object.assign({}, con, { readonly: true });
        XnModalUtils.openInViewContainer(this.xn, this.vcr, DragonPdfSignModalComponent, params).subscribe(() => {
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
            const obj = {};
            obj['title'] = searches[i]['title'];
            obj['checkerId'] = searches[i]['checkerId'];
            obj['required'] = false;
            obj['type'] = searches[i]['type'];
            obj['number'] = searches[i]['number'];
            if (searches[i]['checkerId'] === 'type' || searches[i]['checkerId'] === 'contractType') {
                searches[i]['options'].ref = 'vankeContracttype';
            }
            obj['options'] = searches[i]['options'];
            obj['show'] = searches[i]['show'];
            if (searches[i]['checkerId'] === this.timeId[0]) {
                obj['value'] = JSON.stringify(tmpTime);
            } else {
                obj['value'] = this.arrObjs[searches[i]['checkerId']];
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
        const timeCheckId = time[0] && time[0]['checkerId'];
        this.nowTimeCheckId = timeCheckId;
        this.form.valueChanges.subscribe((v) => {
            // 时间段
            const changeId = v[timeCheckId];
            //delete v[timeCheckId];
            if (changeId !== '' && this.nowTimeCheckId) {
                const paramsTime = JSON.parse(changeId);
                const beginTime = paramsTime['beginTime'];
                const endTime = paramsTime['endTime'];
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
            const arrObj = {};
            for (const item in v) {
                if (v.hasOwnProperty(item) && v[item] !== '') {
                    const searchFilter = this.searches.filter(v1 => v1 && v1['base'] === 'number').map(c => c['checkerId']);
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
            this.listInfo.forEach(item => item['checked'] = true);
            this.selectedItems = XnUtils.distinctArray2([...this.selectedItems, ...this.listInfo], 'mainFlowId');
        } else {
            this.listInfo.forEach(item => item['checked'] = false);
            this.selectedItems = [];
        }
        this.selectSumReceive = this.selectedItems.reduce((accumulator, currentValue) => { return accumulator + Number(currentValue['receive'] ? currentValue['receive'] : 0); }, 0).toFixed(2);
        this.selectSumChangePrice = this.selectedItems.reduce((accumulator, currentValue) => { return accumulator + Number(currentValue['changePrice'] ? currentValue['changePrice'] : 0); }, 0).toFixed(2);
    }

    /**
     * 单选
     * @param paramItem
     * @param index
     */
    public singleChecked(paramItem, index) {
        if (paramItem['checked'] && paramItem['checked'] === true) {
            paramItem['checked'] = false;
            this.selectedItems = this.selectedItems.filter(x => x.mainFlowId !== paramItem.mainFlowId);
        } else {
            paramItem['checked'] = true;
            this.selectedItems.push(paramItem);
            this.selectedItems = XnUtils.distinctArray2(this.selectedItems, 'mainFlowId'); // 去除相同的项
        }
        this.selectSumReceive = this.selectedItems.reduce((accumulator, currentValue) => { return accumulator + Number(currentValue['receive'] ? currentValue['receive'] : 0); }, 0).toFixed(2);
        this.selectSumChangePrice = this.selectedItems.reduce((accumulator, currentValue) => { return accumulator + Number(currentValue['changePrice'] ? currentValue['changePrice'] : 0); }, 0).toFixed(2);
    }

    /**
     * 构建参数
     */
    private buildParams() {
        // 分页处理
        let params: any;
        if (this.defaultValue === 'A' || this.defaultValue === 'C') {
            params = {
                capitalPoolId: this.capitalPoolId,
                type: this.defaultValue === 'A' ? 1 : 3,
                pageNo: this.paging,
                pageSize: this.pageConfig.pageSize
            };
        } else if (this.defaultValue === 'B') {
            params = {
                start: (this.paging - 1) * this.pageConfig.pageSize,
                length: this.pageConfig.pageSize,
                project_manage_id: this.projectId,
                headquarters: this.headquarters,
                capitalPoolId: this.capitalPoolId,
            };
        } else if (this.defaultValue === 'D') {
            params = {};
        } else if (this.defaultValue === 'E') {
            params = {
                capitalPoolId: this.capitalPoolId,
                type: 4,
                pageNo: this.paging,
                pageSize: this.pageConfig.pageSize
            };
        }

        // 排序处理
        if (this.sorting && this.naming) {
            if (this.defaultValue === 'A' || this.defaultValue === 'C') {
                let asc = this.naming === 'desc' ? -1 : 1;
                params.order = [{
                    name: TradeListOrderEnum[this.sorting], // 要排序的名称
                    asc: asc, // 是否是升序 -1表示降序 1表示升序
                }];
            } else {
                params.order = [this.sorting + ' ' + this.naming];
            }
        }
        // 搜索处理
        if (this.searches.length > 0) {
            for (const search of this.searches) {
                if (!XnUtils.isEmpty(this.arrObjs[search.checkerId])) {
                    if (search.checkerId === 'isHeadPreDate') {
                        const HeadPreDate = JSON.parse(this.arrObjs[search.checkerId]);
                        if (HeadPreDate.isPriorityLoanDate === 0) {
                            params['headDate'] = HeadPreDate.isPriorityLoanDate;
                        } else if (HeadPreDate.isPriorityLoanDate === 1) {
                            params['headDate'] = HeadPreDate.isPriorityLoanDate;
                            params['beginTime'] = HeadPreDate.priorityLoanDateStart;
                            params['endTime'] = HeadPreDate.priorityLoanDateEnd;
                        }
                    } else if (search.checkerId === 'beforeDate') {
                        let obj = JSON.parse(this.arrObjs[search.checkerId]);
                        params['beforeDate'] = Number(obj['beginTime']);
                        params['afterDate'] = Number(obj['endTime']);
                    } else if (search.checkerId === 'surveyStatus') {
                        //lawSurveyList  律所尽调状态列表  managerSurveyList 管理人尽调状态列表
                        let arr = this.arrObjs[search.checkerId] || [];
                        if (arr && arr.length) {
                            let lawSurveyList = arr.filter(x => Number(x) <= 5).map(y => Number(y));
                            let managerSurveyList = arr.filter(x => Number(x) > 5).map(y => Number(y - 5));
                            if (lawSurveyList && lawSurveyList.length) {
                                params['lawSurveyList'] = lawSurveyList;
                            }
                            if (managerSurveyList && managerSurveyList.length) {
                                params['managerSurveyList'] = managerSurveyList;
                            }
                        }
                    } else {
                        params[search.checkerId] = this.arrObjs[search.checkerId];
                    }
                }
            }
        }
        return params;
    }

    /**
     * 构建表单项
     * @param stepRows
     */
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
            this.defaultValue = urlData.data.defaultValue || this.defaultValue;
            this.subDefaultValue = urlData.data.subDefaultValue || this.subDefaultValue;
        } else {
            this.xn.user.setUrlData(this.xn.router.url, {
                paging: this.paging,
                pageConfig: this.pageConfig,
                beginTime: this.beginTime,
                endTime: this.endTime,
                arrObjs: this.arrObjs,
                label: this.label,
                defaultValue: this.defaultValue,
                subDefaultValue: this.subDefaultValue
            });
        }
    }

    /**
     * 返回上一页
     * @param
     */
    navBack() {
        if (this.isMachineenter === true) {
            this.xn.user.navigateBack();
        } else {
            this.xn.router.navigate(['/agile-hz/assets-management/projectPlan-management'], {
                queryParams: {
                    title: this.title.split('>')[1] + '>' + this.title.split('>')[2],
                    projectId: this.projectId,
                    headquarters: this.headquarters,
                    paging: this.queryParams.backPageNumber,
                    defaultValue: this.queryParams.backDefaultValue
                }
            });
        }
    }

    /**
     * 行按钮组事件
     * @param paramItem 当前行数据
     * @param paramBtnOperate 按钮操作配置
     * @param i 下标
     */
    public handleHeadClick(paramBtnOperate: ButtonConfigModel) {

        switch (paramBtnOperate.operate) {
            case 'push_business':
                // 推送企业
                this.doPush();
                break;
            case 'generate_Contract':
                //生成合同
                this.generateContacts();
                break;
            case 'add_transaction':
                //添加交易
                this.addTransaction();
                break;
            case 'return_file':
                //回传文件
                this.turnaroundFile();
                break;
            case 'contract_sign':
                //生成并签署合同
                this.signContacts();
                break;
            case 'transaction_changes':
                //交易变动记录
                this.tradeChange();
                break;
            case 'batch_information':
                // 批量补充信息
                this.batchModify();
                break;
            case 'remove_transaction':
                // 移除交易
                this.removeTrade();
                break;
            case 'download_file':
                // 下载附件
                this.downloadSelectedAttach();
                break;
            case 'export_file':
                // 导出清单
                this.exportCapital();
                break;
            case 'capital_sample':
                // 抽样
                this.capitalSample();
                break;
            case 'data_analyse':
                // 数据分析
                this.dataAnalyse();
                break;
            case 'specialAsset_mark':
                // 特殊资产标记
                this.specialAssetMark();
                break;

            default:
                break;
        }

    }

    /**
     * 推送企业
     */
    public doPush() {
        if (this.selectedItems.length === 0) {
            this.xn.msgBox.open(false, '请选择交易');
            return;
        }
        const selectArr = this.selectedItems.map((x) => x.mainFlowId);
        this.xn.msgBox.open(true, [
            `是否要推送以下交易？（共${selectArr.length}笔）`,
            ...selectArr
        ], () => {
            this.xn.loading.open();
            // 构建阐述
            const param = {
                mainFlowIdList: this.selectedItems.map(m => m.mainFlowId)
            };
            this.xn.api.dragon.post('/sub_system/yjl_system/project_push', param).subscribe(() => {
                const html = ` <h4>推送回执到项目公司成功</h4> `;
                this.xn.msgBox.open(false, [html], () => {
                    this.getHeadorSearch(this.currentSubTab)
                    this.selectedItems = [];
                });
            }, () => {
                this.xn.loading.close();
            });
        }, () => {
        });
    }

    /**
    * 生成合签署
    */
    public generateContacts() {
        if (this.selectedItems.length === 0) {
            this.xn.msgBox.open(false, '请选择交易');
            return;
        }
        this.xn.dragon.post('/contract/second_contract_info/create_second_contract', { project_manage_id: this.projectId }).subscribe(x => {
            if (x.ret === 0) {
                let fileList = x.data;
                XnModalUtils.openInViewContainer(this.xn, this.vcr, VankeCapitalPoolGeneratingContractModalComponent, { fileList }).subscribe(z => {
                    if (!!z) {
                        this.xn.loading.open();
                        // 准备参数
                        let params = {};
                        if (this.proxy === 57) {
                            params = {
                                capitalPoolId: this.capitalPoolId,
                                mainIds: this.selectedItems.map(r => r.mainFlowId),
                                secondTemplate: z[0]
                            };
                        }
                        let url = this.returnContractUrl(1);
                        this.doGenerateOrSign(params, url);
                    }
                });
            }
        });
    }

    /**
     * 获取生成合同url
     * @param type  1不签 2签
     */
    private returnContractUrl(type: number) {
        const urls = {
            yjl: {
                generate: '/contract/second_contract_info/generate_second_contract',
                update: '/contract/second_contract_info/update_second_contract',
                type: type
            }
        }
        return urls[GenerateContractType[this.proxy]];
    }

    /**
     * 生成并签署合同
     */
    signContacts() {
        if (this.selectedItems.length === 0) {
            this.xn.msgBox.open(false, '请选择交易');
            return;
        }
        this.xn.dragon.post('/contract/second_contract_info/create_sign_second_contract', { project_manage_id: this.projectId }).subscribe(x => {
            if (x.ret === 0) {
                let fileList = x.data;
                XnModalUtils.openInViewContainer(this.xn, this.vcr, VankeCapitalPoolGeneratingContractModalComponent, { fileList: fileList }).subscribe(x => {
                    if (!!x) {
                        this.xn.loading.open();
                        // 准备参数
                        let params = {};
                        if (this.proxy === 57) {
                            params = {
                                capitalPoolId: this.capitalPoolId,
                                mainIds: this.selectedItems.map(r => r.mainFlowId),
                                secondTemplate: x[0]
                            };
                        }
                        let url = this.returnContractUrl(2);
                        this.doGenerateOrSign(params, url);
                    }
                });
            }
        });
    }

    /**
     * 回传文件
     */
    public turnaroundFile() {
        const params: EditParamInputModel = {
            title: '回传文件',
            checker: <CheckersOutputModel[]>[{
                title: '文件',
                checkerId: 'returnFile',
                type: 'mfile-return',
                required: 1,
                options: { fileext: 'jpg,jpeg,png,pdf,zip' },
                value: '',
            }],
            options: { capitalPoolId: this.capitalPoolId },
            buttons: ['取消', '上传']
        };
        XnModalUtils.openInViewContainer(this.xn, this.vcr, DragonOcrEditModalComponent, params).subscribe(v => {
            this.getHeadorSearch(this.currentSubTab);
        });
    }

    /**
     * 交易变动记录
     */
    tradeChange() {
        // 交易变动记录
        const params: SingleListParamInputModel = {
            ...ProjectManagerCapitalList.transactionChangesconfig.searches,
            data: this.selectedItems || [],
            total: this.selectedItems.length || 0,
            inputParam: {
                capitalPoolId: this.capitalPoolId
            },
            rightButtons: [{ label: '确定', value: 'submit' }]
        };
        XnModalUtils.openInViewContainer(this.xn, this.vcr, SingleSearchListModalComponent, params).subscribe(v => {
        });
        this.xn.dragon.post('/project_manage/pool/update_change_pool', { capitalPoolId: this.capitalPoolId }).subscribe((x) => {
            this.tradeStatusFlag = false;
        });
    }

    /**
     * 批量补充
     */
    public batchModify() {
        if (this.selectedItems.length < 1) {
            this.xn.msgBox.open(false, '请选择交易');
            return false;
        }
        const param = { mainList: this.selectedItems };
        this.selectedItems.map((sel) => sel['headquarters'] = this.headquarters);
        this.localStorageService.setCacheValue('batchModifyMainList', param);
        const formCapitalPool = { isVanke: true, ...this.queryParams }; // 资产管理标识
        this.xn.router.navigate(['/agile-hz/batch-modify'], {
            queryParams: formCapitalPool
        });
    }

    /**
     * 移除交易
     */
    removeTrade() {
        if (this.selectedItems.length === 0) {
            this.xn.msgBox.open(false, '请选择交易');
            return;
        }
        const params = {
            selectedItems: this.selectedItems,
            capitalPoolName: this.capitalPoolName,
            capitalPoolId: this.capitalPoolId,
            type: 2,
            post_url: '/pool/remove'
        };
        XnModalUtils.openInViewContainer(this.xn, this.vcr, VankeDeleteTransactionEditModalComponent, params).subscribe((x) => {
            this.selectedItems = [];
            setTimeout(() => {
                this.onPage({ page: 1, first: 0 });
            }, 1000);
        });
    }

    /**
    * 下载附件
    */
    public downloadSelectedAttach() {
        this.capitalSelecteds = this.selectedItems.map(x => x.mainFlowId);
        const hasSelect = this.hasSelectRow();
        // 未选择列表中数据时，检查公司名称是否一致
        if (!hasSelect && this.isDifferentCompany()) {
            this.xn.msgBox.open(false, '筛选条件下，具有不同公司！');
            return;
        }
        const params = { hasSelect, selectedCompany: this.defaultHeadquarter, fileList: [], capitalType: CapitalType.New };
        XnModalUtils.openInViewContainer(this.xn, this.vcr, CapitalPoolDownloadAttachmentsModalComponent, params).subscribe(x => {
            if (!!x) {
                this.xn.loading.open();
                const param = {
                    fileTypeKey: {},
                    isClassify: x.downloadType,
                    isSample: x.isSample,
                } as any;
                if (x.scope === SelectRange.All) {
                    param.capitalPoolId = this.capitalPoolId;
                } else {
                    param.mainFlowIdList = this.capitalSelecteds;
                }
                const rObj = {};
                x.contentType.split(',').forEach(x => {
                    rObj[x] = true;
                });
                param.fileTypeKey = rObj;
                this.xn.api.dragon.download('/list/main/download_deal_flies', param).subscribe((v: any) => {
                    this.xn.loading.close();
                    this.xn.api.dragon.save(v._body, '资产池附件.zip');
                });
            }
        });
    }

    /**
     * 导出清单
     *  hasSelect 导出选中项
     *  导出全部交易
     */
    public exportCapital() {
        let params = this.selectRowAndDifferentCompany();
        XnModalUtils.openInViewContainer(this.xn, this.vcr, CapitalPoolExportListModalComponent, params).subscribe(x => {
            if (!!x) {
                this.xn.loading.open();
                const param = {
                    mainFlowIdList: (+x.scope === SelectRange.All || +x.scope === SelectRange.Sample)
                        ? undefined
                        : this.selectedItems.map(x => x.mainFlowId),
                    capitalPoolId: this.capitalPoolId,
                };
                if (String(x.scope) === '3') {
                    param['isSample'] = 1;
                }
                if (Number(x.contentType) === SelectContent.Default) {
                    this.xn.api.dragon.download('/sub_system/yjl_system/yjl_pool_excel_download', param).subscribe((v: any) => {
                        this.xn.loading.close();
                        this.xn.api.dragon.save(v._body, '资产池清单.xlsx');
                    }, () => {
                        this.xn.loading.close();
                    });
                } else {
                    this.xn.api.dragon
                        .download('/project_manage/file_contract/receivables_excel_download', param)
                        .subscribe(
                            (v: any) => {
                                this.xn.api.dragon.save(v._body, '应收账款录入表清单.xlsx');
                            },
                            () => { },
                            () => {
                                this.xn.loading.close();
                            }
                        );
                }
            }
        });
    }

    /**
    * 抽样
    */
    capitalSample() {
        if (!this.listInfo.length) {
            this.xn.msgBox.open(false, '此资产池内暂无交易，不能发起抽样，请先添加交易');
            return;
        }
        this.xn.dragon.post('/sample/get_sample_sign', { capitalPoolId: this.capitalPoolId }).subscribe(x => {
            if (x.ret === 0 && x.data) {
                if (x.data.lastMainFlowIdList && x.data.lastMainFlowIdList.length) {
                    this.localStorageService.caCheMap.delete('assetSampleList');
                    this.localStorageService.setCacheValue('assetSampleList', JSON.stringify(x.data.lastMainFlowIdList));
                }
                if (x.data.isCapitalPoolSample) {
                    const params: EditParamInputModel = {
                        title: '该资产池已存在抽样资产，请确认是否继续抽样？',
                        checker: <CheckersOutputModel[]>[
                            { title: '抽样类型', checkerId: 'selectSample', type: 'radio', required: 1, options: { ref: 'selectSample' }, }
                        ],
                        buttons: ['取消', '继续抽样']
                    };
                    XnModalUtils.openInViewContainer(this.xn, this.vcr, EditModalComponent, params).subscribe(v => {
                        if (v === null) {
                            return;
                        } else {
                            //抽样页面
                            this.xn.router.navigate(['/agile-hz/assets-management/capital-sample'], {
                                queryParams: {
                                    isCapitalPoolSample: x.data.isCapitalPoolSample,
                                    selectSample: v.selectSample,
                                    totalCount: this.pageConfig.total,
                                    sumReceive: this.sumReceive,
                                    ...this.queryParams
                                }
                            });
                        }
                    });
                } else {
                    //抽样页面
                    this.xn.router.navigate(['/agile-hz/assets-management/capital-sample'], {
                        queryParams: {
                            isCapitalPoolSample: x.data.isCapitalPoolSample,
                            selectSample: -1,
                            totalCount: this.pageConfig.total,
                            sumReceive: this.sumReceive,
                            ...this.queryParams
                        }
                    });
                }
            }
        });

    }

    /**
    * 数据分析
    */
    dataAnalyse() {
        this.xn.router.navigate(['/agile-hz/assets-management/capital-data-analyse'], {
            queryParams: {
                totalCount: this.pageConfig.total,
                sumReceive: this.sumReceive,
                ...this.queryParams
            }
        });
    }

    /**
    * 特殊资产标记
    */
    specialAssetMark() {
        if (this.selectedItems.length === 0) {
            this.xn.msgBox.open(false, '请选择交易');
            return;
        } else if (this.selectedItems.length > 1) {
            this.xn.msgBox.open(false, `特殊资产标记一次只能操作单笔交易`);
            return false;
        }
        let mainFlowIds = this.selectedItems.map(x => x.mainFlowId);
        let rolesArr = this.xn.user.roles.filter((x) => {
            return x === "operator";
        });
        if (!(rolesArr && rolesArr.length)) {
            this.xn.msgBox.open(false, '您好，您的权限不够，仅【业务经办人】可进行操作');
        } else {
            this.xn.router.navigate([`/agile-hz/record/new/`],
                {
                    queryParams: {
                        id: 'sub_special_asset_sign',
                        relate: 'mainFlowId',
                        relateValue: mainFlowIds.toString(),
                    }
                });
        }
    }

    /**
     * 项目公司退回
     * @param item
     */
    viewReturnInfo(item: any) {
        const params: EditParamInputModel = {
            title: '退回原因',
            checker: <CheckersOutputModel[]>[
                { title: '退回原因', checkerId: 'returnMsg', type: 'textarea', required: 0, options: { readonly: true }, value: item.returnReason || '' },
            ],
            buttons: ['取消']
        };
        XnModalUtils.openInViewContainer(this.xn, this.vcr, EditModalComponent, params).subscribe(v => {
        });
    }

    /**
      * 合同弹窗--可签署或不签署
      * @param params 入参
      * @param urls 接口url
      */
    private doGenerateOrSign(params: any, urls: any) {
        this.xn.api.dragon.post(urls.generate, params).subscribe(con => {
            this.xn.loading.close();
            let contracts = [];
            contracts = con.data.contractList;
            const result = JSON.parse(JSON.stringify(contracts));
            result.isProxy = 57;
            if (result.length) {
                result.forEach(element => {
                    if (!element['config']) {
                        element['config'] = { text: '' };
                    }
                });
                result.forEach(x => {
                    console.info(x.label);
                    //雅居乐-恒泽
                    if (x.label === '应收账款转让通知书（适用于保理商向雅居乐下属公司出具）') {
                        x['config']['text'] = '（盖章）';
                    } else {
                        x['config']['text'] = '（盖章）';
                    }

                    // 是否只读
                    if (urls.type === 1) {
                        x['readonly'] = true;
                        x['isNoSignTitle'] = true;
                        x.caSignType = 1;
                    }
                });
                XnModalUtils.openInViewContainer(this.xn, this.vcr, DragonFinancingContractModalComponent, result).subscribe(x => {
                    if (x === 'ok') {
                        const p = con.data;
                        this.xn.loading.open();
                        this.xn.dragon.post(urls.update, p).subscribe(() => {
                            this.xn.loading.close();
                            if (this.defaultValue === 'B') {
                                this.getHeadorSearch(this.currentSubTab);
                            } else {
                                this.onPage({ page: this.paging });
                            }
                        });
                    }
                });
            }
        });
    }

    /**
     * 查看交易详情
     * @param mainFlowId
     */
    viewProgress(mainFlowId) {
        this.xn.router.navigate([`agile-hz/main-list/detail/${mainFlowId}`]);
    }

    /**
     * 查看业务详情
     * @param mainFlowId
     */
    viewDetail(mainFlowId: string) {
        this.tooltip$.next(mainFlowId);
    }

    /**
     * 查看业务详情接口调用
     * @param mainFlowId
     */
    viewDetailFunc(mainFlowId: string) {
        this.params.checker = ProjectManagerCapitalList.businessDetails.checkers;
        this.params.checker.forEach((x) => x.data = "");
        this.xn.dragon.post('/project_manage/file_contract/business_detail', { mainFlowId: mainFlowId }).subscribe(x => {
            if (x.ret === 0) {
                this.params.checker.forEach((obj) => {
                    if (obj.value === 'type') {
                        obj.data = x.data[0].type === 1 ? 'ABS业务' : x.data[0].type === 2 ? '再保理' : '非标';
                    } else if (obj.value === 'freezeOne') {
                        obj.data = x.data[0].freezeOne === 0 ? '未冻结' : '已冻结';
                    } else if (obj.value === 'headPreDate' || obj.value === 'factoringEndDate' || obj.value === 'realLoanDate' || obj.value === 'priorityLoanDate') {
                        obj.data = x.data[0][obj.value] ? moment(x.data[0][obj.value]).format('YYYY-MM-DD') : '';
                    } else {
                        obj.data = x.data[0][obj.value] || '';
                    }
                });
            }
        });
    }

    /**
     * 查看尽调意见
     * @param item
     * @param advise 尽调意见
     * @param firstAdvise 初审尽调意见
     * @param surveyMan 尽调人
     * @param firstSurveyMan 初审尽调人
     */
    viewSurveyInfo(item: any, advise: string, firstAdvise: string, surveyMan: string, firstSurveyMan: string) {
        let _advise = item[advise] || item[firstAdvise];
        let _type = item[advise] ? '终审尽调意见' : '初审尽调意见';
        let _surveyMan = item[surveyMan] || item[firstSurveyMan];
        const params: EditParamInputModel = {
            title: '查看尽调意见',
            checker: <CheckersOutputModel[]>[
                { title: '类型', checkerId: 'surveyType', type: 'text', required: 0, options: { readonly: true }, value: _type },
                { title: '尽调意见', checkerId: 'surveyInfo', type: 'textarea', required: 0, options: { readonly: true }, value: _advise },
                { title: '尽调人', checkerId: 'surveyPerson', type: 'text', required: 0, options: { readonly: true }, value: _surveyMan },
            ],
            buttons: ['确定']
        };
        XnModalUtils.openInViewContainer(this.xn, this.vcr, EditModalComponent, params).subscribe(v => {
        });
    }

    /**
     * 行按钮组事件
     * @param item 当前行数据
     * @param btn 按钮操作配置
     * @param i 下标
     */
    public handleRowClick(item: any, btn: ButtonConfigModel) {
        if (btn.operate === 'sub_start_survey') {
            //发起尽调
            //点击此按钮需判断业务是否已完成供应商上传资料
            if (item.flowId === 'yjl_financing') {
                this.xn.msgBox.open(false, `供应商尚未上传资料，暂时无法尽调，请稍候再试`);
                return '';
            }
            //经办人（管理人或律所角色）
            let rolesArr = this.xn.user.roles.filter((x) => {
                return x === "operator";
            });
            if (!(rolesArr && rolesArr.length)) {
                this.xn.msgBox.open(false, '您好，您的权限不够，仅【业务经办人】可进行操作');
                return '';
            } else {
                this.xn.router.navigate([`/agile-hz/record/new/`],
                    {
                        queryParams: {
                            id: 'sub_law_manager_survey',
                            relate: 'mainFlowId',
                            relateValue: item.mainFlowId,
                        }
                    });
            }
        } else if (btn.operate === 'sub_dispose_special_capital') {
            //处置特殊资产
            //1 管理人角色、保理商角色
            let rolesArr = this.xn.user.roles.filter((x) => {
                return x === "operator";
            });
            if (!(rolesArr && rolesArr.length)) {
                this.xn.msgBox.open(false, '您好，您的权限不够，仅【业务经办人】可进行操作');
                return '';
            } else {
                this.xn.router.navigate([`/agile-hz/record/new/`],
                    {
                        queryParams: {
                            id: 'sub_special_asset_dispose',
                            relate: 'mainFlowId',
                            relateValue: item.mainFlowId,
                        }
                    });
            }
        }
    }

    /**
     * 选择交易处理
     */
    private selectRowAndDifferentCompany() {
        const selectedRows = this.listInfo.filter(
            x => x.checked && x.checked === true
        );
        const params = { hasSelect: !!selectedRows && selectedRows.length > 0, selectedCompany: '', capitalType: CapitalType.New, capitalFlag: 2 };
        //未选择列表中数据时，检查公司名称是否一致
        if (!params.hasSelect) {
            params.selectedCompany = XnUtils.distinctArray(this.listInfo.map(c => tradeType[c.isProxy]));
            if (params.selectedCompany.length > 1) {
                this.xn.msgBox.open(false, '筛选条件下，具有不同公司！');
                return;
            } else {
                params.selectedCompany = params.selectedCompany.toString();
            }
        } else {
            params.selectedCompany = XnUtils.distinctArray(selectedRows.map(c => tradeType[c.isProxy])).toString();
        }
        return params;
    }

    /**
     * 添加交易
     */
    addTransaction() {
        this.xn.router.navigate([`/agile-hz/assets-management/enter-pool`], {
            queryParams: {
                projectName: this.fitProject,
                capitalPoolId: this.capitalPoolId,
                capitalPoolName: this.capitalPoolName,
                headquarters: this.headquarters,
            }
        });
    }





}

export enum tradeType {
    "雅居乐-恒泽（集团）股份有限公司" = 57,
}

export enum GenerateContractType {
    "yjl" = 57,
}

/**
 * 排序列表
 * 具体调试参考表
 */
enum TradeListOrderEnum {
    mainFlowId = 1,
    projectCompany = 2,
    debtUnit = 3,
    projectSite = 4,
    debtSite = 5,
    payConfirmId = 16,
    receive = 6,
    discountRate = 7,
    flowId = 8,
    contractType = 9,
    surveyStatus = 13,
    isInvoiceFlag = 10,
    priorityLoanDate = 14,
    realLoanDate = 15,
    factoringEndDate = 11,
    surveyMan = 12,
}
