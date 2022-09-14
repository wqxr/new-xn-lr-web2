import { ListHeadsFieldOutputModel, TabConfigModel } from 'libs/shared/src/lib/config/list-config-model';

export default class secondContractTemplateTab {
    // 二次转让合同模板列表
    static secondContractTemplateList = {  // 合同模板列表templateName
        heads: [
            {label: '合同模板名称', value: 'templateFile', type: 'contract'},  // templateName
            {label: '总部公司', value: 'headquarters', type: 'text'},
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
            }
        ],
    };
    // 多标签页，A,B,C,D,E,F......
    static readonly config = {
        secondContract: {
            title: '二次转让合同管理-龙光',
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
