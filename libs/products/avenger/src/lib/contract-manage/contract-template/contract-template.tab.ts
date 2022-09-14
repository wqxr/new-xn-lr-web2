
// tslint:disable-next-line:class-name
export default class contractTemplateTab {
    static contractManagementlist = { // 合同管理主界面页面配置
        heads: [
            {label: '合同规则名称', value: 'templateName'},
            {label: '合同规则类型', value: 'templateType'},
            {label: '万科供应商', value: 'specialSupplier', type: 'enterprise'},
            {label: '上游客户', value: 'headquarters', type: 'headquarters'}, // 根据value值匹配 exp:[{label:'万科股份有限公司',value:'万科'}]
            {label: '适用合同模板', value: 'applyTemplate', type: 'contract'},
        ],
        searches: [
            {
                title: '特殊万科供应商',
                checkerId: 'specialSupplier',
                type: 'text',
                required: false,
                number: 1,
            },
            {
                title: '适用合同模板',
                checkerId: 'applyTemplate',
                type: 'text',
                required: false,
                number: 2,

            },
            {
                title: '特殊上游客户',
                checkerId: 'headquarters',
                type: 'text',
                required: false,
                number: 3,

            },
            {
                title: '合同规则类型',
                checkerId: 'templateType',
                type: 'select',
                required: false,
                options: { ref: 'contractRules' },
                number: 4,

            }
        ],
    };
    static RealstateList = {
        heads: [
                {label: '合同规则名称', value: 'templateName'},
                {label: '合同规则类型', value: 'templateType'},
                {label: '特殊供应商', value: 'specialSupplier', type: 'enterprise'},
                {label: '总部公司', value: 'headquarters', type: 'headquarters'}, // 根据value值匹配 exp:[{label:'万科股份有限公司',value:'万科'}]
                {label: '适用合同模板', value: 'applyTemplate', type: 'contract'},
        ],

        searches: [
            {
                title: '特殊供应商',
                checkerId: 'specialSupplier',
                type: 'text',
                required: false,
                number: 1,
            },
            {
                title: '适用合同模板',
                checkerId: 'applyTemplate',
                type: 'text',
                required: false,
                number: 2,

            },
            {
                title: '总部公司',
                checkerId: 'headquarters',
                type: 'select',
                required: false,
                options: {ref: 'abs_headquarters'},
                number: 3,

            },
            {
                title: '合同规则类型',
                checkerId: 'templateType',
                type: 'select',
                required: false,
                options: { ref: 'contractRules' },
                number: 4,

            }
        ],
    };

    static contractManager = { // 万科供应商保理业务 页面配置
        title: '合同管理',
        tabList: [
            {
                label: '普惠通', value: 'do_not',
                canSearch: true,
                canChecked: true,
                searches: contractTemplateTab.contractManagementlist.searches,
                headText: contractTemplateTab.contractManagementlist.heads,
                get_url: '/custom/contract_template/contract_template/contract_template_list '
            },
            {
                label: '地产类业务', value: 'do_down',
                canSearch: true,
                canChecked: true,
                searches: contractTemplateTab.RealstateList.searches,
                headText: contractTemplateTab.RealstateList.heads,
                get_url: '/custom/contract_template/contract_template/contract_template_list'
            },
            {
                label: '两票业务', value: 'do_up',
                canSearch: true,
                canChecked: true,
                searches: contractTemplateTab.contractManagementlist.searches,
                headText: contractTemplateTab.contractManagementlist.heads,
                get_url: '/custom/avenger/guarantee_manager/list'
            },

        ]
    };
    static addcontracttemplate = {
        title: '选择合同',
        heads: [
            { label: '合同模板名称', value: 'mainFlowId', type: 'mainFlowId' },
        ],
        searches: [
            {
                title: '合同模板名称',
                checkerId: 'templateName',
                type: 'text',
                required: false,
                number: 1

            },
        ],
        get_url: '/custom/contract_template/contract_template/contract_list',
    };
    static xn: any;
}
