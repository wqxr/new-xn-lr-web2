export default class TabConfig {
    // 确认应收账款金额
    static receivable = {
        heads: [
            { label: '交易ID', value: 'mainFlowId', type: 'mainFlowId' },
            { label: '基础交易合同编号', value: 'contractId' },
            { label: '提单发票号码', value: 'invoiceNumInfo', type: 'invoiceNum' },
            { label: '实际上传发票号码', value: 'realInvoiceNum', type: 'invoiceNum' },
            { label: '提单发票总金额', value: 'invoiceAmount', type: 'money' },
            { label: '实际上传交易发票总金额', value: 'realInvoiceAmount', type: 'money' },
            { label: '应收账款金额', value: 'receivable', type: 'money' },
            { label: '应收账款到期日', value: 'factoringEndDate' },
            { label: '债权单位名称', value: 'debtUnit' },
            { label: '债权单位联系人', value: 'debtUser' },
            { label: '债权单位联系人手机号', value: 'debtUserMobile' },
            { label: '债权单位银行账户', value: 'debtAccount' },
            { label: '债权单位银行开户行', value: 'debtBank' },
            { label: '债务单位名称', value: 'projectCompany' },
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
                checkerId: 'receivable',
                type: 'text',
                required: false,
                number: 2
            }
        ],
    };
    // 集团公司 付款清单
    static paymentList = {
        heads: [
            { label: '交易ID', value: 'mainFlowId', type: 'mainFlowId' },
            { label: '基础交易合同编号', value: 'contractId' },
            { label: '提单发票号码', value: 'invoiceNumInfo', type: 'invoiceNum' },
            { label: '实际上传发票号码', value: 'realInvoiceNum', type: 'invoiceNum' },
            { label: '提单发票总金额', value: 'invoiceAmount', type: 'money', sort: true },
            { label: '实际上传交易发票总金额', value: 'realInvoiceAmount', type: 'money', sort: true },
            { label: '应收账款金额', value: 'receivable', type: 'money', sort: true },
            { label: '应收账款到期日', value: 'factoringEndDate', sort: true },
            { label: '债权单位名称', value: 'debtUnit' },
            { label: '债权单位联系人', value: 'debtUser' },
            { label: '债权单位联系人手机号', value: 'debtUserMobile' },
            { label: '债权单位银行账户', value: 'debtAccount' },
            { label: '债权单位银行开户行', value: 'debtBank' },
            { label: '债务单位名称', value: 'projectCompany' },
            { label: '付款确认书', value: 'payFile', type: 'contract' },
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
                checkerId: 'receivable',
                type: 'text',
                required: false,
                number: 2
            }
        ],
    };
    // 批量签署合同(金地)
    static signContract = {
        heads: [
            { label: '交易ID', value: 'mainFlowId', type: 'mainFlowId' },
            { label: '申请付款单位', value: 'projectCompany' },
            { label: '收款单位', value: 'debtUnit' },
            { label: '总部公司', value: 'headquarters' },
            { label: '合同编号', value: 'contractId' },
            { label: '发票号码', value: 'realInvoiceNum', type: 'invoiceNum' }, // 实际上传发票
            { label: '发票金额', value: 'realInvoiceAmount', type: 'money' },
            { label: '应收账款金额', value: 'receivable', type: 'money' },
            { label: '付款确认书编号', value: 'payConfirmId' },
            { label: '付款确认书', value: 'payFile', type: 'contract' },
        ],
        searches: [
            {
                title: '总部公司',
                checkerId: 'headquarters',
                type: 'text',
                required: false,
                number: 1
            },
            {
                title: '付款确认书编号',
                checkerId: 'payConfirmId',
                type: 'text',
                required: false,
                number: 2
            },
            {
                title: '申请付款单位',
                checkerId: 'projectCompany',
                type: 'text',
                required: false,
                number: 3
            },
            {
                title: '合同编号',
                checkerId: 'contractId',
                type: 'text',
                required: false,
                number: 4
            },
            {
                title: '收款单位',
                checkerId: 'debtUnit',
                type: 'text',
                required: false,
                number: 5
            },
            {
                title: '发票号',
                checkerId: 'realInvoiceNum',
                type: 'text',
                required: false,
                number: 6
            },
        ],
    };

    // 批量签署合同(万科abs_雅居乐)
    static yajvleSignContract = {
        heads: [
            { label: '交易ID', value: 'mainFlowId', type: 'mainFlowId' },
            { label: '申请付款单位', value: 'projectCompany' },
            { label: '收款单位', value: 'debtUnit' },
            { label: '总部公司', value: 'headquarters' },
            { label: '合同编号', value: 'contractId' },
            { label: '发票号码', value: 'realInvoiceNum', type: 'invoiceNum' }, // 实际上传发票
            { label: '发票金额', value: 'realInvoiceAmount', type: 'money' },
            { label: '应收账款金额', value: 'receivable', type: 'money' },
            { label: '付款确认书编号', value: 'payConfirmId' },
            { label: '付款确认书', value: 'pdfProjectFiles', type: 'contract' },
        ],
        searches: [
            {
                title: '总部公司',
                checkerId: 'headquarters',
                type: 'text',
                required: false,
                number: 1
            },
            {
                title: '付款确认书编号',
                checkerId: 'payConfirmId',
                type: 'text',
                required: false,
                number: 2
            },
            {
                title: '申请付款单位',
                checkerId: 'projectCompany',
                type: 'text',
                required: false,
                number: 3
            },
            {
                title: '合同编号',
                checkerId: 'contractId',
                type: 'text',
                required: false,
                number: 4
            },
            {
                title: '收款单位',
                checkerId: 'debtUnit',
                type: 'text',
                required: false,
                number: 5
            },
            {
                title: '发票号',
                checkerId: 'realInvoiceNum',
                type: 'text',
                required: false,
                number: 6
            },
        ],
    };
    // 标准保理 - 交易列表
    static standardFactoringList = {
        heads: [
            { label: '交易ID', value: 'mainFlowId', type: 'mainFlowId' },
            { label: '申请付款单位', value: 'projectCompany' },
            { label: '收款单位', value: 'debtUnit' },
            { label: '总部公司', value: 'headquarters', type: 'headquarters' },
            { label: '付款确认书编号', value: 'payConfirmId' },
            { label: '交易金额', value: 'receivable', type: 'money' },
            { label: '利率', value: 'assigneePrice' },
            { label: '交易状态', value: 'status', type: 'xnMainFlowStatus' },
            { label: '保理融资到期日', value: 'factoringEndDate', type: 'date' },
            { label: '合同类型', value: 'debtReceivableType', type: 'xnContractType' },
            { label: '万科类型', value: 'wkType', type: 'wkType' },
            { label: '资产池名称', value: 'capitalPoolName' },
            { label: '创建时间', value: 'createTime', type: 'date' },
        ],
        searches: [
            {
                title: '交易ID',
                checkerId: 'mainFlowId',
                type: 'text',
                required: false,
                number: 1
            }, {
                title: '创建时间',
                checkerId: 'createTime',
                type: 'quantum',
                required: false,
                number: 2
            },
            {
                title: '总部公司',
                checkerId: 'headquarters',
                type: 'text',
                required: false,
                number: 7
            },
            {
                title: '资产池名称',
                checkerId: 'capitalPoolName',
                type: 'text',
                required: false,
                number: 4
            },
            {
                title: '申请付款单位',
                checkerId: 'projectCompany',
                type: 'text',
                required: false,
                number: 5
            },
            {
                title: '收款单位',
                checkerId: 'debtUnit',
                type: 'text',
                required: false,
                number: 3
            },
            {
                title: '交易模式及状态',
                checkerId: 'status',
                type: 'linkage-select',
                options: { ref: 'StandardFactoringMode' },
                required: false,
                number: 6
            },
            {
                title: '万科类型',
                checkerId: 'wkType',
                type: 'select',
                options: { ref: 'wkType' },
                required: false,
                number: 8
            },
        ],
    };
    // 标准保理 - 补充标准保理交易信息（保理到期日，利率）
    static standardFactoringSupplementInfoList = {
        heads: [
            { label: '交易ID', value: 'mainFlowId', type: 'mainFlowId' },
            { label: '申请付款单位', value: 'projectCompany' },
            { label: '收款单位', value: 'debtUnit' },
            { label: '总部公司', value: 'headquarters'},
            { label: '发票号码', value: 'realInvoiceNum', type: 'invoiceNum' }, // 实际上传发票
            { label: '发票金额', value: 'invoiceAmount', type: 'money' },
            // { label: '应收账款金额', value: 'receivable', type: 'money' },
            // { label: '利率', value: 'assigneePrice' },
            { label: '应收账款金额', value: 'receive', type: 'money' },
            { label: '利率', value: 'discountRate' },
            { label: '保理融资到期日', value: 'factoringEndDate', type: 'date' },
        ],
        searches: []
    };
    // 标准保理 - 万科 补充信息
    static vankeFactoringSupplementInfoList = {
        heads: [
            { label: '交易ID', value: 'mainFlowId', type: 'mainFlowId' },
            { label: '基础交易合同文件', value: 'contractFile', type: 'file' },
            { label: '合同签订日期', value: 'contractSignTime' },
            { label: '履约证明文件', value: 'AppointFile', type: 'file' },
            { label: '累计确认产值', value: 'cumulativelyOutputValue', type: 'money' },
        ],
        searches: [
            {
                title: '交易ID',
                checkerId: 'mainFlowId',
                type: 'text',
                required: false,
                number: 1
            }
        ]
    };
    // 地产供应链 雅居乐补充协议
    static estateSupplyChainSupplementaryAgreementList = {
        // 重签列表
        heads_do: [
            { label: '交易ID', value: 'mainFlowId', type: 'mainFlowId' },
            { label: '供应商', value: 'debtUnit' },
            { label: '项目公司', value: 'projectCompany' },
            { label: '总部公司', value: 'headquarters', type: 'headquarters' },
            { label: '交易状态', value: 'status', type: 'standardFactoring' }, // 地产供应链交易类型 6 此处特殊情况，固定为万科模式
            { label: '供应商是否已签署合同', value: 'isSupplierSign', type: 'xnCaApply' },
            { label: '原协议', value: 'contract2_yajule_pre', type: 'contract' },
            { label: '新协议', value: 'contract2_yajule_new', type: 'contract' },
            { label: '是否已重签《应收账款转让合同》', value: 'yyFlag', type: 'xnYjlIsResignStatus' },
        ],
        searches_do: [
            {
                title: '供应商名称',
                checkerId: 'debtUnit',
                type: 'text',
                required: false,
                number: 1
            },
            {
                title: '是否已重签《应收账款转让合同》',
                checkerId: 'yyFlag',
                type: 'select',
                options: { ref: 'yjlIsResignStatus' },
                required: false,
                number: 2
            },
            {
                title: '项目公司名称',
                checkerId: 'projectCompany',
                type: 'text',
                required: false,
                number: 3
            }
        ],
        // 待补充列表
        heads_do_not: [
            { label: '交易ID', value: 'mainFlowId', type: 'mainFlowId' },
            { label: '供应商', value: 'debtUnit' },
            { label: '项目公司', value: 'projectCompany' },
            { label: '总部公司', value: 'headquarters', type: 'headquarters' },
            { label: '供应商是否已签署合同', value: 'isSupplierSign', type: 'xnCaApply' },
            { label: '补充协议状态', value: 'yyFlag', type: 'xnSupplementaryAgreementStatus' },
            { label: '补充协议', value: 'contracts', type: 'contract' },
        ],
        searches_do_not: [
            {
                title: '供应商名称',
                checkerId: 'debtUnit',
                type: 'text',
                required: false,
                number: 1
            },
            {
                title: '补充协议状态',
                checkerId: 'yyFlag',
                type: 'select',
                options: { ref: 'supplementaryAgreementStatus' },
                required: false,
                number: 2
            },
            {
                title: '项目公司名称',
                checkerId: 'projectCompany',
                type: 'text',
                required: false,
                number: 3
            }
        ],
    };
    static readonly config = {
        receivable: {
            title: '确认应收账款金额',
            tabList: [
                {
                    label: '未确认应收账款金额', value: 'do_not',
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
                        rowButtons: [
                            {
                                label: '修改应收账款金额并回退',
                                operate: 'edit_receivable',
                                value: '/custom/jindi_v3/project/edit_receivable'
                            }
                        ]
                    },
                    searches: TabConfig.receivable.searches,
                    headText: TabConfig.receivable.heads,
                    get_url: '/custom/jindi_v3/project/project_not_confirm_receivable'
                },
                {
                    label: '已确认应收账款金额', value: 'do_down',
                    canSearch: true,
                    canChecked: false,
                    searches: TabConfig.receivable.searches,
                    headText: TabConfig.receivable.heads,
                    get_url: '/custom/jindi_v3/project/project_has_confirm_receivable'
                }
            ]
        },
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
                                value: '/custom/jindi_v3/project/get_headquarters',
                                disabled: true,
                                value2: '/custom/jindi_v3/project/sign_headquarters' // 保存签署合同信息
                            }
                        ],
                        rowButtons: []
                    },
                    searches: TabConfig.paymentList.searches,
                    headText: TabConfig.paymentList.heads,
                    get_url: '/custom/jindi_v3/project/headquarters_not_sign_list',
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
                    get_url: '/custom/jindi_v3/project/headquarters_has_sign_list',
                }
            ]
        },
        signContract: {
            title: '批量签署合同',
            tabList: [
                {
                    label: '未签署合同', value: 'do_not',
                    canChecked: true,
                    canSearch: true,
                    edit: {
                        headButtons: [
                            {
                                label: '批量签署',
                                value: '/custom/jindi_v3/project/sign_contracts',
                                disabled: true,
                                operate: 'sign_contracts',
                                value2: '/custom/jindi_v3/project/update_contracts' // 保存签署合同信息
                            }
                        ],
                        rowButtons: [
                            {
                                label: '签署',
                                value: '/custom/jindi_v3/project/sign_contracts',
                                operate: 'sign_contract',
                                value2: '/custom/jindi_v3/project/update_contracts' // 保存签署合同信息
                            },
                            // { label: 'stop_step', operate: 'sign_contracts', value: '' },
                        ]
                    },
                    searches: TabConfig.signContract.searches,
                    headText: TabConfig.signContract.heads,
                    get_url: '/custom/jindi_v3/project/get_contracts_not',
                },
                {
                    label: '已签署合同', value: 'do_down',
                    canChecked: true,
                    canSearch: true,
                    edit: {
                        headButtons: [
                            {
                                label: '选择资金渠道',
                                operate: 'choose_money_channel',
                                value: '/custom/jindi_v3/project/choose_money_channel',
                                disabled: true
                            },
                            {
                                label: '进入付款管理',
                                operate: 'into_payment',
                                value: '/custom/jindi_v3/project/into_pay',
                                disabled: true
                            },
                        ],
                        rowButtons: []
                    },
                    searches: [...TabConfig.signContract.searches,
                    ...[{
                        title: '资金渠道',
                        checkerId: 'moneyChannel',
                        type: 'select',
                        options: { ref: 'moneyChannel' },
                        required: false,
                        number: 7,
                        base: 'number'
                    }]
                    ],
                    headText: [...TabConfig.signContract.heads,
                    ...[{
                        label: '资金渠道',
                        value: 'moneyChannel',
                        type: 'xnMoneyChannel'
                    }]
                    ],
                    get_url: '/custom/jindi_v3/project/get_contracts_has',
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
        standardFactoringList: {
            title: '交易列表',
            tabList: [
                {
                    label: '所有交易', value: 'do_not',
                    canSearch: true,
                    canChecked: true,
                    edit: {
                        headButtons: [
                            // {label: '选择资金渠道', value: '/custom/jindi_v3/project/choose_money_channel', disabled: true},
                            {
                                label: '补充信息',
                                value: '',
                                operate: 'supplement_info',
                                disabled: true
                            },
                        ],
                        rowButtons: []
                    },
                    searches: TabConfig.standardFactoringList.searches,
                    headText: TabConfig.standardFactoringList.heads,
                    get_url: '/custom/vanke_v5/list/main',
                }
            ]
        },

        standardFactoringSupplementInfo: {
            title: '保理商补充信息',
            tabList: [
                {
                    label: '待补充交易列表', value: 'do_not',
                    canSearch: true,
                    canChecked: true,
                    edit: {
                        headButtons: [],
                        rowButtons: []
                    },
                    searches: TabConfig.standardFactoringSupplementInfoList.searches,
                    headText: TabConfig.standardFactoringSupplementInfoList.heads,
                    get_url: '',
                }
            ]
        },
        // 万科模式-待补充信息
        vankeFactoringSupplementInfo: {
            title: '后补充信息',
            tabList: [
                {
                    label: '待补录交易', value: 'do_not',
                    canSearch: true,
                    canChecked: false,
                    edit: {
                        headButtons: [],
                        rowButtons: [
                            {
                                label: '补录',
                                value: '/custom/vanke_v5/houbu_msg/replenish',
                                operate: 'vanke_supplement_info',
                            },
                        ]
                    },
                    searches: TabConfig.vankeFactoringSupplementInfoList.searches,
                    headText: TabConfig.vankeFactoringSupplementInfoList.heads,
                    get_url: '/custom/vanke_v5/houbu_msg/wait_deal',
                },
                {
                    label: '无法补录交易', value: 'do_down',
                    canSearch: true,
                    canChecked: false,
                    edit: {
                        headButtons: [],
                        rowButtons: [
                            {
                                label: '补录',
                                value: '/custom/vanke_v5/houbu_msg/replenish',
                                operate: 'vanke_supplement_info',
                            },
                        ]
                    },
                    searches: TabConfig.vankeFactoringSupplementInfoList.searches,
                    headText: TabConfig.vankeFactoringSupplementInfoList.heads,
                    get_url: '/custom/vanke_v5/houbu_msg/un_wait_deal',
                }
            ]
        },
        // 后补信息
        estateSupplyChainSupplementaryAgreement: {
            title: '补充协议',
            tabList: [
                {
                    label: '重签列表', value: 'do_not',
                    canSearch: true,
                    canChecked: true,
                    edit: {
                        headButtons: [
                            {
                                label: '重新签署',
                                operate: 'repeat-sign',
                                get_api: '/custom/vanke_v5/resign/resign',
                                post_api: '/custom/vanke_v5/resign/resign_update',
                                disabled: true
                            }
                        ],
                        rowButtons: []
                    },
                    searches: TabConfig.estateSupplyChainSupplementaryAgreementList.searches_do,
                    headText: TabConfig.estateSupplyChainSupplementaryAgreementList.heads_do,
                    get_url: '/custom/vanke_v5/resign/resign_list'
                },
                {
                    label: '待补充列表', value: 'do_down',
                    canSearch: true,
                    canChecked: true,
                    edit: {
                        headButtons: [
                            {
                                label: '发起补充协议',
                                operate: 'initiate-supplemental-agreement',
                                get_api: '/custom/vanke_v5/yjl_add/sign_contracts',
                                post_api: '/custom/vanke_v5/yjl_add/save_add_contracts',
                                disabled: true
                            }
                        ],
                        rowButtons: []
                    },
                    searches: TabConfig.estateSupplyChainSupplementaryAgreementList.searches_do_not,
                    headText: TabConfig.estateSupplyChainSupplementaryAgreementList.heads_do_not,
                    get_url: '/custom/vanke_v5/yjl_add/add_list'
                }
            ]
        },
        yajvleSignContract: {
            title: '批量签署合同（雅居乐）',
            tabList: [
                {
                    label: '未签署合同', value: 'do_not',
                    canChecked: true,
                    canSearch: true,
                    edit: {
                        headButtons: [
                            {
                                label: '批量签署',
                                value: '/custom/vanke_v5/contract/sign_contracts',
                                operate: 'yjl_sign_contracts',
                                disabled: true,
                                value2: '/custom/vanke_v5/contract/update_contracts' // 保存签署合同信息
                            }
                        ],
                        rowButtons: [
                            {
                                label: '签署',
                                value: '/custom/vanke_v5/contract/sign_contracts',
                                operate: 'yjl_sign_contract',
                                value2: '/custom/vanke_v5/contract/update_contracts' // 保存签署合同信息
                            },
                        ]
                    },
                    searches: TabConfig.yajvleSignContract.searches,
                    headText: TabConfig.yajvleSignContract.heads,
                    get_url: '/custom/vanke_v5/contract/get_contracts_not',
                },
                {
                    label: '已签署合同',
                    value: 'do_down',
                    canChecked: true,
                    canSearch: true,
                    searches: TabConfig.yajvleSignContract.searches,
                    headText: TabConfig.yajvleSignContract.heads,
                    get_url: '/custom/vanke_v5/contract/get_contracts_has',
                }
            ]
        },
    };

    static get(name) {
        return this.config[name];
    }
}
