/*
 * Copyright(c) 2017-2019, 深圳市链融科技股份有限公司
 * Beijing Xiwei Technology Co., Ltd.
 * All rights reserved.
 *
 * @file：TabConfig
 * @summary：项目公司补充资料、回执签署页面配置文件
 * @version: 1.0
 * **********************************************************************
 * revision             author            reason             date
 * 1.0                hucongying        雅居乐改造        2021-01-27
 * **********************************************************************
 */
export default class TabConfig {
  // 项目公司补充资料
  static addInfo = {
    heads: [
      { label: '交易ID', value: 'mainFlowId', type: 'mainFlowId' },
      { label: '交易状态', value: 'flowId', type: 'currentStep' },
      { label: '收款单位名称', value: 'debtUnit' },
      { label: '应收账款金额', value: 'receive', type: 'money' },
      { label: '转让价款', value: 'changePrice', type: 'money' },
      { label: '发票信息', value: 'numberList', type: 'invoice' },
      { label: '合同名称', value: 'contractName' },
      { label: '项目名称', value: 'projectName' },
      { label: '补充资料经办人', value: 'performanceMan' },
      { label: '履约证明文件', value: 'performanceFile', type: 'file' },
      { label: '创建时间', value: 'createTime', type: 'date' },
    ],
    searches: [
      {
        title: '交易id',
        checkerId: 'mainFlowId',
        type: 'text',
        required: false,
        number: 1,
      },
      {
        title: '交易状态',
        checkerId: 'tradeStatus',
        type: 'select',
        required: false,
        sortOrder: 2,
        options: { ref: 'agileXsTradeStatus' },
      },
      {
        title: '收款单位名称',
        checkerId: 'debtUnit',
        type: 'text',
        required: false,
        number: 3,
      },
      {
        title: '应收账款金额',
        checkerId: 'receive',
        type: 'text',
        required: false,
        number: 4,
      },
      {
        title: '转让价款',
        checkerId: 'changePrice',
        type: 'text',
        required: false,
        number: 5,
      },
      {
        title: '合同名称',
        checkerId: 'contractName',
        type: 'text',
        required: false,
        number: 6,
      },
      {
        title: '项目名称',
        checkerId: 'projectName',
        type: 'text',
        required: false,
        number: 7,
      },
      {
        title: '补充资料经办人',
        checkerId: 'performanceMan',
        type: 'text',
        required: false,
        number: 8,
      },
    ],
  };
  // 回执签署
  static receiptList = {
    heads: [
      { label: '交易ID', value: 'mainFlowId', type: 'mainFlowId' },
      { label: '收款单位', value: 'debtUnit' },
      { label: '申请付款单位', value: 'projectCompany' },
      { label: '交易状态', value: 'flowId', type: 'agileXsTradeStatus' },
      { label: '合同编号', value: 'contractId' },
      { label: '合同名称', value: 'contractName' },
      { label: '付款确认书编号', value: 'payConfirmId' },
      { label: '交易金额', value: 'receive', type: 'money' },
      { label: '利率', value: 'discountRate' },
      { label: '发票号码', value: 'invoiceNum', type: 'invoiceNum' },
      { label: '发票金额', value: 'invoiceAmount', type: 'money' },
      { label: '资金渠道', value: 'channelType', type: 'moneyChannel' },
      { label: '保理融资到期日', value: 'factoringEndDate', type: 'date' },
      { label: '资产池名称', value: 'capitalPoolName' },
      { label: '渠道', value: 'productType', type: 'productType' },
      {
        label: '《付款确认书（适用于雅居乐下属公司向供应商出具）》',
        value: 'second_yjl_common_01_contract',
        bodyContractYyj: 'second_yjl_common_01_contractYyj',
        templateFlag: 'second_yjl_common_01',
        type: 'contract',
      },
      {
        label: '《应收账款转让通知书回执（适用于雅居乐下属公司向供应商出具）》',
        value: 'second_yjl_common_03_contract',
        bodyContractYyj: 'second_yjl_common_03_contractYyj',
        templateFlag: 'second_yjl_common_03',
        type: 'contract',
      },
      {
        label: '《应收账款转让通知书回执（适用于雅居乐下属公司向保理商出具）》',
        value: 'second_yjl_common_07_contract',
        bodyContractYyj: 'second_yjl_common_07_contractYyj',
        templateFlag: 'second_yjl_common_07',
        type: 'contract',
      },
      {
        label: '《应收账款转让通知书（适用于保理商向雅居乐下属公司出具）》',
        value: 'second_yjl_common_05_contract',
        bodyContractYyj: 'second_yjl_common_05_contractYyj',
        templateFlag: 'second_yjl_common_05',
        type: 'contract',
      },
    ],
    searches: [
      {
        title: '资产池名称',
        checkerId: 'capitalPoolName',
        type: 'text',
        required: false,
        number: 1,
      },
    ],
  };
  static readonly config = {
    // 项目公司补充资料
    addInfo: {
      title: '项目公司补充资料',
      tabList: [
        {
          label: '未补充',
          value: 'do_not',
          canSearch: true,
          canChecked: true,
          edit: {
            headButtons: [],
            rowButtons: [
              {
                label: '上传履约证明',
                operate: 'update_file',
                value: '',
              },
            ],
          },
          searches: TabConfig.addInfo.searches,
          headText: TabConfig.addInfo.heads,
          get_url: '/sub_system/yjl_system/project_performance_list',
          isPerformance: 0, // 是否补充履约证明 0=未补充 1=已补充
        },
        {
          label: '已补充',
          value: 'do_down',
          canChecked: false,
          canSearch: true,
          edit: {
            headButtons: [],
            rowButtons: [
              {
                label: '替换履约证明',
                operate: 'replace_file',
                value: '',
              },
            ],
          },
          searches: TabConfig.addInfo.searches,
          headText: TabConfig.addInfo.heads,
          get_url: '/sub_system/yjl_system/project_performance_list',
          isPerformance: 1, // 是否补充履约证明 0=未补充 1=已补充
        },
      ],
    },
    // 应收账款转让回执列表
    receiptList: {
      title: '应收账款转让回执列表',
      tabList: [
        {
          label: '回执列表',
          value: 'do_not',
          canSearch: true,
          canChecked: true,
          edit: {
            headButtons: [
              {
                label: '下载合同',
                operate: 'download_contract',
                value: '/custom/jindi_v3/project/check_project_flag',
                disabled: true,
              },
            ],
            rowButtons: [],
          },
          searches: TabConfig.receiptList.searches,
          headText: TabConfig.receiptList.heads,
          get_url: '/sub_system/yjl_system/project_receipt_list',
        },
      ],
    },
  };

  static get(name: string) {
    return this.config[name];
  }
}
