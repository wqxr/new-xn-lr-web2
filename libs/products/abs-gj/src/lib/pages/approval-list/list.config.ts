/*************************************************************************
 * Copyright (c) 2017 - 2021 深圳市链融科技股份有限公司
 * Shenzhen Lianrong Technology Co., Ltd.
 * All rights reserved.
 *
 * @file：libs\products\abs-gj\src\lib\pages\approval-list\index-tab.config.ts
 * @summary：index-tab.config.ts
 * @version: 1.0
 * *************************************************************************
 * revision             author            reason             date
 * 1.0                  DengPei           init               2021-11-24
 ***************************************************************************/
import { CheckersOutputModel } from '../../../../../../shared/src/lib/config/checkers';
import { ListHeadsFieldOutputModel, TabConfigModel } from '../../../../../../shared/src/lib/config/list-config-model';
import { XnService } from '../../../../../../shared/src/lib/services/xn.service';
import { HwModeService } from '../../../../../../shared/src/lib/services/hw-mode.service';
import CommBase from '../comm-base';
import { SubTabValue, TabValue } from '../../../../../../shared/src/lib/config/enum';

export default class DragonApprovallistIndexTabConfig {
  /** 待业务审批 - 正常业务 */
  static normal = {
    heads: [
      {label: '交易ID', value: 'mainFlowId', type: 'mainFlowId'},
      {label: '申请付款单位', value: 'projectCompany'},
      {label: '收款单位', value: 'debtUnit'},
      {label: '总部公司', value: 'headquarters'},
      {
        label: '渠道', value: 'type', _inList: {
          sort: false,
          search: true
        },
        type: 'text1',
      },
      {label: '应收账款金额', value: 'receivable', type: 'receivable'},
      {label: '总部提单日期', value: 'headPreDate', type: 'date'},
      {label: '付款确认书编号', value: 'payConfirmId'},
      {label: '付款确认书', value: 'pdfProjectFiles', type: 'file1'},
      {label: '付确信息比对结果', value: 'payCompareStatus', type: 'resultcompare'},
      {label: '是否变更账号', value: 'ischangeAccount', type: 'optionsIS'},
      {label: '冻结一', value: 'freezeOne', type: 'freezeStatus'},
      {label: '资产池名称', value: 'capitalPoolName', type: 'capitalPoolName'},
      {label: '预计放款日期', value: 'priorityLoanDate', type: 'date'},
      {label: '申请付款单位是否签署合同', value: 'isSupplierSign', type: 'optionsIS1'},
      {label: '收款单位是否签署合同', value: 'isUpstreamSign', type: 'optionsIS2'},
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
    ] as ListHeadsFieldOutputModel[],
    searches: [
      {
        title: '渠道', checkerId: 'type', type: 'linkage-select',
        options: {ref: 'productType_logan'}, required: false, sortOrder: 12
      },
      {title: '交易ID', checkerId: 'mainFlowId', type: 'text', required: false, sortOrder: 2},
      {title: '付款确认书编号', checkerId: 'payConfirmId', type: 'text', required: false, sortOrder: 3},
      {title: '申请付款单位', checkerId: 'projectCompany', type: 'text', required: false, sortOrder: 5},
      {title: '收款单位', checkerId: 'debtUnit', type: 'text', required: false, sortOrder: 6},
      {title: '应收账款金额', checkerId: 'receivable', type: 'text', required: false, sortOrder: 7},
      {title: '付款银行', checkerId: 'payBankName', type: 'text', required: false, sortOrder: 13},
      {title: '付款银行账号', checkerId: 'payBankAccount', type: 'text', required: false, sortOrder: 14},
      {
        title: '资金渠道',
        checkerId: 'channelType',
        type: 'select',
        options: {ref: 'moneyChannel'},
        required: false,
        sortOrder: 14
      },

      {
        title: '付确信息比对结果', checkerId: 'payCompareStatus', type: 'select', required: false, sortOrder: 8,
        options: {ref: 'CompareStatus'}
      },
      {
        title: '供应商是否签署合同', checkerId: 'isSupplierSign', type: 'select', required: false, sortOrder: 9,
        options: {ref: 'bussStatus'}
      },
      {title: '总部提单日期', checkerId: 'headPreDate', type: 'quantum1', required: false, sortOrder: 10},
      {
        title: '是否变更账号', checkerId: 'ischangeAccount', type: 'select', required: false, sortOrder: 11,
        options: {ref: 'bussStatus'}
      },
      {
        title: '是否优先放款', checkerId: 'ispayAdvance', type: 'select', required: false, sortOrder: 12,
        options: {ref: 'bussStatus'},
      },
      {title: '起息日', checkerId: 'valueDate', type: 'quantum1', required: false, sortOrder: 8},
      {
        title: '资产池名称', checkerId: 'capitalPoolName', type: 'select-text',
        options: {ref: 'accountReceipts'}, required: false, sortOrder: 8
      },
      {
        title: '预计放款日期', checkerId: 'isPriorityLoanDate', type: 'machine-loandate',
        required: false, sortOrder: 10
      },
    ] as CheckersOutputModel[]
  };
  /** 待业务审批 - 特殊业务 */
  static special = {
    heads: [
      {label: '交易ID', value: 'mainFlowId', type: 'mainFlowId'},
      {label: '申请付款单位', value: 'projectCompany'},
      {label: '收款单位', value: 'debtUnit'},
      {label: '总部公司', value: 'headquarters'},
      {
        label: '渠道', value: 'type', _inList: {
          sort: false,
          search: true
        },
        type: 'text1',
      },
      {label: '应收账款金额', value: 'receivable', type: 'receivable'},
      {label: '总部提单日期', value: 'headPreDate', type: 'date'},
      {label: '付款确认书编号', value: 'payConfirmId'},
      {label: '付款确认书', value: 'pdfProjectFiles', type: 'file1'},
      {label: '付确信息比对结果', value: 'payCompareStatus', type: 'resultcompare'},
      {label: '是否变更账号', value: 'ischangeAccount', type: 'optionsIS'},
      {label: '冻结一', value: 'freezeOne', type: 'freezeStatus'},
      {label: '资产池名称', value: 'capitalPoolName', type: 'capitalPoolName'},
      {label: '预计放款日期', value: 'priorityLoanDate', type: 'date'},
      {label: '当前信贷有权人审批状态', value: 'creditStatus', type: 'approvalstatus'},
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
    ] as ListHeadsFieldOutputModel[],
    searches: [
      {
        title: '渠道', checkerId: 'type', type: 'linkage-select',
        options: {ref: 'productType_logan'}, required: false, sortOrder: 12
      },
      {title: '交易ID', checkerId: 'mainFlowId', type: 'text', required: false, sortOrder: 2},
      {title: '付款确认书编号', checkerId: 'payConfirmId', type: 'text', required: false, sortOrder: 3},
      {title: '申请付款单位', checkerId: 'projectCompany', type: 'text', required: false, sortOrder: 5},
      {title: '收款单位', checkerId: 'debtUnit', type: 'text', required: false, sortOrder: 6},
      {title: '应收账款金额', checkerId: 'receivable', type: 'text', required: false, sortOrder: 7},
      {
        title: '付确信息比对结果', checkerId: 'payCompareStatus', type: 'select', options: {ref: 'CompareStatus'},
        required: false, sortOrder: 8
      },
      {
        title: '当前信贷有权人审批状态', checkerId: 'creditStatus', type: 'select', options: {ref: 'approvalstatus'},
        required: false, sortOrder: 9
      },
      {title: '总部提单日期', checkerId: 'headPreDate', type: 'quantum1', required: false, sortOrder: 10},
      {
        title: '是否变更账号', checkerId: 'ischangeAccount', type: 'select', options: {ref: 'bussStatus'},
        required: false, sortOrder: 11
      },
      {
        title: '当前财务有权人审批状态', checkerId: 'financeStatus', type: 'select', options: {ref: 'approvalstatus'},
        required: false, sortOrder: 12
      },
      {
        title: '是否优先放款', checkerId: 'ispayAdvance', type: 'select', required: false, sortOrder: 11,
        options: {ref: 'bussStatus'}
      },
      {title: '付款银行', checkerId: 'payBankName', type: 'text', required: false, sortOrder: 13},
      {title: '付款银行账号', checkerId: 'payBankAccount', type: 'text', required: false, sortOrder: 14},
      {
        title: '资金渠道',
        checkerId: 'channelType',
        type: 'select',
        options: {ref: 'moneyChannel'},
        required: false,
        sortOrder: 14
      },

      {title: '起息日', checkerId: 'valueDate', type: 'quantum1', required: false, sortOrder: 8},
      {
        title: '资产池名称', checkerId: 'capitalPoolName', type: 'select-text',
        options: {ref: 'accountReceipts'}, required: false, sortOrder: 8
      },
      {
        title: '预计放款日期', checkerId: 'isPriorityLoanDate', type: 'machine-loandate',
        required: false, sortOrder: 10
      },
      {title: '转让价款', checkerId: 'changePrice', type: 'text', required: false, sortOrder: 15},
    ] as CheckersOutputModel[]
  };
  /** 业务审批中 */
  static approval = {
    heads: [
      {label: '交易ID', value: 'mainFlowId', type: 'mainFlowId'},
      {label: '申请付款单位', value: 'projectCompany'},
      {label: '收款单位', value: 'debtUnit'},
      {label: '总部公司', value: 'headquarters'},
      {
        label: '渠道', value: 'type', _inList: {
          sort: false,
          search: true
        },
        type: 'text1',
      },
      {label: '当前信贷有权人审批状态', value: 'creditStatus', type: 'approvalstatus'},
      {label: '应收账款金额', value: 'receivable', type: 'receivable'},
      {label: '总部提单日期', value: 'headPreDate', type: 'date'},
      {label: '付款确认书编号', value: 'payConfirmId'},
      {label: '付款确认书', value: 'pdfProjectFiles', type: 'file1'},
      {label: '付确信息比对结果', value: 'payCompareStatus', type: 'resultcompare'},
      {label: '是否变更账号', value: 'ischangeAccount', type: 'optionsIS'},
      {label: '冻结一', value: 'freezeOne', type: 'freezeStatus'},
      {label: '资产池名称', value: 'capitalPoolName', type: 'capitalPoolName'},
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
    ] as ListHeadsFieldOutputModel[],
    searches: [
      {
        title: '渠道', checkerId: 'type', type: 'linkage-select',
        options: {ref: 'productType_logan'}, required: false, sortOrder: 12
      },
      {title: '交易ID', checkerId: 'mainFlowId', type: 'text', required: false, sortOrder: 2},
      {title: '付款确认书编号', checkerId: 'payConfirmId', type: 'text', required: false, sortOrder: 3},
      // {
      //     title: '总部公司', checkerId: 'headquarters', type: 'select', options: { ref: 'abs_headquarters' },
      //     required: false, sortOrder: 4
      // },
      {title: '申请付款单位', checkerId: 'projectCompany', type: 'text', required: false, sortOrder: 5},
      {title: '收款单位', checkerId: 'debtUnit', type: 'text', required: false, sortOrder: 6},
      {title: '应收账款金额', checkerId: 'receivable', type: 'text', required: false, sortOrder: 7},
      {
        title: '付确信息比对结果', checkerId: 'payCompareStatus', type: 'select', options: {ref: 'CompareStatus'},
        required: false, sortOrder: 8
      },
      {
        title: '当前信贷有权人审批状态', checkerId: 'creditStatus', type: 'select', options: {ref: 'approvalstatus'},
        required: false, sortOrder: 9
      },
      {title: '总部提单日期', checkerId: 'headPreDate', type: 'quantum1', required: false, sortOrder: 10},
      {
        title: '是否变更账号', checkerId: 'ischangeAccount', type: 'select', options: {ref: 'bussStatus'},
        required: false, sortOrder: 11
      },
      {
        title: '当前财务有权人审批状态', checkerId: 'financeStatus', type: 'select', options: {ref: 'approvalstatus'},
        required: false, sortOrder: 12
      },
      {title: '付款银行', checkerId: 'payBankName', type: 'text', required: false, sortOrder: 13},
      {title: '付款银行账号', checkerId: 'payBankAccount', type: 'text', required: false, sortOrder: 14},
      {
        title: '资金渠道',
        checkerId: 'channelType',
        type: 'select',
        options: {ref: 'moneyChannel'},
        required: false,
        sortOrder: 14
      },

      {title: '起息日', checkerId: 'valueDate', type: 'quantum1', required: false, sortOrder: 8},
      {
        title: '资产池名称', checkerId: 'capitalPoolName', type: 'select-text',
        options: {ref: 'accountReceipts'}, required: false, sortOrder: 8
      },
      {
        title: '预计放款日期', checkerId: 'isPriorityLoanDate', type: 'machine-loandate',
        required: false, sortOrder: 10
      },
      {title: '转让价款', checkerId: 'changePrice', type: 'text', required: false, sortOrder: 15},
    ] as CheckersOutputModel[]
  };
  /** 待签署合同、待财务审批 */
  static signContract = {
    heads: [
      {label: '交易ID', value: 'mainFlowId', type: 'mainFlowId'},
      {label: '申请付款单位', value: 'projectCompany'},
      {label: '收款单位', value: 'debtUnit'},
      {label: '总部公司', value: 'headquarters'},
      {
        label: '渠道', value: 'type', _inList: {
          sort: false,
          search: true
        },
        type: 'text1',
      }, {label: '应收账款金额', value: 'receivable', type: 'receivable'},
      {label: '总部提单日期', value: 'headPreDate', type: 'date'},
      {label: '付款确认书编号', value: 'payConfirmId'},
      {label: '付款确认书', value: 'pdfProjectFiles', type: 'file1'},
      {label: '应收账款转让协议', value: 'receiveFiles', type: 'contract'},
      {label: '付款申请表', value: 'receivetable', type: 'contract'},
      {label: '当前信贷有权人审批状态', value: 'creditStatus', type: 'approvalstatus'},
      {label: '保理商是否签署合同', value: 'isFactoringSign', type: 'optionsIS2'},
      {label: '冻结一', value: 'freezeOne', type: 'freezeStatus'},
      {label: '冻结二', value: 'freezeTwo', type: 'freezeStatus'},
      {label: '履约文件是否已盖章', value: 'isPerformance', type: 'EnumPerformanceStatus'},
      {label: '审批方式', value: 'isPerson', type: 'approvalMethod'},
      {label: '资产池名称', value: 'capitalPoolName', type: 'capitalPoolName'},
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
    ] as ListHeadsFieldOutputModel[],
    searches: [
      {
        title: '渠道', checkerId: 'type', type: 'linkage-select',
        options: {ref: 'productType_logan'}, required: false, sortOrder: 12
      },
      {title: '交易ID', checkerId: 'mainFlowId', required: false, sortOrder: 2, type: 'text'},
      {title: '付款确认书编号', checkerId: 'payConfirmId', type: 'text', required: false, sortOrder: 3},
      // {
      //     title: '总部公司', checkerId: 'headquarters', type: 'select', options: { ref: 'abs_headquarters' },
      //     required: false, sortOrder: 4
      // },
      {title: '申请付款单位', checkerId: 'projectCompany', type: 'text', required: false, sortOrder: 5},
      {title: '收款单位', checkerId: 'debtUnit', type: 'text', required: false, sortOrder: 6},
      {title: '应收账款金额', checkerId: 'receivable', type: 'text', required: false, sortOrder: 7},
      {
        title: '保理商是否已签署合同', checkerId: 'isFactoringSign', type: 'select', options: {ref: 'bussStatus'},
        required: false, sortOrder: 8
      },
      {
        title: '当前信贷有权人审批状态', checkerId: 'creditStatus', type: 'select', options: {ref: 'approvalstatus'},
        required: false, sortOrder: 9
      },
      {title: '总部提单日期', checkerId: 'headPreDate', type: 'quantum1', required: false, sortOrder: 10},
      {
        title: '是否已推送金蝶云', checkerId: 'isPerson', type: 'select', required: false, sortOrder: 11,
        options: {ref: 'defaultRadio'}
      },
      {
        title: '当前财务有权人审批状态', checkerId: 'financeStatus', type: 'select', options: {ref: 'approvalstatus'},
        required: false, sortOrder: 12
      },
      {
        title: '履约证明是否已盖章', checkerId: 'isPerformance', type: 'select', required: false, sortOrder: 11,
        options: {ref: 'EnumPerformanceStatus'}
      },
      {title: '付款银行', checkerId: 'payBankName', type: 'text', required: false, sortOrder: 13},
      {title: '付款银行账号', checkerId: 'payBankAccount', type: 'text', required: false, sortOrder: 14},
      {
        title: '资金渠道',
        checkerId: 'channelType',
        type: 'select',
        options: {ref: 'moneyChannel'},
        required: false,
        sortOrder: 14
      },
      {title: '起息日', checkerId: 'valueDate', type: 'quantum1', required: false, sortOrder: 8},
      {
        title: '资产池名称', checkerId: 'capitalPoolName', type: 'select-text',
        options: {ref: 'accountReceipts'}, required: false, sortOrder: 8
      },
      {
        title: '预计放款日期', checkerId: 'isPriorityLoanDate', type: 'machine-loandate',
        required: false, sortOrder: 10
      },
      {title: '转让价款', checkerId: 'changePrice', type: 'text', required: false, sortOrder: 15},
    ] as CheckersOutputModel[]
  };
  /** 待放款、已放款 head */
  static headsCommon = {
    heads: [
      {label: '交易ID', value: 'mainFlowId', type: 'mainFlowId'},
      {label: '申请付款单位', value: 'projectCompany'},
      {label: '收款单位', value: 'debtUnit'},
      {label: '总部公司', value: 'headquarters'},
      {
        label: '渠道', value: 'type', _inList: {
          sort: false,
          search: true
        },
        type: 'text1',
      }, {label: '应收账款金额', value: 'receivable', type: 'receivable'},
      {label: '总部提单日期', value: 'headPreDate', type: 'date'},
      {label: '付款确认书编号', value: 'payConfirmId'},
      {label: '付款确认书', value: 'pdfProjectFiles', type: 'file1'},
      {label: '冻结一', value: 'freezeOne', type: 'freezeStatus'},
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
      {label: '资产池名称', value: 'capitalPoolName', type: 'capitalPoolName'},
      {label: '转让价款', value: 'changePrice', type: 'receivable'},
    ] as ListHeadsFieldOutputModel[]
  };
  /** 待放款、已放款 search */
  static searcherCommon = {
    searches: [
      {
        title: '渠道', checkerId: 'type', type: 'linkage-select',
        options: {ref: 'productType_logan'}, required: false, sortOrder: 12
      },
      {title: '交易ID', checkerId: 'mainFlowId', required: false, sortOrder: 2, type: 'text'},
      {title: '付款确认书编号', checkerId: 'payConfirmId', type: 'text', required: false, sortOrder: 3},
      {title: '申请付款单位', checkerId: 'projectCompany', type: 'text', required: false, sortOrder: 5},
      {title: '收款单位', checkerId: 'debtUnit', type: 'text', required: false, sortOrder: 6},
      {title: '应收账款金额', checkerId: 'receivable', type: 'text', required: false, sortOrder: 7},
      {
        title: '费用情况',
        checkerId: 'feeStatus',
        type: 'select',
        options: {ref: 'freeType'},
        required: false,
        sortOrder: 9
      },
      {title: '总部提单日期', checkerId: 'headPreDate', type: 'quantum1', required: false, sortOrder: 10},
      {title: '起息日', checkerId: 'valueDate', type: 'quantum1', required: false, sortOrder: 8},
      {title: '付款银行', checkerId: 'payBankName', type: 'text', required: false, sortOrder: 13},
      {title: '付款银行账号', checkerId: 'payBankAccount', type: 'text', required: false, sortOrder: 14},
      {
        title: '资金渠道',
        checkerId: 'channelType',
        type: 'select',
        options: {ref: 'moneyChannel'},
        required: false,
        sortOrder: 14
      },
      {
        title: '资产池名称', checkerId: 'capitalPoolName', type: 'select-text',
        options: {ref: 'accountReceipts'}, required: false, sortOrder: 8
      },
      {
        title: '预计放款日期', checkerId: 'isPriorityLoanDate', type: 'machine-loandate',
        required: false, sortOrder: 10
      },
      {
        title: '实际放款日', checkerId: 'realLoanDate', type: 'quantum1',
        required: false, sortOrder: 10
      },
    ] as CheckersOutputModel[]
  };

  static readonly config = {
    title: '审批放款-成都轨交',
    tabList: [
      {
        label: '待业务审批',
        value: TabValue.First,
        subTabList: [
          {
            label: '正常业务',
            value: SubTabValue.DOING,
            canSearch: true,
            canChecked: true,
            count: 0,
            edit: {
              headButtons: [
                {
                  label: '发起业务审批',
                  operate: 'initiate_examination',
                  post_url: '/jd_blh/approval',
                  disabled: false,
                },
                {
                  label: '导出清单',
                  operate: 'download_approval_list',
                  post_url: '/custom/avenger/down_file/download_approval_list',
                  disabled: false,
                  flag: 1,
                },
              ],
              rowButtons: [
                {
                  label: '账号变更',
                  operate: 'confirm_receivable',
                  post_url: '/customer/changecompany',
                  disabled: false,
                  click: (base: CommBase, params, xn: XnService, hwModeService: HwModeService) => {
                    // 拼接文件
                    xn.router.navigate([`/console/record/avenger/new/sub_factoring_change_520`],
                      {
                        queryParams: {
                          id: 'sub_factoring_change_520',
                          relate: 'mainFlowId',
                          relateValue: params.mainFlowId,
                        }
                      });
                  }
                },
              ]
            },
            searches: [...DragonApprovallistIndexTabConfig.normal.searches,
            ],
            headText: [...DragonApprovallistIndexTabConfig.normal.heads,
            ],
          },
          {
            label: '特殊业务',
            value: SubTabValue.SPECIAL,
            canSearch: true,
            canChecked: true,
            count: 0,
            edit: {
              headButtons: [
                {
                  label: '发起业务审批',
                  operate: 'initiate_examination',
                  post_url: '/jd_blh/approval',
                  disabled: false,
                },
                {
                  label: '导出清单',
                  operate: 'download_approval_list',
                  post_url: '/custom/avenger/down_file/download_approval_list',
                  disabled: false,
                  flag: 10,
                },
              ],
              rowButtons: [
                {
                  label: '账号变更',
                  operate: 'confirm_receivable',
                  post_url: '/customer/changecompany',
                  disabled: false,
                  click: (base: CommBase, params, xn: XnService, hwModeService: HwModeService) => {
                    // 拼接文件
                    xn.router.navigate([`/console/record/avenger/new/sub_factoring_change_520`],
                      {
                        queryParams: {
                          id: 'sub_factoring_change_520',
                          relate: 'mainFlowId',
                          relateValue: params.mainFlowId,
                        }
                      });
                  }
                },
              ]
            },
            searches: [...DragonApprovallistIndexTabConfig.special.searches,
            ],
            headText: [...DragonApprovallistIndexTabConfig.special.heads,
              {label: '付款申请表', value: 'receivetable', type: 'contract'},
            ],
          },
        ],
        post_url: '/aprloan/approval/list',
        params: 1,
      },
      {
        label: '业务审批中',
        value: TabValue.Sixth,
        subTabList: [
          {
            label: '进行中',
            value: SubTabValue.DOING,
            canSearch: true,
            canChecked: true,
            edit: {
              headButtons: [
                {
                  label: '审批通过',
                  operate: 'approval_ok',
                  post_url: '/jd_blh/passApproval',
                  disabled: false,
                },
                {
                  label: '审批拒绝',
                  operate: 'approval_reject',
                  post_url: '/jd_blh/passApproval',
                  disabled: false,
                },
                {
                  label: '导出清单',
                  operate: 'download_approval_list',
                  post_url: '/custom/avenger/down_file/download_approval_list',
                  disabled: false,
                  flag: 2,
                },
              ],
            },
            searches: DragonApprovallistIndexTabConfig.approval.searches,
            headText: [...DragonApprovallistIndexTabConfig.approval.heads,
              {label: '转让价款', value: 'changePrice', type: 'receivable'},
              {label: '起息日', value: 'valueDate', type: 'date'},
              {label: '付款申请表', value: 'receivetable', type: 'contract'},
              {label: '应收账款转让协议', value: 'receiveFiles', type: 'contract'},
              {label: '审批方式', value: 'isPerson', type: 'approvalMethod'},

            ]
          },
        ],
        post_url: '/aprloan/approval/list',
        params: 2,
      },
      {
        label: '待签署合同',
        value: TabValue.Third,
        subTabList: [
          {
            label: '进行中',
            value: SubTabValue.DOING,
            canSearch: true,
            canChecked: true,
            edit: {
              headButtons: [
                {
                  label: '批量签署合同',
                  operate: 'sign_contract',
                  post_url: '/jd_blh/signContract',
                  disabled: true,
                },
                {
                  label: '发起财务审批',
                  operate: 'finish_sign_contract',
                  post_url: '/jd_blh/jd_finish_sign',
                  disabled: true,
                },
                {
                  label: '导出清单',
                  operate: 'download_approval_list',
                  post_url: '/custom/avenger/down_file/download_approval_list',
                  disabled: false,
                  flag: 3,
                },
              ],
            },
            searches: [...DragonApprovallistIndexTabConfig.signContract.searches,
            ],
            headText: [...DragonApprovallistIndexTabConfig.signContract.heads,
              {label: '起息日', value: 'valueDate', type: 'date'},
              {label: '转让价款', value: 'changePrice', type: 'receivable'},

            ],
          },
        ],
        post_url: '/aprloan/approval/list',
        params: 3,
      },
      {
        label: '待财务审批',
        value: TabValue.Seventh,
        subTabList: [
          {
            label: '进行中',
            value: SubTabValue.DOING,
            canSearch: true,
            canChecked: true,
            edit: {
              headButtons: [
                {
                  label: '审批通过',
                  operate: 'finance_approval_ok',
                  post_url: '/jd_blh/passFinanceApproval',
                  disabled: false,
                },
                {
                  label: '审批拒绝',
                  operate: 'finance_approval_fail',
                  post_url: '/jd_blh/passFinanceApproval',
                  disabled: false,
                },
                {
                  label: '导出清单',
                  operate: 'download_approval_list',
                  post_url: '/custom/avenger/down_file/download_approval_list',
                  disabled: false,
                  flag: 3,
                },
              ],
            },
            searches: [...DragonApprovallistIndexTabConfig.signContract.searches,
              {
                title: '付款确认书校验结果', checkerId: 'pdfProjectResult', type: 'select', options: {ref: 'pdfProjectResult'},
                required: false, sortOrder: 4
              },

            ],
            headText: [...DragonApprovallistIndexTabConfig.signContract.heads,
              {label: '当前财务有权人审批状态', value: 'financeStatus', type: 'approvalstatus'},
              {label: '起息日', value: 'valueDate', type: 'date'},
              {label: '转让价款', value: 'changePrice', type: 'receivable'},
            ],
          },
        ],
        post_url: '/aprloan/approval/list',
        params: 7,
      },
      {
        label: '待放款',
        value: TabValue.Fourth,
        subTabList: [
          {
            label: '进行中',
            value: SubTabValue.DOING,
            canSearch: true,
            canChecked: true,
            edit: {
              headButtons: [
                {
                  label: '出纳下载表格',
                  operate: 'loadFinancing',
                  post_url: '/jd_blh/waitLoan',
                  disabled: false,
                },
                {
                  label: '会计下载表格',
                  operate: 'accountDownload',
                  post_url: '/aprloan/approval/accountDownload',

                  disabled: false,
                },
                {
                  label: '放款成功',
                  operate: 'loan_ok',
                  post_url: '/jd_blh/waitLoan',
                  disabled: false,
                },
                {
                  label: '放款失败',
                  operate: 'loan_fail',
                  post_url: '/jd_blh/waitLoan',
                  disabled: false,
                },
                {
                  label: '导出清单',
                  operate: 'download_approval_list',
                  post_url: '/custom/avenger/down_file/download_approval_list',
                  disabled: false,
                  flag: 4,
                },
              ],
            },
            searches: [...DragonApprovallistIndexTabConfig.searcherCommon.searches,
              {
                title: '出纳下载次数', checkerId: 'cnDownTimes', type: 'select',
                options: {ref: 'accountReceipts'}, required: false, sortOrder: 9
              },
              {
                title: '会计下载次数', checkerId: 'kjDownTimes', type: 'select',
                options: {ref: 'accountReceipts'}, required: false, sortOrder: 10
              },
              {title: '转让价款', checkerId: 'changePrice', type: 'text', required: false, sortOrder: 15},
            ],
            headText: [...DragonApprovallistIndexTabConfig.headsCommon.heads,
              {label: '当前财务有权人审批状态', value: 'financeStatus', type: 'approvalstatus'},
              {label: '应收账款转让协议', value: 'receiveFiles', type: 'contract'},
              {label: '起息日', value: 'valueDate', type: 'date'},
              {label: '保理融资到期日', value: 'factoringEndDate', type: 'date'},
              {label: '付款申请表', value: 'receivetable', type: 'contract'},
              {label: '出纳下载次数', value: 'cnDownTimes', type: 'DownTimes'},
              {label: '会计下载次数', value: 'kjDownTimes', type: 'DownTimes'},
              {label: '费用情况', value: 'feeStatus', type: 'freeType'},
              {label: '审批方式', value: 'isPerson', type: 'approvalMethod'}
            ],
          },
        ],
        post_url: '/aprloan/approval/list',
        params: 4,
      },
      {
        label: '已放款',
        value: TabValue.Fifth,
        subTabList: [
          {
            label: '进行中',
            value: SubTabValue.DOING,
            canSearch: true,
            canChecked: true,
            edit: {
              leftheadButtons: [
                {
                  label: '付款回单上传',
                  operate: 'person_return_upload',
                  post_url: '',
                  disabled: true,
                },
                {
                  label: '系统匹配付款回单',
                  operate: 'system_loan_receipt',
                  post_url: '',
                  disabled: false,
                },
              ],
              headButtons: [
                {
                  label: '重新审批',
                  operate: 'approval_again',
                  post_url: '/customer/changecompany',
                  disabled: false,
                },
                {
                  label: '导出清单',
                  operate: 'download_approval_list',
                  post_url: '/custom/avenger/down_file/download_approval_list',
                  disabled: false,
                  flag: 5,
                },
              ],
              rowButtons: [
                {
                  label: '退款',
                  operate: 'confirm_receivable',
                  post_url: '/customer/changecompany',
                  disabled: false,
                  click: (base: CommBase, params, xn: XnService, hwModeService: HwModeService) => {
                    // 拼接文件
                    xn.router.navigate([`/console/record/avenger/new/sub_approval_payback_530`],
                      {
                        queryParams: {
                          id: 'sub_approval_payback_530',
                          relate: 'mainFlowId',
                          relateValue: params.mainFlowId,
                        }
                      });
                  }
                },
              ]
            },
            searches: [...DragonApprovallistIndexTabConfig.searcherCommon.searches,
              {
                title: '是否需退款', checkerId: 'isNeedBack', type: 'select', required: false, sortOrder: 10,
                options: {ref: 'IsbackMoney'},
              },
              {
                title: '是否收到商票', checkerId: 'honourStatus', type: 'select', required: false, sortOrder: 11,
                options: {ref: 'bussStatus'}
              },
              {
                title: '退款状态', checkerId: 'backStatus', type: 'select', options: {ref: 'moneyback'},
                required: false, sortOrder: 12
              },
              {title: '转让价款', checkerId: 'changePrice', type: 'text', required: false, sortOrder: 15},
            ],
            headText: [...DragonApprovallistIndexTabConfig.headsCommon.heads,
              {label: '起息日', value: 'valueDate', type: 'date'},
              {label: '付款申请表', value: 'receivetable', type: 'contract'},
              {label: '实际放款日', value: 'realLoanDate', type: 'date'},
              {label: '费用情况', value: 'feeStatus', type: 'freeType'},
              {label: '放款回单', value: 'jdBackFile', type: 'file1'},
              {label: '是否需要退款', value: 'isNeedBack', type: 'IsbackMoney'},
              {label: '退款状态', value: 'backStatus', type: 'moneyback'},
              {label: '发起退款时间', value: 'backMoneyTime', type: 'date'},
              {label: '商票号码', value: 'honorNum'},
              {label: '银行流水号', value: 'exPayFlowId'},
              {label: '审批方式', value: 'isPerson', type: 'approvalMethod'},


            ],
          },
        ],
        post_url: '/aprloan/approval/list',
        params: 5,
      },
    ]
  } as TabConfigModel;

  static getConfig() {
    return this.config;
  }
}

export enum SubTabEnum {
  /** 进行中 */
  DOING   = '1',
  /** 待还款 */
  TODO    = '2',
  /** 已完成 */
  DONE    = '3',
  SPECIAL = '10',
}
