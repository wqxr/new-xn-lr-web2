import { ListHeadsFieldOutputModel, TabConfigModel } from 'libs/shared/src/lib/config/list-config-model';
import { CheckersOutputModel } from 'libs/shared/src/lib/config/checkers';
import CommBase from 'libs/shared/src/lib/public/component/comm-base';
import { XnService } from 'libs/shared/src/lib/services/xn.service';

export default class DragononceContractTemplateTab {
    static contractGroupList = { // 合同组列表界面页面配置
        heads: [
            {label: '备注', value: 'contractListName'},    // 合同组名称
            {label: '适用总部公司', value: 'headquarters'},
            {label: '合同组', value: 'fitProject', type: 'fit'},  // 适用项目
            {label: '适用收款单位', value: 'fitDebtUnit', type: 'fit'},
            {label: '合同模板', value: 'contractTemplate', type: 'contract'},
            {label: '合同组状态', value: 'contractStatus', type: 'contractStatus'},
            {label: '最后修改时间', value: 'updateTime', type: 'date'},
        ],
        searches: [
            {
                title: '合同组名称',
                checkerId: 'contractListName',
                type: 'text',
                required: false,
                number: 1,
            },
            // {
            //     title: '适用总部公司',
            //     checkerId: 'headquarters',
            //     type: 'select',
            //     required: false,
            //     options: {ref: 'enterprise_dragon4'},
            //     number: 2,

            // },
            {
                title: '适用项目',
                checkerId: 'fitProject',
                type: 'search-select',
                required: false,
                // options: { ref: 'projectOptions' },
                options: {},
                number: 3,

            },
            {
                title: '适用收款单位', checkerId: 'fitDebtUnit', type: 'text',required: false,
            },
            // {
            //     title: '适用收款单位',
            //     checkerId: 'fitDebtUnit',
            //     type: 'search-select',
            //     required: false,
            //     // options: { ref: 'payeeOptions' },
            //     options: {},
            //     number: 4,

            // },
            {
                title: '合同组状态',
                checkerId: 'contractStatus',
                type: 'select',
                required: false,
                options: { ref: 'contractStatus' },
                number: 5,

            }
        ],
    };
    static contractTemplate = {
        title: '合同模板选择',
        heads: [
            { label: '合同模板', value: 'templateFile', type: 'contract' },  // templateName
            { label: '合同模板类型', value: 'templateType', type: 'templateType' },
        ],
        searches: [
            {title: '合同模板', checkerId: 'templateName', type: 'text', required: false, number: 1},
            {title: '合同模板类型', checkerId: 'templateType', type: 'select', options: {ref: 'templateType'}, required: false, number: 2}
        ],
        get_url: '/contract/first_contract_info/get_template_list',
        get_type: 'dragon',
        label: 'templateName'  // 选择后显示的字段值
    };
    static fitProject = {
        title: '适用项目选择',
        heads: [
            { label: '项目名称', value: 'projectName', type: 'text' },
            { label: '来源', value: 'type', type: 'projectType' },
        ],
        searches: [
            {title: '储架/银行', checkerId: 'type', type: 'select', options: {ref: 'projectType'}, required: false, number: 1},
        ],
        get_url: '/contract/first_contract_info/get_project_list',
        get_type: 'dragon',
        label: 'projectName'
    };
    static fitDebtUnit = {
        title: '企业选择',
        heads: [
            { label: '企业ID', value: 'appId', type: 'text' },
            { label: '企业名称', value: 'orgName', type: 'text' },
            { label: '企业类型', value: 'orgType', type: 'orgType' },
            { label: '企业创建时间', value: 'updateTime', type: 'date' },
        ],
        searches: [
            {title: '企业名称', checkerId: 'orgName', type: 'text', required: false, number: 1},
        ],
        get_url: '/contract/first_contract_info/get_org_list',
        get_type: 'dragon',
        label: 'orgName'
    };

    static contractTemplateList = {  // 合同模板列表templateName
        heads: [
            {label: '合同模板名称', value: 'templateFile', type: 'contract'},  // templateName
            {label: '合同模板类型', value: 'templateType', type: 'templateType'},
            {label: '合同编号', value: 'id'},
            {label: '合同生成类型', value: 'createType',type:'select',options:'concreateType'},
            {label: '签署方', value: 'signer', type: 'signer'},
            {label: '特定条件', value: 'specialCondition', type: 'specialCondition'},
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
                title: '合同模板类型',
                checkerId: 'templateType',
                type: 'select',
                required: false,
                options: {ref: 'templateType'},
                number: 2,

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

    // 二次转让合同模板列表
    static secondContractTemplateList = {  // 合同模板列表templateName
        heads: [
            {label: '合同模板名称', value: 'templateFile', type: 'contract'},  // templateName
            {label: '签署方式', value: 'signMethod', type: 'signMethod'},
            {label: '合同编号', value: 'id'},
            {label: '合同生成类型', value: 'createType',type:'select',options:'concreateType'},
            {label: '生成逻辑', value: 'generateLogic', type: 'text'},
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
                title: '合同模板类型',
                checkerId: 'templateType',
                type: 'select',
                required: false,
                options: {ref: 'templateType'},
                number: 2,

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
        onceContract: {
            title: '一次转让合同管理功能',
            value: 'once_contract_manage',
            tabList: [
                {
                    label: '合同组列表',
                    value: 'A',
                    subTabList: [
                        {
                            label: '未上传',
                            value: 'DOING',
                            canSearch: true,
                            canChecked: true,
                            edit: {
                                headButtons: [
                                    {
                                        label: '新增',
                                        operate: 'sub_first_contract_add',
                                        post_url: '/',
                                        disabled: false,
                                        click: (xn: XnService, params) => {
                                            const rolesArr = xn.user.roles.filter((x) => {
                                                return x === 'operator';
                                            });
                                            if (!(rolesArr && rolesArr.length)) {
                                                xn.msgBox.open(false, '您好，您的权限不够，仅【业务经办人】可进行操作');
                                            } else {
                                                xn.router.navigate([`/logan/record/new/`],
                                                {
                                                    queryParams: {
                                                        id: 'sub_first_contract_add',
                                                        relate: 'mainIds',
                                                        relateValue: params,
                                                    }
                                                });
                                            }
                                        },

                                    },
                                ],
                                rowButtons: [
                                    {
                                        label: '修改',
                                        operate: 'sub_first_contract_modify',
                                        post_url: '',
                                        click: (xn: XnService, params) => {
                                            const rolesArr = xn.user.roles.filter((x) => {
                                                return x === 'operator';
                                            });
                                            if (!(rolesArr && rolesArr.length)) {
                                                xn.msgBox.open(false, '您好，您的权限不够，仅【业务经办人】可进行操作');
                                            } else {
                                                xn.router.navigate([`/logan/record/new`],
                                                {
                                                    queryParams: {
                                                        id: 'sub_first_contract_modify',
                                                        relate: 'mainIds',
                                                        relateValue: [params],
                                                    }
                                                });
                                            }
                                        }
                                    },
                                    {
                                        label: '删除',
                                        operate: 'sub_first_contract_delete',
                                        post_url: '',
                                        click: (xn: XnService, params) => {
                                            const rolesArr = xn.user.roles.filter((x) => {
                                                return x === 'operator';
                                            });
                                            if (!(rolesArr && rolesArr.length)) {
                                                xn.msgBox.open(false, '您好，您的权限不够，仅【业务经办人】可进行操作');
                                            } else {
                                                xn.router.navigate([`/logan/record/new`],
                                                {
                                                    queryParams: {
                                                        id: 'sub_first_contract_delete',
                                                        relate: 'mainIds',
                                                        relateValue: [params],
                                                    }
                                                });
                                            }
                                        }
                                    }
                                ]
                            },
                            searches: DragononceContractTemplateTab.contractGroupList.searches,
                            params: 0,
                            headText: [...DragononceContractTemplateTab.contractGroupList.heads],
                        }
                    ],
                    post_url: '/contract/first_contract_info/contract_list'
                },
                {
                    label: '合同模板列表',
                    value: 'B',
                    subTabList: [
                        {
                            label: '未上传',
                            value: 'DOING',
                            canSearch: true,
                            canChecked: true,
                            edit: {
                                headButtons: [
                                    // {
                                    //     label: '新增',
                                    //     operate: 'once_contract_template_add',
                                    //     post_url: '/',
                                    //     disabled: false,
                                    //     click: (xn: XnService, params) => {
                                    //         let rolesArr = xn.user.roles.filter((x) => {
                                    //             return x === "operator";
                                    //         });
                                    //         if (!(rolesArr && rolesArr.length)) {
                                    //             xn.msgBox.open(false, '您好，您的权限不够，仅【业务经办人】可进行操作');
                                    //         } else {
                                    //             xn.router.navigate([`/logan/record/new/`],
                                    //             {
                                    //                 queryParams: {
                                    //                     id: 'once_contract_template_add',
                                    //                     relate: 'mainIds',
                                    //                     relateValue: params,
                                    //                 }
                                    //             });
                                    //         }
                                    //     },

                                    // },
                                ],
                                rowButtons: [
                                    // {
                                    //     label: '修改',
                                    //     operate: 'once_contract_template_edit',
                                    //     post_url: '',
                                    //     click: (xn: XnService, params) => {
                                    //         let rolesArr = xn.user.roles.filter((x) => {
                                    //             return x === "operator";
                                    //         });
                                    //         if (!(rolesArr && rolesArr.length)) {
                                    //             xn.msgBox.open(false, '您好，您的权限不够，仅【业务经办人】可进行操作');
                                    //         } else {
                                    //             xn.router.navigate([`/logan/record/new`],
                                    //                 {
                                    //                     queryParams: {
                                    //                         id: 'once_contract_template_edit',
                                    //                         relate: 'appIds',
                                    //                         relateValue: [params],
                                    //                     }
                                    //                 });
                                    //         }
                                    //     }
                                    // }
                                ]
                            },
                            searches: DragononceContractTemplateTab.contractTemplateList.searches,
                            params: 1,
                            headText: [...DragononceContractTemplateTab.contractTemplateList.heads],
                        }
                    ],
                    post_url: '/contract/first_contract_info/contract_template'
                },
            ]
        } as TabConfigModel,
        secondContract: {
            title: '二次转让合同管理功能',
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
                                    // {
                                    //     label: '新增',
                                    //     operate: 'sub_second_contract_template_add',
                                    //     post_url: '/',
                                    //     disabled: false,
                                    //     click: (xn: XnService, params) => {
                                    //         let rolesArr = xn.user.roles.filter((x) => {
                                    //             return x === "operator";
                                    //         });
                                    //         if (!(rolesArr && rolesArr.length)) {
                                    //             xn.msgBox.open(false, '您好，您的权限不够，仅【业务经办人】可进行操作');
                                    //         } else {
                                    //             xn.router.navigate([`/logan/record/new/`],
                                    //             {
                                    //                 queryParams: {
                                    //                     id: 'sub_second_contract_template_add',
                                    //                     relate: 'mainIds',
                                    //                     relateValue: params,
                                    //                 }
                                    //             });
                                    //         }
                                    //     },

                                    // },
                                ],
                                rowButtons: [
                                    // {
                                    //     label: '修改',
                                    //     operate: 'sub_second_contract_template_modify',
                                    //     post_url: '',
                                    //     click: (xn: XnService, params) => {
                                    //         let rolesArr = xn.user.roles.filter((x) => {
                                    //             return x === "operator";
                                    //         });
                                    //         if (!(rolesArr && rolesArr.length)) {
                                    //             xn.msgBox.open(false, '您好，您的权限不够，仅【业务经办人】可进行操作');
                                    //         } else {
                                    //             xn.router.navigate([`/logan/record/new`],
                                    //                 {
                                    //                     queryParams: {
                                    //                         id: 'sub_second_contract_template_modify',
                                    //                         relate: 'appIds',
                                    //                         relateValue: [params],
                                    //                     }
                                    //                 });
                                    //         }
                                    //     }
                                    // }
                                ]
                            },
                            searches: DragononceContractTemplateTab.secondContractTemplateList.searches,
                            params: 1,
                            headText: [...DragononceContractTemplateTab.secondContractTemplateList.heads],
                        }
                    ],
                    post_url: '/contract/first_contract_info/contract_template'
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
