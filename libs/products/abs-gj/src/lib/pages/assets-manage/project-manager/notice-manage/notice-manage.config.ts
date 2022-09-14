/*************************************************************************
 * Copyright (c) 2017 - 2021 深圳市链融科技股份有限公司
 * Shenzhen Lianrong Technology Co., Ltd.
 * All rights reserved.
 *
 * @file：libs\products\abs-gj\src\lib\pages\assets-management\dragon-project-manager\notice-manage\dragon-notice-manage.ts
 * @summary：dragon-notice-manage.ts
 * @version: 1.0
 * *************************************************************************
 * revision             author            reason             date
 * 1.0                  DengPei           init               2021-11-25
 ***************************************************************************/
import {
  ListHeadsFieldOutputModel,
  TabConfigModel
} from '../../../../../../../../shared/src/lib/config/list-config-model';
import { CheckersOutputModel } from '../../../../../../../../shared/src/lib/config/checkers';
import { SubTabValue, TabValue } from 'libs/shared/src/lib/config/enum/abs-gj.enum';

export default class NoticeManageList {
  static ManageList = {
    heads: [
      {label: '提醒事项名称', value: 'title', type: 'title'},
      {label: '提醒目标用户', value: 'userList', type: 'userList'},
      {label: '参数项', value: 'paramConfig', type: 'paramConfig'},
      {label: '提醒方式', value: 'noticeType', type: 'noticeType'},
      {label: '是否启用', value: 'isOpen', type: 'isOpen'},
      {label: '最后修改人', value: 'operatorUserName'},
      {label: '最后修改时间', value: 'updatetime', type: 'date'},
    ] as ListHeadsFieldOutputModel[],
    searches: [
      {title: '提醒事项名称', checkerId: 'title', type: 'text', required: false, sortOrder: 1},
      {
        title: '是否启用', checkerId: 'isOpen', type: 'select', options: {ref: 'isOpen'},
        required: false, sortOrder: 2
      },
    ] as CheckersOutputModel[]
  };

  readonly config = {
    title: '提醒配置列表',
    tabList: [
      {
        label: '提醒配置列表',
        value: TabValue.First,
        subTabList: [
          {
            label: '进行中',
            value: SubTabValue.DOING,
            canSearch: true,
            canChecked: true,
            edit: {
              rowButtons: [
                {
                  label: '修改配置',
                  operate: 'edit-config',
                  post_url: '',
                  disabled: false,
                },
              ],
            },
            searches: NoticeManageList.ManageList.searches,
            headText: NoticeManageList.ManageList.heads,
          },
        ],
        post_url: '/remind/remind_list',
      },
    ]
  } as TabConfigModel;
}

