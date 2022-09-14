/*
 * Copyright(c) 2017-2019, 深圳市链融科技股份有限公司
 * Beijing Xiwei Technology Co., Ltd.
 * All rights reserved.
 *
 * @file：TabConfig
 * @summary：供应商签署基础文件页面配置文件
 * @version: 1.0
 * **********************************************************************
 * revision             author            reason             date
 * 1.0                hucongying        龙光-博时资本       2021-04-08
 * **********************************************************************
 */
export default class TabConfig {
    // 供应商基础文件盖章列表
    static signFilesList = {
        heads: [
            { label: '交易ID', value: 'mainFlowId', type: 'mainFlowId' },
            { label: '保理商', value: 'factoringOrgName' },
            { label: '申请付款单位', value: 'projectCompany' },
            { label: '总部公司', value: 'headquarters', },
            { label: '交易金额', value: 'receive', type: 'money' },
            { label: '合同编号', value: 'contractId' },
            { label: '合同名称', value: 'contractName' },
            { label: '项目名称', value: 'projectName' },
            { label: '保理融资到期日', value: 'factoringEndDate', type: 'date' },
            { label: '交易状态', value: 'flowId', type: 'tradeStatus' },
        ],
        searches: [
            {
                title: '交易id',
                checkerId: 'mainFlowId',
                type: 'text',
                required: false,
            },
            {
                title: '交易状态',
                checkerId: 'transactionStatus',
                type: 'select',
                options: { ref: 'dragonTradeStatus' },
                required: false,
            },
        ],
    };
    static readonly config = {
        // 供应商基础文件盖章列表
        signFilesList: {
            title: '基础文件盖章',
            tabList: [
                {
                    label: '待盖章',
                    value: 'do_not',
                    canSearch: true,
                    canChecked: true,
                    edit: {
                        headButtons: [],
                        rowButtons: [
                            {
                                label: '盖章',
                                operate: 'sign_file',
                                value: '/custom/jindi_v3/project/check_project_flag',
                                disabled: true
                            }
                        ]
                    },
                    searches: TabConfig.signFilesList.searches,
                    headText: TabConfig.signFilesList.heads,
                    get_url: '/sub_system/lg_system/basic_flie_sign_list',
                    lgBasicFlieStatus: 1, // 签署状态  1= 未签署 2=已签署
                },
                {
                    label: '已盖章',
                    value: 'do_down',
                    canSearch: true,
                    canChecked: false,
                    edit: {
                        headButtons: [],
                        rowButtons: []
                    },
                    searches: TabConfig.signFilesList.searches,
                    headText: [
                        ...TabConfig.signFilesList.heads,
                        { label: '基础文件', value: 'lgBasicFlie', type: 'contract' }
                    ],
                    get_url: '/sub_system/lg_system/basic_flie_sign_list',
                    lgBasicFlieStatus: 2, // 签署状态  1= 未签署 2=已签署
                }
            ]
        },
    };

    static get(name: string) {
        return this.config[name];
    }
}
