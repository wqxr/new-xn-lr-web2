/*
 * Copyright(c) 2017-2019, 北京希为科技有限公司
 * Beijing Xiwei Technology Co., Ltd.
 * All rights reserved.
 *
 * @file：CountryGradenNoticeManageList
 * @summary：碧桂园-项目管理-提醒管理-提醒配置列表
 * @version: 1.0
 * **********************************************************************
 * revision             author            reason             date
 * 1.0                hucongying        碧桂园数据对接     2020-11-03
 * **********************************************************************
 */

import {
  ListHeadsFieldOutputModel,
  TabConfigModel,
} from 'libs/shared/src/lib/config/list-config-model';
import { CheckersOutputModel } from 'libs/shared/src/lib/config/checkers';

export default class CountryGradenNoticeManageList {
  static ManageList = {
    heads: [
      { label: '提醒事项名称', value: 'title', type: 'title' },
      { label: '提醒目标用户', value: 'userList', type: 'userList' },
      { label: '参数项', value: 'paramConfig', type: 'paramConfig' },
      { label: '提醒方式', value: 'noticeType', type: 'noticeType' },
      { label: '是否启用', value: 'isOpen', type: 'isOpen' },
      { label: '最后修改人', value: 'operatorUserName' },
      { label: '最后修改时间', value: 'updatetime', type: 'date' },
    ] as ListHeadsFieldOutputModel[],
    searches: [
      {
        title: '提醒事项名称',
        checkerId: 'title',
        type: 'text',
        required: false,
        sortOrder: 1,
      },
      {
        title: '是否启用',
        checkerId: 'isOpen',
        type: 'select',
        options: { ref: 'isOpen' },
        required: false,
        sortOrder: 2,
      },
    ] as CheckersOutputModel[],
  };

  // 多标签页，A,B,C,D,E,F......
  static readonly config = {
    // 保理商
    tabConfig: {
      title: '提醒配置列表',
      tabList: [
        {
          label: '提醒配置列表',
          value: 'A',
          subTabList: [
            {
              label: '进行中',
              value: 'DOING',
              canSearch: true,
              canChecked: true,
              count: 0,
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
              searches: CountryGradenNoticeManageList.ManageList.searches,
              headText: CountryGradenNoticeManageList.ManageList.heads,
            },
          ],
          post_url: '/remind/remind_list',
          params: 1,
        },
      ],
    } as TabConfigModel,
  };
  static getConfig(name: string) {
    return this.config[name];
  }
}
