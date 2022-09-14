
import { CheckersOutputModel } from 'libs/shared/src/lib/config/checkers';
import { ListHeadsFieldOutputModel, TabConfigModel } from 'libs/shared/src/lib/config/list-config-model';
import CommBase from 'libs/shared/src/lib/public/component/comm-base';
import { HwModeService } from 'libs/shared/src/lib/services/hw-mode.service';
import { XnService } from 'libs/shared/src/lib/services/xn.service';



export default class XnGemdaleApprovalListIndexTabConfig {
  // 交易列表 -采购融资，默认配置
  static normalbusiness = {
    heads: [
      { label: '交易ID', value: 'mainFlowId', type: 'mainFlowId' },
      { label: '申请付款单位', value: 'projectCompany' },
      { label: '收款单位', value: 'debtUnit' },
      { label: '总部公司', value: 'headquarters' },
      {
        label: '渠道', value: 'type', _inList: {
          sort: false,
          search: true
        },
        type: 'text1',
      },
      { label: '应收账款金额', value: 'receivable', type: 'receivable' },
      { label: '总部提单日期', value: 'headPreDate', type: 'date' },
      { label: '付款确认书编号', value: 'payConfirmId' },
      { label: '付款确认书', value: 'pdfProjectFiles', type: 'file1' },
      { label: '付确信息比对结果', value: 'payCompareStatus', type: 'resultcompare' },
      { label: '是否变更账号', value: 'ischangeAccount', type: 'optionsIS' },
      { label: '冻结一', value: 'freezeOne', type: 'freezeStatus' },
      { label: '资产池名称', value: 'capitalPoolName', type: 'capitalPoolName', },
      { label: '预计放款日期', value: 'priorityLoanDate', type: 'date' },
      { label: '申请付款单位是否签署合同', value: 'isSupplierSign', type: 'optionsIS1' },
      { label: '收款单位是否签署合同', value: 'isUpstreamSign', type: 'optionsIS2' },
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
        options: { ref: 'productType_new_jd' }, required: false, sortOrder: 12
      },
      { title: '交易ID', checkerId: 'mainFlowId', type: 'text', required: false, sortOrder: 2 },
      { title: '付款确认书编号', checkerId: 'payConfirmId', type: 'text', required: false, sortOrder: 3 },
      { title: '申请付款单位', checkerId: 'projectCompany', type: 'text', required: false, sortOrder: 5 },
      { title: '收款单位', checkerId: 'debtUnit', type: 'text', required: false, sortOrder: 6 },
      { title: '应收账款金额', checkerId: 'receivable', type: 'text', required: false, sortOrder: 7 },
      { title: '付款银行', checkerId: 'payBankName', type: 'text', required: false, sortOrder: 13 },
      { title: '付款银行账号', checkerId: 'payBankAccount', type: 'text', required: false, sortOrder: 14 },
      { title: '资金渠道', checkerId: 'channelType', type: 'select', options: { ref: 'moneyChannel' }, required: false, sortOrder: 14 },

      {
        title: '付确信息比对结果', checkerId: 'payCompareStatus', type: 'select', required: false, sortOrder: 8,
        options: { ref: 'CompareStatus' }
      },
      {
        title: '供应商是否签署合同', checkerId: 'isSupplierSign', type: 'select', required: false, sortOrder: 9,
        options: { ref: 'bussStatus' }
      },
      { title: '总部提单日期', checkerId: 'headPreDate', type: 'quantum1', required: false, sortOrder: 10 },
      {
        title: '是否变更账号', checkerId: 'ischangeAccount', type: 'select', required: false, sortOrder: 11,
        options: { ref: 'bussStatus' }
      },
      {
        title: '是否优先放款', checkerId: 'ispayAdvance', type: 'select', required: false, sortOrder: 12,
        options: { ref: 'bussStatus' },
      },
      { title: '起息日', checkerId: 'valueDate', type: 'quantum1', required: false, sortOrder: 8 },
      {
        title: '资产池名称', checkerId: 'capitalPoolName', type: 'select-text',
        options: { ref: 'accountReceipts' }, required: false, sortOrder: 8
      },
      {
        title: '预计放款日期', checkerId: 'isPriorityLoanDate', type: 'machine-loandate',
        required: false, sortOrder: 10
      },
    ] as CheckersOutputModel[]
  };
  // 已上传
  static SpecialBusinesslist = {
    heads: [
      { label: '交易ID', value: 'mainFlowId', type: 'mainFlowId' },
      { label: '申请付款单位', value: 'projectCompany' },
      { label: '收款单位', value: 'debtUnit' },
      { label: '总部公司', value: 'headquarters', },
      {
        label: '渠道', value: 'type', _inList: {
          sort: false,
          search: true
        },
        type: 'text1',
      }, { label: '应收账款金额', value: 'receivable', type: 'receivable' },
      { label: '总部提单日期', value: 'headPreDate', type: 'date' },
      { label: '付款确认书编号', value: 'payConfirmId', },
      { label: '付款确认书', value: 'pdfProjectFiles', type: 'file1' },
      { label: '付确信息比对结果', value: 'payCompareStatus', type: 'resultcompare' },
      { label: '是否变更账号', value: 'ischangeAccount', type: 'optionsIS' },
      { label: '冻结一', value: 'freezeOne', type: 'freezeStatus' },
      { label: '资产池名称', value: 'capitalPoolName', type: 'capitalPoolName', },
      { label: '预计放款日期', value: 'priorityLoanDate', type: 'date' },
      { label: '当前信贷有权审批状态', value: 'creditStatus', type: 'approvalstatus' },
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
        options: { ref: 'productType_new_jd' }, required: false, sortOrder: 12
      },
      { title: '交易ID', checkerId: 'mainFlowId', type: 'text', required: false, sortOrder: 2 },
      { title: '付款确认书编号', checkerId: 'payConfirmId', type: 'text', required: false, sortOrder: 3 },
      { title: '申请付款单位', checkerId: 'projectCompany', type: 'text', required: false, sortOrder: 5 },
      { title: '收款单位', checkerId: 'debtUnit', type: 'text', required: false, sortOrder: 6 },
      { title: '应收账款金额', checkerId: 'receivable', type: 'text', required: false, sortOrder: 7 },
      {
        title: '付确信息比对结果', checkerId: 'payCompareStatus', type: 'select', options: { ref: 'CompareStatus' },
        required: false, sortOrder: 8
      },
      {
        title: '当前信贷人有权人审批状态', checkerId: 'creditStatus', type: 'select', options: { ref: 'approvalstatus' },
        required: false, sortOrder: 9
      },
      { title: '总部提单日期', checkerId: 'headPreDate', type: 'quantum1', required: false, sortOrder: 10 },
      {
        title: '是否变更账号', checkerId: 'ischangeAccount', type: 'select', options: { ref: 'bussStatus' },
        required: false, sortOrder: 11
      },
      {
        title: '当前财务有权人审批状态', checkerId: 'financeStatus', type: 'select', options: { ref: 'approvalstatus' },
        required: false, sortOrder: 12
      },
      {
        title: '是否优先放款', checkerId: 'ispayAdvance', type: 'select', required: false, sortOrder: 11,
        options: { ref: 'bussStatus' }
      },
      { title: '付款银行', checkerId: 'payBankName', type: 'text', required: false, sortOrder: 13 },
      { title: '付款银行账号', checkerId: 'payBankAccount', type: 'text', required: false, sortOrder: 14 },
      { title: '资金渠道', checkerId: 'channelType', type: 'select', options: { ref: 'moneyChannel' }, required: false, sortOrder: 14 },

      { title: '起息日', checkerId: 'valueDate', type: 'quantum1', required: false, sortOrder: 8 },
      {
        title: '资产池名称', checkerId: 'capitalPoolName', type: 'select-text',
        options: { ref: 'accountReceipts' }, required: false, sortOrder: 8
      },
      {
        title: '预计放款日期', checkerId: 'isPriorityLoanDate', type: 'machine-loandate',
        required: false, sortOrder: 10
      },
      { title: '转让价款', checkerId: 'changePrice', type: 'text', required: false, sortOrder: 15 },
    ] as CheckersOutputModel[]
  };
  // 审批中
  static approvalBusinesslist = {
    heads: [
      { label: '交易ID', value: 'mainFlowId', type: 'mainFlowId' },
      { label: '申请付款单位', value: 'projectCompany' },
      { label: '收款单位', value: 'debtUnit' },
      { label: '总部公司', value: 'headquarters', },
      {
        label: '渠道', value: 'type', _inList: {
          sort: false,
          search: true
        },
        type: 'text1',
      },
      { label: '当前信贷有权审批状态', value: 'creditStatus', type: 'approvalstatus' },
      { label: '应收账款金额', value: 'receivable', type: 'receivable' },
      { label: '总部提单日期', value: 'headPreDate', type: 'date' },
      { label: '付款确认书编号', value: 'payConfirmId', },
      { label: '付款确认书', value: 'pdfProjectFiles', type: 'file1' },
      { label: '付确信息比对结果', value: 'payCompareStatus', type: 'resultcompare' },
      { label: '是否变更账号', value: 'ischangeAccount', type: 'optionsIS' },
      { label: '冻结一', value: 'freezeOne', type: 'freezeStatus' },
      { label: '资产池名称', value: 'capitalPoolName', type: 'capitalPoolName', },
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
        options: { ref: 'productType_new_jd' }, required: false, sortOrder: 12
      },
      { title: '交易ID', checkerId: 'mainFlowId', type: 'text', required: false, sortOrder: 2 },
      { title: '付款确认书编号', checkerId: 'payConfirmId', type: 'text', required: false, sortOrder: 3 },
      { title: '申请付款单位', checkerId: 'projectCompany', type: 'text', required: false, sortOrder: 5 },
      { title: '收款单位', checkerId: 'debtUnit', type: 'text', required: false, sortOrder: 6 },
      { title: '应收账款金额', checkerId: 'receivable', type: 'text', required: false, sortOrder: 7 },
      {
        title: '付确信息比对结果', checkerId: 'payCompareStatus', type: 'select', options: { ref: 'CompareStatus' },
        required: false, sortOrder: 8
      },
      {
        title: '当前信贷人有权人审批状态', checkerId: 'creditStatus', type: 'select', options: { ref: 'approvalstatus' },
        required: false, sortOrder: 9
      },
      { title: '总部提单日期', checkerId: 'headPreDate', type: 'quantum1', required: false, sortOrder: 10 },
      {
        title: '是否变更账号', checkerId: 'ischangeAccount', type: 'select', options: { ref: 'bussStatus' },
        required: false, sortOrder: 11
      },
      {
        title: '当前财务有权人审批状态', checkerId: 'financeStatus', type: 'select', options: { ref: 'approvalstatus' },
        required: false, sortOrder: 12
      },
      { title: '付款银行', checkerId: 'payBankName', type: 'text', required: false, sortOrder: 13 },
      { title: '付款银行账号', checkerId: 'payBankAccount', type: 'text', required: false, sortOrder: 14 },
      { title: '资金渠道', checkerId: 'channelType', type: 'select', options: { ref: 'moneyChannel' }, required: false, sortOrder: 14 },

      { title: '起息日', checkerId: 'valueDate', type: 'quantum1', required: false, sortOrder: 8 },
      {
        title: '资产池名称', checkerId: 'capitalPoolName', type: 'select-text',
        options: { ref: 'accountReceipts' }, required: false, sortOrder: 8
      },
      {
        title: '预计放款日期', checkerId: 'isPriorityLoanDate', type: 'machine-loandate',
        required: false, sortOrder: 10
      },
      { title: '转让价款', checkerId: 'changePrice', type: 'text', required: false, sortOrder: 15 },
    ] as CheckersOutputModel[]
  };
  static readySigncontract = {
    heads: [
      { label: '交易ID', value: 'mainFlowId', type: 'mainFlowId' },
      { label: '申请付款单位', value: 'projectCompany' },
      { label: '收款单位', value: 'debtUnit' },
      { label: '总部公司', value: 'headquarters', },
      {
        label: '渠道', value: 'type', _inList: {
          sort: false,
          search: true
        },
        type: 'text1',
      }, { label: '应收账款金额', value: 'receivable', type: 'receivable' },
      { label: '总部提单日期', value: 'headPreDate', type: 'date' },
      { label: '付款确认书编号', value: 'payConfirmId', },
      { label: '付款确认书', value: 'pdfProjectFiles', type: 'file1' },
      { label: '应收账款转让协议', value: 'receiveFiles', type: 'contract' },
      { label: '付款申请表', value: 'receivetable', type: 'contract' },
      { label: '当前信贷有权审批状态', value: 'creditStatus', type: 'approvalstatus' },
      { label: '保理商是否签署合同', value: 'isFactoringSign', type: 'optionsIS2' },
      { label: '是否具备放款条件', value: 'isCanLoan', type: 'optionsIS2' },
      { label: '冻结一', value: 'freezeOne', type: 'freezeStatus' },
      { label: '冻结二', value: 'freezeTwo', type: 'freezeStatus' },
      { label: '履约文件是否已盖章', value: 'isPerformance', type: 'EnumPerformanceStatus' },
      { label: '审批方式', value: 'isPerson', type: 'approvalMethod' },
      { label: '资产池名称', value: 'capitalPoolName', type: 'capitalPoolName', },
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
        options: { ref: 'productType_new_jd' }, required: false, sortOrder: 12
      },
      { title: '交易ID', checkerId: 'mainFlowId', required: false, sortOrder: 2, type: 'text' },
      { title: '付款确认书编号', checkerId: 'payConfirmId', type: 'text', required: false, sortOrder: 3 },
      { title: '申请付款单位', checkerId: 'projectCompany', type: 'text', required: false, sortOrder: 5 },
      { title: '收款单位', checkerId: 'debtUnit', type: 'text', required: false, sortOrder: 6 },
      { title: '应收账款金额', checkerId: 'receivable', type: 'text', required: false, sortOrder: 7 },
      {
        title: '保理商是否已签署合同', checkerId: 'isFactoringSign', type: 'select', options: { ref: 'bussStatus' },
        required: false, sortOrder: 8
      },
      {
        title: '当前信贷人有权人审批状态', checkerId: 'creditStatus', type: 'select', options: { ref: 'approvalstatus' },
        required: false, sortOrder: 9
      },
      { title: '总部提单日期', checkerId: 'headPreDate', type: 'quantum1', required: false, sortOrder: 10 },
      {
        title: '是否已推送金蝶云', checkerId: 'isPerson', type: 'select', required: false, sortOrder: 11,
        options: { ref: 'defaultRadio' }
      },
      {
        title: '当前财务有权人审批状态', checkerId: 'financeStatus', type: 'select', options: { ref: 'approvalstatus' },
        required: false, sortOrder: 12
      },
      {
        title: '履约证明是否已盖章', checkerId: 'isPerformance', type: 'select', required: false, sortOrder: 11,
        options: { ref: 'EnumPerformanceStatus' }
      },
      { title: '付款银行', checkerId: 'payBankName', type: 'text', required: false, sortOrder: 13 },
      { title: '付款银行账号', checkerId: 'payBankAccount', type: 'text', required: false, sortOrder: 14 },
      { title: '资金渠道', checkerId: 'channelType', type: 'select', options: { ref: 'moneyChannel' }, required: false, sortOrder: 14 },
      { title: '起息日', checkerId: 'valueDate', type: 'quantum1', required: false, sortOrder: 8 },
      {
        title: '资产池名称', checkerId: 'capitalPoolName', type: 'select-text',
        options: { ref: 'accountReceipts' }, required: false, sortOrder: 8
      },
      {
        title: '预计放款日期', checkerId: 'isPriorityLoanDate', type: 'machine-loandate',
        required: false, sortOrder: 10
      },
      { title: '转让价款', checkerId: 'changePrice', type: 'text', required: false, sortOrder: 15 },
    ] as CheckersOutputModel[]
  };
  static headscommon = {
    heads: [
      { label: '交易ID', value: 'mainFlowId', type: 'mainFlowId' },
      { label: '申请付款单位', value: 'projectCompany' },
      { label: '收款单位', value: 'debtUnit' },
      { label: '总部公司', value: 'headquarters' },
      {
        label: '渠道', value: 'type', _inList: {
          sort: false,
          search: true
        },
        type: 'text1',
      }, { label: '应收账款金额', value: 'receivable', type: 'receivable' },
      { label: '总部提单日期', value: 'headPreDate', type: 'date' },
      { label: '付款确认书编号', value: 'payConfirmId' },
      { label: '付款确认书', value: 'pdfProjectFiles', type: 'file1' },
      { label: '冻结一', value: 'freezeOne', type: 'freezeStatus' },
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
      { label: '资产池名称', value: 'capitalPoolName', type: 'capitalPoolName', },
    ] as ListHeadsFieldOutputModel[]
  };
  static searcherCommon = {
    searches: [
      {
        title: '渠道', checkerId: 'type', type: 'linkage-select',
        options: { ref: 'productType_new_jd' }, required: false, sortOrder: 12
      },
      { title: '交易ID', checkerId: 'mainFlowId', required: false, sortOrder: 2, type: 'text' },
      { title: '付款确认书编号', checkerId: 'payConfirmId', type: 'text', required: false, sortOrder: 3 },
      { title: '申请付款单位', checkerId: 'projectCompany', type: 'text', required: false, sortOrder: 5 },
      { title: '收款单位', checkerId: 'debtUnit', type: 'text', required: false, sortOrder: 6 },
      { title: '应收账款金额', checkerId: 'receivable', type: 'text', required: false, sortOrder: 7 },
      { title: '费用情况', checkerId: 'feeStatus', type: 'select', options: { ref: 'freeType' }, required: false, sortOrder: 9 },
      { title: '总部提单日期', checkerId: 'headPreDate', type: 'quantum1', required: false, sortOrder: 10 },
      { title: '起息日', checkerId: 'valueDate', type: 'quantum1', required: false, sortOrder: 8 },
      { title: '付款银行', checkerId: 'payBankName', type: 'text', required: false, sortOrder: 13 },
      { title: '付款银行账号', checkerId: 'payBankAccount', type: 'text', required: false, sortOrder: 14 },
      { title: '资金渠道', checkerId: 'channelType', type: 'select', options: { ref: 'moneyChannel' }, required: false, sortOrder: 14 },
      {
        title: '资产池名称', checkerId: 'capitalPoolName', type: 'select-text',
        options: { ref: 'accountReceipts' }, required: false, sortOrder: 8
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


  // 多标签页，A,B,C,D,E,F......
  static readonly config = {
    avenger: {
      title: '审批放款-金地-香纳',
      tabList: [
        {
          label: '待业务审批',
          value: 'A',
          subTabList: [
            {
              label: '正常业务',
              value: 'DOING',
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
                  // TODO
                  {
                    label: '账号变更',
                    operate: 'confirm_receivable',
                    post_url: '/customer/changecompany',
                    disabled: false,
                    click: (base: CommBase, params, xn: XnService, hwModeService: HwModeService) => {
                      // 拼接文件
                      xn.router.navigate([`/console/record/avenger/new/sub_factoring_change_jd_520`],
                        {
                          queryParams: {
                            id: 'sub_factoring_change_jd_520',
                            relate: 'mainFlowId',
                            relateValue: params.mainFlowId,
                          }
                        });
                    }
                  },
                ]
              },
              searches: [...XnGemdaleApprovalListIndexTabConfig.normalbusiness.searches,

              ],
              headText: [...XnGemdaleApprovalListIndexTabConfig.normalbusiness.heads,
              { label: '付款申请表', value: 'receivetable', type: 'contract' },
              ],
            },

            {
              label: '特殊业务',
              value: 'SPECIAL',
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
                  // TODO
                  {
                    label: '账号变更',
                    operate: 'confirm_receivable',
                    post_url: '/customer/changecompany',
                    disabled: false,
                    click: (base: CommBase, params, xn: XnService, hwModeService: HwModeService) => {
                      // 拼接文件
                      xn.router.navigate([`/console/record/avenger/new/sub_factoring_change_jd_520`],
                        {
                          queryParams: {
                            id: 'sub_factoring_change_jd_520',
                            relate: 'mainFlowId',
                            relateValue: params.mainFlowId,
                          }
                        });
                    }
                  },
                ]
              },
              searches: [...XnGemdaleApprovalListIndexTabConfig.SpecialBusinesslist.searches,
              ],
              headText: [...XnGemdaleApprovalListIndexTabConfig.SpecialBusinesslist.heads,
              { label: '付款申请表', value: 'receivetable', type: 'contract' },
              ],
            },
          ],
          post_url: '/aprloan/approval/list',
          params: 1,


        },
        {
          label: '业务审批中',
          value: 'F',
          subTabList: [
            {
              label: '进行中',
              value: 'DOING',
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
              searches: XnGemdaleApprovalListIndexTabConfig.approvalBusinesslist.searches,
              headText: [...XnGemdaleApprovalListIndexTabConfig.approvalBusinesslist.heads,
              { label: '转让价款', value: 'changePrice', type: 'receivable' },
              { label: '起息日', value: 'valueDate', type: 'date' },
              { label: '付款申请表', value: 'receivetable', type: 'contract' },
              { label: '应收账款转让协议', value: 'receiveFiles', type: 'contract' },
              { label: '审批方式', value: 'isPerson', type: 'approvalMethod' },

              ]
            },
          ],
          post_url: '/aprloan/approval/list',
          params: 2,

        },
        {
          label: '待签署合同',
          value: 'C',
          subTabList: [
            {
              label: '进行中',
              value: 'DOING',
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
                    post_url: '/jd_finish_sign',
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
              searches: [...XnGemdaleApprovalListIndexTabConfig.readySigncontract.searches,

              ],
              headText: [...XnGemdaleApprovalListIndexTabConfig.readySigncontract.heads,
              { label: '起息日', value: 'valueDate', type: 'date' },
              { label: '转让价款', value: 'changePrice', type: 'receivable' },

              ],


            },
          ],
          post_url: '/aprloan/approval/list',
          params: 3,
        },
        {
          label: '待财务审批',
          value: 'H',
          subTabList: [
            {
              label: '进行中',
              value: 'DOING',
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
                    flag: 7,
                  },
                ],
              },
              searches: [...XnGemdaleApprovalListIndexTabConfig.searcherCommon.searches,
              {
                title: '付款确认书校验结果', checkerId: 'pdfProjectResult', type: 'select', options: { ref: 'pdfProjectResult' },
                required: false, sortOrder: 4
              },

              ],
              headText: [...XnGemdaleApprovalListIndexTabConfig.headscommon.heads,
              { label: '当前财务有权审批状态', value: 'financeStatus', type: 'approvalstatus' },
              { label: '应收账款转让协议', value: 'receiveFiles', type: 'contract' },
              { label: '起息日', value: 'valueDate', type: 'date' },
              { label: '保理融资到期日', value: 'factoringEndDate', type: 'date' },
              { label: '转让价款', value: 'changePrice', type: 'receivable' },
              { label: '付款申请表', value: 'receivetable', type: 'contract' },
              { label: '费用情况', value: 'feeStatus', type: 'freeType' },
              { label: '审批方式', value: 'isPerson', type: 'approvalMethod' }
              ],
            },
          ],
          post_url: '/aprloan/approval/list',
          params: 7,
        },
        {
          label: '待放款',
          value: 'D',
          subTabList: [
            {
              label: '进行中',
              value: 'DOING',
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
              searches: [...XnGemdaleApprovalListIndexTabConfig.searcherCommon.searches,
              {
                title: '出纳下载次数', checkerId: 'cnDownTimes', type: 'select',
                options: { ref: 'accountReceipts' }, required: false, sortOrder: 9
              },
              {
                title: '会计下载次数', checkerId: 'kjDownTimes', type: 'select',
                options: { ref: 'accountReceipts' }, required: false, sortOrder: 10
              },
              { title: '转让价款', checkerId: 'changePrice', type: 'text', required: false, sortOrder: 15 },
              ],
              headText: [...XnGemdaleApprovalListIndexTabConfig.headscommon.heads,
              { label: '当前财务有权审批状态', value: 'financeStatus', type: 'approvalstatus' },
              { label: '应收账款转让协议', value: 'receiveFiles', type: 'contract' },
              { label: '起息日', value: 'valueDate', type: 'date' },
              { label: '保理融资到期日', value: 'factoringEndDate', type: 'date' },
              { label: '转让价款', value: 'changePrice', type: 'receivable' },
              { label: '付款申请表', value: 'receivetable', type: 'contract' },
              { label: '出纳下载次数', value: 'cnDownTimes', type: 'DownTimes' },
              { label: '会计下载次数', value: 'kjDownTimes', type: 'DownTimes' },
              { label: '费用情况', value: 'feeStatus', type: 'freeType' },
              { label: '审批方式', value: 'isPerson', type: 'approvalMethod' }
              ],
            },
          ],
          post_url: '/aprloan/approval/list',
          params: 4,

        },
        {
          label: '已放款',
          value: 'E',
          subTabList: [
            {
              label: '进行中',
              value: 'DOING',
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
                    label: '金地放款反馈',
                    operate: 'loan_back',
                    post_url: '/sub_system/jd_system/report_loan_results',
                    disabled: false,
                  },
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
                      console.log('commbase=>', CommBase, params);
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
              searches: [...XnGemdaleApprovalListIndexTabConfig.searcherCommon.searches,
              {
                title: '是否需退款', checkerId: 'isNeedBack', type: 'select', required: false, sortOrder: 10,
                options: { ref: 'IsbackMoney' },
              },
              {
                title: '是否收到商票', checkerId: 'honourStatus', type: 'select', required: false, sortOrder: 11,
                options: { ref: 'bussStatus' }
              },
              {
                title: '退款状态', checkerId: 'backStatus', type: 'select', options: { ref: 'moneyback' },
                required: false, sortOrder: 12
              },
              { title: '转让价款', checkerId: 'changePrice', type: 'text', required: false, sortOrder: 15 },
              {
                title: '数据来源', checkerId: 'wkType', type: 'select', options: { ref: 'vankeDataSource' },
                required: false, sortOrder: 16
              },
              {
                title: '放款状态', checkerId: 'jdLoanFailStatus', type: 'select',
                options: { ref: 'jdLoanFailStatus', showWhen: ['wkType', '1'] }, required: false, sortOrder: 17
              },
              {
                title: '金地放款批次号', checkerId: 'jdLoanBatchNumber', type: 'text',
                options: { showWhen: ['wkType', '1'] }, required: false, sortOrder: 18
              },
              ],
              headText: [...XnGemdaleApprovalListIndexTabConfig.headscommon.heads,
              { label: '起息日', value: 'valueDate', type: 'date' },
              { label: '付款申请表', value: 'receivetable', type: 'contract' },
              { label: '实际放款日', value: 'realLoanDate', type: 'date' },
              { label: '费用情况', value: 'feeStatus', type: 'freeType' },
              { label: '放款回单', value: 'jdBackFile', type: 'file' },
              { label: '是否需要退款', value: 'isNeedBack', type: 'IsbackMoney' },
              { label: '退款状态', value: 'backStatus', type: 'moneyback' },
              { label: '发起退款时间', value: 'backMoneyTime', type: 'date' },
              { label: '商票号码', value: 'honorNum' },
              { label: '转让价款', value: 'changePrice', type: 'receivable' },
              { label: '审批方式', value: 'isPerson', type: 'approvalMethod' },
              { label: '资产池期数', value: 'managerPeriods' },
              { label: '数据来源', value: 'wkType', type: 'vankeDataSource' },
              { label: '放款状态', value: 'jdLoanFailStatus', type: 'jdLoanFailStatus' },
              { label: '金地放款批次号', value: 'jdLoanBatchNumber', type: 'jdLoanBatchNumber' },
              { label: '放款异常原因', value: 'jdLoanFailReason', type: 'jdLoanFailReason' },
              ],
            },
          ],
          post_url: '/aprloan/approval/list',
          params: 5,

        },
      ]
    } as TabConfigModel
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
  H = 'avenger',
}
