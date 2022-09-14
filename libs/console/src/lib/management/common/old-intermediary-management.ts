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
 * 1.0                   yu          中介机构账号管理列表    2019-09-19
 * **********************************************************************
 */

export default class OldIntermediaryManagementTabConfig {
    // 中介机构列表 -默认配置
    static intermediaryList = {
        heads:<ListHeadsFieldOutputModel[]> [
            {label: '机构名称', value: 'orgName',_inList: {sort: true,search: true}},
            {label: '用户姓名', value: 'userName',_inList: {sort: true,search: true}},
            {label: '账号名称', value: 'appName',_inList: {sort: true,search: true}},
            {label: '手机号', value: 'accountId',_inList: {sort: true,search: true}},
            {label: '中介机构类型', value: 'agencyType', type: 'vankeAddIntermediary', _inList: {sort: true,search: true}},
            {label: '最后修改经办人', value: 'agencyChanger',_inList: {sort: true,search: true}},
            {label: '最后修改时间', value: 'updateTime',type:'date',_inList: {sort: true,search: true}},
            {label: '状态', value: 'status', type: 'intermediarySatus',_inList: {sort: true,search: true}},
        ],
        searches:<CheckersOutputModel[]> [
            {
                title: '机构名称',
                checkerId: 'orgName',
                type: 'text',
                required: false,
                sortOrder: 1,
            },
            {
                title: '用户姓名',
                checkerId: 'userName',
                type: 'text',
                required: false,
                sortOrder: 2,

            },
            {
                title: '手机号',
                checkerId: 'accountId',
                type: 'text',
                required: false,
                sortOrder: 3,

            },
            {
                title: '最后修改经办人',
                checkerId: 'agencyChanger',
                type: 'text',
                required: false,
                sortOrder: 4,

            },
            {
                title: '状态',
                checkerId: 'status',
                type: 'select',
                required: false,
                options: { ref: 'intermediarySatus' },
                sortOrder: 5,
            }
        ],
    };
    //删除流程列表
    static intermediaryDeleteList = {
        heads: <ListHeadsFieldOutputModel[]>[
            {label: '机构名称', value: 'orgName'},
            {label: '用户姓名', value: 'userName'},
            {label: '账号名称', value: 'appName'},
            {label: '手机号', value: 'accountId'},
            {label: '中介机构类型', value: 'agencyType', type: 'vankeAddIntermediary'},
            {label: '状态', value: 'status', type: 'intermediarySatus'},
        ],
    };
    // 多标签页，A,B,C,D,E,F......
    static readonly config = {
        intermediary: <TabConfigModel>{
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
                                        operate: 'sub_intermediary_add',
                                        post_url: '/',
                                        disabled: false,
                                        click: (xn: XnService, params) => {
                                            let rolesArr = xn.user.roles.filter((x) => {
                                                return x === "operator";
                                            });
                                            if (!(rolesArr && rolesArr.length)) {
                                                xn.msgBox.open(false, '您好，您的权限不够，仅【业务经办人】可进行操作');
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
                                    {
                                        label: '删除',
                                        operate: 'sub_intermediary_delete',
                                        post_url: '/',
                                        disabled: false,
                                        click: (xn: XnService, params) => {
                                            let rolesArr = xn.user.roles.filter((x) => {
                                                return x === "operator";
                                            });
                                            if (!(rolesArr && rolesArr.length)) {
                                                xn.msgBox.open(false, '您好，您的权限不够，仅【业务经办人】可进行操作');
                                            } else {
                                                xn.router.navigate([`/logan/record/new/`],
                                                {
                                                    queryParams: {
                                                        id: 'sub_intermediary_delete',
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
                                            let rolesArr = xn.user.roles.filter((x) => {
                                                return x === "operator";
                                            });
                                            if (!(rolesArr && rolesArr.length)) {
                                                xn.msgBox.open(false, '您好，您的权限不够，仅【业务经办人】可进行操作');
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
                                    }
                                ]
                            },
                            searches: OldIntermediaryManagementTabConfig.intermediaryList.searches,
                            params: 0,
                            headText: [...OldIntermediaryManagementTabConfig.intermediaryList.heads],
                        },
                    ],
                    post_url: '/project_manage/agency/agency_info_list'  // 获取中介机构列表
                },
            ]
        },
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
