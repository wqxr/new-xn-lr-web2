import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import CommBase from 'libs/shared/src/lib/public/component/comm-base';
import { SelectOptions, HeadquartersTypeEnum } from 'libs/shared/src/lib/config/select-options';
import { XnService } from 'libs/shared/src/lib/services/xn.service';
import { HwModeService } from 'libs/shared/src/lib/services/hw-mode.service';
import { LocalStorageService } from 'libs/shared/src/lib/services/local-storage.service';
import { EnterpriseMenuEnum, BusinessMode } from 'libs/shared/src/lib/common/enums';
import { JsonTransForm } from 'libs/shared/src/lib/public/pipe/xn-json.pipe';
import { XnModalUtils } from 'libs/shared/src/lib/common/xn-modal-utils';
import { FileViewModalComponent } from 'libs/shared/src/lib/public/modal/file-view-modal.component';
import { XnUtils } from 'libs/shared/src/lib/common/xn-utils';
import { PdfSignModalComponent } from 'libs/shared/src/lib/public/modal/pdf-sign-modal.component';
import { XnFormUtils } from 'libs/shared/src/lib/common/xn-form-utils';
import { ButtonConfigModel } from 'libs/shared/src/lib/config/list-config-model';
import { MachineInvoiceListComponent } from 'libs/shared/src/lib/public/dragon-vanke/modal/machine-invoice-list-modal.component';
import { SingleSearchListModalComponent } from 'libs/shared/src/lib/public/dragon-vanke/modal/single-searchList-modal.component';

@Component({
    selector: 'app-comfirm-information-index-component',
    templateUrl: `./transactions-list.component.html`,
    styles: [
        `
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

            .table-head .sorting,
            .table-head .sorting_asc,
            .table-head .sorting_desc {
                /*position: relative;*/
                cursor: pointer;
            }

            .table-head .sorting:after,
            .table-head .sorting_asc:after,
            .table-head .sorting_desc:after {
                font-family: "Glyphicons Halflings";
                opacity: 0.5;
            }

            .table-head .sorting:after {
                content: "\\e150";
                opacity: 0.2;
            }

            .table-head .sorting_asc:after {
                content: "\\e155";
            }

            .table-head .sorting_desc:after {
                content: "\\e156";
            }
            .center-block {
                clear: both;
                border-bottom: 1px solid #ccc;
                width: 43.9%;
                height: 1px;
            }
            .showClass {
                width: 12.5%;
                margin: 0 auto;
                border: 1px solid #ccc;
                text-align: center;
                border-top: 0px;
                clear: both;
                border-bottom-left-radius: 10px;
                border-bottom-right-radius: 10px;
            }
        `,
    ],
})
export class TransactionsListComponent implements OnInit {
    tabConfig: any;
    // ?????????????????????????????? {do_not,do_down}
    label = 'do_not';
    // ??????
    data: any[] = [];
    // ????????????
    pageConfig = {
        pageSize: 10,
        first: 0,
        total: 0,
    };
    // ?????????
    shows: any[] = [];
    form: FormGroup;
    searches: any[] = []; // ????????????????????????
    selectedItems: any[] = []; // ????????????
    currentTab: any; // ???????????????

    arrObjs = {} as any; // ?????????????????????
    paging = 0; // ???????????????
    beginTime: any;
    endTime: any;
    timeId = [];
    nowTimeCheckId = '';
    // ?????????????????????
    preChangeTime: any[] = [];
    public formModule = 'new-agile-input';
    sorting = ''; // ???????????????
    naming = ''; // ???????????????
    base: CommBase;
    public yjlSelectItems: any[] = [];
    public notYjlSelectItems: any[] = [];
    newAgileListType = SelectOptions.get('newAgileListType');
    constructor(
        public xn: XnService,
        private vcr: ViewContainerRef,
        public hwModeService: HwModeService,
        private router: ActivatedRoute,
        private localStorageService: LocalStorageService
    ) {}

    ngOnInit(): void {
        this.router.data.subscribe((x) => {
            this.tabConfig = x;
            this.initData(this.label);
        });
    }

    get isPlatformOrFactoring() {
        return [EnterpriseMenuEnum.PLATFORM, EnterpriseMenuEnum.FACTORING].includes(this.xn.user.orgType);
    }

    /**
     *  ??????????????????
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
     *  ???????????????
     * @param data
     */
    public jsonTransForm(data) {
        return JsonTransForm(data);
    }
    /**
     *  ??????????????????
     * @param paramFile
     */
    public viewFiles(paramFile) {
        XnModalUtils.openInViewContainer(
            this.xn,
            this.vcr,
            FileViewModalComponent,
            paramFile
        ).subscribe();
    }
    /**
     *  ????????????
     * @param val
     */
    public initData(val: string) {
        if (this.label !== val) {
            this.selectedItems = []; // ????????????????????????????????????
            this.naming = '';
            this.sorting = '';
        }
        this.label = val;
        this.onPage({ page: this.paging });
    }

    /**
     * @param e  event.page: ????????? <br> event.pageSize: ??????????????????<br>event.first: ???????????????????????????<br>event.pageCount : ????????????
     * @param type ?????????
     */
    public onPage(e?) {
        this.paging = e.page || 1;
        this.onUrlData(); // ??????????????????
        this.pageConfig = Object.assign({}, this.pageConfig, e);
        // ????????????
        this.currentTab = this.tabConfig.tabList.find(
            (x) => x.value === this.label
        ); // ???????????????
        this.searches = this.currentTab.searches; // ???????????????????????????
        this.buildShow(this.searches);
        // ????????????
        const params = this.buildParams();
        if (this.currentTab.get_url === '') {
            // ?????????
            this.data = [];
            this.pageConfig.total = 0;
            return;
        }
        this.xn.loading.open();
        this.xn.api.post(this.currentTab.get_url, params).subscribe(
            (x) => {
                if (x.data && x.data.data && x.data.data.length) {
                    this.data = x.data.data;
                    this.pageConfig.total = x.data.recordsTotal;
                    if (this.data[0].receive) {
                        this.data.forEach(
                            (item) => (item.receive = item.receive.toFixed(2))
                        );
                    }

                } else {
                    // ?????????
                    this.data = [];
                    this.pageConfig.total = 0;
                }
            },
            () => {
                // ?????????
                this.data = [];
                this.pageConfig.total = 0;
            },
            () => {
                this.xn.loading.close();
            }
        );
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
        // this.form.reset(); // ??????
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
        this.onPage({ page: 1 });
    }

    /**
     *  ?????????????????????????????????
     */
    public isAllChecked(): boolean {
        return !(
            this.data.some(
                (x) => !x.checked || (x.checked && x.checked === false)
            ) || this.data.length === 0
        );
    }

    /**
     *  ??????
     * @param e
     */
    public checkAll() {
        if (!this.isAllChecked()) {
            this.data.forEach((item) => (item.checked = true));
            this.selectedItems = XnUtils.distinctArray2(
                [...this.selectedItems, ...this.data],
                'mainFlowId'
            );
        } else {
            this.data.forEach((item) => (item.checked = false));
            this.selectedItems = [];
        }
    }

    /**
     * ??????
     * @param e
     * @param item
     * @param index
     */
    public singelChecked(item) {
        if (item.checked && item.checked === true) {
            item.checked = false;
            this.selectedItems = this.selectedItems.filter(
                (x) => x.mainFlowId !== item.mainFlowId
            );
        } else {
            item.checked = true;
            this.selectedItems.push(item);
            this.selectedItems = XnUtils.distinctArray2(
                this.selectedItems,
                'mainFlowId'
            ); // ??????????????????
        }
    }

    /**
     *  ?????????????????????
     * @param con
     */
    public showContract(con) {
        const params = Object.assign({}, con, { readonly: true });
        XnModalUtils.openInViewContainer(
            this.xn,
            this.vcr,
            PdfSignModalComponent,
            params
        ).subscribe(() => {});
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
            endTime: this.endTime,
        };
        const objList = [];
        this.timeId = $.extend(
            true,
            [],
            this.searches
                .filter((v) => v.type === 'quantum')
                .map((v) => v.checkerId)
        );
        for (let i = 0; i < searches.length; i++) {
            const obj = {} as any;
            obj.title = searches[i].title;
            obj.checkerId = searches[i].checkerId;
            obj.required = false;
            obj.type = searches[i].type;
            obj.number = searches[i].number;
            obj.options = searches[i].options;
            if (searches[i].checkerId === this.timeId[0]) {
                obj.value = JSON.stringify(tmpTime);
            } else {
                obj.value = this.arrObjs[searches[i].checkerId];
            }
            objList.push(obj);
        }
        this.shows = $.extend(
            true,
            [],
            objList.sort(function(a, b) {
                return a.number - b.number;
            })
        ); // ?????????????????????;
        XnFormUtils.buildSelectOptions(this.shows);
        this.buildChecker(this.shows);
        this.form = XnFormUtils.buildFormGroup(this.shows);
        const time = this.searches.filter((v) => v.type === 'quantum');
        const timeCheckId = time[0] && time[0].checkerId;
        this.nowTimeCheckId = timeCheckId;
        this.form.valueChanges.subscribe((v) => {
            // ?????????
            const changeId = v[timeCheckId];
            delete v[timeCheckId];
            if (changeId !== '' && this.nowTimeCheckId) {
                const paramsTime = JSON.parse(changeId);
                const beginTime = paramsTime.beginTime;
                const endTime = paramsTime.endTime;
                // ???????????????????????????
                this.preChangeTime.unshift({ begin: beginTime, end: endTime });
                // ??????????????????
                this.beginTime = beginTime;
                this.endTime = endTime;
                if (this.preChangeTime.length > 1) {
                    if (
                        this.preChangeTime[1].begin === this.beginTime &&
                        this.preChangeTime[1].end === this.endTime
                    ) {
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
                    const searchFilter = this.searches
                        .filter((v1) => v1 && v1.base === 'number')
                        .map((c) => c.checkerId);
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
     * ????????????
     */
    private buildParams() {
        // ????????????
        let params = null;
        params = {
            start: (this.paging - 1) * this.pageConfig.pageSize,
            length: this.pageConfig.pageSize,
            beginTime: this.beginTime,
            endTime: this.endTime,
            modelId: BusinessMode.Yjl,
        };
        // ????????????
        if (this.sorting && this.naming) {
            params.order = [this.sorting + ' ' + this.naming];
        }
        // ????????????
        if (this.searches.length > 0) {
            for (const search of this.searches) {
                if (!XnUtils.isEmpty(this.arrObjs[search.checkerId])) {
                    // if (search.checkerId === 'status') {
                        // let obj = JSON.parse(this.arrObjs[search.checkerId]);
                        // if (obj.isProxy !== 14 && obj.isProxy !== 18) {
                        //     params['isProxy'] = obj.isProxy;
                        //     console.info('obj==>', obj);
                        //     if (Number(obj.tradeStatus) === 99) {
                        //         params['retreatStatus'] = 0;
                        //         params['status'] = Number(obj.tradeStatus);
                        //     } else if (Number(obj.tradeStatus) === 100) {
                        //         params['status'] = 99;
                        //         params['retreatStatus'] = 4;
                        //     } else {
                        //         params['flowId'] = obj.tradeStatus;
                        //     }
                        // } else {
                        //     params['isProxy'] = obj.isProxy;
                        //     params['status'] = Number(obj.tradeStatus);
                        // }

                        // params = Object.assign(params, obj);
                    // }
                    if (search.checkerId === 'createTime') {
                        const date = JSON.parse(this.arrObjs[search.checkerId]);
                        params.beginTime = date.beginTime;
                        params.endTime = date.endTime;
                    } else {
                        params[search.checkerId] = this.arrObjs[
                            search.checkerId
                        ];
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
     * ????????????
     * @param data
     */
    private onUrlData() {
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
                label: this.label,
            });
        }
    }

    /**
     * ????????? ???????????????????????????
     */
    public supplementTransInfo() {
        if (this.selectedItems.length < 1) {
            this.xn.msgBox.open(false, '???????????????');
            return false;
        }
        this.yjlSelectItems = this.selectedItems.filter(
            (x) =>
                String(x.isProxy) === '18' &&
                x.headquarters === HeadquartersTypeEnum[4]
        ); // ???????????????
        this.notYjlSelectItems = this.selectedItems.filter(
            (x) =>
                String(x.isProxy) !== '18' ||
                x.headquarters !== HeadquartersTypeEnum[4]
        ); // ??????????????????
        if (this.yjlSelectItems.length > 0) {
            if (
                this.yjlSelectItems.some(
                    (x) =>
                        !x.factoringEndDate ||
                        x.factoringEndDate === '' ||
                        !x.discountRate ||
                        x.discountRate === ''
                )
            ) {
                const staySupplementSelected = this.yjlSelectItems.map(item => ({
                    ...item,
                    projectCompany: item.enterpriseOrgName,
                    debtUnit: item.supplierOrgName,
                }));
                this.localStorageService.setCacheValue(
                    'staySupplementSelected',
                    staySupplementSelected
                );
                this.xn.router.navigate([
                    'console/standard_factoring/trans_lists/supplement_info',
                ]);
            } else {
                this.xn.msgBox.open(false, `??????????????????`, () => {
                    // ??????????????????
                    this.data.forEach((item) => (item.checked = false));
                    this.selectedItems = [];
                });
            }
        } else {
            this.xn.msgBox.open(
                false,
                [
                    '???????????????????????????' +
                        this.notYjlSelectItems.length +
                        '?????????????????????',
                    ...this.notYjlSelectItems.map((o) => o.mainFlowId),
                    '????????????"????????????"??????',
                ],
                () => {
                    // ??????????????????
                    this.data.forEach((item) => (item.checked = false));
                    this.selectedItems = [];
                }
            );
        }
    }

    /**
     * ??????????????????
     * @param item ???????????????
     * @param btn {label:string,operate:string,value:string,value2?:string}
     * @param i ??????
     */
    public handleRowClick(item, paramBtnOperate: ButtonConfigModel) {
        // let mainFlowId = this.selectedItems.find((x: any) => x.mainFlowId);
        paramBtnOperate.click(this.base, item, this.xn, this.hwModeService);
    }

    // ??????????????????
    handleRowInvoiceClick(item) {
        if (item.isProxy === 50 || item.isProxy === 52 || item.isProxy === 53) {
            XnModalUtils.openInViewContainer(
                this.xn,
                this.vcr,
                MachineInvoiceListComponent,
                { mainFlowId: item.mainFlowId }
            ).subscribe(() => {});
        } else {
            this.xn.api
                .post('/llz/risk_warning/invoice_management/invoice_all', {
                    mainFlowId: item.mainFlowId,
                })
                .subscribe((x) => {
                    // ????????????
                    const params = {
                        get_url: '',
                        get_type: '',
                        multiple: false,
                        title: '????????????',
                        heads: [
                            {
                                label: '????????????',
                                value: 'invoiceCode',
                                type: 'text',
                            },
                            {
                                label: '????????????',
                                value: 'invoiceNum',
                                type: 'text',
                            },
                            {
                                label: '??????????????????',
                                value: 'invoiceAmount',
                                type: 'money',
                            },
                            {
                                label: '??????????????????',
                                value: 'transferMoney',
                                type: 'money',
                            },
                            // { label: '????????????', value: 'invoiceFile',type: 'file' },
                        ],
                        searches: [],
                        key: 'invoiceCode',
                        data: x.data || [],
                        total: x.data.length || 0,
                        inputParam: {
                            mainFlowId: item.mainFlowId,
                        },
                        rightButtons: [{label: '??????', value: 'submit'}]
                    };
                    XnModalUtils.openInViewContainer(
                        this.xn,
                        this.vcr,
                        SingleSearchListModalComponent,
                        params
                    ).subscribe((v) => {
                        if (v === null) {
                            return;
                        }
                    });
                });
        }
    }

    viewProcess(mainFlowId) {
        this.xn.router.navigate([
            `/new-agile/main-list/detail/${mainFlowId}`
        ]);
    }
}
