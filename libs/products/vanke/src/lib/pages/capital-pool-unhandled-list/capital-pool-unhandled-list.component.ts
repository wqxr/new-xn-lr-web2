import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { map, switchMap } from 'rxjs/operators';
// import CommBase from '../../comm-base';
import { CommonPage, PageTypes } from 'libs/shared/src/lib/public/component/comm-page';
import { FormGroup } from '@angular/forms';
import { XnService } from 'libs/shared/src/lib/services/xn.service';
import { ActivatedRoute } from '@angular/router';
import CommUtils from 'libs/shared/src/lib/public/component/comm-utils';
import { XnUtils } from 'libs/shared/src/lib/common/xn-utils';
import { XnFormUtils } from 'libs/shared/src/lib/common/xn-form-utils';
import { HeadquartersTypeEnum, SelectOptions } from 'libs/shared/src/lib/config/select-options';
import * as moment from 'moment';
import { XnModalUtils } from 'libs/shared/src/lib/common/xn-modal-utils';
import { GeneratingContractModalComponent } from 'libs/shared/src/lib/public/modal/generating-contract-modal.component';
import { FinancingFactoringVankeModalComponent } from 'libs/shared/src/lib/public/modal/financing-factoring-vanke-modal.component';
import { DownloadAttachmentsmodalComponent } from 'libs/shared/src/lib/public/modal/download-attachmentsmodal.component';
import { ExportListModalComponent } from 'libs/shared/src/lib/public/modal/export-list-modal.component';
import { NewFileModalComponent } from 'libs/shared/src/lib/public/form/hw-mode/modal/new-file-modal.component';
import { PdfSignModalComponent } from 'libs/shared/src/lib/public/modal/pdf-sign-modal.component';
import { FileViewModalComponent } from 'libs/shared/src/lib/public/modal/file-view-modal.component';
import CommBase from 'libs/shared/src/lib/public/component/comm-base';
declare const $: any;
@Component({
    templateUrl: './capital-pool-unhandled-list.component.html',
    styles: [
        `
            .table {
                font-size: 13px;
            }

            .table-head .sorting,
            .table-head .sorting_asc,
            .table-head .sorting_desc {
                position: relative;
                cursor: pointer;
            }

            .table-head .sorting:after,
            .table-head .sorting_asc:after,
            .table-head .sorting_desc:after {
                position: absolute;
                bottom: 8px;
                right: 8px;
                display: block;
                font-family: 'Glyphicons Halflings';
                opacity: 0.5;
            }

            .table-head .sorting:after {
                content: '\\e150';
                opacity: 0.2;
            }

            .table-head .sorting_asc:after {
                content: '\\e155';
            }

            .table-head .sorting_desc:after {
                content: '\\e156';
            }

            .tab-heads {
                margin-bottom: 10px;
                display: flex;
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
                box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.075);
                width: 200px;
            }

            .btn {
                vertical-align: top;
            }

            .small-font {
                font-size: 12px;
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
                color: #3c8dbc;
            }

            .plege.active {
                color: #ff3000;
            }

            tbody tr:hover {
                background-color: #e6f7ff;
                transition: all 0.1s linear;
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
                width: 100%;
            }

            .fr {
                float: right;
            }

            .money-control {
                display: flex;
                line-height: 35px;
            }

            .text-right {
                text-align: right;
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
                border: 1px solid #ddd;
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
                transform: translateX(-50%);
            }

            .btn-cus {
                border: 0;
                margin: 0;
                padding: 0;
            }

            .capital-pool-check {
                position: relative;
                top: 2px;
                left: 6px;
            }

            .a-block {
                display: block;
            }
        `
    ]
})
export class CapitalPoolUnhandledListComponent extends CommonPage implements OnInit {
    total = 0;
    pageSize = 10;
    first = 0;
    rows: any[] = [];
    words = '';

    sorting = ''; // ???????????????
    naming = ''; // ???????????????
    paging = 0; // ???????????????
    beginTime: any;
    endTime: any;
    arrObjs = {} as any; // ?????????????????????

    heads: any[];
    searches: any[];
    shows: any[];
    base: CommBase;
    mainForm: FormGroup;
    timeId = [];
    tolerance = [];
    nowTimeCheckId = '';
    searchArr = [];
    start: 0;
    showBtn: false;
    title: string;
    public currentPage: any;
    // ????????????????????? exp {capitalId: "CASH_POOLING_4", type: "2"}
    public formCapitalPool: any;
    // ???????????????????????????
    public isCapitalPool: boolean;
    // ????????????????????? ???mainflowId??????
    public capitalSelecteds: any[];
    // ???????????????????????????
    public btnStatusBool = false;
    // ??????????????????
    public showSign: boolean;
    // ?????????????????????????????????????????????
    public isShowPbtn = this.xn.user.orgType === 77;
    // ???????????????????????????????????????
    public isShowTradingBtn = false;
    // ???????????????????????????
    public isWankeMode = false;
    // ?????????????????????
    public allChecked = false;
    public isProjectenter = false;
    // ???????????????????????????
    public isAgencyUser = false;
    isClearing = false;
    enterpriserSelectItems = SelectOptions.get('abs_headquarters'); // ??????????????????

    refreshDataAfterAttachComponent = () => {
        this.onPage({ page: this.paging, pageSize: this.pageSize });
    }

    constructor(
        public xn: XnService,
        public vcr: ViewContainerRef,
        public route: ActivatedRoute,
    ) {
        super(PageTypes.List);

        this.isAgencyUser = this.xn.user.orgType === 102;
    }

    ngOnInit() {
        const initPage = ((params: { queryParams: any; data: any }) => {
            const superConfig = params.data;
            this.addExtraFields(superConfig.fields);
            this.base = new CommBase(this, superConfig);
            this.heads = CommUtils.getListFields(superConfig.fields);
            this.searches = CommUtils.getSearchFields(superConfig.fields);
            this.title = this.base.superConfig.showName.replace(
                '$',
                params.queryParams.capitalPoolName ||
                this.route.snapshot.queryParams.capitalPoolName ||
                ''
            );
            this.buildShow(this.searches);
            this.pageSize =
                (superConfig.list && superConfig.list.pageSize) ||
                this.pageSize;
            // this.onPage({ page: this.paging, pageSize: this.pageSize });
        }).bind(this);

        this.route.queryParams
            .pipe(
                map(x => {
                    this.formCapitalPool = x;
                    this.isProjectenter = x.isProjectenter === undefined ? false : true;
                    this.isWankeMode =
                        this.formCapitalPool.isProxy === TradMode.WanKe;
                    this.currentPage = this.formCapitalPool.currentPage;
                    if (this.formCapitalPool.isLocking) {
                        // ?????????????????????
                        this.showSign = this.formCapitalPool.isLocking === '1';
                    }
                    // ???????????????
                    this.isCapitalPool =
                        this.formCapitalPool &&
                        (this.formCapitalPool.type === '2' ||
                            this.formCapitalPool.type === '3');
                    this.isShowTradingBtn =
                        this.formCapitalPool &&
                        this.formCapitalPool.type === '1';

                    return x;
                }),
                switchMap(
                    x => {
                        return this.route.data;
                    },
                    (outerValue, innerValue) => {
                        return { queryParams: outerValue, data: innerValue };
                    }
                )
            )
            .subscribe(initPage);
    }

    public onPage(event: { page: number; pageSize: number }): void {
        this.paging = event.page;
        this.pageSize = event.pageSize;

        const params = this.buildParams();
        this.base.onList(params);
    }


    public onSort(sort: string): void {
        // ????????????????????????????????????asc ??? desc
        if (this.sorting === sort) {
            this.naming = this.naming === 'desc' ? 'asc' : 'desc';
        } else {
            this.sorting = sort;
            this.naming = 'asc';
        }

        this.onPage({ page: this.paging, pageSize: this.pageSize });
    }

    public onSortClass(checkerId: string): string {
        if (checkerId === this.sorting) {
            return 'sorting_' + this.naming;
        } else {
            return 'sorting';
        }
    }

    public onTextClass(type) {
        return type === 'money' ? 'text-right' : '';
    }

    public onSearch(): void {
        this.onPage({ page: this.paging, pageSize: this.pageSize });
    }

    public onCssClass(status) {
        return status === 1 ? 'active' : '';
    }

    public clearSearch() {
        for (const key in this.arrObjs) {
            if (this.arrObjs.hasOwnProperty(key)) {
                delete this.arrObjs[key];
            }
        }

        this.isClearing = true;
        this.searches
        .map((c) => c.checkerId)
        .forEach((key) => {
            if (this.mainForm.controls[key]) {
                this.mainForm.controls[key].setValue(null);
            }
        });

        this.beginTime = moment().subtract(365, 'days').valueOf(); // ?????????????????????????????????
        this.endTime = moment().valueOf();

        this.buildCondition(this.searches);
        this.isClearing = false;
        // ?????? ???????????? ???
        this.mainForm.controls.createTime.setValue(null);
        this.mainForm.controls.payTime.setValue(null);

        this.onSearch(); // ???????????????????????????search
        this.paging = 1; // ???????????????
    }

    // ????????????????????????
    public inputChange(val: any, index: number) {
        if (val.checked && val.checked === true) {
            val.checked = false;
        } else {
            val.checked = true;
        }
        this.capitalSelecteds = this.rows
            .filter(item => item.checked && item.checked === true)
            .map((x: any) => x.mainFlowId);
        this.btnStatusBool =
            this.capitalSelecteds && this.capitalSelecteds.length > 0;
        // ?????????????????????clicked ??????false????????????????????????????????????
        this.allChecked = !this.rows.find(
            (x: any) => x.checked === undefined || x.checked === false
        );
    }

    // ??????-?????????
    public handleCapital() {
        if (this.rows && this.rows.length) {
            if (this.capitalSelecteds && this.capitalSelecteds.length) {
                const params = {
                    mainFlowIds: this.capitalSelecteds,
                    capitalPoolId: this.formCapitalPool.capitalId
                };
                // ????????????
                if (this.formCapitalPool.type === '2') {
                    // ????????????
                    this.addOrRemoveCapitalPool(
                        '/ljx/capital_pool/add_main_flows',
                        params
                    );
                } else if (this.formCapitalPool.type === '3') {
                    // ????????????
                    this.addOrRemoveCapitalPool(
                        '/ljx/capital_pool/remove_main_flows ',
                        params
                    );
                }
            }
        }
    }


    /**
     * ?????????????????????
     */
    public handleAllSelect() {
        this.allChecked = !this.allChecked;
        if (this.allChecked) {
            this.rows.map(item => (item.checked = true));
        } else {
            this.rows.map(item => (item.checked = false));
        }
        this.capitalSelecteds = this.rows
            .filter(
                item =>
                    item.checked &&
                    item.checked === true &&
                    item.capitalPoolContract === ''
            )
            .map((x: any) => x.mainFlowId);
        this.btnStatusBool =
            this.capitalSelecteds && this.capitalSelecteds.length > 0;
    }

    /**
     * ??????Excel abs????????????
     */
    public downloadCapitalPoolExcel() {
        // ???????????????
        const time = new Date().getTime();
        const filename = `${
            this.formCapitalPool.capitalId
            }_${time}_?????????????????????.xlsx`;
        // appId + '-' + orgName + '-' + time + '.zip';
        this.xn.api
            .download('/attachment/download/index', {
                key: `${this.formCapitalPool.capitalId}?????????????????????.xlsx`
            })
            .subscribe((v: any) => {
                this.xn.api.save(v._body, filename);
            });
    }

    public goback() {
        window.history.back();
        // if (this.isProjectenter) {
        //     window.history.back();
        //     // this.xn.router.navigate(['/logan/projectPlan-management'], {
        //     //     queryParams: { currentPage: this.currentPage }
        //     // });
        // } else {
        //     this.xn.router.navigate(['/console/capital-pool'], {
        //         queryParams: { currentPage: this.currentPage }
        //     });
        // }
    }

    /**
     * ??????????????????
     * @param item
     */
    public viewProcess(item: any) {
        this.xn.router.navigate([`console/main-list/detail/${item}`]);
    }

    /**
     * ???????????????
     */
    private doBefore() {
        if (!this.rows || this.rows.length === 0) {
            this.xn.msgBox.open(false, '???????????????????????????????????????????????????');
            return;
        }
        // ????????????
        const selectedRows = this.rows.filter(
            (x: any) => x.checked && x.checked === true
        );
        // ?????????????????????
        const selectedCompany = XnUtils.distinctArray(selectedRows.map(c => c.headquarters));
        if (!selectedRows || selectedRows.length === 0) {
            this.xn.msgBox.open(false, '?????????????????????????????????????????????');
            return;
        }
        if (selectedCompany.length > 1) {
            this.xn.msgBox.open(false, '??????????????????????????????????????????????????????');
            return;
        }
        return {
            selectedCompany,
            selectedRows
        };
    }

    /**
     * ????????????
     */
    public generate() {
        const { selectedCompany, selectedRows } = this.doBefore();
        // ????????????????????????
        const param = selectedCompany[0];
        // ??????
        const urls = {
            capital03: '/llz/capital_list/capital03', // ????????????????????????????????????
            update_capital03: '/llz/capital_list/update_capital03',
            exp_capital03: { noStamp: true },
            capital04: '/llz/capital_list/capital04', // ????????????????????????????????????
            update_capital04: '/llz/capital_list/update_capital04',
            exp_capital04: { noStamp: true },
            headquarters_receipt: '/custom/vanke_v5/contract/headquarters_receipt', // ???????????????????????????????????????????????????????????????
            update_headquarters_receipt: '/custom/vanke_v5/contract/update_headquarters_receipt', // ???????????????????????????????????????????????????????????????????????????????????????????????????????????????
            exp_headquarters_receipt: { noStamp: true },
            project_receipt: '/custom/vanke_v5/contract/project_receipt', // ???????????????????????????????????????????????? ??????????????????
            update_project_receipt: '/custom/vanke_v5/contract/update_project_receipt', // ???????????????????????????????????????????????????????????????????????????????????????????????????????????????
            exp_project_receipt: { noStamp: true },
            headquarters_qrs: '/custom/vanke_v5/contract/headquarters_qrs', // ??????????????????????????????????????????????????? (?????????)
            update_headquarters_qrs: '/custom/vanke_v5/contract/update_headquarters_qrs', // ??????????????????????????????????????????????????????????????????????????????????????????????????????????????????
            exp_headquarters_qrs: { noStamp: true },
            project_qrs: '/custom/vanke_v5/contract/project_qrs', // ????????????????????????????????????????????????????????? ??????????????????
            update_project_qrs: '/custom/vanke_v5/contract/update_project_qrs', // ????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????
            exp_project_qrs: { noStamp: true },
            traders_qrs: '/custom/vanke_v5/contract/traders_qrs', // ???????????????????????????????????????????????? (?????????)
            update_traders_qrs: '/custom/vanke_v5/contract/update_traders_qrs', // ???????????????????????????????????????????????????????????????????????????????????????????????????????????????
            exp_traders_qrs: { noStamp: true },
            // ???????????????
            confirm_file: '/custom/vanke_v5/contract/confirm_file', // ????????????????????? (?????????)
            update_confirm_file: '/custom/vanke_v5/contract/update_confirm_file', // ????????????????????????????????????????????????????????????????????????????????????
            exp_confirm_file: { noStamp: true }
        };
        XnModalUtils.openInViewContainer(
            this.xn,
            this.vcr,
            GeneratingContractModalComponent,
            param
        ).subscribe(x => {
            if (x !== '') {
                this.xn.loading.open();
                // ????????????
                const params = {
                    list: selectedRows.map(r => {
                        return {
                            mainFlowId: r.mainFlowId,
                            capitalPoolId: this.formCapitalPool.capitalId,
                            status: r.status
                        };
                    })
                };
                // ??????url
                const url = {
                    generate: urls[x.generatingContract],
                    update: urls[`update_${x.generatingContract}`],
                    exp: urls[`exp_${x.generatingContract}`]
                };
                this.doGenerateOrSign(url, params);
            }
        });
    }

    /**
     *  ????????????--?????????????????????
     * @param url
     * @param params
     */
    private doGenerateOrSign(url, params) {
        this.xn.api.post(url.generate, params)
            .pipe(
                map(con => {
                    this.xn.loading.close();
                    const contractList =
                        con.data.contractList ||
                        [].concat(con.data.list).reduce((prev, curr) => {
                            [].concat(curr.contractList).forEach(item => {
                                item.mainFlowId = curr.mainFlowId;
                            });
                            return [...prev].concat(curr.contractList);
                        }, []);
                    const result = JSON.parse(JSON.stringify(contractList));
                    if (result.length) {
                        result.forEach(tracts => {
                            tracts.config = { text: '????????????' };
                            // ??????????????????
                            if (url.exp.noStamp) {
                                tracts.readonly = true;
                                tracts.isNoSignTitle = true;
                            }
                        });
                        XnModalUtils.openInViewContainer(
                            this.xn,
                            this.vcr,
                            FinancingFactoringVankeModalComponent,
                            result
                        ).subscribe(x => {
                            this.xn.loading.open();
                            // ??????????????????
                            if (x === 'ok') {
                                // ????????????????????????????????????????????????
                                const p = con.data;
                                this.xn.api.post(url.update, p).subscribe(() => {
                                    this.xn.loading.close();
                                    this.onPage({
                                        page: this.paging,
                                        pageSize: this.pageSize
                                    });
                                });
                            }
                        });
                    }
                })
            ).subscribe();
    }

    /**
     * ????????????
     */
    public downloadSelectedAttach() {
        // ????????????
        const selectedRows = this.rows.filter(
            (x: any) => x.checked && x.checked === true
        );
        const params = { hasSelect: !!selectedRows && selectedRows.length > 0, selectedCompany: '' };
        // ????????????????????????????????????????????????????????????
        if (!params.hasSelect) {
            params.selectedCompany = XnUtils.distinctArray(this.rows.map(c => c.headquarters));
            if (params.selectedCompany.length > 1) {
                this.xn.msgBox.open(false, '???????????????????????????????????????');
                return;
            } else {
                params.selectedCompany = params.selectedCompany.toString();
            }
        } else {
            params.selectedCompany = XnUtils.distinctArray(selectedRows.map(c => c.headquarters)).toString();
        }
        XnModalUtils.openInViewContainer(
            this.xn,
            this.vcr,
            DownloadAttachmentsmodalComponent,
            params
        ).subscribe(x => {
            if (x !== '') {
                this.xn.loading.open();
                const param = { mainIdList: [], chooseFile: '' };
                param.chooseFile = x.chooseFile.split(',').filter(c => c !== '');
                if (x.downloadRange === 'all') {
                    param.mainIdList = this.rows.map(c => c.mainFlowId);
                } else if (x.downloadRange === 'selected') {
                    param.mainIdList = selectedRows.map(c => c.mainFlowId);
                }
                this.xn.api.download('/custom/vanke_v5/contract/load_attachment', param).subscribe((v: any) => {
                    this.xn.loading.close();
                    const reader = new FileReader();
                    reader.onload = () => {
                        try {
                            const content = JSON.parse(reader.result as string); // ??????????????????
                            if (content.ret === 1000) {
                                this.xn.msgBox.open(false, content.msg);
                            }
                        } catch (e) {
                            this.xn.api.save(v._body, '???????????????.zip');
                        }
                    };
                    reader.readAsText(v._body);
                });
            }
        });
    }

    /**
     * ??????????????????
     */
    public downAnnex() {
        if (this.rows && this.rows.length) {
            // ????????????????????????????????????????????????label= ?????????id+???????????????
            const contracts = this.rows.filter(x => this.hasContract(x));
            const data = this.getDownloadData(contracts);
            this.download(data);
        } else {
            this.xn.msgBox.open(false, '????????????????????????');
        }
    }

    /**
     * ????????????
     *  hasSelect ???????????????
     *  ??????????????????
     */
    public exportCapital() {
        const params = { hasSelect: !!this.capitalSelecteds && this.capitalSelecteds.length > 0 };
        XnModalUtils.openInViewContainer(
            this.xn,
            this.vcr,
            ExportListModalComponent,
            params
        ).subscribe(x => {
            if (x === '') {
                return;
            }
            this.xn.loading.open();
            const param = {
                isProxy: +this.formCapitalPool.isProxy,
                mainFlowIds: []
            };
            if (x.exportList === 'all') {
                param.mainFlowIds = this.rows.map(c => c.mainFlowId);
            } else if (x.exportList === 'selected') {
                param.mainFlowIds = this.capitalSelecteds;
            }
            this.xn.api.download('/mdz/down_file/load_list', param).subscribe((v: any) => {
                this.xn.api.save(v._body, '???????????????.xlsx');
                this.xn.loading.close();
            });
        });
    }

    /**
     * ????????????
     * @param row
     * @param head
     */
    public uploadContract(row, head) {
        const params = {
            title: `??????${head.title}`,
            checker: [
                {
                    title: `${head.title}`, checkerId: 'proveImg', type: 'mfile',
                    options: {
                        filename: `${head.title}`,
                        fileext: 'jpg, jpeg, png, pdf',
                        picSize: '500'
                    }, memo: '??????????????????PDF'
                },
            ]
        };
        XnModalUtils.openInViewContainer(this.xn, this.vcr, NewFileModalComponent, params).subscribe(v => {
            this.xn.loading.open();
            if (v === null) {
                this.xn.loading.close();
                return;
            }
            const noi = {
                capitalPoolContract03: 'photoCopy01',
                capitalPoolContract04: 'photoCopy02',
                headquartersReceipt: 'photoCopy03',
                projectReceipt: 'photoCopy04',
                pdfProjectFiles: 'photoCopy05',
                projectQrs: 'photoCopy06',
                tradersQrs: 'photoCopy07'
            };
            const param = {
                mainIdList: [row.mainFlowId],
                files: v.files,
                uploadType: noi[head.checkerId]
            };
            this.xn.api.post('/custom/vanke_v5/contract/upload_files', param)
                .subscribe(() => {
                    this.xn.loading.close();
                    this.onPage({
                        page: this.paging,
                        pageSize: this.pageSize
                    });
                });
        });
    }

    /**
     * ????????????
     * @param row
     *  readonly  ??????
     */
    public viewContract(row: any) {
        const params = typeof row === 'string' ? JSON.parse(row)[0] : row;
        params.readonly = true;
        XnModalUtils.openInViewContainer(
            this.xn,
            this.vcr,
            PdfSignModalComponent,
            params
        ).subscribe(() => {
            // do nothing
        });
    }

    /**
     * ??????????????????
     * @param item
     */
    public fileView(item) {
        XnModalUtils.openInViewContainer(this.xn, this.vcr, FileViewModalComponent, JSON.parse(item)[0]).subscribe(() => {
        });
    }

    /**
     *  ???????????????
     * @param url
     * @param params
     */
    private addOrRemoveCapitalPool(
        url: string,
        params: { mainFlowIds: any[]; capitalPoolId: any }
    ) {
        this.xn.api.post(url, params).subscribe(() => {
            this.onPage({
                page: this.paging,
                pageSize: this.pageSize
            });
            this.allChecked = false;
        });
    }

    /**
     * ???????????????
     */
    returnBackCapital() {
        window.history.back()
        // this.xn.router.navigate(['/console/capital-pool/trading-list'], {
        //     queryParams: {
        //         capitalId: this.formCapitalPool.capitalId,
        //         capitalPoolName: this.formCapitalPool.capitalPoolName || '',
        //         headquarters: this.formCapitalPool.headquarters,
        //         isProxy: this.formCapitalPool.isProxy,
        //         type: '1',   // this.formCapitalPool.type
        //         currentPage: this.formCapitalPool.currentPage,
        //         isLocking: this.formCapitalPool.headquarters
        //     }
        // });
    }

    /**
     *  ????????????
     * @param item
     */
    private hasContract(item: any): any {
        return (
            item.capitalPoolContract !== '' ||
            item.capitalPoolContract01 !== '' ||
            item.capitalPoolContract02 !== '' ||
            item.capitalPoolContract03 !== '' ||
            item.capitalPoolContract04 !== ''
        );
    }

    /**
     *  ?????????????????????
     * @param capitalSelecteds
     */
    private getDownloadData(capitalSelecteds: any[]) {
        const data = [];
        capitalSelecteds.forEach(x => {
            this.prepareContract(x.capitalPoolContract, x.mainFlowId, data);
            this.prepareContract(x.capitalPoolContract01, x.mainFlowId, data);
            this.prepareContract(x.capitalPoolContract02, x.mainFlowId, data);
            this.prepareContract(x.capitalPoolContract03, x.mainFlowId, data);
            this.prepareContract(x.capitalPoolContract04, x.mainFlowId, data);
        });
        return data;
    }

    private prepareContract(contract: any, mainFlowId: string, data: any[]) {
        if (contract !== '' && JSON.parse(contract) instanceof Array) {
            JSON.parse(contract).forEach(y => {
                y.label = `${y.label}_${mainFlowId}`;
                data.push(y);
            });
        }
    }

    private download(data: any[]) {
        if (!(data && data.length > 0)) {
            this.xn.msgBox.open(false, '????????????????????????');
            return;
        }

        this.xn.api
            .download('/file/down_file', { files: data })
            .subscribe((x: any) => {
                this.xn.api.save(x._body, '???????????????.zip');
                this.xn.loading.close();
            });
    }

    /**
     *  ??????????????????
     * @param fields
     */
    private addExtraFields(fields: Array<any> = []) {
        const proxyTypeOptions = SelectOptions.get('proxyType');
        const obj = proxyTypeOptions.find((x: any) => x.label === '????????????');
        const idx = fields.findIndex((x: any) => x.checkerId === 'moneyChannel');
        const isProxy = this.formCapitalPool.isProxy === obj.value.toString();
        if (isProxy && idx < 0) {
            const filed = {
                title: '????????????',
                checkerId: 'moneyChannel',
                type: 'xnMoneyChannel',
                memo: '',
                _inSearch: {
                    number: 13,
                    type: 'select',
                    selectOptions: 'moneyChannel',
                    base: 'number'
                },
                _inList: {
                    sort: false,
                    search: true
                }
            };
            fields.splice(10, 0, filed);
        } else if (!isProxy && idx > -1) {
            fields.splice(idx, 1);
        }
    }

    /**
     *  ????????????
     * @param searches
     */
    private buildShow(searches) {
        this.shows = [];
        this.buildCondition(searches);
    }

    private buildCondition(searches) {
        const tmpTime = {
            beginTime: this.beginTime,
            endTime: this.endTime
        };
        const objList = [];
        this.timeId = $.extend(
            true,
            [],
            this.searches
                .filter(v => v.type === 'quantum')
                .map(v => v.checkerId)
        );
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
        this.shows = $.extend(
            true,
            [],
            objList.sort(function(a, b) {
                return a.number - b.number;
            })
        ); // ?????????;
        XnFormUtils.buildSelectOptions(this.shows);
        this.buildChecker(this.shows);
        this.mainForm = XnFormUtils.buildFormGroup(this.shows);

        const time = this.searches.filter(v => v.type === 'quantum');
        this.tolerance = $.extend(
            true,
            [],
            this.searches
                .filter(v => v.type === 'tolerance')
                .map(v => v.checkerId)
        );

        const forSearch = this.searches
            .filter(v => v.type !== 'quantum')
            .map(v => v && v.checkerId);
        this.searchArr = $.extend(true, [], forSearch); // ?????????;
        const timeCheckId = time[0] && time[0].checkerId;
        this.nowTimeCheckId = timeCheckId;

        this.mainForm.valueChanges.subscribe(v => {
            if (this.isClearing) {
                return;
            }

            const changeId = v[timeCheckId];
            delete v[timeCheckId];
            if (changeId !== '' && this.nowTimeCheckId) {
                const paramsTime = JSON.parse(changeId);
                const beginTime = paramsTime.beginTime;
                const endTime = paramsTime.endTime;

                if (beginTime === this.beginTime && endTime === this.endTime) {
                    // return;
                } else {
                    this.beginTime = beginTime;
                    this.endTime = endTime;
                    this.paging = 1;
                    this.rows.splice(0, this.rows.length);
                    const params = this.buildParams();
                    this.base.onList(params);
                }
            }
            const arrObj = {} as any;
            for (const item in v) {
                if (v.hasOwnProperty(item) && v[item] !== '') {
                    const searchFilter = this.searches
                        .filter(vv => vv && vv.base === 'number')
                        .map(c => c.checkerId);
                    if (searchFilter.indexOf(item) >= 0) {
                        arrObj[item] = Number(v[item]);
                    } else {
                        arrObj[item] = v[item];
                    }
                }
            }
            this.arrObjs = $.extend(true, {}, arrObj); // ?????????;????????????????????????
        });
    }

    private buildChecker(stepRows) {
        for (const row of stepRows) {
            // ?????????????????????????????????
            if (row.checkerId === 'headquarters') {
                row.options.isProxy = this.formCapitalPool.isProxy;
            }

            XnFormUtils.convertChecker(row);
        }
    }

    /**
     *  ????????????
     */
    private buildParams() {
        // ????????????
        const params: any = {
            start: ((this.paging < 0 ? 1 : this.paging) - 1) * this.pageSize,
            length: this.pageSize,
            beginTime: this.beginTime,
            endTime: this.endTime
        };

        // ???????????????????????????
        // ????????????????????????????????????
        if (this.formCapitalPool && this.formCapitalPool.type === '2') {
            params.where = {
                _complex: {
                    _logic: 'AND',
                    // isProxy: ['in', [this.formCapitalPool.isProxy]],
                    iscapitalPool: 0,
                    status: ['in', [1, 2, 3, 4, 5, 6]]
                }
            };
        }
        // ?????????????????????,?????????????????????
        if (
            this.formCapitalPool &&
            (this.formCapitalPool.type === '3' ||
                this.formCapitalPool.type === '1')
        ) {
            params.where = {
                _complex: {
                    _logic: 'AND',
                    iscapitalPool:
                        this.formCapitalPool.type === '1' ? 1 : undefined,
                    capitalPoolId: this.formCapitalPool.capitalId,
                    status: ['in', [1, 2, 3, 4, 5, 6]]
                }
            };
        }
        // ????????????
        if (this.sorting && this.naming) {
            params.order = [this.sorting + ' ' + this.naming];
        }
        // ????????????
        if (this.searches.length > 0) {
            if (!$.isEmptyObject(this.arrObjs)) {
                // ?????????????????????where?????????????????????????????????
                if (!params.where) {
                    params.where = {
                        _complex: {
                            _logic: 'AND' // ????????????AND??????
                        }
                    };
                }
            }

            for (const search of this.searches) {
                if (!XnUtils.isEmpty(this.arrObjs[search.checkerId])) {
                    switch (search.checkerId) {
                        case 'capitalPoolContract01':
                        case 'capitalPoolContract02':
                        case 'capitalPoolContract03':
                        case 'capitalPoolContract04': {
                            params.where._complex[search.checkerId] =
                                this.arrObjs[search.checkerId].toString() ===
                                    '1'
                                    ? ['!=', '']
                                    : ['=', ''];
                            break;
                        }
                        case 'payConfirmId':
                        case 'moneyChannel': {
                            params[search.checkerId] = this.arrObjs[
                                search.checkerId
                            ];
                            break;
                        }
                        case 'status': {
                            if (this.arrObjs[search.checkerId]) {
                                params.where._complex[search.checkerId] = [
                                    'like',
                                    `%${this.arrObjs[search.checkerId]}%`
                                ];
                            }
                            break;
                        }
                        default: {
                            params.where._complex[search.checkerId] = [
                                'like',
                                `%${this.arrObjs[search.checkerId]}%`
                            ];
                        }
                    }
                }
            }
        }
        // ????????????
        params.where._complex.headquarters = [
            'like',
            `%${this.formCapitalPool.headquarters}%`
        ];
        // ???????????????????????????: 6 , ????????????: 14 ???
        params.where._complex.isProxy = this.formCapitalPool.isProxy;
        (params.where._complex.dcType = this.isWankeMode ? 4 : 5);
        return params;
    }
}

enum TradMode {
    // ???????????????????????????: 6 , ????????????: 14 ???
    WanKe = '6',
    JinDi = '14'
}
