import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { XnService } from 'libs/shared/src/lib/services/xn.service';
import { ActivatedRoute } from '@angular/router';
import { HwModeService } from 'libs/shared/src/lib/services/hw-mode.service';
import { LocalStorageService } from 'libs/shared/src/lib/services/local-storage.service';
import { TabConfigModel, TabListOutputModel, SubTabListOutputModel, ButtonConfigModel } from 'libs/shared/src/lib/config/list-config-model';
import CommUtils from 'libs/shared/src/lib/public/component/comm-utils';
import { XnUtils } from 'libs/shared/src/lib/common/xn-utils';
import { XnModalUtils } from 'libs/shared/src/lib/common/xn-modal-utils';
import { MfilesViewModalComponent } from '../../share/modal/mfiles-view-modal.component';
import { JsonTransForm } from 'libs/shared/src/lib/public/pipe/xn-json.pipe';
import { XnFormUtils } from 'libs/shared/src/lib/common/xn-form-utils';
import { CheckersOutputModel } from 'libs/shared/src/lib/config/checkers';
import CommBase from 'libs/shared/src/lib/public/component/comm-base';
import { XnProductTypeOptions } from 'libs/shared/src/lib/config/options';

@Component({
    selector: 'xn-zhongdeng-list-component',
    templateUrl: `./zhongdeng-list.component.html`,
    styles: [`
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
    `]
})
export class ZhongdengListComponent implements OnInit {
    private arrObjs = {} as any; // ?????????????????????
    private paging = 0; // ???????????????
    private beginTime: any;
    private endTime: any;
    private timeId = [];
    private nowTimeCheckId = '';
    private preChangeTime: any[] = []; // ?????????????????????,???????????????????????????????????????
    private sorting = ''; // ??????????????? ?????????
    private naming = ''; // ??????????????? ???css??????
    // private subTabEnum = SubTabEnum; // ???????????????????????????
    private searches: CheckersOutputModel[] = []; // ???????????????????????????
    public tabConfig: TabConfigModel = new TabConfigModel(); // ??????????????????
    public currentTab: TabListOutputModel = new TabListOutputModel(); // ???????????????
    public currentSubTab: SubTabListOutputModel = new SubTabListOutputModel(); // ??????????????????
    public defaultValue = 'A';  // ??????????????????????????????
    public subDefaultValue = 'DOING'; // ??????????????????
    public listInfo: any[] = []; // ??????
    public pageConfig = { pageSize: 10, first: 0, total: 0 }; // ????????????
    public shows: CheckersOutputModel[] = []; // ?????????
    public searchForm: FormGroup; // ???????????????
    public selectedItems: any[] = []; // ????????????
    base: CommBase;
    loanDate: string;
    approvalMemo: string;
    valueDate: string;
    is_jindie = -1;
    businessinvoice = false;
    heads: any[];
    public formModule = 'dragon-input';
    public headquarters = '';
    public recordId = '';
    public hasFile = [];

    public params = {
        mainFlowId: '',
    };

    get productType(){
      return XnProductTypeOptions
    }
    constructor(private xn: XnService,
        private vcr: ViewContainerRef,
        private router: ActivatedRoute,
        public hwModeService: HwModeService,
        public localStorageService: LocalStorageService) {
    }

    ngOnInit(): void {
        this.router.data.subscribe((res: TabConfigModel) => {
            this.tabConfig = res;
            this.onPage({ page: this.paging });
        });
    }

    /**
     * @param e  page: ???????????? pageSize: ?????????????????????first: ??????????????????????????????pageCount : ????????????
     * @summary ?????????????????????abs  ??????api???????????????????????????avenger ?????????abs???api
     */
    public onPage(e?: { page: number, first?: number, pageSize?: number, pageCount?: number }, types?: number) {
        this.paging = e.page || 1;
        this.onUrlData(); // ??????????????????
        this.pageConfig = Object.assign({}, this.pageConfig, e);
        // ????????????
        const find = this.tabConfig.tabList.find(tab => tab.value === this.defaultValue);
        this.currentTab = !!find ? find : new TabListOutputModel();
        // ???????????????
        const subFind = this.currentTab.subTabList.find(sub => sub.value === this.subDefaultValue);
        this.currentSubTab = !!subFind ? subFind : new SubTabListOutputModel();
        this.heads = CommUtils.getListFields(this.currentSubTab.headText);
        this.searches = this.currentSubTab.searches; // ???????????????????????????
        this.buildShow(this.searches);
        // ????????????
        const params = this.buildParams(this.currentTab.params);
        if (this.currentTab.post_url === '') {
            // ?????????
            this.listInfo = [];
            this.pageConfig.total = 0;
            return;
        }
        this.xn.loading.open();
        this.xn.dragon.post('/zhongdeng/zd/list', params).subscribe(x => {
            if (x.data && x.data.list && x.data.list.length) {
                this.listInfo = x.data.list;
                for (let i = 0; i < this.listInfo.length; i++) {
                    this.hasFile[i] = false;
                }
                this.pageConfig.total = x.data.count;
                for (let i = 0; i < this.listInfo.length; i++) {
                    const item = this.listInfo[i];
                    if (!!item.assetFile) {
                        for (const file of item.assetFileList) {
                            if (file.assetFile.length !== 0) {
                                this.hasFile[i] = true;
                            }
                        }
                    }

                }
            } else {
                this.listInfo = [];
                this.pageConfig.total = 0;
            }
        }, () => {
            // ?????????
            this.listInfo = [];
            this.pageConfig.total = 0;
        }, () => {
            this.xn.loading.close();
        });
    }

    /**
     *  ??????,?????????????????????
     */
    public searchMsg() {
        this.selectedItems = [];
        this.paging = 1;
        this.onPage({ page: this.paging, first: 0 });
    }

    /**
     * ??????
     */
    public reset() {
        this.selectedItems = [];
        // this.searchForm.reset(); // ??????
        for (const key in this.arrObjs) {
            if (this.arrObjs.hasOwnProperty(key)) {
                delete this.arrObjs[key];
            }
        }
        this.buildCondition(this.searches);
        this.searchMsg(); // ???????????????????????????search
    }

    /**
     *  ???????????????
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
     *  ??????????????????
     * @param sort
     */
    public onSort(sort: string) {
        if (this.sorting === sort) {
            this.naming = this.naming === 'desc' ? 'asc' : 'desc';
        } else {
            this.sorting = sort;
            this.naming = 'asc';
        }
        this.onPage({ page: this.paging });
    }

    /**
     *  ?????????????????????????????????
     */
    public isAllChecked(): boolean {
        return !(this.listInfo.some(x => !x.checked || x.checked && x.checked === false) || this.listInfo.length === 0);
    }

    /**
     *  ??????
     */
    public checkAll() {
        if (!this.isAllChecked()) {
            this.listInfo.forEach(item => item.checked = true);
            this.selectedItems = XnUtils.distinctArray2([...this.selectedItems, ...this.listInfo], 'mainFlowId');
        } else {
            this.listInfo.forEach(item => item.checked = false);
            this.selectedItems = [];
        }
    }

    /**
     * ??????
     * @param paramItem
     * @param index
     */
    public singleChecked(paramItem, index) {
        if (paramItem.checked && paramItem.checked === true) {
            paramItem.checked = false;
            this.selectedItems = this.selectedItems.filter((x: any) => x.mainFlowId !== paramItem.mainFlowId);
        } else {
            paramItem.checked = true;
            this.selectedItems.push(paramItem);
            this.selectedItems = XnUtils.distinctArray2(this.selectedItems, 'mainFlowId'); // ??????????????????
        }

    }

    public viewProcess(registerId, status) {
        this.xn.dragon.post('/zhongdeng/zd/is_zd_operate_cache', { registerId: registerId }).subscribe(x => {
            if (x.ret === 0) {
                if (x.data.isCache) {
                    this.xn.msgBox.open(false, `??????????????????${registerId}????????????`)
                } else {
                    this.xn.router.navigate([`/machine-account/zhongdeng/record/${registerId}/${status}`]);
                }

            }
        })
    }

    /**
     *  ??????????????????
     * @param paramFile
     */
    public viewFiles(paramFile, type) {
        let param = [];
        if (type === 'assetFileList') {
            for (let i = 0; i < paramFile.length; i++) {
                const file = JSON.parse(paramFile[i].assetFile);
                const files = file[0];
                param.push(files);
            }
        }
        if (type === 'registerFile' || type === 'zhongdengAttachment') {
            param = JSON.parse(paramFile);
        }
        XnModalUtils.openInViewContainer(this.xn, this.vcr, MfilesViewModalComponent, param).subscribe();
    }

    /**
     *  ??????????????????
     * @param paramValue
     */
    public judgeDataType(paramValue: any): boolean {
        if (typeof Array.isArray === 'function') {
            return Array.isArray(paramValue);
        } else {
            return Object.prototype.toString.call(paramValue) === '[object Array]';
        }
    }

    /**
     *  ???????????????
     * @param paramData
     */
    public jsonTransForm(paramData) {
        return JsonTransForm(paramData);
    }

    /**
     *  ?????????????????????????????????????????????
     * @param paramFileInfos
     */
    public arrayLength(paramFileInfos: any) {
        if (!paramFileInfos) {
            return false;
        }
        const obj =
            typeof paramFileInfos === 'string'
                ? JSON.parse(paramFileInfos)
                : JSON.parse(JSON.stringify(paramFileInfos));
        return !!obj && obj.length > 2;
    }

    /**
     * ??????????????????
     * @param paramItem ???????????????
     * @param paramBtnOperate ??????????????????
     * @param i ??????
     */
    public handleRowClick(paramItem, paramBtnOperate: ButtonConfigModel, i: number) {
        if (paramBtnOperate.operate === 'view') {
            this.viewProcess(paramItem.registerId, paramItem.status);
        } else {
            paramBtnOperate.click(this.base, paramItem, this.xn, this.hwModeService);
        }
    }

    /**
     * ???????????????
     * @param searches
     */
    private buildShow(searches) {
        this.shows = [];
        this.onUrlData();
        this.buildCondition(searches);
    }

    /**
     * ?????????????????????
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
            obj.sortOrder = searches[i].sortOrder;
            obj.options = searches[i].options;
            if (searches[i].checkerId === this.timeId[0]) {
                obj.value = JSON.stringify(tmpTime);
            } else {
                obj.value = this.arrObjs[searches[i].checkerId];
            }
            objList.push(obj);
        }
        this.shows = $.extend(true, [], objList.sort(function (a, b) {
            return a.sortOrder - b.sortOrder;
        })); // ?????????????????????;
        XnFormUtils.buildSelectOptions(this.shows);
        this.buildChecker(this.shows);
        this.searchForm = XnFormUtils.buildFormGroup(this.shows);
        const time = this.searches.filter(v => v.type === 'quantum');
        const timeCheckId = time[0] && time[0].checkerId;
        this.nowTimeCheckId = timeCheckId;
        this.searchForm.valueChanges.subscribe((v) => {
            // ?????????
            const changeId = v[timeCheckId];
            delete v[timeCheckId];
            if (changeId !== '' && this.nowTimeCheckId) {
                const paramsTime = JSON.parse(changeId);
                const beginTime = parseInt(paramsTime.beginTime);
                const endTime = parseInt(paramsTime.endTime);
                // ???????????????????????????
                this.preChangeTime.unshift({ begin: beginTime, end: endTime });
                // ??????????????????
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
                    const searchFilter = this.searches.filter(v1 => v1 && v1.base === 'number')
                        .map(c => c.checkerId);
                    if (searchFilter.indexOf(item) >= 0) {
                        arrObj[item] = Number(v[item]);
                    } else {
                        arrObj[item] = v[item];
                    }
                }
            }
            this.arrObjs = $.extend(true, {}, arrObj); // ?????????;????????????????????????
            this.onUrlData();
        });
    }

    /**
     * ????????????????????????
     */
    private buildParams(addparams: number) {
        let params = null;
        params = {
            start: (this.paging - 1) * this.pageConfig.pageSize,
            length: this.pageConfig.pageSize,
            headquarters: this.headquarters,
            recordId: this.recordId,
            startTime: this.beginTime,
            endTime: this.endTime,
        };
        // ????????????

        // ????????????
        if (this.sorting && this.naming) {
            params.order = [this.sorting + ' ' + this.naming];
        }
        // ????????????
        if (this.searches.length > 0) {
            for (const search of this.searches) {
                if (!XnUtils.isEmpty(this.arrObjs[search.checkerId])) {
                    if (search.checkerId === 'createTime') {
                        const date = JSON.parse(this.arrObjs[search.checkerId]);
                        params.startTime = date.beginTime;
                        params.endTime = date.endTime;
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
     * ???????????????????????????
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
            this.defaultValue = urlData.data.defaultValue || this.defaultValue;
            this.subDefaultValue = urlData.data.subDefaultValue || this.subDefaultValue;
        } else {
            this.xn.user.setUrlData(this.xn.router.url, {
                paging: this.paging,
                pageConfig: this.pageConfig,
                beginTime: this.beginTime,
                endTime: this.endTime,
                arrObjs: this.arrObjs,
                defaultValue: this.defaultValue,
                subDefaultValue: this.subDefaultValue
            });
        }
    }

    onBtnClick(btn, row): void {
        btn.click(this.base, row, this.xn, this.vcr);
    }
}
