/*
 * Copyright(c) 2017-2019, 深圳市链融科技股份有限公司
 * Beijing Xiwei Technology Co., Ltd.
 * All rights reserved.
 *
 * @file：IndexTabConfig
 * @summary：审批放款多标签嵌套列表配置，tabList 下的subTabList的length<2 时 即没有子标签页，不显示子标签切换导航，删除请求默认参数中的的状态参数
 * @version: 1.0
 * **********************************************************************
 * revision             author            reason             date
 * 1.0                 wq             新增          2019-05-27
 * **********************************************************************
 */

import { CheckersOutputModel } from 'libs/shared/src/lib/config/checkers';
import {
  ListHeadsFieldOutputModel,
  TabConfigModel,
} from 'libs/shared/src/lib/config/list-config-model';
import CommBase from 'libs/shared/src/lib/public/component/comm-base';

export default class ApprovalIndexTabConfig {
  // 交易列表 -采购融资，默认配置
  static avengerapprovalLists = {
    heads: [
      { label: '交易ID', value: 'mainFlowId', type: 'mainFlowId' },
      { label: '申请付款单位', value: 'projectCompany' },
      { label: '收款单位', value: 'debtUnit' },
      { label: '总部公司', value: 'headquarters' },
      { label: '资产池名称', value: 'capitalPoolName' },
      { label: '合同编号', value: 'contractId' },
      { label: '应收账款金额', value: 'receive' },
      { label: '提单日期', value: 'createTime' },
      { label: '保理融资起始日', value: 'valueDate', type: 'date' },
      { label: '保理融资到期日', value: 'factoringEndDate', type: 'date' },
      { label: '付款确认书', value: 'pdfProjectFiles', type: 'file' },
      { label: '付确匹配方式', value: 'qrsMatchMethod' },
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
        type: 'date',
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
        title: '总部公司',
        checkerId: 'headquarters',
        type: 'select',
        options: { ref: 'abs_headquarters' },
        required: false,
        sortOrder: 4,
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
        sortOrder: 3,
      },
      {
        title: '应收账款金额',
        checkerId: 'receive',
        type: 'text',
        required: false,
        sortOrder: 3,
      },
      {
        title: '提单日期',
        checkerId: 'preDate',
        type: 'date',
        required: false,
        sortOrder: 3,
      },
      {
        title: '保理融资到期日',
        checkerId: 'factoringEndDate',
        type: 'date',
        required: false,
        sortOrder: 3,
      },
    ] as CheckersOutputModel[],
  };

  // 多标签页，A,B,C,D,E,F......
  static readonly config = {
    avenger: {
      title: '上传付款确认书功能',
      tabList: [
        {
          label: '上传付款确认书',
          value: '',
          subTabList: [
            {
              label: '未上传',
              value: 'DOING',
              canSearch: true,
              canChecked: false,
              edit: {
                headButtons: [
                  {
                    label: '人工匹配付款确认书',
                    operate: 'confirm_receivable',
                    post_url: '/customer/changecompany',
                    disabled: false,
                  },
                ],
                rowButtons: [],
              },
              searches: ApprovalIndexTabConfig.avengerapprovalLists.searches,
              headText: [
                ...ApprovalIndexTabConfig.avengerapprovalLists.heads,
                {
                  label: '付款确认书编号',
                  value: 'payConfirmId',
                  type: 'date',
                },
              ],
            },
            {
              label: '已上传',
              value: 'TODO',
              canSearch: true,
              canChecked: false,
              edit: {
                headButtons: [
                  {
                    label: '替换付款确认书',
                    operate: 'confirm_receivable',
                    post_url: '/customer/changecompany',
                    disabled: false,
                  },
                ],
                rowButtons: [],
              },
              searches: ApprovalIndexTabConfig.avengerapprovalLists.searches,
              headText: ApprovalIndexTabConfig.avengerapprovalLists.heads,
            },
          ],
          post_url: '/list/main/mainList',
        },
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
}

export enum ApiProxyEnum {
  /** 采购融资 */
  A = 'avenger',
  /** 地产abs */
  B = 'api',
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
