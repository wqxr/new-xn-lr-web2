/*
 * Copyright(c) 2017-2019, 深圳市链融科技股份有限公司
 * Beijing Xiwei Technology Co., Ltd.
 * All rights reserved.
 *
 * @file：IndexTabConfig
 * @summary：多标签嵌套列表配置，tabList 下的subTabList的length<2 时 即没有子标签页，不显示子标签切换导航，删除请求默认参数中的的状态参数
 * @version: 1.0
 * **********************************************************************
 * revision             author            reason             date
 * 1.0                 wangqing            新增          2019-12-02
 * **********************************************************************
 */

import { before } from 'selenium-webdriver/testing';
import {
  ListHeadsFieldOutputModel,
  TabConfigModel,
} from 'libs/shared/src/lib/config/list-config-model';
import { CheckersOutputModel } from 'libs/shared/src/lib/config/checkers';
import CommBase from 'libs/shared/src/lib/public/component/comm-base';
import { XnService } from 'libs/shared/src/lib/services/xn.service';
import { HwModeService } from 'libs/shared/src/lib/services/hw-mode.service';

export default class IndexTabConfig {
  // 交易列表 -采购融资，默认配置
  static BankCustomLists = {
    heads: [
      {
        label: '企业名称',
        value: 'orgName',
        _inList: {
          sort: true,
          search: true,
        },
      },
      {
        label: '白名单状态',
        value: 'whiteStatus',
        _inList: {
          sort: true,
          search: true,
        },
        type: 'bankWhiteStatus',
      },
      {
        label: '省份',
        value: 'province',
        _inList: {
          sort: false,
          search: true,
        },
      },
      {
        label: '市',
        value: 'city',
        _inList: {
          sort: false,
          search: true,
        },
      },
      {
        label: '费率(%)',
        value: 'rate',
        type: 'correctMoney',
        _inList: {
          sort: false,
          search: true,
        },
      },
      {
        label: '最大期限（天）',
        value: 'dateLimit',
        _inList: {
          sort: false,
          search: true,
        },
      },
      {
        label: '最大额度(元)',
        value: 'loanLimit',
        type: 'money',
        _inList: {
          sort: false,
          search: true,
        },
      },
      {
        label: '推广状态',
        value: 'pushStatus',
        _inList: {
          sort: true,
          search: true,
        },
        type: 'pushStatus',
      },
      {
        label: '是否签署协议',
        value: 'statusCompany',
        type: 'contract',
        _inList: {
          sort: false,
          search: true,
        },
      },
      {
        label: '银行授信文件',
        value: 'bankAccreditFile',
        type: 'file',
        _inList: {
          sort: false,
          search: true,
        },
      },
      {
        label: '银行批复文件',
        value: 'bankReplyFile',
        type: 'file',
        _inList: {
          sort: false,
          search: true,
        },
      },
      {
        label: '融资文件',
        value: 'financingFile',
        type: 'file',
        _inList: {
          sort: false,
          search: true,
        },
      },
      {
        label: '其他文件',
        value: 'otherFile',
        type: 'file',
        _inList: {
          sort: false,
          search: true,
        },
      },
    ] as ListHeadsFieldOutputModel[],
    searches: [
      {
        title: '企业名称',
        checkerId: 'orgName',
        type: 'text',
        required: false,
        sortOrder: 1,
      },
      {
        title: '省份',
        checkerId: 'province',
        type: 'text',
        required: false,
        sortOrder: 2,
      },
      {
        title: '市',
        checkerId: 'city',
        type: 'text',
        required: false,
        sortOrder: 3,
      },
      {
        title: '《推介函》状态',
        checkerId: 'pushStatus',
        type: 'select',
        options: { ref: 'pushStatus' },
        required: false,
        sortOrder: 4,
      },
      {
        title: '最大期限范围（天）',
        checkerId: 'day',
        type: 'number-range',
        required: false,
        sortOrder: 5,
      },
      {
        title: '最大额度范围（元）',
        checkerId: 'receive',
        type: 'number-range',
        required: false,
        sortOrder: 6,
      },
      {
        title: '银行授信文件',
        checkerId: 'statusBankAccreditFile',
        type: 'select',
        options: { ref: 'accountReceipts' },
        required: false,
        sortOrder: 7,
      },
      {
        title: '银行批复文件',
        checkerId: 'statusBankReplyFile',
        type: 'select',
        options: { ref: 'accountReceipts' },
        required: false,
        sortOrder: 8,
      },
      {
        title: '融资文件',
        checkerId: 'statusFinancingFile',
        type: 'select',
        options: { ref: 'accountReceipts' },
        required: false,
        sortOrder: 9,
      },
      {
        title: '是否签署协议',
        checkerId: 'signAgreementStatus',
        type: 'select',
        options: { ref: 'bussStatus' },
        required: false,
        sortOrder: 10,
      },
      {
        title: '白名单状态',
        checkerId: 'whiteStatus',
        type: 'select',
        options: { ref: 'BankwhiteNameStatus' },
        required: false,
        sortOrder: 11,
      },
      {
        title: '费率范围（%）',
        checkerId: 'rateRange',
        type: 'number-range',
        required: false,
        sortOrder: 12,
      },
    ] as CheckersOutputModel[],
  };
  // 多标签页，A,B,C,D,E,F......
  static readonly config = {
    banklist: {
      title: '普惠通-银行客户管理',
      tabList: [
        {
          label: '广发',
          value: 'A',
          subTabList: [
            {
              label: '进行中',
              value: 'do_not',
              canSearch: true,
              canChecked: true,
              edit: {
                rowButtons: [
                  {
                    label: '修改文件',
                    operate: 'view',
                    post_url: '',
                    click: (
                      base: CommBase,
                      params,
                      xn: XnService,
                      hwModeService: HwModeService
                    ) => {
                      const rolesArr = xn.user.roles.filter((x) => {
                        return (
                          x === 'customerOperator' || x === 'customerReviewer'
                        );
                      });
                      if (!(rolesArr && rolesArr.length)) {
                        xn.msgBox.open(
                          false,
                          '您好，您的权限不够，仅【客户经理经办人、客户经理复核人】可进行操作'
                        );
                      } else {
                        xn.router.navigate(
                          [`/console/bank-puhuitong/record/new`],
                          {
                            queryParams: {
                              id: 'sub_bank_platform_change_file',
                              relate: 'appIds',
                              relateValue: [params.appId],
                            },
                          }
                        );
                      }
                    },
                  },
                ],
                headButtons: [
                  {
                    label: '上传文件',
                    operate: 'upload_file',
                    post_url: '/jd/approval',
                    disabled: false,
                  },
                  {
                    label: '开启推广',
                    operate: 'openPush',
                    post_url: '/bankpush/list/set_push',
                    disabled: false,
                    flag: 1,
                  },
                  {
                    label: '关闭推广',
                    operate: 'closePush',
                    post_url: '/bankpush/list/set_push',
                    disabled: false,
                    flag: 1,
                  },
                  {
                    label: '导出清单',
                    operate: 'download_approval_list',
                    post_url: '/bankpush/list/down_list',
                    disabled: false,
                    flag: 1,
                  },
                ],
              },
              searches: IndexTabConfig.BankCustomLists.searches,
              headText: IndexTabConfig.BankCustomLists.heads,
            },
          ],
          post_url: '/bankpush/list/list',
        },
        // {
        //     label: '地产类业务',
        //     value: 'B',
        //     subTabList: [
        //         {
        //             label: '进行中',
        //             value: 'DOING',
        //             canSearch: true,
        //             canChecked: true,
        //             edit: {
        //                 rowButtons: [
        //                     {
        //                         label: '查看', operate: 'view', post_url: '',
        //                         click: (base: CommBase, params, xn: XnService, hwModeService: HwModeService) => {
        //                             console.log('commbase=>', CommBase, params);
        //                             hwModeService.viewProcess(params.mainFlowId, params.isProxy);
        //                         }
        //                     },
        //                     { label: '发票详情', operate: 'invoice_detail', post_url: '' },
        //                     { label: '中止', operate: 'stop', post_url: '' }
        //                 ]
        //             },
        //             searches: IndexTabConfig.dcABS.searches,
        //             headText: IndexTabConfig.dcABS.heads,
        //         }
        //     ],
        //     post_url: '/custom/vanke_v5/list/main'
        // }
      ],
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
  DONE = '3',
  SPECIAL = '10',
}

export enum ApiProxyEnum {
  /** 采购融资 */
  A = 'avenger',
  /** 地产abs */
  B = 'api',
  C = 'avenger',
  /** 地产abs */
  D = 'avenger',
  E = 'avenger',
  F = 'avenger',
  G = 'avenger',
}

/***
 * 在数组特定位置插入元素
 * @param array 原数组
 * @param positionKeyWord 参考关键字
 * @param ele 插入元素
 * @param position 相对于参考元素位置 after | before
 */
function arraySplice(
  array: ListHeadsFieldOutputModel[],
  ele: ListHeadsFieldOutputModel,
  positionKeyWord: string,
  position: string
) {
  const findIndex = array.findIndex((find) => find.value === positionKeyWord);
  const idx = position === 'before' ? findIndex : findIndex + 1;
  array.splice(idx, 0, ele);
  return array;
}
