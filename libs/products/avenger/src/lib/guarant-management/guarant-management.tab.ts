
export default class GuarantTabConfig {
    static guarantManagementlist = { // 保后管理主界面页面配置
        heads: [
            { label: '序号', value: 'mainFlowId', type: 'mainFlowId' },
            { label: '万科供应商名称', value: 'contractId' },
            { label: '供应商类型', value: 'invoiceNumInfo', type: 'invoiceNum' },
            { label: '保后监测报告', value: 'realInvoiceNum', type: 'invoiceNum' },
            { label: '监测报告更新时间', value: 'invoiceAmount', type: 'money' },
            { label: '自查报告', value: 'realInvoiceAmount', type: 'money' },
            { label: '自查报告更新时间', value: 'receivable', type: 'money' },
            { label: '预警信息', value: 'factoringEndDate' },
            { label: '提示信息', value: 'debtUnit' },

        ],
        searches: [
            {
                title: '万科供应商名称',
                checkerId: 'orgName',
                type: 'text',
                required: false,
                number: 1,
            },
        ],
    };
    static guarantManager = {// 万科供应商保理业务 页面配置
        title: '保后管理',
        tabList: [
            {
                label: '普惠通', value: 'do_not',
                canSearch: true,
                canChecked: true,
                searches: GuarantTabConfig.guarantManagementlist.searches,
                headText: GuarantTabConfig.guarantManagementlist.heads,
                get_url: '/custom/avenger/guarantee_manager/list'
            },

        ]
    };
    static guarantReport = { // 保后管理主界面页面配置
        heads: [
            { label: '序号', value: 'mainFlowId', type: 'mainFlowId' },
            { label: '报告文件', value: 'contractId' },
            { label: '更新时间', value: 'invoiceNumInfo', type: 'invoiceNum' },



        ],
        searches: [
            {
                title: '时间范围',
                checkerId: 'timeframe',
                type: 'quantum',
                required: false,
                number: 1,
            },
        ],

    };
    static viewexceptionslist = { // 保后管理主界面页面配置
        heads: [
            { label: '序号', value: 'mainFlowId', type: 'mainFlowId' },
            { label: '预警类型', value: 'contractId' },
            { label: '预警内容', value: 'invoiceNumInfo', type: 'invoiceNum' },
            { label: '预警时间', value: 'invoiceNumInfo', type: 'invoiceNum' },
            { label: '预警状态', value: 'invoiceNumInfo', type: 'invoiceNum' },
            { label: '处理时间', value: 'invoiceNumInfo', type: 'invoiceNum' },
            { label: '处理人', value: 'invoiceNumInfo', type: 'invoiceNum' },

        ],
        searches: [
            {
                title: '时间范围',
                checkerId: 'timeframe',
                type: 'quantum',
                required: false,
                number: 1,
                value: '',
            },
            {
                title: '预警状态',
                checkerId: 'Earlywarningstate',
                type: 'select',
                options: { ref: 'Earlywarningstate' },
                required: false,
                number: 2,
            },
        ],

    };
    static Promptinformationlist = { // 保后管理查看异常提示信息界面配置
        heads: [
            { label: '序号', value: 'mainFlowId', type: 'mainFlowId' },
            { label: '提示类型', value: 'contractId' },
            { label: '提示内容', value: 'invoiceNumInfo', type: 'invoiceNum' },
            { label: '提示时间', value: 'invoiceNumInfo', type: 'invoiceNum' },
        ],
        searches: [
            {
                title: '时间范围',
                checkerId: 'timeframe',
                type: 'quantum',
                required: false,
                number: 1,
            },
        ],

    };
    static getviewexceptionslist = {
        title: '查看异常',
        tabList: [
            {
                label: '预警信息', value: 'do_not',
                canSearch: true,
                canChecked: true,
                searches: GuarantTabConfig.viewexceptionslist.searches,
                headText: GuarantTabConfig.viewexceptionslist.heads,
                get_url: '/custom/avenger/guarantee_manager/abnormal_msg'
            },
            {
                label: '提示信息', value: 'not',
                canSearch: true,
                canChecked: true,
                searches: GuarantTabConfig.Promptinformationlist.searches,
                headText: GuarantTabConfig.Promptinformationlist.heads,
                get_url: '/custom/avenger/guarantee_manager/abnormal_msg'
            },

        ]

    };
    static getReportlist = {
        title: '查看历史报告',
        tabList: [
            {
                label: '系统检测报告', value: 'do_not',
                canSearch: true,
                canChecked: true,
                searches: GuarantTabConfig.guarantReport.searches,
                headText: GuarantTabConfig.guarantReport.heads,
                get_url: '/custom/avenger/guarantee_manager/check_list'
            },
            {
                label: '自查报告', value: 'not',
                canSearch: true,
                canChecked: true,
                edit: {
                    headButtons: [
                        {
                            label: '增加自查报告',
                            operate: 'confirm_receivable',
                            value: '/customer/changecompany',
                            disabled: false,

                        },
                    ],
                },
                searches: GuarantTabConfig.guarantReport.searches,
                headText: GuarantTabConfig.guarantReport.heads,
                get_url: '/custom/avenger/guarantee_manager/check_list'

            },

        ]
    };

    static xn: any;
}
