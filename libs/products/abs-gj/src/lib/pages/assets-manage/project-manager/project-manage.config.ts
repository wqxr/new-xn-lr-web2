/*************************************************************************
 * Copyright (c) 2017 - 2021 深圳市链融科技股份有限公司
 * Shenzhen Lianrong Technology Co., Ltd.
 * All rights reserved.
 *
 * @file：libs\products\abs-gj\src\lib\pages\assets-management\dragon-project-manager\project-manage-config.ts
 * @summary：资产池项目管理
 * @version: 1.0
 * *************************************************************************
 * revision             author            reason             date
 * 1.0                  DengPei           init               2021-11-22
 ***************************************************************************/

import { XnUtils } from 'libs/shared/src/lib/common/xn-utils';
import { CheckersOutputModel } from 'libs/shared/src/lib/config/checkers';
import { ListHeadsFieldOutputModel, TabConfigModel } from 'libs/shared/src/lib/config/list-config-model';
import { SubTabValue, TabValue } from '../../../../../../../shared/src/lib/config/enum';

export default class ProjectManagerList {
  /** tab页配置 */
  static tabConfig = {
    /** 项目管理页面配置 */
    projectList: {
      title: '项目管理',
      value: 'projectList',
      tabList: [
        {
          label: 'ABS储架项目',
          value: TabValue.First,
          agencyTypeList: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
          subTabList: [
            {
              label: '进行中',
              value: SubTabValue.DOING,
              canSearch: true,
              canChecked: true,
              // 列表内容
              tableContent: {readonly: []},
              agencyTypeList: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
              edit: {
                leftheadButtons: [
                  {
                    label: '回传文件',
                    operate: 'return_file',
                    post_url:
                      '/custom/avenger/down_file/download_approval_list',
                    disabled: false,
                    readonly: [],
                    agencyTypeList: [0],
                  },
                ],
                rightheadButtons: [
                  {
                    label: '设立项目',
                    operate: 'set-up-project',
                    post_url: '/jd/approval',
                    disabled: false,
                    readonly: [],
                    agencyTypeList: [0],
                  },
                ],
                rowButtons: [
                  {
                    label: '专项计划列表',
                    operate: 'confirm_receivable',
                    post_url: '/customer/changecompany',
                    disabled: false,
                    readonly: [],
                    agencyTypeList: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
                  },
                  {
                    label: '设置',
                    operate: 'set-up-button',
                    readonly: [],
                    agencyTypeList: [0, 1, 7],
                    children: [
                      {
                        label: '修改基本信息',
                        operate: 'change_info',
                        post_url: '',
                        disabled: false,
                        readonly: [],
                        agencyTypeList: [0],
                      },
                      {
                        label: '添加参与机构',
                        operate: 'intermediary_agencyForm',
                        post_url: '',
                        disabled: false,
                        readonly: [],
                        agencyTypeList: [0],
                      },
                      {
                        label: '选择交易文件',
                        operate: 'chose_fileComplate',
                        post_url: '',
                        disabled: false,
                        readonly: [],
                        agencyTypeList: [0],
                      },
                      {
                        label: '设置警戒比例',
                        operate: 'alert_ratioForm',
                        post_url: '',
                        disabled: false,
                        readonly: [],
                        agencyTypeList: [0],
                      },
                      {
                        label: '提醒管理',
                        operate: 'notice_manage',
                        post_url: '',
                        disabled: false,
                        readonly: [],
                        agencyTypeList: [0, 1, 7],
                      },
                      {
                        label: '删除项目',
                        operate: 'delete_project',
                        post_url: '',
                        disabled: false,
                        readonly: [],
                        agencyTypeList: [0],
                      },
                    ],
                  },
                ],
              },
              searches: [],
              headText: [],
            },
          ],
          post_url: '/project_manage/project/project_list',
          params: 1,
        }
      ],
    } as TabConfigModel,
  };

  /** 配置 */
  static headSearchConfig = {
    heads: [
      {label: '项目编号', value: 'projectNum'},
      {label: '项目名称', value: 'projectName', type: 'mainFlowId'},
      {label: '总部公司', value: 'headquarters'},
      {label: '项目类型', value: 'projectType', type: 'text'},
      {label: '已发行量', value: 'tierReceiveSum'},
      {label: '总发行量', value: 'publishSum'},
      {label: '获批时间', value: 'passTime', type: 'date'},
      {label: '交易场所', value: 'dealSite'},
    ] as ListHeadsFieldOutputModel[],
    searches: [
      {title: '储架名称', checkerId: 'projectName', type: 'text', required: false, sortOrder: 2},
      {
        title: '项目类型',
        checkerId: 'projectType',
        type: 'select',
        options: {ref: 'projectTypeset'},
        required: false,
        sortOrder: 5
      },
    ] as CheckersOutputModel[],
  };

  /**
   * 项目列表表头和搜索项配置
   */
  static headSearches = {
    [TabValue.First]: {
      [SubTabValue.DOING]: ProjectManagerList.headSearchConfig
    },
  };

  /**
   * 根据name获取配置
   * @param name string
   */
  static getConfig(name: string) {
    return ProjectManagerList[name];
  }

  /***
   *  获取页面配置项
   *  @param localStorageService 存储服务
   *  @param xn 通用服务
   */
  static getTabConfig(localStorageService: any, xn: any): any {
    const projectManageAuthMap = localStorageService.caCheMap.get('projectManageAuth');
    const agencyInfoMap = localStorageService.caCheMap.get('agencyInfo');
    const agencySession = {
      orgType: Number(window.sessionStorage.getItem('orgType')),
      agencyType: Number(window.sessionStorage.getItem('agencyType'))
    };
    const projectManageAuth = !!projectManageAuthMap
      ? JSON.parse(projectManageAuthMap) : XnUtils.deepClone(ProjectManagerList.tabConfig);
    const agencyInfo = !!agencyInfoMap ? JSON.parse(agencyInfoMap) : XnUtils.deepClone(agencySession);

    let tabConfig: TabConfigModel;
    tabConfig = projectManageAuth.projectList;
    tabConfig.level = 0;
    tabConfig[LevelEnum[0]] = ProjectManagerList.filterAuth(tabConfig[LevelEnum[0]], agencyInfo, LevelEnum[0], 0);
    return tabConfig;
  }

  /**
   * 递归过滤配置对象
   */
  static filterAuth(authInfo: any, agencyInfo: { orgType: number | string, agencyType: number | string }, nodeName: string, level: number) {
    if (Object.prototype.toString.call(authInfo) === '[object Object]') {
      for (const key of Object.keys(authInfo)) {
        authInfo[key] = ProjectManagerList.filterAuth(authInfo[key], agencyInfo, key, level);
      }
      return authInfo;
    } else if (Object.prototype.toString.call(authInfo) === '[object Array]') {
      return authInfo
        .filter((tabObj: any) => tabObj.agencyTypeList.includes(Number(agencyInfo.agencyType)))
        .map((tabObj: any) => {
          tabObj = XnUtils.deepClone(tabObj);
          tabObj.level = level + 1;
          if (LevelEnum[level] === 'tabList') {
            tabObj[LevelEnum[tabObj.level]].forEach((subObj: any) => {
              subObj.headText = [...ProjectManagerList.headSearches[tabObj.value][subObj.value].heads];
              subObj.searches = [...ProjectManagerList.headSearches[tabObj.value][subObj.value].searches];
            });
          }
          if (tabObj.hasOwnProperty(LevelEnum[tabObj.level]) && tabObj[LevelEnum[tabObj.level]]) {
            tabObj[LevelEnum[tabObj.level]] =
              ProjectManagerList.filterAuth(tabObj[LevelEnum[tabObj.level]], agencyInfo, LevelEnum[tabObj.level], tabObj.level);
          }
          return tabObj;
        });
    }
  }
}

/***
 * 层级
 */
export enum LevelEnum {
  'tabList'    = 0,
  'subTabList' = 1,
  'edit'       = 2,
  'children'   = 3
}
