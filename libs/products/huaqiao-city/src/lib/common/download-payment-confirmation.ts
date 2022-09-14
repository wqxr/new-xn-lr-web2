import { ListHeadsFieldOutputModel, TabConfigModel } from 'libs/shared/src/lib/config/list-config-model';
import { CheckersOutputModel } from 'libs/shared/src/lib/config/checkers';

/*
 * Copyright(c) 2017-2019, 深圳市链融科技股份有限公司
 * Beijing Xiwei Technology Co., Ltd.
 * All rights reserved.
 *
 * @file：IndexTabConfig
 * @summary：
 * @version: 1.0
 * **********************************************************************
 * revision             author            reason             date
 * 1.0                 wq                 上传付款确认书列表        2019-09-19
 * **********************************************************************
 */


/***
 * 自定义表头和搜索项传参
 */
export enum DowloadTableCus {
    /** 万科下载付确已下载自定义字段 */
    successColumn = 11,
    /**万科下载付确已下载自定义筛选条件 */
    successSearch = 12,
    /**万科下载付确未下载自定义字段 */
    failColumn = 13,
    /**万科下载付确未下载自定义筛选条件 */
    failSearch = 14,
}
export default class DragonpaymentDownloadTabConfig {
    // 下载付确列表，默认配置
    static dragonDownLoadLists = {
        heads: [
            { label: '交易ID', value: 'mainFlowId', type: 'mainFlowId', _inList: {sort: true, search: true}},
            { label: '申请付款单位', value: 'applyCompanyName', },
            { label: '申请付款单位归属城市', value: 'cityCompany', },
            { label: '收款单位', value: 'contractSupplier', },
            { label: '收款单位户名', value: 'supplierName', },
            { label: '收款单位开户行', value: 'payeeBankName' },
            { label: '收款单位账号', value: 'payeeAccountName' },
            { label: '合同编号', value: 'contractNumber', },
            { label: '应收账款金额', value: 'financingAmount', type: 'receive', _inList: {sort: true, search: true} },
            { label: '应收账款受让方', value: 'capitalName',  },
            { label: '保理融资到期日', value: 'expiredDate', type: 'date', _inList: {sort: true, search: true} },
            { label: '付款确认书编号', value: 'transNumber', type: 'file', _inList: {sort: true, search: true} },
            { label: '托管行', value: 'bankName', },
            { label: '项目名称', value: 'curProject', },
            { label: '融资单唯一标志码', value: 'uuid', _inList: {sort: true, search: true}},
            { label: '预录入发票号码', value: 'numberList', type: 'invoiceNum',  },
            { label: '预录入发票金额', value: 'preInvoiceAmount', type: 'money', },
            { label: '核心企业内部区域', value: 'area', },
            { label: '运营部对接人', value: 'operatorName',  },
            { label: '市场部对接人', value: 'marketName',  },
            { label: '资产转让折扣率', value: 'discountRate', type: 'discountRate',   },
            { label: '系统校验结果', value: 'verifyStatus', type: 'verifyStatus'},
            { label: '是否已提单', value: 'isSponsor', type: 'isSponsor', },
            { label: '作废状态', value: 'scfStatus', type: 'scfStatus' },
            { label: '收款单位是否注册', value: 'isRegisterSupplier', type: 'isRegisterSupplier'},
            { label: '交易状态', value: 'flowId', type: 'currentStep'},
            { label: '渠道', value: 'financingType', type: 'financingType'},
            { label: '付确签章状态', value: 'signStatus', type: 'signStatus'},
            { label: '付款确认书校验结果', value: 'verifyPayConfimStatus', type: 'verifyPayConfimStatus' },
            { label: '一线单据编号', value: 'billNumber', _inList: {sort: true, search: true}},
        ] as ListHeadsFieldOutputModel[],
        searches: [
            { title: '交易ID', checkerId: 'mainFlowId', type: 'text', required: false, sortOrder: 1},
            { title: '申请付款单位', checkerId: 'applyCompanyName', type: 'text', required: false, sortOrder: 2 },
            { title: '申请付款单位归属城市', checkerId: 'cityCompany', type: 'text', required: false, sortOrder: 3 },
            { title: '收款单位', checkerId: 'contractSupplier', type: 'text', required: false, sortOrder: 4 },
            { title: '收款单位开户行', checkerId: 'payeeBankName', type: 'text', required: false, sortOrder: 5 },
            { title: '收款单位账号', checkerId: 'payeeAccountName', type: 'text', required: false, sortOrder: 6 },
            { title: '合同编号', checkerId: 'contractNumber', type: 'text', required: false, sortOrder: 7 },
            { title: '应收账款金额', checkerId: 'financingAmount', type: 'text', required: false, sortOrder: 8 },
            { title: '应收账款受让方', checkerId: 'capitalName', type: 'text', required: false, sortOrder: 9 },
            { title: '保理融资到期日', checkerId: 'expiredDate', type: 'quantum1', required: false, sortOrder: 10 },
            { title: '付款确认书编号', checkerId: 'transNumber', type: 'text', required: false, sortOrder: 11 },
            { title: '托管行', checkerId: 'bankName', type: 'text', required: false, sortOrder: 12 },
            { title: '项目名称', checkerId: 'curProject', type: 'text', required: false, sortOrder: 13 },
            { title: '融资单唯一标志码', checkerId: 'uuid', type: 'text', required: false, sortOrder: 14 }, //
            { title: '预录入发票号码', checkerId: 'numberList', type: 'text', required: false, sortOrder: 15 }, //
            { title: '预录入发票金额', checkerId: 'preInvoiceAmount', type: 'text', required: false, sortOrder: 16 }, //
            { title: '核心企业内部区域', checkerId: 'area', type: 'text', required: false, sortOrder: 17 },
            { title: '运营部对接人', checkerId: 'operatorName', type: 'text', required: false, sortOrder: 18 }, //
            { title: '市场部对接人', checkerId: 'marketName', type: 'text', required: false, sortOrder: 19 }, //
            { title: '资产转让折扣率', checkerId: 'discountRate', type: 'select', options: { ref: 'accountReceipts'}, required: false, base: 'number', sortOrder: 20 }, //
            { title: '系统校验结果', checkerId: 'verifyStatus', type: 'select', options: { ref: 'verifyStatus'}, required: false, base: 'number', sortOrder: 21 },
            { title: '是否已提单', checkerId: 'isSponsor', type: 'select', options: { ref: 'defaultRadio'}, required: false, base: 'number', sortOrder: 22},
            { title: '作废状态', checkerId: 'scfStatus', type: 'select', options: { ref: 'scfStatus'}, required: false, base: 'number', sortOrder: 23 },
            { title: '收款单位是否注册', checkerId: 'isRegisterSupplier', type: 'select', options: { ref: 'defaultRadio'}, base: 'number', required: false, sortOrder: 24 }, //
            { title: '交易状态', checkerId: 'flowId', type: 'select', options: { ref: 'huaqiaoCityListTypesingle'}, required: false, sortOrder: 25 },
            { title: '渠道', checkerId: 'financingType', type: 'linkage-select', options: { ref: 'productType_dw'}, required: false, sortOrder: 26 }, //
            { title: '付确签章状态', checkerId: 'signStatus', type: 'select', options: { ref: 'signStatus'}, required: false, base: 'number', sortOrder: 27 },
            { title: '付款确认书校验结果', checkerId: 'verifyPayConfimStatus', type: 'select', options: { ref: 'verifyPayConfimStatus'}, base: 'number', required: false, sortOrder: 28 },
            { title: '一线单据编号', checkerId: 'billNumber', type: 'text', required: false, sortOrder: 29 },
            { title: '收款单位户名', checkerId: 'supplierName', type: 'text', required: false, sortOrder: 30 },

        ] as CheckersOutputModel[]


    };
    // 人工校验付确
    static manualVerify = {
        heads: [
            { label: '交易ID', value: 'mainFlowId', type: 'mainFlowId', width: '14%' },
            { label: '付款确认书编号', value: 'payConfirmId', width: '10%' },
            { label: '收款单位', value: 'debtUnit', width: '10%' },
            { label: '收款单位户名', value: 'debtUnitName', width: '10%' },
            { label: '收款单位账号', value: 'debtUnitAccount', width: '5%' },
            { label: '收款单位开户行', value: 'debtUnitBank', width: '10%' },
            { label: '应收账款金额', value: 'receive', type: 'receive', width: '5%' },
            { label: '保理融资到期日', value: 'factoringEndDate', type: 'date', width: '5%' },
            { label: '文件', value: 'payConfimFile', type: 'qrsfile', width: '10%' },
            { label: '付款确认书校验结果', value: 'verifyPayConfimStatus', type: 'verifyPayConfimStatus', width: '10%'}
        ] as ListHeadsFieldOutputModel[],
    };

    // 人工校验付确模态框checker
    static qrsConfig = {
        checkers: [
            {
                title: '交易ID:', checkerId: 'mainFlowId', type: 'text',
                required: false, options: { readonly: true  }, value: '',
            },
            {
                title: '付款确认书编号:', checkerId: 'payConfirmId', type: 'text',
                required: false, options: { readonly: true  }, value: ''
            },
            {
                title: '收款单位:', checkerId: 'debtUnit', type: 'text',
                required: false, options: { readonly: true  }, value: ''
            },
            {
                title: '收款单位户名:', checkerId: 'debtUnitName', type: 'text',
                required: false, options: { readonly: true  }, value: ''
            },
            {
                title: '收款单位账号:', checkerId: 'debtUnitAccount', type: 'text',
                required: false, options: { readonly: true  }, value: ''
            },
            {
                title: '收款单位开户行:', checkerId: 'debtUnitBank', type: 'text',
                required: false, options: { readonly: true  }, value: ''
            },
            {
                title: '应收账款金额:', checkerId: 'receive', type: 'money',
                required: false, options: { readonly: true  }, value: ''
            },
            {
                title: '保理融资到期日:', checkerId: 'factoringEndDate', type: 'date4',
                required: false, options: { readonly: true  }, value: ''
            },
            {
                title: '付款确认书校验结果:', checkerId: 'verifyPayConfimStatus', type: 'select',
                required: false, options: { ref: 'verifyPayConfimStatus', readonly: true }, value: ''
            },
        ] as CheckersOutputModel[],
    };
    // 多标签页，A,B,C,D,E,F......
    static readonly config = {
        download_payconfirm: {
            title: '下载付款确认书-华侨城',
            value: 'download_qrs',
            tabList: [
                {
                    label: '未下载',
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
                                        label: '批量操作',
                                        operate: 'batch_operate',
                                        post_url: '/',
                                        disabled: false,
                                        showButton: true,
                                    },
                                ],
                            },
                            searches: [...DragonpaymentDownloadTabConfig.dragonDownLoadLists.searches,
                                { title: '审批注释', checkerId: 'approvalMemo', type: 'text', required: false, sortOrder: 30 },
                            ],
                            params: 0,
                            searchNumber: DowloadTableCus.successSearch,
                            headNumber: DowloadTableCus.successColumn,
                            headText: [...DragonpaymentDownloadTabConfig.dragonDownLoadLists.heads,
                                { label: '审批注释', value: 'approvalMemo' },

                            ],
                        },
                    ],
                    post_url: '/sub_system/download_pay_confirm/list'
                },
                {
                    label: '已下载',
                    value: 'B',
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
                            searches: DragonpaymentDownloadTabConfig.dragonDownLoadLists.searches,
                            params: 1,
                            searchNumber: DowloadTableCus.failSearch,
                            headNumber: DowloadTableCus.failColumn,
                            headText: [...DragonpaymentDownloadTabConfig.dragonDownLoadLists.heads],
                        },
                    ],
                    post_url: '/sub_system/download_pay_confirm/list'
                },
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
    DONE = '3'
}

/***
 * 在数组特定位置插入元素
 * @param array 原数组
 * @param positionKeyWord 参考关键字
 * @param ele 插入元素
 * @param position 相对于参考元素位置 after | before
 */
function arraySplice(array: ListHeadsFieldOutputModel[], ele: ListHeadsFieldOutputModel,
                     positionKeyWord: string, position: string) {
    const findIndex = array.findIndex(find => find.value === positionKeyWord);
    const idx = position === 'before' ? findIndex : findIndex + 1;
    array.splice(idx, 0, ele);
    return array;
}
