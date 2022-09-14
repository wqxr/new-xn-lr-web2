import { XnService } from 'libs/shared/src/lib/services/xn.service';

export default class GuarantearningFormtab {
    static assetsliabilities = { // 保后管理主界面页面配置
        heads: [
            { label: '货币资金', value: 'F019_THS013', type: 'mainFlowId' },
            { label: '应收票据', value: 'F021_THS013', },
            { label: '应收账款', value: 'F022_THS013', type: 'invoiceNum' },
            { label: '其他应收账款', value: 'F026_THS013', type: 'invoiceNum', },
            { label: '存货', value: 'F027_THS013', type: 'money', },
            { label: '固定资产', value: 'F038_THS013', type: 'money', },
            { label: '资产总计', value: 'F080_THS013', type: 'money', },
            { label: '资产负债率', value: 'realInvoiceAmount', type: 'money', value1: '' },
        ],
        searches: [
        ],
    };
    static assetsliabilitiesone = { // 平台资料初审-经办页面发票
        heads: [
            { label: '短期借款', value: 'F081_THS013', },
            { label: '应付票据', value: 'F083_THS013', },
            { label: '应付账款', value: 'F084_THS013', },
            { label: '其他应付款', value: 'F090_THS013', type: 'date', },
            { label: '长期借款', value: 'F096_THS013', type: 'money', },
            { label: '负债合计', value: 'F129_THS013', },
            { label: '实收资本', value: 'F130_THS013', },
            { label: '资本公积', value: 'F131_THS013', },
            { label: '盈余公积', value: 'F134_THS013', type: 'date' },
            { label: '未分配利润', value: 'F137_THS013', type: 'money' },
            { label: '所有者权益合计', value: 'F143_THS013', type: 'money', },

        ],

    };
    static profit = {
        heads: [
            { label: '营业收入', value: 'F003_THS014' },
            { label: '营业成本', value: 'F004_THS014' },
            { label: '营业利润', value: 'F020_THS014' },
            { label: '利润总额', value: 'F038_THS014', type: 'date' },
            { label: '净利润', value: 'F061_THS014', type: 'money' },
            { label: '营业利润率', value: 'F0065_THS014' },
        ]

    };
    static cash = { // 平台资料初审经办页面 采购合同
        heads: [
            { label: '经营活动现金流量净额', value: 'F047_THS015' },
            { label: '投资活动现金流量净额', value: 'F062_THS015' },
            { label: '筹资活动现金流量净额', value: 'F076_THS015' },
        ],
        searches: []
    };
    static tableFormlist = {
        title: 'table',
        tabList: [
            {
                label: 'assetsliabilities', value: 'assetsliabilities',
                headText: GuarantearningFormtab.assetsliabilities.heads,
                get_url: '',
                pageConfig: {
                    pageSize: 10,
                    first: 0,
                    total: 0,
                },
                data: [],
            },
            {
                label: 'assetsliabilitiesone', value: 'assetsliabilitiesone',
                headText: GuarantearningFormtab.assetsliabilitiesone.heads,
                get_url: '',
                pageConfig: {
                    pageSize: 10,
                    first: 0,
                    total: 0,
                },
                data: [],
            },
            {
                label: 'profit', value: 'profit',
                headText: GuarantearningFormtab.profit.heads,
                get_url: '',
                pageConfig: {
                    pageSize: 10,
                    first: 0,
                    total: 0,
                },
                data: [],
            },
            {
                label: 'cash', value: 'cash',
                headText: GuarantearningFormtab.cash.heads,
                get_url: '',
                pageConfig: {
                    pageSize: 5,
                    first: 0,
                    total: 0,
                },
                data: [],
            },
        ]
    };
    static readonly add = {
        can: (xn: XnService) => {
            return false;
        },
    };
}
