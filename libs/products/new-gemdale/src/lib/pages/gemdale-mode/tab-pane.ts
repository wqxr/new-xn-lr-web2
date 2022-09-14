/*
 * Copyright(c) 2017-2019, 深圳市链融科技股份有限公司
 * Beijing Xiwei Technology Co., Ltd.
 * All rights reserved.
 *
 * @file：TabConfig
 * @summary：项目公司确认应收账款金额、总部公司签署付款确认书、项目公司回执签署页面配置文件
 * @version: 1.0
 * **********************************************************************
 * revision             author            reason             date
 * 1.0                hucongying        金地数据对接       2020-12-18
 * **********************************************************************
 */
export default class TabConfig {
    // 确认应收账款金额
    static receivable = {
        heads: [
            { label: '交易ID', value: 'mainFlowId', type: 'mainFlowId' },
            { label: '基础交易合同编号', value: 'contractId' },
            { label: '提单发票号码', value: 'preInvoiceNum', type: 'invoiceNum' },
            { label: '实际上传发票号码', value: 'invoiceNum', type: 'invoiceNum' },
            { label: '提单发票总金额', value: 'preInvoiceAmount', type: 'money' },
            { label: '实际上传交易发票总金额', value: 'invoiceAmount', type: 'money' },
            { label: '应收账款金额', value: 'receive', type: 'money' },
            { label: '应收账款到期日', value: 'factoringEndDate', type: 'date' },
            { label: '债权单位名称', value: 'debtUnit' },
            { label: '债权单位联系人', value: 'linkMan' },
            { label: '债权单位联系人手机号', value: 'linkPhone' },
            { label: '债权单位银行账户', value: 'debtUnitAccount' },
            { label: '债权单位银行开户行', value: 'debtUnitBank' },
            { label: '债务单位名称', value: 'projectCompany' },
            { label: '渠道', value: 'productType', type: 'productType' }
        ],
        searches: [
            {
                title: '债权单位名称',
                checkerId: 'debtUnit',
                type: 'text',
                required: false,
                number: 1
            },
            {
                title: '应收账款金额',
                checkerId: 'receive',
                type: 'text',
                required: false,
                number: 2
            },
            {
                title: '渠道',
                checkerId: 'productType',
                type: 'linkage-select',
                options: { ref: 'productType_new_jd' },
                required: false,
                number: 3
            },
        ],
    };
    // 集团公司签署付款确认书 
    static paymentList = {
        heads: [
            { label: '交易ID', value: 'mainFlowId', type: 'mainFlowId' },
            { label: '基础交易合同编号', value: 'contractId' },
            { label: '提单发票号码', value: 'preInvoiceNum', type: 'invoiceNum' },
            { label: '实际上传发票号码', value: 'invoiceNum', type: 'invoiceNum' },
            { label: '提单发票总金额', value: 'preInvoiceAmount', type: 'money' },
            { label: '实际上传交易发票总金额', value: 'invoiceAmount', type: 'money' },
            { label: '应收账款金额', value: 'receive', type: 'money' },
            { label: '应收账款到期日', value: 'factoringEndDate', type: 'date' },
            { label: '债权单位名称', value: 'debtUnit' },
            { label: '债权单位联系人', value: 'linkMan' },
            { label: '债权单位联系人手机号', value: 'linkPhone' },
            { label: '债权单位银行账户', value: 'debtUnitAccount' },
            { label: '债权单位银行开户行', value: 'debtUnitBank' },
            { label: '债务单位名称', value: 'projectCompany' },
            { label: '付款确认书', value: 'pdfProjectFiles', type: 'contract' },
            { label: '资产池名称', value: 'capitalPoolName' },
            { label: '渠道', value: 'productType', type: 'productType' }
        ],
        searches: [
            {
                title: '债权单位名称',
                checkerId: 'debtUnit',
                type: 'text',
                required: false,
                number: 1
            },
            {
                title: '应收账款金额',
                checkerId: 'receive',
                type: 'text',
                required: false,
                number: 2
            },
            {
                title: '渠道',
                checkerId: 'productType',
                type: 'linkage-select',
                options: { ref: 'productType_new_jd' },
                required: false,
                number: 3
            },
            {
                title: '资产池名称',
                checkerId: 'capitalPoolName',
                type: 'text',
                required: false,
                number: 4
            },
        ],
    };
    // 回执签署
    static receiptList = {
        heads: [
            { label: '交易ID', value: 'mainFlowId', type: 'mainFlowId' },
            { label: '收款单位', value: 'debtUnit' },
            { label: '保理商', value: 'factoringOrgName' },
            { label: '申请付款单位', value: 'projectCompany' },
            { label: '总部公司', value: 'headquarters', },
            { label: '付款确认书编号', value: 'payConfirmId' },
            { label: '交易金额', value: 'receive', type: 'money' },
            { label: '利率', value: 'discountRate' },
            { label: '交易状态', value: 'flowId', type: 'newGemdaleTradeStatus' },
            { label: '交易模式', value: 'isProxy', type: 'proxyType' },
            { label: '资金渠道', value: 'channelType', type: 'moneyChannel' },
            { label: '合同签署时间', value: 'receiptSignTime', type: 'date' },
            { label: '创建时间', value: 'createTime', type: 'date' },
            { label: '放款时间', value: 'realLoanDate', type: 'date' },
            { label: '《致总部公司通知书》', value: 'toHeadquartersNotice', type: 'contract' },
            { label: '《致项目公司通知书》', value: 'toProjectNotice', type: 'contract' },
            { label: '《项目公司回执》', value: 'projectReceipt', type: 'contract' },
            { label: '资产池名称', value: 'capitalPoolName' },
            { label: '渠道', value: 'productType', type: 'productType' }
        ],
        searches: [
            {
                title: '资产池名称',
                checkerId: 'capitalPoolName',
                type: 'text',
                required: false,
                number: 1
            },
        ],
    };
    static readonly config = {
        // 确认应收账款金额
        receivable: {
            title: '确认应收账款金额',
            tabList: [
                {
                    label: '未确认应收账款金额',
                    value: 'do_not',
                    canSearch: true,
                    canChecked: true,
                    edit: {
                        headButtons: [
                            {
                                label: '确认应收账款金额',
                                operate: 'confirm_receivable',
                                value: '/custom/jindi_v3/project/check_project_flag',
                                disabled: true
                            }
                        ],
                        rowButtons: []
                    },
                    searches: TabConfig.receivable.searches,
                    headText: TabConfig.receivable.heads,
                    get_url: '/sub_system/jd_system/confirm_receivable_list',
                    isConfirm: 0, // 是否已确认 0=未确认 1=已确认
                    headConfirmStatus: undefined // 是否已签署付确 1=待签署 2=已签署
                },
                {
                    label: '已确认应收账款金额',
                    value: 'do_down',
                    canSearch: true,
                    canChecked: false,
                    searches: TabConfig.receivable.searches,
                    headText: TabConfig.receivable.heads,
                    get_url: '/sub_system/jd_system/confirm_receivable_list',
                    isConfirm: 1, // 是否已确认 0=未确认 1=已确认
                    headConfirmStatus: undefined // 是否已签署付确 1=待签署 2=已签署
                }
            ]
        },
        // 确认付款清单
        paymentList: {
            title: '确认付款清单',
            tabList: [
                {
                    label: '未签署付款确认书列表', value: 'do_not',
                    canSearch: true,
                    canChecked: true,
                    edit: {
                        headButtons: [
                            {
                                label: '签署付款确认书',
                                operate: 'sign_headquarters',
                                headquarters_sign: '/sub_system/jd_system/headquarters_sign', // 获取签署付款确认书
                                disabled: true,
                                update_qrs_contract: '/sub_system/jd_system/update_qrs_contract' // 回传付款确认书
                            }
                        ],
                        rowButtons: []
                    },
                    searches: TabConfig.paymentList.searches,
                    headText: TabConfig.paymentList.heads,
                    get_url: '/sub_system/jd_system/confirm_receivable_list',
                    isConfirm: undefined, // 是否已确认 0=未确认 1=已确认
                    headConfirmStatus: 1 // 是否已签署付确 1=待签署 2=已签署
                },
                {
                    label: '已签署付款确认书列表', value: 'do_down',
                    canChecked: false,
                    canSearch: true,
                    edit: {
                        headButtons: [],
                    },
                    searches: TabConfig.paymentList.searches,
                    headText: TabConfig.paymentList.heads,
                    get_url: '/sub_system/jd_system/confirm_receivable_list',
                    isConfirm: undefined, // 是否已确认 0=未确认 1=已确认
                    headConfirmStatus: 2 // 是否已签署付确 1=待签署 2=已签署
                }
            ]
        },
        headquartersSign: {
            title: '金地总部签署付款确认书',
            tabList: [
                {
                    label: '未签署付款确认书列表', value: 'do_not',
                    canSearch: true,
                    canChecked: true,
                    edit: {
                        headButtons: [],
                        rowButtons: []
                    },
                    searches: TabConfig.paymentList.searches,
                    headText: TabConfig.paymentList.heads.slice(0, -1),
                    get_url: '',
                }
            ]
        },
        // 应收账款转让回执列表
        receiptList: {
            title: '应收账款转让回执列表',
            tabList: [
                {
                    label: '未签署',
                    value: 'do_not',
                    canSearch: true,
                    canChecked: true,
                    edit: {
                        headButtons: [
                            {
                                label: '签署应收账款转让回执',
                                operate: 'sign_receipt',
                                value: '/custom/jindi_v3/project/check_project_flag',
                                disabled: true
                            }
                        ],
                        rowButtons: [
                            {
                                label: '查看',
                                operate: 'view_detail',
                                value: '/custom/jindi_v3/project/check_project_flag',
                                disabled: true
                            }
                        ]
                    },
                    searches: TabConfig.receiptList.searches,
                    headText: TabConfig.receiptList.heads,
                    get_url: '/sub_system/jd_system/project_receipt_list',
                    isSign: 0, // 是否签署 0=未签署 1=已签署
                    isConfirm: undefined, // 是否已确认 0=未确认 1=已确认
                    headConfirmStatus: undefined // 是否已签署付确 1=待签署 2=已签署
                },
                {
                    label: '已签署',
                    value: 'do_down',
                    canSearch: true,
                    canChecked: false,
                    edit: {
                        headButtons: [],
                        rowButtons: [
                            {
                                label: '查看',
                                operate: 'view_detail',
                                value: '/custom/jindi_v3/project/check_project_flag',
                                disabled: true
                            }
                        ]
                    },
                    searches: TabConfig.receiptList.searches,
                    headText: TabConfig.receiptList.heads,
                    get_url: '/sub_system/jd_system/project_receipt_list',
                    isSign: 1, // 是否签署 0=未签署 1=已签署
                    isConfirm: undefined, // 是否已确认 0=未确认 1=已确认
                    headConfirmStatus: undefined // 是否已签署付确 1=待签署 2=已签署
                }
            ]
        },
    };

    static get(name: string) {
        return this.config[name];
    }
}
