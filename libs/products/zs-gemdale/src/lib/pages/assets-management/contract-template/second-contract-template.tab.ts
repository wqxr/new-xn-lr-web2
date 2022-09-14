import { TabConfigModel } from 'libs/shared/src/lib/config/list-config-model';

export default class secondContractTemplateTab {
    // 二次转让合同模板列表
    static secondContractTemplateList = {  // 合同模板列表templateName
        heads: [
            {label: '合同模板名称', value: 'templateFile', type: 'contract'},  // templateName
            {label: '总部公司', value: 'headquarters', type: 'text'},
            {label: '合同编号', value: 'id'},
            {label: '合同生成类型', value: 'createType',type:'select',options:'concreateType'},
            {label: '签署方式', value: 'signType', type: 'signType'},
            {label: '生成逻辑', value: 'style', type: 'style'},
            {label: '签署方', value: 'signer', type: 'signer'},
            {label: '合同模板状态', value: 'templateStatus', type: 'templateStatus'},
            {label: '最后修改时间', value: 'updateTime', type: 'date'},
        ],
        searches: [
            {
                title: '合同模板名称',
                checkerId: 'templateName',
                type: 'text',
                required: false,
                number: 1,
            },
            {
                title: '签署方',
                checkerId: 'signer',
                type: 'select',
                required: false,
                options: {ref: 'signer'},
                number: 3,

            },
            {
                title: '合同模板状态',
                checkerId: 'templateStatus',
                type: 'select',
                required: false,
                options: { ref: 'contractStatus' },
                number: 4,
            },
            {
                title: '合同生成类型',
                checkerId: 'createType',
                type: 'select',
                required: false,
                options: { ref: 'concreateType' },
                number: 5,
            }
        ],
    };
    // 多标签页，A,B,C,D,E,F......
    static readonly config = {
        secondContract: {
            title: '二次转让合同管理-金地-前海中晟',
            value: 'second_contract_manage',
            tabList: [
                {
                    label: '合同模板列表',
                    value: 'A',
                    subTabList: [
                        {
                            label: '未上传',
                            value: 'DOING',
                            canSearch: true,
                            canChecked: true,
                            edit: {
                                headButtons: [
                                ],
                                rowButtons: [
                                ]
                            },
                            searches: secondContractTemplateTab.secondContractTemplateList.searches,
                            params: 1,
                            headText: [...secondContractTemplateTab.secondContractTemplateList.heads],
                        }
                    ],
                    post_url: '/contract/second_contract_info/contract_template'
                },
            ]
        } as TabConfigModel
    };
    static getConfig(name) {
        return this.config[name];
    }
}
