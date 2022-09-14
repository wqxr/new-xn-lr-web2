import { ListHeadsFieldOutputModel, TabConfigModel } from 'libs/shared/src/lib/config/list-config-model';
import { CheckersOutputModel } from 'libs/shared/src/lib/config/checkers';
import CommBase from 'libs/shared/src/lib/public/component/comm-base';
import { XnService } from 'libs/shared/src/lib/services/xn.service';

/*
 * Copyright(c) 2017-2019, 深圳市链融科技股份有限公司
 * Beijing Xiwei Technology Co., Ltd.
 * All rights reserved.
 *
 * @file：IndexTabConfig
 * @summary：
 * @version: 1.0
 * **********************************************************************
 * revision             author            reason             date
 * 1.0                   yu          中介机构管理列表    2019-09-19
 * **********************************************************************
 */

export default class IntermediaryManagementTabConfig {
    // 中介机构列表 -默认配置
    static intermediaryList = {
        heads: [
            {label: '中介机构名称', value: 'orgName', type: 'orgName', _inList: {sort: false, search: true}},
            {label: '中介机构类型', value: 'agencyTypeList', type: 'agencyType', _inList: {sort: false, search: true}},
            {label: '保理商', value: 'factorName', _inList: {sort: false, search: true}},
            {label: '最后修改经办人', value: 'operatorName', _inList: {sort: false, search: true}},
            {label: '最后修改时间', value: 'updateTime', type: 'date', _inList: {sort: true, search: true}},
            {label: '状态', value: 'agencyStatus', type: 'agencyStatus', _inList: {sort: false, search: true}},
        ] as ListHeadsFieldOutputModel[],
        searches: [
            {
                title: '中介机构名称',
                checkerId: 'orgName',
                type: 'text',
                required: false,
                sortOrder: 1,
            },
            {
                title: '中介机构类型',
                checkerId: 'agencyType',
                type: 'select',
                options: { ref: 'agencyType'},
                required: false,
                sortOrder: 1,
            },
            {
                title: '保理商',
                checkerId: 'factorName',
                type: 'text',
                required: false,
                sortOrder: 2,

            },
            {
                title: '最后修改经办人',
                checkerId: 'operatorName',
                type: 'text',
                required: false,
                sortOrder: 4,

            },
            {
                title: '状态',
                checkerId: 'agencyStatus',
                type: 'select',
                required: false,
                options: { ref: 'agencyStatus' },
                sortOrder: 5,
            }
        ] as CheckersOutputModel[],
    };

    // 多标签页，A,B,C,D,E,F......
    static readonly config = {
        intermediary: {
            title: '中介机构管理',
            value: 'intermediary_management',
            tabList: [
                {
                    label: '中介机构管理',
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
                                        operate: 'sub_intermediary_add',
                                        post_url: '/',
                                        disabled: false,
                                        click: (xn: XnService, params) => {
                                            const rolesArr = xn.user.roles.filter((x) => {
                                                // 仅【客户经理经办人】可使用此按钮
                                                return x === 'customerOperator';
                                            });
                                            if (!(rolesArr && rolesArr.length)) {
                                                xn.msgBox.open(false, '您好，您的权限不够，仅【客户经理经办人】可进行操作');
                                            } else {
                                                xn.router.navigate([`/logan/record/new/`],
                                                {
                                                    queryParams: {
                                                        id: 'sub_intermediary_add',
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
                                        operate: 'sub_intermediary_modify',
                                        post_url: '',
                                        click: (xn: XnService, params) => {
                                            const rolesArr = xn.user.roles.filter((x) => {
                                                // 仅【客户经理经办人】可使用此按钮
                                                return x === 'customerOperator';
                                            });
                                            if (!(rolesArr && rolesArr.length)) {
                                                xn.msgBox.open(false, '您好，您的权限不够，仅【客户经理经办人】可进行操作');
                                            } else {
                                                xn.router.navigate([`/logan/record/new`],
                                                    {
                                                        queryParams: {
                                                            id: 'sub_intermediary_modify',
                                                            relate: 'mainIds',
                                                            relateValue: [params],
                                                        }
                                                    });
                                            }
                                        }
                                    },
                                    {
                                        label: '删除',
                                        operate: 'sub_intermediary_delete',
                                        post_url: '',
                                        click: (xn: XnService, params) => {
                                            const rolesArr = xn.user.roles.filter((x) => {
                                                // 仅【客户经理经办人】可使用此按钮
                                                return x === 'customerOperator';
                                            });
                                            if (!(rolesArr && rolesArr.length)) {
                                                xn.msgBox.open(false, '您好，您的权限不够，仅【客户经理经办人】可进行操作');
                                            } else {
                                                xn.router.navigate([`/logan/record/new`],
                                                    {
                                                        queryParams: {
                                                            id: 'sub_intermediary_delete',
                                                            relate: 'mainIds',
                                                            relateValue: [params],
                                                        }
                                                    });
                                            }
                                        }
                                    }
                                ]
                            },
                            searches: IntermediaryManagementTabConfig.intermediaryList.searches,
                            params: 0,
                            headText: [...IntermediaryManagementTabConfig.intermediaryList.heads],
                        },
                    ],
                    post_url: '/project_manage/agency/agency_info_list'  // 获取中介机构列表
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
