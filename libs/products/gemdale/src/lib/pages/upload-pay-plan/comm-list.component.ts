import { Component, OnInit, ViewContainerRef, Input } from '@angular/core';
import { XnService } from 'libs/shared/src/lib/services/xn.service';
import { ActivatedRoute } from '@angular/router';
import CommUtils from 'libs/shared/src/lib/public/component/comm-utils';
import CommBase from 'libs/shared/src/lib/public/component/comm-base';
import { XnFormUtils } from 'libs/shared/src/lib/common/xn-form-utils';
import { FormGroup } from '@angular/forms';
import { XnUtils } from 'libs/shared/src/lib/common/xn-utils';
import { CommonPage, PageTypes } from 'libs/shared/src/lib/public/component/comm-page';
import { XnModalUtils } from 'libs/shared/src/lib/common/xn-modal-utils';
import { PdfSignModalComponent } from 'libs/shared/src/lib/public/modal/pdf-sign-modal.component';
import { LocalStorageService } from 'libs/shared/src/lib/services/local-storage.service';
import { LoadingService } from 'libs/shared/src/lib/services/loading.service';
import { forkJoin } from 'rxjs';
import { BankCardAddComponent } from 'libs/shared/src/lib/public/component/bank-card-add.component';
import { BankCardEditComponent } from 'libs/shared/src/lib/public/component/bank-card-edit.component';

import * as moment from 'moment';
import { HeadquartersTypeEnum } from 'libs/shared/src/lib/config/select-options';

/**
 *  公用列表
 */
@Component({
    selector: 'xn-gemdale-list-component',
    templateUrl: './comm-list.component.html',
    styles: [
        `.table {
            font-size: 13px;
        }

        .table-head .sorting, .table-head .sorting_asc, .table-head .sorting_desc {
            /*position: relative;*/
            cursor: pointer
        }

        .table-head .sorting:after, .table-head .sorting_asc:after, .table-head .sorting_desc:after {
            /*position: absolute;*/
            /*bottom: 8px;*/
            /*right: 8px;*/
            /*display: block;*/
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

        .tab-heads {
            margin-bottom: 10px;
            display: flex
        }

        .tab-buttons {
            flex: 1;
        }

        .tab-search {
            text-align: right;
        }

        .form-control {
            display: inline-block;
            border-radius: 4px;
            box-shadow: inset 0 1px 1px rgba(0, 0, 0, .075);
            width: 200px
        }

        .btn {
            vertical-align: top
        }

        .small-font {
            font-size: 12px;
            margin-right: 10px;
        }

        .item-box {
            position: relative;
            display: flex;
            margin-bottom: 10px;
        }

        .item-box i {
            position: absolute;
            top: 11px;
            right: 23px;
            opacity: 0.5;
            cursor: pointer;
        }

        .plege {
            color: #3c8dbc
        }

        .plege.active {
            color: #ff3000;
        }

        tbody tr:hover {
            background-color: #e6f7ff;
            transition: all 0.1s linear
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

        .fr {
            float: right
        }

        .money-control {
            display: flex;
            line-height: 35px;
        }

        .text-right {
            text-align: right
        }

        .list-title {
            max-width: 280px !important;
        }

        .long-title {
            min-width: 280px !important;
        }

        ul li {
            list-style-type: none;
        }

        .item-list {
            position: absolute;
            max-height: 200px;
            width: 375px;
            padding: 0px;
            z-index: 1;
            background: #fff;
            overflow-y: auto;
            border: 1px solid #DDD;
        }

        .item-list li {
            padding: 2px 12px;
        }

        .item-list li:hover {
            background-color: #ccc;
        }

        .btn-label {
            margin-bottom: 10px;
        }

        .btn-more {
            margin-top: 10px;
        }

        .btn-more-a {
            position: relative;
            left: 50%;
            transform: translateX(-50%)
        }

        .btn-cus {
            border: 0;
            margin: 0;
            padding: 0
        }
        `
    ]
})
export class GemdaleCommListComponent extends CommonPage implements OnInit {
    @Input() superConfig: any;
    total = 0;
    pageSize = 10;
    first = 0;
    rows: any[] = [];
    words = '';

    sorting = ''; // 共享该变量
    naming = ''; // 共享该变量
    paging = 0; // 共享该变量
    beginTime: any;
    endTime: any;
    arrObjs = {} as any; // 缓存后退的变量

    heads: any[];
    searches: any[];
    shows: any[];
    base: CommBase;
    mainForm: FormGroup;
    timeId = [];
    nowTimeCheckId = '';
    showBtn: false;
    preChangeTime: any[] = [];
    isClearing = false;
    public supplierOperateAppId: any;

    constructor(public xn: XnService,
                public vcr: ViewContainerRef,
                public route: ActivatedRoute,
                private localStorageService: LocalStorageService, private loading: LoadingService) {
        super(PageTypes.List);
    }

    ngOnInit() {
        if (!!this.superConfig) {
            this.base = new CommBase(this, this.superConfig);
            this.heads = CommUtils.getListFields(this.superConfig.fields);
            this.searches = CommUtils.getSearchFields(this.superConfig.fields);
            this.buildShow(this.searches);
            this.pageSize = this.superConfig.list && this.superConfig.list.pageSize || this.pageSize;
            setTimeout(() => {
                this.onPage({ page: this.paging });
            });
        } else {

            this.route.data.subscribe((superConfig: any) => {
                this.base = new CommBase(this, superConfig);
                this.heads = CommUtils.getListFields(superConfig.fields);
                this.searches = CommUtils.getSearchFields(superConfig.fields);
                this.buildShow(this.searches);
                this.pageSize = superConfig.list && superConfig.list.pageSize || this.pageSize;
                setTimeout(() => {
                    this.onPage({ page: this.paging });
                });
            });
        }
        if (this.xn.user.orgType === 1) {
            this.supplierAppIdSet();
        }
    }

    /**
     *  @param event
     *       event.page: 新页码
     *       event.pageSize: 页面显示行数
     *       event.first: 新页面之前的总行数,下一页开始下标
     *       event.pageCount : 页码总数
     */
    onPage(event: any): void {
        this.paging = event.page || 1;
        this.pageSize = event.pageSize || this.pageSize;
        // 后退按钮的处理
        this.onUrlData();
        this.first = (this.paging - 1) * this.pageSize;
        const params = this.buildParams();
        this.base.onList(params);
    }

    /**
        * 找出所有企业类型为供应商的 appId 合集
        */
    private supplierAppIdSet() {
        this.xn.api.post('/custom/vanke_v5/app/get_app',
            { orgName: this.xn.user.orgName }).subscribe(x => {
                this.supplierOperateAppId = x.data;
            });
    }


    /**
     * 新增银行卡弹窗
     */
    public bankCardAdd() {
        XnModalUtils.openInViewContainer(this.xn, this.vcr, BankCardAddComponent, {}).subscribe(json => {
            if (json == 'ok') {
                this.xn.api.post('/bank_card?method=get', {
                    start: (this.paging - 1) * this.pageSize,
                    length: this.pageSize
                }).subscribe(x => {
                    this.rows = x.data.data;
                    this.total = x.data.recordsTotal;
                });
            }
        });
    }

    /**
     * 修改银行卡弹窗
     * @params row 修改的银行卡记录
     */
    public bankCardEdit(row) {
        const bankId = row.bankCode;
        this.xn.api.post('/bank_info_list/query', {
            bankId
        }).subscribe(x => {
            if (x.ret == 0) {
                const data = x.data.bankInfo;
                row.bankName = data.bankName;
                row.bankHead = data.bankHead;
                row.province = data.province;
                row.city = data.city;
                XnModalUtils.openInViewContainer(this.xn, this.vcr, BankCardEditComponent, row).subscribe(json => {
                    if (json == 'ok') {
                        this.xn.api.post('/bank_card?method=get', {
                            start: (this.paging - 1) * this.pageSize,
                            length: this.pageSize
                        }).subscribe(x => {
                            this.rows = x.data.data;
                            this.total = x.data.recordsTotal;
                        });
                    }
                });
            }
        });
    }

    /**
     * 删除银行卡
     * @params row 要删除的银行卡记录
     */
    public bankCardDelete(row, i) {
        this.xn.msgBox.open(true, '确认删除', () => {
            const cardCode = row.cardCode;
            const del = {
                where: {
                    cardCode
                }
            };
            this.xn.api.post('/bank_card?method=delete', del).subscribe(x => {
                if (x.ret == 0) {
                    this.rows.splice(i, 1);
                    this.xn.api.post('/bank_card?method=get', {
                        start: (this.paging - 1) * this.pageSize,
                        length: this.pageSize
                    }).subscribe(x => {
                        this.rows = x.data.data;
                        this.total = x.data.recordsTotal;
                    });
                }
            });
        });
    }

    onSort(sort: string): void {
        // 如果已经点击过了，就切换asc 和 desc
        if (this.sorting === sort) {
            this.naming = this.naming === 'desc' ? 'asc' : 'desc';
        } else {
            this.sorting = sort;
            this.naming = 'asc';
        }

        this.onPage(this.paging);
    }

    onSortClass(checkerId: string): string {
        if (checkerId === this.sorting) {
            return 'sorting_' + this.naming;
        } else {
            return 'sorting';
        }
    }

    onTextClass(type) {
        if (type === 'money') {
            return 'text-right';
        } else if (type === 'list-title') {
            return 'list-title';
        } else if (type === 'long-title') {
            return 'long-title';
        } else {
            return '';
        }
    }

    onSearch(): void {

        this.paging = 1;
        this.onPage(this.paging);
    }

    onBtnShow(btn, row): boolean {
        return btn.can(this, row);
    }

    onBtnEdit(btn, row): boolean {
        return btn.edit(row, this.xn);
    }

    onBtnClick(btn, row): void {
        btn.click(this.base, row, this.xn, this.vcr);
    }

    onCssClass(status) {
        return status === 1 ? 'active' : '';
    }

    onBtnClickEvent(btn, row, event): void {
        btn.click(this, row, event, this.xn);
    }

    downAll() {
        const flowIds$ = this.rows.map(x => this.xn.api.post('/flow/main/detail', { mainFlowId:  x.mainFlowId}));
        forkJoin(flowIds$).subscribe(async (x: any) => {
            const arr = [].concat(x).filter((y: any) => y.data);
            for (let j = 0; j < arr.length; j++) {
                const row = arr[j];
                for (const rowlog of row.data.logs) {
                    try {
                        rowlog.contracts = JSON.parse(rowlog.contracts);
                    } catch (e) {
                        rowlog.contracts = [];
                    }
                }
                if (j > 0) {
                    await CommUtils.sleep(1000);
                }
                await this.rexDownload(row.data, row.data.mainFlowId);
            }
        });
    }
    /**
     * 下载注册信息
     */
    customClick(btn){
        const params = this.buildParams();
        const param = {} as any;
        if (params && params.where && params.where._complex
            && params.where._complex.appId && params.where._complex.appId.length === 2){
            param.appId = String(params.where._complex.appId[1]).replace(/[%]/g, '');
        }
        if (params && params.where && params.where._complex
            && params.where._complex.appName && params.where._complex.appName.length === 2){
            param.appName = String(params.where._complex.appName[1]).replace(/[%]/g, '');
        }
        if (params && params.where && params.where._complex
            && params.where._complex.orgLegalPerson && params.where._complex.orgLegalPerson.length === 2){
            param.orgLegalPerson = String(params.where._complex.orgLegalPerson[1]).replace(/[%]/g, '');
        }
        if (params && params.where && params.where._complex && ['0', '1', '2'].includes(String(params.where._complex.status))){
            param.status = String(params.where._complex.status);
        }
        btn.click( this.xn, this.base, param);
    }

    /**
     *  清空搜索内容
     */
    clearSearch() {
        this.isClearing = true;
        for (const key in this.arrObjs) {
            if (this.arrObjs.hasOwnProperty(key)) {
                delete this.arrObjs[key];
            }
        }

        this.beginTime = moment().subtract(365, 'days').valueOf(); // 初始化时间兼容后退时间
        this.endTime = moment().valueOf();

        this.buildCondition(this.searches);
        this.onSearch(); // 清空之后自动调一次search
        this.paging = 1; // 回到第一页
        this.isClearing = false;

        // 清除 创建时间 值
        this.mainForm.controls.createTime.setValue(null);
        this.mainForm.controls.payTime.setValue(null);
    }

    // 查看交易流程
    viewProcess(item: any) {
        this.xn.router.navigate([`console/main-list/detail/${item}`]);
    }

    handleClick(row) {
        this.xn.router.navigate([`/console/invoice-display/invoice-list`]);
        this.localStorageService.setCacheValue('invoices_mainFlowId', row.mainFlowId); // 暂存mainFlowId
    }

    doProcess(record: any) {
        XnUtils.doProcess(record, this.xn);
    }

    // 构建参数
    private buildParams() {
        // 分页处理
        const params: any = {
            start: (this.paging - 1) * this.pageSize,
            length: this.pageSize,
            beginTime: this.beginTime,
            endTime: this.endTime
        };
        // 排序处理
        if (this.sorting && this.naming) {
            params.order = [this.sorting + ' ' + this.naming];
        }

        // 搜索处理
        if (this.searches.length > 0 && !$.isEmptyObject(this.arrObjs)) {
            params.where = {
                _complex: {
                    _logic: 'AND',  // 搜索时是AND查询
                    headquarters: ["like", `%${HeadquartersTypeEnum[2]}%`]
                }
            };
            for (const search of this.searches) {
                if (!XnUtils.isEmpty(this.arrObjs[search.checkerId])) {
                    params.where._complex[search.checkerId] = search.type && ['select', 'listing'].includes(search.type)
                        ? this.arrObjs[search.checkerId]
                        : ['like', `%${this.arrObjs[search.checkerId]}%`];
                }
            }
        } else {
            params.where = {
                _complex: {
                    _logic: 'AND',  // 搜索时是AND查询
                    headquarters: ["like", `%${HeadquartersTypeEnum[2]}%`]
                }
            }
        }

        return params;
    }

    private buildShow(searches) {
        this.shows = [];
        this.onUrlData();
        this.buildCondition(searches);
    }

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
            obj.options = { ref: searches[i].selectOptions };
            if (searches[i].checkerId === this.timeId[0]) {
                obj.value = JSON.stringify(tmpTime);
            } else {
                obj.value = this.arrObjs[searches[i].checkerId];
            }
            objList.push(obj);
        }

        this.shows = $.extend(true, [], objList.sort(function(a, b) {
            return a.number - b.number;
        })); // 深拷贝;
        XnFormUtils.buildSelectOptions(this.shows);
        this.buildChecker(this.shows);
        this.mainForm = XnFormUtils.buildFormGroup(this.shows);

        const time = this.searches.filter(v => v.type === 'quantum');

        const timeCheckId = time[0] && time[0].checkerId;
        this.nowTimeCheckId = timeCheckId;

        this.mainForm.valueChanges.subscribe((v) => {
            if (this.isClearing) {
                return;
            }

            const changeId = v[timeCheckId];
            delete v[timeCheckId];
            if (changeId && this.nowTimeCheckId) {
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
                        // nothing
                    } else {
                        this.paging = 1;
                        this.first = (this.paging - 1) * this.pageSize;
                        this.rows.splice(0, this.rows.length);
                        const params = this.buildParams();
                        this.base.onList(params);
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

    private buildChecker(stepRows) {
        for (const row of stepRows) {
            XnFormUtils.convertChecker(row);
        }
    }

    // 回退操作
    private onUrlData(data?) {
        const urlData = this.xn.user.getUrlData(this.xn.router.url);
        if (urlData && urlData.pop) {
            this.paging = urlData.data.paging || this.paging;
            this.pageSize = urlData.data.pageSize || this.pageSize;
            this.sorting = urlData.data.sorting || this.sorting;
            this.naming = urlData.data.naming || this.naming;
            this.words = urlData.data.words || this.words;
            this.beginTime = urlData.data.beginTime || this.beginTime;
            this.endTime = urlData.data.endTime || this.endTime;
            this.arrObjs = urlData.data.arrObjs || this.arrObjs;
        } else {
            this.xn.user.setUrlData(this.xn.router.url, {
                pageSize: this.pageSize,
                paging: this.paging,
                sorting: this.sorting,
                naming: this.naming,
                words: this.words,
                beginTime: this.beginTime,
                endTime: this.endTime,
                arrObjs: this.arrObjs
            });
        }
    }
    /**
  *  格式化需要下载的文件
  * @param paramAction
  * @param paramFileArr
  */
    private selectFiles(paramAction, paramFileArr, params): Array<any> {
        // 所有文件子流程id（不包含保理放款和回款）
        const checkerFile = [];
        // 放款和回款的格式不一样，单独处理
        const checkerMoneyFile = ['factoring_loan', 'factoring_repayment'];
        params.logs.map(v => {
            if (v && v.flowId && (v.flowId !== 'factoring_loan' || v.flowId !== 'factoring_repayment')) {
                checkerFile.push(v.flowId);
            }
        });
        // 其他文件信息
        for (const check of checkerFile) {
            if (paramAction && paramAction.flowId && paramAction.flowId === check) {
                const checkers = JSON.parse(paramAction.checkers);
                this.getCheckerFile(checkers, paramFileArr);
            }
        }

        for (const check of checkerMoneyFile) {
            if (paramAction && paramAction.flowId && paramAction.flowId === check) {
                const checkers = JSON.parse(paramAction.checkers);
                this.getMoneyCheckerFile(checkers, paramFileArr);
            }
        }
        // 合同文件
        if (paramAction && paramAction.contracts) {
            for (const contract of paramAction.contracts) {
                paramFileArr.push(contract);
            }
        }
        // 去除重复的文件
        paramFileArr = XnUtils.uniqueBoth(paramFileArr);
        return paramFileArr;
    }
    private async rexDownload(params, manflowId) {
        let files: any = [];
        const procedureIdArr = [];
        if (this.xn.user.orgType === 1) {
            let logsData: any[];
            if (params.logs.length) {
                logsData = params.logs
                    .filter(x => !!x.appId && x.appId === this.supplierOperateAppId.appId);
            }
            for (const action of logsData) {
                if (action.flowId !== '') {
                    // 找出所有的流程ID
                    if (procedureIdArr.indexOf(action.flowId) === -1) {
                        procedureIdArr.push(action.flowId);
                    }
                }
            }

            for (const proceId of procedureIdArr) {
                const arr: any = [];
                for (const action of logsData) {
                    if (action.flowId === proceId) {
                        // 构建一个数组，选出最后一个流程id
                        arr.push(action);
                    }
                }
                files = this.selectFiles(arr[arr.length - 1], files, params);
            }
        } else {
            for (const action of params.logs) {
                if (action.flowId !== '') {
                    // 找出所有的流程ID
                    if (procedureIdArr.indexOf(action.flowId) === -1) {
                        procedureIdArr.push(action.flowId);
                    }
                }
            }
            for (const proceId of procedureIdArr) {
                const arr: any = [];
                for (const action of params.logs) {
                    if (action.flowId === proceId) {
                        // 构建一个数组，选出最后一个流程id
                        arr.push(action);
                    }
                }
                // 这里是因为保理商收款可能有多个，所以不是取最后一个，而是全部都要
                for (const row of arr) {
                    if (row.flowId === 'factoring_repayment') {
                        files = this.selectFiles(row, files, params);
                    } else {
                        files = this.selectFiles(arr[arr.length - 1], files, params);
                    }
                }
            }
        }
        if (files.length) {
            // 拼接文件名
            const appId = this.xn.user.appId;
            const orgName = this.xn.user.orgName;
            const time = new Date().getTime();
            // let filename = appId + '-' + orgName + '-' + time + '.zip';
            const filename = params.enterpriseOrgName + '-' + manflowId + '.zip';

            XnUtils.checkLoading(this);
            this.xn.api.download('/file/down_file', {
                files,
                mainFlowId: manflowId
            }).subscribe((v: any) => {
                this.loading.close();
                this.xn.api.save(v._body, filename);
            });
        } else {
            this.xn.msgBox.open(false, '无可下载项');
        }

    }

    public download(params, manflowId) {
        let files: any = [];
        const procedureIdArr = [];
        if (this.xn.user.orgType === 1) {
            let logsData: any[];
            if (params.logs.length) {
                logsData = params.logs
                    .filter(x => !!x.appId && x.appId === this.supplierOperateAppId.appId);
            }
            for (const action of logsData) {
                if (action.flowId !== '') {
                    // 找出所有的流程ID
                    if (procedureIdArr.indexOf(action.flowId) === -1) {
                        procedureIdArr.push(action.flowId);
                    }
                }
            }

            for (const proceId of procedureIdArr) {
                const arr: any = [];
                for (const action of logsData) {
                    if (action.flowId === proceId) {
                        // 构建一个数组，选出最后一个流程id
                        arr.push(action);
                    }
                }
                files = this.selectFiles(arr[arr.length - 1], files, params);
            }
        } else {
            for (const action of params.logs) {
                if (action.flowId !== '') {
                    // 找出所有的流程ID
                    if (procedureIdArr.indexOf(action.flowId) === -1) {
                        procedureIdArr.push(action.flowId);
                    }
                }
            }
            for (const proceId of procedureIdArr) {
                const arr: any = [];
                for (const action of params.logs) {
                    if (action.flowId === proceId) {
                        // 构建一个数组，选出最后一个流程id
                        arr.push(action);
                    }
                }
                // 这里是因为保理商收款可能有多个，所以不是取最后一个，而是全部都要
                for (const row of arr) {
                    if (row.flowId === 'factoring_repayment') {
                        files = this.selectFiles(row, files, params);
                    } else {
                        files = this.selectFiles(arr[arr.length - 1], files, params);
                    }
                }
            }
        }
        if (files.length) {
            // 拼接文件名
            const appId = this.xn.user.appId;
            const orgName = this.xn.user.orgName;
            const time = new Date().getTime();
            // let filename = appId + '-' + orgName + '-' + time + '.zip';
            const filename = params.enterpriseOrgName + '-' + manflowId + '.zip';

            XnUtils.checkLoading(this);
            this.xn.api.download('/file/down_file', {
                files,
                mainFlowId: manflowId
            }).subscribe((v: any) => {
                this.loading.close();
                this.xn.api.save(v._body, filename);
            });
        } else {
            this.xn.msgBox.open(false, '无可下载项');
        }

    }

    /**
     *  获取checker项中上传的文件
     * @param checkers 配置编辑页面的checkers
     * @param fileArr  所有文件属性名
     */
    private getCheckerFile(checkers, fileArr): Array<any> {
        // 合同文件
        const contractArr = ['contractFile', 'contractInfo'];
        // 图片，pdf ,excel等格式文件
        const fileArrays = [
            'dockFile',
            'honourFile',
            'invoiceFile',
            'honourInfo',
            'invoiceInfo',
            'checkFile',
            'goodsFile',
            'constitutionFile',
            'certificateFile',
            'supervisorFile',
            'otherFile',
            'performanceFile', // 履约证明
            'proofFile',
            'ZDWFile',
            'qrs',  // 确认书
            'pz',   // 凭证
            'qrsReal',  // 实际确认书
            'paymentFile',  // 付款文件
            'receivableFile', // 应收账款文件
            'cotherFile',
            'supplyInvoice', // 补充发票文件
            'businessLicenseFile', // 营业执照
            'businessLicense',
            'projectLicense', // 项目公司执照
            'projectAuthority',
            'payFile'
        ];
        const process = ['begin', 'operate'];
        for (const contract of contractArr) {
            for (const proce of process) {
                if (checkers && checkers[proce] && checkers[proce][contract]) {
                    for (const row of JSON.parse(checkers[proce][contract])) {
                        // row.files 可能是{}，[{}]
                        if (row.files instanceof Array) {
                            for (const file of row.files) {
                                file.fileTitle = contract;
                                fileArr.push(file);
                            }
                        } else {
                            for (const file of row.files.img) {
                                file.fileTitle = contract;
                                fileArr.push(file);
                            }
                        }
                    }
                }
            }
        }

        // 遍历图片
        for (const infile of fileArrays) {
            for (const proce of process) {
                if (checkers && checkers[proce] && checkers[proce][infile]) {
                    const tf = JSON.parse(checkers[proce][infile]);
                    if (Array.isArray(tf)) {
                        for (const file of JSON.parse(checkers[proce][infile])) {
                            if (file && file.fileId) {
                                file.fileTitle = infile;
                                fileArr.push(file);
                            }
                            if (file && file.files) {
                                for (const i of file.files.img) {
                                    i.fileTitle = infile;
                                    fileArr.push(i);
                                }
                            }
                        }
                    } else {
                        if (tf.fileId) {
                            tf.fileTitle = infile;
                            fileArr.push(tf);
                        }
                    }

                }
            }
        }
        return fileArr;
    }
    /**
    * 放款和回款单独处理
    * @param paramCheckers
    * @param fileArr
    */
    private getMoneyCheckerFile(paramCheckers, fileArr) {
        const process = ['begin', 'operate'];
        for (const proce of process) {
            if (paramCheckers && paramCheckers[proce] && paramCheckers[proce].pic) {
                for (const file of JSON.parse(paramCheckers[proce].pic)) {
                    file.fileTitle = proce;
                    fileArr.push(file);
                }
            }
        }
        return fileArr;

    }
}
