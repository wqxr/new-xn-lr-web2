/*
 * Copyright(c) 2017-2021, 深圳市链融科技股份有限公司
 * Beijing Xiwei Technology Co., Ltd.
 * All rights reserved.
 *
 * @file：AgileXingshunPaymentTabConfig
 * @summary：雅居乐-星顺 上传付款确认书列表配置
 * @version: 1.0
 * **********************************************************************
 * revision             author            reason            date
 * 1.0                hucongying        雅居乐改造项目    2021-01-20
 * **********************************************************************
 */

import {
  ListHeadsFieldOutputModel,
  TabConfigModel,
} from 'libs/shared/src/lib/config/list-config-model';
import { CheckersOutputModel } from 'libs/shared/src/lib/config/checkers';
import { XnService } from 'libs/shared/src/lib/services/xn.service';

export default class AgileXingshunPaymentTabConfig {
  // 列表默认配置
  static baseList = {
    heads: [
      { label: '交易ID', value: 'mainFlowId', type: 'mainFlowId' },
      { label: '申请付款单位', value: 'projectCompany' },
      { label: '收款单位', value: 'debtUnit' },
      { label: '总部公司', value: 'headquarters' },
      { label: '资产池名称', value: 'capitalPoolName' },
      { label: '合同编号', value: 'contractId' },
      { label: '应收账款金额', value: 'receive', type: 'receive' },
      { label: '提单日期', value: 'createTime', type: 'date' },
      { label: '起息日', value: 'valueDate', type: 'date' },
      { label: '保理融资到期日', value: 'factoringEndDate', type: 'date' },
    ] as ListHeadsFieldOutputModel[],
    searches: [
      {
        title: '资产池名称',
        checkerId: 'capitalPoolName',
        type: 'text',
        required: false,
        sortOrder: 1,
      },
      {
        title: '交易ID',
        checkerId: 'mainFlowId',
        type: 'text',
        required: false,
        sortOrder: 2,
      },
      {
        title: '付款确认书编号',
        checkerId: 'payConfirmId',
        type: 'text',
        required: false,
        sortOrder: 5,
      },
      {
        title: '申请付款单位',
        checkerId: 'projectCompany',
        type: 'text',
        required: false,
        sortOrder: 6,
      },
      {
        title: '收款单位',
        checkerId: 'debtUnit',
        type: 'text',
        required: false,
        sortOrder: 4,
      },
      {
        title: '应收账款金额',
        checkerId: 'receive',
        type: 'text',
        required: false,
        sortOrder: 7,
      },
      {
        title: '提单日期',
        checkerId: 'preDate',
        type: 'quantum1',
        required: false,
        sortOrder: 8,
      },
      {
        title: '保理融资到期日',
        checkerId: 'factoringEndDate',
        type: 'quantum1',
        required: false,
        sortOrder: 3,
      },
    ] as CheckersOutputModel[],
  };
  // 多标签页，A,B,C,D,E,F......
  static readonly config = {
    agileXingshun: {
      title: '上传付款确认书-雅居乐-星顺',
      value: 'upload_qrs',
      tabList: [
        {
          label: '',
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
                    label: '人工匹配付款确认书',
                    operate: 'person_match_qrs',
                    post_url: '/customer/changecompany',
                    disabled: false,
                    click: (xn: XnService, params) => {
                      const rolesArr = xn.user.roles.filter((x) => {
                        return (
                          x === 'financeOperator' || x === 'financeReviewer'
                        );
                      });
                      if (!(rolesArr && rolesArr.length)) {
                        xn.msgBox.open(
                          false,
                          '您好，您的权限不够，仅【财务经办人】、【财务复核人】可进行操作'
                        );
                      } else {
                        xn.router.navigate([`/agile-xingshun/record/new/`], {
                          queryParams: {
                            id: 'sub_person_match_qrs',
                            relate: 'mainIds',
                            relateValue: params,
                          },
                        });
                      }
                    },
                  },
                ],
                rowButtons: [],
              },
              searches: AgileXingshunPaymentTabConfig.baseList.searches,
              params: 0,
              headText: [
                ...AgileXingshunPaymentTabConfig.baseList.heads,
                {
                  label: '付款确认书影印件',
                  value: 'factoringPayConfirmYyj',
                  type: 'file',
                },
                {
                  label: '付款确认书编号',
                  value: 'codeFactoringPayConfirm',
                  type: 'text',
                },
              ],
            },
            {
              label: '已上传',
              value: 'TODO',
              canSearch: true,
              canChecked: true,
              edit: {
                headButtons: [
                  {
                    label: '替换付款确认书',
                    operate: 'replace_qrs',
                    post_url: '/customer/changecompany',
                    disabled: false,
                    click: (xn: XnService, params) => {
                      const rolesArr = xn.user.roles.filter((x) => {
                        return (
                          x === 'financeOperator' || x === 'financeReviewer'
                        );
                      });
                      if (!(rolesArr && rolesArr.length)) {
                        xn.msgBox.open(
                          false,
                          '您好，您的权限不够，仅【财务经办人】、【财务复核人】可进行操作'
                        );
                      } else {
                        xn.router.navigate([`/agile-xingshun/record/new/`], {
                          queryParams: {
                            id: 'sub_replace_qrs',
                            relate: 'mainIds',
                            relateValue: params,
                          },
                        });
                      }
                    },
                  },
                ],
                rowButtons: [],
              },
              params: 1,
              searches: AgileXingshunPaymentTabConfig.baseList.searches,
              headText: [
                ...AgileXingshunPaymentTabConfig.baseList.heads,
                {
                  label: '付款确认书影印件',
                  value: 'factoringPayConfirmYyj',
                  type: 'file',
                },
                {
                  label: '付款确认书编号',
                  value: 'codeFactoringPayConfirm',
                  type: 'text',
                },
                {
                  label: '付确匹配方式',
                  value: 'qrsMatchMethod',
                  type: 'qrsMatchMethod',
                },
              ],
            },
          ],
          post_url: '/upload_qrs/list',
        },
      ],
    } as TabConfigModel,
  };

  static getConfig(name) {
    return this.config[name];
  }
}
