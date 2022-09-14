import { CheckersOutputModel } from 'libs/shared/src/lib/config/checkers';
import { ListHeadsFieldOutputModel, TabListOutputModel } from 'libs/shared/src/lib/config/list-config-model';


// 标准保理 -万科接口数据列表
export default class VankedataDockingConfig {
  // 地产类ABS
  static dataLockinglist = {
    heads: [
      {
        label: '应收账款受让方', value: 'capitalName', type: 'text',
      },
      { label: '托管行', value: 'bankName' },
      { label: '申请付款单位', value: 'applyCompanyName', },
      { label: '供应商', value: 'contractSupplier', type: 'text' },
      { label: '收款单位户名', value: 'supplierName' },
      {
        label: '保理融资到期日', value: 'expiredDate', type: 'date', _inList: {
          sort: true,
          search: true
        },
      },
      {
        label: '应收账款金额', value: 'financingAmount', type: 'money', _inList: {
          sort: true,
          search: true
        }
      },
      {
        label: '合同归档号', value: 'contractNumber', type: 'text',
      },
      {
        label: '付款确认书编号', value: 'transNumber', type: 'text', _inList: {
          sort: true,
          search: true
        },
      },
      { label: '供应商收款银行', value: 'payeeBankName', type: 'text' },
      { label: '供应商收款账号', value: 'payeeAccountName', type: 'text' },
      { label: '资金中心付款账号', value: 'payAccount', type: 'text' },
      { label: '资金中心付款银行', value: 'payBank', type: 'text' },

      { label: '项目名称', value: 'curProject', type: '' },
      {
        label: '融资单唯一标志码', value: 'uuid', type: 'text',
      },
      { label: '预录入发票号码', value: 'numberList', type: 'invoiceNum' },
      { label: '预录入发票金额', value: 'sumInvoiceAmount', type: 'money' },
      { label: '申请付款单位归属城市', value: 'cityCompany', type: 'text' },
      { label: '核心企业内部区域', value: 'area', type: 'text' },
      { label: '运营部对接人', value: 'operatorName', type: 'text' },
      { label: '市场部对接人', value: 'marketName', type: 'text' },
      { label: '资产转让折扣率', value: 'discountRate', type: 'discountRate' },
      // { label: '系统校验结果', value: 'verifyStatus', type: 'text1' },
      { label: '是否已提单', value: 'isSponsor', type: 'text1' },
      {
        label: '交易id', value: 'mainFlowId', type: 'mainFlowId', _inList: {
          sort: true,
          search: true
        },
      },
      { label: '作废状态', value: 'scfStatus', type: 'text1' },
      { label: '收款单位是否注册', value: 'isRegisterSupplier', type: 'isInit' },
      { label: '收款单位注册地址省份', value: 'province', type: 'text' },
      { label: '收款单位注册地址城市', value: 'city', type: 'text' },
      { label: '交易状态', value: 'flowId', type: 'currentStep' },
      { label: '渠道', value: 'financingType', type: 'text' },
      { label: '付确签章状态', value: 'signStatus', type: 'text1' },
      { label: '付款确认书校验结果', value: 'verifyPayConfimStatus', type: 'text1' },
      {
        label: '一线单据编号', value: 'billNumber', type: 'text', _inList: {
          sort: true,
          search: true
        },
      },
      { label: '资金中心受理', value: 'acceptState', type: 'text1', },
      { label: '款项类型名称', value: 'feeTypeName' },
      { label: '校验结果', value: 'verifyStatus', type: 'verifyStatus' },
      { label: '资产服务方名称', value: 'capitalServeName', type: 'text' },
      { label: 'web操作更新时间', value: 'webUpdateTime', type: 'datetime' },
      { label: '银行交单状态', value: 'bankConfirmState', type: 'bankConfirmState' },
      { label: '银行交单时间', value: 'bankConfirmDate', type: 'datetime' },
      { label: '是否已出具付款确认书', value: 'isGiveFile', type: 'isGiveFile' },
      // { label: '转让编号', value: 'transNumber', type: 'text' },
      { label: '一线审核时间', value: 'ccsAduitDatetime', type: 'longdatetime' },
      { label: '一线审批时间', value: 'ccsApproveTime', type: 'longdatetime' },
      { label: '资金中心审核时间', value: 'ccsZauditDate', type: 'longdatetime' },
      { label: '渠道价格', value: 'channelPrice', type: 'channelPrice' },
      { label: '联行号', value: 'payeeBankNumber', type: 'text' },
      { label: '是否并表', value: 'isAndTable', type: 'text1' },
      { label: '付款确认书电子章', value: 'isSignFlag', type: 'vankeSignStatus' }, // 0=未签 1=已签
      { label: '买方确认函电子章', value: 'isSignBuyer', type: 'vankeSignStatus' }, // 0=未签 1=已签
      { label: '付款确认书出具时间', value: 'giveFileTime', type: 'datetime' },
      { label: '确认函获取标识', value: 'signBuyer', type: 'signBuyer' },  // 0=纸质 1=电子
      { label: '买方确认函是否下载', value: 'hasDownBuyer', type: 'verifyPayConfimStatus' },  //  0=未下载 1=已下载
      { label: '付款确认书是否下载', value: 'hasDownConfirm', type: 'verifyPayConfimStatus' },  //  0=未下载 1=已下载
      { label: '修改标识', value: 'isUpdated', type: 'isUpdated' },  //  0=未修改 1=已修改
      { label: '合同名称', value: 'contractName' },
      { label: '合同编号', value: 'contractNumberReal' },
      { label: '授权标识', value: 'isAuth', type: 'isAuth' },  // 0=未授权 1=已授权
      { label: '万科数据对接情况', value: 'vankeCallState', type: 'vankeCallState' },
      { label: '合同文件', value: 'vankeContractFile', type: 'file' },
      { label: '产值文件', value: 'vankeOutputValueFile', type: 'file' },
      { label: '付款申请文件', value: 'vankePaymentFile', type: 'file' },
      { label: '竣工协议文件', value: 'vankeCompleteFile', type: 'file' },
    ] as ListHeadsFieldOutputModel[],
    searches: [
      {
        title: '应收账款受让方', checkerId: 'capitalName', type: 'text', required: false, sortOrder: 7, isShow: true,
      },
      {
        title: '托管行', checkerId: 'bankName', type: 'text', required: false, sortOrder: 3
      },
      { title: '申请付款单位', checkerId: 'applyCompanyName', type: 'text', required: false, sortOrder: 10 },
      { title: '供应商', checkerId: 'contractSupplier', type: 'text', required: false, sortOrder: 10 },
      { title: '收款单位户名', checkerId: 'supplierName', type: 'text', required: false, sortOrder: 5 },
      {
        title: '保理融资到期日', checkerId: 'expiredDate', type: 'quantum1'
      },
      { title: '应收账款金额', checkerId: 'financingAmount', type: 'text', required: false, sortOrder: 9 },
      {
        title: '合同归档号',
        checkerId: 'contractNumber',
        type: 'text',
        required: false,
        sortOrder: 6
      },
      { title: '付款确认书编号', checkerId: 'transNumber', type: 'text', required: false, sortOrder: 1 },
      {
        title: '供应商收款银行', checkerId: 'payeeBankName',
        type: 'text', required: false, sortOrder: 2
      },
      { title: '供应商收款账号', checkerId: 'payeeAccountName', type: 'text', required: false, sortOrder: 4 },
      { title: '项目名称', checkerId: 'curProject', type: 'text', required: false, sortOrder: 4 },
      { title: '融资单唯一标志码', checkerId: 'uuid', type: 'text', required: false, sortOrder: 4 },
      { title: '申请付款单位归属城市', checkerId: 'cityCompany', type: 'text', required: false, sortOrder: 4 },
      { title: '核心企业内部区域', checkerId: 'area', type: 'text', required: false, sortOrder: 4 },
      { title: '运营部对接人', checkerId: 'operatorName', type: 'text', required: false, sortOrder: 4 },
      { title: '市场部对接人', checkerId: 'marketName', type: 'text', required: false, sortOrder: 4 },
      { title: '资金中心付款账号', checkerId: 'payAccount', type: 'text', required: false, sortOrder: 4 },
      { title: '资金中心付款银行', checkerId: 'payBank', type: 'text', required: false, sortOrder: 4 },
      { title: '收款单位注册地址省份', checkerId: 'province', type: 'text', required: false, sortOrder: 4 },
      { title: '收款单位注册地址城市', checkerId: 'city', type: 'text', required: false, sortOrder: 4 },
      {
        title: '资产转让折扣率', checkerId: 'isDiscountRate', type: 'select', options: { ref: 'accountReceipts' },
        required: false, sortOrder: 4
      },

      { title: '交易id', checkerId: 'mainFlowId', type: 'text', required: false, sortOrder: 4 },
      { title: '一线单据编号', checkerId: 'billNumber', type: 'text', required: false, sortOrder: 4 },


      {
        title: '资金中心是否受理', checkerId: 'acceptState',
        options: { ref: 'acceptDockingState' }, type: 'select', required: false, sortOrder: 4
      },

      {
        title: '渠道', checkerId: 'financingType', type: 'linkage-select',
        options: { ref: 'productType_dw' }, required: false, sortOrder: 12
      },

      // { title: '渠道', checkerId: 'financingType', type: 'select', required: false, sortOrder: 4 },

      {
        title: '付确签章状态', checkerId: 'signStatus', type: 'select',
        options: { ref: 'signStatus' }, required: false, sortOrder: 4
      },

      {
        title: '付款确认书校验结果', checkerId: 'verifyPayConfimStatus', type: 'select', options: { ref: 'verifyPayConfimStatus' },
        required: false, sortOrder: 4
      },
      {
        title: '银行交单状态', checkerId: 'bankConfirmState', type: 'select', options: { ref: 'bankConfirmState' },
        required: false, sortOrder: 4
      },
      {
        title: '是否已出具付款确认书', checkerId: 'isGiveFile', type: 'select', options: { ref: 'isGiveFile' }, base: 'number',
        required: false, sortOrder: 4
      },
      { title: '一线审核时间', checkerId: 'ccsAduitDatetime', type: 'quantum2' },
      { title: '一线审批时间', checkerId: 'ccsApproveTime', type: 'quantum2' },
      { title: '资金中心审核时间', checkerId: 'ccsZauditDate', type: 'quantum2' },
      {
        title: '付款确认书电子章', checkerId: 'isSignFlag', type: 'select', options: { ref: 'vankeSignStatus' }, required: false,
      },
      {
        title: '买方确认函电子章', checkerId: 'isSignBuyer', type: 'select', options: { ref: 'vankeSignStatus' }, required: false,
      },
      {
        title: '确认函获取标识', checkerId: 'signBuyer', type: 'select', options: { ref: 'signBuyer' }, required: false,
      },
      {
        title: '买方确认函是否下载', checkerId: 'hasDownBuyer', type: 'select', options: { ref: 'verifyPayConfimStatus' }, required: false,
      },
      {
        title: '付款确认书是否下载', checkerId: 'hasDownConfirm', type: 'select', options: { ref: 'verifyPayConfimStatus' }, required: false,
      },
      {
        title: '修改标识', checkerId: 'isUpdated', type: 'select', options: { ref: 'isUpdated' }, required: false,
      },
      {
        title: '授权标识', checkerId: 'isAuth', type: 'select', options: { ref: 'isAuth' }, required: false,
      },
      {
        title: '合同名称', checkerId: 'contractName', type: 'text', required: false,
      },
      {
        title: '合同编号', checkerId: 'contractNumberReal', type: 'text', required: false,
      },

    ] as CheckersOutputModel[]
  };
  static readonly config = {
    dataDockingList: {
      title: '接口数据列表-万科',
      value: 'dataDockingList',
      tabList: [
        {
          label: '校验通过列表',
          value: 'A',
          subTabList: [
            {
              label: '未上传',
              value: 'DOING',
              canSearch: true,
              canChecked: true,
              edit: {
                leftheadButtons: [
                  {
                    label: '自定义筛选条件',
                    operate: 'custom_search',
                    post_url: '/',
                    disabled: false,
                    showButton: true,
                  },
                  {
                    label: '自定义页面字段',
                    operate: 'custom_field',
                    post_url: '/',
                    disabled: false,
                    showButton: true,
                  },
                ],
                rightheadButtons: [
                  {
                    label: '发起提单',
                    operate: 'vanke_financing_pre',
                    post_url: '/',
                    disabled: false,
                    showButton: true,
                  },
                  {
                    label: '补充信息',
                    operate: 'bacth_info',
                    post_url: '/',
                    disabled: false,
                    showButton: true,
                  },
                  {
                    label: '校验失败',
                    operate: 'vaild_fail',
                    post_url: '/',
                    disabled: false,
                    showButton: true,
                  },
                  {
                    label: '导出万科附件',
                    operate: 'download_vanke_file',
                    post_url: '/sub_system/vanke_system/download_vanke_file',
                    disabled: false,
                    showButton: true,
                  },
                ],
                rowButtons: [
                  {
                    label: '同步万科文件',
                    operate: 'async_vanke_file',
                    post_url: '/sub_system/vanke_system/sync_vanke_file',
                    disabled: false,
                    showButton: true,
                  },
                ]
              },
              searches: [...VankedataDockingConfig.dataLockinglist.searches,
              {
                title: '校验结果', checkerId: 'verifyStatus', type: 'select',
                options: { ref: 'verifySuccessStatus' }, required: false, sortOrder: 4
              },
              ],
              params: 1,
              searchNumber: 8,
              headNumber: 7,
              headText: [...VankedataDockingConfig.dataLockinglist.heads],
            },
          ],
          post_url: '/sub_system/vanke_system/vanke_financing_list'
        },
        {
          label: '校验失败列表',
          value: 'B',
          subTabList: [
            {
              label: '未上传',
              value: 'DOING',
              canSearch: true,
              canChecked: true,
              edit: {
                leftheadButtons: [
                  {
                    label: '自定义筛选条件',
                    operate: 'custom_search',
                    post_url: '/',
                    disabled: false,
                    showButton: true,
                  },
                  {
                    label: '自定义页面字段',
                    operate: 'custom_field',
                    post_url: '/',
                    disabled: false,
                    showButton: true,
                  },
                ],
                rightheadButtons: [
                  {
                    label: '发起预审不通过',
                    operate: 'bacth_pass',
                    post_url: '/',
                    disabled: false,
                    showButton: true,
                  },
                  {
                    label: '校验成功',
                    operate: 'vaild_success',
                    post_url: '/',
                    disabled: false,
                    showButton: true,
                  },
                  {
                    label: '导出万科附件',
                    operate: 'download_vanke_file',
                    post_url: '/sub_system/vanke_system/download_vanke_file',
                    disabled: false,
                    showButton: true,
                  },
                ],
                rowButtons: [
                  {
                    label: '同步万科文件',
                    operate: 'async_vanke_file',
                    post_url: '/sub_system/vanke_system/sync_vanke_file',
                    disabled: false,
                    showButton: true,
                  },
                ]
              },
              searches: [...VankedataDockingConfig.dataLockinglist.searches,
              {
                title: '交易状态', checkerId: 'flowId', type: 'select',
                options: { ref: 'vankeStyle' }, required: false, sortOrder: 4
              },
              {
                title: '校验结果', checkerId: 'verifyStatus', type: 'select',
                options: { ref: 'verifyFailStatus' }, required: false, sortOrder: 4
              },
              ],
              params: 2,
              searchNumber: 10,
              headNumber: 9,
              headText: [...VankedataDockingConfig.dataLockinglist.heads,
              { label: '校验失败类型', value: 'verifyArr', type: 'verifyArr' },

              ],
            },
          ],
          post_url: '/sub_system/vanke_system/vanke_financing_list'
        },
        {
          label: '所有数据列表',
          value: 'C',
          subTabList: [
            {
              label: '未上传',
              value: 'DOING',
              canSearch: true,
              canChecked: true,
              edit: {
                leftheadButtons: [
                  {
                    label: '自定义筛选条件',
                    operate: 'custom_search',
                    post_url: '/',
                    disabled: false,
                    showButton: true,
                  },
                  {
                    label: '自定义页面字段',
                    operate: 'custom_field',
                    post_url: '/',
                    disabled: false,
                    showButton: true,
                  },
                ],
                rightheadButtons: [
                  {
                    label: '导出万科附件',
                    operate: 'download_vanke_file',
                    post_url: '/sub_system/vanke_system/download_vanke_file',
                    disabled: false,
                    showButton: true,
                  },
                ],
                rowButtons: [
                  {
                    label: '同步万科文件',
                    operate: 'async_vanke_file',
                    post_url: '/sub_system/vanke_system/sync_vanke_file',
                    disabled: false,
                    showButton: true,
                  },
                ]
              },
              searches: [...VankedataDockingConfig.dataLockinglist.searches,
              {
                title: '预审状态', checkerId: 'preStateTemporary', type: 'select',
                options: { ref: 'preStateTemporary' }, required: false, sortOrder: 4
              },
              {
                title: '退票类型', checkerId: 'updateType', type: 'select',
                options: { ref: 'updateType' }, required: false, sortOrder: 4
              },
              {
                title: '可放款状态', checkerId: 'payState', type: 'select',
                options: { ref: 'payState' }, required: false, sortOrder: 4
              },
              { title: '可放款批次号', checkerId: 'payBatch', type: 'text', required: false, sortOrder: 4 },
              {
                title: '签章是否下载', checkerId: 'signIsDown', type: 'select',
                options: { ref: 'defaultRadio' }, required: false, sortOrder: 4
              },
              {
                title: '退票状态', checkerId: 'refundState', type: 'select',
                options: { ref: 'refundState' }, required: false, sortOrder: 4
              },
              { title: '作废状态', checkerId: 'scfStatus', type: 'select', options: { ref: 'scfStatus' }, required: false, sortOrder: 4 },

              {
                title: '实际付款状态', checkerId: 'realyPayState', type: 'select',
                options: { ref: 'realyPayState' }, required: false, sortOrder: 4
              },
              { title: '是否已提单', checkerId: 'isSponsor', type: 'select', options: { ref: 'isSponsor' }, required: false, sortOrder: 4 },

              { title: '实际付款批次号', checkerId: 'realyPayBatchTemporary', type: 'text', required: false, sortOrder: 4 },
              {
                title: '校验结果', checkerId: 'verifyStatus', type: 'select',
                options: { ref: 'verifyAllStatus' }, required: false, sortOrder: 4
              },
              ],
              params: 3,
              searchNumber: 6,
              headNumber: 5,
              headText: [...VankedataDockingConfig.dataLockinglist.heads,
              { label: '付确文件信息', value: 'payConfimFile', type: 'file', },
              { label: '预审状态', value: 'preStateTemporary', type: 'text1', },
              { label: '预审时间', value: 'preTime', type: 'date', },
              { label: '退票类型', value: 'updateType', type: 'text1', },
              { label: '预审修改原因', value: 'preNoResult', type: 'text', },
              { label: '可放款状态', value: 'payState', type: 'text1', },
              { label: '可放款批次号', value: 'payBatch', type: 'text', },
              { label: '电子签章时间', value: 'signTime', type: 'date', },
              { label: '签章操作人', value: 'signUser', type: 'text', },
              { label: '签章是否下载', value: 'signIsDown', type: 'defaultRadio', },
              { label: '签章文件下载人', value: 'signDownUser', type: 'text', },
              { label: '签章下载时间', value: 'signDownTime', type: 'date', },
              { label: '退票状态', value: 'refundState', type: 'text1', },
              { label: '签章下载次数', value: 'signDownCount', type: 'text', },
              { label: '退票发起人', value: 'refundUser', type: 'text', },
              { label: '退票原因', value: 'refundResult', type: 'text', },
              { label: '退票时间', value: 'refundTime', type: 'date', },
              { label: '备注', value: 'remark', type: 'text', },
              { label: '校验失败类型', value: 'verifyArr', type: 'verifyArr' },

              { label: '汇率', value: 'localCurExRate', type: 'text', },
              { label: '融资放款日期', value: 'payDate', type: 'date', },
              { label: '保理融资天数', value: 'capitalFinDays', type: 'text', },
              { label: '保理融资利率', value: 'capitalFinRate', type: 'text', },
              { label: '作废时间', value: 'invalidTimes', type: 'date', },
              { label: '实际付款状态', value: 'realyPayState', type: 'text1', },
              { label: '供应商付款的日期', value: 'realyPayDate', type: 'date', },
              { label: '实际付款批次号', value: 'realyPayBatchTemporary', type: 'text', },
              ],
            },
          ],
          post_url: '/sub_system/vanke_system/vanke_financing_list'
        },
      ] as TabListOutputModel[]
    }
  };
  static getConfig(name) {
    return this.config[name];
  }
}
