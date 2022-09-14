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
 * 1.0                 wq             新增              2019-06-15
 * **********************************************************************
 */

import { CheckersOutputModel } from 'libs/shared/src/lib/config/checkers';
import {
  ListHeadsFieldOutputModel,
  TabConfigModel,
} from 'libs/shared/src/lib/config/list-config-model';

export default class PaymentIndexTabConfig {
  // 交易列表 -采购融资，默认配置
  static paymentLists = {
    heads: [
      { label: '交易ID', value: 'mainFlowId', type: 'mainFlowId' },
      { label: '万科供应商', value: 'projectCompany' },
      { label: '上游客户', value: 'debtUnit' },
      { label: '合同编号', value: 'contractNum', type: 'honour' },
      { label: '应收账款金额', value: 'receivable', type: 'money' },
      { label: '保理融资起始日', value: 'valueDate', type: 'date' },
      { label: '保理融资到期日', value: 'factoringEndDate', type: 'date' },
      { label: '商票号码', value: 'honorNum' },
    ] as ListHeadsFieldOutputModel[],
    searches: [
      {
        title: '交易ID',
        checkerId: 'mainFlowId',
        type: 'text',
        required: false,
        sortOrder: 2,
      },
      {
        title: '应收账款金额',
        checkerId: 'receivable',
        type: 'text',
        required: false,
        sortOrder: 3,
      },
      {
        title: '万科供应商',
        checkerId: 'projectCompany',
        type: 'text',
        required: false,
        sortOrder: 6,
      },
      {
        title: '合同编号',
        checkerId: 'contractNum',
        type: 'text',
        required: false,
        sortOrder: 3,
      },
      {
        title: '上游客户',
        checkerId: 'debtUnit',
        type: 'text',
        required: false,
        sortOrder: 3,
      },
      {
        title: '商票号码',
        checkerId: 'honorNum',
        type: 'text',
        required: false,
        sortOrder: 3,
      },
      {
        title: '保理融资起始日',
        checkerId: 'valueDate',
        type: 'quantum',
        required: false,
        sortOrder: 3,
      },
      {
        title: '保理融资到期日',
        checkerId: 'factoringEndDate',
        type: 'quantum',
        required: false,
        sortOrder: 3,
      },
    ] as CheckersOutputModel[],
  };
  // 已上传
  static abs = {
    heads: [
      { label: '交易ID', value: 'mainFlowId', type: 'mainFlowId' },
      { label: '申请付款单位', value: 'projectCompany' },
      { label: '收款单位', value: 'debtUnit' },
      { label: '总部公司', value: 'headquarters', type: 'headquarters' },
      { label: '资产池名称', value: 'payConfirmId' },
      { label: '合同编号', value: 'receivable', type: 'money' },
      { label: '应收账款金额', value: 'assigneePrice' },
      { label: '提单日期', value: 'status', type: 'xnMainFlowStatus' },
      { label: '保理融资起始日', value: 'factoringEndDate', type: 'date' },
      { label: '保理融资到期日', value: 'factoringEndDate', type: 'date' },
      { label: '付款确认书编号', value: 'factoringEndDate', type: 'date' },
      {
        label: '付款确认书',
        value: 'debtReceivableType',
        type: 'xnContractType',
      },
      { label: '付确匹配方式', value: 'capitalPoolName' },
    ] as ListHeadsFieldOutputModel[],
    searches: [
      {
        title: '资产池名称',
        checkerId: 'createTime',
        type: 'date',
        required: false,
        sortOrder: 2,
      },
      {
        title: '交易ID',
        checkerId: 'customerName',
        type: 'text',
        required: false,
        sortOrder: 3,
      },
      {
        title: '付款确认书编号',
        checkerId: 'amount',
        type: 'text',
        required: false,
        sortOrder: 6,
      },
      {
        title: '总部公司',
        checkerId: 'customerName',
        type: 'text',
        required: false,
        sortOrder: 3,
      },
      {
        title: '收款单位',
        checkerId: 'customerName',
        type: 'text',
        required: false,
        sortOrder: 3,
      },
      {
        title: '应收账款金额',
        checkerId: 'customerName',
        type: 'text',
        required: false,
        sortOrder: 3,
      },
      {
        title: '提单日期',
        checkerId: 'customerName',
        type: 'text',
        required: false,
        sortOrder: 3,
      },
      {
        title: '保理融资到期日',
        checkerId: 'factoringEndDate',
        type: 'quantum',
        required: false,
        sortOrder: 3,
      },
    ] as CheckersOutputModel[],
  };
  // 多标签页，A,B,C,D,E,F......
  static readonly config = {
    avenger: {
      title: '回款管理',
      value: 'approval_back',
      tabList: [
        {
          label: '普惠通',
          value: 'A',
          subTabList: [
            {
              label: '待回款',
              value: 'DOING',
              canSearch: true,
              canChecked: true,
              edit: {},
              searches: PaymentIndexTabConfig.paymentLists.searches,
              headText: PaymentIndexTabConfig.paymentLists.heads,
            },
            {
              label: '已回款',
              value: 'TODO',
              canSearch: true,
              canChecked: false,
              edit: {},
              searches: PaymentIndexTabConfig.paymentLists.searches,
              headText: PaymentIndexTabConfig.paymentLists.heads,
            },
          ],
          post_url: '/aprloan/payback/list',
          params: 1,
        },
        // {
        //     label: '地产类业务',
        //     value: 'G',
        //     subTabList: [
        //         {
        //             label: '待回款',
        //             value: 'DOING',
        //             canSearch: true,
        //             canChecked: true,
        //             edit: {
        //             },
        //             searches: PaymentIndexTabConfig.abs.searches,
        //             headText: PaymentIndexTabConfig.abs.heads,
        //         },
        //         {
        //             label: '已回款',
        //             value: 'TODO',
        //             canSearch: true,
        //             canChecked: true,
        //             edit: {
        //             },
        //             searches: PaymentIndexTabConfig.abs.searches,
        //             headText: PaymentIndexTabConfig.abs.heads,
        //         }
        //     ],
        //     post_url: '/aprloan/payback/list',
        //     params: 2,
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
