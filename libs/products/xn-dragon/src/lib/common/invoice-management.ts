import { ListHeadsFieldOutputModel, TabConfigModel } from 'libs/shared/src/lib/config/list-config-model';
import { CheckersOutputModel } from 'libs/shared/src/lib/config/checkers';
import CommBase from '../pages/comm-base';
import { XnService } from 'libs/shared/src/lib/services/xn.service';

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

export default class DragonInvoiceTabConfig {
    // 开票管理列表，默认配置(表头和搜索项)
    static dragonapprovalLists = {
        heads: [
            { label: '交易ID', value: 'mainFlowId', type: 'mainFlowId' },
            { label: '总部公司', value: 'headquarters' },
            { label: '申请付款单位', value: 'projectCompany' },
            { label: '收款单位', value: 'debtUnit' },
            { label: '付款确认书编号', value: 'payConfirmId' },
            { label: '应收账款金额', value: 'receivable', type: 'money' },
            { label: '转让价款', value: 'changePrice', type: 'money' },
            { label: '资产转让折扣率', value: 'discountRate' },
            { label: '交易状态', value: 'status', type: 'xnMainFlowStatus' },
            { label: '保理融资到期日', value: 'factoringEndDate', type: 'date' },
            { label: '开票状态', value: 'nuonuoStatus', type: 'nuonuoStatus' },
            { label: '开票文件', value: 'nuonuoid', type: 'file' },
            { label: '开票时间', value: 'nuonuoDate', type: 'date' },
        ] as ListHeadsFieldOutputModel[],
        searches: [
            { title: '交易ID', checkerId: 'mainFlowId', type: 'text', required: false, sortOrder: 1 },
            { title: '交易金额', checkerId: 'receivable', type: 'text', required: false, sortOrder: 2 },
            { title: '付款确认书编号', checkerId: 'payConfirmId', type: 'text', required: false, sortOrder: 3 },
            { title: '总部公司', checkerId: 'headquarters', type: 'select', options: { ref: 'enterprise_dragon1' },
                required: false, sortOrder: 4
            },
            { title: '申请付款单位', checkerId: 'projectCompany', type: 'text', required: false, sortOrder: 5 },
            { title: '收款单位', checkerId: 'debtUnit', type: 'text', required: false, sortOrder: 6 },
            { title: '交易模式及状态', checkerId: 'transactionStatus', type: 'linkage-select', options: { ref: 'StandardFactoringMode_vk' },
                required: false, sortOrder: 7
            },
            { title: '资产池名称', checkerId: 'capitalPoolName', type: 'text', required: false, sortOrder: 8 },
            { title: '开票状态', checkerId: 'nuonuostatus', type: 'select', options: { ref: 'nuonuoStatus' },
                required: false, sortOrder: 9
            },
        ] as CheckersOutputModel[]


    };
    // 开票申请
    static nuonuocs_blue = {
        heads: [
            { label: '交易ID', value: 'mainFlowId', type: 'mainFlowId', width: '12%' },
            { label: '名称', value: 'debtUnit', type: 'text', width: '6%' },   // 收款单位
            { label: '税号', value: 'taxNumber', type: 'text', width: '6%' },
            { label: '地址', value: 'address', type: 'text', width: '6%' },
            { label: '开户行', value: 'debtUnitBank', type: 'text', width: '6%' },
            { label: '账号', value: 'debtUnitAccount', type: 'text', width: '8%' },
            { label: '邮箱', value: 'debtUnitEmail', type: 'text', width: '7%' },  // 开票信息-收件人邮箱
            { label: '付款确认书编号', value: 'payConfirmId', type: 'text', width: '10%'},
            { label: '融资金额', value: 'receivable', type: 'text', width: '8%' },  // 应收账款金额receive
            { label: '融资放款日', value: 'valueDate', type: 'date', width: '6%' },  // 起息日
            { label: '价税合计', value: 'changereceive', type: 'text', width: '8%' }, // 转让价差
            { label: '单价', value: 'unitPrice', type: 'text', width: '6%' },
            { label: '税额', value: 'taxAmount', type: 'text', width: '8%' },
        ] as ListHeadsFieldOutputModel[],
    };
    // 作废申请
    static nuonuocs_red = {
        heads: [
            { label: '交易ID', value: 'mainFlowId', type: 'mainFlowId', width: '19%' },
            { label: '总部公司', value: 'headquarters', width: '10%' },
            { label: '申请付款单位', value: 'projectCompany', width: '10%' },
            { label: '收款单位', value: 'debtUnit', width: '10%' },
            { label: '付款确认书编号', value: 'payConfirmId', type: 'text', width: '14%' },
            { label: '应收账款金额', value: 'receivable', type: 'money', width: '12%' },
            { label: '转让价款', value: 'changePrice', type: 'money', width: '10%' },
            { label: '资产转让折扣率', value: 'discountRate', width: '10%' },
        ] as ListHeadsFieldOutputModel[],
    };
    // 多标签页，A,B,C,D,E,F......
    // 0 未开票 1开票成功 2开票失败 3 开票中，4红票成功，5红票失败，6红票中
    static readonly config = {
        invoice: {
            title: '开票管理功能',
            tabList: [
                {
                    label: '开票管理',
                    value: 'A',
                    subTabList: [
                        {
                            label: '未开票',
                            value: 'NOINVOICE',
                            canSearch: true,
                            canChecked: true,
                            edit: {
                                headButtons: [
                                    {
                                        label: '发起开票申请',
                                        operate: 'sub_nuonuocs_blue',
                                        post_url: '/',
                                        disabled: false,
                                        click: (xn: XnService, params) => {
                                            const rolesArr = xn.user.roles.filter((x) => {
                                                return x === 'financeOperator' || x === 'financeReviewer';
                                            });
                                            if (!(rolesArr && rolesArr.length)) {
                                                xn.msgBox.open(false, '您好，您的权限不够，仅【财务经办人】、【财务复核人】可进行操作');
                                            } else {
                                                console.log('发起开票申请====', params);
                                                xn.router.navigate([`/xnlogan/record/new/`], {
                                                    queryParams: {
                                                        id: 'sub_nuonuocs_blue',
                                                        relate: 'mainIds',
                                                        relateValue: params,
                                                    }
                                                });
                                            }

                                        },

                                    },
                                ],
                                rowButtons: []
                            },
                            searches: DragonInvoiceTabConfig.dragonapprovalLists.searches,
                            params: 0,
                            headText: [...DragonInvoiceTabConfig.dragonapprovalLists.heads],
                        },
                        {
                            label: '开票中',
                            value: 'INVOICING',
                            canSearch: true,
                            canChecked: true,
                            edit: {
                                headButtons: [],
                                rowButtons: []
                            },
                            params: 3,
                            searches: DragonInvoiceTabConfig.dragonapprovalLists.searches,
                            headText: [...DragonInvoiceTabConfig.dragonapprovalLists.heads],
                        },
                        {
                            label: '开票成功',
                            value: 'INVOICESUCESS',  // INVOICED
                            canSearch: true,
                            canChecked: true,
                            edit: {
                                headButtons: [
                                    {
                                        label: '发起作废申请',
                                        operate: 'sub_nuonuocs_red',
                                        post_url: '/',
                                        disabled: false,
                                        click: (xn: XnService, params) => {
                                            const rolesArr = xn.user.roles.filter((x) => {
                                                return x === 'financeOperator' || x === 'financeReviewer';
                                            });
                                            if (!(rolesArr && rolesArr.length)) {
                                                xn.msgBox.open(false, '您好，您的权限不够，仅【财务经办人】、【财务复核人】可进行操作');
                                            } else {
                                                console.log('发起作废申请===', params);
                                                xn.router.navigate([`/xnlogan/record/new/`], {
                                                    queryParams: {
                                                        id: 'sub_nuonuocs_red',
                                                        relate: 'mainIds',
                                                        relateValue: params,
                                                    }
                                                });
                                            }
                                        },
                                    },
                                ],
                                rowButtons: []
                            },
                            params: 1,
                            searches: DragonInvoiceTabConfig.dragonapprovalLists.searches,
                            headText: [...DragonInvoiceTabConfig.dragonapprovalLists.heads],
                        },
                        {
                            label: '开票失败',
                            value: 'INVOICEFAIL',
                            canSearch: true,
                            canChecked: true,
                            edit: {
                                headButtons: [
                                    {
                                        label: '发起开票申请',
                                        operate: 'sub_nuonuocs_blue',
                                        post_url: '/',
                                        disabled: false,
                                        click: (xn: XnService, params) => {
                                            const rolesArr = xn.user.roles.filter((x) => {
                                                return x === 'financeOperator' || x === 'financeReviewer';
                                            });
                                            if (!(rolesArr && rolesArr.length)) {
                                                xn.msgBox.open(false, '您好，您的权限不够，仅【财务经办人】、【财务复核人】可进行操作');
                                            } else {
                                                console.log('发起开票申请====', params);
                                                xn.router.navigate([`/xnlogan/record/new/`], {
                                                    queryParams: {
                                                        id: 'sub_nuonuocs_blue',
                                                        relate: 'mainIds',
                                                        relateValue: params,
                                                    }
                                                });
                                            }

                                        },
                                    },
                                ],
                                rowButtons: []
                            },
                            params: 2,
                            searches: DragonInvoiceTabConfig.dragonapprovalLists.searches,
                            headText: [...DragonInvoiceTabConfig.dragonapprovalLists.heads],
                        },
                        {
                            label: '作废中',
                            value: 'VOIDINVOICEING',
                            canSearch: true,
                            canChecked: true,
                            edit: {
                                headButtons: [],
                                rowButtons: []
                            },
                            params: 6,
                            searches: DragonInvoiceTabConfig.dragonapprovalLists.searches,
                            headText: [...DragonInvoiceTabConfig.dragonapprovalLists.heads],
                        },
                        {
                            label: '作废成功',
                            value: 'VOIDINVOICESUCESS',
                            canSearch: true,
                            canChecked: true,
                            edit: {
                                headButtons: [
                                    {
                                        label: '发起开票申请',
                                        operate: 'sub_nuonuocs_blue',
                                        post_url: '/',
                                        disabled: false,
                                        click: (xn: XnService, params) => {
                                            const rolesArr = xn.user.roles.filter((x) => {
                                                return x === 'financeOperator' || x === 'financeReviewer';
                                            });
                                            if (!(rolesArr && rolesArr.length)) {
                                                xn.msgBox.open(false, '您好，您的权限不够，仅【财务经办人】、【财务复核人】可进行操作');
                                            } else {
                                                console.log('发起开票申请====', params);
                                                xn.router.navigate([`/xnlogan/record/new/`], {
                                                    queryParams: {
                                                        id: 'sub_nuonuocs_blue',
                                                        relate: 'mainIds',
                                                        relateValue: params,
                                                    }
                                                });
                                            }
                                        },
                                    },
                                ],
                                rowButtons: []
                            },
                            params: 4,
                            searches: DragonInvoiceTabConfig.dragonapprovalLists.searches,
                            headText: [...DragonInvoiceTabConfig.dragonapprovalLists.heads],
                        },
                        {
                            label: '作废失败',
                            value: 'VOIDINVOICEFAIL',
                            canSearch: true,
                            canChecked: true,
                            edit: {
                                headButtons: [],
                                rowButtons: []
                            },
                            params: 5,
                            searches: DragonInvoiceTabConfig.dragonapprovalLists.searches,
                            headText: [...DragonInvoiceTabConfig.dragonapprovalLists.heads],
                        },
                    ],
                    post_url: '/nuonuo/list'
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
 *  诺诺航天开票状态 0 未开票 1开票成功 2开票失败 3 开票中，4作废成功，5作废失败，6作废中
 */
export enum SubTabEnum {
    /** 未开票 */
    NOINVOICE = 1,
    /** 开票中 */
    INVOICING = 2,
    /** 开票成功 */
    INVOICESUCESS = 3,
    /** 开票成功 */
    INVOICEFAIL = 4,
    /** 作废中 */
    VOIDINVOICEING = 5,
    /** 作废成功 */
    VOIDINVOICESUCESS = 6,
    /** 作废失败 */
    VOIDINVOICEFAIL = 7,
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
