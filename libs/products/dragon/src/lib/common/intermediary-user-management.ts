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
 * 1.0                   yu          中介机构用户管理列表    2019-09-19
 * **********************************************************************
 */
import { ListHeadsFieldOutputModel, TabConfigModel } from 'libs/shared/src/lib/config/list-config-model';
import { CheckersOutputModel } from 'libs/shared/src/lib/config/checkers';
import CommBase from '../pages/comm-base';
import { XnService } from 'libs/shared/src/lib/services/xn.service';

export default class IntermediaryUserManagementTabConfig {
    // 中介机构列表 -默认配置
    static intermediaryList = {
        heads: [
            {label: '用户姓名', value: 'userName', _inList: {sort: false, search: true}},
            {label: '用户角色', value: 'roleIdList', type: 'agencyRoles', _inList: {sort: false, search: true}},
            {label: '证件号码', value: 'cardNo', type: 'cardNo', _inList: {sort: false, search: true}},
            {label: '手机号', value: 'mobile', _inList: {sort: false, search: true}},
            {label: '邮件', value: 'email', _inList: {sort: false, search: true}},
            {label: '最后修改经办人', value: 'operatorName', _inList: {sort: false, search: true}},
            {label: '最后修改时间', value: 'updateTime', type: 'date', _inList: {sort: true, search: true}},
            {label: '状态', value: 'userStatus', type: 'userStatus', _inList: {sort: false, search: true}},
        ] as ListHeadsFieldOutputModel[],
        searches: [
            {
                title: '用户姓名',
                checkerId: 'orgName',
                type: 'text',
                required: false,
                sortOrder: 1,
            },
            {
                title: '用户角色',
                checkerId: 'roleId',
                type: 'select',
                options: {ref: 'agencyRoles'},
                required: false,
                sortOrder: 2,

            },
            {
                title: '手机号',
                checkerId: 'mobile',
                type: 'text',
                required: false,
                sortOrder: 3,

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
                checkerId: 'userStatus',
                type: 'select',
                required: false,
                options: { ref: 'agencyStatus' },
                sortOrder: 5,
            }
        ] as CheckersOutputModel[],
    };
    // 删除流程列表
    static intermediaryDeleteList = {
        heads: [
            {label: '用户姓名', value: 'userName', _inList: {sort: false, search: true}},
            {label: '用户角色', value: 'roleIdList', type: 'agencyRoles', _inList: {sort: false, search: true}},
            {label: '证件号码', value: 'cardNo', type: 'cardNo', _inList: {sort: false, search: true}},
            {label: '手机号', value: 'mobile', _inList: {sort: false, search: true}},
            {label: '邮件', value: 'email', _inList: {sort: false, search: true}},
            {label: '最后修改经办人', value: 'operatorName', _inList: {sort: false, search: true}},
            {label: '最后修改时间', value: 'updateTime', type: 'date', _inList: {sort: false, search: true}},
            {label: '状态', value: 'userStatus', type: 'userStatus', _inList: {sort: false, search: true}},
        ] as ListHeadsFieldOutputModel[],
    };
    // 多标签页，A,B,C,D,E,F......
    static readonly config = {
        intermediary: {
            title: '中介机构账号管理功能',
            value: 'intermediary_management',
            tabList: [
                {
                    label: '中介机构账号管理',
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
                                        operate: 'sub_agency_user_add',
                                        post_url: '/',
                                        disabled: false,
                                        click: (xn: XnService, params) => {
                                            const rolesArr = xn.user.roles.filter((x) => {
                                                return x === 'customerOperator';
                                            });
                                            if (!(rolesArr && rolesArr.length)) {
                                                xn.msgBox.open(false, '您好，您的权限不够，仅【客户经理经办人】可进行操作');
                                            } else {
                                                xn.router.navigate([`/logan/record/new/`],
                                                {
                                                    queryParams: {
                                                        id: 'sub_agency_user_add',
                                                        relate: 'mainIds',
                                                        relateValue: params,
                                                    }
                                                });
                                            }
                                        },
                                    },
                                    {
                                        label: '删除',
                                        operate: 'sub_agency_user_delete',
                                        post_url: '/',
                                        disabled: false,
                                        click: (xn: XnService, params) => {
                                            const rolesArr = xn.user.roles.filter((x) => {
                                                return x === 'customerOperator';
                                            });
                                            if (!(rolesArr && rolesArr.length)) {
                                                xn.msgBox.open(false, '您好，您的权限不够，仅【客户经理经办人】可进行操作');
                                            } else {
                                                xn.router.navigate([`/logan/record/new/`],
                                                {
                                                    queryParams: {
                                                        id: 'sub_agency_user_delete',
                                                        relate: 'userList',
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
                                        operate: 'sub_agency_user_modify',
                                        post_url: '',
                                        click: (xn: XnService, params) => {
                                            const rolesArr = xn.user.roles.filter((x) => {
                                                return x === 'customerOperator';
                                            });
                                            if (!(rolesArr && rolesArr.length)) {
                                                xn.msgBox.open(false, '您好，您的权限不够，仅【客户经理经办人】可进行操作');
                                            } else {
                                                xn.router.navigate([`/logan/record/new`],
                                                    {
                                                        queryParams: {
                                                            id: 'sub_agency_user_modify',
                                                            relate: 'userList',
                                                            relateValue: params,
                                                        }
                                                    });
                                            }
                                        }
                                    }
                                ]
                            },
                            searches: IntermediaryUserManagementTabConfig.intermediaryList.searches,
                            params: 0,
                            headText: [...IntermediaryUserManagementTabConfig.intermediaryList.heads],
                        },
                    ],
                    post_url: '/project_manage/agency/agency_user_list'  // 获取中介机构用户列表
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
