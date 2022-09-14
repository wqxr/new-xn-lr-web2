/*
 * Copyright(c) 2017-2019, 深圳市链融科技股份有限公司
 * Beijing Xiwei Technology Co., Ltd.
 * All rights reserved.
 *
 * @file：BusinessMatchmakerList
 * @summary：业务对接人配置列表
 * @version: 1.0
 * **********************************************************************
 * revision             author            reason             date
 * 1.0                hucongying       金地数据对接      2020-12-03
 * **********************************************************************
 */

import {
  ListHeadsFieldOutputModel,
  TabConfigModel,
} from 'libs/shared/src/lib/config/list-config-model';
import { CheckersOutputModel } from 'libs/shared/src/lib/config/checkers';

export default class BusinessMatchmakerList {
  // 市场部对接人
  static MarkMatchmaker = {
    heads: [
      { label: '总部公司', value: 'headquarters' },
      { label: '城市公司', value: 'cityCompany' },
      { label: '市场部对接人', value: 'marketName' },
      {
        label: '配置更新时间',
        value: 'updateTime',
        type: 'date',
        _inList: {
          sort: true,
          search: true,
        },
      },
      { label: '配置更新人', value: 'updateName', type: 'updateName' },
    ] as ListHeadsFieldOutputModel[],
    searches: [
      {
        title: '城市公司',
        checkerId: 'cityCompany',
        type: 'text',
        required: false,
        sortOrder: 2,
      },
      {
        title: '市场部对接人',
        checkerId: 'isMarket',
        type: 'select-text',
        options: { ref: 'accountReceipts' },
        required: false,
        sortOrder: 3,
      },
    ] as CheckersOutputModel[],
  };
  // 运营部对接人
  static OperationMatchmaker = {
    heads: [
      { label: '总部公司', value: 'headquarters' },
      { label: '收款单位省份', value: 'province' },
      { label: '收款单位城市', value: 'city' },
      {
        label: '供应商数量',
        value: 'debtUnitCount',
        type: 'debtUnitCount',
        _inList: {
          sort: true,
          search: true,
        },
      },
      { label: '运营部对接人', value: 'operatorName' },
      {
        label: '配置更新时间',
        value: 'updateTime',
        type: 'date',
        _inList: {
          sort: true,
          search: true,
        },
      },
      { label: '配置更新人', value: 'updateName', type: 'updateName' },
    ] as ListHeadsFieldOutputModel[],
    searches: [
      {
        title: '收款单位省市',
        checkerId: 'area',
        type: 'text',
        required: false,
        sortOrder: 2,
      },
      {
        title: '供应商数量',
        checkerId: 'debtUnitCount',
        type: 'number-range',
        required: false,
        sortOrder: 3,
      },
      {
        title: '运营部对接人',
        checkerId: 'isOperator',
        type: 'select-text',
        options: { ref: 'accountReceipts' },
        required: false,
        sortOrder: 4,
      },
    ] as CheckersOutputModel[],
  };

  // 多标签页，A,B,C,D,E,F......
  static readonly config = {
    // 保理商
    machineAccount: {
      title: '业务对接人配置-金地-香纳',
      tabList: [
        {
          label: '市场部对接人',
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
                    label: '选择对接人',
                    operate: 'select-marklinker',
                    post_url: '',
                    disabled: true,
                  },
                ],
              },
              searches: BusinessMatchmakerList.MarkMatchmaker.searches,
              headText: BusinessMatchmakerList.MarkMatchmaker.heads,
            },
          ],
          post_url: '/sub_system/docking_people/market_list',
          params: 1,
        },
      ],
    } as TabConfigModel,
    // 平台
    platmachineAccount: {
      title: '业务对接人配置-金地-香纳',
      tabList: [
        {
          label: '运营部对接人',
          value: 'A',
          subTabList: [
            {
              label: '进行中',
              value: 'DOING',
              canSearch: true,
              canChecked: true,
              edit: {
                headButtons: [
                  {
                    label: '选择对接人',
                    operate: 'select-operalinker',
                    post_url: '',
                    disabled: false,
                  },
                ],
              },
              searches: BusinessMatchmakerList.OperationMatchmaker.searches,
              headText: BusinessMatchmakerList.OperationMatchmaker.heads,
            },
          ],
          post_url: '/sub_system/docking_people/operator_list',
          params: 2,
        },
      ],
    } as TabConfigModel,
  };
  static getConfig(name: string) {
    return this.config[name];
  }
}
