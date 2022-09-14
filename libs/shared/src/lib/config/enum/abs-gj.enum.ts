/*************************************************************************
 * Copyright (c) 2017 - 2021 深圳市链融科技股份有限公司
 * Shenzhen Lianrong Technology Co., Ltd.
 * All rights reserved.
 *
 * @file：libs\shared\src\lib\config\enum\abs-gj.enum.ts
 * @summary：abs-gj.enum.ts
 * @version: 1.0
 * *************************************************************************
 * revision             author            reason             date
 * 1.0                  DengPei           init               2021-11-22
 ***************************************************************************/

/** 提单状态 */
export enum RecordStatus {
  /** 草稿 */
  Draft    = '0',
  /** 进行中 */
  Progress = '1',
  /** 已完结 */
  Finished = '2',
  /** 已中止 */
  Aborted  = '3',
}

/** 渠道 */
export enum Channel {
  /** ABS */
  ABS         = '1',
  /** 再保理 */
  Refactoring = '2',
  /** 非标 */
  NonStandard = '3',
  /** ABN */
  ABN         = '4',
}

/** （总部）公司枚举，原 select-options.ts 文件中 HeadquartersTypeEnum 枚举，顺序一致，已标出。新增的增加在后面 */
export enum CompanyName {
  /** 万科企业有限公司 1 */
  VK    = '万科企业股份有限公司',

  /** 金地（集团）股份有限公司 2 */
  GD    = '金地（集团）股份有限公司',

  /** 雅居乐地产控股有限公司 3 */
  YJLSk = '雅居乐地产控股有限公司',

  /** 雅居乐集团控股有限公司 4 */
  YJLGp = '雅居乐集团控股有限公司',

  /** 深圳市龙光控股有限公司 5 */
  LGSk  = '深圳市龙光控股有限公司',

  /** 雅居乐(3 and 4) 6 */
  YJL   = '雅居乐',

  /** 龙光工程建设有限公司 7 */
  LGBd  = '龙光工程建设有限公司',

  /** 龙光(5 and 7) 8 */
  LG    = '龙光',

  /** 碧桂园地产集团有限公司 9 */
  BGYGp = '碧桂园地产集团有限公司',

  /** 深圳华侨城股份有限公司 10 */
  HQC   = '深圳华侨城股份有限公司',

  /** 成都轨道交通集团有限公司 */
  CDR   = '成都轨道交通集团有限公司',
}

/** 标签页值配置 */
export enum TabValue {
  /** 第一个标签页 */
  First   = 'A',
  /** 第二个标签页 */
  Second  = 'B',
  /** 第三个标签页 */
  Third   = 'C',
  /** 第四个标签页 */
  Fourth  = 'D',
  /** 第五个标签页 */
  Fifth   = 'E',
  /** 第六个标签页 */
  Sixth   = 'F',
  /** 第七个标签页 */
  Seventh = 'G',
  /** 第八个标签页 */
  Eighth  = 'H',
}

/** 子标签页值配置 */
export enum SubTabValue {
  /** 【DOING】的标签页 */
  DOING   = 'DOING',
  /** 【SPECIAL】的标签页 */
  SPECIAL = 'SPECIAL',
  /** 【DONE】的标签页 */
  DONE    = 'DONE',
  /** 【ALL】的标签页 */
  ALL     = 'ALL',
  /** 【TO DO】的标签页 */
  TODO    = 'TODO',
}

/** 流程名字、Id。CMN代表通用，GJ代表成都轨交，没有代表不确定 */
export enum FlowId {
  /** 发起提单，保理商预录入 */
  GjFinancingPre       = 'cdr_financing_pre',
  /** 供应商上传资料 */
  GjFinancing          = 'cdr_financing',
  /** 平台审核 */
  GjPlatformVerify     = 'cdr_platform_verify',
  /** 保理商风险审核 */
  GjFactoringRisk      = 'cdr_factoring_risk',
  /** 供应商签署合同 */
  GjSupplierSign       = 'cdr_supplier_sign',
  /** 保理商回传合同 */
  GjFactoringPassback  = 'cdr_factoring_passback',
  /** 通用流程·新增一次转让合同组 */
  CMNAddFirstContract  = 'sub_first_contract_add',
  /** 通用流程·修改一次转让合同组 */
  CMNEditFirstContract = 'sub_first_contract_modify',
  /** 通用流程·删除一次转让合同组 */
  CMNDelFirstContract  = 'sub_first_contract_delete',
  /** 通用流程·退单 */
  CMNRetreat           = 'sub_factoring_retreat',
  /** 通用流程·平台审核退单 */
  CMNPlatRetreat       = 'sub_platform_check_retreat',
  /** 通用流程·中止 */
  CMNStop              = 'sub_dragon_book_stop',
  /** 通用流程·修改预录入信息 */
  CMNPreChange         = 'sub_dragon_book_change',
  /** 通用流程·人工匹配付确 */
  CMNPersonMatchQrs    = 'sub_person_match_qrs',
  /** 通用流程·变更账户 */
  CMNChangeAccount     = 'sub_vanke_change',
  /** 通用流程·待审批 */
  CMNWaitVerify        = 'wait_verification_500',
  /** 通用流程·审批中 */
  CMNVerifying         = 'verificating_500',
  /** 通用流程·保理商签署合同 */
  CMNFactoringSign     = 'factoring_sign_500',
  /** 通用流程·待财务审批 */
  CMNWaitFinance       = 'wait_finance_500',
  /** 通用流程·待放款 */
  CMNWaitLoan          = 'wait_loan_500',
  /** 通用流程·已放款 */
  CMNLoaned            = 'loaded_500',
  /** 通用流程·已回款 */
  CMNRepayment         = 'repayment_500',
}

/** 公司 appId */
export enum CompanyAppId {
  /** 深圳市柏霖汇商业保理有限公司 */
  BLH    = 100006,
  /** 深圳市香纳商业保理有限公司 */
  XNBl   = 109335,
  /** 深圳市星顺商业保理有限公司 */
  XSBl   = 110308,
  /** 上海银行 */
  SHBand = 111569,
  /** 广州恒泽商业保理有限公司 */
  HZBl   = 112202,
  /** 深圳市前海中晟商业保理有限公司 */
  QHZsBl = 111174,
}

/** 排序类型 */
export enum SortType {
  /** 升序 */
  ASC  = 'asc',
  /** 降序 */
  DESC = 'desc',
}

/**
 * 由于 common-enum 文件中 xnInvoiceStatus 枚举与 XnInvoiceStatusPipe 管道中状态不一致
 * 不知哪个准备，根据后端配置，新增此发票状态枚举
 */
export enum InvoiceStatus {
  /** 未验证 */
  NoVerify  = 0,
  /** 验证成功 */
  Verified  = 1,
  /** 重复验证 */
  Repeat    = 3,
  /** 已作废 */
  Abolished = 4,
  /** 失控 */
  NoControl = 6,
  /** 红冲 */
  RedPunch  = 7,
  /** 异常 */
  Abnormal  = 8,
  /** 失败 */
  Fail      = 9,
}

/** 流程步骤节点 */
export enum ProgressStep {
  /** 经办 */
  Begin      = '@begin',
  /** 初审 */
  Operate    = 'operate',
  /** 复核 */
  Review     = 'review',
  /** 高管复核 */
  WindReview = 'windReview',
  /** 风险复核 */
  RiskReview = 'riskReview',
  /** 结束 */
  End        = '@end',
}

/** 有无、是否 */
export enum YesOrNo {
  /** 有、是 */
  Yes  = 1,
  /** 无、否 */
  No   = 0,
  /** 同样代表【无、否】，只是参数不一样，部分接口需要 */
  PnNo = 2,
}

/** 页面类型 */
export enum PageTypes {
  /** 新增 */
  Add    = 0,
  /** 详情 */
  Detail = 1,
  /** 编辑 */
  Edit   = 2,
  /** 列表 */
  List   = 3
}

/** 后台定义的流程记录状态 */
export enum NodeNumberForCdr {
  /** 交易未开始 */
  NotDo             = 0,
  /** 保理预录入 */
  FinancingPre      = 5101,
  /** 供应商上传资料  */
  SupplierUpload    = 5102,
  /** 平台审核 */
  PlatformVerify    = 5103,
  /** 保理商风险审核 */
  FactoringRisk     = 5104,
  /** 供应商签署合同 */
  SupplierSign      = 5105,
  /** 保理商回传合同 */
  FactoringPassback = 5106,
  /** 终止 */
  Abort             = 99
}

/** 【新增储架】/【设立项目】的类型 */
export enum ProjectType {
  /** ABS储架项目 */
  ABS   = 1,
  /** 再保理银行项目 */
  Again = 2
}

/** 业务交易状态，目前只有 99，100 有用 */
export enum TradeStatus {
  /** 中止状态 */
  Stop = 99,
  /** 退单状态 */
  Back = 100,
}

/** 业务中止类型，业务交易状态是 【99 中止】 时的类型 */
export enum RetreatType {
  /** 退单 */
  Back = 4,
  /** 中止 */
  Stop = 0,
}

/** 【资产池页面相关功能中】下载范围 */
export enum SelectRange {
  /** 当前条件筛选下所有交易 */
  All    = 1,
  /** 当前勾选的交易 */
  Select = 2,
  /** 仅抽样业务 */
  Sample = 3,
}

/** 【台账页面】【审批放款】下载文件范围设定 */
export enum DownloadRange {
  /** 全部 */
  All      = 'all',
  /** 所选择的 */
  Selected = 'selected'
}

/** 签署方 */
export enum Signer {
  /** 总部公司 */
  Head      = 0,
  /** 收款单位 */
  Unit      = 1,
  /** 项目公司 */
  Project   = 2,
  /** 保理商 */
  Factoring = 3,
}

/** 合同组状态 */
export enum ContractTempStatus {
  /** 未生效 */
  NotActive = 1,
  /** 已生效 */
  Active = 2,
}

/** 冻结状态 */
export enum FreezeStatus {
  /** 已冻结 */
  Frozen = 1,
  /** 未冻结 */
  NotFrozen = 0,
}

/** 【信贷有权人】【财务有权人】审批状态 */
export enum ApprovalStatus {
  /** 同意 */
  Agree = 1,
  /** 否决 */
  Veto = 2,
}

/***
 * 中介机构类型
 */
export enum GjAgencyType {
  /** 保理商 */
  FATORING        = 0,
  /** 计划管理人 */
  PALNMANAGER     = 1,
  /** 会计师事务所 */
  ACCOUNTINGFIRM  = 2,
  /** 联合销售机构 */
  UNIONSALEORG    = 3,
  /** 评级机构 */
  RATEORG         = 4,
  /** 律师事务所 */
  LAWFIRM         = 5,
  /** 主要销售机构 */
  MAINSALEORG     = 6,
  /** 资产服务机构 */
  ASSETSERVICEORG = 7,
  /** 投资者 */
  INVESTOR        = 8,
  /** 托管服务机构 */
  HOSTSERVICEORG  = 9,
  /** 资金服务机构 */
  CASESERVICEORG  = 10,
  /** 再保理银行 */
  REFACTORBANK    = 11,
}

/** 资产池锁定状态 */
export enum LockStatus {
  /** 未锁定 */
  Unlock = 0,
  /** 锁定 */
  Locked = 1,
}
