
import { ViewContainerRef } from '@angular/core';
import CommBase from 'libs/shared/src/lib/public/component/comm-base';
import { XnService } from 'libs/shared/src/lib/services/xn.service';

export default class AvengerFormTable {
    static invoicelist = { // 保后管理主界面页面配置
        heads: [
            { label: '序号', value: 'mainFlowId', type: 'mainFlowId' },
            { label: '发票号码', value: 'contractId' },
            { label: '发票代码', value: 'invoiceNumInfo', type: 'invoiceNum' },
            { label: '开票日期', value: 'realInvoiceNum', type: 'invoiceNum' },
            { label: '含税金额', value: 'invoiceAmount', type: 'money' },
            { label: '状态', value: 'realInvoiceAmount', type: 'money' },
            { label: '图片名称', value: 'receivable', type: 'money' },

        ],
        searches: [
        ],
    };
    static platinvoiceboth = { // 平台资料初审-经办页面发票
        heads: [
            { label: '发票号码', value: 'invoiceNum' },
            { label: '上游客户发票号码', value: 'upstreamInvoice' },
            { label: '发票代码', value: 'invoiceCode' },
            { label: '开票日期', value: 'invoiceDate', type: 'text' },
            { label: '含税金额', value: 'invoiceAmount', type: 'money' },
            { label: '状态', value: 'status', type: 'xnMainFlowStatus' },
            { label: '历史交易id', value: 'mainFlowId', type: 'mainFlowId' },

        ],
        searches: []
    };
    static platcontractboth = { // 平台资料初审经办页面 采购合同
        heads: [
            { label: '合同编号', value: 'contractNum' },
            { label: '上游客户合同编号', value: 'upstreamContractNum' },
            { label: '合同金额', value: 'contractAmt', type: 'money' },
            { label: '应收账款类型', value: 'receiveType', type: 'moreselect' },
            { label: '上游客户应收账款类型', value: 'upstreamReceiveType', type: 'moreselect1' },

        ],
        searches: []
    };
    static contractlist = { // 保后管理主界面页面配置
        heads: [
            { label: '序号', value: 'mainFlowId', type: 'mainFlowId' },
            { label: '合同编号', value: 'contractId' },
            { label: '应收账款类型', value: 'invoiceNumInfo' },
            { label: '合同扫描件', value: 'invoiceNumInfo' },



        ],
        searches: [
        ],

    };
    static platexceptionslist = {
        heads: [
            { label: '单据类型', value: 'documentType', type: 'Certificateperformance' },
            { label: '首次发货时间', value: 'firstSendTime' },
            { label: '数量', value: 'counts' },
            { label: '金额', value: 'lvyueAmount' },
            { label: '签收方', value: 'consiger' },
            { label: '最后签收时间', value: 'lastSignTime' },
            { label: '备注', value: 'status' },
            { label: '上传方', value: 'owner', type: 'platowner' },

        ],
        searches: [
        ],
    };
    static viewexceptionslist = { //
        heads: [
            { label: '序号', value: 'mainFlowId', type: 'mainFlowId' },
            { label: '单据类型', value: 'contractId' },
            { label: '文件', value: 'invoiceNumInfo', type: 'mfile' },
        ],
        searches: [
        ],

    };
    static vankecontractlist = {
        heads: [
            { label: '合同编号', value: 'contractNum' },
            { label: '合同金额', value: 'contractAmt' },
            { label: '应收账款类型', value: 'receiveType', type: 'moreselect' },
        ],
        searches: [],

    };

    static tableFormlist = {
        title: 'table',
        tabList: [
            {
                label: 'invoice', value: 'invoice',
                canSearch: true,
                canChecked: true,
                edit: {
                    headButtons: [
                        {
                            label: '批量上传图片',
                            operate: 'confirm_receivable',
                            value: '/customer/changecompany',
                            disabled: false,
                            click: (base: CommBase, record) => {
                            }

                        },
                        {
                            label: '批量查验',
                            operate: 'confirm_receivable',
                            value: 'changeManager',
                            disabled: false,

                        },
                        {
                            label: '批量删除',
                            operate: 'confirm_receivable',
                            value: 'changeManager',
                            disabled: false,

                        },
                    ],
                },
                rowButtons: [
                    {
                        title: '查验',
                        type: 'a',
                        // 如果can未定义，则默认是能显示的
                        can: (base: CommBase, record) => false,

                        click: (base: CommBase, record) => {
                            console.log('test click', record);
                        }
                    },
                    {
                        title: '删除',
                        type: 'invoice_detail',
                        // 如果can未定义，则默认是能显示的
                        can: (base: CommBase, record) => true,

                        click: (base: CommBase, record) => {
                            console.log('test click', record);
                        }
                    },

                ],
                searches: AvengerFormTable.invoicelist.searches,
                headText: AvengerFormTable.invoicelist.heads,
                get_url: ''
            },
            {
                label: 'contract', value: 'contract',
                canSearch: true,
                canChecked: true,
                edit: {
                    headButtons: [
                        {
                            label: '新增一份合同',
                            operate: 'confirm_receivable',
                            value: 'addContract',
                            disabled: false,
                            click: (base: CommBase, record, xn: XnService, vcr: ViewContainerRef) => {
                            }

                        },
                    ],
                },
                rowButtons: [
                    {
                        title: '补充',
                        type: 'a',
                        // 如果can未定义，则默认是能显示的
                        can: (base: CommBase, record) => false,

                        click: (base: CommBase, record) => {
                            console.log('test click', record);
                        }
                    },
                    {
                        title: '删除',
                        type: 'invoice_detail',
                        // 如果can未定义，则默认是能显示的
                        can: (base: CommBase, record) => true,

                        click: (base: CommBase, record) => {
                            console.log('test click', record);
                        }
                    },

                ],
                searches: AvengerFormTable.contractlist.searches,
                headText: AvengerFormTable.contractlist.heads,
                get_url: ''
            },
            {
                label: 'lvyue', value: 'lvyue',
                canSearch: true,
                canChecked: true,
                edit: {
                    headButtons: [
                        {
                            label: '新增',
                            operate: 'confirm_receivable',
                            value: 'lvyue',
                            disabled: false,
                            click: (base: CommBase, record) => {
                                console.log('test click', record);
                            }

                        },
                    ],
                },
                rowButtons: [
                    {
                        title: '新增',
                        type: 'a',
                        // 如果can未定义，则默认是能显示的
                        can: (base: CommBase, record) => false,

                        click: (base: CommBase, record) => {
                            console.log('test click', record);
                        }
                    },
                    {
                        title: '删除',
                        type: 'invoice_detail',
                        // 如果can未定义，则默认是能显示的
                        can: (base: CommBase, record) => true,

                        click: (base: CommBase, record) => {
                            console.log('test click', record);
                        }
                    },

                ],
                searches: AvengerFormTable.viewexceptionslist.searches,
                headText: AvengerFormTable.viewexceptionslist.heads,
                get_url: ''
            },
            {
                label: 'invoiceBoth', value: 'invoiceBoth',
                canSearch: false,
                canChecked: false,
                searches: [],
                edit: {
                    rowButtons: [
                        {
                            title: '查看详情',
                            type: 'invoice_detail',
                            // 如果can未定义，则默认是能显示的
                            can: (base: CommBase, record) => true,
                            click: (base: CommBase, record) => {
                                console.log('test click', record);
                            }
                        },

                    ],
                },
                headText: AvengerFormTable.platinvoiceboth.heads,
                get_url: ''
            },
            {
                label: 'contactboth', value: 'contractboth',
                canSearch: false,
                canChecked: false,
                searches: [],
                edit: {
                    rowButtons: [
                        {
                            label: '补录',
                            operate: 'confirm_receivable',
                            value: 'lvyue',
                            disabled: false,
                            click: (base: CommBase, record) => {
                                console.log('test click', record);
                            }

                        },
                    ],
                },
                headText: AvengerFormTable.platcontractboth.heads,
                get_url: ''
            },
            {
                label: 'lvyueBoth', value: 'lvyueBoth',
                canSearch: false,
                canChecked: false,
                searches: [],
                edit: {
                    rowButtons: [
                        {
                            label: '补录',
                            operate: 'confirm_receivable',
                            value: 'lvyue',
                            disabled: false,
                            click: (base: CommBase, record) => {
                                console.log('test click', record);
                            }

                        },
                    ],
                },
                headText: AvengerFormTable.platexceptionslist.heads,
                get_url: ''
            },
            {
                label: 'contractDownstream', value: 'contractDownstream',
                canSearch: false,
                canChecked: false,
                searches: [],
                edit: {
                    rowButtons: [
                        {
                            label: '补录',
                            operate: 'confirm_receivable',
                            value: 'lvyue',
                            disabled: false,
                            click: (base: CommBase, record) => {
                                console.log('test click', record);
                            }

                        },
                    ],
                },
                headText: AvengerFormTable.vankecontractlist.heads,
                get_url: ''
            },
        ]
    };
    static readonly add = {
        can: (xn: XnService) => {
            return false;
        },
    };
}
