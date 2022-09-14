import { SelectOptions, HeadquartersTypeEnum } from 'libs/shared/src/lib/config/select-options';
import { PdfSignModalComponent } from 'libs/shared/src/lib/public/modal/pdf-sign-modal.component';
import { FileViewModalComponent } from 'libs/shared/src/lib/public/modal/file-view-modal.component';
import { XnModalUtils } from 'libs/shared/src/lib/common/xn-modal-utils';
import {
    Component,
    OnInit,
    ViewChild,
    ElementRef,
    ViewContainerRef
} from '@angular/core';

import { XnService } from 'libs/shared/src/lib/services/xn.service';
import { RatesDateStartModalComponent } from 'libs/shared/src/lib/public/modal/rates-date-start-modal.component';
import { XnFormUtils } from 'libs/shared/src/lib/common/xn-form-utils';
import { FormGroup } from '@angular/forms';
import { XnUtils } from 'libs/shared/src/lib/common/xn-utils';
import { LoadingService } from 'libs/shared/src/lib/services/loading.service';
import { ActivatedRoute, Router } from '@angular/router';
import { InvoiceDataViewModalComponent } from 'libs/shared/src/lib/public/modal/invoice-data-view-modal.component';
import { LocalStorageService } from 'libs/shared/src/lib/services/local-storage.service';
import { EditInfoModalComponent } from 'libs/shared/src/lib/public/component/edit-info-modal.component';
import { MfilesViewModalComponent } from 'libs/shared/src/lib/public/modal/mfiles-view-modal.component';
import { JsonTransForm } from 'libs/shared/src/lib/public/pipe/xn-json.pipe';

@Component({
    selector: 'app-payment',
    templateUrl: './payment.component.html',
    styles: [
        `
            .flex {
                display: flex;
            }

            .title {
                width: 100px;
            }

            .label {
                font-weight: normal;
                flex: 1;
            }

            .hightLine {
                color: red;
            }

            .print {
                margin-bottom: 10px;
                overflow: hidden;
            }
        `
    ]
})
export class PaymentComponent implements OnInit {
    @ViewChild('contentSection')
    el: ElementRef;

    data: Array<any> = [];
    showPrint = false;
    showPay = false;
    showPayment = false;
    showStop = true;
    uploadConfirm = true;
    total = 0;
    pageSize = 10;
    pageIndex = 1;
    first = 0;
    type = 'pay_no_do';
    lastType = '';
    completeMoneystyle = true;
    moneyChannelOptions = SelectOptions.get('moneyChannel');
    enterpriserSelectItems = SelectOptions.get('abs_headquarters'); // 总部企业对应
    // abs模式 -- 万科/金地
    absType: string;
    // 基本配置
    configBase: any = [
        // {
        //     title: '总部公司',
        //     checkerId: 'headquarters',
        //     type: 'select',
        //     options: { ref: 'abs_headquarters' },
        //     required: false
        // },
        {
            title: '付款确认书编号',
            checkerId: 'payConfirmId',
            type: 'text',
            required: false
        },
        {
            title: '申请付款单位',
            checkerId: 'projectCompany',
            type: 'text',
            required: false
        },
        {
            title: '收款单位',
            checkerId: 'debtUnit',
            type: 'text',
            required: false
        },
        {
            title: '合同编号',
            checkerId: 'contractId',
            type: 'text',
            required: false
        },
        {
            title: '发票号',
            checkerId: 'invoiceNum',
            type: 'text',
            required: false
        }
    ];
    // 是否需要更正
    configOPFlag = [
        {
            title: '是否需要更正',
            checkerId: 'opFlag',
            type: 'select',
            required: false,
            options: { ref: 'defaultRadio' }
        },
        // {
        //     title: '万科类型',
        //     checkerId: 'wkType',
        //     type: 'select',
        //     required: false,
        //     options: { ref: 'wkType' }
        // }
    ];
    // 下载次数
    configLoadTimes = [
        {
            title: '出纳下载次数',
            checkerId: 'loadTimes',
            type: 'select',
            required: false,
            options: { ref: 'accountReceipts' }
        }
    ];
    configNormal: any = [
        // {
        //     title: '总部公司',
        //     checkerId: 'headquarters',
        //     type: 'select',
        //     options: { ref: 'abs_headquarters' },
        //     required: false
        // },
        {
            title: '付款确认书编号',
            checkerId: 'payConfirmId',
            type: 'text',
            required: false
        },
        {
            title: '申请付款单位',
            checkerId: 'projectCompany',
            type: 'text',
            required: false
        },
        {
            title: '收款单位',
            checkerId: 'debtUnit',
            type: 'text',
            required: false
        },
        {
            title: '合同编号',
            checkerId: 'contractId',
            type: 'text',
            required: false
        },
        {
            title: '发票号',
            checkerId: 'invoiceNum',
            type: 'text',
            required: false
        },
        {
            title: '是否需要更正',
            checkerId: 'opFlag',
            type: 'select',
            required: false,
            options: { ref: 'defaultRadio' }
        }
    ];
    configSpe = [
        ...this.configNormal,
        ...[
            {
                title: '出纳下载次数',
                checkerId: 'loadTimes',
                type: 'select',
                required: false,
                options: { ref: 'accountReceipts' }
            },
            {
                checkerId: 'payDate',
                required: false,
                title: '起息时间',
                type: 'quantum1',
                value: ''
            }
        ]
    ];

    // 起息时间
    configPayDate = [
        {
            checkerId: 'payDate',
            required: false,
            title: '起息时间',
            type: 'quantum1',
            value: ''
        }
    ];
    // 资金渠道
    configMoneyChannel = [
        {
            title: '资金渠道',
            checkerId: 'moneyChannel',
            type: 'select',
            required: false,
            options: { ref: 'moneyChannel' }
        }
    ];
    // 万科基本查询表单配置
    configVanBase = [...this.configBase, ...this.configOPFlag];
    // 万科已打印付款表单配置
    configVanPayDo = [
        ...this.configBase,
        ...this.configOPFlag,
        ...this.configLoadTimes,
        ...this.configPayDate
    ];
    // 金地基本查询表单配置
    configGemBase = [...this.configBase, ...this.configMoneyChannel];
    // 金地已打印付款表单配置
    configGemPayDo = [
        ...this.configBase,
        ...this.configMoneyChannel,
        ...this.configLoadTimes,
        ...this.configPayDate
    ];
    configObj = {
        oldagile: {
            pay_no_do: this.configVanBase,
            pay_do: this.configVanPayDo,
            pay: this.configVanBase
        },
        gemdale: {
            pay_no_do: this.configGemBase,
            pay_do: this.configGemPayDo,
            pay: this.configGemBase
        }
    };
    form = {
        pay_do: FormGroup,
        pay_no_do: FormGroup,
        pay: FormGroup
    };
    url = {
        oldagile: {
            uri: '/ljx/pay_manage/',
            download: '/mdz/down_file/download_excel_list',
            print: '/ljx/pay_manage/pay_no_do_handle'
        },
        gemdale: {
            uri: '/custom/jindi_v3/pay_manage/',
            download: '/custom/jindi_v3/down_file/download_excel_list',
            print: '/custom/jindi_v3/pay_manage/pay_no_do_handle',
            backFlow: '/custom/jindi_v3/pay_manage/bank_flow'
        }
    };
    searches = [];
    payDoSelectedDownload: Array<string> = [];

    tabPaginationInfo = new Map<string,
        {
            pageIndex: number;
            pageSize: number;
            total: number;
            mainForm: any;
        }>();

    refreshDataAfterAttachComponent = () => {
        this.absType = this.activeRoute.snapshot.params.type;
        this.onPage({
            page: this.pageIndex,
            pageSize: this.pageSize
        });
    }

    constructor(
        public xn: XnService,
        private loading: LoadingService,
        private vcr: ViewContainerRef,
        private activeRoute: ActivatedRoute,
        private localStorageService: LocalStorageService,
    ) {
        this.tabPaginationInfo.set('pay_no', {
            pageSize: this.pageSize,
            pageIndex: 1,
            total: 0,
            mainForm: {}
        });
        this.tabPaginationInfo.set('pay_no_do', {
            pageSize: this.pageSize,
            pageIndex: 1,
            total: 0,
            mainForm: {}
        });
        this.tabPaginationInfo.set('pay_do', {
            pageSize: this.pageSize,
            pageIndex: 1,
            total: 0,
            mainForm: {}
        });
        this.tabPaginationInfo.set('pay', {
            pageSize: this.pageSize,
            pageIndex: 1,
            total: 0,
            mainForm: {}
        });
    }

    ngOnInit() {
        this.activeRoute.params.subscribe(data => {
            this.absType = data.type;
            this.initData(this.type, 1);
        });
    }

    buildForm(show, currentFormValue) {
        XnFormUtils.buildSelectOptions(show);
        show.forEach(c => {
            if (
                currentFormValue &&
                currentFormValue.hasOwnProperty(c.checkerId)
            ) {
                c.value = currentFormValue[c.checkerId] || '';
            } else {
                c.value = '';
            }
        });
        this.buildChecker(show);
        this.form[this.type] = XnFormUtils.buildFormGroup(show);
        this.form[this.type].valueChanges.subscribe(v => {
            const search = [];
            for (const key in this.form[this.type].value) {
                if (this.form[this.type].value.hasOwnProperty(key)) {
                    if (this.form[this.type].value[key] !== '') {
                        const obj = {} as any;
                        obj.key = key;
                        obj.value = this.form[this.type].value[key];
                        search.push(obj);
                    }
                }
            }
            this.searches = search;
            // 设置当前 tab 的查询信息
            this.tabPaginationInfo.set(this.type, {
                pageSize: this.pageSize,
                pageIndex: this.pageIndex,
                total: this.total,
                mainForm: this.form[this.type].value
            });
        });
    }

    private buildChecker(stepRows) {
        for (const row of stepRows) {
            XnFormUtils.convertChecker(row);
        }
    }

    onPage(event: { page: number; pageSize: number }) {
        this.pageIndex = event.page;
        this.pageSize = event.pageSize;

        this.setTabPageInfo(this.type);
        this.getCutPan(this.type, this.pageIndex);
    }

    searchMsg() {
        this.getCutPan(this.type, 1);
    }
    ViewContract(paramsFile: any[]) {
        const paramsFiles = JSON.stringify(paramsFile);
        XnModalUtils.openInViewContainer(this.xn, this.vcr, MfilesViewModalComponent, JsonTransForm(paramsFiles))
            .subscribe(() => {
            });

    }
    // 重置查询表单
    reset() {
        this.form[this.type].reset({ enterprise_dc: '', opFlag: '' });
        const keys = Object.keys(this.form);
        keys.forEach(k => {
            const values = this.form[k].value;
            if (values) {
                const keyList = Object.keys(values);
                keyList.forEach(i => {
                    values[i] = null;
                });
            }
        });
        this.getCutPan(this.type, 1);
    }

    // 下载所选交易信息表
    downLoad() {
        XnUtils.checkLoading(this);
        const json = this.data.filter(c => {
            return c.checked;
        });
        if (json.length === 0) {
            this.loading.close();
            this.xn.msgBox.open(false, '您未选中任何数据');
            return;
        } else {
            const param = json.map(c => c.mainFlowId);
            this.xn.api
                .download(this.url[this.absType].download, {
                    mainFlowIds: param
                })
                .subscribe((v: any) => {
                    this.loading.close();
                    // 浏览器报错: Failed to execute 'createObjectURL' on 'URL' 浏览器兼容问题
                    // let _url = (window.URL) ? window.URL : window.webkitURL;
                    this.xn.api.save(v._body, '交易信息表.xlsx');
                });
        }
    }

    // 出纳下载财务表格
    financeDown() {
        const json = this.payDoSelectedDownload;
        if (json.length === 0) {
            return this.xn.msgBox.open(false, '您未选中任何数据');
        }
        if (this.absType !== 'oldagile') {
            this.financeDownSub(json);
            return;
        }
        const params = {
            title: '出纳下载表格',
            checker: [
                {
                    title: '请选择下载模板',
                    checkerId: 'cashierDown',
                    type: 'radio',
                    options: { ref: 'cashierDownTemplate' },
                    required: 1,
                },
                {
                    title: '单笔最大金额',
                    checkerId: 'maxMoney',
                    type: 'text',
                    required: 0,
                    memo: '万元'
                },
                {
                    title: '表格最大笔数',
                    checkerId: 'maxNumber',
                    type: 'text',
                    required: 0,
                },
            ]
        };
        /**
         *   {label: '工行模板', value: 1}, 流程下载
         *   {label: '潍坊模板', value: 2}  直接下载
         *   {label: '浦发模板', value: 3}  直接下载
         */
        XnModalUtils.openInViewContainer(this.xn, this.vcr, EditInfoModalComponent, params).subscribe(v => {
            if (v === null) {
                return;
            }
            if (v.cashierDown === '2') { // 直接下载
                this.loading.open();
                this.xn.api.download('/mdz/down_file/load_financing_wf',
                    { mainFlowIdList: json.map((j: any) => j.mainFlowId), maxMoney: v.maxMoney * 10000, maxNumber: v.maxNumber })
                    .subscribe((next: any) => {
                        this.xn.api.save(next._body, '出纳下载表格(潍坊模板).xlsx');
                        // 上传下载次数
                        this.xn.api.post('/mdz/main/finance_load_times',
                            { mainFlowIds: json.map((j: any) => j.mainFlowId) }).subscribe(() => {
                                this.getCutPan(this.type);
                                this.loading.close();
                            });
                    });
            } else if (v.cashierDown === '3') {
                this.loading.open();
                this.xn.api.download('/mdz/down_file/load_financing_pf',
                    { mainFlowIdList: json.map((j: any) => j.mainFlowId) })
                    .subscribe((next: any) => {
                        this.xn.api.save(next._body, '出纳下载表格(浦发模板).xlsx');
                        // 上传下载次数
                        this.xn.api.post('/mdz/main/finance_load_times',
                            { mainFlowIds: json.map((j: any) => j.mainFlowId) }).subscribe(() => {
                                this.getCutPan(this.type);
                                this.loading.close();
                            });
                    });
            } else {
                this.xn.api.post('/mdz/down_file/record_cn',
                    {
                        mainFlowIds: json.map((j: any) => j.mainFlowId),
                        maxMoney: v.maxMoney, maxNumber: v.maxNumber, model: 1
                    }).subscribe(() => {
                        this.financeDownSub(json);
                    });
            }
        });
    }

    financeDownSub(json) {
        this.xn.router.navigate(['console/record/new'], {
            queryParams: {
                id:
                    this.absType === 'oldagile'
                        ? 'financing_download'
                        : 'financing_download14',
                relate: 'mainFlowId',
                relateValue: ''
            }
        });
        sessionStorage.setItem(
            'relate_value',
            JSON.stringify(json.map(c => c.mainFlowId))
        );
    }

    // 会计下载财务表格
    accountingDown() {
        this.localStorageService.setCacheValue('accounting_load_mainFlowIds',
            this.payDoSelectedDownload.map((x: any) => x.mainFlowId)); // 暂存选中的值
        this.localStorageService.setCacheValue('absType', this.absType); // 暂存abs类型【万科，金地】的值
        this.xn.router.navigate(['console/payment/pending/load']);
    }
    // 完成放款
    completeMoney() {
        this.xn.api.post('/custom/vanke_v5/project/finish_payment',
            { mainIds: this.payDoSelectedDownload.map((x: any) => x.mainFlowId) }).subscribe(x => {
                if (x.ret === 0) {
                    this.onPage({
                        page: this.pageIndex,
                        pageSize: this.pageSize
                    });
                }
            });

    }

    searchFormat(page) {
        const params: any = {
            start: (page - 1) * this.pageSize,
            length: this.pageSize
        };
        // 搜索处理
        if (this.searches.length > 0) {
            // if (!$.isEmptyObject(this.arrObjs)) {
            params.where = {
                _complex: {
                    _logic: 'AND', // 搜索时是AND查询
                    headquarters: ["like", `%${HeadquartersTypeEnum[3]}%`]
                }
            };
            // }

            for (const search of this.searches) {
                // 如果 value 是 undefined 或者 null
                if (!(search.value == null)) {
                    switch (search.key) {
                        case 'payConfirmId': {
                            if (search.value) {
                                params.where._complex[search.key] = `${
                                    search.value
                                    }`;
                            }
                            break;
                        }
                        case 'loadTimes': {
                            // 特殊处理loadTimes筛选项
                            params.where._complex[search.key] = [
                                search.value === '1' ? '>=' : '<=',
                                `${search.value}`
                            ];
                            break;
                        }
                        case 'payDate': {
                            if (search.value) {
                                const date = JSON.parse(search.value);
                                params.where._complex[search.key] = {
                                    '>=': date.beginTime,
                                    '<=': date.endTime
                                };
                            }
                            break;
                        }
                        default: {
                            params.where._complex[search.key] = [
                                'like',
                                `%${search.value}%`
                            ];
                        }
                    }
                }
            }
        } else {
            params.where = {
                _complex: {
                    _logic: 'AND',  // 搜索时是AND查询
                    headquarters: ["like", `%${HeadquartersTypeEnum[3]}%`]
                }
            }
        }
        return params;
    }

    initData(type, page?) {
        if (this.type !== 'pay_do') {
            // 已打印待放款 “财务下载表格” 可跨页挑选，切换 tab 时清空
            this.payDoSelectedDownload = [];
        }
        const currentFormValue = this.form[this.type].value;
        if (currentFormValue && this.form[type].value) {
            // 设置当前的查询条件值为前一Tab查询条件值
            const keys = Object.keys(this.form[type].value);
            keys.forEach(k => {
                if (currentFormValue.hasOwnProperty(k)) {
                    this.form[type].value[k] = currentFormValue[k];
                }
            });
        }
        // 记录上次点击的tab
        this.setTabPageInfo(type);
        // 创建 Form, 并保留当前对应的FormValue
        this.buildForm(this.configObj[this.absType][type], currentFormValue);
        // 设置分页信息
        this.getCutPan(type, page);
        this.showPrint = type === 'pay_no_do';
        this.showPay = type === 'pay_no';
        this.showPayment = type === 'pay_do';
        this.showStop = type !== 'pay';
        this.uploadConfirm = type === 'pay';
    }

    /**
     * 记录上次点击的tab
     */
    private setTabPageInfo(type: any) {
        this.lastType = this.type;
        // 记录当前点击tab
        this.type = type;
        // 记录上一次 tab 的信息
        this.tabPaginationInfo.set(this.lastType, {
            pageSize: this.pageSize,
            pageIndex: this.pageIndex,
            total: this.total,
            mainForm: !!this.form[this.lastType] && this.form[this.lastType].value
                ? this.form[this.lastType].value
                : {}
        });
    }

    getCutPan(type, page?) {
        // 获取 tab 的分页信息
        const target = this.tabPaginationInfo.get(type);
        page = page || target.pageIndex;
        this.pageIndex = page;
        this.pageSize = target.pageSize;
        this.total = target.total > 0 ? target.total : 0;
        if (!XnUtils.isEmptyObject(target.mainForm)) {
            this.form[this.type].setValue(target.mainForm);
        }
        this.getData(type, page);
    }

    getData(type, page?) {
        page = page || 1;
        const post = this.searchFormat(page);
        this.xn.api
            .post(`${this.url[this.absType].uri}${type}`, post)
            .subscribe(v => {
                this.data = v.data.data;
                this.payDoSelectedDownload = [];
                this.data.forEach(x => {
                    if (!!x.pdfProjectFiles) {
                        x.pdfProjectFiles = JSON.parse(x.pdfProjectFiles);
                    }

                });
                this.total = v.data.recordsTotal;
                this.first = (this.pageIndex - 1) * this.pageSize;
                // 个性化
                this.custom(type);
            });
    }

    // 过桥资金-上传付款清单
    upload() {
        XnUtils.checkLoading(this);
        const json = this.payDoSelectedDownload;
        if (json.length === 0) {
            this.xn.msgBox.open(false, '您未选中任何数据');
            this.loading.close();
            return;
        } else {
            this.loading.close();
            if (this.checkPayDoSelected(json)) {
                this.xn.router.navigate(['console/record/new'], {
                    queryParams: {
                        id: 'pay_order_upload',
                        relate: 'mainFlowId',
                        relateValue: ''
                    }
                });
                sessionStorage.setItem(
                    'relate_value',
                    JSON.stringify(json.map((c: any) => c.mainFlowId))
                );
            }
        }
    }

    checkPayDoSelected(data) {
        let s = true;
        for (let i = 0; i < data.length; i++) {
            if (data[i].moneyChannel === 1) {
                this.xn.msgBox.open(false, '所选项不能包含自有资金类型');
                s = false;
                break;
            }
        }
        return s;
    }

    // 退回操作
    backFlow(e) {
        this.xn.msgBox.open(true, '确定执行退回操作吗？', () => {
            this.xn.api
                .post(`${this.url[this.absType].backFlow}`, {
                    mainFlowId: e.mainFlowId
                })
                .subscribe(v => {
                    this.getData(this.type, 1);
                });
        });
    }
    // 退回上一步  TODO
    backPreStep() {
        const mainFlowIds: string[] = this.data
            .filter(item => item.checked)
            .map(m => m.mainFlowId);
        this.xn.loading.open();
        this.xn.api.post('/ljx/pay_manage/pay_do_back', { mainFlowIds }).subscribe(x => {
            if (x.ret === 0) {
                this.xn.loading.close();
                this.onPage({
                    page: this.pageIndex,
                    pageSize: this.pageSize
                });
            }
        });
    }
    custom(type) {
        if (type === 'pay_do') {
            this.data.forEach(a => {
                if (a.payPdf !== '') {
                    a.payPdf = JSON.parse(a.payPdf);
                }
                if (
                    this.payDoSelectedDownload.findIndex(
                        (x: any) => x.mainFlowId === a.mainFlowId
                    ) > -1
                ) {
                    a.checked = true;
                }
            });
        } else if (type === 'pay') {
            this.data.forEach(a => {
                if (a.payPdf !== '') {
                    a.payPdf = JSON.parse(a.payPdf);
                }
            });
        }

        // 整理发票号字段
        this.data.forEach(c => {
            const invoiceArr =
                c.realInvoiceNum && c.realInvoiceNum !== ''
                    ? JSON.parse(c.realInvoiceNum)
                    : [];
            c.invoiceNumLocal = invoiceArr;
            if (invoiceArr.length > 2) {
                c.invoiceNumLocal = `${invoiceArr[0]};${invoiceArr[1]}等`;
            } else if (invoiceArr.length === 1) {
                c.invoiceNumLocal = `${invoiceArr[0]}`;
            }
            if (invoiceArr.length === 2) {
                c.invoiceNumLocal = `${invoiceArr[0]};${invoiceArr[1]}`;
            }
            c.invoiceLength = invoiceArr.length;
        });
    }

    viewAllInvoice(e) {
        if (e.invoiceLength <= 2) {
            return;
        }
        XnModalUtils.openInViewContainer(
            this.xn,
            this.vcr,
            InvoiceDataViewModalComponent,
            JSON.parse(e.realInvoiceNum)
        ).subscribe(() => {
        });
    }

    onItemCheckChanged(item) {
        if (this.type === 'pay_do') {
            // 已打印待放款 “财务下载表格” 可跨页挑选
            const idx = this.payDoSelectedDownload.findIndex(
                (x: any) => x.mainFlowId === item.mainFlowId
            );
            if (item.checked === false && idx > -1) {
                // 移除
                this.payDoSelectedDownload.splice(idx, 1);
            } else if (item.checked) {
                this.payDoSelectedDownload.push(item);
            }
        }
        this.completeMoneystyle = !this.data.some((x: any) => x.checked === true);

    }

    checkAll(event) {
        this.data.forEach(x => {
            x.checked = event.target.checked;
            this.onItemCheckChanged(x);
        });
        this.completeMoneystyle = !this.data.some((x: any) => x.checked === true);
    }

    isAllChecked() {
        return this.data.length && this.data.every(item => item.checked);
    }

    // 获得应付账款金额汇总
    totalAmount() {
        const dataInfo = JSON.parse(JSON.stringify(this.data.filter(item => item.checked)));
        return dataInfo.reduce((prev, curr) => {
            return prev + (curr.receivable === '' ? 0 : curr.receivable);
        }, 0);
    }

    // 获得转让价格汇总
    transferAmount() {
        const dataInfo = JSON.parse(JSON.stringify(this.data.filter(item => item.checked)));
        return dataInfo.reduce((prev, curr) => {
            return prev + (curr.changePay === '' ? 0 : curr.changePay);
        }, 0);
    }

    // 获得笔数
    getcount() {
        return this.data.filter(item => item.checked).length;
    }

    invoild(): boolean {
        return this.data.every(x => !x.checked);
    }

    somePrint() {
        const mainFlowIds: string[] = this.data
            .filter(item => item.checked)
            .map(m => m.mainFlowId);
        XnModalUtils.openInViewContainer(
            this.xn,
            this.vcr,
            RatesDateStartModalComponent,
            mainFlowIds
        ).subscribe(v => {
            if (v.action === 'ok') {
                this.xn.api
                    .post(this.url[this.absType].print, {
                        mainFlowIds,
                        payDate: v.value
                    })
                    .subscribe(() => {
                        this.getCutPan(this.type);
                    });
            }
        });
    }

    newFlow(item) {
        this.xn.router.navigate(['console/record/new'], {
            queryParams: {
                id: 'pay_qrs6',
                relate: 'mainFlowId',
                relateValue: item.mainFlowId
            }
        });
    }

    modifyQrsFlow(item) {
        this.xn.router.navigate(['console/record/new'], {
            queryParams: {
                id: 'pay_qrs_real6',
                relate: 'mainFlowId',
                relateValue: item.mainFlowId
            }
        });
    }

    paymentFlow(item) {
        const id = item.dcType === 5 ? 'pay_pz14' : 'pay_pz6';
        this.xn.router.navigate(['console/record/new'], {
            queryParams: {
                id,
                relate: 'mainFlowId',
                relateValue: item.mainFlowId
            }
        });
    }

    cancleFlow(item) {
        const id = item.dcType === 5 ? 'pay_over14' : 'pay_over6';
        this.xn.router.navigate(['console/record/new'], {
            queryParams: {
                id,
                relate: 'mainFlowId',
                relateValue: item.mainFlowId
            }
        });
    }

    /**
     *  查看文件
     * @param item
     * @param isPDF
     */
    onView(item: any, isPDF?) {
        XnModalUtils.openInViewContainer(
            this.xn,
            this.vcr,
            FileViewModalComponent,
            item
        ).subscribe(() => {
        });
    }

    /**
     *  查看合同
     * @param id
     * @param secret
     * @param label
     */
    showContract(id: any, secret: any, label: any) {
        XnModalUtils.openInViewContainer(
            this.xn,
            this.vcr,
            PdfSignModalComponent,
            {
                id,
                secret,
                label,
                readonly: true
            }
        ).subscribe(v2 => {
            // 啥也不做
        });
    }

    // 查看交易流程
    public viewProcess(item: any) {
        this.xn.router.navigate([
            `console/main-list/detail/${item.mainFlowId}`
        ]);
    }
}
