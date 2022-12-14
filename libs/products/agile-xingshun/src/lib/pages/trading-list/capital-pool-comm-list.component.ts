import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormGroup } from '@angular/forms';
import { map, switchMap } from 'rxjs/operators';
import { Subscription } from 'rxjs';
import { CommonPage, PageTypes } from 'libs/shared/src/lib/public/component/comm-page';
import { XnService } from 'libs/shared/src/lib/services/xn.service';
import CommUtils from 'libs/shared/src/lib/public/component/comm-utils';
import { XnModalUtils } from 'libs/shared/src/lib/common/xn-modal-utils';
import { FileViewModalComponent } from 'libs/shared/src/lib/public/modal/file-view-modal.component';
import { FinancingFactoringVankeModalComponent } from 'libs/shared/src/lib/public/modal/financing-factoring-vanke-modal.component';
import { XnUtils } from 'libs/shared/src/lib/common/xn-utils';
import { ExportListModalComponent } from 'libs/shared/src/lib/public/modal/export-list-modal.component';
import { RatesPreModalComponent } from 'libs/shared/src/lib/public/modal/rates-pre-modal.component';
import { NewFileModalComponent } from 'libs/shared/src/lib/public/form/hw-mode/modal/new-file-modal.component';
import { PdfSignModalComponent } from 'libs/shared/src/lib/public/modal/pdf-sign-modal.component';
import { JsonTransForm } from 'libs/shared/src/lib/public/pipe/xn-json.pipe';
import { XnFormUtils } from 'libs/shared/src/lib/common/xn-form-utils';
import { BusinessMode } from 'libs/shared/src/lib/common/enums';
import { SelectOptions, HeadquartersTypeEnum } from 'libs/shared/src/lib/config/select-options';
import { EnumOperating } from '../capital-pool/capital-pool-index.component';
import CommBase from '../agile-xingshun/comm-base';
import { GeneratingContractStampModalComponent } from 'libs/shared/src/lib/public/modal/generating-contract-stamp-modal.component';
import { GeneratingContractModalComponent } from 'libs/shared/src/lib/public/modal/generating-contract-modal.component';
import { DownloadAttachmentsModalComponent } from 'libs/shared/src/lib/public/dragon-vanke/modal/download-attachments-modal.component';
import { BulkUploadModalComponent } from 'libs/shared/src/lib/public/modal/bulk-upload-modal.component';
import { MfilesViewModalComponent } from 'libs/shared/src/lib/public/modal/mfiles-view-modal.component';
declare const $: any;

/**
 * base: src\app\public\component\capital-pool-comm-list.component.ts
 */
@Component({
    templateUrl: './capital-pool-comm-list.component.html',
    styleUrls: ['./capital-pool-comm-list.component.css'],
})
export class CapitalPoolCommListComponent extends CommonPage implements OnInit {
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
    isClearing = false;
    timeId = [];
    tolerance = [];
    nowTimeCheckId = '';
    searchArr = [];
    start: 0;
    showBtn: false;
    title: string;
    // ?????????
    public currentPage: any;
    // ????????????????????? exp {capitalId: "CASH_POOLING_4", type: "2"}
    public formCapitalPool: any;
    // ?????????????????????
    public enumOperating = EnumOperating;
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
    // ?????????????????????
    public allChecked = false;
    // ?????????????????????
    public isPlatformAdmin = false;
    public enterpriserSelectItems = SelectOptions.get('abs_headquarters'); // ??????????????????
    // ????????????
    public headquarters = '';
    // ??????????????????????????????
    public isHeadquarterYJL = false;
    public isProjectEnter = false;
    // ???????????????????????????
    public isAgencyUser = false;
    // ?????????????????????
    private PhotoCopy = {
        ?????????????????????????????????: ['photoCopy01', 'photoCopy02', 'photoCopy03', 'photoCopy04', 'photoCopy05', 'photoCopy06'],
    };
    // ????????????
    public selectedItems: any[] = [];

    refreshDataAfterAttachComponent = () => {
        this.onPage({ page: this.paging, pageSize: this.pageSize });
    }

    get hasPermission() {
        return !this.isPlatformAdmin && !this.isProjectEnter;
    }

    constructor(
        public xn: XnService,
        public vcr: ViewContainerRef,
        public route: ActivatedRoute,
    ) {
        super(PageTypes.List);
        this.isAgencyUser = this.xn.user.orgType === 102 || this.xn.user.orgType === 99;
        this.isPlatformAdmin = this.xn.user.isPlatformAdmin;
    }

    ngOnInit() {
        const initPage = ((params: { queryParams: any; data: any }) => {
            this.headquarters = params.queryParams.headquarters;
            const superConfig = params.data;
            superConfig.fields = this.addExtraFields(superConfig.fields);
            this.base = new CommBase(this, superConfig);
            this.heads = CommUtils.getListFields(superConfig.fields);
            this.searches = CommUtils.getSearchFields(superConfig.fields);
            // **** ?????????????????? ****
            if (this.headquarters === HeadquartersTypeEnum[4]) {
                this.isHeadquarterYJL = true;
                for (let i = 0; i < this.heads.length; i++) {
                    if (this.heads[i].checkerId === 'pdfProjectFiles') {
                        this.heads[i].title = '?????????????????????????????????????????????????????????????????????';
                        break;
                    }
                }
            }

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
        }).bind(this);

        this.route.queryParams
            .pipe(
                map(x => {
                    this.formCapitalPool = x;
                    this.isProjectEnter = x.isProjectentter === undefined ? false : true;
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

    /**
     *  ??????????????????
     * @param sub ????????????
     */
    public viewFile(sub) {
        XnModalUtils.openInViewContainer(this.xn, this.vcr, FileViewModalComponent, sub).subscribe(() => {
        });
    }

    /**
     *  ????????????
     * @param event
     */
    public onPage(event: { page: number; pageSize: number }): void {
        this.paging = event.page;
        this.pageSize = event.pageSize;
        this.allChecked = false; // ??????????????????

        const params = this.buildParams();
        this.onList(params);
    }

    /**
     *  ?????????
     * @param sort
     */
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

    /**
     *  ???????????????
     * @param checkerId
     */
    public onSortClass(checkerId: string): string {
        if (checkerId === this.sorting) {
            return 'sorting_' + this.naming;
        } else {
            return 'sorting';
        }
    }

    /**
     *  ??????????????????
     * @param type
     */
    public onTextClass(type) {
        return type === 'money' ? 'text-right' : '';
    }

    /**
     *  ????????????
     */
    public onSearch(): void {
        this.onPage({ page: this.paging, pageSize: this.pageSize });
    }

    /**
     *  ???????????????
     */
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

        this.buildCondition(this.searches);
        this.onSearch(); // ???????????????????????????search
        this.paging = 1; // ???????????????
        this.isClearing = false;

        // ?????? ???????????? ???
        this.mainForm.controls.createTime.setValue(null);
        this.mainForm.controls.payTime.setValue(null);
    }

    /**
     * ???????????????
     * @param val
     * @param index
     */
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
        this.allChecked = !this.rows.some(
            (x: any) => x.checked === undefined || x.checked === false
        );
        this.selectedItems = this.rows.filter(r => r.checked && r.checked === true);
    }

    /**
     * ??????-?????????
     */
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
     *  ????????????
     * @param val
     */
    public handleAdd(val: any) {
        this.xn.router.navigate(['/new-agile/capital-pool/main-list'], {
            queryParams: {
                capitalId: val.id,
                capitalPoolName: this.formCapitalPool.capitalPoolName || '',
                headquarters: val.headquarters,
                isProxy: val.isProxy,
                type: val.value,
                currentPage: this.paging
            }
        });
    }

    /**
     * ???????????????????????????
     */
    public removeCapital() {
        if (this.rows && this.rows.length) {
            if (this.capitalSelecteds && this.capitalSelecteds.length) {
                const { selectedCompany, selectedRows } = this.doBefore();
                const company = selectedCompany[0];
                const rows = selectedRows.filter(c => !!c.photoCopy05);
                let ids = '';
                rows.forEach(c => {
                    ids += c.mainFlowId + ',';
                });
                if (company === HeadquartersTypeEnum[4] && rows.length > 0) {
                    this.xn.msgBox.open(false, `${ids}???????????????????????????????????????????????????/????????????????????????????????????`);
                    return;
                }
                this.xn.msgBox.open(true, '????????????????', () => {
                    const params = {
                        mainFlowIds: this.capitalSelecteds,
                        capitalPoolId: this.formCapitalPool.capitalId
                    };
                    // ????????????
                    this.addOrRemoveCapitalPool(
                        '/ljx/capital_pool/remove_main_flows ',
                        params
                    );
                });
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
        // ?????????
        this.selectedItems = this.rows.filter(r => r.checked && r.checked === true);
    }

    /**
     * ??????Excel abs????????????
     */
    public downloadCapitalPoolExcel() {
        // ???????????????
        const time = new Date().getTime();
        const filename = `${this.formCapitalPool.capitalId
            }_${time}_????????????????????????.xlsx`;
        this.xn.api
            .download('/attachment/download/index', {
                key: `${this.formCapitalPool.capitalId}????????????????????????.xlsx`
            })
            .subscribe((v: any) => {
                this.xn.api.save(v._body, filename);
            });
    }

    /**
     *  ??????
     */
    public goback() {
        window.history.back();
        // if (this.isProjectEnter === true) {
        //     window.history.back();
        // } else {
        //     this.xn.router.navigate(['/new-agile/capital-pool'], {
        //         queryParams: { currentPage: this.currentPage }
        //     });
        // }

    }

    /**
     *  ??????????????????
     * @param item mainFlowId
     */
    public viewProcess(item: any) {
        this.xn.router.navigate([`new-agile/main-list/detail/${item}`]);
    }

    /**
     * ?????????????????????
     */
    public generateAndSign() {
        const { selectedCompany, selectedRows } = this.doBefore();
        // ????????????????????????
        const param = selectedCompany[0];
        // ??????
        const urls = {
            capital01: '/llz/capital_list/capital01', // ???????????????????????????????????????????????????????????????????????????
            update_capital01: '/llz/capital_list/update_capital01',
            exp_capital01: { noStamp: false },
            capital02: '/llz/capital_list/capital02', // ?????????????????????????????????????????????????????????????????????????????????
            update_capital02: '/llz/capital_list/update_capital02',
            exp_capital02: { noStamp: false }
        };
        XnModalUtils.openInViewContainer(
            this.xn,
            this.vcr,
            GeneratingContractStampModalComponent,
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
                    generate: urls[x.generatingAndSing],
                    update: urls[`update_${x.generatingAndSing}`],
                    exp: urls[`exp_${x.generatingAndSing}`]
                };
                this.doGenerateOrSign(url, params);
            }
        });
    }

    /**
     *  ???????????????????????????????????????????????????????????? ???????????????????????????????????????
     */
    public generateMultiple() {
        this.xn.loading.open();
        const params = {
            list: this.selectedItems.map(r => {
                return {
                    mainFlowId: r.mainFlowId,
                    capitalPoolId: this.formCapitalPool.capitalId,
                    status: r.status
                };
            })
        };
        this.xn.api.post('/custom/vanke_v5/contract/list_contracts', params).subscribe(cons => {
            if (!!cons && cons.data && cons.data.contractList && cons.data.contractList.length) {
                const contracts = cons.data.contractList;
                contracts.isProxy = 18;
                XnModalUtils.openInViewContainer(
                    this.xn,
                    this.vcr,
                    FinancingFactoringVankeModalComponent,
                    contracts
                ).subscribe(x => {
                    this.xn.api.post('/custom/vanke_v5/contract/update_list', {
                        contractList: contracts,
                        mainIdList: cons.data.mainIdList
                    }).subscribe(() => {
                        this.onPage({
                            page: this.paging,
                            pageSize: this.pageSize
                        });
                    });
                });
            }
        }, () => {
        }, () => {
            this.xn.loading.close();
        });
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
            capital03: '/llz/capital_list/capital03', // ???????????????????????????????????????????????????????????????????????????????????????
            update_capital03: '/llz/capital_list/update_capital03',
            exp_capital03: { noStamp: true },
            capital04: '/llz/capital_list/capital04', // ?????????????????????????????????????????????????????????????????????????????????
            update_capital04: '/llz/capital_list/update_capital04',
            exp_capital04: { noStamp: true },
            headquarters_receipt: '/custom/vanke_v5/contract/headquarters_receipt', // ????????????????????????????????????????????????????????????????????????????????????????????????????????????
            update_headquarters_receipt: '/custom/vanke_v5/contract/update_headquarters_receipt', // ????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????
            exp_headquarters_receipt: { noStamp: true },
            project_receipt: '/custom/vanke_v5/contract/project_receipt', // ??????????????????????????????????????????????????????????????????????????????????????????????????? ??????????????????
            update_project_receipt: '/custom/vanke_v5/contract/update_project_receipt', // ??????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????
            exp_project_receipt: { noStamp: true },
            headquarters_qrs: '/custom/vanke_v5/contract/headquarters_qrs', // ??????????????????????????????????????????????????? (?????????)
            update_headquarters_qrs: '/custom/vanke_v5/contract/update_headquarters_qrs', // ??????????????????????????????????????????????????????????????????????????????????????????????????????????????????
            exp_headquarters_qrs: { noStamp: true },
            project_qrs: '/custom/vanke_v5/contract/project_qrs', // ????????????????????????????????????????????????????????????????????????????????? ??????????????????
            update_project_qrs: '/custom/vanke_v5/contract/update_project_qrs', // ????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????
            exp_project_qrs: { noStamp: true },
            traders_qrs: '/custom/vanke_v5/contract/traders_qrs', // ????????????????????????????????????????????????????????? (?????????)
            update_traders_qrs: '/custom/vanke_v5/contract/update_traders_qrs', // ????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????
            exp_traders_qrs: { noStamp: true },
            // ???????????????
            confirm_file: '/custom/vanke_v5/contract/confirm_file', // ?????????????????????
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
            DownloadAttachmentsModalComponent,
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
                            const content = JSON.parse(`${reader.result}`); // ??????????????????
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
            ExportListModalComponent,
            params
        ).subscribe(x => {
            if (x === '') {
                return;
            }
            this.xn.loading.open();
            const param = {
                isProxy: +this.formCapitalPool.isProxy,
                mainFlowIds: [],
                capitalId: this.formCapitalPool.capitalId,
                type: '',
            };
            if (x.exportList === 'all') {
                param.mainFlowIds = this.rows.map(c => c.mainFlowId);
                param.type = 'all';
            } else if (x.exportList === 'selected') {
                param.mainFlowIds = this.capitalSelecteds;
                param.type = 'selected';
            }
            this.xn.api.download('/mdz/down_file/load_list', param).subscribe((v: any) => {
                this.xn.api.save(v._body, '???????????????.xlsx');
            }, err => {
            }, () => {
                this.xn.loading.close();
            });
        });
    }

    /**
     * ?????????????????????
     */
    public exportPayList() {
        // ????????????
        const { selectedCompany, selectedRows } = this.doBefore();
        // ????????????????????????
        const param = selectedCompany[0];
        if (param !== HeadquartersTypeEnum[4]) {
            this.xn.msgBox.open(false, '??????????????????????????????????????????????????????');
            return;
        }
        const mainFlowIds = selectedRows.map(temp => temp.mainFlowId);
        XnModalUtils.openInViewContainer(
            this.xn,
            this.vcr,
            RatesPreModalComponent,
            mainFlowIds
        ).subscribe(v => {
            if (v.action === 'ok') {
                this.xn.api.download('/mdz/down_file/pay_list',
                    { mainFlowIds, preValueDate: v.value }).subscribe((d: any) => {
                        this.xn.api.save(d._body, '???????????????????????????????????????.xlsx');
                    }, err => {
                    }, () => {
                        this.xn.loading.close();
                    });
            }
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
                tradersQrs: 'photoCopy07',
                confirmFile: 'confirmPic'
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
     * ????????????
     */
    public uploadFiles() {
        const { selectedCompany, selectedRows } = this.doBefore();
        // ????????????????????????
        const param = selectedCompany[0];
        if (param === HeadquartersTypeEnum[2]) {
            this.xn.msgBox.open(false, `${HeadquartersTypeEnum[2]}??????????????????`);
            return;
        }
        XnModalUtils.openInViewContainer(
            this.xn,
            this.vcr,
            BulkUploadModalComponent,
            param
        ).subscribe(x => {
            if (x !== '') {
                this.xn.loading.open();
                const params = {
                    files: JSON.parse(x.file),
                    uploadType: x.uploadType,
                    mainIdList: [],
                    capitalId: this.formCapitalPool.capitalId,
                    type: '',
                };
                if (x.uploadRange === 'all') {
                    params.mainIdList = this.rows.map(c => c.mainFlowId);
                    params.type = 'all';
                } else if (x.uploadRange === 'selected') {
                    params.mainIdList = selectedRows.map(c => c.mainFlowId);
                    params.type = 'selected';
                }
                this.xn.api.post('/custom/vanke_v5/contract/upload_files', params).subscribe(() => {
                    this.xn.loading.close();
                    this.onPage({
                        page: this.paging,
                        pageSize: this.pageSize
                    });
                });
            }
        });
    }

    /**
     * ????????????
     */
    public doPush() {
        this.xn.loading.open();
        // ????????????
        const param = { mainIdList: this.selectedItems.map(m => m.mainFlowId), headquarters: this.headquarters };
        this.xn.api.post('/custom/vanke_v5/project/push_company', param).subscribe(() => {
            const html = ` <h4>??????????????????</h4> `;
            this.xn.msgBox.open(false, [html], () => {
                this.onPage({
                    page: this.paging,
                    pageSize: this.pageSize
                });
                this.selectedItems = [];
            });
        }, () => {
        }, () => {
            this.xn.loading.close();
        });
    }

    /**
     * ?????????????????? [??????]
     * @param paramFiles
     */
    public fileView(paramFiles) {
        XnModalUtils.openInViewContainer(this.xn, this.vcr, MfilesViewModalComponent, JsonTransForm(paramFiles))
            .subscribe(() => {
            });
    }

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
            if (!obj.type || obj.type === 'listing') {
                obj.type = 'text';
            }
            objList.push(obj);
        }
        this.shows = $.extend(
            true,
            [],
            objList.sort(function (a, b) {
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
        this.mainFormSubscribe();
    }

    private mainFormSubscribe() {
        const timeCheckId = this.nowTimeCheckId;
        this.mainForm.valueChanges.subscribe(v => {
            if (this.isClearing) {
                return;
            }
            const changeId = v[timeCheckId];
            delete v[timeCheckId];
            if (changeId !== '' && this.nowTimeCheckId) {
                const paramsTime = JSON.parse(changeId);
                const beginTime = paramsTime ? paramsTime.beginTime : null;
                const endTime = paramsTime ? paramsTime.endTime : null;

                if (beginTime === this.beginTime && endTime === this.endTime) {
                    // return;
                } else {
                    this.beginTime = beginTime;
                    this.endTime = endTime;
                    this.paging = 1;
                    this.rows.splice(0, this.rows.length);
                    const params = this.buildParams();
                    this.onList(params);
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
     *  ??????????????????
     * @param params
     */
    private onList(params) {
        this.xn.loading.open();
        this.xn.api.post('/mdz/main/all?method=get', params).subscribe(json => {
            this.total = json.data.recordsTotal;
            this.rows = json.data.data.map(c => {
                this.PhotoCopy[c.headquarters].forEach(v => {
                    // ????????????c.need_photoCopy01
                    c[`need_${v}`] = true;
                });
                return c;
            });
            this.btnStatusBool = false;
            this.selectedItems = [];
        },
            err => { },
            () => this.xn.loading.close());
    }

    /**
     *  ??????????????????
     */
    private buildParams() {
        // ????????????
        const params: any = {
            start: ((this.paging < 0 ? 1 : this.paging) - 1) * this.pageSize,
            length: this.pageSize,
            beginTime: this.beginTime,
            endTime: this.endTime,
            modelId: BusinessMode.Yjl,
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
                        case 'isSignContract':
                        case 'isFileBack':
                        case 'payConfirmId':
                        case 'moneyChannel': {
                            params[search.checkerId] = this.arrObjs[
                                search.checkerId
                            ];
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
        // (params.where._complex['dcType'] = this.isWankeMode ? 4 : 5);
        params.where._complex.dcType = 4;
        return params;
    }

    /**
     * ????????????--?????????????????????
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
                    result.isProxy = 18;
                    if (result.length) {
                        result.forEach(tracts => {
                            if (tracts.label === ('?????????????????????????????????')) {
                                tracts.config = { text: '????????????' };
                            } else {
                                tracts.config = { text: '????????????' };
                            }
                            // ??????????????????
                            if (url.exp.noStamp) {
                                tracts.readonly = true;
                                tracts.isNoSignTitle = true;
                                tracts.caSignType = 1;
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
                                    this.onPage({
                                        page: this.paging,
                                        pageSize: this.pageSize
                                    });
                                });
                            }
                            this.xn.loading.close();
                        });
                    }
                })
            ).subscribe();
    }

    /**
     *  ????????????????????????
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
     *  ?????????????????????
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

    /**
     *  ????????????????????????
     * @param contract
     * @param mainFlowId
     * @param data
     */
    private prepareContract(contract: any, mainFlowId: string, data: any[]) {
        if (contract !== '' && JSON.parse(contract) instanceof Array) {
            JSON.parse(contract).forEach(y => {
                y.label = `${y.label}_${mainFlowId}`;
                data.push(y);
            });
        }
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
     *  ?????????????????????
     * @param data
     */
    private download(data: any[]) {
        if (!(data && data.length > 0)) {
            this.xn.msgBox.open(false, '???????????????');

            return;
        }
        this.xn.loading.open();
        this.xn.api
            .download('/file/down_capital_file', { files: data })
            .subscribe((x: any) => {
                this.xn.api.save(x._body, '???????????????.zip');
                this.xn.loading.close();
            });
    }

    /**
     *  ??????????????????, ???????????????????????????????????????????????????
     * @param fields
     */
    private addExtraFields(fields: Array<any> = []): Array<any> {
        if (this.headquarters === HeadquartersTypeEnum[2]) {
            fields = fields.filter(field => field.checkerId !== 'isSignContract');
        }
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

        return fields;
    }
}
