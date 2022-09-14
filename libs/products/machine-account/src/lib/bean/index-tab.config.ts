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
 * 1.0                 wangqing            台账列表          2019-09-03
 * **********************************************************************
 */

import { before } from 'selenium-webdriver/testing';
import { ListHeadsFieldOutputModel, TabConfigModel } from 'libs/shared/src/lib/config/list-config-model';
import { CheckersOutputModel } from 'libs/shared/src/lib/config/checkers';
import CommBase from 'libs/shared/src/lib/public/component/comm-base';
import { XnService } from 'libs/shared/src/lib/services/xn.service';
import { HwModeService } from 'libs/shared/src/lib/services/hw-mode.service';

export default class MachineIndexTabConfig {
    // 交易列表 -采购融资，默认配置
    static MachineaccountTab = {
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
                label: '渠道', value: 'productType', _inList: {
                    sort: false,
                    search: true
                },
                type: 'text1',
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
                label: '资产转让折扣率', value: 'discountRate', type: 'discountRate', _inList: {
                    sort: true,
                    search: true
                },
            },
            {
                label: '保理融资到期日', value: 'factoringEndDate', type: 'date', _inList: {
                    sort: false,
                    search: true
                },
            },
            {
                label: '起息日', value: 'valueDate', type: 'date', _inList: {
                    sort: false,
                    search: true
                },
            },
            {
                label: '预计放款日期', value: 'priorityLoanDate', type: 'date', _inList: {
                    sort: true,
                    search: true
                },
            },
            {
                label: '资产池', value: 'capitalPoolName', type: 'capitalPoolName', _inList: {
                    sort: false,
                    search: true
                },
            },
            {
                label: '律所是否抽查', value: 'isLawOfficeCheck', type: 'text1', _inList: {
                    sort: true,
                    search: true
                },
            },
            {
                label: '是否变更账号', value: 'isChangeAccount', type: 'text1', _inList: {
                    sort: true,
                    search: true
                }
            },
            {
                label: '资金渠道', value: 'channelType', type: 'text1', _inList: {
                    sort: false,
                    search: false
                },
            },
            {
                label: '付款银行', value: 'bankName', type: 'fundingInfo', _inList: {
                    sort: false,
                    search: false
                }
            },
            {
                label: '付款银行账号', value: 'cardCode', type: 'fundingInfo', _inList: {
                    sort: false,
                    search: false
                }
            },
            // {
            //     label: '交易状态', value: 'tradeStatus', type: 'tradeStatus', _inList: {
            //         sort: true,
            //         search: true
            //     },
            //     width: '5%'
            // },
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
                label: '是否需后补资料', value: 'isBackUp', type: 'text1', _inList: {
                    sort: false,
                    search: true
                },
            },
            {
                label: '托管行', value: 'depositBank', type: 'text', _inList: {
                    sort: false,
                    search: true
                },
            },
            {
                label: '发票', value: 'invoiceNum', _inList: {
                    sort: false,
                    search: true
                },
                type: 'invoiceNum',
            },
            {
                label: '入池建议', value: 'poolAdvise', type: 'text1', _inList: {
                    sort: false,
                    search: true
                },
            },
            {
                label: '签署方式', value: 'signType', type: 'text1', _inList: {
                    sort: false,
                    search: true
                },
            },
            {
                label: '交易状态', value: 'flowId', type: 'currentStep', _inList: {
                    sort: false,
                    search: true
                },
            },
            {
                label: '总部提单日期', value: 'headPreDate', type: 'date', _inList: {
                    sort: false,
                    search: true
                },
            },
            {
                label: '备注状态', value: 'memoStatus', type: 'text1', _inList: {
                    sort: false,
                    search: true
                },
            },
            {
                label: '备注', value: 'memo', type: 'memo', _inList: {
                    sort: false,
                    search: true
                },
            },
        ],
        platHeads: [{
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
            label: '渠道', value: 'productType', _inList: {
                sort: false,
                search: true
            },
            type: 'text1',
        },
        {
            label: '总部公司', value: 'headquarters', _inList: {
                sort: false,
                search: true
            },
        },
        {
            label: '起息日', value: 'valueDate', type: 'date', _inList: {
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
            label: '资产转让折扣率', value: 'discountRate', type: 'discountRate', _inList: {
                sort: true,
                search: true
            },
        },
        {
            label: '保理融资到期日', value: 'factoringEndDate', type: 'date', _inList: {
                sort: false,
                search: true
            },
        },
        {
            label: '预计放款日期', value: 'priorityLoanDate', type: 'date', _inList: {
                sort: true,
                search: true
            },
        },
        {
            label: '资产池', value: 'capitalPoolName', type: 'capitalPoolName', _inList: {
                sort: false,
                search: true
            },
        },
        {
            label: '律所是否抽查', value: 'isLawOfficeCheck', type: 'isLawOfficeCheck', _inList: {
                sort: true,
                search: true
            },
        },
        {
            label: '是否变更账号', value: 'isChangeAccount', type: 'defaultRadio', _inList: {
                sort: true,
                search: true,
            },
            width: '3%'

        },
        {
            label: '履约证明是否盖章', value: 'isSignLyFiles', type: 'text1', _inList: {
                sort: false,
                search: true
            },
            width: '3%'

        },
        // {
        //     label: '交易状态', value: 'tradeStatus', type: 'tradeStatus', _inList: {
        //         sort: true,
        //         search: true
        //     },
        // },
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
        {
            label: '是否需后补资料', value: 'isBackUp', type: 'text1', _inList: {
                sort: false,
                search: true
            },
        },
        {
            label: '托管行', value: 'depositBank', type: 'text', _inList: {
                sort: false,
                search: true
            },
        },
        {
            label: '发票', value: 'invoiceNum', _inList: {
                sort: false,
                search: true
            },
            type: 'invoiceNum',
        },
        {
            label: '入池建议', value: 'poolAdvise', type: 'text1', _inList: {
                sort: false,
                search: true
            },
        },
        {
            label: '签署方式', value: 'signType', type: 'text1', _inList: {
                sort: false,
                search: true
            },
        },
        {
            label: '交易状态', value: 'flowId', type: 'currentStep', _inList: {
                sort: false,
                search: true
            },
        },
        {
            label: '总部提单日期', value: 'headPreDate', type: 'date', _inList: {
                sort: false,
                search: true
            },
        },
        {
            label: '备注状态', value: 'memoStatus', type: 'text1', _inList: {
                sort: false,
                search: true
            },
        },
        {
            label: '备注', value: 'memo', type: 'memo', _inList: {
                sort: false,
                search: true
            },
        },
        ] as ListHeadsFieldOutputModel[] as ListHeadsFieldOutputModel[],
        searches: [
            { title: '交易ID', checkerId: 'mainFlowId', type: 'text', required: false, sortOrder: 1 },
            { title: '应收账款金额', checkerId: 'receive', type: 'text', required: false, sortOrder: 2 },
            // {
            //     title: '中登登记状态', checkerId: 'zhongdengStatus', type: 'select',
            //     options: { ref: 'zhongdengStatus' }, required: false, sortOrder: 3
            // },
            // {
            //     title: '总部公司', checkerId: 'headquarters', type: 'select',
            //     options: { ref: 'abs_headquarters' }, required: false, sortOrder: 7
            // },
            { title: '申请付款单位', checkerId: 'projectCompany', type: 'text', required: false, sortOrder: 5 },
            { title: '收款单位', checkerId: 'debtUnit', type: 'text', required: false, sortOrder: 6 },
            { title: '企业Id', checkerId: 'debtUnitId', type: 'text', required: false, sortOrder: 6 },

            {
                title: '交易模式及状态',
                checkerId: 'transactionStatus',
                type: 'machine-tradetype',
                options: { ref: 'machineAccountType' },
                required: false,
                sortOrder: 7
            },
            // { title: '市场部对接人', checkerId: 'marketName', type: 'text', required: false, sortOrder: 8 },
            // { title: '运营部对接人', checkerId: 'operatorName', type: 'text', required: false, sortOrder: 9 },
            {
                title: '起息日', checkerId: 'valueDate', type: 'quantum1',
                required: false, sortOrder: 10
            },
            { title: '协助处理人', checkerId: 'helpUserName', type: 'text', required: false, sortOrder: 10 },

            {
                title: '预计放款日期', checkerId: 'isPriorityLoanDate', type: 'machine-loandate',
                required: false, sortOrder: 11
            },
            {
                title: '律所是否抽查', checkerId: 'isLawOfficeCheck', type: 'select',
                options: { ref: 'isLawOfficeCheck' }, required: false, sortOrder: 12
            },
            {
                title: '是否变更账号', checkerId: 'isChangeAccount', type: 'select', options: { ref: 'defaultRadio' },
                required: false, sortOrder: 13
            },
            {
                title: '是否需后补资料', checkerId: 'isBackUp', type: 'select', options: { ref: 'defaultRadio' },
                required: false, sortOrder: 14
            },
            {
                title: '入池建议', checkerId: 'poolAdvise', type: 'select', options: { ref: 'entoCapitalSugest' },
                required: false, sortOrder: 12
            },
            {
                title: '备注状态', checkerId: 'memoStatus', type: 'select', options: { ref: 'memoStatus' },
                required: false, sortOrder: 12
            },
            {
                title: '签署方式', checkerId: 'signType', type: 'select', options: { ref: 'signType' },
                required: false, sortOrder: 12
            },
            {
                title: '总部提单日期', checkerId: 'isHeadPreDate', type: 'machine-loandate',
                required: false, sortOrder: 12
            },
        ] as CheckersOutputModel[]
    };
    // 地产类ABS
    static suppliermachineAccount = {
        heads: [
            {
                label: '交易ID', value: 'mainFlowId', type: 'mainFlowId', _inList: {
                    sort: true,
                    search: true
                },
                width: '11%',
            },
            {
                label: '提单日期', value: 'tradeDate', type: 'date', _inList: {
                    sort: true,
                    search: true
                },
                width: '3%'

            },
            {
                label: '起息日', value: 'valueDate', type: 'date', _inList: {
                    sort: false,
                    search: true
                },
            },
            {
                label: '渠道', value: 'productType', _inList: {
                    sort: false,
                    search: true
                },
                type: 'text1',
            },
            {
                label: '交易状态', value: 'flowId', type: 'currentStep', _inList: {
                    sort: false,
                    search: true
                },
            },
            { label: '开票文件', value: 'nuonuoid', type: 'text1' },

            { label: '总部公司', value: 'headquarters', width: '5%' },
            { label: '申请付款单位', value: 'projectCompany', type: 'projectCompany', width: '5%' },
            { label: '收款单位', value: 'debtUnit' },
            {
                label: '应收账款金额', value: 'receive', type: 'receive', _inList: {
                    sort: true,
                    search: true
                },
                width: '8%'
            },
            { label: '资产转让折扣率', value: 'discountRate', type: 'discountRate', width: '4%' },
        ] as ListHeadsFieldOutputModel[],
        searches: [
            { title: '交易ID', checkerId: 'mainFlowId', type: 'text', required: false, sortOrder: 1 },
            { title: '应收账款金额', checkerId: 'receive', type: 'text', required: false, sortOrder: 2 },
            {
                title: '中登登记状态', checkerId: 'zhongdengStatus', type: 'select',
                options: { ref: 'zhongdengStatus' }, required: false, sortOrder: 3
            },
            // {
            //     title: '总部公司', checkerId: 'headquarters', type: 'text',
            //     required: false, sortOrder: 4
            // },
            { title: '申请付款单位', checkerId: 'projectCompany', type: 'text', required: false, sortOrder: 5 },
            { title: '收款单位', checkerId: 'debtUnit', type: 'text', required: false, sortOrder: 6 },
            {
                title: '交易模式及状态',
                checkerId: 'transactionStatus',
                type: 'machine-tradetype',
                options: { ref: 'machineAccountType' },
                required: false,
                sortOrder: 7
            },
            {
                title: '起息日', checkerId: 'valueDate', type: 'quantum1',
                required: false, sortOrder: 10
            },
            // { title: '市场部对接人', checkerId: 'marketName', type: 'text', required: false, sortOrder: 8 },
            // { title: '运营部对接人', checkerId: 'operatorName', type: 'text', required: false, sortOrder: 9 },
            // {
            //     title: '优先放款日期', checkerId: 'isPriorityLoanDate', type: 'machine-loandate',
            //     required: false, sortOrder: 10
            // },
            // {
            //     title: '律所是否抽查', checkerId: 'isLawOfficeCheck', type: 'select',
            //     options: { ref: 'isLawOfficeCheck' }, required: false, sortOrder: 11
            // },
            {
                title: '是否变更账号', checkerId: 'isChangeAccount', type: 'select', options: { ref: 'defaultRadio' },
                required: false, sortOrder: 12
            }
        ] as CheckersOutputModel[]
    };
    // 多标签页，A,B,C,D,E,F......
    static readonly config = {
        machineAccount: {
            title: '台账列表',
            tabList: [

                {
                    label: '地产类业务',
                    value: 'B',
                    subTabList: [
                        {
                            label: '审核中',
                            value: 'DOING',
                            canSearch: true,
                            canChecked: true,
                            params: 1,
                            edit: {
                                headButtons: [
                                    {
                                        label: '中登登记',
                                        operate: 'sub_zhongdeng_register',
                                        post_url: '',
                                        disabled: false,
                                    },
                                    {
                                        label: '下载附件',
                                        operate: 'download_file',
                                        post_url: '/list/main/download_deal_flies',
                                        disabled: false,
                                        flag: 1,
                                    },
                                    {
                                        label: '导出清单',
                                        operate: 'export_file',
                                        post_url: '/trade/down_list',
                                        disabled: false,
                                        flag: 1,
                                    },
                                    {
                                        label: '补充信息',
                                        operate: 'add-data',
                                        post_url: '/trade/down_list',
                                        disabled: false,
                                        flag: 1,
                                    },
                                    {
                                        label: '调整签署方式',
                                        operate: 'change-signType',
                                        post_url: '/trade/set_sign_type',
                                        disabled: false,
                                        flag: 1,
                                    },
                                    {
                                        label: '退单流程',
                                        operate: 'reject-program',
                                        post_url: '/trade/down_list',
                                        disabled: false,
                                        flag: 1,
                                    },
                                    {
                                        label: '向万科推送清单',
                                        operate: 'pushList-vanke',
                                        post_url: '',
                                        disabled: false,
                                    },
                                ],
                                rowButtons: [
                                    {
                                        label: '进入审核页面', operate: 'view', post_url: '',
                                        click: (base: CommBase, params, xn: XnService, hwModeService: HwModeService) => {
                                            hwModeService.viewProcess(params.mainFlowId, params.isProxy);
                                        }
                                    },
                                    {
                                        label: '中止交易', operate: 'stop', post_url: '',
                                        click: (params, xn: XnService, hwModeService: HwModeService) => {

                                            // 拼接文件
                                            xn.router.navigate([`/machine-account/record/new/`],
                                                {
                                                    queryParams: {
                                                        id: 'sub_dragon_book_stop',
                                                        relate: 'mainFlowId',
                                                        relateValue: params.mainFlowId,
                                                    }
                                                });
                                        }
                                    },
                                    {
                                        label: '修改预录入信息', operate: 'changeInfo', post_url: '',
                                        click: (params, xn: XnService, hwModeService: HwModeService) => {

                                            // 拼接文件
                                            xn.router.navigate([`/machine-account/record/new/`],
                                                {
                                                    queryParams: {
                                                        id: 'sub_dragon_book_change',
                                                        relate: 'mainFlowId',
                                                        relateValue: params.mainFlowId,
                                                    }
                                                });
                                        }
                                    },


                                    { label: '修改备注信息', operate: 'changeDemo', post_url: '/trade/change_memo' }
                                ]
                            },
                            searches: [...MachineIndexTabConfig.MachineaccountTab.searches,
                            {
                                title: '渠道', checkerId: 'productType', type: 'linkage-select',
                                options: { ref: 'productType_dw' }, required: false, sortOrder: 12
                            },
                            {
                                title: '是否补充到期日', checkerId: 'isFactoringEndDate', type: 'select',
                                options: { ref: 'defaultRadio' }, required: false, sortOrder: 13
                            },
                            {
                                title: '补充协议流程状态', checkerId: 'addContractStatus', type: 'select',
                                options: { ref: 'supplementaryAgreement' }, required: false, sortOrder: 14
                            },
                            ],
                            headText: [...MachineIndexTabConfig.MachineaccountTab.heads,
                            { label: '是否补充到期日', value: 'isFactoringEndDate', type: 'defaultRadio', width: '5%', },
                            {
                                label: '供应商是否注册', value: 'isRegisterSupplier', type: 'text1', _inList: {
                                    sort: true,
                                    search: true
                                },
                            },
                            {
                                label: '收款单位注册时间', value: 'supplierRegisterDate', type: 'date', _inList: {
                                    sort: true,
                                    search: true
                                },
                            },
                            {
                                label: '中登状态', value: 'zhongdengStatus', type: 'zhongdengStatus', _inList: {
                                    sort: true,
                                    search: true
                                },
                            },

                            {   // codeFactoringPayConfirm   factoringPayConfirm contract
                                label: '付款确认书编号(总部致保理商)', value: 'payConfirmId', type: 'text', _inList: {
                                    sort: false,
                                    search: true
                                },
                            },
                            { label: '付款确认书文件(总部致保理商)', value: 'pdfProjectFiles', type: 'file', },

                            ],
                        },
                        {
                            label: '已完成',
                            value: 'TODO',
                            canSearch: true,
                            canChecked: true,
                            params: 2,
                            edit: {
                                headButtons: [
                                    {
                                        label: '中登登记',
                                        operate: 'sub_zhongdeng_register',
                                        post_url: '',
                                        disabled: false,
                                    },
                                    {
                                        label: '下载附件',
                                        operate: 'download_file',
                                        post_url: '/list/main/download_deal_flies',
                                        disabled: false,
                                        flag: 2,
                                    },
                                    {
                                        label: '导出清单',
                                        operate: 'export_file',
                                        post_url: '/trade/down_list',
                                        disabled: false,
                                        flag: 2,
                                    },
                                    {
                                        label: '补充信息',
                                        operate: 'add-data',
                                        post_url: '/trade/down_list',
                                        disabled: false,
                                        flag: 1,
                                    },
                                    {
                                        label: '退单流程',
                                        operate: 'reject-program',
                                        post_url: '/trade/down_list',
                                        disabled: false,
                                        flag: 1,
                                    },
                                    {
                                        label: '向万科推送清单',
                                        operate: 'pushList-vanke',
                                        post_url: '',
                                        disabled: false,
                                    },
                                ],
                                rowButtons: [
                                    {
                                        label: '进入审核页面', operate: 'view', post_url: '',
                                        click: (base: CommBase, params, xn: XnService, hwModeService: HwModeService) => {
                                            hwModeService.viewProcess(params.mainFlowId, params.isProxy);
                                        }
                                    },
                                    {
                                        label: '中止交易', operate: 'stop', post_url: '',
                                        click: (params, xn: XnService, hwModeService: HwModeService) => {

                                            // 拼接文件
                                            xn.router.navigate([`/machine-account/record/new/`],
                                                {
                                                    queryParams: {
                                                        id: 'sub_dragon_book_stop',
                                                        relate: 'mainFlowId',
                                                        relateValue: params.mainFlowId,
                                                    }
                                                });
                                        }
                                    },
                                    {
                                        label: '修改预录入信息', operate: 'changeInfo', post_url: '',
                                        click: (params, xn: XnService, hwModeService: HwModeService) => {

                                            // 拼接文件
                                            xn.router.navigate([`/machine-account/record/new/`],
                                                {
                                                    queryParams: {
                                                        id: 'sub_dragon_book_change',
                                                        relate: 'mainFlowId',
                                                        relateValue: params.mainFlowId,
                                                    }
                                                });
                                        }
                                    },
                                    { label: '修改备注信息', operate: 'changeDemo', post_url: '/trade/change_memo' }
                                ]
                            },
                            searches: [...MachineIndexTabConfig.MachineaccountTab.searches,
                            {
                                title: '渠道', checkerId: 'productType', type: 'linkage-select',
                                options: { ref: 'productType_dw' }, required: false, sortOrder: 12
                            },
                            {
                                title: '是否补充到期日', checkerId: 'isFactoringEndDate', type: 'select',
                                options: { ref: 'defaultRadio' }, required: false, sortOrder: 13
                            },
                            {
                                title: '补充协议流程状态', checkerId: 'addContractStatus', type: 'select',
                                options: { ref: 'supplementaryAgreement' }, required: false, sortOrder: 14
                            }],
                            headText: [...MachineIndexTabConfig.MachineaccountTab.heads,
                            {
                                label: '实际放款日', value: 'realLoanDate', type: 'date', _inList: {
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
                                label: '付款确认书编号(总部致保理商)', value: 'payConfirmId', type: 'text', _inList: {
                                    sort: false,
                                    search: true
                                },
                            },
                            { label: '付款确认书文件(总部致保理商)', value: 'pdfProjectFiles', type: 'file', },
                            ],
                        },
                        {
                            label: '已放款',
                            value: 'DONE',
                            canSearch: true,
                            canChecked: true,
                            params: 3,
                            edit: {
                                headButtons: [
                                    {
                                        label: '中登登记',
                                        operate: 'sub_zhongdeng_register',
                                        post_url: '',
                                        disabled: false,
                                    },
                                    {
                                        label: '下载附件',
                                        operate: 'download_file',
                                        post_url: '/list/main/download_deal_flies',
                                        disabled: false,
                                        flag: 3,
                                    },
                                    {
                                        label: '导出清单',
                                        operate: 'export_file',
                                        post_url: '/trade/down_list',
                                        disabled: false,
                                        flag: 3,
                                    },
                                    {
                                        label: '向万科推送清单',
                                        operate: 'pushList-vanke',
                                        post_url: '',
                                        disabled: false,
                                    },
                                ],
                                rowButtons: [
                                    {
                                        label: '进入审核页面', operate: 'view', post_url: '',
                                        click: (base: CommBase, params, xn: XnService, hwModeService: HwModeService) => {
                                            hwModeService.viewProcess(params.mainFlowId, params.isProxy);
                                        }
                                    },
                                    // {
                                    //     label: '中止交易', operate: 'stop', post_url: '',
                                    //     click: (params, xn: XnService, hwModeService: HwModeService) => {

                                    //         // 拼接文件
                                    //         xn.router.navigate([`/machine-account/record/new/`],
                                    //             {
                                    //                 queryParams: {
                                    //                     id: 'sub_dragon_book_stop',
                                    //                     relate: 'mainFlowId',
                                    //                     relateValue: params.mainFlowId,
                                    //                 }
                                    //             });
                                    //     }
                                    // },
                                    {
                                        label: '修改预录入信息', operate: 'changeInfo', post_url: '',
                                        click: (params, xn: XnService, hwModeService: HwModeService) => {

                                            // 拼接文件
                                            xn.router.navigate([`/machine-account/record/new/`],
                                                {
                                                    queryParams: {
                                                        id: 'sub_dragon_book_change',
                                                        relate: 'mainFlowId',
                                                        relateValue: params.mainFlowId,
                                                    }
                                                });
                                        }
                                    },
                                    { label: '修改备注信息', operate: 'changeDemo', post_url: '/trade/change_memo' }
                                ]
                            },
                            searches: [...MachineIndexTabConfig.MachineaccountTab.searches,
                            {
                                title: '渠道', checkerId: 'productType', type: 'linkage-select',
                                options: { ref: 'productType_dw' }, required: false, sortOrder: 12
                            },
                            {
                                title: '是否补充到期日', checkerId: 'isFactoringEndDate', type: 'select',
                                options: { ref: 'defaultRadio' }, required: false, sortOrder: 13
                            },
                            {
                                title: '补充协议流程状态', checkerId: 'addContractStatus', type: 'select',
                                options: { ref: 'supplementaryAgreement' }, required: false, sortOrder: 14
                            }],
                            headText: [...MachineIndexTabConfig.MachineaccountTab.heads,
                            {
                                label: '实际放款日', value: 'realLoanDate', type: 'date', _inList: {
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
                            { label: '放款回单', value: 'loanReturn', type: 'loanReturn', },
                            {
                                label: '付款确认书编号(总部致保理商)', value: 'payConfirmId', type: 'text', _inList: {
                                    sort: false,
                                    search: true
                                },
                            },
                            { label: '付款确认书文件(总部致保理商)', value: 'pdfProjectFiles', type: 'file', },

                            ],
                        },
                        {
                            label: '已开票',
                            value: 'SPECIAL',
                            canSearch: true,
                            canChecked: true,
                            params: 4,
                            edit: {
                                headButtons: [
                                    {
                                        label: '中登登记',
                                        operate: 'sub_zhongdeng_register',
                                        post_url: '',
                                        disabled: false,
                                    },
                                    {
                                        label: '下载附件',
                                        operate: 'download_file',
                                        post_url: '/list/main/download_deal_flies',
                                        disabled: false,
                                        flag: 4,
                                    },
                                    {
                                        label: '导出清单',
                                        operate: 'export_file',
                                        post_url: '/trade/down_list',
                                        disabled: false,
                                        flag: 4,
                                    },
                                    {
                                        label: '向万科推送清单',
                                        operate: 'pushList-vanke',
                                        post_url: '',
                                        disabled: false,
                                    },
                                ],
                                rowButtons: [
                                    {
                                        label: '进入审核页面', operate: 'view', post_url: '',
                                        click: (base: CommBase, params, xn: XnService, hwModeService: HwModeService) => {
                                            hwModeService.viewProcess(params.mainFlowId, params.isProxy);
                                        }
                                    },
                                    // {
                                    //     label: '中止交易', operate: 'stop', post_url: '',
                                    //     click: (params, xn: XnService, hwModeService: HwModeService) => {

                                    //         // 拼接文件
                                    //         xn.router.navigate([`/machine-account/record/new/`],
                                    //             {
                                    //                 queryParams: {
                                    //                     id: 'sub_dragon_book_stop',
                                    //                     relate: 'mainFlowId',
                                    //                     relateValue: params.mainFlowId,
                                    //                 }
                                    //             });
                                    //     }
                                    // },
                                    {
                                        label: '修改预录入信息', operate: 'changeInfo', post_url: '',
                                        click: (params, xn: XnService, hwModeService: HwModeService) => {

                                            // 拼接文件
                                            xn.router.navigate([`/machine-account/record/new/`],
                                                {
                                                    queryParams: {
                                                        id: 'sub_dragon_book_change',
                                                        relate: 'mainFlowId',
                                                        relateValue: params.mainFlowId,
                                                    }
                                                });
                                        }
                                    },
                                    { label: '修改备注信息', operate: 'changeDemo', post_url: '/trade/change_memo' }

                                ]
                            },
                            searches: [...MachineIndexTabConfig.MachineaccountTab.searches,
                            {
                                title: '是否补充到期日', checkerId: 'isFactoringEndDate', type: 'select',
                                options: { ref: 'defaultRadio' }, required: false, sortOrder: 13
                            },
                            {
                                title: '补充协议流程状态', checkerId: 'addContractStatus', type: 'select',
                                options: { ref: 'supplementaryAgreement' }, required: false, sortOrder: 14
                            }],
                            headText: [
                                {
                                    label: '交易Id', value: 'mainFlowId', type: 'mainFlowId', _inList: {
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
                                { label: '总部公司', value: 'headquarters', type: 'text', },
                                { label: '申请付款单位', value: 'projectCompany', type: 'projectCompany', },
                                { label: '收款单位', value: 'debtUnit', type: 'text', },
                                {
                                    label: '应收账款金额', value: 'receive', type: 'receive', _inList: {
                                        sort: true,
                                        search: true
                                    },
                                },
                                {
                                    label: '资产转让折扣率', value: 'discountRate', type: 'discountRate', _inList: {
                                        sort: true,
                                        search: true
                                    },
                                },
                                {
                                    label: '实际放款日', value: 'realLoanDate', type: 'date', _inList: {
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
                                    label: '交易状态', value: 'flowId', type: 'currentStep', _inList: {
                                        sort: false,
                                        search: true
                                    },
                                },
                                {
                                    label: '起息日', value: 'valueDate', type: 'date', _inList: {
                                        sort: false,
                                        search: true
                                    },
                                },
                                { label: '放款回单', value: 'loanReturn', type: 'loanReturn', },
                                { label: '发票', value: 'invoiceNum', type: 'invoiceNum', },
                                { label: '开票文件', value: 'nuonuoid', type: 'text1', },
                            ],
                        }
                    ],
                    post_url: '/trade/list'
                }
            ]
        } as TabConfigModel,
        platmachineAccount: {
            title: '台账列表',
            tabList: [

                {
                    label: '地产类业务',
                    value: 'B',
                    subTabList: [
                        {
                            label: '审核中',
                            value: 'DOING',
                            canSearch: true,
                            canChecked: true,
                            params: 1,
                            edit: {
                                headButtons: [
                                    {
                                        label: '中登登记',
                                        operate: 'sub_zhongdeng_register',
                                        post_url: '',
                                        disabled: false,
                                    },
                                    {
                                        label: '下载附件',
                                        operate: 'download_file',
                                        post_url: '/list/main/download_deal_flies',
                                        disabled: false,
                                        flag: 1,
                                    },
                                    {
                                        label: '导出清单',
                                        operate: 'export_file',
                                        post_url: '/trade/down_list',
                                        disabled: false,
                                        flag: 1,
                                    },
                                    {
                                        label: '修改协助处理人',
                                        operate: 'edit-helpHandler',
                                        post_url: '',
                                        disabled: false,
                                    },
                                ],
                                rowButtons: [
                                    {
                                        label: '进入审核页面', operate: 'view', post_url: '',
                                        click: (base: CommBase, params, xn: XnService, hwModeService: HwModeService) => {
                                            hwModeService.viewProcess(params.mainFlowId, params.isProxy);
                                        }
                                    },
                                    {
                                        label: '中止交易', operate: 'stop', post_url: '',
                                        click: (params, xn: XnService, hwModeService: HwModeService) => {

                                            // 拼接文件
                                            xn.router.navigate([`/machine-account/record/new/`],
                                                {
                                                    queryParams: {
                                                        id: 'sub_dragon_book_stop',
                                                        relate: 'mainFlowId',
                                                        relateValue: params.mainFlowId,
                                                    }
                                                });
                                        }
                                    },
                                    {
                                        label: '修改预录入信息', operate: 'changeInfo', post_url: '',
                                        click: (params, xn: XnService, hwModeService: HwModeService) => {

                                            // 拼接文件
                                            xn.router.navigate([`/machine-account/record/new/`],
                                                {
                                                    queryParams: {
                                                        id: 'sub_dragon_book_change',
                                                        relate: 'mainFlowId',
                                                        relateValue: params.mainFlowId,
                                                    }
                                                });
                                        }
                                    },


                                    { label: '修改备注信息', operate: 'changeDemo', post_url: '/trade/change_memo' },
                                    { label: '后补资料', operate: 'addData', post_url: '/trade/change_memo' }

                                ]
                            },
                            searches: [...MachineIndexTabConfig.MachineaccountTab.searches,
                            {
                                title: '起息日', checkerId: 'valueDate', type: 'quantum1',
                                required: false, sortOrder: 10
                            },
                            {
                                title: '渠道', checkerId: 'productType', type: 'linkage-select',
                                options: { ref: 'productType_dw' }, required: false, sortOrder: 12
                            },
                            {
                                title: '是否补充到期日', checkerId: 'isFactoringEndDate', type: 'select',
                                options: { ref: 'defaultRadio' }, required: false, sortOrder: 13
                            },
                            {
                                title: '补充协议流程状态', checkerId: 'addContractStatus', type: 'select',
                                options: { ref: 'supplementaryAgreement' }, required: false, sortOrder: 14
                            },
                            {
                                title: '是否签署履约证明', checkerId: 'isSignLyFiles', type: 'select',
                                options: { ref: 'defaultRadio' }, required: false, sortOrder: 15
                            },
                            {
                                title: '是否抽样业务', checkerId: 'isSampling', type: 'select',
                                options: { ref: 'defaultRadio' }, required: false, sortOrder: 15
                            },
                            ],
                            headText: [...MachineIndexTabConfig.MachineaccountTab.heads,
                            { label: '是否补充到期日', value: 'isFactoringEndDate', type: 'text1', width: '5%', },
                            {
                                label: '供应商是否注册', value: 'isRegisterSupplier', type: 'isInit', _inList: {
                                    sort: true,
                                    search: true
                                },
                            },
                            {
                                label: '收款单位注册时间', value: 'supplierRegisterDate', type: 'date', _inList: {
                                    sort: true,
                                    search: true
                                },
                            },
                            {
                                label: '中登状态', value: 'zhongdengStatus', type: 'zhongdengStatus', _inList: {
                                    sort: true,
                                    search: true
                                },
                            },

                            {
                                label: '付款确认书编号(总部致保理商)', value: 'payConfirmId', type: 'text', _inList: {
                                    sort: false,
                                    search: true
                                },
                            },
                            { label: '付款确认书文件(总部致保理商)', value: 'pdfProjectFiles', type: 'file', width: '7%', },
                            ],
                        },
                        {
                            label: '已完成',
                            value: 'TODO',
                            canSearch: true,
                            canChecked: true,
                            params: 2,
                            edit: {
                                headButtons: [
                                    {
                                        label: '中登登记',
                                        operate: 'sub_zhongdeng_register',
                                        post_url: '',
                                        disabled: false,
                                    },
                                    {
                                        label: '下载附件',
                                        operate: 'download_file',
                                        post_url: '/list/main/download_deal_flies',
                                        disabled: false,
                                        flag: 2,
                                    },
                                    {
                                        label: '导出清单',
                                        operate: 'export_file',
                                        post_url: '/trade/down_list',
                                        disabled: false,
                                        flag: 2,
                                    },
                                    {
                                        label: '修改协助处理人',
                                        operate: 'edit-helpHandler',
                                        post_url: '',
                                        disabled: false,
                                    },
                                ],
                                rowButtons: [
                                    {
                                        label: '进入审核页面', operate: 'view', post_url: '',
                                        click: (base: CommBase, params, xn: XnService, hwModeService: HwModeService) => {
                                            hwModeService.viewProcess(params.mainFlowId, params.isProxy);
                                        }
                                    },
                                    {
                                        label: '中止交易', operate: 'stop', post_url: '',
                                        click: (params, xn: XnService, hwModeService: HwModeService) => {

                                            // 拼接文件
                                            xn.router.navigate([`/machine-account/record/new/`],
                                                {
                                                    queryParams: {
                                                        id: 'sub_dragon_book_stop',
                                                        relate: 'mainFlowId',
                                                        relateValue: params.mainFlowId,
                                                    }
                                                });
                                        }
                                    },
                                    {
                                        label: '修改预录入信息', operate: 'changeInfo', post_url: '',
                                        click: (params, xn: XnService, hwModeService: HwModeService) => {

                                            // 拼接文件
                                            xn.router.navigate([`/machine-account/record/new/`],
                                                {
                                                    queryParams: {
                                                        id: 'sub_dragon_book_change',
                                                        relate: 'mainFlowId',
                                                        relateValue: params.mainFlowId,
                                                    }
                                                });
                                        }
                                    },
                                    { label: '修改备注信息', operate: 'changeDemo', post_url: '/trade/change_memo' },
                                    { label: '后补资料', operate: 'addData', post_url: '/trade/change_memo' }

                                ]
                            },
                            searches: [...MachineIndexTabConfig.MachineaccountTab.searches,
                            {
                                title: '起息日', checkerId: 'valueDate', type: 'quantum1',
                                required: false, sortOrder: 10
                            },
                            {
                                title: '渠道', checkerId: 'productType', type: 'linkage-select',
                                options: { ref: 'productType_dw' }, required: false, sortOrder: 12
                            },
                            {
                                title: '是否补充到期日', checkerId: 'isFactoringEndDate', type: 'select',
                                options: { ref: 'defaultRadio' }, required: false, sortOrder: 13
                            },
                            {
                                title: '补充协议流程状态', checkerId: 'addContractStatus', type: 'select',
                                options: { ref: 'supplementaryAgreement' }, required: false, sortOrder: 14
                            },
                            {
                                title: '是否签署履约证明', checkerId: 'isSignLyFiles', type: 'select',
                                options: { ref: 'defaultRadio' }, required: false, sortOrder: 15
                            },
                            {
                                title: '是否抽样业务', checkerId: 'isSampling', type: 'select',
                                options: { ref: 'defaultRadio' }, required: false, sortOrder: 15
                            },
                            ],
                            headText: [...MachineIndexTabConfig.MachineaccountTab.heads,
                            {
                                label: '实际放款日', value: 'realLoanDate', type: 'date', width: '4%', _inList: {
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
                                label: '付款确认书编号(总部致保理商)', value: 'payConfirmId', type: 'text', _inList: {
                                    sort: false,
                                    search: true
                                },
                            },
                            { label: '付款确认书文件(总部致保理商)', value: 'pdfProjectFiles', type: 'file', },
                            ],
                        },
                        {
                            label: '已放款',
                            value: 'DONE',
                            canSearch: true,
                            canChecked: true,
                            params: 3,
                            edit: {
                                headButtons: [
                                    {
                                        label: '中登登记',
                                        operate: 'sub_zhongdeng_register',
                                        post_url: '',
                                        disabled: false,
                                    },
                                    {
                                        label: '下载附件',
                                        operate: 'download_file',
                                        post_url: '/list/main/download_deal_flies',
                                        disabled: false,
                                        flag: 3,
                                    },
                                    {
                                        label: '导出清单',
                                        operate: 'export_file',
                                        post_url: '/trade/down_list',
                                        disabled: false,
                                        flag: 3,
                                    },
                                    {
                                        label: '修改协助处理人',
                                        operate: 'edit-helpHandler',
                                        post_url: '',
                                        disabled: false,
                                    },
                                ],
                                rowButtons: [
                                    {
                                        label: '进入审核页面', operate: 'view', post_url: '',
                                        click: (base: CommBase, params, xn: XnService, hwModeService: HwModeService) => {
                                            hwModeService.viewProcess(params.mainFlowId, params.isProxy);
                                        }
                                    },
                                    // {
                                    //     label: '中止交易', operate: 'stop', post_url: '',
                                    //     click: (params, xn: XnService, hwModeService: HwModeService) => {

                                    //         // 拼接文件
                                    //         xn.router.navigate([`/machine-account/record/new/`],
                                    //             {
                                    //                 queryParams: {
                                    //                     id: 'sub_dragon_book_stop',
                                    //                     relate: 'mainFlowId',
                                    //                     relateValue: params.mainFlowId,
                                    //                 }
                                    //             });
                                    //     }
                                    // },
                                    {
                                        label: '修改预录入信息', operate: 'changeInfo', post_url: '',
                                        click: (params, xn: XnService, hwModeService: HwModeService) => {

                                            // 拼接文件
                                            xn.router.navigate([`/machine-account/record/new/`],
                                                {
                                                    queryParams: {
                                                        id: 'sub_dragon_book_change',
                                                        relate: 'mainFlowId',
                                                        relateValue: params.mainFlowId,
                                                    }
                                                });
                                        }
                                    },
                                    { label: '修改备注信息', operate: 'changeDemo', post_url: '/trade/change_memo' },
                                    { label: '后补资料', operate: 'addData', post_url: '/trade/change_memo' }
                                ]
                            },
                            searches: [...MachineIndexTabConfig.MachineaccountTab.searches,
                            {
                                title: '起息日', checkerId: 'valueDate', type: 'quantum1',
                                required: false, sortOrder: 10
                            },
                            {
                                title: '渠道', checkerId: 'productType', type: 'linkage-select',
                                options: { ref: 'productType_dw' }, required: false, sortOrder: 12
                            },
                            {
                                title: '是否补充到期日', checkerId: 'isFactoringEndDate', type: 'select',
                                options: { ref: 'defaultRadio' }, required: false, sortOrder: 13
                            },
                            {
                                title: '补充协议流程状态', checkerId: 'addContractStatus', type: 'select',
                                options: { ref: 'supplementaryAgreement' }, required: false, sortOrder: 14
                            },
                            {
                                title: '是否签署履约证明', checkerId: 'isSignLyFiles', type: 'select',
                                options: { ref: 'defaultRadio' }, required: false, sortOrder: 15
                            },
                            {
                                title: '是否抽样业务', checkerId: 'isSampling', type: 'select',
                                options: { ref: 'defaultRadio' }, required: false, sortOrder: 15
                            },
                            ],
                            headText: [...MachineIndexTabConfig.MachineaccountTab.heads,
                            {
                                label: '实际放款日', value: 'realLoanDate', type: 'date', _inList: {
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
                            { label: '放款回单', value: 'loanReturn', type: 'loanReturn', },
                            {
                                label: '付款确认书编号(总部致保理商)', value: 'payConfirmId', type: 'text', _inList: {
                                    sort: false,
                                    search: true
                                },
                            },
                            { label: '付款确认书文件(总部致保理商)', value: 'pdfProjectFiles', type: 'file', },
                            ],
                        },
                        {
                            label: '已开票',
                            value: 'SPECIAL',
                            canSearch: true,
                            canChecked: true,
                            params: 4,
                            edit: {
                                headButtons: [
                                    {
                                        label: '中登登记',
                                        operate: 'sub_zhongdeng_register',
                                        post_url: '',
                                        disabled: false,
                                    },
                                    {
                                        label: '下载附件',
                                        operate: 'download_file',
                                        post_url: '/list/main/download_deal_flies',
                                        disabled: false,
                                        flag: 4,
                                    },
                                    {
                                        label: '导出清单',
                                        operate: 'export_file',
                                        post_url: '/trade/down_list',
                                        disabled: false,
                                        flag: 4,
                                    },
                                    {
                                        label: '修改协助处理人',
                                        operate: 'edit-helpHandler',
                                        post_url: '',
                                        disabled: false,
                                    },
                                ],
                                rowButtons: [
                                    {
                                        label: '进入审核页面', operate: 'view', post_url: '',
                                        click: (base: CommBase, params, xn: XnService, hwModeService: HwModeService) => {
                                            hwModeService.viewProcess(params.mainFlowId, params.isProxy);
                                        }
                                    },
                                    // {
                                    //     label: '中止交易', operate: 'stop', post_url: '',
                                    //     click: (params, xn: XnService, hwModeService: HwModeService) => {

                                    //         // 拼接文件
                                    //         xn.router.navigate([`/machine-account/record/new/`],
                                    //             {
                                    //                 queryParams: {
                                    //                     id: 'sub_dragon_book_stop',
                                    //                     relate: 'mainFlowId',
                                    //                     relateValue: params.mainFlowId,
                                    //                 }
                                    //             });
                                    //     }
                                    // },
                                    {
                                        label: '修改预录入信息', operate: 'changeInfo', post_url: '',
                                        click: (params, xn: XnService, hwModeService: HwModeService) => {

                                            // 拼接文件
                                            xn.router.navigate([`/machine-account/record/new/`],
                                                {
                                                    queryParams: {
                                                        id: 'sub_dragon_book_change',
                                                        relate: 'mainFlowId',
                                                        relateValue: params.mainFlowId,
                                                    }
                                                });
                                        }
                                    },
                                    { label: '修改备注信息', operate: 'changeDemo', post_url: '/trade/change_memo' },
                                    { label: '后补资料', operate: 'addData', post_url: '/trade/change_memo' }


                                ]
                            },
                            searches: [...MachineIndexTabConfig.MachineaccountTab.searches,
                            {
                                title: '起息日', checkerId: 'valueDate', type: 'quantum1',
                                required: false, sortOrder: 10
                            },
                            {
                                title: '是否补充到期日', checkerId: 'isFactoringEndDate', type: 'select',
                                options: { ref: 'defaultRadio' }, required: false, sortOrder: 13
                            },
                            {
                                title: '补充协议流程状态', checkerId: 'addContractStatus', type: 'select',
                                options: { ref: 'supplementaryAgreement' }, required: false, sortOrder: 14
                            },
                            {
                                title: '是否签署履约证明', checkerId: 'isSignLyFiles', type: 'select',
                                options: { ref: 'defaultRadio' }, required: false, sortOrder: 15
                            },
                            {
                                title: '是否抽样业务', checkerId: 'isSampling', type: 'select',
                                options: { ref: 'defaultRadio' }, required: false, sortOrder: 15
                            },
                            ],
                            headText: [
                                {
                                    label: '交易Id', value: 'mainFlowId', type: 'mainFlowId', _inList: {
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
                                { label: '总部公司', value: 'headquarters', type: 'text', },
                                { label: '申请付款单位', value: 'projectCompany', type: 'projectCompany', },
                                { label: '收款单位', value: 'debtUnit', type: 'text', },
                                {
                                    label: '应收账款金额', value: 'receive', type: 'receive', _inList: {
                                        sort: true,
                                        search: true
                                    },
                                },
                                {
                                    label: '资产转让折扣率', value: 'discountRate', type: 'discountRate', _inList: {
                                        sort: true,
                                        search: true
                                    },
                                },
                                {
                                    label: '实际放款日', value: 'realLoanDate', type: 'date', _inList: {
                                        sort: true,
                                        search: true
                                    },
                                },
                                {
                                    label: '交易状态', value: 'flowId', type: 'currentStep', _inList: {
                                        sort: false,
                                        search: true
                                    },
                                },
                                {
                                    label: '转让价款', value: 'changePrice', type: 'receive', _inList: {
                                        sort: true,
                                        search: true
                                    },

                                },
                                { label: '放款回单', value: 'loanReturn', type: 'loanReturn', },
                                { label: '发票', value: 'invoiceNum', type: 'invoiceNum', },
                                {
                                    label: '付款银行', value: 'bankName', type: 'fundingInfo', _inList: {
                                        sort: false,
                                        search: false
                                    }
                                },
                                {
                                    label: '付款银行账号', value: 'cardCode', type: 'fundingInfo', _inList: {
                                        sort: false,
                                        search: false
                                    }
                                },
                            ],
                        }
                    ],
                    post_url: '/trade/list'
                }
            ]
        } as TabConfigModel,

        suppliermachineAccount: {
            title: '台账列表',
            tabList: [
                {
                    label: '地产类业务',
                    value: 'B',
                    subTabList: [
                        {
                            label: '审核中',
                            value: 'DOING',
                            canSearch: true,
                            canChecked: true,
                            params: 1,
                            edit: {
                                headButtons: [
                                    {
                                        label: '下载附件',
                                        operate: 'download_file',
                                        post_url: '/list/main/download_deal_flies',
                                        disabled: false,
                                        flag: 1,
                                    },
                                    {
                                        label: '导出清单',
                                        operate: 'export_file',
                                        post_url: '/trade/down_list',
                                        disabled: false,
                                        flag: 1,
                                    },
                                ],
                                rowButtons: [
                                    {
                                        label: '进入审核页面', operate: 'view', post_url: '',
                                        click: (base: CommBase, params, xn: XnService, hwModeService: HwModeService) => {
                                            hwModeService.viewProcess(params.mainFlowId, params.isProxy);
                                        }
                                    },
                                    {
                                        label: '中止交易', operate: 'stop', post_url: '',
                                        click: (params, xn: XnService, hwModeService: HwModeService) => {

                                            // 拼接文件
                                            xn.router.navigate([`/machine-account/record/new/`],
                                                {
                                                    queryParams: {
                                                        id: 'sub_dragon_book_stop',
                                                        relate: 'mainFlowId',
                                                        relateValue: params.mainFlowId,
                                                    }
                                                });
                                        }
                                    },
                                    {
                                        label: '修改预录入信息', operate: 'changeInfo', post_url: '',
                                        click: (params, xn: XnService, hwModeService: HwModeService) => {

                                            // 拼接文件
                                            xn.router.navigate([`/machine-account/record/new/`],
                                                {
                                                    queryParams: {
                                                        id: 'sub_dragon_book_change',
                                                        relate: 'mainFlowId',
                                                        relateValue: params.mainFlowId,
                                                    }
                                                });
                                        }
                                    },
                                    { label: '修改备注信息', operate: 'changeDemo', post_url: '/trade/change_memo' }
                                ]
                            },
                            searches: MachineIndexTabConfig.suppliermachineAccount.searches,
                            headText: [...MachineIndexTabConfig.suppliermachineAccount.heads,
                            { label: '收款单位归属城市', value: 'supplierCity', },
                            {
                                label: '付款确认书编号(总部致保理商)', value: 'payConfirmId', type: 'text', _inList: {
                                    sort: false,
                                    search: true
                                },
                            },
                            { label: '付款确认书文件(总部致保理商)', value: 'pdfProjectFiles', type: 'file', },
                            { label: '备注', value: 'memo', type: 'memo', }

                            ],
                        },
                        {
                            label: '已完成',
                            value: 'TODO',
                            canSearch: true,
                            canChecked: true,
                            params: 2,
                            edit: {
                                headButtons: [
                                    {
                                        label: '下载附件',
                                        operate: 'download_file',
                                        post_url: '/list/main/download_deal_flies',
                                        disabled: false,
                                        flag: 2,
                                    },
                                    {
                                        label: '导出清单',
                                        operate: 'export_file',
                                        post_url: '/trade/down_list',
                                        disabled: false,
                                        flag: 2,
                                    },
                                ],
                                rowButtons: [
                                    {
                                        label: '进入审核页面', operate: 'view', post_url: '',
                                        click: (base: CommBase, params, xn: XnService, hwModeService: HwModeService) => {
                                            hwModeService.viewProcess(params.mainFlowId, params.isProxy);
                                        }
                                    },
                                    {
                                        label: '中止交易', operate: 'stop', post_url: '',
                                        click: (params, xn: XnService, hwModeService: HwModeService) => {

                                            // 拼接文件
                                            xn.router.navigate([`/machine-account/record/new/`],
                                                {
                                                    queryParams: {
                                                        id: 'sub_dragon_book_stop',
                                                        relate: 'mainFlowId',
                                                        relateValue: params.mainFlowId,
                                                    }
                                                });
                                        }
                                    },
                                    {
                                        label: '修改预录入信息', operate: 'changeInfo', post_url: '',
                                        click: (params, xn: XnService, hwModeService: HwModeService) => {

                                            // 拼接文件
                                            xn.router.navigate([`/machine-account/record/new/`],
                                                {
                                                    queryParams: {
                                                        id: 'sub_dragon_book_change',
                                                        relate: 'mainFlowId',
                                                        relateValue: params.mainFlowId,
                                                    }
                                                });
                                        }
                                    },
                                    { label: '修改备注信息', operate: 'changeDemo', post_url: '/trade/change_memo' }

                                ]
                            },
                            searches: MachineIndexTabConfig.suppliermachineAccount.searches,
                            headText: [...MachineIndexTabConfig.suppliermachineAccount.heads,
                            {
                                label: '付款确认书编号(总部致保理商)', value: 'payConfirmId', type: 'text', _inList: {
                                    sort: false,
                                    search: true
                                }, width: '7%',
                            },
                            { label: '付款确认书文件(总部致保理商)', value: 'pdfProjectFiles', type: 'file', width: '7%', },
                            ],
                        },
                        {
                            label: '已放款',
                            value: 'DONE',
                            canSearch: true,
                            canChecked: true,
                            params: 3,
                            edit: {
                                headButtons: [
                                    {
                                        label: '下载附件',
                                        operate: 'download_file',
                                        post_url: '/list/main/download_deal_flies',
                                        disabled: false,
                                        flag: 3,
                                    },
                                    {
                                        label: '导出清单',
                                        operate: 'export_file',
                                        post_url: '/trade/down_list',
                                        disabled: false,
                                        flag: 3,
                                    },
                                ],
                                rowButtons: [
                                    {
                                        label: '进入审核页面', operate: 'view', post_url: '',
                                        click: (base: CommBase, params, xn: XnService, hwModeService: HwModeService) => {
                                            hwModeService.viewProcess(params.mainFlowId, params.isProxy);
                                        }
                                    },
                                    {
                                        label: '中止交易', operate: 'stop', post_url: '',
                                        click: (params, xn: XnService, hwModeService: HwModeService) => {

                                            // 拼接文件
                                            xn.router.navigate([`/machine-account/record/new/`],
                                                {
                                                    queryParams: {
                                                        id: 'sub_dragon_book_stop',
                                                        relate: 'mainFlowId',
                                                        relateValue: params.mainFlowId,
                                                    }
                                                });
                                        }
                                    },
                                    {
                                        label: '修改预录入信息', operate: 'changeInfo', post_url: '',
                                        click: (params, xn: XnService, hwModeService: HwModeService) => {

                                            // 拼接文件
                                            xn.router.navigate([`/machine-account/record/new/`],
                                                {
                                                    queryParams: {
                                                        id: 'sub_dragon_book_change',
                                                        relate: 'mainFlowId',
                                                        relateValue: params.mainFlowId,
                                                    }
                                                });
                                        }
                                    },
                                    { label: '修改备注信息', operate: 'changeDemo', post_url: '/trade/change_memo' }
                                ]
                            },
                            searches: MachineIndexTabConfig.suppliermachineAccount.searches,
                            headText: [...MachineIndexTabConfig.suppliermachineAccount.heads,
                            {
                                label: '转让价格', value: 'changePrice', type: 'receive', _inList: {
                                    sort: true,
                                    search: true
                                },
                            },
                            {
                                label: '放款回单', value: 'loanReturn', type: 'loanReturn', _inList: {
                                    sort: false,
                                    search: true
                                },
                            },

                            {
                                label: '付款确认书编号(总部致保理商)', value: 'payConfirmId', type: 'text', _inList: {
                                    sort: false,
                                    search: true
                                },
                            },
                            { label: '付款确认书文件(总部致保理商)', value: 'pdfProjectFiles', type: 'file', },
                            {
                                label: '保理融资到期日', value: 'factoringEndDate', type: 'date', _inList: {
                                    sort: false,
                                    search: true
                                },
                            },
                            {
                                label: '转让价差', value: 'changeEnd', type: 'money', _inList: {
                                    sort: false,
                                    search: true
                                },
                            },
                            {
                                label: '融资天数', value: 'financingDays', type: 'text', _inList: {
                                    sort: false,
                                    search: true
                                },
                            },
                            ]
                        },
                        {
                            label: '已开票',
                            value: 'SPECIAL',
                            canSearch: true,
                            canChecked: true,
                            params: 4,
                            edit: {
                                headButtons: [
                                    {
                                        label: '下载附件',
                                        operate: 'download_file',
                                        post_url: '/list/main/download_deal_flies',
                                        disabled: false,
                                        flag: 4,
                                    },
                                    {
                                        label: '导出清单',
                                        operate: 'export_file',
                                        post_url: '/trade/down_list',
                                        disabled: false,
                                        flag: 4,
                                    },
                                ],
                                rowButtons: [
                                    {
                                        label: '进入审核页面', operate: 'view', post_url: '',
                                        click: (base: CommBase, params, xn: XnService, hwModeService: HwModeService) => {
                                            hwModeService.viewProcess(params.mainFlowId, params.isProxy);
                                        }
                                    },
                                    {
                                        label: '中止交易', operate: 'stop', post_url: '',
                                        click: (params, xn: XnService, hwModeService: HwModeService) => {

                                            // 拼接文件
                                            xn.router.navigate([`/machine-account/record/new/`],
                                                {
                                                    queryParams: {
                                                        id: 'sub_dragon_book_stop',
                                                        relate: 'mainFlowId',
                                                        relateValue: params.mainFlowId,
                                                    }
                                                });
                                        }
                                    },
                                    {
                                        label: '修改预录入信息', operate: 'changeInfo', post_url: '',
                                        click: (params, xn: XnService, hwModeService: HwModeService) => {

                                            // 拼接文件
                                            xn.router.navigate([`/machine-account/record/new/`],
                                                {
                                                    queryParams: {
                                                        id: 'sub_dragon_book_change',
                                                        relate: 'mainFlowId',
                                                        relateValue: params.mainFlowId,
                                                    }
                                                });
                                        }
                                    },
                                    {
                                        label: '修改备注信息', operate: 'changeDemo', post_url: '/trade/change_memo',

                                    }


                                ]
                            },
                            searches: MachineIndexTabConfig.suppliermachineAccount.searches,
                            headText: [...MachineIndexTabConfig.suppliermachineAccount.heads,

                            {
                                label: '转让价款', value: 'changePrice', type: 'receive', _inList: {
                                    sort: true,
                                    search: true
                                },
                            },
                            { label: '放款回单', value: 'loanReturn', type: 'loanReturn', },
                            { label: '发票', value: 'invoiceNum', type: 'invoiceNum', },
                            ],

                        }
                    ],
                    post_url: '/trade/list'

                }
            ]
        } as TabConfigModel,
    };

    static getConfig() {
        return this.config;
    }

}

/***
 *  子标签页，针对采购融资交易列表，根据特定需求修改
 */
export enum SubTabEnum {
    /** 进行中 */
    DOING = 1,
    /** 待还款 */
    TODO = 2,
    /** 已完成 */
    DONE    = 3,
    SPECIAL = 4,
}

export enum ApiProxyEnum {
    A = 'dragon',
    B = 'dragon',
    C = 'dragon',
}
export enum MachineTypeEnum {
    avenger = 1,
    dragon  = 2,
    vanke   = 3,
    agile   = 4,
    jindi   = 5,
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
