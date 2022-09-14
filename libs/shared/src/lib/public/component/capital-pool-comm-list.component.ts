/*
 * Copyright(c) 2017-2019, 深圳市链融科技股份有限公司
 * Beijing Xiwei Technology Co., Ltd.
 * All rights reserved.
 *
 * @file：capital-pool-comm-list.component.ts
 * @summary：资产池列表
 * @version: 1.0
 * **********************************************************************
 * revision             author            reason             date
 * 1.0                 zhyuanan          修改代码格式         2019-04-09
 * 1.1                 zhyuanan          添加列表搜索项       2019-04-12
 * 是否推送企业，项目公司是否已全部回传文件,总部公司为雅居乐时，添加生成多分合同
 * 1.2                 zhyuanan                              2019-05-14
 * 列表中如果总部公司为 金地（集团）股份有限公司，不是现实是否推送 checkerId='isSignContract'
 * **********************************************************************
 */

import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { XnService } from '../../services/xn.service';
import { ActivatedRoute } from '@angular/router';
import CommUtils from './comm-utils';
import CommBase from './comm-base';
import { XnFormUtils } from '../../common/xn-form-utils';
import { FormGroup } from '@angular/forms';
import { XnUtils } from '../../common/xn-utils';
import { CommonPage, PageTypes } from './comm-page';
import { FinancingFactoringVankeModalComponent } from '../modal/financing-factoring-vanke-modal.component';
import { XnModalUtils } from '../../common/xn-modal-utils';
import { PdfSignModalComponent } from '../modal/pdf-sign-modal.component';
import { SelectOptions, HeadquartersTypeEnum } from '../../config/select-options';
import { map, switchMap } from 'rxjs/operators';
import { DownloadAttachmentsmodalComponent } from '../modal/download-attachmentsmodal.component';
import { GeneratingContractModalComponent } from '../modal/generating-contract-modal.component';
import { GeneratingContractStampModalComponent } from '../modal/generating-contract-stamp-modal.component';
import { ExportListModalComponent } from '../modal/export-list-modal.component';
import { BulkUploadModalComponent } from '../modal/bulk-upload-modal.component';
import { NewFileModalComponent } from '../form/hw-mode/modal/new-file-modal.component';
import { FileViewModalComponent } from '../modal/file-view-modal.component';
import { RatesPreModalComponent } from '../modal/rates-pre-modal.component';
import { MfilesViewModalComponent } from '../modal/mfiles-view-modal.component';
import { JsonTransForm } from '../pipe/xn-json.pipe';
import { EnumOperating } from 'libs/console/src/lib/capital-pool/capital-pool-index.component';

@Component({
    templateUrl: './capital-pool-comm-list.component.html',
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
                left: 20px;
            }

            .a-block {
                display: block;
            }

            .ml {
                margin-left: 30px;
            }
        `
    ]
})
export class CapitalPoolCommListComponent extends CommonPage implements OnInit {
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
    tolerance = [];
    nowTimeCheckId = '';
    searchArr = [];
    start: 0;
    showBtn: false;
    title: string;
    // 当前页
    public currentPage: any;
    // 资产池传入数据 exp {capitalId: "CASH_POOLING_4", type: "2"}
    public formCapitalPool: any;
    // 资产池操作枚举
    public enumOperating = EnumOperating;
    // 按照资产池需要显示
    public isCapitalPool: boolean;
    // 资产池选中的项 的mainflowId集合
    public capitalSelecteds: any[];
    // 增加，移除按钮状态
    public btnStatusBool = false;
    // 是否显示合同
    public showSign: boolean;
    // 是否显示资产化平台合同签署按钮
    public isShowPbtn = this.xn.user.orgType === 77;
    // 是否显示资产池交易列表按钮
    public isShowTradingBtn = false;
    // 是否为万科交易模式
    public isWankeMode = false;
    // 全选，取消全选
    public allChecked = false;
    // 是否为中介角色用户
    public isAgencyUser = false;
    public enterpriserSelectItems = SelectOptions.get('abs_headquarters'); // 总部企业对应
    // 总部公司
    public headquarters = '';
    // 是否为雅居乐总部公司
    public isHeadquarterYJL = false;
    public isProjectEnter = false;
    isClearing = false;
    // 影印件对应关系
    private PhotoCopy = {
        万科: ['photoCopy02', 'confirmPic'], // 《项目公司回执（二次转让）》影印件,确认函
        '金地（集团）股份有限公司': [], // 无
        // 《总部公司回执（二次转让）》影印件,《项目公司回执（二次转让）》影印件,
        // 《总部公司回执（一次转让）》影印件,《项目公司回执（一次转让）》影印件,《付款确认书（总部致保理商）》影印件，
        // 《付款确认书（项目公司致供应商）》影印件
        雅居乐地产控股有限公司: ['photoCopy01', 'photoCopy02', 'photoCopy03', 'photoCopy04', 'photoCopy05', 'photoCopy06'],
        // 《付款确认书（总部致保理商）》影印件,《付款确认书（总部致券商）》影印件
        深圳市龙光控股有限公司: ['photoCopy05', 'photoCopy07']
    };
    // 选中集合
    public selectedItems: any[] = [];
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
            this.headquarters = params.queryParams.headquarters;
            const superConfig = params.data;
            superConfig.fields = this.addExtraFields(superConfig.fields);
            this.base = new CommBase(this, superConfig);
            this.heads = CommUtils.getListFields(superConfig.fields);
            this.searches = CommUtils.getSearchFields(superConfig.fields);
            // **** 列表字段处理 ****
            if (this.headquarters === HeadquartersTypeEnum[3]) {
                this.isHeadquarterYJL = true;
                for (let i = 0; i < this.heads.length; i++) {
                    if (this.heads[i].checkerId === 'pdfProjectFiles') {
                        this.heads[i].title = '《付款确认书（总部致供应商）》';
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
                    this.isWankeMode =
                        this.formCapitalPool.isProxy === TradMode.WanKe;
                    this.currentPage = this.formCapitalPool.currentPage;
                    if (this.formCapitalPool.isLocking) {
                        // 是否可签署合同
                        this.showSign = this.formCapitalPool.isLocking === '1';
                    }
                    // 显示资产池
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
     *  查看单个文件
     * @param sub 文件数据
     */
    public viewFile(sub) {
        XnModalUtils.openInViewContainer(this.xn, this.vcr, FileViewModalComponent, sub).subscribe(() => {
        });
    }

    /**
     *  切换页面
     * @param event
     */
    public onPage(event: { page: number; pageSize: number }): void {
        this.paging = event.page;
        this.pageSize = event.pageSize;
        this.allChecked = false; // 重置全选按钮

        const params = this.buildParams();
        this.onList(params);
    }

    /**
     *  列排序
     * @param sort
     */
    public onSort(sort: string): void {
        // 如果已经点击过了，就切换asc 和 desc
        if (this.sorting === sort) {
            this.naming = this.naming === 'desc' ? 'asc' : 'desc';
        } else {
            this.sorting = sort;
            this.naming = 'asc';
        }

        this.onPage({ page: this.paging, pageSize: this.pageSize });
    }

    /**
     *  列排序提示
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
     *  文本提示样式
     * @param type
     */
    public onTextClass(type) {
        return type === 'money' ? 'text-right' : '';
    }

    /**
     *  搜索查询
     */
    public onSearch(): void {
        this.onPage({ page: this.paging, pageSize: this.pageSize });
    }

    /**
     *  清楚搜索项
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
        this.onSearch(); // 清空之后自动调一次search
        this.paging = 1; // 回到第一页
        this.isClearing = false;

        // 清除 创建时间 值
        this.mainForm.controls.createTime.setValue(null);
        this.mainForm.controls.payTime.setValue(null);
    }

    /**
     * 行内单选框
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
        // 当数组中不具有clicked 且为false。没有找到则表示全选中。
        this.allChecked = !this.rows.some(
            (x: any) => x.checked === undefined || x.checked === false
        );
        this.selectedItems = this.rows.filter(r => r.checked && r.checked === true);
    }

    /**
     * 删除-选中的
     */
    public handleCapital() {
        if (this.rows && this.rows.length) {
            if (this.capitalSelecteds && this.capitalSelecteds.length) {
                const params = {
                    mainFlowIds: this.capitalSelecteds,
                    capitalPoolId: this.formCapitalPool.capitalId
                };
                // 执行操作
                if (this.formCapitalPool.type === '2') {
                    // 添加操作
                    this.addOrRemoveCapitalPool(
                        '/ljx/capital_pool/add_main_flows',
                        params
                    );
                } else if (this.formCapitalPool.type === '3') {
                    // 删除操作
                    this.addOrRemoveCapitalPool(
                        '/ljx/capital_pool/remove_main_flows ',
                        params
                    );
                }
            }
        }
    }

    /**
     *  添加交易
     * @param val
     */
    public handleAdd(val: any) {
        this.xn.router.navigate(['/console/capital-pool/main-list'], {
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
     * 从该资产池移除交易
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
                if (company === HeadquartersTypeEnum[3] && rows.length > 0) {
                    this.xn.msgBox.open(false, `${ids}已经回传了付款确认书（总部致保理商/供应商）》，不能移除交易`);
                    return;
                }
                this.xn.msgBox.open(true, '确认移除吗?', () => {
                    const params = {
                        mainFlowIds: this.capitalSelecteds,
                        capitalPoolId: this.formCapitalPool.capitalId
                    };
                    // 删除操作
                    this.addOrRemoveCapitalPool(
                        '/ljx/capital_pool/remove_main_flows ',
                        params
                    );
                });
            }
        }
    }


    /**
     * 全选，取消全选
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
        // 选中项
        this.selectedItems = this.rows.filter(r => r.checked && r.checked === true);
    }

    /**
     * 下载Excel abs资金管理
     */
    public downloadCapitalPoolExcel() {
        // 拼接文件名
        const time = new Date().getTime();
        const filename = `${
            this.formCapitalPool.capitalId
            }_${time}_万科资产池交易.xlsx`;
        this.xn.api
            .download('/attachment/download/index', {
                key: `${this.formCapitalPool.capitalId}万科资产池交易.xlsx`
            })
            .subscribe((v: any) => {
                this.xn.api.save(v._body, filename);
            });
    }

    /**
     *  返回
     */
    public goback() {
        if (this.isProjectEnter === true) {
            window.history.back();
        } else {
            this.xn.router.navigate(['/console/capital-pool'], {
                queryParams: { currentPage: this.currentPage }
            });
        }

    }

    /**
     *  查看交易流程
     * @param item mainFlowId
     */
    public viewProcess(item: any) {
        this.xn.router.navigate([`console/main-list/detail/${item}`]);
    }

    /**
     * 生成并签署合同
     */
    public generateAndSign() {
        const { selectedCompany, selectedRows } = this.doBefore();
        // 传递给组件的参数
        const param = selectedCompany[0];
        // 接口
        const urls = {
            capital01: '/llz/capital_list/capital01', // 致总部公司通知书（二次转让）
            update_capital01: '/llz/capital_list/update_capital01',
            exp_capital01: { noStamp: false },
            capital02: '/llz/capital_list/capital02', // 致项目公司通知书（二次转让）
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
                // 准备参数
                const params = {
                    list: selectedRows.map(r => {
                        return {
                            mainFlowId: r.mainFlowId,
                            capitalPoolId: this.formCapitalPool.capitalId,
                            status: r.status
                        };
                    })
                };
                // 准备url
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
     *  针对总部公司为雅居乐，可一次生成多分合同 （暂时保留，页面关闭入口）
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
     * 生成合同
     */
    public generate() {
        const { selectedCompany, selectedRows } = this.doBefore();
        // 传递给组件的参数
        const param = selectedCompany[0];
        // 接口
        const urls = {
            capital03: '/llz/capital_list/capital03', // 项目公司回执（二次转让）
            update_capital03: '/llz/capital_list/update_capital03',
            exp_capital03: { noStamp: true },
            capital04: '/llz/capital_list/capital04', // 总部公司回执（二次转让）
            update_capital04: '/llz/capital_list/update_capital04',
            exp_capital04: { noStamp: true },
            headquarters_receipt: '/custom/vanke_v5/contract/headquarters_receipt', // 生成《总部公司回执（一次转让）》（清单式）
            update_headquarters_receipt: '/custom/vanke_v5/contract/update_headquarters_receipt', // 《总部公司回执（一次转让）》生成以后，把合同更新到该资产池的所有交易信息中
            exp_headquarters_receipt: { noStamp: true },
            project_receipt: '/custom/vanke_v5/contract/project_receipt', // 生成《项目公司回执（一次转让）》 （单笔单出）
            update_project_receipt: '/custom/vanke_v5/contract/update_project_receipt', // 《项目公司回执（一次转让）》生成以后，把合同更新到该资产池的所有交易信息中
            exp_project_receipt: { noStamp: true },
            headquarters_qrs: '/custom/vanke_v5/contract/headquarters_qrs', // 生成《付款确认书（总部致保理商）》 (清单式)
            update_headquarters_qrs: '/custom/vanke_v5/contract/update_headquarters_qrs', // 《付款确认书（总部致保理商）》生成以后，把合同更新到该资产池的所有交易信息中
            exp_headquarters_qrs: { noStamp: true },
            project_qrs: '/custom/vanke_v5/contract/project_qrs', // 生成《付款确认书（项目公司致供应商）》 （单笔单出）
            update_project_qrs: '/custom/vanke_v5/contract/update_project_qrs', // 《付款确认书（项目公司致供应商）》生成以后，把合同更新到该资产池的所有交易信息中
            exp_project_qrs: { noStamp: true },
            traders_qrs: '/custom/vanke_v5/contract/traders_qrs', // 生成《付款确认书（总部致券商）》 (清单式)
            update_traders_qrs: '/custom/vanke_v5/contract/update_traders_qrs', // 《付款确认书（总部致券商）》生成以后，把合同更新到该资产池的所有交易信息中
            exp_traders_qrs: { noStamp: true },
            // 生成确认函
            confirm_file: '/custom/vanke_v5/contract/confirm_file', // 生成《确认函》
            update_confirm_file: '/custom/vanke_v5/contract/update_confirm_file', // 《确认函》生成以后，把合同更新到该资产池的所有交易信息中
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
                // 准备参数
                const params = {
                    list: selectedRows.map(r => {
                        return {
                            mainFlowId: r.mainFlowId,
                            capitalPoolId: this.formCapitalPool.capitalId,
                            status: r.status
                        };
                    })
                };
                // 准备url
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
     * 下载附件
     */
    public downloadSelectedAttach() {
        // 选择的行
        const selectedRows = this.rows.filter(
            (x: any) => x.checked && x.checked === true
        );
        const params = { hasSelect: !!selectedRows && selectedRows.length > 0, selectedCompany: '' };
        // 未选择列表中数据时，检查公司名称是否一致
        if (!params.hasSelect) {
            params.selectedCompany = XnUtils.distinctArray(this.rows.map(c => c.headquarters));
            if (params.selectedCompany.length > 1) {
                this.xn.msgBox.open(false, '筛选条件下，具有不同公司！');
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
                            const content = JSON.parse(`${reader.result}`); // 内容就在这里
                            if (content.ret === 1000) {
                                this.xn.msgBox.open(false, content.msg);
                            }
                        } catch (e) {
                            this.xn.api.save(v._body, '资产池附件.zip');
                        }
                    };
                    reader.readAsText(v._body);
                });
            }
        });
    }

    /**
     * 下载全部附件
     */
    public downAnnex() {
        if (this.rows && this.rows.length) {
            // 找到所有的合同，并且修改该合同的label= 该交易id+合同名称；
            const contracts = this.rows.filter(x => this.hasContract(x));
            const data = this.getDownloadData(contracts);
            this.download(data);
        } else {
            this.xn.msgBox.open(false, '没有可下载的附件');
        }
    }

    /**
     * 导出清单
     *  hasSelect 导出选中项
     *  导出全部交易
     */
    public exportCapital() {
        // 选择的行
        const selectedRows = this.rows.filter(
            (x: any) => x.checked && x.checked === true
        );
        const params = { hasSelect: !!selectedRows && selectedRows.length > 0, selectedCompany: '' };
        // 未选择列表中数据时，检查公司名称是否一致
        if (!params.hasSelect) {
            params.selectedCompany = XnUtils.distinctArray(this.rows.map(c => c.headquarters));
            if (params.selectedCompany.length > 1) {
                this.xn.msgBox.open(false, '筛选条件下，具有不同公司！');
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
                this.xn.api.save(v._body, '资产池清单.xlsx');
            }, err => {
            }, () => {
                this.xn.loading.close();
            });
        });
    }

    /**
     * 生成支付申请单
     */
    public exportPayList() {
        // 选择的行
        const { selectedCompany, selectedRows } = this.doBefore();
        // 传递给组件的参数
        const param = selectedCompany[0];
        if (param !== HeadquartersTypeEnum[3]) {
            this.xn.msgBox.open(false, '总部公司不是雅居乐地产控股有限公司！');
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
                        this.xn.api.save(d._body, '应收账款转让价款支付申请单.xlsx');
                    }, err => {
                    }, () => {
                        this.xn.loading.close();
                    });
            }
        });


    }

    /**
     * 上传文件
     * @param row
     * @param head
     */
    public uploadContract(row, head) {
        const params = {
            title: `上传${head.title}`,
            checker: [
                {
                    title: `${head.title}`, checkerId: 'proveImg', type: 'mfile',
                    options: {
                        filename: `${head.title}`,
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
     * 查看合同
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
     * 批量上传
     */
    public uploadFiles() {
        const { selectedCompany, selectedRows } = this.doBefore();
        // 传递给组件的参数
        const param = selectedCompany[0];
        if (param === HeadquartersTypeEnum[2]) {
            this.xn.msgBox.open(false, `${HeadquartersTypeEnum[2]}无需此操作！`);
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
     * 推送企业
     */
    public doPush() {
        this.xn.loading.open();
        // 构建阐述
        const param = { mainIdList: this.selectedItems.map(m => m.mainFlowId), headquarters: this.headquarters };
        this.xn.api.post('/custom/vanke_v5/project/push_company', param).subscribe(() => {
            const html = ` <h4>推送企业成功</h4> `;
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
     * 查看回传文件 [批量]
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
            objList.push(obj);
        }
        this.shows = $.extend(
            true,
            [],
            objList.sort(function(a, b) {
                return a.number - b.number;
            })
        ); // 深拷贝;
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
        this.searchArr = $.extend(true, [], forSearch); // 深拷贝;
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
            this.arrObjs = $.extend(true, {}, arrObj); // 深拷贝;要进行搜索的变量
        });
    }

    private buildChecker(stepRows) {
        for (const row of stepRows) {
            // 设置总部公司选项的类型
            if (row.checkerId === 'headquarters') {
                row.options.isProxy = this.formCapitalPool.isProxy;
            }

            XnFormUtils.convertChecker(row);
        }
    }

    /**
     *  加载列表信息
     * @param params
     */
    private onList(params) {
        this.xn.api.post('/mdz/main/all?method=get', params).subscribe(json => {
            this.total = json.data.recordsTotal;
            this.rows = json.data.data.map(c => {
                this.PhotoCopy[c.headquarters].forEach(v => {
                    // 拼成类似c.need_photoCopy01
                    c[`need_${v}`] = true;
                });
                return c;
            });
            this.btnStatusBool = false;
            this.selectedItems = [];
        });
    }

    /**
     *  构建请求参数
     */
    private buildParams() {
        // 分页处理
        const params: any = {
            start: ((this.paging < 0 ? 1 : this.paging) - 1) * this.pageSize,
            length: this.pageSize,
            beginTime: this.beginTime,
            endTime: this.endTime
        };

        // 如果是资产池的操作
        // 资产池交易未入池添加操作
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
        // 资产池交易移除,查看资产池交易
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
        // 排序处理
        if (this.sorting && this.naming) {
            params.order = [this.sorting + ' ' + this.naming];
        }
        // 搜索处理
        if (this.searches.length > 0) {
            if (!$.isEmptyObject(this.arrObjs)) {
                // 如果参数已存在where属性，不重新添加新属性
                if (!params.where) {
                    params.where = {
                        _complex: {
                            _logic: 'AND' // 搜索时是AND查询
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
        // 总部公司
        params.where._complex.headquarters = [
            'like',
            `%${this.formCapitalPool.headquarters}%`
        ];
        // 交易模式（万科模式: 6 , 金地模式: 14 ）
        params.where._complex.isProxy = this.formCapitalPool.isProxy;
        (params.where._complex.dcType = this.isWankeMode ? 4 : 5);
        return params;
    }

    /**
     * 合同弹窗--可签署或不签署
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
                            if (tracts.label.includes('应收账款债权转让通知书')) {
                                tracts.config = { text: '（公章）' };

                            } else {
                                tracts.config = { text: '（盖章）' };

                            }
                            // 不需要签合同
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
                            // 更新添加到库
                            if (x === 'ok') {
                                // 上一步接口返回数据，原样传递回去
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
     *  添加，删除资产池
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
     *  判断是否有合同
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
     *  格式话下载数据
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
     *  拼接合同文件信息
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
     * 操作前检查
     */
    private doBefore() {
        if (!this.rows || this.rows.length === 0) {
            this.xn.msgBox.open(false, '资产池内没有数据，不能执行此操作！');
            return;
        }
        // 选择的行
        const selectedRows = this.rows.filter(
            (x: any) => x.checked && x.checked === true
        );
        // 选择的公司名称
        const selectedCompany = XnUtils.distinctArray(selectedRows.map(c => c.headquarters));
        if (!selectedRows || selectedRows.length === 0) {
            this.xn.msgBox.open(false, '没有选择数据，不能执行此操作！');
            return;
        }
        if (selectedCompany.length > 1) {
            this.xn.msgBox.open(false, '必须选择相同公司时，才能执行此操作！');
            return;
        }
        return {
            selectedCompany,
            selectedRows
        };
    }

    /**
     *  下载资产池附件
     * @param data
     */
    private download(data: any[]) {
        if (!(data && data.length > 0)) {
            this.xn.msgBox.open(false, '无可下载项');

            return;
        }
        this.xn.loading.open();
        this.xn.api
            .download('/file/down_capital_file', { files: data })
            .subscribe((x: any) => {
                this.xn.api.save(x._body, '资产池附件.zip');
                this.xn.loading.close();
            });
    }

    /**
     *  添加资金渠道, 总部公司金地时，不显示是否推送企业
     * @param fields
     */
    private addExtraFields(fields: Array<any> = []): Array<any> {
        if (this.headquarters === HeadquartersTypeEnum[2]) {
            fields = fields.filter(field => field.checkerId !== 'isSignContract');
        }
        const proxyTypeOptions = SelectOptions.get('proxyType');
        const obj = proxyTypeOptions.find((x: any) => x.label === '金地模式');
        const idx = fields.findIndex((x: any) => x.checkerId === 'moneyChannel');
        const isProxy = this.formCapitalPool.isProxy === obj.value.toString();
        if (isProxy && idx < 0) {
            const filed = {
                title: '资金渠道',
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


/**
 * 交易模式（万科模式: 6 , 金地模式: 14 ）
 */
enum TradMode {
    WanKe = '6',
    JinDi = '14'
}
