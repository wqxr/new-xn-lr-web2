export default class CompanyDetailInfo {
    static Businesslist = {
        Tableltst: [
            {
                title: '普惠通-业务清单',
                heads: [
                    { label: '序号', value: 'mainFlowId', type: 'mainFlowId' },
                    { label: '交易ID', value: 'contractId' },
                    { label: '上游客户名称', value: 'invoiceNumInfo', type: 'invoiceNum' },
                    { label: '万科供应商名称', value: 'realInvoiceNum', type: 'invoiceNum' },
                    { label: '商票号码', value: 'invoiceAmount', type: 'money' },
                    { label: '交易金额', value: 'realInvoiceAmount', type: 'money' },
                    { label: '费率', value: 'receivable', type: 'money' },
                    { label: '交易状态', value: 'factoringEndDate' },
                    { label: '还款状态', value: 'debtUnit' },
                    { label: '保理到期日', value: 'debtUser' },
                    { label: '放款日期', value: 'debtUserMobile' },
                    { label: '还款日期', value: 'debtAccount' },
                    { label: '交易创建时间', value: 'debtBank' },
                ],
            },
            {
                title: '普惠通-协议',
                heads: [
                    { label: '序号', value: 'mainFlowId', type: 'mainFlowId' },
                    { label: '协议类型', value: 'contractId' },
                    { label: '协议', value: 'invoiceNumInfo', type: 'invoiceNum' },
                    { label: '流程', value: 'realInvoiceNum', type: 'invoiceNum' },
                    { label: '更新时间', value: 'invoiceAmount', type: 'money' },
                ],


            },
            {
                title: '普惠通-三要素变动数据',
                heads: [],

            },
            {
                title: '财报',
                heads: [
                    { label: '资产负债表', value: 'balanceFile', type: 'excel' },
                    { label: '利润表', value: 'profitFile', type: 'excel' },
                    { label: '现金流量表', value: 'cashFile', type: 'excel' },
                    { label: '流程', value: 'recordId', },
                    { label: '更新时间', value: 'createTime', type: 'date' },

                ],
            },
            {
                title: '征信报告',
                heads: [
                    { label: '征信报告', value: 'file', type: 'file' },
                    { label: '流程', value: 'recordId' },
                    { label: '更新时间', value: 'createTime', type: 'date' },
                ],
            },
            {
                title: '账号变更记录',
                heads: [
                    { label: '交易ID', value: 'mainFlowId', type: 'mainFlowId' },
                    { label: '提单收款账号', value: 'receiveAccount' },
                    { label: '收款单位账号', value: 'oldReceiveAccount' },
                    { label: '供应商收款账号变更说明文件', value: 'contracts', type: 'contract' },
                    { label: '项目公司更正函', value: 'correctFile', type: 'file' },

                ],

            }
        ]
    };
    static landedpropertylist = {
        title: '地产类 - 业务清单',
        heads: [
            { label: '序号', value: 'mainFlowId', type: 'mainFlowId' },
            { label: '交易ID', value: 'contractId' },
            { label: '申请付款单位', value: 'invoiceNumInfo', type: 'invoiceNum' },
            { label: '收款单位', value: 'realInvoiceNum', type: 'invoiceNum' },
            { label: '总部公司', value: 'invoiceAmount', type: 'money' },
            { label: '付款确认书编号', value: 'realInvoiceAmount', type: 'money' },
            { label: '交易金额', value: 'receivable', type: 'money' },
            { label: '利率', value: 'factoringEndDate' },
            { label: '交易状态', value: 'debtUnit' },
            { label: '保理融资到期日', value: 'debtUser' },
            { label: '合同类型', value: 'debtUserMobile' },
            { label: '资产池名称', value: 'debtAccount' },
            { label: '创建时间', value: 'debtBank' },

        ]

    };
    static Twovoteslist = {
        title: '两票类 - 业务清单',
        heads: [
            { label: '序号', value: 'mainFlowId', type: 'mainFlowId' },
            { label: '交易ID', value: 'contractId' },
            { label: '供应商', value: 'invoiceNumInfo', type: 'invoiceNum' },
            { label: '核心企业', value: 'realInvoiceNum', type: 'invoiceNum' },
            { label: '交易金额', value: 'invoiceAmount', type: 'money' },
            { label: '利率', value: 'realInvoiceAmount', type: 'money' },
            { label: '交易状态', value: 'receivable', type: 'money' },
            { label: '交易模式', value: 'factoringEndDate' },
            { label: '合同签署时间', value: 'debtUnit' },
            { label: '创建时间', value: 'debtUser' },
            { label: '放款时间', value: 'debtUserMobile' },

        ]

    };
    //
    static readonly customer_detail = { // 万科供应商保理业务 页面配置
        title: '客户管理',
        tabList: [
            {
                label: '普惠通', value: 'do_not',
                canSearch: true,
                canChecked: true,
                tablelist: [
                    {
                        title: CompanyDetailInfo.Businesslist.Tableltst[0].title,
                        tableone: CompanyDetailInfo.Businesslist.Tableltst[0].heads,

                    },
                    {
                        title: CompanyDetailInfo.Businesslist.Tableltst[1].title,
                        tableone: CompanyDetailInfo.Businesslist.Tableltst[1].heads
                    },
                    {
                        title: CompanyDetailInfo.Businesslist.Tableltst[2].title,
                        tableone: CompanyDetailInfo.Businesslist.Tableltst[2].heads,
                    },
                    {
                        label: 'financialReport', value: 'financialReport',
                        title: '财报数据',
                        headText: CompanyDetailInfo.Businesslist.Tableltst[3].heads,
                        get_url: '',
                        pageConfig: {
                            pageSize: 10,
                            first: 0,
                            total: 0,
                        },
                        data: [],
                    },
                    {
                        label: 'creditReport', value: 'creditReport',
                        title: '征信报告',
                        headText: CompanyDetailInfo.Businesslist.Tableltst[4].heads,
                        get_url: '',
                        pageConfig: {
                            pageSize: 10,
                            first: 0,
                            total: 0,
                        },
                        data: [],
                    },
                    {
                        label: 'accountChangeReport', value: 'accountChangeReport',
                        title: '账号变更记录',
                        headText: CompanyDetailInfo.Businesslist.Tableltst[5].heads,
                        get_url: '',
                        pageConfig: {
                            pageSize: 10,
                            first: 0,
                            total: 0,
                        },
                        data: [],
                    }
                ],
                get_url: '/custom/avenger/customer_manager/list'
            },
            {
                label: '地产类业务', value: 'do_down',
                canSearch: true,
                canChecked: false,
                tablelist: [{
                    title: CompanyDetailInfo.landedpropertylist.title,
                    tableone: CompanyDetailInfo.landedpropertylist.heads,
                }],
                get_url: 'company-landedpropertylist'
            },
            {
                label: '两票业务', value: 'do_up',
                canSearch: true,
                canChecked: false,
                tablelist: [{
                    title: CompanyDetailInfo.Twovoteslist.title,
                    tableone: CompanyDetailInfo.Twovoteslist.heads,
                }],
                get_url: 'company-Twovoteslist'
            }

        ]
    };
    static getConfig(name) {
        return this.customer_detail[name];
    }
}
