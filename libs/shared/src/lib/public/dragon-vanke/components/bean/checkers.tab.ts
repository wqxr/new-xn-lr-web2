export default class DragonInfos {
  static contract = {
    // 保后管理主界面页面配置
    heads: [
      { label: '合同扫描件', value: 'contractFile' },
      { label: '合同名称', value: 'contractName' },
      { label: '合同编号', value: 'contractId' },
      { label: '合同金额', value: 'contractMoney' },
    ],
    searches: [],
  };
  static invoice = {
    // 供应商上传资料初审发票
    heads: [
      { label: '发票号码', value: 'invoiceNum' },
      { label: '发票代码', value: 'invoiceCode' },
      { label: '开票日期', value: 'invoiceDate' },
      { label: '不含税金额', value: 'amount', type: 'money' },
      { label: '含税金额', value: 'invoiceAmount', type: 'money' },
      { label: '状态', value: 'status', type: 'status' },
      { label: '图片名称', value: 'fileId', type: 'file' },
    ],
  };
  static platContract = {
    // 供应商上传资料初审发票
    heads: [
      { label: '合同编号', value: 'contractId' },
      { label: '合同名称', value: 'contractName' },
      { label: '合同金额', value: 'contractMoney', type: 'money' },
      { label: '合同类型', value: 'contractType', type: 'contractType' },
      { label: '合同扫描件', value: 'contractFile', type: 'file' },
    ],
  };
  static platInvoice = {
    // 供应商上传资料初审发票
    heads: [
      { label: '图片名称', value: 'fileId', type: 'file' },
      { label: '发票号码', value: 'invoiceNum' },
      { label: '发票代码', value: 'invoiceCode' },
      { label: '开票日期', value: 'invoiceDate' },
      { label: '不含税金额', value: 'amount', type: 'money' },
      { label: '含税金额', value: 'invoiceAmount', type: 'money' },
      { label: '发票转让金额', value: 'transferMoney', type: 'money' },
      { label: '状态', value: 'status', type: 'status' },
      { label: '历史交易Id', value: 'mainFlowId', type: 'mainFlowId' },
    ],
  };
  static shVankePlatInvoice = {
    // 万科-上海银行 平台审核发票列表字段
    heads: [
      { label: '图片名称', value: 'fileId', type: 'file' },
      { label: '发票号码', value: 'invoiceNum' },
      { label: '发票代码', value: 'invoiceCode' },
      { label: '开票日期', value: 'invoiceDate' },
      { label: '不含税金额', value: 'amount', type: 'money' },
      { label: '含税金额', value: 'invoiceAmount', type: 'money' },
      { label: '万科建议转让金额', value: 'vankeTransferMoney', type: 'money' },
      { label: '发票转让金额', value: 'transferMoney', type: 'money' },
      { label: '状态', value: 'status', type: 'status' },
      { label: '历史交易Id', value: 'mainFlowId', type: 'mainFlowId' },
    ],
  };
  static platVankeInvoiceTransfer = {
    // 万科数据对接：供应商上传资料初审发票
    heads: [
      { label: '图片名称', value: 'fileId', type: 'file' },
      { label: '发票号码', value: 'invoiceNum' },
      { label: '发票代码', value: 'invoiceCode' },
      { label: '开票日期', value: 'invoiceDate' },
      { label: '不含税金额', value: 'amount', type: 'money' },
      { label: '含税金额', value: 'invoiceAmount', type: 'money' },
      { label: '万科建议转让金额', value: 'vankeTransferMoney', type: 'money' },
      { label: '发票转让金额', value: 'transferMoney', type: 'money' },
      { label: '状态', value: 'status', type: 'status' },
      { label: '国税局截图', value: 'invoiceScreenshot', type: 'screenshot' },
      { label: '历史交易Id', value: 'mainFlowId', type: 'mainFlowId' },
    ],
  };
  static platVankeInvoice = {
    // 万科数据对接：供应商上传资料初审发票
    heads: [
      { label: '图片名称', value: 'fileId', type: 'file' },
      { label: '发票号码', value: 'invoiceNum' },
      { label: '发票代码', value: 'invoiceCode' },
      { label: '开票日期', value: 'invoiceDate' },
      { label: '不含税金额', value: 'amount', type: 'money' },
      { label: '含税金额', value: 'invoiceAmount', type: 'money' },
      { label: '万科建议转让金额', value: 'vankeTransferMoney', type: 'money' },
      { label: '发票转让金额', value: 'transferMoney', type: 'money' },
      { label: '国税局截图', value: 'invoiceScreenshot', type: 'screenshot' },
      { label: '状态', value: 'status', type: 'status' },
      // { label: '状态', value: 'status', type: 'status' },
      { label: '历史交易Id', value: 'mainFlowId', type: 'mainFlowId' },
    ],
  };
  static batchInfo: TableStyle = {
    heads: [
      { label: '付款确认书编号', value: 'transNumber', type: 'text' },
      { label: '收款单位', value: 'supplierName' },
      { label: '申请付款单位', value: 'applyCompanyName' },
      { label: '应收账款金额', value: 'financingAmount' },
      { label: '渠道', value: 'financingType', type: 'financingType' },
      { label: '资产转让折扣率', value: 'discountRate' },
    ] as HeadsStyle[],
    canChecked: false,
    rowButtons: [] as HeadsStyle[],
  };
  static preTradeInfo: TableStyle = {
    heads: [
      { label: '一线单据编号', value: 'billNumber' },
      { label: '收款单位', value: 'supplierName' },
      { label: '申请付款单位', value: 'applyCompanyName' },
      { label: '应收账款金额', value: 'financingAmount' },
      { label: '渠道', value: 'financingType', type: 'financingType' },
      { label: '资产转让折扣率', value: 'discountRate' },
    ] as HeadsStyle[],
    canChecked: false,
    rowButtons: [] as HeadsStyle[],
  };
  static editPreTradeInfo: TableStyle = {
    heads: [
      { label: '一线单据编号', value: 'billNumber', type: 'text' },
      { label: '收款单位', value: 'debtUnit' },
      { label: '申请付款单位', value: 'projectCompany' },
      { label: '应收账款金额', value: 'receive' },
      { label: '渠道', value: 'financingType', type: 'financingType' },
      { label: '资产转让折扣率', value: 'discountRate' },
    ] as HeadsStyle[],
    canChecked: false,
    rowButtons: [] as HeadsStyle[],
  };
  static rejectBatchInfo: TableStyle = {
    // 万科数据对接-发起退单-所选交易
    heads: [
      { label: '交易ID', value: 'mainFlowId', type: 'text' },
      { label: '付款确认书编号', value: 'transNumber', type: 'text' },
      { label: '收款单位', value: 'supplierName' },
      { label: '申请付款单位', value: 'applyCompanyName' },
      { label: '应收账款金额', value: 'financingAmount' },
      { label: '资产转让折扣率', value: 'discountRate' },
      { label: '交易状态', value: 'tradeStatus' },
    ] as HeadsStyle[],
    canChecked: false,
    rowButtons: [] as HeadsStyle[],
  };
  static rejectListBgy: TableStyle = {
    // 碧桂园数据对接-发起审核失败-所选交易
    heads: [
      { label: '碧桂园系统唯一标识码', value: 'bgyPaymentUuid', type: 'text' },
      { label: '付款单号', value: 'bgyPaymentNo', type: 'text' },
      { label: '供应商名称', value: 'bgySupplier', type: 'text' },
      { label: '收款单位', value: 'bgySupplierAccountName' },
      { label: '申请付款单位', value: 'bgyItemName' },
      { label: '合同名称', value: 'bgyContractName' },
      { label: '合同编号', value: 'bgyContractNo' },
      { label: '融资金额', value: 'bgyPayAmount', type: 'money' },
      { label: '供应商开户行', value: 'bgySupplierBank' },
      { label: '供应商账号', value: 'bgySupplierAccount' },
      { label: '融资类型', value: 'reserve8' },
    ] as HeadsStyle[],
    canChecked: false,
    rowButtons: [] as HeadsStyle[],
  };
  static loanReceipt: TableStyle = {
    // 审批放款付款回单字段
    heads: [
      { label: '交易ID', value: 'mainFlowId', type: 'text' },
      { label: '付款确认书编号', value: 'payConfirmId', type: 'text' },
      { label: '收款单位', value: 'debtUnit', type: 'text' },
      { label: '转让价款', value: 'changePrice' },
      { label: '应收账款金额', value: 'receivable' },
      { label: '保理融资到期日', value: 'factoringEndDate', type: 'date' },
      { label: '放款回单', value: 'jdBackFile', type: 'file' },
    ] as HeadsStyle[],
    canChecked: false,
    rowButtons: [] as HeadsStyle[],
  };
  static rejectList = DragonInfos.batchInfo;
  static rejectVankeList = DragonInfos.rejectBatchInfo;
  // tslint:disable-next-line: no-trailing-whitespace
}
export interface TableStyle {
  heads: HeadsStyle[];
  canChecked: boolean;
  rowButtons: HeadsStyle[];
}
export interface HeadsStyle {
  label: string;
  value: string;
  type: string;
}
