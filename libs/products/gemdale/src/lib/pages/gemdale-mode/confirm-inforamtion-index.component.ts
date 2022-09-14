/*
 * Copyright(c) 2017-2019, 深圳市链融科技股份有限公司
 * Beijing Xiwei Technology Co., Ltd.
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
import { XnFormUtils } from 'libs/shared/src/lib/common/xn-form-utils';
import { XnService } from 'libs/shared/src/lib/services/xn.service';
import { XnUtils } from 'libs/shared/src/lib/common/xn-utils';
import { XnModalUtils } from 'libs/shared/src/lib/common/xn-modal-utils';
import { EditInfoModalComponent } from 'libs/shared/src/lib/public/component/edit-info-modal.component';
import { BankManagementService } from 'libs/console/src/lib/bank-management/bank-mangement.service';
import { PdfSignModalComponent } from 'libs/shared/src/lib/public/modal/pdf-sign-modal.component';
import { ActivatedRoute } from '@angular/router';
import { InvoiceDataViewModalComponent } from 'libs/shared/src/lib/public/modal/invoice-data-view-modal.component';
import { ModalSize } from 'libs/shared/src/lib/common/modal/components/modal';
import { LocalStorageService } from 'libs/shared/src/lib/services/local-storage.service';
import { FinancingFactoringVankeModalComponent } from 'libs/shared/src/lib/public/modal/financing-factoring-vanke-modal.component';
import { ContractVankeSupplementModalComponent } from 'libs/shared/src/lib/public/modal/contract-vanke-supplement-modal.component';
import { JsonTransForm } from 'libs/shared/src/lib/public/pipe/xn-json.pipe';
import { FileViewModalComponent } from 'libs/shared/src/lib/public/modal/file-view-modal.component';

@Component({
    selector: 'app-comfirm-information-index-component',
    templateUrl: `./confirm-infotmation-index.component.html`,
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
export class ComfirmInformationIndexComponent implements OnInit {
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

    sorting = ''; // 共享该变量
    naming = ''; // 共享该变量
    displayShow = true;

    constructor(private xn: XnService,
        private vcr: ViewContainerRef,
        public bankManagementService: BankManagementService,
        private router: ActivatedRoute,
        private localStorageService: LocalStorageService) {
    }

    ngOnInit(): void {
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
            this.naming = '';
            this.sorting = '';
        }
        this.label = val;
        this.onPage({ page: this.paging });
    }

    /**
     * @param e  event.page: 新页码 <br> event.pageSize: 页面显示行数<br>event.first: 新页面之前的总行数<br>event.pageCount : 页码总数
     * @param type 标签页
     */
    public onPage(e?) {
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
        this.xn.api.post(this.currentTab.get_url, params).subscribe(x => {
            if (x.data && x.data.lists && x.data.lists.length) {
                this.data = x.data.lists;
                this.pageConfig.total = x.data.count;
            } else {
                // 固定值
                this.data = [];
                this.pageConfig.total = 0;
            }
        }, () => {
            // 固定值
            this.data = [];
            this.pageConfig.total = 0;
        }, () => {
            this.xn.loading.close();
        });
    }

    /**
     *  搜索,默认加载第一页
     */
    public searchMsg() {
        this.selectedItems = [];
        this.paging = 1;
        this.onPage({ page: this.paging });
    }

    /**
     * 重置
     */
    public reset() {
        this.selectedItems = [];
        this.form.reset(); // 清空
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
    show() {
        this.displayShow = !this.displayShow;
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
     *  查看更多发票
     * @param item
     */
    public viewMore(item) {
        if (typeof item === 'string') {
            item = JSON.parse(item);
        }
        XnModalUtils.openInViewContainer(
            this.xn,
            this.vcr,
            InvoiceDataViewModalComponent,
            item
        ).subscribe(() => {
        });
    }

    /**
     *  表头按钮组
     * @param btn {label:string,operate:string,value:string,value2?:string,disabled:boolean}
     */
    public handleHeadClick(btn) {
        switch (btn.operate) {
            // 确认应收账款金额
            case 'confirm_receivable':
                this.confirmReceivable(btn);
                break;
            // 签署付款确认书
            case 'sign_headquarters':
                this.signPagmentConfirm(btn);
                break;
            // 批量签署合同
            case 'sign_contracts':
                this.batchSign(btn);
                break;
            // 选择资金渠道
            case 'choose_money_channel':
                this.moneyChannel(btn);
                break;
            // 进入付款管理
            case 'into_payment':
                this.inPayment(btn);
                break;
            // 后补信息 - 补录
            case 'supplement_info':
                this.supplementTransInfo(btn);
                break;
            // 重新签署
            case 'repeat-sign':
                this.reSignContracts(btn);
                break;
            // 发起补录协议
            case 'initiate-supplemental-agreement':
                this.initiateSupplementalAgreement(btn);
                break;
        }
    }

    /**
     *  雅居乐补充协议 重新签署合同
     * @param btn
     */
    private reSignContracts(btn) {
        this.xn.loading.open();
        this.xn.api.post(btn.get_api, { mainFlowIds: this.selectedItems.map((x: any) => x.mainFlowId) })
            .subscribe(con => {
                const cons = con.data.contracts;
                const postCons = JSON.parse(JSON.stringify(cons));
                cons.forEach(element => {
                    if (!element.config) {
                        element.config = {
                            text: ''
                        };
                    }
                });
                cons.forEach(x => {
                    x.config.text = '受让方（全称）';
                });
                XnModalUtils.openInViewContainer(this.xn, this.vcr, FinancingFactoringVankeModalComponent, cons).subscribe(x => {
                    if (x === 'ok') {
                        // 保存合同信息
                        this.xn.api.post(btn.post_api, { lists: postCons })
                            .subscribe(() => {
                                this.selectedItems = [];
                                this.onPage({ page: this.paging });
                            });
                    }
                }, () => {
                }, () => {
                    this.xn.loading.close();
                });
            }, () => {
            }, () => {
                this.xn.loading.close();
            });
    }

    /**
     *  雅居乐补充协议 发起补充协议
     * @param btn
     */
    private initiateSupplementalAgreement(btn) {
        this.xn.loading.open();
        this.xn.api.post(btn.get_api, { mainIdList: this.selectedItems.map((x: any) => x.mainFlowId) })
            .subscribe(con => {
                const cons = con.data.data;
                cons.isProxy = 14;
                const postCons = JSON.parse(JSON.stringify(cons));
                cons.forEach(element => {
                    if (!element.config) {
                        element.config = {
                            text: ''
                        };
                    }
                });
                cons.forEach(x => {
                    x.config.text = '受让方（全称）';
                });
                XnModalUtils.openInViewContainer(this.xn, this.vcr, FinancingFactoringVankeModalComponent, cons).subscribe(x => {
                    if (x === 'ok') {
                        // 保存合同信息
                        this.xn.api.post(btn.post_api, { list: postCons })
                            .subscribe(() => {
                                this.selectedItems = [];
                                this.onPage({ page: this.paging });
                            });
                    }
                }, () => {
                }, () => {
                    this.xn.loading.close();
                });
            }, () => {
            }, () => {
                this.xn.loading.close();
            });
    }

    /**
     * 行按钮组事件
     * @param item 当前行数据
     * @param btn {label:string,operate:string,value:string,value2?:string}
     * @param i 下标
     */
    public handleRowClick(item, btn, i: number) {
        switch (btn.operate) {
            // 修改应收账款金额并回退
            case 'edit_receivable':
                this.updateReceivable(item, btn);
                break;
            // 签署合同
            case 'sign_contract':
                this.singleSign(item, btn);
                break;
            // 后补信息- 补录
            case 'vanke_supplement_info':
                this.vankeSupplementInfo(item, btn, i);
                break;
        }
    }

    /**
     *  判断数据是否长度大于显示最大值
     * @param value
     */
    public arrayLength(value: any) {
        if (!value) {
            return false;
        }
        const obj =
            typeof value === 'string'
                ? JSON.parse(value)
                : JSON.parse(JSON.stringify(value));
        return !!obj && obj.length > 2;
    }

    /**
     * 修改应收账款金额 金地模式，项目公司修改账款金额
     * @param item
     * @param btn
     */
    private updateReceivable(item, btn) {
        // 检查选中的交易是否有在进行中的
        this.xn.api.post('/custom/jindi_v3/project/check_project_flag', { mainFlowIds: [item.mainFlowId] })
            .subscribe(next => {
                if (next && next.data && next.data.length) {
                    return this.xn.msgBox.open(false, '该笔交易在途，请稍后再试');
                }

                const params = {
                    title: '修改应收账款转让金额',
                    size: ModalSize.Large,
                    checker: [
                        {
                            checkerId: 'mainFlowId',
                            required: 1,
                            type: 'text',
                            options: { readonly: true },
                            title: '交易ID',
                            value: item.mainFlowId
                        },
                        {
                            checkerId: 'contractId',
                            required: 1,
                            type: 'text',
                            title: '基础交易合同编号',
                            options: { readonly: true },
                            value: item.contractId
                        },
                        {
                            checkerId: 'projectCompany',
                            required: 1,
                            type: 'text',
                            title: '债务单位名称',
                            options: { readonly: true },
                            value: item.projectCompany
                        },
                        {
                            checkerId: 'receivable',
                            required: 1,
                            type: 'money',
                            title: '原应收账款金额',
                            options: { readonly: true },
                            value: item.receivable
                        },
                        {
                            checkerId: 'nowReceivable',
                            required: 1,
                            type: 'money',
                            title: '应收账款金额',
                        },
                        {
                            checkerId: 'memo',
                            required: 0,
                            type: 'textarea',
                            title: '备注',
                        },
                    ]
                };
                XnModalUtils.openInViewContainer(this.xn, this.vcr, EditInfoModalComponent, params).subscribe(x => {
                    if (x === null) {
                        return;
                    }
                    const param = {
                        mainFlowId: item.mainFlowId,
                        receivable: x.nowReceivable,
                        receivableDesc: x.memo,
                    };
                    this.xn.api.post(btn.value, param).subscribe(() => {
                        item.memo = x.memo;
                        item.receivable = x.nowReceivable;
                        this.onPage({ page: this.paging });
                    });

                });
            });
    }

    /**
     * 退回申请
     * @param item
     * @param btn
     */
    private sendBack(item, btn) {
        this.xn.api.post(btn.value, { mainFlowId: item.mainFlowId }).subscribe(() => this.onPage({ page: this.paging }));
    }

    /**
     *  单个签署合同
     * @param item
     * @param btn
     */
    private singleSign(item, btn) {
        this.xn.api.post(btn.value, { mainFlowIds: [item.mainFlowId] })
            .subscribe(con => {
                const cons = con.data.contractList;
                cons.isProxy = 14;
                cons.forEach(element => {
                    if (!element.config) {
                        element.config = {
                            text: ''
                        };
                    }
                });
                cons.forEach(x => {
                    if (x.label === '保理合同(金地国寿版)') {
                        x.config.text = '保理商（盖章）';
                    } else if (x.label === '应收账款转让登记协议(金地国寿版-供应商)') {
                        x.config.text = '受让人：（公章）';
                    } else if (x.label.includes('国内无追索权商业保理合同')) {
                        x.config.text = '乙方（保理商、受让人）数字签名';
                    } else if (x.label.includes('应收账款转让协议书') || x.label.includes('应收账款转让登记协议')) {
                        x.config.text = '乙方（受让方）';
                    } else {
                        x.config.text = '（盖章）';
                    }
                });
                XnModalUtils.openInViewContainer(this.xn, this.vcr, FinancingFactoringVankeModalComponent, cons).subscribe(x => {
                    if (x === 'ok') {
                        // 保存合同信息
                        this.xn.api.post(btn.value2, { mainFlowIds: [item.mainFlowId], contractList: cons }).subscribe(() => {
                            this.onPage({ page: this.paging });
                        });
                    }
                });
            });
    }

    /**
     * 批量签署合同
     * @param btn
     */
    private batchSign(btn) {
        this.xn.api.post(btn.value, { mainFlowIds: this.selectedItems.map((x: any) => x.mainFlowId) })
            .subscribe(con => {
                const cons = con.data.contractList;
                cons.isProxy = 14;
                cons.forEach(element => {
                    if (!element.config) {
                        element.config = {
                            text: ''
                        };
                    }
                });
                cons.forEach(x => {
                    if (x.label === '保理合同(金地国寿版)') {
                        x.config.text = '保理商（盖章）';
                    } else if (x.label === '应收账款转让登记协议(金地国寿版-供应商)') {
                        x.config.text = '受让人：（公章）';
                    } else if (x.label.includes('国内无追索权商业保理合同')) {
                        x.config.text = '乙方（保理商、受让人）数字签名';
                    } else if (x.label.includes('应收账款转让协议书') || x.label.includes('应收账款转让登记协议')) {
                        x.config.text = '乙方（受让方）';
                    } else {
                        x.config.text = '（盖章）';
                    }
                });
                XnModalUtils.openInViewContainer(this.xn, this.vcr, FinancingFactoringVankeModalComponent, cons).subscribe(x => {
                    if (x === 'ok') {
                        // 保存合同信息
                        this.xn.api.post(btn.value2, { mainFlowIds: this.selectedItems.map(main => main.mainFlowId), contractList: cons })
                            .subscribe(() => {
                                this.selectedItems = [];
                                this.onPage({ page: this.paging });
                            });
                    }
                });
            });
    }

    /**
     * 中止操作
     * @param item
     * @param btn
     */
    private stopStep(item, btn) {
        this.xn.router.navigate(['console/record/new'], {
            queryParams: {
                id: 'pay_over14',
                relate: 'mainFlowId',
                relateValue: item.mainFlowId
            }
        });
    }

    /**
     *  万科 待补录信息
     * @param item
     * @param btn
     * @param i
     */
    private vankeSupplementInfo(item: any, btn: any, i: number): void {
        const params = {
            title: '补充信息',
            checkers: [
                {
                    title: '合同编号',
                    checkerId: 'contractNum',
                    type: 'text',
                    required: false,
                    options: { readonly: true },
                    number: 2
                },
                {
                    title: '合同金额',
                    checkerId: 'contractAmount',
                    type: 'money',
                    required: false,
                    options: { readonly: true },
                    number: 4
                },
                {
                    title: '合同名称',
                    checkerId: 'contractName',
                    required: false,
                    type: 'text',
                    options: { readonly: true },
                    number: 1
                },
                {
                    title: '合同类型',
                    checkerId: 'contractType',
                    type: 'select',
                    required: true,
                    options: { ref: 'contractType_jban', readonly: true },
                    number: 3
                },
                {
                    title: '供应商',
                    checkerId: 'debtUnit',
                    required: false,
                    type: 'text',
                    options: { readonly: true },
                    number: 5
                },
                {
                    title: '项目公司',
                    checkerId: 'projectCompany',
                    required: false,
                    type: 'text',
                    options: { readonly: true },
                    number: 6
                }, {
                    title: '交易Id',
                    checkerId: 'mainFlowId',
                    required: false,
                    type: 'text',
                    options: { readonly: true },
                    number: 8
                },
                {
                    title: '合同签订时间',
                    checkerId: 'contractSignTime',
                    required: 0,
                    type: 'date-control-null',
                    number: 7,
                    placeholder: '请选择时间',
                    options: {},
                },
                {
                    title: '累积确认产值',
                    checkerId: 'cumulativelyOutputValue',
                    type: 'money-control',
                    required: 0,
                    number: 9,
                    placeholder: '请输入数字',
                    options: {},
                },
            ],
            data: item,
            files: [].concat(XnUtils.transFormFilesConData(item.contractFile),
                XnUtils.transFormFilesConData(item.AppointFile),
                XnUtils.transFormFilesConData(item.otherFiles)),
            post_api: btn.value, // 提交
            get_api: this.currentTab.get_url, // 获取
            currentIndex: this.pageConfig.first + i, // 当前数据所在的下标
            searchParams: this.buildParams(), // 搜索参数
            tab: this.currentTab
        };
        XnModalUtils.openInViewContainer(this.xn, this.vcr, ContractVankeSupplementModalComponent, params).subscribe(v => {
            if (v && v.action && v.action === 'ok') {
                this.onPage({ page: 1, first: 0 });
            } else {
                this.onPage({ page: this.paging });
            }
        });
    }

    /**
     * 选择资金渠道
     * @param btn
     */
    private moneyChannel(btn) {
        const params = {
            title: '请选择资金渠道',
            checker: [
                {
                    title: '资金渠道',
                    checkerId: 'moneyChannel',
                    type: 'radio',
                    options: { ref: 'moneyChannel' },
                    required: 1,
                }
            ]
        };
        XnModalUtils.openInViewContainer(this.xn, this.vcr, EditInfoModalComponent, params).subscribe(v => {
            if (v === null) {
                return;
            }
            this.xn.api.post(btn.value, { mainFlowIds: this.selectedItems.map(main => main.mainFlowId), moneyChannel: v.moneyChannel })
                .subscribe(() => {
                    this.selectedItems = [];
                    // 修改资金渠道
                    this.onPage({ page: this.paging });
                });
        });
    }

    /**
     * 推送到付款管理
     * @param btn
     */
    private inPayment(btn) {
        if (this.selectedItems.length <= 0) {
            this.xn.msgBox.open(false, '请选择资金渠道');
            return;
        }

        this.xn.api.post(btn.value, {
            lists: this.selectedItems.map(x => {
                return {
                    mainFlowId: x.mainFlowId,
                    moneyChannel: x.moneyChannel
                };
            })
        }).subscribe(() => {
            this.selectedItems = [];
            this.onPage({ page: this.paging });
        });
    }

    /**
     * 签署付款确认书 - 进入合同签署页面, 非流程，直接签署
     * @param btn
     */
    private signPagmentConfirm(btn) {
        this.localStorageService.setCacheValue('get_contract_url', btn.value);
        this.localStorageService.setCacheValue('get_contract2_url', btn.value2); // 获取已经签署的合同信息api
        this.localStorageService.setCacheValue('selected', this.selectedItems);
        this.xn.router.navigate(['console/gemdale/gemdale-supports/confirmation']);
    }

    /**
     * 确认应收账款金额,三级审核流程，后台根据流程id配置
     * @param btn api/custom/jindi_v3/project/check_project_flag
     */
    private confirmReceivable(btn) {
        // 检查选中的交易是否有在进行中的
        this.xn.api.post(btn.value,
            { mainFlowIds: this.selectedItems.map(main => main.mainFlowId) })
            .subscribe(next => {
                if (next && next.data && next.data.length) {
                    const mains = next.data.map((x: any) => x.mainFlowId);
                    const str = mains.join(' , ');
                    const html = `
                    <h5 style="font-weight: bold">以下交易重复提交，请重新选择</h5>
                    <p style="word-break: break-word">
                     ${str}
                    </p>
                `;
                    return this.xn.msgBox.open(false, [html]);
                }
                this.xn.router.navigate(['console/record/new'], {
                    queryParams: {
                        id: 'project_confirmation',
                        relate: '',
                        relateValue: ''
                    }
                });
                // 暂存信息 ，在<xn-input>  type:mFlows 中取值
                this.xn.localStorageService.setCacheValue('selected', this.selectedItems);
            });
    }

    /**
     * 保理商 对标准保理补充信息
     * @param btn
     */
    private supplementTransInfo(btn) {
        if (this.selectedItems.some(x => (!x.factoringEndDate || x.factoringEndDate === '')
            || (!x.assigneePrice || x.assigneePrice === ''))) {
            this.localStorageService.setCacheValue('staySupplementSelected', this.selectedItems);
            this.xn.router.navigate(['console/standard_factoring/trans_lists/supplement_info']);
        } else {
            this.xn.msgBox.open(false, `无需要补充项`, () => {
                // 取消选中状态
                this.data.forEach(item => item.checked = false);
                this.selectedItems = [];
            });
        }

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
        const params: any = {
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
                    if (search.checkerId === 'productType') {
                        const val = JSON.parse(this.arrObjs[search.checkerId]);
                        params.type = Number(val.proxy);
                        if (!!val.status) {
                            params.selectBank = Number(val.status);
                        }
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
