/*
 * Copyright(c) 2017-2019, 深圳市链融科技股份有限公司
 * Shenzhen Lianrong Technology Co., Ltd.
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
import { FileViewModalComponent } from 'libs/shared/src/lib/public/modal/file-view-modal.component';
import { XnUtils } from 'libs/shared/src/lib/common/xn-utils';
import { PdfSignModalComponent } from 'libs/shared/src/lib/public/modal/pdf-sign-modal.component';
import { XnFormUtils } from 'libs/shared/src/lib/common/xn-form-utils';
import { HwModeService } from 'libs/shared/src/lib/services/hw-mode.service';
import { ButtonConfigModel } from 'libs/shared/src/lib/config/list-config-model';
import { DeletematerialEditModalComponent } from 'libs/shared/src/lib/public/dragon-vanke/modal/delete-material-modal.component';
import { DragonChoseCapitalinfoComponent } from 'libs/shared/src/lib/public/dragon-vanke/modal/chose-capitalPool-modal.component';
import { CapitalPoolDownloadAttachmentsModalComponent } from 'libs/shared/src/lib/public/dragon-vanke/modal/capital-pool-download-attachmentsmodal.component';
import { SelectRange, CapitalType } from '../../capital-pool/emus';
import { CapitalPoolExportListModalComponent } from 'libs/shared/src/lib/public/dragon-vanke/modal/capital-pool-export-list-modal.component';
import { EditModalComponent } from 'libs/shared/src/lib/public/dragon-vanke/modal/edit-modal.component';
import { HeadquartersTypeEnum } from 'libs/shared/src/lib/config/select-options';
declare const $: any;

@Component({
    selector: 'enter-capital-pool-confirmation',
    templateUrl: `./enter-capital-pool-confirmation.component.html`,
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
export class DragonEnterpoolComponent implements OnInit {
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
    public formCapitalPool: any = {
        capitalId: 'CASH_POOLING_100',
        capitalPoolName: '龙光2期',
        isProxy: 52,
        type: 1,
        currentPage: 1,
        isLocking: 0,
        storageRack: 'lg-2',
    };
    public isFirst = true;
    public headquarters = HeadquartersTypeEnum[5];
    fitProject = '';
    capitalPoolId: string;
    capitalPoolName: string;
    public selectedReceivables = 0; // 所选交易的应收账款金额汇总
    public selectedPayableAmounts = 0; // 所选交易的转让价款汇总
    public allReceivables = 0; // 所有交易的应收账款金额汇总
    public allPayableAmounts = 0; // 所有交易的转让价款汇总
    public capitalSelecteds: any[];
    downLoadList: any[] = [];
    private defaultHeadquarter = HeadquartersTypeEnum[1];

    constructor(private xn: XnService,
        private vcr: ViewContainerRef,
        public hwModeService: HwModeService,
        private router: ActivatedRoute,
        private localStorageService: LocalStorageService) {
    }

    ngOnInit(): void {
        this.router.queryParams.subscribe(x => {
            if (x.projectName !== undefined) {
                this.fitProject = x.projectName + '>';
                this.capitalPoolId = x.capitalPoolId;
                this.capitalPoolName = x.capitalPoolName;
                this.headquarters = x.headquarters;
            }


        });
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
            this.selectedReceivables = 0;
            this.selectedPayableAmounts = 0;
            this.naming = '';
            this.sorting = '';
        }
        this.label = val;
        this.onPage({ page: this.paging });
    }

    /**
       * 行按钮组事件
       * @param paramItem 当前行数据
       * @param paramBtnOperate 按钮操作配置
       * @param i 下标
       */
    public handleHeadClick(paramBtnOperate: ButtonConfigModel) {
        if (paramBtnOperate.operate === 'enter-capitalpool') { // 移入资产池
            if (this.selectedItems.length === 0) {
                this.xn.msgBox.open(false, '请选择交易');
                return;
            }
            this.enterCapitalpool(1, this.headquarters);
        } else if (paramBtnOperate.operate === 'delete-capitalpool') { // 移除资产池
            if (this.selectedItems.length === 0) {
                this.xn.msgBox.open(false, '请选择交易');
                return;
            }
            this.enterCapitalpool(2);
        } else if (paramBtnOperate.operate === 'batch-information') { // 批量补充信息
            if (this.selectedItems.length === 0) {
                this.xn.msgBox.open(false, '请选择交易');
                return;
            }
            this.batchModify();
        } else if (paramBtnOperate.operate === 'download-file') { // 下载附件
            this.downloadSelectedAttach();
        } else if (paramBtnOperate.operate === 'export-file') { // 导出清单
            this.exportCapital();
        }
    }
    private hasSelectRow() {
        const selectedRows = this.data.filter((x: any) => x.checked && x.checked === true);

        return !!selectedRows && selectedRows.length > 0;
    }
    private isDifferentCompany() {
        const company = XnUtils.distinctArray(this.data.filter((x: any) => x.headquarters).map(c => c.headquarters)) || [];

        return company.length > 1;
    }

    public stringLength(paramsString: string) {
        return paramsString.length;
    }

    viewMemo(paramMemo: string) {
        const checkers = [{
            title: '备注',
            checkerId: 'memo',
            type: 'textarea',
            options: { readonly: true },
            value: paramMemo,
            required: 0
        }];
        const params = {
            checker: checkers,
            title: '查看备注',
            buttons: ['确定'],
        };
        XnModalUtils.openInViewContainer(this.xn, this.vcr, EditModalComponent, params)
            .subscribe((v) => {
            });

    }
    /**
    * 下载附件
    */
    public downloadSelectedAttach() {
        if (this.selectedItems.length === 0) {
            this.xn.msgBox.open(false, '请选择交易');
            return;
        }
        this.capitalSelecteds = this.selectedItems.map(x => x.mainFlowId);


        const hasSelect = this.hasSelectRow();
        // 未选择列表中数据时，检查公司名称是否一致
        if (!hasSelect && this.isDifferentCompany()) {
            this.xn.msgBox.open(false, '筛选条件下，具有不同公司！');

            return;
        }
        const params = { hasSelect, selectedCompany: this.defaultHeadquarter, fileList: [] };
        XnModalUtils.openInViewContainer(
            this.xn,
            this.vcr,
            CapitalPoolDownloadAttachmentsModalComponent,
            params
        ).subscribe(x => {
            if (!!x) {
                this.xn.loading.open();
                const param = {
                    fileTypeKey: {},
                    isClassify: x.downloadType,
                    // isSample: x.isSample,
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

    public exportCapital() {
        if (this.selectedItems.length === 0) {
            this.xn.msgBox.open(false, '请选择交易');
            return;
        }
        const params = this.selectRowAndDifferentCompany();
        XnModalUtils.openInViewContainer(this.xn, this.vcr, CapitalPoolExportListModalComponent, params).subscribe(x => {
            if (x === '') {
                return;
            }
            this.xn.loading.open();
            const param = {
                mainFlowIdList: +x.scope === SelectRange.All
                    ? undefined
                    : this.selectedItems.map(x => x.mainFlowId),
                capitalPoolId: '',
                scope: x.scope,
                headquarters: HeadquartersTypeEnum[5]

            };
            // 龙光-博时资本 需要isLgBoShi字段区分龙光的业务 0=非龙光博时资本 1=龙光博时资本
            this.xn.api.dragon.download('/project_manage/file_contract/down_excel', { ...param, isLgBoShi: 1 }).subscribe((v: any) => {
                this.xn.loading.close();
                this.xn.api.dragon.save(v._body, '资产池清单.xlsx');
            }, () => {
                this.xn.loading.close();
            });
        });
    }

    private selectRowAndDifferentCompany() {
        const selectedRows = this.data.filter(
            x => x.checked && x.checked === true
        );
        const params = { hasSelect: !!selectedRows && selectedRows.length > 0, selectedCompany: '' };
        //未选择列表中数据时，检查公司名称是否一致
        if (!params.hasSelect) {
            params.selectedCompany = XnUtils.distinctArray(this.data.map(c => c.headquarters));
            if (params.selectedCompany.length > 1) {
                this.xn.msgBox.open(false, '筛选条件下，具有不同公司！');
                return;
            } else {
                params.selectedCompany = params.selectedCompany.toString();
            }
        } else {
            params.selectedCompany = XnUtils.distinctArray(selectedRows.map(c => c.headquarters)).toString();
        }
        return params;
    }

    /**
     * @param e  event.page: 新页码 <br> event.pageSize: 页面显示行数<br>event.first: 新页面之前的总行数<br>event.pageCount : 页码总数
     * @param type 标签页
     */
    public onPage(e?) {
        this.selectedReceivables = 0;
        this.selectedPayableAmounts = 0;
        this.selectedItems = [];
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
            if (x.data && x.data.rows && x.data.rows.length) {
                this.data = x.data.rows;
                this.allReceivables = x.data.sumReceive || 0;
                this.allPayableAmounts = x.data.sumChangePrice || 0;
                this.pageConfig.total = x.data.count;
                this.data.forEach(item => item.receive = item.receive.toFixed(2));
            } else {
                // 固定值
                this.data = [];
                this.allReceivables = 0;
                this.allPayableAmounts = 0;
                this.pageConfig.total = 0;
            }
        }, () => {
            // 固定值
            this.data = [];
            this.allReceivables = 0;
            this.allPayableAmounts = 0;
            this.pageConfig.total = 0;
        }, () => {
            this.xn.loading.close();
        });
    }
    enterCapitalpool(paramType: number, headquarters?: string) {
        if (paramType === 1) { // 移入资产池
            if (this.fitProject !== '') {
                XnModalUtils.openInViewContainer(this.xn, this.vcr, DeletematerialEditModalComponent,
                    {
                        selectedItems: this.selectedItems,
                        type: 1,
                        capitalName: this.capitalPoolName,
                        capitalPoolId: this.capitalPoolId
                    }).subscribe((x) => {
                        if (x === null) {
                            return;
                        } else {
                            this.onPage({ page: this.paging });
                        }

                    });
            } else {
                XnModalUtils.openInViewContainer(this.xn, this.vcr, DragonChoseCapitalinfoComponent,
                    { selectedItems: this.selectedItems, type: paramType, headquarters }).subscribe((x) => {
                        if (x === null) {
                            return;
                        } else {
                            this.onPage({ page: this.paging });
                        }

                    });
            }

        } else {
            XnModalUtils.openInViewContainer(this.xn, this.vcr, DeletematerialEditModalComponent,
                { selectedItems: this.selectedItems, type: paramType }).subscribe((x) => {
                    if (x === null) {
                        return;
                    } else {
                        this.onPage({ page: this.paging });
                    }

                });
        }

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
        this.localStorageService.setCacheValue('batchModifyMainList', param);
        const formCapitalPool = { isEnterPoor: true, ...this.formCapitalPool }; // 拟入池标识
        this.xn.router.navigate(['/pslogan/capital-pool/batch-modify'], {
            queryParams: formCapitalPool
        });
    }

    /**
     *  搜索,默认加载第一页
     */
    public searchMsg() {
        this.selectedItems = [];
        this.allReceivables = 0;
        this.allPayableAmounts = 0;
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
        this.allReceivables = 0;
        this.allPayableAmounts = 0;
        this.isFirst = true;
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
        return !(this.data.some(x => !x.checked || x.checked && x.checked === false) || this.data.length === 0);
    }

    /**
     *  全选
     * @param e
     */
    public checkAll(e) {
        if (!this.isAllChecked()) {
            this.data.forEach(item => item.checked = true);
            this.selectedItems = XnUtils.distinctArray2([...this.selectedItems, ...this.data], 'mainFlowId');
        } else {
            this.data.forEach(item => item.checked = false);
            this.selectedItems = [];
        }
        this.selectedReceivables = this.selectedItems.reduce((accumulator, currentValue) => accumulator + Number(currentValue.receive ? currentValue.receive : 0), 0).toFixed(2);
        this.selectedPayableAmounts = this.selectedItems.reduce((accumulator, currentValue) => accumulator + Number(currentValue.changePrice ? currentValue.changePrice : 0), 0).toFixed(2);
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
            this.selectedItems = this.selectedItems.filter((x: any) => x.mainFlowId !== item.mainFlowId);
        } else {
            item.checked = true;
            this.selectedItems.push(item);
            this.selectedItems = XnUtils.distinctArray2(this.selectedItems, 'mainFlowId'); // 去除相同的项
        }
        this.selectedReceivables = this.selectedItems.reduce((accumulator, currentValue) => accumulator + Number(currentValue.receive ? currentValue.receive : 0), 0).toFixed(2);
        this.selectedPayableAmounts = this.selectedItems.reduce((accumulator, currentValue) => accumulator + Number(currentValue.changePrice ? currentValue.changePrice : 0), 0).toFixed(2);
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
            obj.isShow = searches[i].isShow;
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
                    if (search.checkerId === 'tradeStatus') {
                        params['flowId'] = this.arrObjs[search.checkerId];
                    } else if (search.checkerId === 'createTime') {
                        const date = JSON.parse(this.arrObjs[search.checkerId]);
                        params['beginTime'] = date.beginTime;
                        params['endTime'] = date.endTime;

                    } else if (search.checkerId === 'headquarters') {

                        this.headquarters = this.arrObjs[search.checkerId];
                        params[search.checkerId] = this.arrObjs[search.checkerId];


                    } else if (search.checkerId === 'isHeadPreDate') {
                        const date = JSON.parse(this.arrObjs[search.checkerId]);
                        if (date.isPriorityLoanDate === 0) {
                            params['isHeadPreDate'] = 0;
                        } else if (date.isPriorityLoanDate > 0) {
                            params['isHeadPreDate'] = date.isPriorityLoanDate;
                            params['headPreDateStart'] = date.priorityLoanDateStart;
                            params['headPreDateEnd'] = date.priorityLoanDateEnd;
                        }

                    } else if (search.checkerId === 'isInvoiceFlag') {
                        params['isInvoiceFlag'] = Number(this.arrObjs['isInvoiceFlag']);

                    } else if (search.checkerId === 'capitalPoolName') {
                        const info = JSON.parse(this.arrObjs[search.checkerId]);
                        if (info.status === '0') {
                            params['capitalPoolStatus'] = 0;
                        } else {
                            params['capitalPoolStatus'] = 1;
                            params['capitalPoolName'] = info.text;
                        }
                    } else if (search.checkerId === 'productType') {
                        const val = JSON.parse(this.arrObjs[search.checkerId]);
                        params['type'] = String(val.proxy);
                        if (!!val.status) {
                            params['selectBank'] = String(val.status)
                        }
                    } else {
                        params[search.checkerId] = this.arrObjs[search.checkerId];
                    }
                }
            }
            // params['headquarters'] = HeadquartersTypeEnum[5];
            params.isProxy = 52;
            params.isLgBoShi = 1; // 0=非龙光博时资本 1=龙光博时资本
            return params;
        }
    }

    private buildChecker(stepRows) {
        for (const row of stepRows) {
            XnFormUtils.convertChecker(row);
        }
    }
    goback() {
        this.xn.user.navigateBack();
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
}
