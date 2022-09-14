/*
 * Copyright(c) 2017-2019, 深圳市链融科技股份有限公司
 * Beijing Xiwei Technology Co., Ltd.
 * All rights reserved.
 *
 * @file：IndexTabConfig
 * @summary：多标签嵌套列表配置，tabList 下的subTabList的length<2 时 即没有子标签页，不显示子标签切换导航，删除请求默认参数中的的状态参数
 * @version: 1.0
 * **********************************************************************
 * revision             author            reason             date
 * 1.0                 zhyuanan             新增          2019-05-27
 * **********************************************************************
 */


export default class IndexTabConfig {
    // 交易列表 -采购融资，默认配置
    static avengerLists = {
        heads: [
            {
                label: '交易ID', value: 'mainFlowId', type: 'mainFlowId', _inList: {
                    sort: true,
                    search: true
                },
            },
            {
                label: '上游客户名称', value: 'upstreamName', _inList: {
                    sort: true,
                    search: true
                }
            },
            {
                label: '万科供应商名称', value: 'supplierName', _inList: {
                    sort: true,
                    search: true
                },
            },
            {
                label: '商票号码', value: 'honourNum', _inList: {
                    sort: true,
                    search: true
                }
            },
            {
                label: '交易金额', value: 'receive', type: 'money', _inList: {
                    sort: true,
                    search: true
                }
            },
            {
                label: '费率(%)', value: 'fee', _inList: {
                    sort: true,
                    search: true
                }
            },
            {
                label: '实收费用', value: 'realPrice', type: 'interest', _inList: {
                    sort: true,
                    search: true
                }
            },
            {
                label: '交易状态', value: 'statusName', _inList: {
                    sort: false,
                    search: true
                }
            },
            {
                label: '保理到期日', value: 'factoringEndDate', type: 'date', _inList: {
                    sort: true,
                    search: true
                },
            },
            {
                label: '放款日期', value: 'loanDate', type: 'date', _inList: {
                    sort: true,
                    search: true
                },
            },
            {
                label: '还款日期', value: 'backDate', type: 'date', _inList: {
                    sort: true,
                    search: true
                },
            },
            {
                label: '交易创建时间', value: 'createTime', type: 'date', _inList: {
                    sort: true,
                    search: true
                }
            }
        ] as ListHeadsFieldOutputModel[],
        searches: [
            { title: '交易ID', checkerId: 'mainFlowId', type: 'text', required: false, sortOrder: 1 },
            { title: '交易创建时间', checkerId: 'createTime', type: 'quantum1', required: false, sortOrder: 2 },
            { title: '上游客户名称', checkerId: 'upstreamCustomer', type: 'text', required: false, sortOrder: 5 },
            {
                title: '交易状态', checkerId: 'transactionStatus', type: 'select', options: { ref: 'avengerTransactionStatus' },
                required: false, sortOrder: 4
            },
            { title: '交易金额', checkerId: 'amount', type: 'text', required: false, sortOrder: 6 },
            { title: '万科供应商名称', checkerId: 'customerName', type: 'text', required: false, sortOrder: 3 }
        ] as CheckersOutputModel[]
    };
    // 地产类ABS
    static dcABS = {
        heads: [
            { label: '交易ID', value: 'mainFlowId', type: 'mainFlowId' },
            { label: '申请付款单位', value: 'projectCompany' },
            { label: '收款单位', value: 'debtUnit' },
            { label: '总部公司', value: 'headquarters', type: 'headquarters' },
            { label: '付款确认书编号', value: 'payConfirmId' },
            { label: '交易金额', value: 'receivable', type: 'money' },
            { label: '利率', value: 'assigneePrice' },
            { label: '交易状态', value: 'transactionStatus', type: 'xnMainFlowStatus' },
            { label: '保理融资到期日', value: 'factoringEndDate', type: 'date' },
            { label: '合同类型', value: 'contractType' },
            { label: '资产池名称', value: 'capitalPoolName' },
            { label: '创建时间', value: 'createTime', type: 'date' }
        ] as ListHeadsFieldOutputModel[],
        searches: [
            { title: '交易ID', checkerId: 'mainFlowId', type: 'text', required: false, sortOrder: 1 },
            { title: '创建时间', checkerId: 'createTime', type: 'quantum1', required: false, sortOrder: 2 },
            { title: '总部公司', checkerId: 'headquarters', type: 'text', required: false, sortOrder: 7 },
            { title: '资产池名称', checkerId: 'capitalPoolName', type: 'text', required: false, sortOrder: 4 },
            { title: '申请付款单位', checkerId: 'projectCompany', type: 'text', required: false, sortOrder: 5 },
            { title: '收款单位', checkerId: 'debtUnit', type: 'text', required: false, sortOrder: 3 },
            {
                title: '交易模式及状态',
                checkerId: 'status',
                type: 'linkage-select',
                options: { ref: 'StandardFactoringMode' },
                required: false,
                sortOrder: 6
            }
        ] as CheckersOutputModel[]
    };
    // 多标签页，A,B,C,D,E,F......
    static readonly config = {
        avenger: {
            title: '交易列表',
            tabList: [
                {
                    label: '普惠通',
                    value: 'A',
                    subTabList: [
                        {
                            label: '进行中',
                            value: 'DOING',
                            canSearch: true,
                            canChecked: false,
                            edit: {
                                rowButtons: [
                                    {
                                        label: '查看',
                                        operate: 'view',
                                        post_url: '',
                                        click: (base: CommBase, params, xn: XnService, hwModeService: HwModeService) => {
                                            hwModeService.viewProcess(params.mainFlowId, params.isProxy);
                                        }
                                    },
                                    { label: '发票详情', operate: 'invoice_detail', post_url: '' },
                                    {
                                        label: '中止',
                                        operate: 'stop',
                                        post_url: '/customer/changecompany',
                                        disabled: false,
                                        click: (base: CommBase, params, xn: XnService, hwModeService: HwModeService) => {
                                            // 拼接文件
                                            xn.router.navigate([`/console/record/avenger/new/sub_factoring_stop_540`],
                                                {
                                                    queryParams: {
                                                        id: 'sub_factoring_stop_540',
                                                        relate: 'mainFlowId',
                                                        relateValue: params.mainFlowId,
                                                    }
                                                });
                                        }
                                    },
                                ]
                            },
                            searches: IndexTabConfig.avengerLists.searches,
                            headText: IndexTabConfig.avengerLists.heads,
                        },
                        {
                            label: '待还款',
                            value: 'TODO',
                            canSearch: true,
                            canChecked: false,
                            edit: {
                                rowButtons: [
                                    {
                                        label: '查看', operate: 'view', post_url: '',
                                        click: (base: CommBase, params, xn: XnService, hwModeService: HwModeService) => {
                                            hwModeService.viewProcess(params.mainFlowId, params.isProxy);
                                        }
                                    },
                                    { label: '发票详情', operate: 'invoice_detail', post_url: '' }
                                ]
                            },
                            searches: [...IndexTabConfig.avengerLists.searches, {
                                title: '还款状态',
                                checkerId: 'payStatus',
                                type: 'select',
                                options: { ref: 'payStatus' },
                                required: false,
                                sortOrder: 7
                            }],
                            headText: arraySplice({ array: IndexTabConfig.avengerLists.heads, ele: { label: '还款状态', value: 'payStatus', type: '还款状态' }, positionKeyWord: 'factoringEndDate', position: 'before' }).filter(arr => arr.value !== 'interest')
                        },
                        {
                            label: '已还款',
                            value: 'DONE',
                            canSearch: true,
                            canChecked: false,
                            edit: {
                                rowButtons: [
                                    {
                                        label: '查看', operate: 'view', post_url: '',
                                        click: (base: CommBase, params, xn: XnService, hwModeService: HwModeService) => {
                                            hwModeService.viewProcess(params.mainFlowId, params.isProxy);
                                        }
                                    },
                                    { label: '发票详情', operate: 'invoice_detail', post_url: '' }
                                ]
                            },
                            searches: IndexTabConfig.avengerLists.searches,
                            headText: IndexTabConfig.avengerLists.heads,
                        }
                    ],
                    post_url: '/list/main/mainList'
                },
                {
                    label: '地产类业务',
                    value: 'B',
                    subTabList: [
                        {
                            label: '进行中',
                            value: 'DOING',
                            canSearch: true,
                            canChecked: true,
                            edit: {
                                rowButtons: [
                                    {
                                        label: '查看', operate: 'view', post_url: '',
                                        click: (base: CommBase, params, xn: XnService, hwModeService: HwModeService) => {
                                            hwModeService.viewProcess(params.mainFlowId, params.isProxy);
                                        }
                                    },
                                    { label: '发票详情', operate: 'invoice_detail', post_url: '' },
                                    { label: '中止', operate: 'stop', post_url: '' }
                                ]
                            },
                            searches: IndexTabConfig.dcABS.searches,
                            headText: IndexTabConfig.dcABS.heads,
                        }
                    ],
                    post_url: '/custom/vanke_v5/list/main'
                }
            ]
        } as TabConfigModel,
    };

    static getConfig(name) {
        return this.config[name];
    }
}

/***
 *  子标签页，针对采购融资交易列表，根据特定需求修改
 */
export enum SubTabEnum {
    /** 进行中 */
    DOING = '1',
    /** 待还款 */
    TODO = '2',
    /** 已完成 */
    DONE = '3',
    SPECIAL = '10',
}

export enum ApiProxyEnum {
    /** 采购融资 */
    A = 'avenger',
    /** 地产abs */
    B = 'api',
    C = 'avenger',
    /** 地产abs */
    D = 'avenger',
    E = 'avenger',
    F = 'avenger',
    G = 'avenger',
}

/***
 * 在数组特定位置插入元素
 * @param array 原数组
 * @param positionKeyWord 参考关键字
 * @param ele 插入元素
 * @param position 相对于参考元素位置 after | before
 */
function arraySplice({ array, ele, positionKeyWord, position }: { array: ListHeadsFieldOutputModel[]; ele: ListHeadsFieldOutputModel; positionKeyWord: string; position: string; }) {
    const findIndex = array.findIndex(find => find.value === positionKeyWord);
    const idx = position === 'before' ? findIndex : findIndex + 1;
    array.splice(idx, 0, ele);
    return array;
}
