import { ListHeadsFieldOutputModel, TabConfigModel } from 'libs/shared/src/lib/config/list-config-model';
import { CheckersOutputModel } from 'libs/shared/src/lib/config/checkers';

/*
 * Copyright(c) 2017-2019, 深圳市链融科技股份有限公司
 * Beijing Xiwei Technology Co., Ltd.
 * All rights reserved.
 *
 * @file：IndexTabConfig
 * @summary：头寸管理配置列表
 * @version: 1.0
 * **********************************************************************
 * revision             author            reason             date
 * 1.0                 congying            新增           2020-05-05
 * **********************************************************************
 */



export default class CashManageList {
    // 市场部对接人
    static list = {
        heads: [
            { label: '日期', value: 'updateTime', type: 'date' },
            { label: '头寸', value: 'maxEnterpriseRatio' },
            { label: '剩余头寸', value: 'enterprisersNumber', }
        ] as ListHeadsFieldOutputModel[],
        searches: [
            { title: '日期范围', checkerId: 'cityCompany', type: 'text', required: false, sortOrder: 2 }
        ] as CheckersOutputModel[]
    };

    // 多标签页，A,B,C,D,E,F......
    static readonly config = {
        projectManager: {
            title: '头寸管理',
            tabList: [
                {
                    label: '头寸管理',
                    value: 'A',
                    subTabList: [
                        {
                            label: '进行中',
                            value: 'DOING',
                            canSearch: true,
                            canChecked: true,
                            count: 0,
                            edit: {
                                headButtons: [
                                    {
                                        label: '新增',
                                        operate: 'add-cash',
                                        post_url: '',
                                        disabled: false,
                                    },
                                ],
                                rowButtons: [
                                    {
                                        label: '修改',
                                        operate: 'edit-cash',
                                        post_url: '',
                                        disabled: false,
                                        showButton: true,
                                    },
                                    {
                                        label: '删除',
                                        operate: 'delete-cash',
                                        post_url: '',
                                        disabled: false,
                                        showButton: true,
                                    },
                                ]
                            },
                            searches: CashManageList.list.searches,
                            headText: CashManageList.list.heads,
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
