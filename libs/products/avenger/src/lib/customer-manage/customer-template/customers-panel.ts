import CommBase from 'libs/shared/src/lib/public/component/comm-base';
export default class TabConfig {
    static customerList = {
        heads: [
            { label: '企业ID', value: 'mainFlowId', type: 'mainFlowId' },
            { label: '企业名称', value: 'contractId' },
            { label: '白名单状态', value: 'invoiceNumInfo', type: 'invoiceNum' },
            { label: '保理类型', value: 'invoiceNumInfo', type: 'invoiceNum' },
            { label: '确权凭证', value: 'realInvoiceNum', type: 'invoiceNum' },
            { label: '还款方', value: 'invoiceNumInfo', type: 'invoiceNum' },
            { label: '过会情况', value: 'invoiceAmount', type: 'money' },
            { label: '供应商类型', value: 'realInvoiceAmount', type: 'money' },
            { label: '保证金比例', value: 'depositRate'},
            { label: '当前综合费率(%)', value: 'receivable', type: 'money' },
            { label: '当前保理使用费率(%)', value: 'factoringEndDate' },
            { label: '当前保理服务费率(%)', value: 'debtUnit' },
            { label: '当前平台服务费率(%)', value: 'debtUser' },
            { label: '当前期限(天)', value: 'debtUserMobile' },
            { label: '当前最大额度(元)', value: 'debtAccount' },
            { label: '已使用额度(元)', value: 'debtBank' },
            { label: '剩余额度(元)', value: 'projectCompany' },
            { label: '管户客户经理', value: 'manager' }
        ],
        searches: [
            {
                title: '企业名称',
                checkerId: 'orgName',
                type: 'text',
                required: false,
                number: 1,
            },
            {
                title: '白名单状态',
                checkerId: 'whiteStatus',
                type: 'checkbox',
                options: { ref: 'whiteNameStatus' },
                required: false,
                number: 4,
                // base: 'number',
                // options: [
                //     { label: '人工白名单', value: 2 },
                //     { label: '非白名单', value: 0 },
                //     { label: '系统白名单', value: 1}
                // ]

            },
            {
                title: '过会情况',
                checkerId: 'pastStatus',
                type: 'select',
                options: { ref: 'goMeetingQuestion' },
                required: false,
                number: 3,
                base: 'number',

            },
            {
                title: '供应商类型',
                checkerId: 'supplierType',
                type: 'select',
                options: { ref: 'companyType' },
                required: false,
                number: 2,
                base: 'number',


            }
        ],
    };
    static changeCompanylist = {
        heads: [
            { label: '企业ID', value: 'mainFlowId', type: 'mainFlowId' },
            { label: '企业名称', value: 'contractId' },
            { label: '白名单状态', value: 'invoiceNumInfo', type: 'invoiceNum' },
            { label: '保理类型', value: 'factorType',  },
            { label: '确权凭证', value: 'realInvoiceNum', type: 'invoiceNum' },
            { label: '过会情况', value: 'invoiceAmount', type: 'money' },
            { label: '供应商类型', value: 'realInvoiceAmount', type: 'money' },
            { label: '系统保理使用费率%', value: 'receivable', type: 'money' },
            { label: '系统保理服务费率%', value: 'factoringEndDate' },
            { label: '系统平台服务费率%', value: 'debtUnit' },
            { label: '系统期限', value: 'debtUser' },
            { label: '系统最大额度', value: 'debtUserMobile' },
            { label: '人工保理使用费率%', value: 'debtAccount' },
            { label: '人工保理服务费率%', value: 'debtBank' },
            { label: '人工平台服务费率%', value: 'projectCompany' },
            { label: '人工期限', value: 'manager' },
            { label: '人工最大额度', value: 'manager' },
            // { label: '管户客户经理', value: 'manager' },
            // { label: '保理类型', value: 'manager' },
            { label: '保证金比例', value: 'manager' },

            { label: '过会备注', value: 'manager' }
        ],
        searches: [
            {
                title: '选择调整企业',
                checkerId: 'Chosecompany',
                type: 'file',
                required: true,
                number: 1

            },
            {
                title: '过会文件',
                checkerId: 'MeetingFile',
                type: 'file',
                required: true,
                number: 2
            },
        ],

    };
    static changeCustomerlist = {// 调整管户客户经理数据
        heads: [
            { label: '企业ID', value: 'mainFlowId', type: 'mainFlowId' },
            { label: '企业名称', value: 'contractId' },
            { label: '白名单状态', value: 'invoiceNumInfo', type: 'invoiceNum' },
            { label: '确权凭证', value: 'realInvoiceNum', type: 'invoiceNum' },
            { label: '过会情况', value: 'invoiceAmount', type: 'money' },
            { label: '供应商类型', value: 'realInvoiceAmount', type: 'money' },
            { label: '保证金比例', value: 'depositRate', type: 'money' },
            { label: '管户客户经理', value: 'manager' },
        ],
        searches: [
            {
                title: '选择调整供应商',
                checkerId: 'Chosecompanytype',
                type: 'file',
                required: true,
                number: 1

            },
            {
                title: '过会文件',
                checkerId: 'MeetingFile',
                type: 'file',
                required: true,
                number: 2
            },
            {
                title: '过会文件',
                checkerId: 'suggest',
                type: 'textarea',
                required: true,
                number: 3
            }
        ],

    };

    //
    static customer = {// 万科供应商保理业务 页面配置
        title: '普惠通-采购融资客户管理',
        tabList: [
            {
                label: '普惠通', value: 'do_not',
                canSearch: true,
                canChecked: true,
                edit: {
                    headButtons: [
                        {
                            label: '调整企业',
                            operate: 'confirm_receivable',
                            value: '/customer/changecompany',
                            disabled: false,
                            click: (base: CommBase, record) => {
                                console.log('test click', record);
                            }

                        },
                        {
                            label: '调整管户经理',
                            operate: 'confirm_receivable',
                            value: 'changeManager',
                            disabled: false,

                        },
                    ],
                    // rowButtons: [
                    //     {
                    //         label: '修改应收账款金额并回退',
                    //         operate: 'edit_receivable',
                    //         value: '/custom/jindi_v3/project/edit_receivable'
                    //     }
                    // ]
                },
                searches: TabConfig.customerList.searches,
                headText: TabConfig.customerList.heads,
                get_url: '/custom/avenger/customer_manager/list'
            },
            // {
            //     label: '地产类业务', value: 'do_down',
            //     canSearch: true,
            //     canChecked: false,
            //     searches: TabConfig.customerList.searches,
            //     headText: TabConfig.customerList.heads,
            //     get_url: ''
            // },
            // {
            //     label: '两票业务', value: 'do_up',
            //     canSearch: true,
            //     canChecked: false,
            //     searches: TabConfig.customerList.searches,
            //     headText: TabConfig.customerList.heads,
            //     get_url: ''
            // }

        ]
    };

    static changeCustomermanager = {
        title: '调整企业',
        tabList: [
            {
                label: '', value: 'do_not',
                canSearch: true,
                canChecked: true,
                edit: {
                    headButtons: [
                        {
                            label: '白名单状态',
                            operate: 'confirm_receivable',
                            value: '/customer/changecompany',
                            disabled: false,
                            click: (base: CommBase, record) => {
                            },

                        },
                        {
                            label: '保理类型',
                            operate: 'factoring_type',
                            value: '/custom/jindi_v3/project/check_project_flag',
                            disabled: false,

                        },
                        {
                            label: '确权凭证',
                            operate: 'confirm_receivable',
                            value: '/custom/jindi_v3/project/check_project_flag',
                            disabled: false,

                        },
                        {
                            label: '过会情况',
                            operate: 'confirm_receivable',
                            value: '/custom/jindi_v3/project/check_project_flag',
                            disabled: false,

                        },
                        {
                            label: '供应商类型',
                            operate: 'confirm_receivable',
                            value: '/custom/jindi_v3/project/check_project_flag',
                            disabled: false,
                        },
                        {
                            label: '保证金比例',
                            operate: 'confirm_receivable',
                            value: '/custom/jindi_v3/project/check_project_flag',
                            disabled: false,
                        },
                    ],
                    // rowButtons: [
                    //     {
                    //         label: '修改应收账款金额并回退',
                    //         operate: 'edit_receivable',
                    //         value: '/custom/jindi_v3/project/edit_receivable'
                    //     }
                    // ]
                },
                searches: TabConfig.changeCompanylist.searches,
                headText: TabConfig.changeCompanylist.heads,
                get_url: '/custom/jindi_v3/project/project_not_confirm_receivable'
            }
        ]
    };
    static changeCustomer = {// 调整管户客户经理数据
        title: '调整管户客户经理',
        tabList: [
            {
                label: '', value: 'do_not',
                canSearch: true,
                canChecked: true,
                edit: {
                    headButtons: [
                        {
                            label: '管户客户经理',
                            operate: 'confirm_receivable',
                            value: '/customer/changecompany',
                            disabled: false,
                            click: (base: CommBase, record) => {
                                console.log('test click', record);
                            },

                        },
                    ],
                },
                searches: TabConfig.changeCustomerlist.searches,
                headText: TabConfig.changeCustomerlist.heads,
                get_url: ''
            }
        ]
    };
    static addCompany = {
        title: '添加企业',
        heads: [
            { label: '企业ID', value: 'mainFlowId', type: 'mainFlowId' },
            { label: '企业名称', value: 'contractId' },
            { label: '企业类型', value: 'invoiceNumInfo', type: 'invoiceNum' },
            { label: '企业创建时间', value: 'realInvoiceNum', type: 'invoiceNum' },
        ],
        searches: [
            {
                title: '企业名称',
                checkerId: 'orgName',
                type: 'text',
                required: false,
                number: 1

            },
        ],
        url: '/custom/avenger/customer_manager/org_choose',
    };

    static xn: any;
}
