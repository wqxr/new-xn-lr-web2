import { ListHeadsFieldOutputModel, SubTabListOutputModel, TabListOutputModel } from 'libs/shared/src/lib/config/list-config-model';
import { CheckersOutputModel } from 'libs/shared/src/lib/config/checkers';

// 供应商待提现列表
export default class DrawListConfig {
    // 列表表头,搜索项配置
    static supplierDrawlist = {
        heads: [
            {
                label: '交易ID', value: 'mainFlowId', type: 'mainFlowId', _inList: {
                    sort: true,
                    search: true
                },
            },
            {
                label: '提单日期', value: 'tradeDate', type: 'date', _inList: {
                    sort: true,
                    search: true
                },
            },
            {
                label: '渠道', value: 'productType', type: 'productType', _inList: {
                    sort: false,
                    search: true
                },
            },
            {
                label: '交易状态', value: 'tradeStatus', type: 'tradeStatus', _inList: {
                    sort: false,
                    search: true
                },
            },
            {
                label: '总部公司', value: 'headquarters', _inList: {
                    sort: false,
                    search: true
                },
            },
            {
                label: '申请付款单位', value: 'projectCompany', _inList: {
                    sort: false,
                    search: true
                },
            },
            {
                label: '收款单位', value: 'debtUnit', type: 'text', _inList: {
                    sort: false,
                    search: true
                },
            },
            {
                label: '应收账款金额', value: 'receive', type: 'receive', _inList: {
                    sort: true,
                    search: true
                },
            },
            {
                label: '融资利率', value: 'discountRate', type: 'discountRate', _inList: {
                    sort: true,
                    search: true
                },
            },
            {
                label: '服务费率', value: 'serviceRate', type: 'discountRate', _inList: {
                    sort: true,
                    search: true
                },
            },
            {
                label: '转让价款', value: 'changePrice', type: 'receive', _inList: {
                    sort: true,
                    search: true
                },
            },
            {
                label: '市场部对接人', value: 'marketName', type: 'text', _inList: {
                    sort: false,
                    search: true
                },
            },
            {
                label: '运营部对接人', value: 'operatorName', type: 'text', _inList: {
                    sort: false,
                    search: true
                },
            },
            { label: '协助处理人', value: 'helpUserName', type: 'helpUserName' },
            {
                label: '发票', value: 'invoiceNum', type: 'invoiceNum', _inList: {
                    sort: false,
                    search: true
                }
            },
        ] as ListHeadsFieldOutputModel[],
        searches: [
            { title: '交易id', checkerId: 'mainFlowId', type: 'text', required: false, sortOrder: 1 },
            { title: '提单日期', checkerId: 'tradeDate', type: 'quantum1', required: false, sortOrder: 2 },
            // { title: '渠道', checkerId: 'productType', type: 'linkage-select', options: {
            //     ref: 'productType_sh' }, required: false, sortOrder: 4
            // },
            { title: '交易状态', checkerId: 'tradeStatus', type: 'select', options: {
                ref: 'tradeStatus_sh' },  sortOrder: 5
            },
            { title: '总部公司', checkerId: 'headquarters', type: 'text', required: false, sortOrder: 6 },
            { title: '申请付款单位', checkerId: 'projectCompany', type: 'text', required: false, sortOrder: 7 },
            { title: '收款单位', checkerId: 'debtUnit', type: 'text', required: false, sortOrder: 8 },
            { title: '应收账款金额', checkerId: 'receive', type: 'text', required: false, sortOrder: 9 },
            { title: '融资利率', checkerId: 'discountRate', type: 'text', required: false, sortOrder: 10 },
            { title: '服务费率', checkerId: 'serviceRate', type: 'text', required: false, sortOrder: 11 },
            { title: '转让价款', checkerId: 'changePrice', type: 'text', required: false, sortOrder: 12 },
            { title: '保理融资到期日', checkerId: 'factoringEndDate', type: 'quantum1', sortOrder: 14 },
            { title: '运营部对接人', checkerId: 'operatorName', type: 'text', required: false, sortOrder: 16 },
            { title: '市场部对接人', checkerId: 'marketName', type: 'text', required: false, sortOrder: 17 },
            { title: '协助处理人', checkerId: 'helpUserName', type: 'text', required: false, sortOrder: 18 },
        ] as CheckersOutputModel[]
    };

    static readonly config = {
        drawlist: {
            title: '待提现列表',
            value: 'drawlist',
            tabList: [
                {
                    label: '待提现列表',
                    value: 'A',
                    subTabList: [
                        {
                            label: '未上传',
                            value: 'DOING',
                            canSearch: true,
                            canChecked: true,
                            edit: {
                                leftheadButtons: [
                                    { label: '自定义筛选条件', operate: 'custom_search', post_url: '/', disabled: false, showButton: true, },
                                    { label: '自定义页面字段', operate: 'custom_field', post_url: '/', disabled: false, showButton: true, },
                                ],
                                rowButtons: [
                                    { label: '提现', operate: 'drawing', post_url: '' }
                                ]
                            },
                            params: 3,
                            searchNumber: 63,
                            headNumber: 64,
                            headText: [
                                ...DrawListConfig.supplierDrawlist.heads,
                                { label: '起息日', value: 'valueDate', type: 'date', _inList: { sort: true, search: true }, },
                                { label: '付款确认书编号', value: 'payConfirmId', type: 'text', _inList: { sort: true, search: true }, },
                                { label: '付款确认书文件', value: 'pdfProjectFiles', type: 'file', _inList: { sort: false, search: true }, },
                                { label: '保理融资到期日', value: 'factoringEndDate', type: 'date', _inList: { sort: true, search: true }, },
                                { label: '融资天数', value: 'financingDays', type: 'text', _inList: { sort: false, search: true }, },
                            ],
                            searches: [
                                ...DrawListConfig.supplierDrawlist.searches,
                                { title: '起息日', checkerId: 'valueDate', type: 'quantum1', required: false, sortOrder: 3 },
                                { title: '付款确认书编号', checkerId: 'payConfirmId', type: 'text', required: false, sortOrder: 13 },
                                { title: '融资天数', checkerId: 'financingDays', type: 'text', sortOrder: 15 },
                                { title: '是否需要后补资料', checkerId: 'isBackUp', type: 'select', options: {
                                    ref: 'isBackFile' }, required: false, sortOrder: 19
                                },
                            ],
                        },
                    ] as SubTabListOutputModel[],
                    post_url: '/sh_trade/list'
                },
            ] as TabListOutputModel[]
        }
    };

    static getConfig(name) {
        return this.config[name];
    }
}
