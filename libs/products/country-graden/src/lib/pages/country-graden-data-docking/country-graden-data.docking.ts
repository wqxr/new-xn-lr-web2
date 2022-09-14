import { ListHeadsFieldOutputModel, SubTabListOutputModel, TabListOutputModel } from 'libs/shared/src/lib/config/list-config-model';
import { CheckersOutputModel } from 'libs/shared/src/lib/config/checkers';


// 标准保理 -碧桂园接口数据列表
export default class CountryGradendataDockingConfig {
    // 地产类ABS
    static dataLockinglist = {
        heads: [
            { label: '注册地址省份', value: 'province', type: 'text' },
            { label: '注册地址城市', value: 'city', type: 'text' },
            {
                label: '唯一标识 UUID', value: 'bgyPaymentUuid', type: 'text',
            },
            {
                label: '付款单号', value: 'bgyPaymentNo', _inList: {
                    sort: true,
                    search: true
                },
            },
            { label: '供应商名称', value: 'bgySupplier', },
            { label: '供应商开户行', value: 'bgySupplierBank' },
            { label: '供应商账号', value: 'bgySupplierAccount' },
            { label: '区域', value: 'bgyArea' },
            { label: '合同名称', value: 'bgyContractName' },
            { label: '合同编号', value: 'bgyContractNo' },
            { label: '运营部对接人', value: 'operatorName', type: 'text' },
            { label: '供应商是否注册', value: 'isRegisterSupplier', type: 'isInit' }, // 0=未注册 1=已注册
            {
                label: '预录入发票金额', value: 'sumInvoiceAmount', type: 'money', _inList: {
                    sort: true,
                    search: true
                }
            },
            { label: '预录入发票号', value: 'numberList', type: 'invoiceNum' },
            { label: '附件', value: 'extList', type: 'extList' },
            {
                label: '付款金额(融资金额)', value: 'bgyPayAmount', type: 'money', _inList: {
                    sort: true,
                    search: true
                }
            },
            { label: '法人公司名称', value: 'bgybutxt' },
            { label: '法人公司编码', value: 'bgybukrs' },
            { label: '项目公司名称', value: 'bgyItemName' },
            { label: '项目公司编码', value: 'bgyItemCode' },
            { label: '收方户名', value: 'bgySupplierAccountName' },
            { label: '时间戳', value: 'lasttime', type: 'datetime' },
            {
                label: '打包时间', value: 'reserve2', type: 'datetime', _inList: {
                    sort: true,
                    search: true
                },
            },
            { label: '项目公司社会信用码', value: 'reserve5' },
            { label: '供应商社会信用码', value: 'reserve6' },
            { label: '融资币种', value: 'reserve7' },
            { label: '融资类型', value: 'reserve8' }, // 例如：ABN、ABS
            {
                label: '付款单实际期限（天）', value: 'reserve12', _inList: {
                    sort: true,
                    search: true
                },
            },
            { label: '融资申请期数', value: 'reserve13' },
            { label: '融资申请单号', value: 'reserve14' },
            { label: '融资申请申请人', value: 'reserve15' },
            {
                label: '融资利率', value: 'reserve17', type: 'rate', _inList: {
                    sort: true,
                    search: true
                },
            },
            { label: '牵头券商', value: 'reserve19' },
            { label: '校验状态', value: 'verifyStatus', type: 'verifyStatus' }, // 1=校验成功 2=校验失败
            { label: '校验失败类型', value: 'verifyArr', type: 'verifyArr' },
        ] as ListHeadsFieldOutputModel[],
        searches: [
            { title: '注册地址省份', checkerId: 'province', type: 'text' },
            { title: '注册地址城市', checkerId: 'city', type: 'text' },
            { title: '唯一标识 UUID', checkerId: 'bgyPaymentUuid', type: 'text', },
            { title: '付款单号', checkerId: 'bgyPaymentNo', type: 'text' },
            { title: '供应商名称', checkerId: 'bgySupplier', type: 'text' },
            { title: '供应商开户行', checkerId: 'bgySupplierBank', type: 'text' },
            { title: '供应商账号', checkerId: 'bgySupplierAccount', type: 'text' },
            { title: '区域', checkerId: 'bgyArea', type: 'text' },
            { title: '合同名称', checkerId: 'bgyContractName', type: 'text' },
            { title: '合同编号', checkerId: 'bgyContractNo', type: 'text' },
            { title: '运营部对接人', checkerId: 'operatorName', type: 'text' },
            { title: '付款金额(融资金额)', checkerId: 'bgyPayAmount', type: 'text', },
            { title: '法人公司名称', checkerId: 'bgybutxt', type: 'text' },
            { title: '法人公司编码', checkerId: 'bgybukrs', type: 'text' },
            { title: '项目公司名称', checkerId: 'bgyItemName', type: 'text' },
            { title: '项目公司编码', checkerId: 'bgyItemCode', type: 'text' },
            { title: '收方户名', checkerId: 'bgySupplierAccountName', type: 'text' },
            { title: '打包时间', checkerId: 'reserve2', type: 'quantum2' },
            { title: '项目公司社会信用码', checkerId: 'reserve5', type: 'text' },
            { title: '供应商社会信用码', checkerId: 'reserve6', type: 'text' },
            { title: '融资币种', checkerId: 'reserve7', type: 'text' },
            { title: '融资类型', checkerId: 'reserve8', type: 'text' }, // 例如：ABN、ABS
            { title: '付款单实际期限（天）', checkerId: 'reserve12', type: 'text' },
            { title: '融资申请期数', checkerId: 'reserve13', type: 'text' },
            { title: '融资申请单号', checkerId: 'reserve14', type: 'text' },
            { title: '融资申请申请人', checkerId: 'reserve15', type: 'text' },
            { title: '融资利率', checkerId: 'reserve17', type: 'text' },
            { title: '牵头券商', checkerId: 'reserve19', type: 'text' },
            { title: '校验状态', checkerId: 'verifyStatus', type: 'select', options: { ref: 'BgyVerifyStatus' }, }, // 1=校验成功 2=校验失败

        ] as CheckersOutputModel[]
    };
    static readonly config = {
        dataDockingList: {
            title: '接口数据列表-碧桂园',
            value: 'dataDockingList',
            tabList: [
                {
                    label: '当前数据列表',
                    value: 'A',
                    subTabList: [
                        {
                            label: '未上传',
                            value: 'DOING',
                            canSearch: true,
                            canChecked: true,
                            edit: {
                                leftheadButtons: [
                                    {
                                        label: '自定义筛选条件',
                                        operate: 'custom_search',
                                        post_url: '/',
                                        disabled: false,
                                        showButton: true,
                                    },
                                    {
                                        label: '自定义页面字段',
                                        operate: 'custom_field',
                                        post_url: '/',
                                        disabled: false,
                                        showButton: true,
                                    },
                                ],
                                rightheadButtons: [
                                    {
                                        label: '发起提单',
                                        operate: 'vanke_financing_pre',
                                        post_url: '/',
                                        disabled: false,
                                        showButton: true,
                                    },
                                    {
                                        label: '发起审核失败',
                                        operate: 'vaild_fail',
                                        post_url: '/',
                                        disabled: false,
                                        showButton: true,
                                    },
                                ],
                            },
                            searches: [...CountryGradendataDockingConfig.dataLockinglist.searches],
                            params: 0,
                            searchNumber: 11,
                            headNumber: 10,
                            headText: [...CountryGradendataDockingConfig.dataLockinglist.heads],
                        },
                    ],
                    post_url: '/sub_system/bgy_system/bgy_financing_list'
                },
                {
                    label: '所有数据列表',
                    value: 'C',
                    subTabList: [
                        {
                            label: '未上传',
                            value: 'DOING',
                            canSearch: true,
                            canChecked: true,
                            edit: {
                                leftheadButtons: [
                                    {
                                        label: '自定义筛选条件',
                                        operate: 'custom_search',
                                        post_url: '/',
                                        disabled: false,
                                        showButton: true,
                                    },
                                    {
                                        label: '自定义页面字段',
                                        operate: 'custom_field',
                                        post_url: '/',
                                        disabled: false,
                                        showButton: true,
                                    },
                                ],
                                rightheadButtons: [],
                            },
                            searches: [
                                ...CountryGradendataDockingConfig.dataLockinglist.searches,
                                { title: '是否发起提单', checkerId: 'isSponsor', type: 'select', options: { ref: 'defaultRadio' } }, // 0=未发起 1=已发起
                                {
                                    title: '交易状态',
                                    checkerId: 'transactionStatus',
                                    type: 'select',
                                    options: { ref: 'countryGradenTradeStatus' },
                                    required: false,
                                    sortOrder: 2
                                },
                                { title: '交易id', checkerId: 'mainFlowId', type: 'text', sortOrder: 1 },
                            ],
                            params: 1,
                            searchNumber: 12,
                            headNumber: 11,
                            headText: [
                                {
                                    label: '交易id', value: 'mainFlowId', type: 'mainFlowId', _inList: {
                                        sort: true,
                                        search: true
                                    },
                                },
                                {
                                    label: '交易状态', value: 'flowId', type: 'countryGradenTradeStatus'
                                },
                                { label: '是否发起提单', value: 'isSponsor', type: 'text1' }, // 0=未发起 1=已发起
                                ...CountryGradendataDockingConfig.dataLockinglist.heads],
                        },
                    ],
                    post_url: '/sub_system/bgy_system/bgy_financing_list'
                },
            ] as TabListOutputModel[]
        }
    };
    static getConfig(name) {
        return this.config[name];
    }
}
