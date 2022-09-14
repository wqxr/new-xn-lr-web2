import { ListHeadsFieldOutputModel, TabConfigModel } from 'libs/shared/src/lib/config/list-config-model';
import { CheckersOutputModel } from 'libs/shared/src/lib/config/checkers';
import CommBase from 'libs/shared/src/lib/public/component/comm-base';
import { XnService } from 'libs/shared/src/lib/services/xn.service';
import { HwModeService } from 'libs/shared/src/lib/services/hw-mode.service';

/*
 * Copyright(c) 2017-2019, 深圳市链融科技股份有限公司
 * Beijing Xiwei Technology Co., Ltd.
 * All rights reserved.
 *
 * @file：IndexTabConfig
 * @summary：抽样模型管理
 * @version: 1.0
 * **********************************************************************
 * revision             author            reason             date
 * 1.0                   hcy               新增            2020-04-15
 * **********************************************************************
 */



export default class SamplingManagerList {
    // 模型列表
    static ModuleList = {
        heads: [
            {
                label: '模型编号', value: 'modelNum', _inList: {
                    sort: true,
                    search: true
                },
            },
            { label: '模型名称', value: 'modelName', type: 'modelName' },
            { label: '最后修改人', value: 'operatorName' },
            { label: '最后修改时间', value: 'updatetime', type: 'date' },
        ] as ListHeadsFieldOutputModel[],
        searches: [
            { title: '模型名称', checkerId: 'modelName', type: 'text', required: false, sortOrder: 2 },
        ] as CheckersOutputModel[]
    };

    // 规则列表
    static RuleList = {
        heads: [
            {
                label: '规则编号', value: 'ruleNum', _inList: {
                    sort: true,
                    search: true
                },
            },
            { label: '规则名称', value: 'ruleName', type: 'ruleName' },
            { label: '最后修改人', value: 'operatorName' },
            { label: '规则状态', value: 'ruleStatus', type: 'text' },
            { label: '最后修改时间', value: 'updatetime', type: 'date' },
        ] as ListHeadsFieldOutputModel[],
        searches: [
            { title: '规则名称', checkerId: 'ruleName', type: 'text', required: false, sortOrder: 2 },
        ] as CheckersOutputModel[]
    };

    // 新增规则
    static addRule = {
        searches: [
            { title: '规则名', checkerId: 'ruleName', type: 'text', required: true, sortOrder: 2 },
            {
                title: '抽样数量', checkerId: 'numScope', type: 'samp-select-text', required: true, placeholder: '',
                options: { ref: 'numScope' }, validators: { number4: true }, sortOrder: 2, base: 'number'
            },
            {
                title: '抽样方式', checkerId: 'wayType', type: 'select', required: true,
                options: { ref: 'wayType' }, sortOrder: 2, base: 'number'
            },
            {
                title: '金额要求', checkerId: 'receiveScope', type: 'samp-select-amount', required: false, placeholder: '',
                options: { ref: 'receiveScope' }, validators: { number4: true }, base: 'number'
            },
            {
                title: '其他要求', checkerId: 'requireScope', type: 'select', required: false,
                options: { ref: 'requireScope' }, base: 'number'
            },
            {
                title: '合同类型', checkerId: 'contractScope', type: 'select', required: false,
                options: { ref: 'contractScope', showWhen: ['requireScope', '1'] }, sortOrder: 2, base: 'number'
            },
            {
                title: '省份要求', checkerId: 'provinceScope', type: 'samp-select-number', required: false, placeholder: '（请输入X）',
                options: { ref: 'provinceScope', showWhen: ['requireScope', '2'] }, validators: { number4: true }, base: 'number'
            },
            {
                title: '企业要求', checkerId: 'companyScope', type: 'samp-select-number', required: false, placeholder: '（请输入X）',
                options: { ref: 'companyScope', showWhen: ['requireScope', '3'] }, validators: { number4: true }, base: 'number'
            },

        ] as CheckersOutputModel[]
    };

    // 查看规则
    static lookRule = {
        searches: [
            { title: '规则名', checkerId: 'ruleName', type: 'text', required: true, sortOrder: 2, options: { readonly: true } },
            {
                title: '抽样数量', checkerId: 'numScope', type: 'samp-select-text', required: true, placeholder: '',
                options: { ref: 'numScope', readonly: true }, validators: { number4: true }, sortOrder: 2, base: 'number'
            },
            {
                title: '抽样方式', checkerId: 'wayType', type: 'select', required: true,
                options: { ref: 'wayType', readonly: true }, sortOrder: 2, base: 'number'
            },
            {
                title: '金额要求', checkerId: 'receiveScope', type: 'samp-select-amount', required: false, placeholder: '',
                options: { ref: 'receiveScope', readonly: true }, validators: { number4: true }, base: 'number'
            },
            {
                title: '其他要求', checkerId: 'requireScope', type: 'select', required: false,
                options: { ref: 'requireScope', readonly: true }, base: 'number'
            },
            {
                title: '合同类型', checkerId: 'contractScope', type: 'select', required: false,
                options: { ref: 'contractScope', readonly: true, showWhen: ['requireScope', '1'] }, base: 'number'
            },
            {
                title: '省份要求', checkerId: 'provinceScope', type: 'samp-select-number', required: false, placeholder: '（请输入X）',
                options: { ref: 'provinceScope', readonly: true, showWhen: ['requireScope', '2'] }, validators: { number4: true }, base: 'number'
            },
            {
                title: '企业要求', checkerId: 'companyScope', type: 'samp-select-number', required: false, placeholder: '（请输入X）',
                options: { ref: 'companyScope', readonly: true, showWhen: ['requireScope', '3'] }, validators: { number4: true }, base: 'number'
            },
        ] as CheckersOutputModel[]
    };

    // 新增抽样模型
    static addModule = {
        searches: [
            { title: '抽样模型名称', checkerId: 'modelName', type: 'text', required: true, sortOrder: 1 },

        ] as CheckersOutputModel[]
    };

    // 查看抽样模型
    static lookModule = {
        searches: [
            {
                title: '抽样模型名称', checkerId: 'modelName', type: 'text', options: { readonly: true }, required: true, sortOrder: 1
            },

        ] as CheckersOutputModel[]
    };
    // 多标签页，A,B,C,D,E,F......
    static readonly config = {
        projectManager: {
            title: '抽样模型管理列表',
            tabList: [
                {
                    label: '模型列表',
                    value: 'A',
                    subTabList: [
                        {
                            label: '模型列表',
                            value: 'DOING',
                            canSearch: true,
                            canChecked: true,
                            count: 0,
                            edit: {
                                headButtons: [
                                    {
                                        label: '新增模型',
                                        operate: 'add-module',
                                        post_url: '',
                                        disabled: false,
                                    },
                                ],
                                rowButtons: [
                                    {
                                        label: '修改模型',
                                        operate: 'edit-module',
                                        post_url: '',
                                        disabled: false,
                                        showButton: true,
                                        click: (base: CommBase, params, xn: XnService, hwModeService: HwModeService) => {
                                        }
                                    },
                                    {
                                        label: '删除模型',
                                        operate: 'delete-module',
                                        post_url: '',
                                        disabled: false,
                                        click: (base: CommBase, params, xn: XnService, hwModeService: HwModeService) => {
                                        }
                                    },
                                ]
                            },
                            searches: SamplingManagerList.ModuleList.searches,
                            headText: SamplingManagerList.ModuleList.heads,
                        },
                    ],
                    post_url: '/rule/model_list',
                    params: 1,
                },
                {
                    label: '规则列表',
                    value: 'F',
                    subTabList: [
                        {
                            label: '进行中',
                            value: 'DOING',
                            canSearch: true,
                            canChecked: true,
                            edit: {
                                headButtons: [
                                    {
                                        label: '新增规则',
                                        operate: 'add-rule',
                                        post_url: '',
                                        disabled: false,
                                    },
                                ],
                                rowButtons: [
                                    {
                                        label: '修改规则',
                                        operate: 'edit-rule',
                                        post_url: '',
                                        disabled: false,
                                        showButton: true,
                                        click: (base: CommBase, params, xn: XnService, hwModeService: HwModeService) => {
                                        }
                                    },
                                    {
                                        label: '删除规则',
                                        operate: 'delete-rule',
                                        post_url: '',
                                        disabled: false,
                                        click: (base: CommBase, params, xn: XnService, hwModeService: HwModeService) => {
                                        }
                                    },
                                ]
                            },
                            searches: SamplingManagerList.RuleList.searches,
                            headText: SamplingManagerList.RuleList.heads,
                        },
                    ],
                    post_url: '/rule/rule_list',
                    params: 2,

                },

            ]
        } as TabConfigModel,
        addRule: {
            title: '新增规则',
            tabList: [
                {
                    label: '模型列表',
                    value: 'A',
                    subTabList: [
                        {
                            label: '模型列表',
                            value: 'DOING',
                            canSearch: true,
                            canChecked: true,
                            count: 0,
                            searches: SamplingManagerList.addRule.searches,
                        },
                    ],
                    post_url: '/project_manage/project/project_list',
                    params: 1,
                },
            ]
        } as TabConfigModel,
        lookRule: {
            title: '查看规则',
            tabList: [
                {
                    label: '模型列表',
                    value: 'A',
                    subTabList: [
                        {
                            label: '模型列表',
                            value: 'DOING',
                            canSearch: true,
                            canChecked: true,
                            count: 0,
                            searches: SamplingManagerList.lookRule.searches,
                        },
                    ],
                    post_url: '',
                    params: 1,
                },
            ]
        } as TabConfigModel,
        addModule: {
            title: '新增抽样模型',
            tabList: [
                {
                    label: '模型列表',
                    value: 'A',
                    subTabList: [
                        {
                            label: '模型列表',
                            value: 'DOING',
                            canSearch: true,
                            canChecked: true,
                            count: 0,
                            searches: SamplingManagerList.addModule.searches,
                        },
                    ],
                    post_url: '',
                    params: 1,
                },
            ]
        } as TabConfigModel,
        lookModule: {
            title: '查看抽样模型',
            tabList: [
                {
                    label: '模型列表',
                    value: 'A',
                    subTabList: [
                        {
                            label: '模型列表',
                            value: 'DOING',
                            canSearch: true,
                            canChecked: true,
                            count: 0,
                            searches: SamplingManagerList.lookModule.searches,
                        },
                    ],
                    post_url: '',
                    params: 1,
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
 */
export enum SubTabEnum {
    /** 进行中 */
    DOING = '1',
    /** 待还款 */
    TODO = '10',
    /** 已完成 */
    DONE = '3',
    FOUR = '4',
    FIVE = '5',
}

export enum ApiProxyEnum {
    /** 采购融资 */
    A = 'avenger',
    /** 地产abs */
    B = 'avenger',
    C = 'avenger',
    D = 'avenger',
    E = 'avenger',
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
