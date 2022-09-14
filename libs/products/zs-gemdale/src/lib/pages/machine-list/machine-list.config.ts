/*
 * Copyright(c) 2017-2019, 深圳市链融科技股份有限公司
 * Beijing Xiwei Technology Co., Ltd.
 * All rights reserved.
 *
 * @file：MachineIndexTabConfig
 * @summary：多标签嵌套列表配置，tabList 下的subTabList的length<2 时 即没有子标签页，不显示子标签切换导航，删除请求默认参数中的的状态参数
 * @version: 1.0
 * **********************************************************************
 * revision             author            reason             date
 * 1.0                 hucongying       金地台账列表      2020-10-26
 * **********************************************************************
 */

import { ListHeadsFieldOutputModel, TabConfigModel } from 'libs/shared/src/lib/config/list-config-model';
import { CheckersOutputModel } from 'libs/shared/src/lib/config/checkers';
import CommBase from 'libs/shared/src/lib/public/component/comm-base';
import { XnService } from 'libs/shared/src/lib/services/xn.service';
import { HwModeService } from 'libs/shared/src/lib/services/hw-mode.service';

export default class MachineIndexTabConfig {
  // 交易列表 -采购融资，默认配置
  static MachineaccountTab = {
    heads: [
      {
        label: '交易ID', value: 'mainFlowId', type: 'mainFlowId', _inList: {
          sort: true,
          search: true
        },
      },
      {
        label: '提单日期', value: 'tradeDate', type: 'date', _inList: {
          sort: true,
          search: true
        },
      },
      {
        label: '渠道', value: 'productType', _inList: {
          sort: false,
          search: true
        },
        type: 'text1',
      },
      {
        label: '总部公司', value: 'headquarters', _inList: {
          sort: false,
          search: true
        },
      },
      {
        label: '申请付款单位', value: 'projectCompany', _inList: {
          sort: false,
          search: true
        },
      },
      {
        label: '收款单位', value: 'debtUnit', type: 'text', _inList: {
          sort: false,
          search: true
        },
      },

      {
        label: '应收账款金额', value: 'receive', type: 'receive', _inList: {
          sort: true,
          search: true
        },
      },
      {
        label: '资产转让折扣率', value: 'discountRate', type: 'discountRate', _inList: {
          sort: true,
          search: true
        },
      },
      {
        label: '保理融资到期日', value: 'factoringEndDate', type: 'date', _inList: {
          sort: false,
          search: true
        },
      },
      {
        label: '起息日', value: 'valueDate', type: 'date', _inList: {
          sort: false,
          search: true
        },
      },
      {
        label: '预计放款日期', value: 'priorityLoanDate', type: 'date', _inList: {
          sort: true,
          search: true
        },
      },
      {
        label: '资产池', value: 'capitalPoolName', type: 'capitalPoolName', _inList: {
          sort: false,
          search: true
        },
      },
      {
        label: '律所是否抽查', value: 'isLawOfficeCheck', type: 'text1', _inList: {
          sort: true,
          search: true
        },
      },
      {
        label: '是否变更账号', value: 'isChangeAccount', type: 'text1', _inList: {
          sort: true,
          search: true
        }
      },
      {
        label: '资金渠道', value: 'channelType', type: 'text1', _inList: {
          sort: false,
          search: false
        },
      },
      {
        label: '付款银行', value: 'bankName', type: 'fundingInfo', _inList: {
          sort: false,
          search: false
        }
      },
      {
        label: '付款银行账号', value: 'cardCode', type: 'fundingInfo', _inList: {
          sort: false,
          search: false
        }
      },
      {
        label: '运营部对接人', value: 'operatorName', type: 'text', _inList: {
          sort: false,
          search: true
        },
      },
      {
        label: '市场部对接人', value: 'marketName', type: 'text', _inList: {
          sort: false,
          search: true
        },
      },
      { label: '协助处理人', value: 'helpUserName', type: 'helpUserName' },
      {
        label: '是否需后补资料', value: 'isBackUp', type: 'text1', _inList: {
          sort: false,
          search: true
        },
      },
      {
        label: '托管行', value: 'depositBank', type: 'text', _inList: {
          sort: false,
          search: true
        },
      },
      {
        label: '发票', value: 'invoiceNum', _inList: {
          sort: false,
          search: true
        },
        type: 'invoiceNum',
      },
      {
        label: '签署方式', value: 'signType', type: 'text1', _inList: {
          sort: false,
          search: true
        },
      },
      {
        label: '交易状态', value: 'flowId', type: 'newGemdaleTradeStatus', _inList: {
          sort: false,
          search: true
        },
      },
      {
        label: '总部提单日期', value: 'headPreDate', type: 'date', _inList: {
          sort: false,
          search: true
        },
      },
      {
        label: '备注', value: 'remark', type: 'remark', _inList: {
          sort: false,
          search: true
        },
      },
      { label: '业务数据源', value: 'vankeDataSource', type: 'vankeDataSource' },
      { label: '金地数据对接情况', value: 'vankeCallState', type: 'vankeCallState', width: '7%', },
      { label: '审核暂停状态', value: 'pauseStatus', type: 'pauseStatus' },
      { label: '付款确认书文件', value: 'pdfProjectFiles', type: 'file', },
      { label: '建议入池', value: 'poolAdviseInfo', type: 'jsonInfo' },
      { label: '审核优先级', value: 'checkPriorityInfo', type: 'jsonInfo' },
      { label: '放款优先级', value: 'loanPriorityInfo', type: 'jsonInfo' },
      { label: '预计放款时间', value: 'planLoanInfo', type: 'jsonInfo' },
    ],
    searches: [
      { title: '交易ID', checkerId: 'mainFlowId', type: 'text', required: false, sortOrder: 1 },
      { title: '应收账款金额', checkerId: 'receive', type: 'text', required: false, sortOrder: 2 },
      {
        title: '中登登记状态', checkerId: 'zhongdengStatus', type: 'select',
        options: { ref: 'zhongdengStatus' }, required: false, sortOrder: 3
      },
      {
        title: '交易状态完成时间', checkerId: 'tradeTime', type: 'select-time', required: false, sortOrder: 7, options: { ref: 'newGemdaleStatus' }
      },
      { title: '申请付款单位', checkerId: 'projectCompany', type: 'text', required: false, sortOrder: 5 },
      { title: '收款单位', checkerId: 'debtUnit', type: 'text', required: false, sortOrder: 6 },
      { title: '企业Id', checkerId: 'debtUnitId', type: 'text', required: false, sortOrder: 6 },

      {
        title: '交易状态',
        checkerId: 'transactionStatus',
        type: 'machine-tradetype',
        options: { ref: 'newGemdaleStatus' },
        required: false,
        sortOrder: 7
      },
      { title: '市场部对接人', checkerId: 'marketName', type: 'text', required: false, sortOrder: 8 },
      { title: '运营部对接人', checkerId: 'operatorName', type: 'text', required: false, sortOrder: 9 },
      {
        title: '起息日', checkerId: 'valueDate', type: 'quantum1',
        required: false, sortOrder: 10
      },
      { title: '协助处理人', checkerId: 'helpUserName', type: 'text', required: false, sortOrder: 10 },

      {
        title: '预计放款日期', checkerId: 'isPriorityLoanDate', type: 'machine-loandate',
        required: false, sortOrder: 11
      },
      {
        title: '律所是否抽查', checkerId: 'isLawOfficeCheck', type: 'select',
        options: { ref: 'isLawOfficeCheck' }, required: false, sortOrder: 12
      },
      {
        title: '是否变更账号', checkerId: 'isChangeAccount', type: 'select', options: { ref: 'defaultRadio' },
        required: false, sortOrder: 13
      },
      {
        title: '是否需后补资料', checkerId: 'isBackUp', type: 'select', options: { ref: 'defaultRadio' },
        required: false, sortOrder: 14
      },
      {
        title: '签署方式', checkerId: 'signType', type: 'select', options: { ref: 'signType_jd' },
        required: false, sortOrder: 12
      },
      {
        title: '总部提单日期', checkerId: 'isHeadPreDate', type: 'machine-loandate',
        required: false, sortOrder: 12
      },
      {
        title: '业务数据源', checkerId: 'wkType', type: 'select',
        options: { ref: 'vankeDataSource' }, required: false, sortOrder: 17, base: 'number'
      },
      {
        title: '金地数据对接情况', checkerId: 'vankeCallState', type: 'select',
        options: { ref: 'vankeCallState', showWhen: ['wkType', '1'] }, required: false, sortOrder: 19, base: 'number'
      },
      {
        title: '审核暂停状态', checkerId: 'pauseStatus', type: 'select',
        options: { ref: 'pauseStatus', showWhen: ['wkType', '1'] }, required: false, sortOrder: 23, base: 'number'
      },
      {
        title: '入池建议类型', checkerId: 'poolAdviseType', type: 'select',
        options: { ref: 'poolAdviseType' }, required: false,
      },
      {
        title: '审核优先级', checkerId: 'checkPriorityType', type: 'select',
        options: { ref: 'checkPriorityType' }, required: false,
      },
      {
        title: '放款优先级', checkerId: 'loanPriorityType', type: 'select',
        options: { ref: 'loanPriorityType' }, required: false,
      },
    ] as CheckersOutputModel[]
  };
  // 地产类ABS
  static suppliermachineAccount = {
    heads: [
      {
        label: '交易ID', value: 'mainFlowId', type: 'mainFlowId', _inList: {
          sort: true,
          search: true
        },
        width: '11%',
      },
      {
        label: '提单日期', value: 'tradeDate', type: 'date', _inList: {
          sort: true,
          search: true
        },
        width: '3%'

      },
      {
        label: '起息日', value: 'valueDate', type: 'date', _inList: {
          sort: false,
          search: true
        },
      },
      {
        label: '渠道', value: 'productType', _inList: {
          sort: false,
          search: true
        },
        type: 'text1',
      },
      {
        label: '交易状态', value: 'flowId', type: 'newGemdaleTradeStatus', _inList: {
          sort: false,
          search: true
        },
      },
      { label: '开票文件', value: 'nuonuoid', type: 'text1' },

      { label: '总部公司', value: 'headquarters', width: '5%' },
      { label: '申请付款单位', value: 'projectCompany', type: 'projectCompany', width: '5%' },
      { label: '收款单位', value: 'debtUnit' },
      {
        label: '应收账款金额', value: 'receive', type: 'receive', _inList: {
          sort: true,
          search: true
        },
        width: '8%'
      },
      { label: '资产转让折扣率', value: 'discountRate', type: 'discountRate', width: '4%' },
    ] as ListHeadsFieldOutputModel[],
    searches: [
      { title: '交易ID', checkerId: 'mainFlowId', type: 'text', required: false, sortOrder: 1 },
      { title: '应收账款金额', checkerId: 'receive', type: 'text', required: false, sortOrder: 2 },
      {
        title: '中登登记状态', checkerId: 'zhongdengStatus', type: 'select',
        options: { ref: 'zhongdengStatus' }, required: false, sortOrder: 3
      },
      { title: '申请付款单位', checkerId: 'projectCompany', type: 'text', required: false, sortOrder: 5 },
      { title: '收款单位', checkerId: 'debtUnit', type: 'text', required: false, sortOrder: 6 },
      {
        title: '交易状态',
        checkerId: 'transactionStatus',
        type: 'select',
        options: { ref: 'newGemdaleTradeStatus' },
        required: false,
        sortOrder: 7
      },
      {
        title: '起息日', checkerId: 'valueDate', type: 'quantum1',
        required: false, sortOrder: 10
      },
      {
        title: '是否变更账号', checkerId: 'isChangeAccount', type: 'select', options: { ref: 'defaultRadio' },
        required: false, sortOrder: 12
      }
    ] as CheckersOutputModel[]
  };
  // baseHeadButtons
  static baseHeadButtons = [
    {
      label: '下载附件',
      operate: 'download_file',
      post_url: '/list/main/download_deal_flies',
      disabled: false,
      flag: 1,
    },
    {
      label: '导出清单',
      operate: 'export_file',
      post_url: '/trade/down_list',
      disabled: false,
      flag: 1,
    },
    {
      label: '新增备注',
      operate: 'add-mark',
      post_url: '/trade/set_remark',
      disabled: true,
    },
    {
      label: '建议入池',
      operate: 'set-pool-advise',
      flag: 1,
      post_url: '/trade/set_pool_advise',
      disabled: true,
    },
    {
      label: '取消建议入池',
      operate: 'del-pool-advise',
      flag: 0,
      post_url: '/trade/set_pool_advise',
      disabled: true,
    },
    {
      label: '设置审核优先级',
      operate: 'set-check-priority',
      post_url: '/trade/set_check_priority',
      disabled: true,
    },
    {
      label: '设置放款优先级',
      operate: 'set-loan-priority',
      post_url: '/trade/set_loan_priority',
      disabled: true,
    },
    {
      label: '设置预计放款时间',
      operate: 'set-plan-loan',
      post_url: '/trade/set_plan_loan',
      disabled: true,
    },
  ];
  // 多标签页，A,B,C,D,E,F......
  static readonly config = {
    // 保理商
    machineAccount: {
      title: '台账-金地-前海中晟',
      tabList: [
        {
          label: '地产类业务',
          value: 'B',
          subTabList: [
            {
              label: '审核中',
              value: 'DOING',
              canSearch: true,
              canChecked: true,
              params: 1,
              edit: {
                headButtons: [
                  ...MachineIndexTabConfig.baseHeadButtons,
                  {
                    label: '补充信息',
                    operate: 'add-data',
                    post_url: '/trade/down_list',
                    disabled: false,
                    flag: 1,
                  },
                  {
                    label: '调整签署方式',
                    operate: 'change-signType',
                    post_url: '/trade/set_sign_type',
                    disabled: false,
                    flag: 1,
                  },
                  {
                    label: '退单流程',
                    operate: 'reject-program',
                    post_url: '/trade/down_list',
                    disabled: false,
                    flag: 1,
                  },
                ],
                rowButtons: [
                  {
                    label: '中止交易', operate: 'stop', post_url: '',
                    click: (params, xn: XnService, hwModeService: HwModeService) => {

                      // 拼接文件
                      xn.router.navigate([`/zs-gemdale/record/new/`],
                        {
                          queryParams: {
                            id: 'sub_dragon_book_stop',
                            relate: 'mainFlowId',
                            relateValue: params.mainFlowId,
                          }
                        });
                    }
                  },
                  { label: '新增备注', operate: 'addMark', post_url: '/trade/set_remark', },
                ]
              },
              searches: [...MachineIndexTabConfig.MachineaccountTab.searches,
              {
                title: '渠道', checkerId: 'productType', type: 'linkage-select',
                options: { ref: 'productType_new_jd' }, required: false, sortOrder: 12
              },
              {
                title: '是否补充到期日', checkerId: 'isFactoringEndDate', type: 'select',
                options: { ref: 'defaultRadio' }, required: false, sortOrder: 13
              },
              {
                title: '补充协议流程状态', checkerId: 'addContractStatus', type: 'select',
                options: { ref: 'supplementaryAgreement' }, required: false, sortOrder: 14
              },
              ],
              headText: [...MachineIndexTabConfig.MachineaccountTab.heads,
              { label: '是否补充到期日', value: 'isFactoringEndDate', type: 'defaultRadio', width: '5%', },
              {
                label: '供应商是否注册', value: 'isRegisterSupplier', type: 'isInit', _inList: {
                  sort: true,
                  search: true
                },
              },
              {
                label: '收款单位注册时间', value: 'supplierRegisterDate', type: 'date', _inList: {
                  sort: true,
                  search: true
                },
              },
              {
                label: '中登状态', value: 'zhongdengStatus', type: 'zhongdengStatus', _inList: {
                  sort: true,
                  search: true
                },
              },

              ],
            },
            {
              label: '已完成',
              value: 'TODO',
              canSearch: true,
              canChecked: true,
              params: 2,
              edit: {
                headButtons: [
                  ...MachineIndexTabConfig.baseHeadButtons,
                  {
                    label: '补充信息',
                    operate: 'add-data',
                    post_url: '/trade/down_list',
                    disabled: false,
                    flag: 1,
                  },
                  {
                    label: '退单流程',
                    operate: 'reject-program',
                    post_url: '/trade/down_list',
                    disabled: false,
                    flag: 1,
                  },
                ],
                rowButtons: [
                  {
                    label: '中止交易', operate: 'stop', post_url: '',
                    click: (params, xn: XnService, hwModeService: HwModeService) => {

                      // 拼接文件
                      xn.router.navigate([`/zs-gemdale/record/new/`],
                        {
                          queryParams: {
                            id: 'sub_dragon_book_stop',
                            relate: 'mainFlowId',
                            relateValue: params.mainFlowId,
                          }
                        });
                    }
                  },
                  { label: '新增备注', operate: 'addMark', post_url: '/trade/set_remark', },
                ]
              },
              searches: [...MachineIndexTabConfig.MachineaccountTab.searches,
              {
                title: '渠道', checkerId: 'productType', type: 'linkage-select',
                options: { ref: 'productType_new_jd' }, required: false, sortOrder: 12
              },
              {
                title: '是否补充到期日', checkerId: 'isFactoringEndDate', type: 'select',
                options: { ref: 'defaultRadio' }, required: false, sortOrder: 13
              },
              {
                title: '补充协议流程状态', checkerId: 'addContractStatus', type: 'select',
                options: { ref: 'supplementaryAgreement' }, required: false, sortOrder: 14
              }],
              headText: [...MachineIndexTabConfig.MachineaccountTab.heads,
              {
                label: '实际放款日', value: 'realLoanDate', type: 'date', _inList: {
                  sort: true,
                  search: true
                },
              },
              {
                label: '转让价款', value: 'changePrice', type: 'receive', _inList: {
                  sort: true,
                  search: true
                },
              },
              ],
            },
            {
              label: '已放款',
              value: 'DONE',
              canSearch: true,
              canChecked: true,
              params: 3,
              edit: {
                headButtons: [
                  ...MachineIndexTabConfig.baseHeadButtons,
                ],
                rowButtons: [
                  { label: '新增备注', operate: 'addMark', post_url: '/trade/set_remark', },
                ]
              },
              searches: [...MachineIndexTabConfig.MachineaccountTab.searches,
              {
                title: '渠道', checkerId: 'productType', type: 'linkage-select',
                options: { ref: 'productType_new_jd' }, required: false, sortOrder: 12
              },
              {
                title: '是否补充到期日', checkerId: 'isFactoringEndDate', type: 'select',
                options: { ref: 'defaultRadio' }, required: false, sortOrder: 13
              },
              {
                title: '补充协议流程状态', checkerId: 'addContractStatus', type: 'select',
                options: { ref: 'supplementaryAgreement' }, required: false, sortOrder: 14
              }],
              headText: [...MachineIndexTabConfig.MachineaccountTab.heads,
              {
                label: '实际放款日', value: 'realLoanDate', type: 'date', _inList: {
                  sort: true,
                  search: true
                },
              },
              {
                label: '转让价款', value: 'changePrice', type: 'receive', _inList: {
                  sort: true,
                  search: true
                },
              },
              { label: '放款回单', value: 'loanReturn', type: 'loanReturn', },

              ],
            },
            {
              label: '已开票',
              value: 'SPECIAL',
              canSearch: true,
              canChecked: true,
              params: 4,
              edit: {
                headButtons: [
                  ...MachineIndexTabConfig.baseHeadButtons,
                ],
                rowButtons: [
                  { label: '新增备注', operate: 'addMark', post_url: '/trade/set_remark', },
                ]
              },
              searches: [...MachineIndexTabConfig.MachineaccountTab.searches,
              {
                title: '渠道', checkerId: 'productType', type: 'linkage-select',
                options: { ref: 'productType_new_jd' }, required: false, sortOrder: 12
              },
              {
                title: '是否补充到期日', checkerId: 'isFactoringEndDate', type: 'select',
                options: { ref: 'defaultRadio' }, required: false, sortOrder: 13
              },
              {
                title: '补充协议流程状态', checkerId: 'addContractStatus', type: 'select',
                options: { ref: 'supplementaryAgreement' }, required: false, sortOrder: 14
              }],
              headText: [
                {
                  label: '交易Id', value: 'mainFlowId', type: 'mainFlowId', _inList: {
                    sort: true,
                    search: true
                  },
                },
                {
                  label: '提单日期', value: 'tradeDate', type: 'date', _inList: {
                    sort: true,
                    search: true
                  },
                },
                { label: '总部公司', value: 'headquarters', type: 'text', },
                { label: '申请付款单位', value: 'projectCompany', type: 'projectCompany', },
                { label: '收款单位', value: 'debtUnit', type: 'text', },
                {
                  label: '应收账款金额', value: 'receive', type: 'receive', _inList: {
                    sort: true,
                    search: true
                  },
                },
                {
                  label: '资产转让折扣率', value: 'discountRate', type: 'discountRate', _inList: {
                    sort: true,
                    search: true
                  },
                },
                {
                  label: '实际放款日', value: 'realLoanDate', type: 'date', _inList: {
                    sort: true,
                    search: true
                  },
                },
                {
                  label: '转让价款', value: 'changePrice', type: 'receive', _inList: {
                    sort: true,
                    search: true
                  },

                },
                {
                  label: '交易状态', value: 'flowId', type: 'newGemdaleTradeStatus', _inList: {
                    sort: false,
                    search: true
                  },
                },
                {
                  label: '起息日', value: 'valueDate', type: 'date', _inList: {
                    sort: false,
                    search: true
                  },
                },
                { label: '放款回单', value: 'loanReturn', type: 'loanReturn', },
                { label: '发票', value: 'invoiceNum', type: 'invoiceNum', },
                { label: '开票文件', value: 'nuonuoid', type: 'text1', },
                { label: '渠道价格', value: 'channelPrice', type: 'discountRate' },
              ],
            },
            {
              label: '所有交易',
              value: 'ALL',
              canSearch: true,
              canChecked: true,
              params: 99,
              edit: {
                headButtons: [
                  ...MachineIndexTabConfig.baseHeadButtons,
                ],
                rowButtons: [
                  { label: '新增备注', operate: 'addMark', post_url: '/trade/set_remark', },
                ]
              },
              searches: [...MachineIndexTabConfig.MachineaccountTab.searches,
              {
                title: '渠道', checkerId: 'productType', type: 'linkage-select',
                options: { ref: 'productType_new_jd' }, required: false, sortOrder: 12
              },
              {
                title: '是否补充到期日', checkerId: 'isFactoringEndDate', type: 'select',
                options: { ref: 'defaultRadio' }, required: false, sortOrder: 13
              },
              {
                label: '供应商是否注册', value: 'isRegisterSupplier', type: 'isInit', _inList: {
                  sort: true,
                  search: true
                },
              },
              {
                title: '补充协议流程状态', checkerId: 'addContractStatus', type: 'select',
                options: { ref: 'supplementaryAgreement' }, required: false, sortOrder: 14
              }],
              headText: [...MachineIndexTabConfig.MachineaccountTab.heads,
              {
                label: '实际放款日', value: 'realLoanDate', type: 'date', _inList: {
                  sort: true,
                  search: true
                },
              },
              {
                label: '转让价款', value: 'changePrice', type: 'receive', _inList: {
                  sort: true,
                  search: true
                },
              },
              { label: '放款回单', value: 'loanReturn', type: 'loanReturn', },
              {
                label: '中登状态', value: 'zhongdengStatus', type: 'zhongdengStatus', _inList: {
                  sort: true,
                  search: true
                },
              },

              ],
            },
          ],
          post_url: '/trade/list'
        }
      ]
    } as TabConfigModel,
    // 平台
    platmachineAccount: {
      title: '台账-金地-前海中晟',
      tabList: [
        {
          label: '地产类业务',
          value: 'B',
          subTabList: [
            {
              label: '审核中',
              value: 'DOING',
              canSearch: true,
              canChecked: true,
              params: 1,
              edit: {
                headButtons: [
                  ...MachineIndexTabConfig.baseHeadButtons,
                  {
                    label: '中登登记',
                    operate: 'sub_zhongdeng_register',
                    post_url: '',
                    disabled: false,
                  },
                  {
                    label: '修改协助处理人',
                    operate: 'edit-helpHandler',
                    post_url: '',
                    disabled: false,
                  },
                ],
                rowButtons: [
                  {
                    label: '进入审核页面', operate: 'view', post_url: '',
                    click: (base: CommBase, params, xn: XnService, hwModeService: HwModeService) => {
                    }
                  },
                  {
                    label: '中止交易', operate: 'stop', post_url: '',
                    click: (params, xn: XnService, hwModeService: HwModeService) => {

                      // 拼接文件
                      xn.router.navigate([`/zs-gemdale/record/new/`],
                        {
                          queryParams: {
                            id: 'sub_dragon_book_stop',
                            relate: 'mainFlowId',
                            relateValue: params.mainFlowId,
                          }
                        });
                    }
                  },
                  { label: '新增备注', operate: 'addMark', post_url: '/trade/set_remark', },
                  { label: '后补资料', operate: 'addData', post_url: '/trade/change_memo' }
                ]
              },
              searches: [...MachineIndexTabConfig.MachineaccountTab.searches,
              {
                title: '渠道', checkerId: 'productType', type: 'linkage-select',
                options: { ref: 'productType_new_jd' }, required: false, sortOrder: 12
              },
              {
                title: '是否补充到期日', checkerId: 'isFactoringEndDate', type: 'select',
                options: { ref: 'defaultRadio' }, required: false, sortOrder: 13
              },
              {
                title: '补充协议流程状态', checkerId: 'addContractStatus', type: 'select',
                options: { ref: 'supplementaryAgreement' }, required: false, sortOrder: 14
              },
              {
                title: '是否签署履约证明', checkerId: 'isSignLyFiles', type: 'select',
                options: { ref: 'defaultRadio' }, required: false, sortOrder: 15
              },
              ],
              headText: [...MachineIndexTabConfig.MachineaccountTab.heads,
              { label: '是否补充到期日', value: 'isFactoringEndDate', type: 'text1', width: '5%', },
              {
                label: '供应商是否注册', value: 'isRegisterSupplier', type: 'isInit', _inList: {
                  sort: true,
                  search: true
                },
              },
              {
                label: '收款单位注册时间', value: 'supplierRegisterDate', type: 'date', _inList: {
                  sort: true,
                  search: true
                },
              },
              {
                label: '中登状态', value: 'zhongdengStatus', type: 'zhongdengStatus', _inList: {
                  sort: true,
                  search: true
                },
              },
              ],
            },
            {
              label: '已完成',
              value: 'TODO',
              canSearch: true,
              canChecked: true,
              params: 2,
              edit: {
                headButtons: [
                  ...MachineIndexTabConfig.baseHeadButtons,
                  {
                    label: '修改协助处理人',
                    operate: 'edit-helpHandler',
                    post_url: '',
                    disabled: false,
                  },
                ],
                rowButtons: [
                  {
                    label: '进入审核页面', operate: 'view', post_url: '',
                    click: (base: CommBase, params, xn: XnService, hwModeService: HwModeService) => {
                    }
                  },
                  {
                    label: '中止交易', operate: 'stop', post_url: '',
                    click: (params, xn: XnService, hwModeService: HwModeService) => {

                      // 拼接文件
                      xn.router.navigate([`/zs-gemdale/record/new/`],
                        {
                          queryParams: {
                            id: 'sub_dragon_book_stop',
                            relate: 'mainFlowId',
                            relateValue: params.mainFlowId,
                          }
                        });
                    }
                  },
                  { label: '新增备注', operate: 'addMark', post_url: '/trade/set_remark', },
                  { label: '后补资料', operate: 'addData', post_url: '/trade/change_memo' }
                ]
              },
              searches: [...MachineIndexTabConfig.MachineaccountTab.searches,
              {
                title: '渠道', checkerId: 'productType', type: 'linkage-select',
                options: { ref: 'productType_new_jd' }, required: false, sortOrder: 12
              },
              {
                title: '是否补充到期日', checkerId: 'isFactoringEndDate', type: 'select',
                options: { ref: 'defaultRadio' }, required: false, sortOrder: 13
              },
              {
                title: '补充协议流程状态', checkerId: 'addContractStatus', type: 'select',
                options: { ref: 'supplementaryAgreement' }, required: false, sortOrder: 14
              },
              {
                title: '是否签署履约证明', checkerId: 'isSignLyFiles', type: 'select',
                options: { ref: 'defaultRadio' }, required: false, sortOrder: 15
              },
              ],
              headText: [...MachineIndexTabConfig.MachineaccountTab.heads,
              {
                label: '实际放款日', value: 'realLoanDate', type: 'date', width: '4%', _inList: {
                  sort: true,
                  search: true
                },
              },
              {
                label: '转让价款', value: 'changePrice', type: 'receive', _inList: {
                  sort: true,
                  search: true
                },
              },
              ],
            },
            {
              label: '已放款',
              value: 'DONE',
              canSearch: true,
              canChecked: true,
              params: 3,
              edit: {
                headButtons: [
                  ...MachineIndexTabConfig.baseHeadButtons,
                  {
                    label: '修改协助处理人',
                    operate: 'edit-helpHandler',
                    post_url: '',
                    disabled: false,
                  },
                ],
                rowButtons: [
                  { label: '新增备注', operate: 'addMark', post_url: '/trade/set_remark', },
                  { label: '后补资料', operate: 'addData', post_url: '/trade/change_memo' }
                ]
              },
              searches: [...MachineIndexTabConfig.MachineaccountTab.searches,
              {
                title: '渠道', checkerId: 'productType', type: 'linkage-select',
                options: { ref: 'productType_new_jd' }, required: false, sortOrder: 12
              },
              {
                title: '是否补充到期日', checkerId: 'isFactoringEndDate', type: 'select',
                options: { ref: 'defaultRadio' }, required: false, sortOrder: 13
              },
              {
                title: '补充协议流程状态', checkerId: 'addContractStatus', type: 'select',
                options: { ref: 'supplementaryAgreement' }, required: false, sortOrder: 14
              },
              {
                title: '是否签署履约证明', checkerId: 'isSignLyFiles', type: 'select',
                options: { ref: 'defaultRadio' }, required: false, sortOrder: 15
              },
              ],
              headText: [...MachineIndexTabConfig.MachineaccountTab.heads,
              {
                label: '实际放款日', value: 'realLoanDate', type: 'date', _inList: {
                  sort: true,
                  search: true
                },
              },
              {
                label: '转让价款', value: 'changePrice', type: 'receive', _inList: {
                  sort: true,
                  search: true
                },
              },
              { label: '放款回单', value: 'loanReturn', type: 'loanReturn', },
              ],
            },
            {
              label: '已开票',
              value: 'SPECIAL',
              canSearch: true,
              canChecked: true,
              params: 4,
              edit: {
                headButtons: [
                  ...MachineIndexTabConfig.baseHeadButtons,
                  {
                    label: '修改协助处理人',
                    operate: 'edit-helpHandler',
                    post_url: '',
                    disabled: false,
                  },
                ],
                rowButtons: [
                  { label: '新增备注', operate: 'addMark', post_url: '/trade/set_remark', },
                  { label: '后补资料', operate: 'addData', post_url: '/trade/change_memo' }
                ]
              },
              searches: [...MachineIndexTabConfig.MachineaccountTab.searches,
              {
                title: '渠道', checkerId: 'productType', type: 'linkage-select',
                options: { ref: 'productType_new_jd' }, required: false, sortOrder: 12
              },
              {
                title: '是否补充到期日', checkerId: 'isFactoringEndDate', type: 'select',
                options: { ref: 'defaultRadio' }, required: false, sortOrder: 13
              },
              {
                title: '补充协议流程状态', checkerId: 'addContractStatus', type: 'select',
                options: { ref: 'supplementaryAgreement' }, required: false, sortOrder: 14
              },
              {
                title: '是否签署履约证明', checkerId: 'isSignLyFiles', type: 'select',
                options: { ref: 'defaultRadio' }, required: false, sortOrder: 15
              },
              ],
              headText: [
                {
                  label: '交易Id', value: 'mainFlowId', type: 'mainFlowId', _inList: {
                    sort: true,
                    search: true
                  },
                },
                {
                  label: '提单日期', value: 'tradeDate', type: 'date', _inList: {
                    sort: true,
                    search: true
                  },
                },
                { label: '总部公司', value: 'headquarters', type: 'text', },
                { label: '申请付款单位', value: 'projectCompany', type: 'projectCompany', },
                { label: '收款单位', value: 'debtUnit', type: 'text', },
                {
                  label: '应收账款金额', value: 'receive', type: 'receive', _inList: {
                    sort: true,
                    search: true
                  },
                },
                {
                  label: '资产转让折扣率', value: 'discountRate', type: 'discountRate', _inList: {
                    sort: true,
                    search: true
                  },
                },
                {
                  label: '实际放款日', value: 'realLoanDate', type: 'date', _inList: {
                    sort: true,
                    search: true
                  },
                },
                {
                  label: '交易状态', value: 'flowId', type: 'newGemdaleTradeStatus', _inList: {
                    sort: false,
                    search: true
                  },
                },
                {
                  label: '转让价款', value: 'changePrice', type: 'receive', _inList: {
                    sort: true,
                    search: true
                  },

                },
                { label: '放款回单', value: 'loanReturn', type: 'loanReturn', },
                { label: '发票', value: 'invoiceNum', type: 'invoiceNum', },
                {
                  label: '付款银行', value: 'bankName', type: 'fundingInfo', _inList: {
                    sort: false,
                    search: false
                  }
                },
                {
                  label: '付款银行账号', value: 'cardCode', type: 'fundingInfo', _inList: {
                    sort: false,
                    search: false
                  }
                },
                { label: '渠道价格', value: 'channelPrice', type: 'discountRate' },
              ],
            },
            {
              label: '所有交易',
              value: 'ALL',
              canSearch: true,
              canChecked: true,
              params: 99,
              edit: {
                headButtons: [
                  ...MachineIndexTabConfig.baseHeadButtons,
                  {
                    label: '修改协助处理人',
                    operate: 'edit-helpHandler',
                    post_url: '',
                    disabled: false,
                  },
                ],
                rowButtons: [
                  {
                    label: '进入审核页面', operate: 'view', post_url: '',
                    click: (base: CommBase, params, xn: XnService, hwModeService: HwModeService) => {
                    }
                  },
                  {
                    label: '中止交易', operate: 'stop', post_url: '',
                    click: (params, xn: XnService, hwModeService: HwModeService) => {

                      // 拼接文件
                      xn.router.navigate([`/zs-gemdale/record/new/`],
                        {
                          queryParams: {
                            id: 'sub_dragon_book_stop',
                            relate: 'mainFlowId',
                            relateValue: params.mainFlowId,
                          }
                        });
                    }
                  },
                  { label: '新增备注', operate: 'addMark', post_url: '/trade/set_remark', },
                  { label: '后补资料', operate: 'addData', post_url: '/trade/change_memo' }
                ]
              },
              searches: [...MachineIndexTabConfig.MachineaccountTab.searches,
              {
                title: '渠道', checkerId: 'productType', type: 'linkage-select',
                options: { ref: 'productType_new_jd' }, required: false, sortOrder: 12
              },
              {
                title: '是否补充到期日', checkerId: 'isFactoringEndDate', type: 'select',
                options: { ref: 'defaultRadio' }, required: false, sortOrder: 13
              },
              {
                label: '供应商是否注册', value: 'isRegisterSupplier', type: 'isInit', _inList: {
                  sort: true,
                  search: true
                },
              },
              {
                title: '补充协议流程状态', checkerId: 'addContractStatus', type: 'select',
                options: { ref: 'supplementaryAgreement' }, required: false, sortOrder: 14
              }],
              headText: [...MachineIndexTabConfig.MachineaccountTab.heads,
              {
                label: '实际放款日', value: 'realLoanDate', type: 'date', _inList: {
                  sort: true,
                  search: true
                },
              },
              {
                label: '转让价款', value: 'changePrice', type: 'receive', _inList: {
                  sort: true,
                  search: true
                },
              },
              { label: '放款回单', value: 'loanReturn', type: 'loanReturn', },
              {
                label: '中登状态', value: 'zhongdengStatus', type: 'zhongdengStatus', _inList: {
                  sort: true,
                  search: true
                },
              },

              ],
            },
          ],
          post_url: '/trade/list'
        }
      ]
    } as TabConfigModel,
    // 供应商
    suppliermachineAccount: {
      title: '台账-金地-前海中晟',
      tabList: [
        {
          label: '地产类业务',
          value: 'B',
          subTabList: [
            {
              label: '审核中',
              value: 'DOING',
              canSearch: true,
              canChecked: true,
              params: 1,
              edit: {
                headButtons: [
                  {
                    label: '下载附件',
                    operate: 'download_file',
                    post_url: '/list/main/download_deal_flies',
                    disabled: false,
                    flag: 1,
                  },
                  {
                    label: '导出清单',
                    operate: 'export_file',
                    post_url: '/trade/down_list',
                    disabled: false,
                    flag: 1,
                  },
                ],
                rowButtons: []
              },
              searches: MachineIndexTabConfig.suppliermachineAccount.searches,
              headText: [...MachineIndexTabConfig.suppliermachineAccount.heads,
              { label: '备注', value: 'remark', type: 'remark', }
              ],
            },
            {
              label: '已完成',
              value: 'TODO',
              canSearch: true,
              canChecked: true,
              params: 2,
              edit: {
                headButtons: [
                  {
                    label: '下载附件',
                    operate: 'download_file',
                    post_url: '/list/main/download_deal_flies',
                    disabled: false,
                    flag: 2,
                  },
                  {
                    label: '导出清单',
                    operate: 'export_file',
                    post_url: '/trade/down_list',
                    disabled: false,
                    flag: 2,
                  },
                ],
                rowButtons: []
              },
              searches: MachineIndexTabConfig.suppliermachineAccount.searches,
              headText: [...MachineIndexTabConfig.suppliermachineAccount.heads,
              ],
            },
            {
              label: '已放款',
              value: 'DONE',
              canSearch: true,
              canChecked: true,
              params: 3,
              edit: {
                headButtons: [
                  {
                    label: '下载附件',
                    operate: 'download_file',
                    post_url: '/list/main/download_deal_flies',
                    disabled: false,
                    flag: 3,
                  },
                  {
                    label: '导出清单',
                    operate: 'export_file',
                    post_url: '/trade/down_list',
                    disabled: false,
                    flag: 3,
                  },
                ],
                rowButtons: []
              },
              searches: MachineIndexTabConfig.suppliermachineAccount.searches,
              headText: [...MachineIndexTabConfig.suppliermachineAccount.heads,
              {
                label: '转让价格', value: 'changePrice', type: 'receive', _inList: {
                  sort: true,
                  search: true
                },
              },
              {
                label: '放款回单', value: 'loanReturn', type: 'loanReturn', _inList: {
                  sort: false,
                  search: true
                },
              },
              {
                label: '保理融资到期日', value: 'factoringEndDate', type: 'date', _inList: {
                  sort: false,
                  search: true
                },
              },
              {
                label: '转让价差', value: 'changeEnd', type: 'money', _inList: {
                  sort: false,
                  search: true
                },
              },
              {
                label: '融资天数', value: 'financingDays', type: 'text', _inList: {
                  sort: false,
                  search: true
                },
              },
              ]
            },
            {
              label: '已开票',
              value: 'SPECIAL',
              canSearch: true,
              canChecked: true,
              params: 4,
              edit: {
                headButtons: [
                  {
                    label: '下载附件',
                    operate: 'download_file',
                    post_url: '/list/main/download_deal_flies',
                    disabled: false,
                    flag: 4,
                  },
                  {
                    label: '导出清单',
                    operate: 'export_file',
                    post_url: '/trade/down_list',
                    disabled: false,
                    flag: 4,
                  },
                ],
                rowButtons: []
              },
              searches: MachineIndexTabConfig.suppliermachineAccount.searches,
              headText: [...MachineIndexTabConfig.suppliermachineAccount.heads,

              {
                label: '转让价款', value: 'changePrice', type: 'receive', _inList: {
                  sort: true,
                  search: true
                },
              },
              { label: '放款回单', value: 'loanReturn', type: 'loanReturn', },
              { label: '发票', value: 'invoiceNum', type: 'invoiceNum', },
              ],

            },
            {
              label: '所有交易',
              value: 'ALL',
              canSearch: true,
              canChecked: true,
              params: 99,
              edit: {
                headButtons: [
                  {
                    label: '下载附件',
                    operate: 'download_file',
                    post_url: '/list/main/download_deal_flies',
                    disabled: false,
                    flag: 3,
                  },
                  {
                    label: '导出清单',
                    operate: 'export_file',
                    post_url: '/trade/down_list',
                    disabled: false,
                    flag: 99,
                  },
                ],
                rowButtons: []
              },
              searches: [...MachineIndexTabConfig.MachineaccountTab.searches,
              {
                title: '渠道', checkerId: 'productType', type: 'linkage-select',
                options: { ref: 'productType_new_jd' }, required: false, sortOrder: 12
              },
              {
                title: '是否补充到期日', checkerId: 'isFactoringEndDate', type: 'select',
                options: { ref: 'defaultRadio' }, required: false, sortOrder: 13
              },
              {
                title: '补充协议流程状态', checkerId: 'addContractStatus', type: 'select',
                options: { ref: 'supplementaryAgreement' }, required: false, sortOrder: 14
              }],
              headText: [...MachineIndexTabConfig.MachineaccountTab.heads,
              {
                label: '实际放款日', value: 'realLoanDate', type: 'date', _inList: {
                  sort: true,
                  search: true
                },
              },
              {
                label: '转让价款', value: 'changePrice', type: 'receive', _inList: {
                  sort: true,
                  search: true
                },
              },
              { label: '放款回单', value: 'loanReturn', type: 'loanReturn', },

              ],
            },
          ],
          post_url: '/trade/list'

        }
      ]
    } as TabConfigModel,
  };

  static getConfig() {
    return this.config;
  }

}

/***
 *  子标签页，针对采购融资交易列表，根据特定需求修改
 */
export enum SubTabEnum {
  /** 进行中 */
  DOING = 1,
  /** 已完成 */
  TODO = 2,
  /** 已放款 */
  DONE = 3,
  /** 已开票 */
  SPECIAL = 4,
  /** 所有 */
  ALL = 99,
}

export enum ApiProxyEnum {
  A = 'dragon',
  B = 'dragon',
  C = 'dragon',
}
export enum MachineTypeEnum {
  avenger = 1,
  dragon = 2,
  vanke = 3,
  agile = 4,
  jindi = 5,
}
