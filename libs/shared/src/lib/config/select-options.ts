import { isNullOrUndefined } from 'util';
import { XnService } from '../services/xn.service';
import { EnterpriseTypeOutputModel, SelectItemsModel } from './checkers';
import {
  AccountActiveStatus,
  AcctBank,
  AppApplyType,
  CheckStatus,
  ComDibilityLimit,
  CustType,
  EarningOwnerType,
  Industry,
  OpenAccountStatus,
  ShareholderCarsTypes,
  ShareholderTypes,
  ShPuhuiCheckTypes,
  AccountActiveStatusClassName,
} from './options';
import { OrgType } from './enum';

const newAgile = {
  label: '雅居乐-星顺模式',
  value: 'financing18',
  checked: false,
};

const companyTypes = {
  data: [
    {
      label: '项目公司',
      value: 'financing18_3',
      checked: false,
    },
    {
      label: '集团公司',
      value: 'financing18_1',
      checked: false,
    },
  ],
};

/**
 *  总部公司类型枚举
 */
export enum HeadquartersTypeEnum {
  '万科企业股份有限公司' = 1 /** 万科企业有限公司 */,
  '金地（集团）股份有限公司' = 2 /** 金地（集团）股份有限公司 */,
  '雅居乐地产控股有限公司' = 3 /** 雅居乐地产控股有限公司 */,
  '雅居乐集团控股有限公司' = 4 /** 雅居乐集团控股有限公司 */,
  '深圳市龙光控股有限公司' = 5 /** 深圳市龙光控股有限公司 */,
  '雅居乐' = 6 /** 雅居乐(3 and 4) */,
  '龙光工程建设有限公司' = 7 /** 龙光工程建设有限公司 */,
  '龙光' = 8 /** 龙光(5 and 7) */,
  '碧桂园地产集团有限公司' = 9 /** 碧桂园地产集团有限公司 */,
  '深圳华侨城股份有限公司' = 10,
}
/**
 * 审核人
 */
export enum Auditor {
  /** 管理员 */
  Admin = 'admin',
  /** 经办人 */
  Operator = 'operator',
  /** 复核人 */
  Reviewer = 'reviewer',
  /** 系统 */
  System = 'system',
  /** 客户经理经办人 */
  CustomerOperator = 'customerOperator',
  /** 客户经理复核人 */
  CustomerReviewer = 'customerReviewer',
  /** 风险审查经办人 */
  RiskOperator = 'riskOperator',
  /** 风险审查复核人 */
  RiskReviewer = 'riskReviewer',
  /** 财务经办人 */
  FinanceOperator = 'financeOperator',
  /** 财务复核人 */
  FinanceReviewer = 'financeReviewer',
  /** 高管经办人 */
  WindOperator = 'windOperator',
  /** 高管复核人 */
  WindReviewer = 'windReviewer',
  /** 查看权限 */
  CheckerLimit = 'checkerLimit',
  /** 查看权限 */
  Hotline = 'hotline',
  /** 查看权限 */
  Portal = 'portal',
  /** 查看权限 */
  Loaned = 'loaned',
  /** 审核任务管理员 */
  SPLIT_REVIEWER = 'split_reviewer',
}
export class stepList {
  flowId: string;
  procedureId: string;
  stepId: string; // 分布模块ID
  name: string; // 分布模块描述
  operateType: string; // 分布模块操作类型 0=无 1=可操作"通过"和"不通过"
  required: string; // 分布模块是否必填
  sortOrder: string; // 分布模块顺序
  result_status: number; // 审核状态  0=无需审核 1=审核通过 2=审核不通过（showNew不用管）
  review_time: number; // 审核时间
  step_memo: string; // 审核描述
  reviewer: string; // 审核人
  checkerIdList: any;
  className: string;
}

export interface Option {
  label: string;
  value: string | number | number[] | string[] | boolean;
  checked?: boolean | number;
  children?: Option[];
}
export const AuditorOptions: Option[] = [
  { label: '管理员', value: Auditor.Admin },
  { label: '经办人', value: Auditor.Operator },
  { label: '复核人', value: Auditor.Reviewer },
  { label: '系统', value: Auditor.System },
  { label: '客户经理经办人', value: Auditor.CustomerOperator },
  { label: '客户经理复核人', value: Auditor.CustomerReviewer },
  { label: '风险审查经办人', value: Auditor.RiskOperator },
  { label: '风险审查复核人', value: Auditor.RiskReviewer },
  { label: '财务经办人', value: Auditor.FinanceOperator },
  { label: '财务复核人', value: Auditor.FinanceReviewer },
  { label: '高管经办人', value: Auditor.WindOperator },
  { label: '高管复核人', value: Auditor.WindReviewer },
  { label: '查看权限', value: Auditor.CheckerLimit },
  { label: '客服岗', value: Auditor.Hotline },
  { label: '门户管理岗', value: Auditor.Portal },
  { label: '贷后管理岗', value: Auditor.Loaned },
  { label: '审核任务管理员', value: Auditor.SPLIT_REVIEWER },
];

/**
 * 自定义页面字段和自定义筛选条件传值范围定义
 *
 * url: /dragon/trade/get_column
 *      /dragon/trade/set_column
 * searchNumber  自定义搜索
 * headNumber    自定义表头
 *
 * hucongying    1-50      searchNumber: 16, headNumber: 15,
 * yutianbao     51-100
 * wangqing      101-150
 */

/**
 * 台账自定义筛选条件status传值范围定义
 * 前端维护配置 用于向后台获取自定义筛选条件字段
 * 如果有新的产品，在此配置数值递增即可
 * url: /dragon/trade/get_column
 */
export enum CustomSearchNumber {
  /** 万科 */
  VANKE = 200,
  /** 华侨城 */
  OCT = 201,
  /** 上海银行 */
  BANK_SHANGHAI = 202,
  /** 龙光 */
  LOGAN = 203,
  /** 香纳龙光 */
  XN_LOGAN = 204,
  /** 龙光博时资本 */
  BS_LOGAN = 205,
  /** 金地 */
  GEMDALE = 206,
  /** 香纳金地 */
  XN_GEMDALE = 207,
  /** 中晟金地 */
  ZS_GEMDALE = 208,
  /** 雅居乐恒泽 */
  AGILE_HZ = 209,
  /** 雅居乐星顺 */
  AGILE_XINGSHUN = 210,
  /** 碧桂园 */
  COUNTRY_GRADEN = 211,
  /** 香纳万科 */
  XN_VANKE = 212,
  /** 分单 */
  CHECK_TASK = 213,
}

/**
 * 盖章方式枚举
 */

export enum SignTypeEnum {
  cfcaSignType = 1, // 深圳cfca的签署方式
  caSignType = 2, // 深圳ca的签署方式
  bjcaSignType = 3, // 北京ca的签署方式
}
export enum cfcaStatusEnum {
  '未开户' = 0,
  '成功 ' = 1,
  '失败 ' = 2,
  '填写签署人' = 3,
  '填写对公信息' = 4,
  '打款验证' = 5,
  '开户中' = 6,
  '修改中' = 7,
  '注销中' = 8,
  '注销成功' = 9,
  '上传资料' = 10,
}
export enum applyFactoringTtype {
  '深圳市柏霖汇商业保理有限公司' = 100006,
  '深圳市香纳商业保理有限公司' = 109335,
  '深圳市星顺商业保理有限公司' = 110308,
  '上海银行' = 111569,
  '广州恒泽商业保理有限公司' = 112202,
  '深圳市前海中晟商业保理有限公司' = 111174,
}
/** 上海银行业务交易状态 tradeStatus 20211111修改命名或优化*/
export enum EnumShBankTradeStatus {
  /** 待供应商上传资料 */
  supplier_upload = 1,
  /** 待平台审核 */
  platform_verify = 2,
  /** 待上海银行复核 */
  bank_verify = 3,
  /** 上海银行复核完成 */
  bank_finish = 4,
  /** 中止状态 */
  stop = 99,
  /** 退单 任意状态 */
  chargeback = 100,
  /** 暂停 仅平台审核的时候有效 platform_verify--> */
  suspend = 101,
}
/** 上海银行扩展状态,对tradeStatus的补充  对应的字段 statusEx */
export enum EnumShBankExtStatus {
  /** 初始无状态 */
  none = 0,

  /** 付款确认书编号重复 */
  pay_confirm_id_error = 999,

  /** 业务待受理(万科接口) */
  accept_state = 1000,
  /** 业务已受理 */
  accept_state_success = 1001,
  /** 业务受理失败 */
  accept_state_fail = 1002,
  /** 业务待受理超时 */
  accept_state_timeout = 1003,

  /** 确认可放款 （万科接口） */
  confirm_can_loann = 1004,
  /** 确认可放款（成功） */
  confirm_can_loann_success = 1005,
  /** 确认可放款（失败） */
  confirm_can_loann_fail = 1006,

  /** 银行确认可放款 （万科接口） */
  bank_confirm_can_loann = 1007,
  /** 银行确认可放款（成功） */
  bank_confirm_can_loann_success = 1008,
  /** 银行确认可放款（失败） */
  bank_confirm_can_loann_fail = 1009,

  /** 发起融资申请 bank_finish */
  financing_apply = 1010,
  /** 发起融资申请成功 bank_finish */
  financing_apply_success = 1011,
  /** 发起融资申请失败 bank_finish */
  financing_apply_fail = 1012,
  /** 发起融资申请超时 bank_finish */
  financing_apply_timeout = 1013,

  /** 业务资料文件推送通知 bank_finish */
  business_file_push_notice = 1040,
  /** 业务资料文件推送通知成功 bank_finish */
  business_file_push_notice_success = 1041,
  /** 业务资料文件推送通知失败 bank_finish */
  business_file_push_notice_fail = 1042,
  /** 业务资料文件推送通知超时 bank_finish */
  business_file_push_notice_timeout = 1043,

  /** 融资申请状态查询 bank_finish */
  financing_apply_status_query = 1020,
  /** 融资申请状态查询成功 bank_finish */
  financing_apply_status_success = 1021,
  /** 融资申请状态查询失败 bank_finish */
  financing_apply_status_fail = 1022,
  /** 融资申请状态查询超时 bank_finish */
  financing_apply_status_timeout = 1023,

  /** 生成融资协议合同 bank_finish */
  generate_financing_contract = 1060,
  /** 生成融资协议合同成功 bank_finish */
  generate_financing_contract_success = 1061,
  /** 生成融资协议合同失败 bank_finish */
  generate_financing_contract_fail = 1062,
  /** 生成融资协议合同超时 bank_finish */
  generate_financing_contract_timeout = 1063,

  /** 获取授信协议编号 */
  get_agreement_no = 1065,
  /** 获取授信协议编号 成功 */
  get_agreement_no_success = 1066,
  /** 获取授信协议编号 失败 */
  get_agreement_no_fail = 1067,
  /** 获取授信协议编号 超时 */
  get_agreement_no_timeout = 1068,

  /** 供应商在普惠签署融资协议合同 bank_finish */
  sign_financing_contract = 1070,
  /** 供应商在普惠签署融资协议合同成功 bank_finish */
  sign_financing_contract_success = 1071,
  /** 供应商在普惠签署融资协议合同失败 bank_finish */
  sign_financing_contract_fail = 1072,
  /** 供应商在普惠签署融资协议合同超时 bank_finish */
  sign_financing_contract_timeout = 1073,

  /** 待补充信息 bank_finish */
  input_contract_info = 1075,

  /** 供应商在平台签署服务协议 bank_finish */
  sign_service_agreement = 1080,
  /** 供应商在平台签署服务协议 签署完成 */
  sign_service_agreement_finish = 1083,
  /** 平台签署服务协议 待签署 bank_finish */
  platform_sign_service_agreement = 1085,

  /** 代扣协议文件推送通知 bank_finish */
  service_agreemen_push_notice = 1090,
  /** 代扣协议文件推送通知成功 bank_finish */
  service_agreemen_push_notice_success = 1091,
  /** 代扣协议文件推送通知失败 bank_finish */
  service_agreemen_push_notice_fail = 1092,
  /** 代扣协议文件推送通知超时 bank_finish */
  service_agreemen_push_notice_timeout = 1093,

  /** 应收账款导入 bank_finish */
  receive_import = 1030,
  /** 应收账款导入成功 bank_finish */
  receive_import_success = 1031,
  /** 应收账款导入失败 bank_finish */
  receive_import_fail = 1032,
  /** 应收账款导入超时 bank_finish */
  receive_import_timeout = 1033,
  /** 发票核验查询 bank_finish */
  invoice_query = 1035,
  /** 发票核验查询成功 bank_finish */
  invoice_query_success = 1036,
  /** 发票核验查询失败 bank_finish */
  invoice_query_fail = 1037,
  /** 发票核验查询超时 bank_finish */
  invoice_query_timeout = 1038,

  /** 应收账款转让状态查询 bank_finish */
  receivable_transfer = 1050,
  /** 应收账款转让成功 bank_finish */
  receivable_transfer_success = 1051,
  /** 应收账款转让失败 bank_finish */
  receivable_transfer_fail = 1052,
  /** 应收账款转让超时 bank_finish */
  receivable_transfer_timeout = 1053,

  /** 发起放款申请 bank_finish */
  loan_apply = 1100,
  /** 发起放款申请成功 bank_finish */
  loan_apply_success = 1101,
  /** 发起放款申请失败 bank_finish */
  loan_apply_fail = 1102,
  /** 发起放款申请超时 bank_finish */
  loan_apply_timeout = 1103,

  /** 放款申请状态 bank_finish */
  loan_apply_result_query = 1110,
  /** 放款申请状态--成功 bank_finish */
  loan_apply_result_success = 1111,
  /** 放款申请状态--失败 bank_finish */
  loan_apply_result_fail = 1112,
  /** 放款申请状态--超时 bank_finish */
  loan_apply_result_timeout = 1113,

  /** 代扣申请 bank_finish */
  withhold_apply = 1120,
  /** 代扣申请成功 bank_finish */
  withhold_apply_success = 1121,
  /** 代扣申请失败 bank_finish */
  withhold_apply_fail = 1122,
  /** 代扣申请超时 bank_finish */
  withhold_apply_timeout = 1123,

  /** 待提现 bank_finish */
  withdrawal = 1130,

  /** 已提现 bank_finish */
  withdrawaled = 1140,
}
/** 扩展状态对应主状态 */
export const extStatusToStatus = {
  /** 初始无状态 */
  none: 0,

  /** 付款确认书编号重复 */
  pay_confirm_id_error: 4,

  /** 业务待受理(万科接口) */
  accept_state: 4,
  /** 业务已受理 */
  accept_state_success: 4,
  /** 业务受理失败 */
  accept_state_fail: 4,
  /** 业务待受理超时 */
  accept_state_timeout: 4,

  /** 确认可放款 （万科接口） */
  confirm_can_loann: 4,
  /** 确认可放款（成功） */
  confirm_can_loann_success: 4,
  /** 确认可放款（失败） */
  confirm_can_loann_fail: 4,

  /** 银行确认可放款 （万科接口） */
  bank_confirm_can_loann: 4,
  /** 银行确认可放款（成功） */
  bank_confirm_can_loann_success: 4,
  /** 银行确认可放款（失败） */
  bank_confirm_can_loann_fail: 4,

  /** 发起融资申请 bank_finish */
  financing_apply: 4,
  /** 发起融资申请成功 bank_finish */
  financing_apply_success: 4,
  /** 发起融资申请失败 bank_finish */
  financing_apply_fail: 4,
  /** 发起融资申请超时 bank_finish */
  financing_apply_timeout: 4,

  /** 融资申请状态查询 bank_finish */
  financing_apply_status_query: 4,
  /** 融资申请状态查询成功 bank_finish */
  financing_apply_status_success: 4,
  /** 融资申请状态查询失败 bank_finish */
  financing_apply_status_fail: 4,
  /** 融资申请状态查询超时 bank_finish */
  financing_apply_status_timeout: 4,

  /** 应收账款导入 bank_finish */
  receive_import: 4,
  /** 应收账款导入成功 bank_finish */
  receive_import_success: 4,
  /** 应收账款导入失败 bank_finish */
  receive_import_fail: 4,
  /** 应收账款导入超时 bank_finish */
  receive_import_timeout: 4,
  /** 发票核验查询 bank_finish */
  invoice_query: 4,
  /** 发票核验查询成功 bank_finish */
  invoice_query_success: 4,
  /** 发票核验查询失败 bank_finish */
  invoice_query_fail: 4,
  /** 发票核验查询超时 bank_finish */
  invoice_query_timeout: 4,

  /** 业务资料文件推送通知 bank_finish */
  business_file_push_notice: 4,
  /** 业务资料文件推送通知成功 bank_finish */
  business_file_push_notice_success: 4,
  /** 业务资料文件推送通知失败 bank_finish */
  business_file_push_notice_fail: 4,
  /** 业务资料文件推送通知超时 bank_finish */
  business_file_push_notice_timeout: 4,

  /** 应收账款转让状态查询 bank_finish */
  receivable_transfer: 4,
  /** 应收账款转让成功 bank_finish */
  receivable_transfer_success: 4,
  /** 应收账款转让失败 bank_finish */
  receivable_transfer_fail: 4,
  /** 应收账款转让超时 bank_finish */
  receivable_transfer_timeout: 4,

  /** 生成融资协议合同 bank_finish */
  generate_financing_contract: 4,
  /** 生成融资协议合同成功 bank_finish */
  generate_financing_contract_success: 4,
  /** 生成融资协议合同失败 bank_finish */
  generate_financing_contract_fail: 4,
  /** 生成融资协议合同超时 bank_finish */
  generate_financing_contract_timeout: 4,

  /** 获取授信协议编号 */
  get_agreement_no: 4,
  /** 获取授信协议编号 成功 */
  get_agreement_no_success: 4,
  /** 获取授信协议编号 失败 */
  get_agreement_no_fail: 4,
  /** 获取授信协议编号 超时 */
  get_agreement_no_timeout: 4,

  /** 供应商在普惠签署融资协议合同 bank_finish */
  sign_financing_contract: 4,
  /** 供应商在普惠签署融资协议合同成功 bank_finish */
  sign_financing_contract_success: 4,
  /** 供应商在普惠签署融资协议合同失败 bank_finish */
  sign_financing_contract_fail: 4,
  /** 供应商在普惠签署融资协议合同超时 bank_finish */
  sign_financing_contract_timeout: 4,

  /** 待补充信息 bank_finish */
  input_contract_info: 4,

  /** 供应商在平台签署服务协议 bank_finish */
  sign_service_agreement: 4,
  /** 供应商在平台签署服务协议 签署完成 */
  sign_service_agreement_finish: 4,

  /** 平台签署服务协议 待签署 bank_finish */
  platform_sign_service_agreement: 4,

  /** 代扣协议文件推送通知 bank_finish */
  service_agreemen_push_notice: 4,
  /** 代扣协议文件推送通知成功 bank_finish */
  service_agreemen_push_notice_success: 4,
  /** 代扣协议文件推送通知失败 bank_finish */
  service_agreemen_push_notice_fail: 4,
  /** 代扣协议文件推送通知超时 bank_finish */
  service_agreemen_push_notice_timeout: 4,

  /** 发起放款申请 bank_finish */
  loan_apply: 4,
  /** 发起放款申请成功 bank_finish */
  loan_apply_success: 4,
  /** 发起放款申请失败 bank_finish */
  loan_apply_fail: 4,
  /** 发起放款申请超时 bank_finish */
  loan_apply_timeout: 4,

  /** 放款申请状态 bank_finish */
  loan_apply_result_query: 4,
  /** 放款申请状态--成功 bank_finish */
  loan_apply_result_success: 4,
  /** 放款申请状态--失败 bank_finish */
  loan_apply_result_fail: 4,
  /** 放款申请状态--超时 bank_finish */
  loan_apply_result_timeout: 4,

  /** 代扣申请 bank_finish */
  withhold_apply: 4,
  /** 代扣申请成功 bank_finish */
  withhold_apply_success: 4,
  /** 代扣申请失败 bank_finish */
  withhold_apply_fail: 4,
  /** 代扣申请超时 bank_finish */
  withhold_apply_timeout: 4,

  /** 待提现 bank_finish */
  withdrawal: 4,

  /** 已提现 bank_finish */
  withdrawaled: 4,

  /** 退单 任意状态 */
  chargeback: 100,
  /** 暂停 仅平台审核的时候有效 platform_verify--> */
  suspend: 2,
};

/** 上银接口状态--异常状态 */
export const ShInterFaceErrStatus = [
  EnumShBankExtStatus.financing_apply_fail,
  EnumShBankExtStatus.financing_apply_timeout,
  EnumShBankExtStatus.financing_apply_status_fail,
  EnumShBankExtStatus.financing_apply_status_timeout,
  EnumShBankExtStatus.receive_import_fail,
  EnumShBankExtStatus.receive_import_timeout,
  EnumShBankExtStatus.invoice_query_fail,
  EnumShBankExtStatus.invoice_query_timeout,
  EnumShBankExtStatus.business_file_push_notice_fail,
  EnumShBankExtStatus.business_file_push_notice_timeout,
  EnumShBankExtStatus.receivable_transfer_fail,
  EnumShBankExtStatus.receivable_transfer_timeout,
  EnumShBankExtStatus.generate_financing_contract_fail,
  EnumShBankExtStatus.generate_financing_contract_timeout,
  EnumShBankExtStatus.sign_financing_contract_fail,
  EnumShBankExtStatus.sign_financing_contract_timeout,
  EnumShBankExtStatus.service_agreemen_push_notice_fail,
  EnumShBankExtStatus.service_agreemen_push_notice_timeout,
  EnumShBankExtStatus.loan_apply_fail,
  EnumShBankExtStatus.loan_apply_timeout,
  EnumShBankExtStatus.loan_apply_result_fail,
  EnumShBankExtStatus.loan_apply_result_timeout,
  EnumShBankExtStatus.withhold_apply_fail,
  EnumShBankExtStatus.withhold_apply_timeout,
  EnumShBankExtStatus.get_agreement_no_fail,
  EnumShBankExtStatus.get_agreement_no_timeout,
  /** 付款确认书编号重复 */
  EnumShBankExtStatus.pay_confirm_id_error,
  /** 业务受理失败 */
  EnumShBankExtStatus.accept_state_fail,
  /** 业务待受理超时 */
  EnumShBankExtStatus.accept_state_timeout,
  /** 确认可放款（失败） */
  EnumShBankExtStatus.confirm_can_loann_fail,
  /** 银行确认可放款（失败） */
  EnumShBankExtStatus.bank_confirm_can_loann_fail,
];
export const VankeExtStatus = [
  /** 业务待受理(万科接口) */
  EnumShBankExtStatus.accept_state,
  /** 业务已受理 */
  EnumShBankExtStatus.accept_state_success,
  /** 确认可放款 （万科接口） */
  EnumShBankExtStatus.confirm_can_loann,
  /** 确认可放款（成功） */
  EnumShBankExtStatus.confirm_can_loann_success,
  /** 银行确认可放款 （万科接口） */
  EnumShBankExtStatus.bank_confirm_can_loann,
  /** 银行确认可放款（成功） */
  EnumShBankExtStatus.bank_confirm_can_loann_success,
];
/** 上银接口状态--正常步骤状态 */
export const ShInterFaceStepStatus = [
  // 步骤对应statusEx状态
  EnumShBankExtStatus.financing_apply, // 融资申请
  EnumShBankExtStatus.financing_apply_status_query, // 融资申请查询
  EnumShBankExtStatus.receive_import, // 应收账款导入
  EnumShBankExtStatus.business_file_push_notice, // 准入资料 ， 业务资料 文件推送通知
  EnumShBankExtStatus.receivable_transfer, // 应收账款转让状态查询
  EnumShBankExtStatus.generate_financing_contract, // 融资申请查询 生成融资协议合同 (查询合同是否生成，（返回生成合同编号）)
  EnumShBankExtStatus.sign_financing_contract, // 查询供应商在普惠签署融资协议合同状态
  EnumShBankExtStatus.input_contract_info, // 待补充信息
  EnumShBankExtStatus.service_agreemen_push_notice, // 代扣协议文件推送通知
  EnumShBankExtStatus.loan_apply, // 放款申请
  EnumShBankExtStatus.loan_apply_result_query, // 放款申请状态查询
  EnumShBankExtStatus.withhold_apply, // 费用代扣
  /** 获取授信协议编号 */
  EnumShBankExtStatus.get_agreement_no,
  /** 业务待受理(万科接口) */
  EnumShBankExtStatus.accept_state,
  /** 业务已受理 */
  EnumShBankExtStatus.accept_state_success,
  /** 确认可放款 （万科接口） */
  EnumShBankExtStatus.confirm_can_loann,
  /** 确认可放款（成功） */
  EnumShBankExtStatus.confirm_can_loann_success,
  /** 银行确认可放款 （万科接口） */
  EnumShBankExtStatus.bank_confirm_can_loann,
  /** 银行确认可放款（成功） */
  EnumShBankExtStatus.bank_confirm_can_loann_success,
  EnumShBankExtStatus.invoice_query,
];

/**
 * 前端全局的select options
 */
export class SelectOptions {
  public constructor(private xn: XnService) {
    //
  }

  private static configs = {
    defaultRadio: [
      { label: '是', value: 1 },
      { label: '否', value: 0 },
    ] as SelectItemsModel[],
    isBackFile: [
      { label: '是', value: 1 },
      { label: '否', value: 2 },
      { label: '无', value: 0 },
    ] as SelectItemsModel[],

    defaultCheckbox: [{ label: '是', value: 1 }] as SelectItemsModel[],

    orgType: [
      { label: '供应商', value: OrgType.Supplier.toString() },
      { label: '核心企业', value: OrgType.Enterprise.toString() },
      { label: '保理商', value: OrgType.Factoring.toString() },
      { label: '下游采购商', value: OrgType.Buyer.toString() },
      { label: '金融机构', value: OrgType.Bank.toString() },
      { label: '平台', value: OrgType.Platform.toString() },
    ] as SelectItemsModel[],

    caType: [
      { label: '未知', value: '0' },
      { label: 'CFCA', value: '1' },
      { label: 'SZCA', value: '2' },
      { label: 'BJCA', value: '3' },
      { label: '沃通CA', value: '5' },
    ] as SelectItemsModel[],
    caExpressCompany: [
      { label: '顺丰快递', value: '顺丰快递' },
      { label: '中国邮政', value: '中国邮政' },
      { label: '其他快递', value: '其他快递' },
    ] as SelectItemsModel[],
    caTypeStatus: [
      { label: '有效', value: 1 },
      { label: '有效-修改中', value: 7 },
      { label: '有效-注销中', value: 8 },
      { label: '已注销', value: 9 },
    ] as SelectItemsModel[],
    cfcaOperate: [
      { label: '全部', value: '' },
      { label: '初审', value: 1 },
      { label: '复核', value: 2 },
      { label: '修改资料', value: 3 },
      { label: '终止', value: 4 },
      { label: '完成', value: 5 },
    ] as SelectItemsModel[],
    cfcaOperateType: [
      { label: '全部', value: '' },
      { label: '存量用户开户', value: '2' },
      { label: '变更数字证书管理人', value: '3' },
      { label: '注册开户', value: '1' },
    ] as SelectItemsModel[],
    // 通用签章
    cfcasignStatus: [
      { label: '待修改', value: '0' },
      { label: '待复核', value: '1' },
      { label: '待签署', value: '2' },
      { label: '待归档', value: '3' },
      { label: '已完成', value: '4' },
      { label: '已作废', value: '5' },
    ] as SelectItemsModel[],
    // 资质证明录入状态
    certifyFileStatus: [
      { label: '初审', value: 1 },
      { label: '复核', value: 2 },
      { label: '已完成', value: 3 },
      { label: '已中止', value: 4 },
    ] as SelectItemsModel[],
    cfcaSignTypes: [
      { label: '全部', value: '' },
      { label: '线上电子章', value: '0' },
      { label: '线下鲜章', value: '1' },
    ] as SelectItemsModel[],
    casignType: [
      { label: '线上电子章', value: '0' },
      { label: '线下鲜章', value: '1' },
    ] as SelectItemsModel[],
    applyFactoring: [
      { label: '深圳市柏霖汇商业保理有限公司', value: 100006 },
      { label: '深圳市香纳商业保理有限公司', value: 109335 },
    ] as SelectItemsModel[],
    industryClassify: [
      // { label: '金融机构', value: '1' },
      { label: '企业', value: '2' },
      { label: '机关事业单位', value: '3' },
      // { label: '个人', value: '4' },
      // { label: '个体工商户', value: '5' },
      // { label: '其他', value: '6' }
    ] as SelectItemsModel[],

    cancelCause: [
      { label: '主债权消灭', value: '01' },
      { label: '担保权实现', value: '02' },
      { label: '权利人放弃登记载明的担保权', value: '03' },
      { label: '其他导致所登记权利消灭的情形', value: '04' },
    ] as SelectItemsModel[],

    pattern: [
      // 模式配置，前端配置
      { label: '供应商', value: '1' },
      { label: '核心企业(项目公司)', value: '201' },
      { label: '核心企业(集团公司)', value: '202' },
      { label: '保理商', value: '3' },
      { label: '银行', value: '4' },
      { label: '中介机构', value: '102' },
      { label: '服务机构', value: '6' },
      // { label: '核心企业', value: '2' },
      // { label: '金融机构', value: '4' },
      // { label: '下游采购商', value: '5' },
      // { label: '平台', value: '99' }
    ] as EnterpriseTypeOutputModel[],

    applyFactoringOptions: [
      { label: '深圳市柏霖汇商业保理有限公司', value: 100006 },
      { label: '深圳市香纳商业保理有限公司', value: 109335 },
      { label: '深圳市星顺商业保理有限公司', value: 110308 },
      { label: '深圳市前海中晟商业保理有限公司', value: 111174 },
      { label: '深圳汉辰商业保理有限公司', value: 111571 },
      { label: '上海银行', value: 111569 },
    ] as SelectItemsModel[],

    patternWithAgency: [
      // 模式配置，前端配置，含中介机构
      { label: '供应商', value: '1' },
      { label: '核心企业(项目公司)', value: '201' },
      { label: '核心企业(集团公司)', value: '202' },
      { label: '保理商', value: '3' },
      { label: '银行', value: '4' },
      { label: '中介机构', value: '102' },
      { label: '服务机构', value: '6' },
      // { label: '核心企业', value: '2' },
      // { label: '金融机构', value: '4' },
      // { label: '下游采购商', value: '5' },
      // { label: '平台', value: '99' }
    ] as EnterpriseTypeOutputModel[],
    patternWithGuaranteeAgency: [
      // 保函通-模式配置，前端配置
      { label: '平台', value: '0' },
      { label: '投标人', value: '1' },
      { label: '担保机构', value: '2' },
      { label: '出函机构', value: '3' },
      { label: '招标人', value: '4' },
      { label: '中介', value: '5' },
      { label: '游客', value: '6' },
    ] as SelectItemsModel[],

    orgCodeType: [
      { label: '统一社会信用代码', value: '统一社会信用代码' },
      { label: '营业执照号', value: '营业执照号' },
    ] as SelectItemsModel[],

    taxingType: [
      { label: '普通发票', value: 1 },
      { label: '增值税专用发票', value: 2 },
    ] as SelectItemsModel[],
    companyInvoice: [{ label: '普通发票', value: 1 }] as SelectItemsModel[],

    cardType: [
      { label: '身份证', value: '身份证' },
      { label: '护照', value: '护照' },
    ] as SelectItemsModel[],
    newcardType: [
      { label: '身份证', value: 0 },
      { label: '港澳居民往来内地通行证', value: 1 },
      { label: '护照', value: 2 },
    ] as SelectItemsModel[],

    // 中国城市
    chinaCity: SelectOptions.buildProvinceCity(),

    // 行业分类
    orgIndustry: SelectOptions.buildOrgIndustry(),
    // 应收账款类型
    accountReceivable: SelectOptions.buildaccountsreceivable(),

    // 银行卡列表
    bankcard: [],
    certUserMode: [
      { label: '新用户', value: '新用户' },
      { label: '同系统管理员', value: '同系统管理员' },
    ] as SelectItemsModel[],

    user1Mode: [
      { label: '新用户', value: '新用户' },
      { label: '同系统管理员', value: '同系统管理员' },
      { label: '同数字证书管理员', value: '同数字证书管理员' },
    ] as SelectItemsModel[],

    user2Mode: [
      { label: '新用户', value: '新用户' },
      { label: '同系统管理员', value: '同系统管理员' },
      { label: '同数字证书管理员', value: '同数字证书管理员' },
      { label: '同经办人', value: '同经办人' },
    ] as SelectItemsModel[],

    notifierMode: [
      { label: '新用户', value: '新用户' },
      { label: '同系统管理员', value: '同系统管理员' },
      { label: '同数字证书管理员', value: '同数字证书管理员' },
      { label: '同经办人', value: '同经办人' },
      { label: '同复核人', value: '同复核人' },
    ] as SelectItemsModel[],
    recordStatus: [
      { label: '<span class="xn-record-status-1">待开户</span>', value: '-1' },
      { label: '<span class="xn-record-status-1">草稿</span>', value: '0' },
      { label: '<span class="xn-record-status-1">进行中</span>', value: '1' },
      { label: '<span class="xn-record-status-2">已完结</span>', value: '2' },
      { label: '<span class="xn-record-status-3">已中止</span>', value: '3' },
    ] as SelectItemsModel[],
    isInit: [
      { label: '未注册', value: 0 },
      { label: '已注册', value: 1 },
    ] as SelectItemsModel[],

    resolveType: [
      {
        label: '提交甲方注册地有管辖权的人民法院以诉讼方式解决',
        value: '甲方法院',
      },
      {
        label: '提交乙方注册地有管辖权的人民法院以诉讼方式解决',
        value: '乙方法院',
      },
      {
        label: '提交甲方注册地深圳国际仲裁院（深圳仲裁委员会）',
        value: '甲方仲裁',
      },
      {
        label: '提交乙方注册地深圳国际仲裁院（深圳仲裁委员会）',
        value: '乙方仲裁',
      },
      { label: '其他', value: '其他' },
    ] as SelectItemsModel[],

    regOrgType: [
      { label: '供应商', value: '1' },
      { label: '采购商（核心企业）', value: '2' },
      { label: '保理商', value: '3' },
    ] as SelectItemsModel[],
    // 应收账款类型
    debtReceivableType: [
      { label: '商品', value: '商品' },
      { label: '服务', value: '服务' },
      { label: '出租资产', value: '出租资产' },
    ] as SelectItemsModel[],
    payback: [
      { label: '还款异常', value: 1 },
      { label: '还款正常', value: 0 },
    ] as SelectItemsModel[],

    contractFileType: [
      { label: '单个PDF文件', value: 'pdf' },
      { label: '图片文件（可以多张）', value: 'img' },
    ] as SelectItemsModel[],

    rateType: [
      { label: '利息前置（发放融资款时一次扣收）', value: '利息前置' },
      { label: '利息后置（融资期间分次收取）', value: '利息后置' },
    ] as SelectItemsModel[],

    platformCostType: [
      { label: '收取平台手续费', value: '是' },
      { label: '不收平台手续费', value: '否' },
    ] as SelectItemsModel[],

    orgScale: [
      { label: '大型企业', value: '0' },
      { label: '中型企业', value: '1' },
      { label: '小型微型企业', value: '2' },
    ] as SelectItemsModel[],

    type: [
      { label: '基础模式，有发票', value: 'A' },
      { label: '基础模式，无发票', value: 'B' },
      { label: '委托模式，有发票', value: 'C' },
      { label: '委托模式，无发票', value: 'D' },
      { label: '回购模式，有发票', value: 'E' },
      { label: '回购模式，无发票', value: 'F' },
    ] as SelectItemsModel[],

    element: [
      { label: '齐全', value: '齐全' },
      { label: '少发票', value: '少发票' },
    ] as SelectItemsModel[],

    complete: [
      { label: '是', value: '是' },
      { label: '否', value: '否' },
    ] as SelectItemsModel[],

    invoice: [
      { label: '保理结束前', value: '保理结束前' },
      { label: '保理结束后', value: '保理结束后' },
    ] as SelectItemsModel[],

    pledge: [
      { label: '已质押', value: '1' },
      { label: '未质押', value: '0' },
    ] as SelectItemsModel[],
    // 平台所有模式
    proxyStatus: [
      { label: '基础模式', value: '0' },
      { label: '委托模式', value: '2' },
      { label: '回购模式', value: '1' },
      { label: '标准保理', value: '3' },
      { label: '房地产供应链标准保理', value: '6' },
      { label: '房地产供应链标准保理', value: '18' },
      { label: '保理融资', value: '7' },
      { label: '定向收款-委托签约', value: '11' },
      { label: '定向收款-协议变更', value: '12' },
      { label: '定向收款-保理融资', value: '13' },
      { label: '标准保理-金地', value: '14' },
      { label: '采购融资', value: '50' },
      { label: '龙光模式', value: '52' },
      { label: '万科模式', value: '53' },
    ] as SelectItemsModel[],
    projectTypeset: [{ label: '保理融资', value: 1 }] as SelectItemsModel[],

    // 基础模式
    mainFlowStatus: [
      { label: '申请保理', value: '1' },
      { label: '平台处理申请资料', value: '2' },
      { label: '保理商审批并签署合同', value: '3' },
      { label: '申请企业确认并签署合同', value: '4' },
      { label: '保理商放款', value: '5' },
      { label: '申请企业回款处理', value: '6' },
      { label: '保理商收款登记', value: '7' },
      { label: '交易完成', value: '9' },
      { label: '终止', value: '8' },
    ] as SelectItemsModel[],
    // 定向-变更协议状态
    direFlowChangeStatus: [
      { label: '供应商发起变更协议申请', value: '1' },
      { label: '保理商签署合同', value: '2' },
      { label: '银行处理申请', value: '3' },
      { label: '保理商上传变更后信息', value: '4' },
      { label: '交易完成', value: '5' },
      { label: '终止', value: '8' },
    ] as SelectItemsModel[],
    // 定向-协议签约
    direAgreementSigningStatus: [
      { label: '供应商发起签约申请', value: '1' },
      { label: '平台签署合同', value: '2' },
      { label: '保理商签署合同', value: '3' },
      { label: '银行签约', value: '4' },
      { label: '保理商补录账户信息', value: '5' },
      { label: '交易完成', value: '6' },
      { label: '终止', value: '8' },
    ] as SelectItemsModel[],
    // 定向-申请融资
    direApplyLoadStatus: [
      { label: '保理商提单', value: '1' },
      { label: '供应商发起融资申请', value: '2' },
      { label: '保理商审核资料', value: '3' },
      { label: '保理商放款', value: '4' },
      { label: '保理商确认回款', value: '5' },
      { label: '交易完成', value: '6' },
      { label: '终止', value: '8' },
    ] as SelectItemsModel[],
    // 保证金
    depositMainFlowStatus: [
      { label: '核心企业支付保证金', value: '1' },
      { label: '保理商审核', value: '2' },
      { label: '交易完成', value: '3' },
    ] as SelectItemsModel[],
    // 标准保理-万科 6
    standardFactoring: [
      { label: '保理商预录入', value: '1' },
      { label: '供应商上传资料并签署合同', value: '2' },
      { label: '保理商审核并签署合同', value: '3' },
      { label: '交易完成', value: '4' },
      { label: '终止', value: '8' },
    ] as SelectItemsModel[],
    // 项目公司待补充资料
    additionalMaterials: [
      { label: '保理商预录入', value: '1' },
      { label: '供应商上传资料', value: '2' },
      { label: '保理商审核', value: '3' },
    ] as SelectItemsModel[],
    // (雅居乐-星顺)项目公司待补充资料
    additionalMaterialsNewAgile: [
      { label: '平台预录入', value: '1' },
      { label: '供应商上传资料', value: '2' },
      { label: '平台审核', value: '3' },
      { label: '交易完成', value: '4' },
      { label: '保理签署合同', value: '5' },
      { label: '供应商签署合同', value: '6' },
      { label: '终止', value: '8' },
    ] as SelectItemsModel[],
    // 交易状态
    capitalPoolTradeStatus: [
      { label: '保理商预录入', value: '1' },
      { label: '供应商上传资料', value: '2' },
      { label: '供应商签署合同', value: '4' },
      { label: '平台审核', value: '3' },
    ] as SelectItemsModel[],
    // 新交易列表里面代还款 还款状态
    payStatus: [
      { label: '逾期', value: '1' },
      { label: '提醒', value: '2' },
    ] as SelectItemsModel[],
    // 标准保理
    standardFactoring1: [
      { label: '申请保理', value: '1' },
      { label: '平台处理申请资料', value: '2' },
      { label: '保理商审批并签署合同', value: '3' },
      { label: '申请企业确认并签署合同', value: '4' },
      { label: '保理商签发放款确认书', value: '5' },
      { label: '申请企业确认放款确认书', value: '6' },
      { label: '保理商放款', value: '7' },
      { label: '交易完成', value: '9' },
      { label: '终止', value: '8' },
    ] as SelectItemsModel[],
    // 老金地
    oldGemdaleStatus: [
      { label: '保理商和地产预录入', value: '1' },
      { label: '上传保理业务资料', value: '2' },
      { label: '平台处理申请资料', value: '3' },
      { label: '保理商审批并签署合同', value: '4' },
      { label: '申请方确认并签署合同', value: '5' },
      { label: '项目公司签署付款确认书', value: '6' },
      { label: '保理商签发放款确认书', value: '7' },
      { label: '申请方确认放款确认书', value: '9' },
      { label: '保理商放款', value: '10' },
      { label: '金地总部签署', value: '11' },
      { label: '城市公司签署通知书', value: '12' },
      { label: '交易完成', value: '13' },
      { label: '终止', value: '8' },
    ] as SelectItemsModel[],
    // 采购融资万科供应商发起流程
    avengerSupplier: [
      { label: '供应商发起申请', value: '1' },
      { label: '上游客户上传资料', value: '2' },
      { label: '资料初审', value: '3' },
      { label: '风险审核', value: '4' },
      { label: '万科供应商签署合同', value: '5' },
      { label: '上游客户签署合同', value: '6' },
      { label: '待审批', value: '7' },
      { label: '审批中', value: '9' },
      { label: '保理商签署合同', value: '10' },
      { label: '待放款', value: '11' },
      { label: '已放款', value: '12' },
      { label: '已回款', value: '13' },
      { label: '终止', value: '8' },
    ] as SelectItemsModel[],
    /**合同生成类型 */
    concreateType: [
      { label: '代码生成', value: 0 },
      { label: '拟合生成', value: 1 },
    ] as SelectItemsModel[],
    // 金地abs
    gemdaleflowStatus: [
      { label: '保理商预录入', value: '1' },
      { label: '供应商上传资料并签署合同', value: '2' },
      { label: '保理商审核', value: '3' },
      { label: '项目公司确认应收账款金额', value: '4' },
      // {label: '集团公司签署付款确认书', value: '5'},
      { label: '保理商签署合同', value: '6' },
      { label: '交易完成', value: '7' },
      { label: '终止', value: '8' },
    ] as SelectItemsModel[],
    taxType: [
      { label: '增值税一般纳税人', value: '1' },
      { label: '增值税小规模纳税人', value: '2' },
    ] as SelectItemsModel[],
    exportTable: [
      { label: '保理流程数据', value: 'factoryFlow' },
      { label: '商票数据', value: 'honour' },
      { label: '合同数据', value: 'contract' },
      { label: '发票数据', value: 'invoice' },
      { label: '注册客户数据', value: 'registerCustomer' },
    ] as SelectItemsModel[],
    // 介绍公司与注册公司关系
    enterpriseRelationType: [
      { label: '上游（供货商）', value: '上游（供货商）' },
      { label: '下游（采购商）', value: '下游（采购商）' },
      { label: '父企业', value: '父企业' },
      { label: '子企业', value: '子企业' },
      { label: '关联企业', value: '关联企业' },
    ] as SelectItemsModel[],
    // 总部公司 -vanke  雅居乐集团控股有限公司
    enterprise_dc: [
      {
        label: '万科企业股份有限公司',
        value: '万科',
        children: [
          { label: '万科', value: '1' },
          { label: '国寿', value: '2' },
        ],
      },
      { label: '雅居乐地产控股有限公司', value: '雅居乐地产控股有限公司' },
    ],
    enterprise_new_agile: [
      { label: '雅居乐集团控股有限公司', value: '雅居乐集团控股有限公司' },
    ],
    // 保理通-雅居乐 发起提单-总部公司
    enterprise_dc_oldagile: [
      { label: '雅居乐地产控股有限公司', value: '雅居乐地产控股有限公司' },
    ],
    // 保理通-碧桂园 发起提单-保理商
    enterprise_dc_bgy: [
      {
        label: '深圳市星顺商业保理有限公司',
        value: '深圳市星顺商业保理有限公司',
      },
    ],
    // 总部公司 -dragon  深圳市龙光控股有限公司 万科企业股份有限公司
    enterprise_dragon: [
      { label: '深圳市龙光控股有限公司', value: '深圳市龙光控股有限公司' },
      { label: '万科企业股份有限公司', value: '万科企业股份有限公司' },
    ] as SelectItemsModel[],
    // 总部公司（新万科，龙光）
    enterprise_dragon1: [
      { label: '万科企业股份有限公司', value: '万科' },
      { label: '雅居乐地产控股有限公司', value: '雅居乐地产控股有限公司' },
      { label: '深圳市龙光控股有限公司', value: '深圳市龙光控股有限公司' },
      { label: '深圳华侨城股份有限公司', value: '深圳华侨城股份有限公司' },
      { label: '碧桂园地产集团有限公司', value: '碧桂园地产集团有限公司' },
      { label: '金地（集团）股份有限公司', value: '金地（集团）股份有限公司' },
      { label: '成都轨道交通集团有限公司', value: '成都轨道交通集团有限公司' },
    ] as SelectItemsModel[],
    // 总部公司（新万科，龙光）
    enterprise_dragon2: [
      { label: '龙光工程建设有限公司', value: '龙光工程建设有限公司' },
      { label: '万科企业股份有限公司', value: '万科企业股份有限公司' },
      { label: '深圳市龙光控股有限公司', value: '深圳市龙光控股有限公司' },
      // { label: '雅居乐地产控股有限公司', value: '雅居乐地产控股有限公司' },
      { label: '碧桂园地产集团有限公司', value: '碧桂园地产集团有限公司' },
      { label: '深圳华侨城股份有限公司', value: '深圳华侨城股份有限公司' },
      { label: '成都轨道交通集团有限公司', value: '成都轨道交通集团有限公司' },
    ] as SelectItemsModel[],
    newenterprise_dragon2: [
      { label: '龙光工程建设有限公司', value: '龙光工程建设有限公司' },
      { label: '深圳市龙光控股有限公司', value: '深圳市龙光控股有限公司' },
    ] as SelectItemsModel[],
    goodsname: [
      {
        label: '*金融服务*资产证券化转让价差',
        value: '*金融服务*资产证券化转让价差',
      },
    ] as SelectItemsModel[],
    // 地产业务 -新万科 产品类型->渠道
    productType_vk: [
      { label: 'ABS', value: '1' },
      { label: '再保理', value: '2' },
      { label: '非标', value: '99' },
    ] as SelectItemsModel[],
    productType_dragon: [
      { label: 'ABS', value: '1', children: [] },
      { label: 'ABN', value: '4', children: [] },
      {
        label: '非标',
        value: '99',
        children: [{ label: '博时资本', value: '9' }],
      },
    ] as SelectItemsModel[],
    productType_dw: [
      { label: 'ABS', value: '1', children: [] },
      {
        label: '再保理',
        value: '2',
        children: [
          { label: '光大', value: '1' },
          { label: '招行', value: '2' },
          { label: '邮储', value: '3' },
          { label: '农行', value: '4' },
          { label: '北京银行', value: '7' },
          { label: '浦发银行', value: '8' },
          { label: '工商银行', value: '12' },
          { label: '民生银行', value: '13' },
          { label: '中国银行', value: '14' },
        ],
      },
      { label: '非标', value: '99', children: [] },
      { label: 'ABN', value: '4', children: [] },
      { label: '险资计划', value: '5', children: [] },
    ] as SelectItemsModel[],

    productType_vanke_xn: [
      { label: 'ABS', value: '1', children: [] },
      {
        label: '再保理',
        value: '2',
        children: [
          { label: '光大', value: '1' },
          { label: '招行', value: '2' },
          { label: '邮储', value: '3' },
          { label: '农行', value: '4' },
          { label: '北京银行', value: '7' },
          { label: '浦发银行', value: '8' },
          { label: '工商银行', value: '12' },
        ],
      },
      { label: '非标', value: '99', children: [] },
    ] as SelectItemsModel[],

    productType_Jd: [
      { label: 'ABS', value: '1', children: [] },
      {
        label: '再保理',
        value: '2',
        children: [
          { label: '东亚', value: '10' },
          // { label: '工行再保理', value: '12' },
        ],
      },
      {
        label: '非标',
        value: '99',
        children: [{ label: '国寿', value: '12' }],
      },
    ] as SelectItemsModel[],
    // --------------
    // 平台审核暂停
    suspendReason: [
      {
        label: '业务资料修改',
        value: 1,
        children: [
          { label: '项目公司名称', value: 1 },
          { label: '供应商名称', value: 2 },
          { label: '发票变更', value: 3 },
        ],
      },
      {
        label: '收款信息修改',
        value: 2,
        children: [
          { label: '户名修改', value: 1 },
          { label: '收款单位开户行', value: 2 },
          { label: '收款单位账号', value: 3 },
        ],
      },
    ] as SelectItemsModel[],
    // 数据对接-银行可放款状态
    bankConfirmState: [
      { label: '未交单', value: 0 },
      { label: '已交单', value: 1 },
    ] as SelectItemsModel[],
    fontSize: [
      { label: '14px', value: 14 },
      { label: '16px', value: 16 },
      { label: '18px', value: 18 },
    ] as SelectItemsModel[],
    // 新万科-拟入池项目来源
    productSource_vk: [
      { label: 'ABS', value: '1' },
      { label: '再保理', value: '2' },
      { label: '非标', value: '99' },
    ] as SelectItemsModel[],
    fitProject: [
      { label: '通用', value: '通用' },
      { label: '国寿', value: '国寿' },
    ] as SelectItemsModel[],
    intermediarySatus: [
      { label: '无效', value: 0 },
      { label: '未生效', value: 1 },
      { label: '已生效', value: 2 },
    ] as SelectItemsModel[],
    // 万科二期 中介机构状态 --------------------------------------------
    agencyStatus: [
      { label: '未生效', value: 1 },
      { label: '已生效', value: 2 },
      { label: '拒绝', value: 4 },
    ] as SelectItemsModel[],
    ruleType: [
      { label: '规则', value: 1 },
      { label: '模型', value: 2 },
    ] as SelectItemsModel[],
    // 万科二期 证件类型
    cardTypes: [
      { label: '身份证', value: 1 },
      { label: '护照', value: 2 },
    ] as SelectItemsModel[],
    // 万科二期 中介类型
    agencyType: [
      { label: '计划管理人', value: 1 },
      { label: '会计师事务所', value: 2 },
      { label: '联合销售机构', value: 3 },
      { label: '评级机构', value: 4 },
      { label: '律师事务所', value: 5 },
      { label: '主要销售机构', value: 6 },
      { label: '资产服务机构', value: 7 },
      { label: '投资者', value: 8 },
      { label: '托管服务机构', value: 9 },
      { label: '资金服务机构', value: 10 },
      { label: '再保理银行', value: 11 },
      { label: '担保机构', value: 12 },
      { label: '加入债务人', value: 13 },
      { label: '差额补足方', value: 14 },
      { label: '连带责任担保方', value: 15 },
      { label: '流动性支持方', value: 16 },
    ] as SelectItemsModel[],
    // 万科二期 中介机构用户角色
    agencyRoles: [
      { label: '管理员', value: 'admin' },
      { label: '经办人', value: 'operator' },
      { label: '复核人', value: 'reviewer' },
    ] as SelectItemsModel[],
    intermediaryType: [
      { label: '律师事务所', value: '1' },
      { label: '会计师事务所', value: '2' },
      { label: '投资者', value: '3' },
      { label: '计划管理人', value: '4' },
      { label: '评级机构', value: '5' },
    ] as SelectItemsModel[],
    // --------------------------------------------------------
    // 万科二期 提醒管理  ----------------
    // 提醒方式
    noticeType: [
      { label: '系统提醒', value: '1', disable: true },
      { label: '邮件提醒', value: '2' },
    ] as SelectItemsModel[],
    // 提醒反馈类型
    feedback: [
      { label: '下载', value: 1 },
      { label: '上传', value: 2 },
      { label: '上传/下载', value: 3 },
    ] as SelectItemsModel[],

    // 是否启用
    isOpen: [
      { label: '启用', value: 1 },
      { label: '停用', value: 0 },
    ] as SelectItemsModel[],
    // 万科二期 评级  ----------------
    // 评级类型
    gradeType: [
      { label: '初始评级', value: 0 },
      { label: '跟踪评级', value: 1 },
    ] as SelectItemsModel[],
    // 万科二期 项目管理  ----------------
    // 选择抽样
    selectSample: [
      { label: '重新抽样', value: 0 },
      { label: '调整抽样', value: 1 },
    ] as SelectItemsModel[],
    // 特殊资产标记
    specialCapitalMark: [
      { label: '争议资产', value: 1 },
      { label: '不合格资产', value: 2 },
    ] as SelectItemsModel[],
    // 特殊资产处置流程 -- 争议资产处置状态
    unqualifyDisposalStatus: [
      { label: '未处置', value: 1 },
      { label: '保理商已从专项计划赎回', value: 2 },
      { label: '供应商已从专项计划赎回', value: 3 },
      { label: '供应商已从保理商处赎回', value: 4 },
    ] as SelectItemsModel[],
    // 不合格资产处置状态
    disputeDisposalStatus: [
      { label: '未处置', value: 1 },
      { label: '保理商已从专项计划回购', value: 2 },
      { label: '供应商已从专项计划回购', value: 3 },
      { label: '供应商已从保理商处回购', value: 4 },
    ] as SelectItemsModel[],
    // 处置状态
    disposalStatus: [
      { label: '未处置', value: 1 },
      { label: '保理商已从专项计划赎回', value: 2 },
      { label: '供应商已从专项计划赎回', value: 3 },
      { label: '供应商已从保理商处赎回', value: 4 },
      { label: '保理商已从专项计划回购', value: 5 },
      { label: '供应商已从专项计划回购', value: 6 },
      { label: '供应商已从保理商处回购', value: 7 },
    ] as SelectItemsModel[],
    // 尽调状态
    surveyStatus: [
      { label: '未发起', value: 0 },
      { label: '尽调初审', value: 1 },
      { label: '补充资料', value: 2 },
      { label: '尽调终审', value: 3 },
      { label: '尽调通过', value: 4 },
      { label: '取消尽调', value: 5 },
    ] as SelectItemsModel[],
    allSurveyStatus: [
      {
        label: '律所尽调',
        value: '1',
        children: [
          { label: '尽调初审', value: '1' },
          { label: '补充资料', value: '2' },
          { label: '尽调终审', value: '3' },
          { label: '尽调通过', value: '4' },
          { label: '取消尽调', value: '5' },
        ],
      },
      {
        label: '管理人尽调',
        value: '2',
        children: [
          { label: '尽调初审', value: '6' },
          { label: '补充资料', value: '7' },
          { label: '尽调终审', value: '8' },
          { label: '尽调通过', value: '9' },
          { label: '取消尽调', value: '10' },
        ],
      },
    ] as SelectItemsModel[],
    // 尽调意见
    surveyInfo: [
      { label: '初审尽调意见', value: 1 },
      { label: '终审尽调意见', value: 2 },
    ] as SelectItemsModel[],
    // 项目管理-上传文件、产品信息专项计划相关文件
    fileType: [
      { label: '计划管理人文件', value: 1 },
      { label: '原始权益人文件', value: 2 },
      { label: '律所文件', value: 3 },
      { label: '资产服务机构文件', value: 4 },
      { label: '评级机构文件', value: 5 },
      { label: '托管服务机构文件', value: 6 },
      { label: '承销机构文件', value: 7 },
      { label: '会计师事务所文件', value: 8 },
      { label: '资金服务机构文件', value: 9 },
    ] as SelectItemsModel[],
    // 总部公司 -金地
    enterprise_dc_gemdale: [
      { label: '金地（集团）股份有限公司', value: '金地（集团）股份有限公司' },
    ] as SelectItemsModel[],
    // 总部公司（金地，万科映射关系）
    abs_headquarters: [
      { label: '万科企业股份有限公司', value: '万科' },
      { label: '金地（集团）股份有限公司', value: '金地（集团）股份有限公司' },
      { label: '雅居乐地产控股有限公司', value: '雅居乐地产控股有限公司' },
      { label: '雅居乐集团控股有限公司', value: '雅居乐集团控股有限公司' },
      { label: '深圳市龙光控股有限公司', value: '深圳市龙光控股有限公司' },
    ] as SelectItemsModel[],
    business_type: [
      { label: '地产类业务', value: '地产类业务' },
    ] as SelectItemsModel[],
    // 定向支付提单
    enterprise_hw: [{ label: '华为', value: '华为' }],
    contractType_jban: [
      { label: '工程', value: '工程' },
      { label: '贸易', value: '贸易' },
    ] as SelectItemsModel[],
    // 经办人身份证件类型
    userCertType: [{ label: '身份证', value: 'SF' }] as SelectItemsModel[],
    // 华为模式合同类型
    hwContractType: [
      { label: '商品', value: '商品' },
      { label: '服务', value: '服务' },
    ] as SelectItemsModel[],
    // 生成账款回执
    accountReceipts: [
      { label: '有', value: 1 },
      { label: '无', value: 0 },
    ] as SelectItemsModel[],
    // 付款确认书(龙光)
    accountReceiptsDragon: [
      { label: '已回传文件', value: 2 },
      { label: '已生成文件', value: 1 },
      { label: '末生成文件', value: 0 },
    ] as SelectItemsModel[],
    // 生成账款回执/通知书(龙光)
    accountReceipts2Dragon: [
      { label: '已签署文件', value: 2 },
      { label: '已生成文件', value: 1 },
      { label: '末生成文件', value: 0 },
    ] as SelectItemsModel[],
    // 推送企业次数
    pushCount: [
      { label: '未推送', value: 0 },
      { label: '1', value: 1 },
      { label: '2', value: 2 },
      { label: '3', value: 3 },
      { label: '4', value: 4 },
      { label: '更多', value: 5 },
    ] as SelectItemsModel[],
    // 定向保理-变更协议
    changeDeal: [
      { label: '账户利率', value: '账户利率' },
      { label: '收息账号', value: '收息账号' },
      { label: '账户户名', value: '账户户名' },
      { label: '收款方式', value: '收款方式' },
      { label: '收款要件', value: '收款要件' },
      { label: '付款要件', value: '付款要件' },
      { label: '划款方式', value: '划款方式' },
      { label: '定向收款账(卡)号', value: '定向收款账(卡)号' },
      { label: '定向付款账(卡)号', value: '定向付款账(卡)号' },
      { label: '其他', value: '其他' },
    ] as SelectItemsModel[],
    // 委托付款通知管理-通知状态
    noticeStatus: [
      { label: '待下载', value: 0 },
      { label: '已下载', value: 1 },
    ] as SelectItemsModel[],
    // 合同规则
    contractRules: [
      { label: '特殊', value: '特殊' },
      { label: '通用', value: '通用' },
    ] as SelectItemsModel[],
    // 一次转让合同管理 合同组状态
    contractStatus: [
      { label: '未生效', value: 1 },
      { label: '已生效', value: 2 },
    ] as SelectItemsModel[],
    // 一次转让合同管理 适用选项
    applyOptions: [
      { label: '通用', value: '通用' },
      { label: '非通用', value: '非通用' },
    ] as SelectItemsModel[],
    // 一次转让合同管理 适用项目
    projectOptions: [
      { label: '通用', value: '通用' },
      { label: '国寿财富', value: '国寿财富' },
    ] as SelectItemsModel[],
    // 一次转让合同管理 适用收款单位
    payeeOptions: [
      { label: '通用', value: '通用' },
      { label: '中建三局', value: '中建三局' },
    ] as SelectItemsModel[],
    // 一次转让合同管理 合同模板类型
    templateType: [
      { label: '主合同', value: 0 },
      { label: '普通合同', value: 1 },
      { label: '特殊合同', value: 2 },
    ] as SelectItemsModel[],
    // 一次转让合同管理 签署方
    signer: [
      { label: '总部公司', value: 0 },
      { label: '收款单位', value: 1 },
      { label: '项目公司', value: 2 },
      { label: '保理商', value: 3 },
    ] as SelectItemsModel[],
    // 一次转让合同管理 适用项目来源
    projectType: [
      // { label: '无', value: 0 },
      { label: 'ABS储架项目', value: 1 },
      { label: '再保理银行项目', value: 2 },
    ] as SelectItemsModel[],
    // 一次转让合同-总部公司（新万科，龙光）
    enterprise_dragon3: [
      { label: '万科企业股份有限公司', value: '万科企业股份有限公司' },
      { label: '雅居乐集团控股有限公司', value: '雅居乐集团控股有限公司' },
      { label: '深圳市龙光控股有限公司', value: '深圳市龙光控股有限公司' },
      { label: '金地（集团）股份有限公司', value: '金地（集团）股份有限公司' },
      { label: '龙光工程建设有限公司', value: '龙光工程建设有限公司' },
      { label: '通用', value: '通用' },
      { label: '碧桂园地产集团有限公司', value: '碧桂园地产集团有限公司' },
      { label: '深圳华侨城股份有限公司', value: '深圳华侨城股份有限公司' },
      { label: '成都轨道交通集团有限公司', value: '成都轨道交通集团有限公司' },
    ] as SelectItemsModel[],
    // 一次转让合同-总部公司（新万科，龙光）
    enterprise_dragon4: [
      { label: '万科企业股份有限公司', value: '万科企业股份有限公司' },
      { label: '雅居乐集团控股有限公司', value: '雅居乐集团控股有限公司' },
      { label: '深圳市龙光控股有限公司', value: '深圳市龙光控股有限公司' },
    ] as SelectItemsModel[],
    // 二次转让合同-签署方式
    signMethod: [
      { label: '线上签署', value: '线上签署' },
      { label: '线下签署', value: '线下签署' },
    ] as SelectItemsModel[],
    // 二次转让合同-生成逻辑
    generateLogic: [
      { label: '单笔单出', value: '单笔单出' },
      { label: '项目清单式', value: '项目清单式' },
      { label: '总部清单式', value: '总部清单式' },
    ] as SelectItemsModel[],
    generateLogicNumber: [
      { label: '单笔单出', value: 0 },
      { label: '项目清单式', value: 1 },
      { label: '总部清单式', value: 2 },
    ] as SelectItemsModel[],
    // 总部公司
    dcType: [
      { label: '万科地产', value: '4' },
      { label: '金地地产', value: '5' },
    ] as SelectItemsModel[],

    // 资金渠道
    moneyChannel: [
      { label: '自有资金', value: 1 },
      { label: '过桥资金', value: 2 },
    ] as SelectItemsModel[],
    // 资金渠道是否补充付款账户
    isFundingInfo: [
      { label: '未补充', value: 0 },
      { label: '已补充', value: 1 },
    ] as SelectItemsModel[],
    // 出纳下载模板选择
    cashierDownTemplate: [
      { label: '工行模板', value: '1' },
      { label: '潍坊模板', value: '2' },
      { label: '浦发模板', value: '3' },
    ] as SelectItemsModel[],

    // 资产池交易模式
    proxyType: [
      { label: '万科模式', value: 6 },
      { label: '金地模式', value: 14 },
      { label: '普惠通', value: 50 },
      { label: '签署协议流程', value: 51 },
      { label: '龙光模式', value: 52 },
      { label: '万科ABS', value: 53 },
      { label: '金地ABS', value: 56 },
    ] as SelectItemsModel[],
    newproxyType: [
      { label: '万科模式', value: 6 },
      { label: '金地模式', value: 14 },
      { label: '万科ABS', value: 53 },
    ] as SelectItemsModel[],
    // 代办处理步骤
    todoStep: [
      { label: '预录入', value: '预录入' },
      { label: '提交资料', value: '提交资料' },
      { label: '初审', value: '初审' },
      { label: '平台初审', value: '平台初审' },
      { label: '复核', value: '复核' },
      { label: '保理经办', value: '保理经办' },
      { label: '保理复核', value: '保理复核' },
    ] as SelectItemsModel[],
    todoSteps: [
      { label: '提交资料', value: '提交资料' },
      { label: '初审', value: '初审' },
      { label: '复核', value: '复核' },
      { label: '保理经办', value: '保理经办' },
      { label: '保理复核', value: '保理复核' },
    ] as SelectItemsModel[],
    todoCurrentSteps: [
      { label: '经办', value: '@begin' },
      { label: '初审', value: 'operate' },
      { label: '复核', value: 'review' },
      { label: '高管复核', value: 'windReview' },
      { label: '风险复核', value: 'riskReview' },
    ] as SelectItemsModel[],
    readStatus: [
      { label: '<span class="xn-record-status-4">未读</span>', value: '0' },
      { label: '<span class="xn-record-status-2">已读</span>', value: '1' },
    ] as SelectItemsModel[],
    // 合同控制企业类型
    orgNameType: [
      { label: '供应商', value: 1 },
      { label: '核心企业', value: 2 },
    ] as SelectItemsModel[],
    bussStatus: [
      { label: '是', value: 1 },
      { label: '否', value: 0 },
    ] as SelectItemsModel[],
    // 费用情况
    freeType: [
      { label: '已收齐', value: 2 },
      { label: '未收齐', value: 1 },
    ] as SelectItemsModel[],
    // 退款状态
    moneyback: [
      { label: '未退款', value: '1' },
      { label: '无需退款', value: '3' },
      { label: '已退款', value: '2' },
    ] as SelectItemsModel[],
    // 审批放款中账号变更原因
    changeReason: [
      { label: '原收款账号为保理账户', value: 1 },
      { label: '户名名称不全', value: 2 },
      { label: '开户行名称有误', value: 3 },
      { label: '账号号码错误', value: 4 },
      { label: '总包委托付款', value: 5 },
    ] as SelectItemsModel[],
    // 金地系统 - 审批放款中账号变更原因
    changeReasonGemdal: [
      { label: '原收款账户为保理专户', value: 1 },
      { label: '收款账户信息有误', value: 7 },
      { label: '委托付款', value: 8 },
      /**
       * 1=原收款账户为保理专户 7=收款账户信息有误 8=委托付款
       */
    ] as SelectItemsModel[],
    // 审批放款商票匹配
    fitResult: [
      { label: '未匹配', value: 0 },
      { label: '匹配成功', value: 1 },
      { label: '存在多笔交易', value: 2 },
    ] as SelectItemsModel[],
    // 审批放款业务类型
    spIsProxy: [
      { label: '普惠通', value: 50 },
      { label: '万科模式', value: 6 },
      { label: '金地模式', value: 14 },
      { label: '碧桂园模式', value: 54 },
      { label: '金地香纳模式', value: 56 },
    ] as SelectItemsModel[],

    // 采购融资列表业务类型
    spIsProxys: [
      { label: '普惠通', value: 50 },
      { label: '签署协议流程', value: 51 },
    ] as SelectItemsModel[],

    contractDateStatus: [
      { label: '长期', value: '长期' },
      { label: '固定期限', value: '固定期限' },
    ] as SelectItemsModel[],
    controlArea: [
      { label: '不限区域', value: '不限区域' },
      { label: '本地', value: '本地' },
      { label: '异地', value: '异地' },
    ] as SelectItemsModel[],
    isUseQuota: [
      { label: '可贴现', value: 1 },
      { label: '不可贴现', value: 0 },
      { label: '已贴现', value: 2 },
    ] as SelectItemsModel[],
    /** 批量获取发票截图的状态 */
    InvoiceStateOptions: [
      { label: '已完成', value: 1 },
      { label: '未完成', value: 0 },
    ] as SelectItemsModel[],
    // 审核机构状态
    createStatus: [
      { label: '草稿', value: '0' },
      { label: '进行中', value: '1' },
      { label: '已完结', value: '2' },
      { label: '已中止', value: '3' },
    ] as SelectItemsModel[],
    // 是否申请ca
    caApply: [
      { label: '是', value: 1 },
      { label: '否', value: 0 },
    ] as SelectItemsModel[],
    // 是否存在
    isExist: [
      { label: '是', value: '1' },
      { label: '否', value: '0' },
    ] as SelectItemsModel[],
    // 储架
    storageRack: [
      {
        label: '中信证券-链融科技供应链金融2号第【X】期资产支持专项计划',
        value: 'wk-1',
        headquarters: '万科',
      },
      {
        label: '国信证券-链融科技供应链金融N号第【X】期资产支持专项计划',
        value: 'wk-2',
        headquarters: '万科',
      },
      {
        label: '华能信托-链融科技诚意1-3期供应链金融资产支持专项计划',
        value: 'wk-3',
        headquarters: '万科',
      },
      {
        label: '南方资本-链融科技【X】期供应链金融资产支持专项计划',
        value: 'wk-4',
        headquarters: '万科',
      },
      {
        label: '中信证券-链融科技供应链金融N号第【X】期资产支持专项计划',
        value: 'wk-5',
        headquarters: '万科',
      },
      { label: '国寿', value: 'wk-6', headquarters: '万科' },
      // { label: '华金证券-链融科技雅居乐供应链1-18号资产支持专项计划', value: 'yjl-1', headquarters: '雅居乐地产控股有限公司' },
      {
        label: '国信证券-链融科技供应链金融第1-10期资产支持专项计划',
        value: 'jd-1',
        headquarters: '金地（集团）股份有限公司',
      },
      {
        label: '国信证券-链融科技供应链金融第11-30期资产支持专项计划 ',
        value: 'jd-2',
        headquarters: '金地（集团）股份有限公司',
      },
      {
        label: 'longguang证券-链融科技供应链金融第1-10期资产支持专项计划',
        value: 'lg-1',
        headquarters: '深圳市龙光控股有限公司',
      },
    ] as SelectItemsModel[],
    // 储架
    storageRackDragon: [
      {
        label: '长城荣耀-供应链金融1-15期资产支持专项计划',
        value: 'lg-2',
        headquarters: '深圳市龙光控股有限公司',
      },
      // { label: '中山光耀-链融科技1-24期资产支持专项计划', value: 'lg-3', headquarters: '深圳市龙光控股有限公司' },
    ] as SelectItemsModel[],
    // 雅居乐-星顺储架
    storageRackNewAgile: [
      {
        label: '华金证券-链融科技雅居乐供应链1-18号资产支持专项计划',
        value: 'yjl-1',
        headquarters: '雅居乐集团控股有限公司',
      },
    ] as SelectItemsModel[],
    // 标准保理
    StandardFactoringMode: [
      {
        label: '标准保理（金地）',
        value: '14',
        children: [
          { label: '保理商预录入', value: '1' },
          { label: '供应商上传资料并签署合同', value: '2' },
          { label: '保理商审核', value: '3' },
          { label: '项目公司确认应收账款金额', value: '4' },
          // {label: '集团公司签署付款确认书', value: '5'},
          { label: '保理商签署合同', value: '5' },
          { label: '交易完成', value: '6' },
          { label: '终止', value: '8' },
        ],
      },
      {
        label: '房地产供应链标准保理',
        value: '6',
        children: [
          { label: '保理商预录入', value: '1' },
          { label: '供应商上传资料并签署合同', value: '2' },
          { label: '保理商审核并签署合同', value: '3' },
          { label: '交易完成', value: '4' },
          { label: '终止', value: '8' },
        ],
      },
    ] as SelectItemsModel[],
    // 新万科标准保理
    StandardFactoringMode_vk: [
      {
        label: '龙光模式',
        value: 52,
        children: [
          { label: '交易未开始', value: 0 },
          { label: '保理商预录入', value: 101 },
          { label: '供应商上传资料', value: 102 },
          { label: '平台审核', value: 103 },
          { label: '供应商签署合同', value: 104 },
          // { label: '待审批', value: 5 },
          // { label: '审批中', value: 6 },
          // { label: '保理商签署合同', value: 7 },
          // { label: '待放款', value: 8 },
          // { label: '已放款', value: 9 },
          // { label: '已回款', value: 10 },
          { label: '中止', value: 99 },
        ],
      },
      {
        // 保理商预录入，供应商上传资料，平台审核，风险审查，供应商签署合同，待审批，审批中，保理商签署合同，待放款，已放款，已回款
        label: '万科模式',
        value: 53,
        children: [
          { label: '交易未开始', value: 0 },
          { label: '保理预录入', value: 201 },
          { label: '供应商上传资料', value: 202 },
          { label: '平台审核', value: 203 },
          { label: '保理商风险审核', value: 204 },
          { label: '供应商签署合同', value: 205 },
          { label: '保理商回传合同', value: 206 },
          { label: '中止', value: 99 },
        ],
      },
    ] as SelectItemsModel[],
    // 开票管理交易状态
    invoiceTransactionStatus: [
      {
        label: '龙光模式',
        value: 52,
        children: [
          { label: '待审批正常业务', value: 1 },
          { label: '审批中', value: 2 },
          { label: '待签署合同', value: 3 },
          { label: '待放款', value: 4 },
          { label: '已放款', value: 5 },
          { label: '已回款', value: 6 },
          { label: '待审批特殊业务', value: 10 },
        ],
      },
      {
        label: '万科模式',
        value: 53,
        children: [
          { label: '待审批正常业务', value: 1 },
          { label: '审批中', value: 2 },
          { label: '待签署合同', value: 3 },
          { label: '待放款', value: 4 },
          { label: '已放款', value: 5 },
          { label: '已回款', value: 6 },
          { label: '待审批特殊业务', value: 10 },
        ],
      },
      {
        label: '华侨城模式',
        value: 55,
        children: [
          { label: '保理预录入', value: 'oct_financing_pre' },
          { label: '供应商上传资料', value: 'oct_financing' },
          { label: '平台审核', value: 'oct_platform_verify' },
          { label: '保理商风险审核', value: 'oct_factoring_risk' },
          { label: '供应商签署合同', value: 'oct_financing_sign' },
          { label: '保理商回传合同', value: 'oct_factoring_passback' },
          { label: '待审批', value: 'wait_verification_500' },
          { label: '审批中', value: 'verificating_500' },
          { label: '保理商签署合同', value: 'factoring_sign_500' },
          { label: '待财务审批', value: 'wait_finance_500' },
          { label: '待放款', value: 'wait_loan_500' },
          { label: '已放款', value: 'loaded_500' },
          { label: '已回款', value: 'repayment_500' },
        ],
      },
    ] as SelectItemsModel[],
    // 开票管理龙光模式
    dragonType: [
      { label: '交易未开始', value: 0 },
      { label: '保理商预录入', value: 101 },
      { label: '供应商上传资料', value: 102 },
      { label: '平台审核', value: 103 },
      { label: '供应商签署合同', value: 104 },
      // { label: '待审批', value: 5 },
      // { label: '审批中', value: 6 },
      // { label: '保理商签署合同', value: 7 },
      // { label: '待放款', value: 8 },
      // { label: '已放款', value: 9 },
      // { label: '已回款', value: 10 },
      { label: '中止', value: 99 },
    ] as SelectItemsModel[],
    // 开票管理-交易状态（审批放款）
    approvalLoanStatus: [
      { label: '待审批正常业务', value: 1 },
      { label: '审批中', value: 2 },
      { label: '待签署合同', value: 3 },
      { label: '待放款', value: 4 },
      { label: '已放款', value: 5 },
      { label: '已回款', value: 6 },
      { label: '待审批特殊业务', value: 10 },
    ] as SelectItemsModel[],
    // 新万科模式
    newVankeType: [
      { label: '交易未开始', value: 0 },
      { label: '保理预录入', value: 201 },
      { label: '供应商上传资料', value: 202 },
      { label: '平台审核', value: 203 },
      { label: '保理商风险审核', value: 204 },
      { label: '供应商签署合同', value: 205 },
      { label: '保理商回传合同', value: 206 },
      { label: '中止', value: 99 },
    ] as SelectItemsModel[],

    currentStep: [
      { label: '待审批', value: 'wait_verification_500' },
      { label: '审批中', value: 'verificating_500' },
      { label: '保理商签署合同', value: 'factoring_sign_500' },
      { label: '待放款', value: 'wait_loan_500' },
      { label: '已放款', value: 'loaded_500' },
      { label: '已回款', value: 'repayment_500' },
      { label: '预保理商录入', value: 'dragon_financing_pre' },
      { label: '供应商上传资料', value: 'dragon_financing' },
      { label: '平台审核', value: 'dragon_platform_verify' },
      { label: '供应商签署合同', value: 'dragon_supplier_sign' },
      { label: '保理商预录入', value: 'vanke_financing_pre' },
      { label: '供应商上传资料', value: 'vanke_financing' },
      { label: '平台审核', value: 'vanke_platform_verify' },
      { label: '保理商风险审核', value: 'vanke_factoring_risk' },
      { label: '供应商签署合同', value: 'vanke_financing_sign' },
      { label: '保理商回传合同', value: 'vanke_factoring_passback' },
      { label: '保理商预录入', value: 'oct_financing_pre' },
      { label: '供应商上传资料', value: 'oct_financing' },
      { label: '平台审核', value: 'oct_platform_verify' },
      { label: '保理商风险审核', value: 'oct_factoring_risk' },
      { label: '供应商签署合同', value: 'oct_financing_sign' },
      { label: '保理商回传合同', value: 'oct_factoring_passback' },
      { label: '中止', value: 99 },
      { label: '退单', value: 100 },
      { label: '待财务审批', value: 'wait_finance_500' },
      { label: '保理商预录入', value: 'vanke_abs_step_financing_pre' },
      { label: '供应商上传资料', value: 'vanke_abs_step_financing' },
      { label: '平台初审', value: 'vanke_abs_step_platform_verify_operate' },
      { label: '平台复核', value: 'vanke_abs_step_platform_verify_review' },
      { label: '保理商风险审核', value: 'vanke_abs_step_factoring_risk' },
      { label: '供应商签署合同', value: 'vanke_abs_step_financing_sign' },
      { label: '保理商回传合同', value: 'vanke_abs_step_factoring_passback' },
      { label: '预保理商录入', value: 'cdr_financing_pre' },
      { label: '供应商上传资料', value: 'cdr_financing' },
      { label: '平台审核', value: 'cdr_platform_verify' },
      { label: '供应商签署合同', value: 'cdr_supplier_sign' },
      { label: '保理商风险审核', value: 'cdr_factoring_risk' },
      { label: '保理商回传合同', value: 'cdr_factoring_passback' },
    ] as SelectItemsModel[],

    // 开票管理列表-开票状态
    invoiceStatus_vk: [
      { label: '未开票', value: '1' },
      { label: '已开票', value: '2' },
      { label: '开票中', value: '3' },
      { label: '开票失败', value: '4' },
      { label: '作废中', value: '5' },
      { label: '作废', value: '6' },
    ] as SelectItemsModel[],
    nuonuoStatus: [
      { label: '未开票', value: 0 },
      { label: '开票成功', value: 1 },
      { label: '开票失败', value: 2 },
      { label: '开票中', value: 3 },
      { label: '作废成功', value: 4 },
      { label: '作废失败', value: 5 },
      { label: '作废中', value: 6 },
    ] as SelectItemsModel[],
    // 发票管理列表-发票状态-查询条件
    invoiceStatus: [
      { label: '人工验证', value: '1' },
      { label: '验证成功', value: '3' },
    ] as SelectItemsModel[],
    // 项目管理-业务类型 新万科 查看文件合同类型
    vankeContracttype: [
      { label: '无类型', value: '0' },
      { label: '工程', value: '1' },
      { label: '贸易', value: '2' },
      { label: '设计', value: '3' },
      { label: '监理', value: '4' },
      { label: '服务', value: '5' },
      { label: '集采线上订单', value: '6' },
    ] as SelectItemsModel[],
    // 注册审核状态
    registerStatus: [
      { label: '无效', value: 0 },
      { label: '申请', value: 1 },
      { label: '审核通过', value: 2 },
    ] as SelectItemsModel[],
    // 雅居乐补充协议状态
    supplementaryAgreementStatus: [
      { label: '保理商未签署补充协议', value: 21 },
      { label: '保理商已签署、供应商未签署', value: 23 },
      { label: '供应商已签署补充协议', value: 24 },
    ] as SelectItemsModel[],
    // 雅居乐重签列表，是否已重签
    yjlIsResignStatus: [
      { label: '是', value: 13 },
      { label: '否', value: [0, 1, 11, 12, 19, 21, 22, 23, 24, 29] },
    ] as SelectItemsModel[],
    // 平台角色，客户管理万科供应商保理业务搜索项
    goMeetingQuestion: [
      { label: '非准入', value: 2 },
      { label: '准入', value: 1 },
      { label: '未过会', value: 0 },
    ] as SelectItemsModel[],
    // 供應商類型
    companyType: [
      { label: '强供应商', value: 1 },
      { label: '普通供应商', value: 0 },
    ] as SelectItemsModel[],
    // 付确信息比对结果
    CompareStatus: [
      { label: '人工匹配', value: 1 },
      { label: '未匹配', value: 0 },
      { label: 'ocr匹配', value: 2 },
    ] as SelectItemsModel[],
    // 白名單類型
    whiteNameStatus: [
      { label: '人工白名单', value: 2 },
      { label: '非白名单', value: 0 },
      { label: '系统白名单', value: 1 },
    ] as SelectItemsModel[],
    // 白名單類型（企业调整里面使用）
    whiteNameStatusForOrg: [
      { label: '人工白名单', value: 2 },
      { label: '非白名单', value: 0 },
    ] as SelectItemsModel[],
    // 确权凭证
    evidence: [
      { label: '商票', value: 1 },
      { label: '付款确认书', value: 2 },
    ] as SelectItemsModel[],
    // 还款方
    payBackPoint: [
      { label: '万科供应商', value: 1 },
      { label: '上游客户', value: 2 },
    ] as SelectItemsModel[],
    // 缴付方
    payCompany: [
      { label: '万科供应商', value: 1 },
      { label: '上游客户', value: 2 },
    ] as SelectItemsModel[],
    // 平台履约证明上传方
    platowner: [
      { label: '万科供应商', value: 1 },
      { label: '上游客户', value: 0 },
    ] as SelectItemsModel[],
    // 保理类型
    FactoringOneType: [
      { label: '公开型保理', value: 1 },
      { label: '隐蔽型保理', value: 2 },
    ] as SelectItemsModel[],
    FactoringTwoType: [
      { label: '有追索权保理', value: 1 },
      { label: '无追索权保理', value: 2 },
    ] as SelectItemsModel[],
    Earlywarningstate: [
      { label: '预警', value: 1 },
      { label: '终止', value: 2 },
    ] as SelectItemsModel[],

    // 自查结论
    CheckForm: [
      { label: '维持', value: '1' },
      { label: '待条件维持', value: '2' },
      { label: '退出', value: '3' },
    ] as SelectItemsModel[],
    /** 台账履约证明状态 */
    EnumPerformanceStatus: [
      { label: '否', value: 0 },
      { label: '是', value: 2 },
    ] as SelectItemsModel[],
    level_classification: [
      { label: '正常', value: '1' },
      { label: '关注', value: '2' },
      { label: '次级', value: '3' },
      { label: '损失', value: '4' },
    ] as SelectItemsModel[],
    warning_result: [
      { label: '保持预警', value: '1' },
      { label: '取消预警', value: '2' },
    ] as SelectItemsModel[],
    // 采购融资即万科供应商保理业务 todo 暂时，需要改动value值
    avengerTransactionStatus: [
      { label: '供应商发起融资', value: '1' },
      { label: '上游客户上传资料', value: '2' },
      { label: '资料审核', value: '3' },
      { label: '风险审核', value: '4' },
      { label: '供应商签署合同', value: '5' },
      { label: '上游客户签署合同', value: '6' },
      { label: '待审批', value: '7' },
      { label: '审批中', value: '8' },
      { label: '保理商签署合同', value: '9' },
      { label: '待放款', value: '10' },
      { label: '已放款', value: '11' },
      { label: '已回款', value: '12' },
    ] as SelectItemsModel[],
    // 采购融资即万科供应商保理业务 todo 暂时，需要改动value值
    avengerTranactionSignStatus: [
      { label: '供应商签署合作协议', value: '1' },
      { label: '保理商上传线下协议', value: '2' },
      { label: '平台签署合同', value: '3' },
      { label: '已完成', value: '4' },
    ] as SelectItemsModel[],
    approvalstatus: [
      { label: '同意', value: 1 },
      { label: '否决', value: 2 },
    ] as SelectItemsModel[],
    // 已放款界面是否需要退款
    IsbackMoney: [
      { label: '是', value: 1 },
      { label: '否', value: 0 },
    ] as SelectItemsModel[],
    approvalMethod: [
      { label: '金蝶云审批', value: 0 },
      { label: '线下人工', value: 1 },
    ] as SelectItemsModel[],
    // 审批放款的业务类型
    taskType: [
      { label: '万科模式', value: 53 },
      { label: '普惠通模式', value: 50 },
      { label: '龙光模式', value: 52 },
    ] as SelectItemsModel[],
    // 上传付款确认书匹配方式
    qrsMatchMethod: [
      { label: '没有匹配', value: 0 },
      { label: '人工匹配', value: 1 },
      { label: 'ocr匹配', value: 2 },
    ] as SelectItemsModel[],

    moneyType: [
      {
        label: '商品类',
        value: '1',
        children: [
          {
            label: '土建材料',
            value: '1',
            children: [
              { label: '涂料', value: '1' },
              { label: '防水材料', value: '2' },
              { label: '管材管建', value: '3' },
              { label: '粘结剂', value: '4' },
              { label: '锁具', value: '5' },
              { label: '门窗工程', value: '6' },
              { label: '保温工程', value: '7' },
              { label: '栏杆工程', value: '8' },
              { label: '屋面瓦', value: '9' },
              { label: 'PC构件', value: '10' },
              { label: '门窗/幕墙型材', value: '11' },
              { label: '入户门', value: '12' },
              { label: '填缝剂', value: '13' },
            ],
          },
          {
            label: '装饰材料',
            value: '2',
            children: [
              { label: '洁具五金', value: '1' },
              { label: '瓷砖', value: '2' },
              { label: '室内灯具', value: '3' },
              { label: '淋浴屏', value: '4' },
              { label: '内外墙石材', value: '5' },
              { label: '装修辅材', value: '6' },
              { label: '集成吊顶', value: '7' },
              { label: '木地板', value: '8' },
              { label: '开关插座', value: '9' },
              { label: '户内门', value: '10' },
              { label: '壁纸', value: '11' },
              { label: '软装', value: '12' },
              { label: '整体卫浴', value: '13' },
              { label: '外墙装饰', value: '14' },
              { label: '台面石', value: '15' },
              { label: '覆膜材料', value: '16' },
              { label: '全屋柜体', value: '17' },
            ],
          },
          {
            label: '机械设备',
            value: '3',
            children: [
              { label: '空调设备', value: '1' },
              { label: '智能化设备', value: '2' },
              { label: '阀门', value: '3' },
              { label: '户内弱电箱', value: '4' },
              { label: '立体车库', value: '5' },
              { label: '消防设备', value: '6' },
              { label: '发电机组', value: '7' },
              { label: '对讲设备', value: '8' },
              { label: '电梯', value: '9' },
              { label: '电线电缆', value: '10' },
              { label: '能源管理设备', value: '11' },
              { label: '新风系统', value: '12' },
              { label: '水泵', value: '13' },
              { label: '变压器', value: '14' },
              { label: '抵押配电', value: '15' },
              { label: '智能水表', value: '16' },
              { label: '智能电表', value: '17' },
              { label: '充电桩', value: '18' },
            ],
          },
          {
            label: '电器',
            value: '4',
            children: [
              { label: '热水器', value: '1' },
              { label: '浴霸', value: '2' },
              { label: '采暖炉', value: '3' },
              { label: '厨房电器', value: '4' },
              { label: '净水器', value: '5' },
              { label: '家用电器', value: '6' },
              { label: '散热器', value: '7' },
              { label: '排气扇', value: '8' },
            ],
          },
          {
            label: '室外景观',
            value: '5',
            children: [
              { label: '景观布品', value: '1' },
              { label: '交通标识', value: '2' },
              { label: '室外灯具', value: '3' },
              { label: '游乐设施', value: '4' },
              { label: '信报箱', value: '5' },
              { label: '健身器材', value: '6' },
            ],
          },
        ],
      },
      {
        label: '服务类',
        value: '2',
        children: [
          {
            label: '服务',
            value: '1',
            children: [{ label: '服务', value: '1' }],
          },
        ],
      },
      {
        label: '出租资产类',
        value: '3',
        children: [
          {
            label: '出租资产',
            value: '1',
            children: [{ label: '出租资产', value: '1' }],
          },
        ],
      },
      {
        label: '工程类',
        value: '4',
        children: [
          {
            label: '工程类',
            value: '1',
            children: [{ label: '工程类', value: '1' }],
          },
        ],
      },
      {
        label: '其他',
        value: '5',
        children: [
          {
            label: '其他',
            value: '1',
            children: [{ label: '其他', value: '1' }],
          },
        ],
      },
    ] as SelectItemsModel[],
    // 履约证明
    Certificateperformance: [
      { label: '订单', value: '1' },
      { label: '仓单', value: '2' },
      { label: '运单', value: '3' },
      { label: '验收单', value: '4' },
      { label: '其他', value: '5' },
    ] as SelectItemsModel[],
    // 龙光 查看文件合同类型
    dragonContracttype: [
      { label: '无类型', value: '0' },
      { label: '工程', value: '1' },
      { label: '贸易', value: '2' },
      { label: '设计', value: '3' },
      { label: '监理', value: '4' },
      { label: '服务', value: '5' },
      { label: '集采线上订单', value: '6' },
    ] as SelectItemsModel[],
    zhongdengStatus: [
      { label: '未登记', value: 0 },
      { label: '登记中', value: 1 },
      { label: '登记失败', value: 2 },
      { label: '登记完成', value: 3 },
    ] as SelectItemsModel[],
    zhongdengSearchStatus: [
      { label: '登记中', value: 1 },
      { label: '登记失败', value: 2 },
      { label: '登记完成', value: 3 },
      { label: '撤销登记', value: 4 },
    ] as SelectItemsModel[],
    zhongdengCompanyType: [
      // { label: '金融机构', value: 1 },
      { label: '企业', value: 2 },
      { label: '机关事业单位', value: 3 },
      // { label: '个人', value: 4 },
      // { label: '个体工商户', value: 5 },
      // { label: '其他', value: 6 }
    ] as SelectItemsModel[],
    zhongDengInvoiceType: [
      { label: '特殊类型', value: 'specialType' },
      { label: '发票', value: 'invoiceNo' },
      { label: '合同编号', value: 'contractNo' },
      { label: '合同名称', value: 'contractName' },
      { label: '债务人', value: 'debtor' },
      { label: '无法识别', value: 'other' },
    ] as SelectItemsModel[],

    zhongDengTransaction: [
      { label: '应收账款转让', value: '应收账款转让' },
      { label: '融资租赁', value: '融资租赁' },
      { label: '应收账款质押', value: '应收账款质押' },
      {
        label: '生产设备、原材料、半成品、产品抵押',
        value: '生产设备、原材料、半成品、产品抵押',
      },
      { label: '存款单、仓单、提单质押', value: '存款单、仓单、提单质押' },
      { label: '所有权保留', value: '所有权保留' },
      { label: '保证金质押', value: '保证金质押' },
      { label: '存货质押', value: '存货质押' },
      { label: '留置权', value: '留置权' },
      { label: '动产信托', value: '动产信托' },
      { label: '其他动产权利担保', value: '其他动产权利担保' },
    ] as SelectItemsModel[],
    isLawOfficeCheck: [
      { label: '未抽查', value: 0 },
      { label: '已抽查', value: 1 },
    ] as SelectItemsModel[],
    tradeStatus: [
      { label: '交易未开始', value: 0 },
      { label: '保理预录入', value: 101 },
      { label: '供应商上传资料', value: 102 },
      { label: '平台审核', value: 103 },
      { label: '供应商签署合同', value: 104 },
      { label: '中止', value: 99 },
    ] as SelectItemsModel[],
    // 龙光 产品类型
    productType: [
      { label: 'ABS', value: '1' },
      { label: '再保理', value: '2' },
      // { label: '光大再保理', value: '2' },
      // { label: '农行再保理', value: '3' },
      // { label: '邮储再保理', value: '4' },
    ] as SelectItemsModel[],
    // 台账万科产品类型
    vankeMachineproType: [
      { label: 'ABS', value: 1 },
      { label: '再保理', value: 2 },
      { label: '非标', value: 99 },
    ] as SelectItemsModel[],
    vankeDockingInfo: [
      { label: '资产转让折扣率', value: 1 },
    ] as SelectItemsModel[],
    verifyStatus: [
      { label: '成功', value: 1 },
      { label: '失败', value: 2 },
    ] as SelectItemsModel[],
    isSponsor: [
      { label: '否', value: 0 },
      { label: '是', value: 1 },
    ] as SelectItemsModel[],
    verifyPayConfimStatus: [
      { label: '未下载', value: 0 },
      { label: '已下载', value: 1 },
    ] as SelectItemsModel[],
    payConfimDownload: [
      { label: '下载失败', value: 0 },
      { label: '下载成功', value: 1 },
    ] as SelectItemsModel[],
    pdfProjectResult: [
      { label: '一致', value: 1 },
      { label: '不一致', value: 2 },
    ] as SelectItemsModel[],
    // 银行卡列表---总行
    headBank: [
      { label: 'CIPS专用银行', value: 'CIPS专用银行' },
      { label: '（澳门地区）银行', value: '（澳门地区）银行' },
      { label: '（台湾省）银行', value: '（台湾省）银行' },
      { label: '（香港地区）银行', value: '（香港地区）银行' },
      {
        label: '鞍山市商业银行股份有限公司',
        value: '鞍山市商业银行股份有限公司',
      },
      {
        label: '安徽省农村信用联社资金清算中心',
        value: '安徽省农村信用联社资金清算中心',
      },
      { label: '奥地利中央合作银行', value: '奥地利中央合作银行' },
      {
        label: '澳大利亚澳洲联邦银行公众股份有限公司',
        value: '澳大利亚澳洲联邦银行公众股份有限公司',
      },
      { label: '澳大利亚和新西兰银行集团', value: '澳大利亚和新西兰银行集团' },
      {
        label: '澳大利亚西太平洋银行有限公司',
        value: '澳大利亚西太平洋银行有限公司',
      },
      { label: '包商银行', value: '包商银行' },
      { label: '保定银行', value: '保定银行' },
      { label: '北京农村商业银行', value: '北京农村商业银行' },
      { label: '北京银行', value: '北京银行' },
      { label: '本溪市商业银行', value: '本溪市商业银行' },
      { label: '比利时联合银行', value: '比利时联合银行' },
      { label: '渤海银行', value: '渤海银行' },
      { label: '财付通', value: '财付通' },
      { label: '财务公司', value: '财务公司' },
      { label: '沧州银行股份有限公司', value: '沧州银行股份有限公司' },
      { label: '长安银行股份有限公司', value: '长安银行股份有限公司' },
      { label: '长沙银行', value: '长沙银行' },
      { label: '长治市商业银行', value: '长治市商业银行' },
      { label: '朝阳银行股份有限公司', value: '朝阳银行股份有限公司' },
      { label: '城市商业银行', value: '城市商业银行' },
      { label: '城市商业银行资金清算中心', value: '城市商业银行资金清算中心' },
      { label: '城市信用社', value: '城市信用社' },
      { label: '成都农商银行', value: '成都农商银行' },
      { label: '成都市商业银行(成都银行)', value: '成都市商业银行(成都银行)' },
      { label: '承德银行股份有限公司', value: '承德银行股份有限公司' },
      { label: '创兴银行有限公司', value: '创兴银行有限公司' },
      { label: '村镇银行', value: '村镇银行' },
      { label: '达州市商业银行', value: '达州市商业银行' },
      { label: '大华银行（中国）有限公司', value: '大华银行（中国）有限公司' },
      {
        label: '大连农村商业银行股份有限公司',
        value: '大连农村商业银行股份有限公司',
      },
      { label: '大连银行', value: '大连银行' },
      { label: '大同市商业银行', value: '大同市商业银行' },
      { label: '大新银行（中国）有限公司', value: '大新银行（中国）有限公司' },
      { label: '丹东银行股份有限公司', value: '丹东银行股份有限公司' },
      { label: '德国北德意志州银行', value: '德国北德意志州银行' },
      { label: '德国商业银行', value: '德国商业银行' },
      { label: '德阳银行股份有限公司', value: '德阳银行股份有限公司' },
      { label: '德意志银行', value: '德意志银行' },
      { label: '德州银行', value: '德州银行' },
      { label: '第一商业银行股份有限公司', value: '第一商业银行股份有限公司' },
      { label: '电子商业汇票系统处理中心', value: '电子商业汇票系统处理中心' },
      { label: '东亚银行', value: '东亚银行' },
      { label: '东营银行股份有限公司', value: '东营银行股份有限公司' },
      {
        label: '东莞农村商业银行股份有限公司',
        value: '东莞农村商业银行股份有限公司',
      },
      { label: '东莞银行', value: '东莞银行' },
      { label: '鄂尔多斯银行股份有限公司', value: '鄂尔多斯银行股份有限公司' },
      { label: '法国巴黎银行（中国）', value: '法国巴黎银行（中国）' },
      { label: '法国东方汇理银行', value: '法国东方汇理银行' },
      { label: '法国外贸银行股份有限公司', value: '法国外贸银行股份有限公司' },
      { label: '法国兴业银行', value: '法国兴业银行' },
      { label: '福建省农村信用社联合社', value: '福建省农村信用社联合社' },
      { label: '福州市商业银行', value: '福州市商业银行' },
      { label: '抚顺银行股份有限公司', value: '抚顺银行股份有限公司' },
      { label: '阜新银行', value: '阜新银行' },
      { label: '富滇银行', value: '富滇银行' },
      { label: '甘肃银行股份有限公司', value: '甘肃银行股份有限公司' },
      { label: '赣州银行股份有限公司', value: '赣州银行股份有限公司' },
      { label: '公开市场业务操作室', value: '公开市场业务操作室' },
      { label: '广东发展银行', value: '广东发展银行' },
      { label: '广东华兴银行股份有限公司', value: '广东华兴银行股份有限公司' },
      { label: '广东南粤银行股份有限公司', value: '广东南粤银行股份有限公司' },
      { label: '广西北部湾银行', value: '广西北部湾银行' },
      {
        label: '广西壮族自治区农村信用社联合社',
        value: '广西壮族自治区农村信用社联合社',
      },
      {
        label: '广州农村商业银行股份有限公司',
        value: '广州农村商业银行股份有限公司',
      },
      { label: '广州银行', value: '广州银行' },
      { label: '桂林银行股份有限公司', value: '桂林银行股份有限公司' },
      { label: '贵阳市商业银行', value: '贵阳市商业银行' },
      { label: '贵州银行股份有限公司', value: '贵州银行股份有限公司' },
      { label: '国家金库', value: '国家金库' },
      { label: '国家开发银行', value: '国家开发银行' },
      { label: '国民银行（中国）有限公司', value: '国民银行（中国）有限公司' },
      { label: '哈尔滨银行', value: '哈尔滨银行' },
      { label: '哈密市商业银行', value: '哈密市商业银行' },
      {
        label: '海南省农村信用社联合社资金清算中心',
        value: '海南省农村信用社联合社资金清算中心',
      },
      { label: '邯郸银行股份有限公司', value: '邯郸银行股份有限公司' },
      { label: '韩国产业银行', value: '韩国产业银行' },
      { label: '韩国大邱银行股份有限公司', value: '韩国大邱银行股份有限公司' },
      { label: '韩国友利银行', value: '韩国友利银行' },
      { label: '韩国中小企业银行', value: '韩国中小企业银行' },
      { label: '韩亚银行(中国)有限公司', value: '韩亚银行(中国)有限公司' },
      { label: '汉口银行', value: '汉口银行' },
      { label: '杭州银行股份有限公司', value: '杭州银行股份有限公司' },
      { label: '荷兰合作银行有限公司', value: '荷兰合作银行有限公司' },
      { label: '荷兰商业银行', value: '荷兰商业银行' },
      { label: '合肥科技农村商业银行', value: '合肥科技农村商业银行' },
      { label: '河北省农村信用社联合社', value: '河北省农村信用社联合社' },
      { label: '河北银行股份有限公司', value: '河北银行股份有限公司' },
      { label: '河南省农村信用社', value: '河南省农村信用社' },
      { label: '衡水市商业银行', value: '衡水市商业银行' },
      { label: '恒丰银行', value: '恒丰银行' },
      { label: '恒生银行', value: '恒生银行' },
      { label: '葫芦岛银行股份有限公司', value: '葫芦岛银行股份有限公司' },
      {
        label: '湖北省农村信用社联合社结算中心',
        value: '湖北省农村信用社联合社结算中心',
      },
      { label: '湖北银行股份有限公司', value: '湖北银行股份有限公司' },
      { label: '湖南省农村信用社联合社', value: '湖南省农村信用社联合社' },
      { label: '湖州银行股份有限公司', value: '湖州银行股份有限公司' },
      { label: '华美银行', value: '华美银行' },
      { label: '华南商业银行', value: '华南商业银行' },
      { label: '华融湘江银行', value: '华融湘江银行' },
      { label: '华商银行', value: '华商银行' },
      { label: '华夏银行', value: '华夏银行' },
      { label: '华一银行', value: '华一银行' },
      { label: '徽商银行', value: '徽商银行' },
      { label: '吉林省农村信用社联合社', value: '吉林省农村信用社联合社' },
      { label: '吉林银行股份有限公司', value: '吉林银行股份有限公司' },
      { label: '集友银行', value: '集友银行' },
      { label: '济宁银行股份有限公司', value: '济宁银行股份有限公司' },
      { label: '嘉兴银行股份有限公司', value: '嘉兴银行股份有限公司' },
      { label: '加拿大丰业银行', value: '加拿大丰业银行' },
      { label: '加拿大蒙特利尔银行', value: '加拿大蒙特利尔银行' },
      {
        label: '江苏常熟农村商业银行股份有限公司',
        value: '江苏常熟农村商业银行股份有限公司',
      },
      {
        label: '江苏江阴农村商业银行股份有限公司',
        value: '江苏江阴农村商业银行股份有限公司',
      },
      {
        label: '江苏省农村信用社联合社信息结算中心',
        value: '江苏省农村信用社联合社信息结算中心',
      },
      {
        label: '江苏泰州农村商业银行股份有限公司',
        value: '江苏泰州农村商业银行股份有限公司',
      },
      { label: '江苏银行股份有限公司', value: '江苏银行股份有限公司' },
      {
        label: '江苏紫金农村商业银行股份有限公司',
        value: '江苏紫金农村商业银行股份有限公司',
      },
      { label: '江西省农村信用社联合社', value: '江西省农村信用社联合社' },
      { label: '江西银行股份有限公司', value: '江西银行股份有限公司' },
      { label: '焦作市商业银行', value: '焦作市商业银行' },
      { label: '交通银行', value: '交通银行' },
      { label: '金华银行股份有限公司', value: '金华银行股份有限公司' },
      { label: '锦州银行股份有限公司', value: '锦州银行股份有限公司' },
      { label: '晋城银行股份有限公司', value: '晋城银行股份有限公司' },
      { label: '晋商银行股份有限公司', value: '晋商银行股份有限公司' },
      { label: '晋中市商业银行', value: '晋中市商业银行' },
      { label: '九江银行股份有限公司', value: '九江银行股份有限公司' },
      { label: '库尔勒市商业银行', value: '库尔勒市商业银行' },
      { label: '昆仑银行股份有限公司', value: '昆仑银行股份有限公司' },
      { label: '昆山农村商业银行', value: '昆山农村商业银行' },
      { label: '莱商银行股份有限公司', value: '莱商银行股份有限公司' },
      { label: '兰州银行', value: '兰州银行' },
      { label: '廊坊银行股份有限公司', value: '廊坊银行股份有限公司' },
      { label: '乐山市商业银行', value: '乐山市商业银行' },
      { label: '联昌国际银行', value: '联昌国际银行' },
      { label: '辽阳银行股份有限公司', value: '辽阳银行股份有限公司' },
      { label: '临商银行', value: '临商银行' },
      { label: '柳州银行股份有限公司', value: '柳州银行股份有限公司' },
      { label: '龙江银行股份有限公司', value: '龙江银行股份有限公司' },
      { label: '洛阳市商业银行(洛阳银行)', value: '洛阳市商业银行(洛阳银行)' },
      {
        label: '马来西亚马来亚银行有限公司',
        value: '马来西亚马来亚银行有限公司',
      },
      { label: '美国花旗银行', value: '美国花旗银行' },
      { label: '美国建东银行', value: '美国建东银行' },
      { label: '美国摩根大通银行', value: '美国摩根大通银行' },
      { label: '美国银行', value: '美国银行' },
      { label: '绵阳市商业银行', value: '绵阳市商业银行' },
      {
        label: '摩根士丹利国际银行（中国）有限公司',
        value: '摩根士丹利国际银行（中国）有限公司',
      },
      { label: '南充市商业银行', value: '南充市商业银行' },
      { label: '南京银行股份有限公司', value: '南京银行股份有限公司' },
      { label: '南洋商业银行', value: '南洋商业银行' },
      { label: '内蒙古银行股份有限公司', value: '内蒙古银行股份有限公司' },
      { label: '宁波东海银行股份有限公司', value: '宁波东海银行股份有限公司' },
      { label: '宁波通商银行股份有限公司', value: '宁波通商银行股份有限公司' },
      { label: '宁波银行股份有限公司', value: '宁波银行股份有限公司' },
      { label: '宁波鄞州农村合作银行', value: '宁波鄞州农村合作银行' },
      {
        label: '宁夏黄河农村商业银行股份有限公司',
        value: '宁夏黄河农村商业银行股份有限公司',
      },
      { label: '宁夏银行', value: '宁夏银行' },
      { label: '农村合作银行', value: '农村合作银行' },
      { label: '农村商业银行', value: '农村商业银行' },
      { label: '农村信用联社', value: '农村信用联社' },
      { label: '攀枝花市商业银行', value: '攀枝花市商业银行' },
      { label: '盘锦市商业银行', value: '盘锦市商业银行' },
      { label: '平安银行', value: '平安银行' },
      { label: '平顶山银行股份有限公司', value: '平顶山银行股份有限公司' },
      { label: '浦发硅谷银行', value: '浦发硅谷银行' },
      { label: '其它实体银行', value: '其它实体银行' },
      { label: '齐鲁银行', value: '齐鲁银行' },
      { label: '齐商银行', value: '齐商银行' },
      { label: '秦皇岛市商业银行', value: '秦皇岛市商业银行' },
      { label: '青岛银行', value: '青岛银行' },
      { label: '青海银行股份有限公司', value: '青海银行股份有限公司' },
      { label: '曲靖市商业银行', value: '曲靖市商业银行' },
      {
        label: '泉州市商业银行股份有限公司',
        value: '泉州市商业银行股份有限公司',
      },
      { label: '日本瑞穗实业银行', value: '日本瑞穗实业银行' },
      { label: '日本三井住友银行', value: '日本三井住友银行' },
      { label: '日本三菱东京日联银行', value: '日本三菱东京日联银行' },
      { label: '日本山口银行', value: '日本山口银行' },
      { label: '日照银行股份有限公司', value: '日照银行股份有限公司' },
      { label: '瑞典北欧斯安银行', value: '瑞典北欧斯安银行' },
      { label: '瑞典商业银行', value: '瑞典商业银行' },
      { label: '瑞士信贷银行', value: '瑞士信贷银行' },
      { label: '瑞士银行（中国）有限公司', value: '瑞士银行（中国）有限公司' },
      { label: '山东省农村信用社联合社', value: '山东省农村信用社联合社' },
      { label: '上海华瑞银行股份有限公司', value: '上海华瑞银行股份有限公司' },
      { label: '上海农村商业银行', value: '上海农村商业银行' },
      { label: '上海浦东发展银行', value: '上海浦东发展银行' },
      { label: '上海银行股份有限公司', value: '上海银行股份有限公司' },
      { label: '上饶银行', value: '上饶银行' },
      { label: '绍兴银行股份有限公司', value: '绍兴银行股份有限公司' },
      { label: '深圳农村商业银行', value: '深圳农村商业银行' },
      { label: '深圳前海微众银行', value: '深圳前海微众银行' },
      { label: '盛京银行股份有限公司', value: '盛京银行股份有限公司' },
      { label: '石嘴山银行股份有限公司', value: '石嘴山银行股份有限公司' },
      { label: '首都银行', value: '首都银行' },
      { label: '苏州银行股份有限公司', value: '苏州银行股份有限公司' },
      { label: '遂宁市商业银行', value: '遂宁市商业银行' },
      { label: '台湾土地银行股份有限公司', value: '台湾土地银行股份有限公司' },
      { label: '台湾银行股份有限公司', value: '台湾银行股份有限公司' },
      { label: '台州银行股份有限公司', value: '台州银行股份有限公司' },
      { label: '泰安市商业银行', value: '泰安市商业银行' },
      {
        label: '泰国盘谷银行(大众有限公司)',
        value: '泰国盘谷银行(大众有限公司)',
      },
      { label: '唐山市商业银行', value: '唐山市商业银行' },
      {
        label: '天津滨海农村商业银行股份有限公司',
        value: '天津滨海农村商业银行股份有限公司',
      },
      { label: '天津金城银行股份有限公司', value: '天津金城银行股份有限公司' },
      {
        label: '天津农村商业银行股份有限公司',
        value: '天津农村商业银行股份有限公司',
      },
      { label: '天津银行', value: '天津银行' },
      { label: '铁岭银行股份有限公司', value: '铁岭银行股份有限公司' },
      { label: '网联清算有限公司', value: '网联清算有限公司' },
      { label: '威海市商业银行', value: '威海市商业银行' },
      { label: '微信支付', value: '微信支付' },
      { label: '潍坊银行股份有限公司', value: '潍坊银行股份有限公司' },
      { label: '温州民商银行股份有限公司', value: '温州民商银行股份有限公司' },
      { label: '温州银行', value: '温州银行' },
      { label: '乌海银行股份有限公司', value: '乌海银行股份有限公司' },
      { label: '乌鲁木齐市商业银行', value: '乌鲁木齐市商业银行' },
      { label: '无锡农村商业银行', value: '无锡农村商业银行' },
      { label: '吴江农村商业银行', value: '吴江农村商业银行' },
      { label: '武汉众邦银行', value: '武汉众邦银行' },
      { label: '西安市商业银行', value: '西安市商业银行' },
      { label: '西藏银行股份有限公司', value: '西藏银行股份有限公司' },
      { label: '厦门国际银行', value: '厦门国际银行' },
      { label: '厦门银行股份有限公司', value: '厦门银行股份有限公司' },
      { label: '香港上海汇丰银行', value: '香港上海汇丰银行' },
      { label: '新韩银行（中国）有限公司', value: '新韩银行（中国）有限公司' },
      { label: '新加坡星展银行', value: '新加坡星展银行' },
      { label: '新疆汇和银行股份有限公司', value: '新疆汇和银行股份有限公司' },
      {
        label: '新疆维吾尔自治区农村信用社联合社',
        value: '新疆维吾尔自治区农村信用社联合社',
      },
      { label: '新联商业银行', value: '新联商业银行' },
      { label: '星展银行(中国)有限公司', value: '星展银行(中国)有限公司' },
      { label: '兴业银行', value: '兴业银行' },
      { label: '邢台银行股份有限公司', value: '邢台银行股份有限公司' },
      { label: '虚拟银行', value: '虚拟银行' },
      { label: '雅安市商业银行', value: '雅安市商业银行' },
      { label: '阳泉市商业银行', value: '阳泉市商业银行' },
      { label: '宜宾市商业银行', value: '宜宾市商业银行' },
      {
        label: '意大利联合圣保罗银行股份有限公司',
        value: '意大利联合圣保罗银行股份有限公司',
      },
      { label: '银行电子结算中心', value: '银行电子结算中心' },
      { label: '银行间市场清算所', value: '银行间市场清算所' },
      {
        label: '印度尼西亚曼底利银行有限责任公司',
        value: '印度尼西亚曼底利银行有限责任公司',
      },
      { label: '营口沿海银行股份有限公司', value: '营口沿海银行股份有限公司' },
      { label: '营口银行股份有限公司', value: '营口银行股份有限公司' },
      { label: '永亨银行', value: '永亨银行' },
      { label: '玉山银行（中国）有限公司', value: '玉山银行（中国）有限公司' },
      { label: '玉溪市商业银行', value: '玉溪市商业银行' },
      { label: '云南省农村信用社联合社', value: '云南省农村信用社联合社' },
      { label: '枣庄市商业银行', value: '枣庄市商业银行' },
      { label: '渣打银行', value: '渣打银行' },
      { label: '彰化商业银行股份有限公司', value: '彰化商业银行股份有限公司' },
      { label: '张家港农村商业银行', value: '张家港农村商业银行' },
      { label: '张家口市商业银行', value: '张家口市商业银行' },
      { label: '招商银行', value: '招商银行' },
      {
        label: '兆丰国际商业银行股份有限公司',
        value: '兆丰国际商业银行股份有限公司',
      },
      { label: '浙江稠州商业银行', value: '浙江稠州商业银行' },
      { label: '浙江民泰商业银行', value: '浙江民泰商业银行' },
      { label: '浙江农村商业银行', value: '浙江农村商业银行' },
      { label: '浙江泰隆商业银行', value: '浙江泰隆商业银行' },
      { label: '浙江网商银行股份有限公司', value: '浙江网商银行股份有限公司' },
      { label: '浙商银行', value: '浙商银行' },
      { label: '郑州银行股份有限公司', value: '郑州银行股份有限公司' },
      { label: '支付宝', value: '支付宝' },
      { label: '支付业务收费专户', value: '支付业务收费专户' },
      { label: '中德住房储蓄银行', value: '中德住房储蓄银行' },
      { label: '中国工商银行', value: '中国工商银行' },
      { label: '中国光大银行', value: '中国光大银行' },
      { label: '中国建设银行', value: '中国建设银行' },
      { label: '中国进出口银行', value: '中国进出口银行' },
      { label: '中国民生银行', value: '中国民生银行' },
      { label: '中国农业发展银行', value: '中国农业发展银行' },
      { label: '中国农业银行', value: '中国农业银行' },
      { label: '中国人民银行', value: '中国人民银行' },
      { label: '中国外汇交易中心', value: '中国外汇交易中心' },
      {
        label: '中国信托商业银行股份有限公司',
        value: '中国信托商业银行股份有限公司',
      },
      { label: '中国银联股份有限公司', value: '中国银联股份有限公司' },
      { label: '中国银行', value: '中国银行' },
      {
        label: '中国邮政储蓄银行有限责任公司',
        value: '中国邮政储蓄银行有限责任公司',
      },
      { label: '中信银行', value: '中信银行' },
      {
        label: '中信银行国际（中国）有限公司',
        value: '中信银行国际（中国）有限公司',
      },
      { label: '中央结算公司', value: '中央结算公司' },
      { label: '中原银行', value: '中原银行' },
      {
        label: '重庆农村商业银行股份有限公司',
        value: '重庆农村商业银行股份有限公司',
      },
      { label: '重庆三峡银行股份有限公司', value: '重庆三峡银行股份有限公司' },
      { label: '重庆银行', value: '重庆银行' },
      { label: '珠海华润银行股份有限公司', value: '珠海华润银行股份有限公司' },
      { label: '自贡市商业银行', value: '自贡市商业银行' },
      { label: '遵义市商业银行', value: '遵义市商业银行' },
      { label: '泸州市商业银行', value: '泸州市商业银行' },
    ] as SelectItemsModel[],

    registerType: [
      { label: 'AR-应收账款', value: 1 },
      { label: 'LR-融资租赁', value: 2 },
      { label: 'BZ-保证金质押', value: 3 },
      { label: 'CH-存货\\仓单质押', value: 4 },
      { label: 'SY-所有权保留', value: 5 },
      { label: 'LZ-动产留置权', value: 6 },
      { label: 'XT-信托登记', value: 7 },
    ] as SelectItemsModel[],

    registerDays: [
      { label: '6个月', value: 6 },
      { label: '12个月', value: 12 },
      { label: '18个月', value: 18 },
      { label: '24个月', value: 24 },
    ] as SelectItemsModel[],
    // 新增中介账号
    addIntermediary: [
      { label: '律师事务所', value: 6 },
      { label: '会计师事务所', value: 12 },
      { label: '投资者', value: 18 },
      { label: '管理员', value: 24 },
      { label: '评级机构', value: 24 },
    ] as SelectItemsModel[],
    vankeAddIntermediary: [
      { label: '无', value: 0 },
      { label: '律师事务所', value: 1 },
      { label: '会计师事务所', value: 2 },
      { label: '投资者', value: 3 },
      { label: '计划管理人', value: 4 },
      { label: '评级机构', value: 5 },
    ] as SelectItemsModel[],
    // 冻结状态
    freezeStatus: [
      { label: '非冻结', value: 0 },
      { label: '冻结', value: 1 },
    ] as SelectItemsModel[],
    // 项目管理-冻结状态0表示未冻结 1表示已冻结
    freezingStatus: [
      { label: '未冻结', value: 0 },
      { label: '已冻结', value: 1 },
    ] as SelectItemsModel[],
    freezing: [
      { label: '未冻结', value: 0 },
      { label: '冻结一', value: 1 },
      { label: '冻结二', value: 2 },
      { label: '冻结三', value: 3 },
    ] as SelectItemsModel[],
    /** 买方确认函签章 */
    isSignBuyerStatus: [
      { label: '未签章', value: 0 },
      { label: '已签章', value: 1 },
    ] as SelectItemsModel[],
    /** 付款书电子签章 */
    isSignFlag: [
      { label: '未签章', value: 0 },
      { label: '已签章', value: 1 },
    ] as SelectItemsModel[],
    operateType: [
      { label: '移入', value: 1 },
      { label: '移出', value: 2 },
    ] as SelectItemsModel[],
    // 台账补充协议流程状态
    supplementaryAgreement: [
      { label: '无', value: 0 },
      { label: '供应商签署补充协议', value: 3 },
      { label: '项目公司签署补充协议', value: 4 },
      { label: '保理商签署补充协议', value: 5 },
    ] as SelectItemsModel[],
    // 新增万科模式新下拉枚举
    newVankeMachineAccountType: [
      {
        label: '万科模式(新)',
        value: 53,
        children: [
          { label: '保理预录入', value: 'vanke_financing_pre' },
          { label: '供应商上传资料', value: 'vanke_financing' },
          // { label: '平台审核(new)', value: 'vanke_platform_verify' },
          { label: '平台审核', value: '0' },
          {
            label: '平台初审',
            value: 'vanke_abs_step_platform_verify_operate',
          },
          { label: '平台复核', value: 'vanke_abs_step_platform_verify_review' },
          { label: '待万科修改', value: '1' },
          { label: '待万科受理', value: '2' },
          { label: '保理商风险审核', value: 'vanke_factoring_risk' },
          { label: '供应商签署合同', value: 'vanke_financing_sign' },
          { label: '保理商回传合同', value: 'vanke_factoring_passback' },
          { label: '待审批', value: 'wait_verification_500' },
          { label: '审批中', value: 'verificating_500' },
          { label: '保理商签署合同', value: 'factoring_sign_500' },
          { label: '待财务审批', value: 'wait_finance_500' },
          { label: '待放款', value: 'wait_loan_500' },
          { label: '已放款', value: 'loaded_500' },
          { label: '已回款', value: 'repayment_500' },
          { label: '中止', value: 99 },
          { label: '退单', value: 100 },
        ],
      },
      {
        label: '万科模式(旧)',
        value: 6,
        children: [],
      },
    ] as SelectItemsModel[],
    machineAccountType: [
      {
        label: '万科模式(新)',
        value: 53,
        children: [
          { label: '保理预录入', value: 'vanke_financing_pre' },
          { label: '供应商上传资料', value: 'vanke_financing' },
          { label: '平台审核', value: 'vanke_platform_verify' },
          { label: '保理商风险审核', value: 'vanke_factoring_risk' },
          { label: '供应商签署合同', value: 'vanke_financing_sign' },
          { label: '保理商回传合同', value: 'vanke_factoring_passback' },
          { label: '待审批', value: 'wait_verification_500' },
          { label: '审批中', value: 'verificating_500' },
          { label: '保理商签署合同', value: 'factoring_sign_500' },
          { label: '待财务审批', value: 'wait_finance_500' },
          { label: '待放款', value: 'wait_loan_500' },
          { label: '已放款', value: 'loaded_500' },
          { label: '已回款', value: 'repayment_500' },
          { label: '中止', value: 99 },
          { label: '退单', value: 100 },
        ],
      },
      {
        label: '万科模式(旧)',
        value: 6,
        children: [
          // { label: '保理商预录入', value: '1' },
          // { label: '供应商上传资料并签署合同', value: '2' },
          // { label: '保理商审核并签署合同', value: '3' },
          // { label: '交易完成', value: '4' },
          // { label: '终止', value: '8' },
        ],
      },
    ] as SelectItemsModel[],
    dragonListType: [
      {
        label: '龙光模式',
        value: 52,
        children: [
          { label: '保理商预录入', value: 101 },
          { label: '供应商上传资料', value: 102 },
          { label: '平台审核', value: 103 },
          { label: '供应商签署合同', value: 104 },
        ],
      },
      {
        label: '万科模式',
        value: 53,
        children: [
          { label: '保理预录入', value: 201 },
          { label: '供应商上传资料', value: 202 },
          { label: '平台审核', value: 203 },
          { label: '保理商风险审核', value: 204 },
          { label: '供应商签署合同', value: 205 },
          { label: '保理商回传合同', value: 206 },
          // { label: '中止', value: 99 },
        ],
      },
    ] as SelectItemsModel[],
    vankeTradeStatus: [
      // 拟入池列表-交易模式：万科
      { label: '保理预录入', value: 'vanke_financing_pre' },
      { label: '供应商上传资料', value: 'vanke_financing' },
      { label: '平台审核', value: 'vanke_platform_verify' },
      { label: '保理商风险审核', value: 'vanke_factoring_risk' },
      { label: '供应商签署合同', value: 'vanke_financing_sign' },
      { label: '保理商回传合同', value: 'vanke_factoring_passback' },
      { label: '待审批', value: 'wait_verification_500' },
      { label: '审批中', value: 'verificating_500' },
      { label: '保理商签署合同', value: 'factoring_sign_500' },
      { label: '待财务审批', value: 'wait_finance_500' },
      { label: '待放款', value: 'wait_loan_500' },
      { label: '已放款', value: 'loaded_500' },
      { label: '已回款', value: 'repayment_500' },
    ] as SelectItemsModel[],
    dragonTradeStatus: [
      // 拟入池列表-交易模式：龙光
      { label: '保理商预录入', value: 'dragon_financing_pre' },
      { label: '供应商上传资料', value: 'dragon_financing' },
      { label: '平台审核', value: 'dragon_platform_verify' },
      { label: '供应商签署合同', value: 'dragon_supplier_sign' },
      { label: '待审批', value: 'wait_verification_500' },
      { label: '审批中', value: 'verificating_500' },
      { label: '保理商签署合同', value: 'factoring_sign_500' },
      { label: '待财务审批', value: 'wait_finance_500' },
      { label: '待放款', value: 'wait_loan_500' },
      { label: '已放款', value: 'loaded_500' },
      { label: '已回款', value: 'repayment_500' },
      { label: '中止', value: 99 },
      { label: '退单', value: 100 },
    ] as SelectItemsModel[],
    countryGradenTradeStatus: [
      // 台账交易状态：碧桂园
      { label: '平台预录入', value: 'bgy_financing_pre' },
      { label: '供应商上传资料', value: 'bgy_financing' },
      { label: '平台审核', value: 'bgy_platform_verify' },
      { label: '保理商风险审核', value: 'bgy_factoring_risk' },
      { label: '供应商签署合同', value: 'bgy_financing_sign' },
      // { label: '保理商回传合同', value: 'bgy_factoring_passback' },
      { label: '待审批', value: 'wait_verification_500' },
      { label: '审批中', value: 'verificating_500' },
      { label: '保理商签署合同', value: 'factoring_sign_500' },
      { label: '待放款', value: 'wait_loan_500' },
      { label: '已放款', value: 'loaded_500' },
      { label: '已回款', value: 'repayment_500' },
      { label: '中止', value: 99 },
      { label: '退单', value: 100 },
    ] as SelectItemsModel[],
    countryListGradenTrade: [
      { label: '平台预录入', value: 'bgy_financing_pre' },
      { label: '供应商上传资料', value: 'bgy_financing' },
      { label: '平台审核', value: 'bgy_platform_verify' },
      { label: '保理商风险审核', value: 'bgy_factoring_risk' },
      { label: '供应商签署合同', value: 'bgy_financing_sign' },
      // { label: '保理商回传合同', value: 'bgy_factoring_passback' },
      { label: '待审批', value: 'wait_verification_500' },
      { label: '审批中', value: 'verificating_500' },
      { label: '保理商签署合同', value: 'factoring_sign_500' },
      { label: '待放款', value: 'wait_loan_500' },
      { label: '已放款', value: 'loaded_500' },
      { label: '已回款', value: 'repayment_500' },
    ] as SelectItemsModel[],

    dragonListTypesingle: [
      { label: '保理商预录入', value: 'dragon_financing_pre' },
      { label: '供应商上传资料', value: 'dragon_financing' },
      { label: '平台审核', value: 'dragon_platform_verify' },
      { label: '供应商签署合同', value: 'dragon_supplier_sign' },
      { label: '待审批', value: 'wait_verification_500' },
      { label: '审批中', value: 'verificating_500' },
      { label: '保理商签署合同', value: 'factoring_sign_500' },
      { label: '待财务审批', value: 'wait_finance_500' },
      { label: '待放款', value: 'wait_loan_500' },
      { label: '已放款', value: 'loaded_500' },
      { label: '已回款', value: 'repayment_500' },
    ] as SelectItemsModel[],
    vankeListTypesingle: [
      { label: '保理预录入', value: 'vanke_financing_pre' },
      { label: '供应商上传资料', value: 'vanke_financing' },
      { label: '平台审核', value: 'vanke_platform_verify' },
      { label: '保理商风险审核', value: 'vanke_factoring_risk' },
      { label: '供应商签署合同', value: 'vanke_financing_sign' },
      { label: '保理商回传合同', value: 'vanke_factoring_passback' },
      { label: '待审批', value: 'wait_verification_500' },
      { label: '审批中', value: 'verificating_500' },
      { label: '保理商签署合同', value: 'factoring_sign_500' },
      { label: '待财务审批', value: 'wait_finance_500' },
      { label: '待放款', value: 'wait_loan_500' },
      { label: '已放款', value: 'loaded_500' },
      { label: '已回款', value: 'repayment_500' },
    ] as SelectItemsModel[],
    huaqiaoCityListTypesingle: [
      { label: '保理预录入', value: 'oct_financing_pre' },
      { label: '供应商上传资料', value: 'oct_financing' },
      { label: '平台审核', value: 'oct_platform_verify' },
      { label: '保理商风险审核', value: 'oct_factoring_risk' },
      { label: '供应商签署合同', value: 'oct_financing_sign' },
      { label: '保理商回传合同', value: 'oct_factoring_passback' },
      { label: '待审批', value: 'wait_verification_500' },
      { label: '审批中', value: 'verificating_500' },
      { label: '保理商签署合同', value: 'factoring_sign_500' },
      { label: '待财务审批', value: 'wait_finance_500' },
      { label: '待放款', value: 'wait_loan_500' },
      { label: '已放款', value: 'loaded_500' },
      { label: '已回款', value: 'repayment_500' },
    ] as SelectItemsModel[],
    vankeListType: [
      {
        label: '龙光模式',
        value: 52,
        children: [
          { label: '保理商预录入', value: 'dragon_financing_pre' },
          { label: '供应商上传资料', value: 'dragon_financing' },
          { label: '平台审核', value: 'dragon_platform_verify' },
          { label: '供应商签署合同', value: 'dragon_supplier_sign' },
          { label: '待审批', value: 'wait_verification_500' },
          { label: '审批中', value: 'verificating_500' },
          { label: '保理商签署合同', value: 'factoring_sign_500' },
          { label: '待财务审批', value: 'wait_finance_500' },
          { label: '待放款', value: 'wait_loan_500' },
          { label: '已放款', value: 'loaded_500' },
          { label: '已回款', value: 'repayment_500' },
          { label: '中止', value: 99 },
          { label: '退单', value: 100 },
        ],
      },
      {
        label: '万科模式(新)',
        value: 53,
        children: [
          { label: '保理预录入', value: 'vanke_financing_pre' },
          { label: '供应商上传资料', value: 'vanke_financing' },
          { label: '平台审核', value: 'vanke_platform_verify' },
          { label: '保理商风险审核', value: 'vanke_factoring_risk' },
          { label: '供应商签署合同', value: 'vanke_financing_sign' },
          { label: '保理商回传合同', value: 'vanke_factoring_passback' },
          { label: '待审批', value: 'wait_verification_500' },
          { label: '审批中', value: 'verificating_500' },
          { label: '保理商签署合同', value: 'factoring_sign_500' },
          { label: '待财务审批', value: 'wait_finance_500' },
          { label: '待放款', value: 'wait_loan_500' },
          { label: '已放款', value: 'loaded_500' },
          { label: '已回款', value: 'repayment_500' },
          { label: '中止', value: 99 },
          { label: '退单', value: 100 },
        ],
      },
      {
        label: '金地模式',
        value: 14,
        children: [
          { label: '保理商预录入', value: '1' },
          { label: '供应商上传资料并签署合同', value: '2' },
          { label: '保理商审核', value: '3' },
          { label: '项目公司确认应收账款金额', value: '4' },
          // {label: '集团公司签署付款确认书', value: '5'},
          { label: '保理商签署合同', value: '6' },
          { label: '交易完成', value: '7' },
          { label: '终止', value: '8' },
        ],
      },
      {
        label: '万科模式(旧)',
        value: 6,
        children: [
          { label: '保理商预录入', value: '1' },
          { label: '供应商上传资料并签署合同', value: '2' },
          { label: '保理商审核并签署合同', value: '3' },
          { label: '交易完成', value: '4' },
          { label: '终止', value: '8' },
        ],
      },
    ] as SelectItemsModel[],
    newAgileListType: [
      { label: '平台预录入', value: '1' },
      { label: '供应商上传资料', value: '2' },
      { label: '平台审核', value: '3' },
      { label: '交易完成', value: '4' },
      { label: '保理签署合同', value: '5' },
      { label: '供应商签署合同', value: '6' },
      { label: '终止', value: '8' },
    ] as SelectItemsModel[],
    dragonBookType: [
      { label: '应收账款金额', value: '应收账款金额' },
    ] as SelectItemsModel[],

    // 广发银行业务
    pushStatus: [
      { label: '已关闭', value: 0 },
      { label: '已开启', value: 1 },
    ] as SelectItemsModel[],
    // 白名單類型
    BankwhiteNameStatus: [
      { label: '白名单', value: 1 },
      { label: '非白名单', value: 0 },
    ] as SelectItemsModel[],
    processStatus: [
      { label: '未发起', value: 0 },
      { label: '供应商签署协议', value: 1 },
      { label: '平台签署协议', value: 2 },
      { label: '流程结束', value: 3 },
    ] as SelectItemsModel[],
    // 万科新增业务，万科类型
    wkType: [
      { label: '万科', value: 1 },
      { label: '国寿', value: 2 },
    ] as SelectItemsModel[],
    // 代办列表添加交易状态搜索项
    commonPlatStatus: [
      { label: '一次转让合同组新增', value: 'sub_first_contract_add' },
      { label: '一次转让合同组删除', value: 'sub_first_contract_delete' },
      { label: '一次转让合同组修改', value: 'sub_first_contract_modify' },
      { label: '平台审核退单', value: 'sub_platform_check_retreat' },
    ] as SelectItemsModel[],

    differentPlatStatus: [
      { label: '平台初审', value: 'vanke_abs_step_platform_verify_operate' },
      { label: '平台复核', value: 'vanke_abs_step_platform_verify_review' },
      { label: '平台审核', value: 'vanke_platform_verify' },
      { label: '平台审核', value: 'dragon_platform_verify' },
      { label: '平台审核', value: 'oct_platform_verify' },
      { label: '平台审核', value: 'bgy_platform_verify' },
      { label: '平台审核', value: 'sh_vanke_platform_verify' },
      { label: '平台审核', value: 'jd_platform_verify' },
      { label: '平台审核', value: 'yjl_platform_verify' },
      { label: '平台审核', value: 'yjl_platform_verify_common' },
      { label: '平台审核退单', value: 'sub_sh_platform_check_retreat' },
      { label: '平台审核', value: 'sh_vanke_platform_verify' },
      {
        label: '平台审核供应商准入资料',
        value: 'sub_sh_supplementaryinfo_platform_verify',
      },
      { label: '修改预录入信息', value: 'sub_dragon_book_change' },
      { label: '中止', value: 'sub_dragon_book_stop' },
      { label: '中止', value: 'pay_over18' },
      {
        label: '平台审核普惠开户申请',
        value: 'sub_sh_prattwhitney_platform_verify',
      },
      { label: '普惠开户申请', value: 'sub_sh_prattwhitney_input' },
      { label: '对公账号激活', value: 'sub_sh_prattwhitney_account_active' },
      {
        label: '平台审核普惠开户申请',
        value: 'sub_so_prattwhitney_platform_verify',
      },
      { label: '普惠开户申请', value: 'sub_so_prattwhitney_input' },
      { label: '对公账号激活', value: 'sub_so_prattwhitney_account_active' },
    ] as SelectItemsModel[],
    // 地产合同补录付款性质 payType
    payType: [
      { label: '进度款', value: 1 },
      { label: '结算款', value: 2 },
      { label: '其他', value: 5 },
    ] as SelectItemsModel[],
    // 万科数据对接-地产合同补录付款性质 payType
    vankePayType: [
      { label: '进度款', value: 1 },
      { label: '结算款', value: 2 },
      { label: '质保金', value: 3 },
      { label: '预付款', value: 4 },
      { label: '其他', value: 5 },
    ] as SelectItemsModel[],
    signType: [
      { label: '线上签署', value: 0 },
      { label: '线下签署', value: 1 },
    ] as SelectItemsModel[],
    vankeSignType: [
      { label: '线上签署', value: 0 },
      { label: '线下签署', value: 1 },
      { label: '线上+线下签署', value: 2 },
    ] as SelectItemsModel[],
    acceptDockingState: [
      { label: '未受理', value: 0 },
      { label: '已受理', value: 1 },
    ] as SelectItemsModel[],
    isGiveFile: [
      { label: '未出具', value: 0 },
      { label: '已出具', value: 1 },
    ] as SelectItemsModel[],
    // 万科数据对接-台账-业务数据源
    vankeDataSource: [
      { label: '线上数据', value: 1 },
      { label: '线下数据', value: 0 },
    ] as SelectItemsModel[],
    // 万科数据对接-台账-资金中心受理情况
    acceptState: [
      { label: '未受理', value: 0 },
      { label: '已受理', value: 1 },
      { label: '等待受理-待办隐藏', value: 2 },
      { label: '恢复受理-待办恢复', value: 3 },
    ] as SelectItemsModel[],
    // 万科数据对接-平台审核-资金中心受理情况
    platAcceptState: [
      { label: '未受理', value: 0 },
      { label: '已受理', value: 1 },
      { label: '恢复受理-待办恢复', value: 3 },
    ] as SelectItemsModel[],
    // 万科数据对接-台账-万科数据对接情况
    vankeCallState: [
      { label: '正常', value: 0 },
      { label: '异常', value: 1 },
    ] as SelectItemsModel[],
    // 万科数据对接-台账-交易是否暂停
    pauseStatus: [
      { label: '正常', value: 0 },
      { label: '暂停', value: 1 },
      { label: '业务恢复-待办恢复', value: 2 },
    ] as SelectItemsModel[],
    // 万科数据对接-平台审核-交易是否暂停
    platPauseStatus: [
      { label: '正常', value: 0 },
      { label: '业务恢复-待办恢复', value: 2 },
    ] as SelectItemsModel[],
    // 万科数据对接-审批放款-电子签章状态
    vankeDockSignStatus: [
      { label: '未签章', value: 1 },
      { label: '签章失败', value: 4 },
      { label: '已签章', value: 5 },
    ] as SelectItemsModel[],
    memoStatus: [
      { label: '差资料-供应商', value: 1 },
      { label: '差资料-项目公司', value: 2 },
      { label: '需介入', value: 3 },
      { label: '需退单', value: 4 },
    ] as SelectItemsModel[],
    entoCapitalSugest: [
      { label: '建议入池', value: 2 },
      { label: '否', value: 1 },
    ] as SelectItemsModel[],
    vankeSelectFlag1: [
      { label: '未回传文件', value: 0 },
      { label: '已回传文件', value: 1 },
    ] as SelectItemsModel[],

    vankeSelectFlag2: [
      { label: '未生成文件', value: 0 },
      { label: '已生成文件', value: 1 },
      { label: '已回传文件', value: 2 },
    ] as SelectItemsModel[],
    vankeSelectFlag3: [
      { label: '未生成文件', value: 0 },
      { label: '已生成文件', value: 1 },
      { label: '已签署文件', value: 2 },
    ] as SelectItemsModel[],
    // 万科二期-抽样模型管理------------------------------------------
    // 金额类型
    receiveType: [
      { label: '小于等于100万', value: 0 },
      { label: '100万-500万(包含)', value: 1 },
      { label: '500万-1000万(包含)', value: 2 },
      { label: '大于1000万', value: 3 },
    ] as SelectItemsModel[],
    // 抽样数量
    numScope: [
      { label: '固定数量', value: 1 },
      { label: '个数比例', value: 2 },
      { label: '金额达标', value: 3 },
      { label: '金额比例达标', value: 4 },
    ] as SelectItemsModel[],
    // 规则状态
    ruleStatus: [
      { label: '未使用', value: 0 },
      { label: '使用中', value: 1 },
    ] as SelectItemsModel[],
    // 合同类型
    contractScope: [
      { label: '不分合同类型抽样', value: 1 },
      {
        label: '按照所选的合同类型分别抽样，例如：每种选中的合同类型抽样n笔',
        value: 2,
      },
      {
        label: '按照所选的合同类型整体抽样，例如：选中的合同类型共抽样n笔',
        value: 3,
      },
    ] as SelectItemsModel[],
    // 抽样方式
    wayType: [
      { label: '随机抽样n笔', value: 1 },
      { label: '按应收账款金额从大到小排序后抽样n笔', value: 2 },
      { label: '按应收账款金额从小到大排序后抽样n笔', value: 3 },
    ] as SelectItemsModel[],
    // 区域/企业要求
    requireScope: [
      { label: '合同类型', value: 1 },
      { label: '省份要求', value: 2 },
      { label: '企业要求', value: 3 },
    ] as SelectItemsModel[],
    // 省份要求
    provinceScope: [
      { label: '不分省份抽样', value: 1 },
      { label: '按照每个项目公司省份分别抽样n笔', value: 2 },
      { label: '前X大项目公司省份，每个省份分别抽样n笔', value: 3 },
      { label: '按照每个供应商省份分别抽样n笔', value: 4 },
      { label: '前X大供应商省份，每个省份分别抽样n笔', value: 5 },
      { label: '按照每个【核心企业内部省份】分别抽样n笔', value: 6 },
      { label: '前X大【核心企业内部省份】，每个省份分别抽样n笔', value: 7 },
    ] as SelectItemsModel[],
    // 企业要求
    companyScope: [
      { label: '不分企业抽样', value: 1 },
      { label: '按照每个项目公司分别抽样n笔', value: 2 },
      { label: '前X大项目公司，每个项目公司分别抽样n笔', value: 3 },
      { label: '按照每个供应商分别抽样n笔', value: 4 },
      { label: '前X大供应商，每个供应商分别抽样n笔', value: 5 },
    ] as SelectItemsModel[],
    // 金额要求
    receiveScope: [
      { label: '金额大于', value: 1 },
      { label: '金额小于', value: 2 },
      { label: '金额区间', value: 3 },
    ] as SelectItemsModel[],
    scfStatus: [
      { label: '作废', value: -1 },
      { label: '正常', value: 0 },
    ] as SelectItemsModel[],
    signStatus: [
      { label: '未签章', value: 1 },
      { label: '已签章', value: 5 },
      { label: '已作废', value: 4 },
    ] as SelectItemsModel[],
    systemFail: [
      {
        label: '业务资料修改',
        value: 1,
        children: [
          { label: '项目公司名称', value: 1 },
          { label: '供应商名称', value: 2 },
          { label: '发票变更', value: 3 },
        ],
      },
      {
        label: '收款信息修改',
        value: 2,
        children: [
          { label: '户名修改', value: 1 },
          { label: '收款单位开户行', value: 2 },
          { label: '收款单位账号', value: 3 },
        ],
      },
      {
        label: '更换资金渠道',
        value: 3,
        children: [
          { label: '合同不符合当前渠道的审单标准', value: 1 },
          { label: '发票不符合当前渠道的审单标准', value: 2 },
          { label: '款项性质不符合当前渠道的审单标准', value: 3 },
          { label: '供应商的资质不符合入池标准', value: 4 },
          { label: '当前渠道不接受第三方委托收款', value: 5 },
          { label: '其他文件不符合当前渠道的审单标准', value: 6 },
          { label: '无法获取四证或四证有误', value: 7 },
          { label: '项目公司控股问题', value: 8 },
        ],
      },
      {
        label: '业务终止',
        value: 4,
        children: [
          { label: '发票余额不足', value: 1 },
          { label: '供应商做保理的意愿低', value: 2 },
          { label: '供应商/项目公司要求更换支付方式', value: 3 },
          { label: '重复付款', value: 4 },
        ],
      },
    ] as SelectItemsModel[],
    chargeBackReason: [
      { label: '更换资金渠道', value: 1 },
      { label: '业务终止', value: 2 },
    ] as SelectItemsModel[],
    preStateTemporary: [
      { label: '未审核', value: 0 },
      { label: '通过', value: 1 },
      { label: '未通过', value: 2 },
    ] as SelectItemsModel[],
    updateType: [
      { label: '未修改', value: 0 },
      { label: '业务资料修改', value: 1 },
      { label: '收款信息修改', value: 2 },
      { label: '更换资金渠道', value: 3 },
      { label: '业务终止', value: 4 },
    ] as SelectItemsModel[],
    payState: [
      { label: '待放款', value: 0 },
      { label: '确认放款', value: 1 },
    ] as SelectItemsModel[],
    refundState: [
      { label: '正常', value: 0 },
      { label: '退票成功', value: 1 },
    ] as SelectItemsModel[],
    realyPayState: [
      { label: '未付款', value: 0 },
      { label: '已付款', value: 1 },
    ] as SelectItemsModel[],
    vankeStyle: [
      { label: '保理预录入', value: 'vanke_financing_pre' },
      { label: '供应商上传资料', value: 'vanke_financing' },
      { label: '平台审核', value: 'vanke_platform_verify' },
      { label: '平台初审', value: 'vanke_abs_step_platform_verify_operate' },
      { label: '平台复核', value: 'vanke_abs_step_platform_verify_review' },
      { label: '保理商风险审核', value: 'vanke_factoring_risk' },
      { label: '供应商签署合同', value: 'vanke_financing_sign' },
      { label: '保理商回传合同', value: 'vanke_factoring_passback' },
      { label: '待审批', value: 'wait_verification_500' },
      { label: '审批中', value: 'verificating_500' },
      { label: '保理商签署合同', value: 'factoring_sign_500' },
      { label: '待财务审批', value: 'wait_finance_500' },
      { label: '待放款', value: 'wait_loan_500' },
      { label: '已放款', value: 'loaded_500' },
      { label: '已回款', value: 'repayment_500' },
      { label: '中止', value: 99 },
      { label: '退单', value: 100 },
    ] as SelectItemsModel[],
    vankeQrsStyle: [
      // { label: '保理预录入', value: 'vanke_financing_pre' },
      // { label: '供应商上传资料', value: 'vanke_financing' },
      // { label: '平台审核', value: 'vanke_platform_verify' },
      // { label: '保理商风险审核', value: 'vanke_factoring_risk' },
      // { label: '供应商签署合同', value: 'vanke_financing_sign' },
      // { label: '保理商回传合同', value: 'vanke_factoring_passback' },
      // { label: '待审批', value: 'wait_verification_500' },
      // { label: '审批中', value: 'verificating_500' },
      { label: '保理商签署合同', value: 'factoring_sign_500' },
      { label: '待财务审批', value: 'wait_finance_500' },
      { label: '待放款', value: 'wait_loan_500' },
      { label: '已放款', value: 'loaded_500' },
      { label: '已回款', value: 'repayment_500' },
    ] as SelectItemsModel[],
    VankeVerifyType: [
      { label: '项目公司名称有误', value: 1 },
      { label: '供应商名称有误', value: 2 },
      { label: '保理融资到期日有误', value: 3 },
      { label: '应收账款金额有误', value: 4 },
      { label: '预录入发票号码为空', value: 5 },
      { label: '城市公司为空', value: 6 },
      { label: '发票长度不是8位', value: 7 },
      { label: '应收账款金额大于预录入发票金额', value: 8 },
      { label: '供应商收款户名为空', value: 9 },
      { label: '供应商收款银行为空', value: 10 },
      { label: '供应商收款账号为空', value: 11 },
      { label: '合同编号为空', value: 12 },
      { label: '融资类型为空', value: 13 },
      { label: '收款单位在被禁入名录中', value: 14 },
      { label: '业务为非并表业务', value: 15 },
      { label: '企业类型为个体工商户', value: 16 },
      { label: '申请付款单位为失信被执行人', value: 17 },
    ] as SelectItemsModel[],
    // 万科数据列表-通过列表-校验结果
    verifySuccessStatus: [
      { label: '系统校验成功', value: 1 },
      { label: '人工校验成功', value: 3 },
    ] as SelectItemsModel[],
    // 万科数据列表-失败列表-校验结果
    verifyFailStatus: [
      { label: '系统校验失败', value: 2 },
      { label: '人工校验失败', value: 4 },
    ] as SelectItemsModel[],
    // 万科数据列表-所有列表-交易结果
    verifyAllStatus: [
      { label: '系统校验成功', value: 1 },
      { label: '人工校验成功', value: 3 },
      { label: '系统校验失败', value: 2 },
      { label: '人工校验失败', value: 4 },
    ] as SelectItemsModel[],
    // 碧桂园数据列表-所有列表-交易状态
    BgyVerifyStatus: [
      { label: '系统校验成功', value: 1 },
      { label: '系统校验失败', value: 2 },
    ] as SelectItemsModel[],
    // 万科数据列表-是否并表
    isAndTable: [
      { label: '无', value: 0 },
      { label: '并表', value: 1 },
      { label: '不并表', value: 2 },
    ] as SelectItemsModel[],

    // 数据变动展示字段
    preState: [
      { label: '未审核', value: 0 },
      { label: '通过', value: 1 },
      { label: '未通过', value: 2 },
    ] as SelectItemsModel[],
    signIsDown: [
      { label: '否', value: 0 },
      { label: '是', value: 1 },
    ] as SelectItemsModel[],
    // 接口类型 万科-碧桂园-金地共用 （对接接口推送情况）
    callType: [
      { label: '预审接口', value: 1 },
      { label: '退票接口', value: 2 },
      { label: '确认已放款接口', value: 3 },
      { label: '确认可放款接口', value: 4 },
      { label: '更新发票接口', value: 5 },
      { label: '银行确认交单', value: 6 },
      { label: '付款单审核接口', value: 7 },
      { label: '换发票接口', value: 8 },
      { label: '融资批次接口', value: 9 },
      { label: '退单接口', value: 10 },
      { label: '融资进度反馈接口', value: 11 },
      { label: '放款结果反馈接口', value: 12 },
      { label: '打款信息反馈接口', value: 13 },
      { label: '万科资产文件退回接口', value: 14 },
    ] as SelectItemsModel[],
    // 接口状态 万科-碧桂园-金地共用 （对接接口推送情况）
    callStatus: [
      { label: '预审通过', value: 1 },
      { label: '预审不通过', value: 2 },
      { label: '退票', value: 3 },
      { label: '推送实际付款批次', value: 4 },
      { label: '推送可放款批次号', value: 5 },
      { label: '更新发票', value: 6 },
      { label: '确认可放款', value: 7 },
      { label: '确认已放款', value: 8 },
      { label: '银行确认已交单', value: 9 },
      { label: '推送融资信息', value: 10 },
      { label: '金融机构审核中', value: 11 },
      { label: '金融机构审核通过', value: 12 },
      { label: '律所审核通过', value: 13 },
      { label: '申请放款中', value: 14 },
      { label: '已放款', value: 15 },
      { label: '审核失败', value: 16 },
      { label: '更换发票', value: 17 },
      { label: '推送清单', value: 18 },
      { label: '推送托管行', value: 19 },
      { label: '退单', value: 20 },
      { label: '供应商资料待补录', value: 21 },
      { label: '资料审核中', value: 22 },
      { label: '签章中', value: 23 },
      { label: '放款结果反馈', value: 24 },
      { label: '打款信息反馈', value: 25 },
      { label: '付款申请问题反馈', value: 26 },
      { label: '竣工协议问题反馈', value: 27 },
      { label: '合同文件问题反馈', value: 28 },
      { label: ' 产值确认单问题反馈', value: 29 },
      { label: '发票问题反馈', value: 30 },
    ] as SelectItemsModel[],
    interFaceStatus: [
      { label: '成功', value: 0 },
      { label: '失败', value: 1 },
    ] as SelectItemsModel[],

    // 上海银行
    // 万科接口数据列表-补充信息
    shanghaiDockingInfo: [
      { label: '融资利率', value: 1 },
      { label: '服务费率', value: 2 },
    ] as SelectItemsModel[],
    // 渠道
    productType_sh: [
      { label: 'ABS', value: '1', children: [] },
      {
        label: '再保理',
        value: '2',
        children: [
          { label: '光大', value: '1' },
          { label: '招行', value: '2' },
          { label: '邮储', value: '3' },
          { label: '农行', value: '4' },
          { label: '北京银行', value: '7' },
          { label: '浦发银行', value: '8' },
        ],
      },
      {
        label: '银行直保',
        value: '3',
        children: [
          { label: '光大', value: '1' },
          { label: '招行', value: '2' },
          { label: '邮储', value: '3' },
          { label: '农行', value: '4' },
          { label: '国寿财富', value: '5' }, // bank_gs
          { label: '上海银行', value: '6' }, // bank_shanghai
        ],
      },
      { label: '非标', value: '99', children: [] },
    ] as SelectItemsModel[],
    /**所有产品的渠道 */
    productType_all: [
      { label: 'ABS', value: '1', children: [] },
      {
        label: '再保理',
        value: '2',
        children: [
          { label: '光大', value: '1' },
          { label: '招行', value: '2' },
          { label: '邮储', value: '3' },
          { label: '农行', value: '4' },
          { label: '北京银行', value: '7' },
          { label: '浦发银行', value: '8' },
          { label: '工商银行', value: '12' },
          { label: '民生银行', value: '13' },
          { label: '中国银行', value: '14' },
        ],
      },
      {
        label: '银行直保',
        value: '3',
        children: [
          { label: '光大', value: '1' },
          { label: '招行', value: '2' },
          { label: '邮储', value: '3' },
          { label: '农行', value: '4' },
          { label: '国寿财富', value: '5' }, // bank_gs
          { label: '上海银行', value: '6' }, // bank_shanghai
        ],
      },
      { label: '非标', value: '99', children: [] },
      { label: 'ABN', value: '4', children: [] },
      { label: '险资计划', value: '5', children: [] },
    ] as SelectItemsModel[],
    // 适用产品
    fitProduct_sh: [
      { label: '通用', value: 1, children: [] },
      { label: '普惠通-华侨城-上海银行', value: 2, children: [] },
      { label: '普惠通-万科-上海银行', value: 3, children: [] },
    ] as SelectItemsModel[],
    // 适用产品
    fitProduct_normal: [
      { label: '通用', value: 1, children: [] },
    ] as SelectItemsModel[],
    // 禁入规则-渠道
    channel_sh: [
      { label: '普惠通-万科-上海银行', value: 1, children: [] },
      { label: '普惠通-华侨城-上海银行', value: 2, children: [] },
    ] as SelectItemsModel[],
    // 企业出资人经济成分
    economicSector: [
      {
        label: '公有控股经济',
        value: 'A',
        children: [
          {
            label: '国有控股',
            value: 'A01',
            children: [
              { label: '国有相对控股', value: 'A0101', children: [] },
              { label: '国有绝对控股', value: 'A0102', children: [] },
            ],
          },
          {
            label: '集体控股',
            value: 'A02',
            children: [
              { label: '集体相对控股', value: 'A0201', children: [] },
              { label: '集体绝对控股', value: 'A0202', children: [] },
            ],
          },
        ],
      },
      {
        label: '非公有控股经济',
        value: 'B',
        children: [
          {
            label: '私人控股',
            value: 'B01',
            children: [
              { label: '私人相对控股', value: 'B0101', children: [] },
              { label: '私人绝对控股', value: 'B0102', children: [] },
            ],
          },
          {
            label: '港澳台控股',
            value: 'B02',
            children: [
              { label: '港澳台相对控股', value: 'B0201', children: [] },
              { label: '港澳台绝对控股', value: 'B0202', children: [] },
            ],
          },
          {
            label: '外商控股',
            value: 'B03',
            children: [
              { label: '外商相对控股', value: 'B0301', children: [] },
              { label: '外商绝对控股', value: 'B0302', children: [] },
            ],
          },
        ],
      },
    ] as SelectItemsModel[],
    // 交易状态枚举-部分
    tradeStatus_sh: [
      {
        label: '待供应商上传资料',
        value: 'supplier_upload',
        extValue: [EnumShBankExtStatus.none],
      },
      {
        label: '待平台审核',
        value: 'platform_verify',
        extValue: [EnumShBankExtStatus.none],
      },
      { label: '待万科修改', value: 'suspend', extValue: [] },
      {
        label: '待上海银行复核',
        value: 'bank_verify',
        extValue: [EnumShBankExtStatus.none],
      },
      {
        label: '待万科受理',
        value: 'accept_state',
        extValue: [
          EnumShBankExtStatus.accept_state,
          EnumShBankExtStatus.accept_state_success,
          EnumShBankExtStatus.accept_state_fail,
          EnumShBankExtStatus.accept_state_timeout,
          EnumShBankExtStatus.confirm_can_loann,
          EnumShBankExtStatus.confirm_can_loann_success,
          EnumShBankExtStatus.confirm_can_loann_fail,
          EnumShBankExtStatus.bank_confirm_can_loann,
          EnumShBankExtStatus.bank_confirm_can_loann_success,
          EnumShBankExtStatus.bank_confirm_can_loann_fail,
        ],
      },
      {
        label: '融资申请中',
        value: 'financing_apply',
        extValue: [
          EnumShBankExtStatus.financing_apply,
          EnumShBankExtStatus.financing_apply_success,
          EnumShBankExtStatus.financing_apply_fail,
          EnumShBankExtStatus.financing_apply_timeout,
          EnumShBankExtStatus.business_file_push_notice,
          EnumShBankExtStatus.business_file_push_notice_success,
          EnumShBankExtStatus.business_file_push_notice_fail,
          EnumShBankExtStatus.business_file_push_notice_timeout,
        ],
      },
      {
        label: '待生成保理融资协议',
        value: 'generate_financing_contract',
        extValue: [
          EnumShBankExtStatus.generate_financing_contract,
          EnumShBankExtStatus.generate_financing_contract_success,
          EnumShBankExtStatus.generate_financing_contract_fail,
          EnumShBankExtStatus.generate_financing_contract_timeout,
        ],
      },
      {
        label: '待供应商在普惠App签署保理融资协议',
        value: 'sign_financing_contract',
        extValue: [
          EnumShBankExtStatus.get_agreement_no,
          EnumShBankExtStatus.get_agreement_no_success,
          EnumShBankExtStatus.get_agreement_no_fail,
          EnumShBankExtStatus.get_agreement_no_timeout,
          EnumShBankExtStatus.sign_financing_contract,
          EnumShBankExtStatus.sign_financing_contract_success,
          EnumShBankExtStatus.sign_financing_contract_fail,
          EnumShBankExtStatus.sign_financing_contract_timeout,
        ],
      },
      {
        label: '待补充信息',
        value: 'input_contract_info',
        extValue: [EnumShBankExtStatus.input_contract_info],
      },
      {
        label: '待供应商签署服务协议',
        value: 'sign_service_agreement',
        extValue: [EnumShBankExtStatus.sign_service_agreement],
      },
      {
        label: '待链融签署服务协议',
        value: 'platform_sign_service_agreement',
        extValue: [EnumShBankExtStatus.platform_sign_service_agreement],
      },
      {
        label: '待放款审批',
        value: 'loan_apply',
        extValue: [
          EnumShBankExtStatus.service_agreemen_push_notice,
          EnumShBankExtStatus.service_agreemen_push_notice_success,
          EnumShBankExtStatus.service_agreemen_push_notice_fail,
          EnumShBankExtStatus.service_agreemen_push_notice_timeout,
          EnumShBankExtStatus.receive_import,
          EnumShBankExtStatus.receive_import_success,
          EnumShBankExtStatus.receive_import_fail,
          EnumShBankExtStatus.receive_import_timeout,
          EnumShBankExtStatus.invoice_query,
          EnumShBankExtStatus.invoice_query_success,
          EnumShBankExtStatus.invoice_query_fail,
          EnumShBankExtStatus.invoice_query_timeout,
          EnumShBankExtStatus.receivable_transfer,
          EnumShBankExtStatus.receivable_transfer_success,
          EnumShBankExtStatus.receivable_transfer_fail,
          EnumShBankExtStatus.receivable_transfer_timeout,
          EnumShBankExtStatus.loan_apply,
          EnumShBankExtStatus.loan_apply_success,
          EnumShBankExtStatus.loan_apply_fail,
          EnumShBankExtStatus.loan_apply_timeout,
          EnumShBankExtStatus.loan_apply_result_query,
          EnumShBankExtStatus.loan_apply_result_success,
          EnumShBankExtStatus.loan_apply_result_fail,
          EnumShBankExtStatus.loan_apply_result_timeout,
        ],
      },
      {
        label: '待代扣服务费',
        value: 'withhold_apply',
        extValue: [
          EnumShBankExtStatus.withhold_apply,
          EnumShBankExtStatus.withhold_apply_success,
          EnumShBankExtStatus.withhold_apply_fail,
          EnumShBankExtStatus.withhold_apply_timeout,
        ],
      },
      {
        label: '待提现',
        value: 'withdrawal',
        extValue: [EnumShBankExtStatus.withdrawal],
      },
      {
        label: '已提现',
        value: 'withdrawaled',
        extValue: [EnumShBankExtStatus.withdrawaled],
      },
      { label: '已退单', value: 'chargeback', extValue: [] },
      { label: '已终止', value: 'stop', extValue: [] },
    ] as SelectItemsModel[],
    // 华侨城-上海银行交易状态枚举-部分
    tradeStatus_so: [
      {
        label: '待供应商上传资料',
        value: 'supplier_upload',
        extValue: [EnumShBankExtStatus.none],
      },
      {
        label: '待平台审核',
        value: 'platform_verify',
        extValue: [EnumShBankExtStatus.none],
      },
      {
        label: '待上海银行复核',
        value: 'bank_verify',
        extValue: [EnumShBankExtStatus.none],
      },
      {
        label: '融资申请中',
        value: 'financing_apply',
        extValue: [
          EnumShBankExtStatus.financing_apply,
          EnumShBankExtStatus.financing_apply_success,
          EnumShBankExtStatus.financing_apply_fail,
          EnumShBankExtStatus.financing_apply_timeout,
          EnumShBankExtStatus.business_file_push_notice,
          EnumShBankExtStatus.business_file_push_notice_success,
          EnumShBankExtStatus.business_file_push_notice_fail,
          EnumShBankExtStatus.business_file_push_notice_timeout,
        ],
      },
      {
        label: '待生成保理融资协议',
        value: 'generate_financing_contract',
        extValue: [
          EnumShBankExtStatus.generate_financing_contract,
          EnumShBankExtStatus.generate_financing_contract_success,
          EnumShBankExtStatus.generate_financing_contract_fail,
          EnumShBankExtStatus.generate_financing_contract_timeout,
        ],
      },
      {
        label: '待供应商在普惠App签署保理融资协议',
        value: 'sign_financing_contract',
        extValue: [
          EnumShBankExtStatus.get_agreement_no,
          EnumShBankExtStatus.get_agreement_no_success,
          EnumShBankExtStatus.get_agreement_no_fail,
          EnumShBankExtStatus.get_agreement_no_timeout,
          EnumShBankExtStatus.sign_financing_contract,
          EnumShBankExtStatus.sign_financing_contract_success,
          EnumShBankExtStatus.sign_financing_contract_fail,
          EnumShBankExtStatus.sign_financing_contract_timeout,
        ],
      },
      {
        label: '待补充信息',
        value: 'input_contract_info',
        extValue: [EnumShBankExtStatus.input_contract_info],
      },
      {
        label: '待供应商签署服务协议',
        value: 'sign_service_agreement',
        extValue: [EnumShBankExtStatus.sign_service_agreement],
      },
      {
        label: '待链融签署服务协议',
        value: 'platform_sign_service_agreement',
        extValue: [EnumShBankExtStatus.platform_sign_service_agreement],
      },
      {
        label: '待放款审批',
        value: 'loan_apply',
        extValue: [
          EnumShBankExtStatus.service_agreemen_push_notice,
          EnumShBankExtStatus.service_agreemen_push_notice_success,
          EnumShBankExtStatus.service_agreemen_push_notice_fail,
          EnumShBankExtStatus.service_agreemen_push_notice_timeout,
          EnumShBankExtStatus.receive_import,
          EnumShBankExtStatus.receive_import_success,
          EnumShBankExtStatus.receive_import_fail,
          EnumShBankExtStatus.receive_import_timeout,
          EnumShBankExtStatus.invoice_query,
          EnumShBankExtStatus.invoice_query_success,
          EnumShBankExtStatus.invoice_query_fail,
          EnumShBankExtStatus.invoice_query_timeout,
          EnumShBankExtStatus.receivable_transfer,
          EnumShBankExtStatus.receivable_transfer_success,
          EnumShBankExtStatus.receivable_transfer_fail,
          EnumShBankExtStatus.receivable_transfer_timeout,
          EnumShBankExtStatus.loan_apply,
          EnumShBankExtStatus.loan_apply_success,
          EnumShBankExtStatus.loan_apply_fail,
          EnumShBankExtStatus.loan_apply_timeout,
          EnumShBankExtStatus.loan_apply_result_query,
          EnumShBankExtStatus.loan_apply_result_success,
          EnumShBankExtStatus.loan_apply_result_fail,
          EnumShBankExtStatus.loan_apply_result_timeout,
        ],
      },
      {
        label: '待代扣服务费',
        value: 'withhold_apply',
        extValue: [
          EnumShBankExtStatus.withhold_apply,
          EnumShBankExtStatus.withhold_apply_success,
          EnumShBankExtStatus.withhold_apply_fail,
          EnumShBankExtStatus.withhold_apply_timeout,
        ],
      },
      {
        label: '待提现',
        value: 'withdrawal',
        extValue: [EnumShBankExtStatus.withdrawal],
      },
      {
        label: '已提现',
        value: 'withdrawaled',
        extValue: [EnumShBankExtStatus.withdrawaled],
      },
      { label: '已退单', value: 'chargeback', extValue: [] },
      { label: '已终止', value: 'stop', extValue: [] },
    ] as SelectItemsModel[],
    // 交易状态枚举--所有
    tradeStatus_sh_all: [
      { label: '待供应商上传资料', value: 'supplier_upload' },
      { label: '待平台审核', value: 'platform_verify' },
      { label: '待上海银行复核', value: 'bank_verify' },
      { label: '上海银行复核完成', value: 'bank_finish' },
      { label: '已中止', value: 'stop' },

      // 新增异状态 bank_finish
      /** 付款确认书编号重复 */
      { label: '付款确认书编号重复', value: 'pay_confirm_id_error' },
      /** 业务待受理(万科接口) */
      { label: '业务待受理(万科接口)', value: 'accept_state' },
      /** 业务已受理 */
      { label: '业务已受理', value: 'accept_state_success' },
      /** 业务受理失败 */
      { label: '业务受理失败', value: 'accept_state_fail' },
      /** 业务待受理超时 */
      { label: '业务待受理超时', value: 'accept_state_timeout' },
      /** 确认可放款 （万科接口） */
      { label: '确认可放款（万科接口）', value: 'confirm_can_loann' },
      /** 确认可放款（成功） */
      { label: '确认可放款（成功）', value: 'confirm_can_loann_success' },
      /** 确认可放款（失败） */
      { label: '确认可放款（失败）', value: 'confirm_can_loann_fail' },
      /** 银行确认可放款 （万科接口） */
      { label: '银行确认可放款（万科接口）', value: 'bank_confirm_can_loann' },
      /** 银行确认可放款（成功） */
      {
        label: '银行确认可放款（成功）',
        value: 'bank_confirm_can_loann_success',
      },
      /** 银行确认可放款（失败） */
      { label: '银行确认可放款（失败）', value: 'bank_confirm_can_loann_fail' },
      /** 发起融资申请 bank_finish */
      { label: '发起融资申请', value: 'financing_apply' },
      /** 发起融资申请成功 bank_finish */
      { label: '发起融资申请成功', value: 'financing_apply_success' },
      /** 发起融资申请失败 bank_finish */
      { label: '发起融资申请失败', value: 'financing_apply_fail' },
      /** 发起融资申请超时 bank_finish */
      { label: '发起融资申请超时', value: 'financing_apply_timeout' },

      /** 融资申请状态查询 bank_finish */
      { label: '融资申请状态查询', value: 'financing_apply_status_query' },
      /** 融资申请成功 bank_finish */
      {
        label: '融资申请状态查询成功',
        value: 'financing_apply_status_success',
      },
      /** 融资申请失败 bank_finish */
      { label: '融资申请状态查询失败', value: 'financing_apply_status_fail' },
      /** 融资申请超时 bank_finish */
      {
        label: '融资申请状态查询超时',
        value: 'financing_apply_status_timeout',
      },

      /** 应收账款导入 bank_finish */
      { label: '应收账款导入', value: 'receive_import' },
      /** 应收账款导入成功 bank_finish */
      { label: '应收账款导入成功', value: 'receive_import_success' },
      /** 应收账款导入失败 bank_finish */
      { label: '应收账款导入失败', value: 'receive_import_fail' },
      /** 应收账款导入超时 bank_finish */
      { label: '应收账款导入超时', value: 'receive_import_timeout' },
      /** 发票核验查询 bank_finish */
      { label: '发票核验查询', value: 'invoice_query' },
      /** 发票核验查询成功 bank_finish */
      { label: '发票核验查询成功', value: 'invoice_query_success' },
      /** 发票核验查询失败 bank_finish */
      { label: '发票核验查询失败', value: 'invoice_query_fail' },
      /** 发票核验查询超时 bank_finish */
      { label: '发票核验查询超时', value: 'invoice_query_timeout' },

      /** 业务资料文件推送通知 bank_finish */
      { label: '业务资料文件推送通知', value: 'business_file_push_notice' },
      /** 业务资料文件推送通知成功 bank_finish */
      {
        label: '业务资料文件推送通知成功',
        value: 'business_file_push_notice_success',
      },
      /** 业务资料文件推送通知失败 bank_finish */
      {
        label: '业务资料文件推送通知失败',
        value: 'business_file_push_notice_fail',
      },
      /** 业务资料文件推送通知超时 bank_finish */
      {
        label: '业务资料文件推送通知超时',
        value: 'business_file_push_notice_timeout',
      },

      /** 应收账款转让状态查询 bank_finish */
      { label: '应收账款转让状态查询', value: 'receivable_transfer' },
      /** 应收账款转让成功 bank_finish */
      { label: '应收账款转让成功', value: 'receivable_transfer_success' },
      /** 应收账款转让失败 bank_finish */
      { label: '应收账款转让失败', value: 'receivable_transfer_fail' },
      /** 应收账款转让超时 bank_finish */
      { label: '应收账款转让超时', value: 'receivable_transfer_timeout' },

      /** 生成融资协议合同 bank_finish */
      { label: '生成融资协议合同', value: 'generate_financing_contract' },
      /** 生成融资协议合同成功 bank_finish */
      {
        label: '生成融资协议合同成功',
        value: 'generate_financing_contract_success',
      },
      /** 生成融资协议合同失败 bank_finish */
      {
        label: '生成融资协议合同失败',
        value: 'generate_financing_contract_fail',
      },
      /** 生成融资协议合同超时 bank_finish */
      {
        label: '生成融资协议合同超时',
        value: 'generate_financing_contract_timeout',
      },

      /** 获取授信协议编号 */
      { label: '获取授信协议编号', value: 'get_agreement_no' },
      /** 获取授信协议编号 成功 */
      { label: ' 获取授信协议编号成功', value: 'get_agreement_no_success' },
      /** 获取授信协议编号 失败 */
      { label: ' 获取授信协议编号失败', value: 'get_agreement_no_fail' },
      /** 获取授信协议编号 超时 */
      { label: ' 获取授信协议编号超时', value: 'get_agreement_no_timeout' },

      /** 供应商在普惠签署融资协议合同 bank_finish */
      {
        label: '供应商在普惠签署融资协议合同',
        value: 'sign_financing_contract',
      },
      /** 待补充信息 bank_finish */
      {
        label: '待补充信息',
        value: 'input_contract_info',
      },
      /** 供应商在普惠签署融资协议合同成功 bank_finish */
      {
        label: '供应商在普惠签署融资协议合同成功',
        value: 'sign_financing_contract_success',
      },
      /** 供应商在普惠签署融资协议合同失败 bank_finish */
      {
        label: '供应商在普惠签署融资协议合同失败',
        value: 'sign_financing_contract_fail',
      },
      /** 供应商在普惠签署融资协议合同超时 bank_finish */
      {
        label: '供应商在普惠签署融资协议合同超时',
        value: 'sign_financing_contract_timeout',
      },

      /** 供应商在平台签署服务协议 bank_finish */
      { label: '供应商在平台签署服务协议', value: 'sign_service_agreement' },
      /** 供应商在平台签署服务协议 签署完成 */
      {
        label: '供应商在平台签署服务协议签署完成',
        value: 'sign_service_agreement_finish',
      },

      /** 平台签署服务协议 待签署 bank_finish */
      { label: '平台签署服务协议', value: 'platform_sign_service_agreement' },

      /** 代扣协议文件推送通知 bank_finish */
      { label: '代扣协议文件推送通知', value: 'service_agreemen_push_notice' },
      /** 代扣协议文件推送通知成功 bank_finish */
      {
        label: '代扣协议文件推送通知成功',
        value: 'service_agreemen_push_notice_success',
      },
      /** 代扣协议文件推送通知失败 bank_finish */
      {
        label: '代扣协议文件推送通知失败',
        value: 'service_agreemen_push_notice_fail',
      },
      /** 代扣协议文件推送通知超时 bank_finish */
      {
        label: '代扣协议文件推送通知超时',
        value: 'service_agreemen_push_notice_timeout',
      },

      /** 发起放款申请 bank_finish */
      { label: '发起放款申请', value: 'loan_apply' },
      /** 发起放款申请成功 bank_finish */
      { label: '发起放款申请成功', value: 'loan_apply_success' },
      /** 发起放款申请失败 bank_finish */
      { label: '发起放款申请失败', value: 'loan_apply_fail' },
      /** 发起放款申请超时 bank_finish */
      { label: '发起放款申请超时', value: 'loan_apply_timeout' },

      /** 放款申请状态 bank_finish */
      { label: '放款申请状态', value: 'loan_apply_result_query' },
      /** 放款申请状态--成功 bank_finish */
      { label: '放款申请状态--成功', value: 'loan_apply_result_success' },
      /** 放款申请状态--失败 bank_finish */
      { label: '放款申请状态--失败', value: 'loan_apply_result_fail' },
      /** 放款申请状态--超时 bank_finish */
      { label: '放款申请状态--超时', value: 'loan_apply_result_timeout' },

      /** 代扣申请 bank_finish */
      { label: '代扣申请', value: 'withhold_apply' },
      /** 代扣申请成功 bank_finish */
      { label: '代扣申请成功', value: 'withhold_apply_success' },
      /** 代扣申请失败 bank_finish */
      { label: '代扣申请失败', value: 'withhold_apply_fail' },
      /** 代扣申请超时 bank_finish */
      { label: '代扣申请超时', value: 'withhold_apply_timeout' },

      /** 待提现 bank_finish */
      { label: '待提现', value: 'withdrawal' },

      /** 已提现 bank_finish */
      { label: '已提现', value: 'withdrawaled' },

      // platform_verify
      { label: '暂停', value: 'suspend' },
      // 任意
      { label: '已退单', value: 'chargeback' },
    ] as SelectItemsModel[],
    // 批量补充信息
    addInfo_sh: [
      { label: '保理融资到期日', value: 1 },
      // { label: '融资利率', value: 2 },
      // { label: '服务费率', value: 3 },
    ] as SelectItemsModel[],
    // 禁入企业来源
    stopEnterprise_sh: [
      { label: '未定义', value: 0 },
      { label: '规则新增', value: 1 },
      { label: '初审标记', value: 2 },
    ] as SelectItemsModel[],
    // 关联主体
    relation: [
      { label: '无关联', value: 0 },
      { label: '上海银行关联企业', value: 1 },
      { label: '万科关联企业', value: 2 },
    ] as SelectItemsModel[],
    // 工商状态
    businessStatus: [
      { label: '正常', value: 0 },
      { label: '经营异常', value: 1 },
      { label: '工商信息变动', value: 2 },
      { label: '近期有诉讼', value: 3 },
    ] as SelectItemsModel[],
    // 查询状态
    queryStatus: [
      { label: '已查询', value: 1 },
      { label: '未查询', value: 0 },
    ] as SelectItemsModel[],
    // 流程步骤-上海银行
    currentStep_sh: [
      { label: '平台预录入', value: 'sh_vanke_financing_pre' },
      { label: '供应商上传资料', value: 'sh_vanke_financing' },
      { label: '平台审核', value: 'sh_vanke_platform_verify' },
      { label: '待上银复核', value: 'sh_vanke_bank_verify' },
      { label: '待录入合同', value: 'sh_vanke_contract_input' },
      { label: '待供应商签署', value: 'sh_vanke_financing_sign' },
      { label: '待签署《服务协议》', value: 'sh_vanke_service_sign' },
      { label: '待放款审批', value: 'sh_vanke_bank_loan' },
      { label: '待提现', value: 'sh_vanke_financing_loan' },
      { label: '已提现', value: 'sh_vanke_loaned' },
      { label: '中止', value: 99 },
      { label: '退单', value: 100 },
    ] as SelectItemsModel[],
    // 流程步骤-华侨城-上海银行
    currentStep_so: [
      { label: '平台预录入', value: 'so_financing_pre' },
      { label: '供应商上传资料', value: 'so_financing' },
      { label: '平台审核', value: 'so_platform_verify' },
      { label: '待上银复核', value: 'so_bank_verify' },
      { label: '待录入合同', value: 'so_contract_input' },
      { label: '待供应商签署', value: 'so_financing_sign' },
      { label: '待签署《服务协议》', value: 'so_service_sign' },
      { label: '待放款审批', value: 'so_bank_loan' },
      { label: '待提现', value: 'so_financing_loan' },
      { label: '已提现', value: 'so_loaned' },
      { label: '中止', value: 99 },
      { label: '退单', value: 100 },
    ] as SelectItemsModel[],
    // 核心企业-上海银行
    coreType: [
      { label: '万科', value: 1 },
      { label: '金地', value: 2 },
      { label: '华侨城', value: 3 },
    ] as SelectItemsModel[],
    // 核心企业-上海银行
    reviewStatus_sh: [
      { label: '待复核', value: 1 },
      { label: '已复核', value: 2 },
      { label: '已提现', value: 3 },
    ] as SelectItemsModel[],
    // 上海银行--工商状态-企业类型
    EntType: [
      { label: '企业（包括个体工商户）', value: 0 },
      { label: '社会组织', value: 1 },
      { label: '香港公司', value: 3 },
      { label: '事业单位', value: 4 },
      { label: '基金会', value: 6 },
      { label: '医院', value: 7 },
      { label: '海外公司', value: 8 },
      { label: '律师事务所', value: 9 },
      { label: '学校', value: 10 },
      { label: '其他', value: -1 },
    ] as SelectItemsModel[],
    // 上银接口状态
    shInterfaceStatus: [
      { label: '正常', value: 1 },
      { label: '异常', value: 2 },
      { label: '前置机异常', value: 3 },
    ] as SelectItemsModel[],
    // 上银接口状态-搜索
    shIfStatus: [
      { label: '正常', value: 1 },
      { label: '异常', value: 2 },
    ] as SelectItemsModel[],
    // 接口异常状态
    interfaceErrType: [
      { label: '业务异常', value: -1 },
      { label: '未拉取', value: 0 },
      { label: '已拉取', value: 1 },
      { label: '返回成功', value: 2 },
      { label: '返回失败', value: 3 },
      { label: '请求超时', value: 4 },
      { label: '业务超时', value: 5 },
      { label: '需要重新拉取', value: 6 },
      { label: '缺少授信协议编号', value: 7 },
      { label: '缺少授信协议编号或缺少合同编号', value: 8 },
    ] as SelectItemsModel[],
    // 上海银行直保-前置机任务类型
    shBankTaskTypes: [
      { label: '融资申请', value: 'shbankFinancingApply' },
      {
        label: '融资业务申请状态查询',
        value: 'shbankFinancingApplyStatusQuery',
      },
      { label: '应收账款导入', value: 'shbankReceivableAccountsImport' },
      {
        label: '应收账款导入结果查询',
        value: 'shbankReceivableAccountsStatusQuery',
      },
      { label: '放款申请', value: 'shbankLoanApply' },
      { label: '放款申请结果查询', value: 'shbankLoanApplyResultQuery' },
      { label: '费用代扣', value: 'shbankCostWithhold' },
      { label: 'SFTP文件通知', value: 'shbankSftpNotice' },
      { label: '业务待受理（万科接口）', value: 'accept_state' },
      { label: '确认可放款 （万科接口）', value: 'confirm_can_loann' },
      { label: '银行确认可放款（万科接口）', value: 'bank_confirm_can_loann' },
    ] as SelectItemsModel[],
    // 普惠开户状态
    eAccountStatus: [
      { label: '开户状态查询异常', value: 2 },
      { label: '开户成功', value: 1 },
      { label: '开户失败或未开户', value: 0 },
    ] as SelectItemsModel[],
    // 核心企业-签收状态
    signForStatus_sh: [
      {
        label: '征信授权书',
        value: 1,
        children: [
          { label: '已签收', value: 1 },
          { label: '未签收', value: 0 },
        ],
      },
      {
        label: '受益所有人识别表',
        value: 2,
        children: [
          { label: '已签收', value: 1 },
          { label: '未签收', value: 0 },
        ],
      },
      {
        label: '收益所有人身份证',
        value: 3,
        children: [
          { label: '已签收', value: 1 },
          { label: '未签收', value: 0 },
        ],
      },
    ] as SelectItemsModel[],

    // 金地数据对接
    // 金地数据列表-所有列表-同步原因
    syncReason: [
      { label: '融资单由金地分配完渠道', value: 1 },
      { label: '审批完成', value: 2 },
      { label: '融资单修改信息', value: 3 },
    ] as SelectItemsModel[],
    // 金地数据列表-所有列表-申请单审批状态
    approveStatus: [
      { label: '审批中', value: 0 },
      { label: '审批完成', value: 1 },
    ] as SelectItemsModel[],
    // 金地数据列表-附件文件类型
    newGemdaleFileType: [
      { label: '形象进度', value: 1 },
      { label: '产值文件', value: 2 },
      { label: '结算文件', value: 3 },
      { label: '送货单', value: 4 },
      { label: '三方验收单', value: 5 },
      { label: '付款申请单', value: 6 },
      { label: '付款申请单相关文件的压缩文件包', value: 99 },
    ] as SelectItemsModel[],
    // 金地数据列表-附件文件形式
    newGemdaleFileNature: [
      { label: '签章原件扫描件', value: 1 },
      { label: '电子签章文件', value: 2 },
    ] as SelectItemsModel[],
    // 金地数据列表-是否已结算
    settmentStatus: [
      { label: '未结算', value: 0 },
      { label: '已结算', value: 1 },
    ] as SelectItemsModel[],
    // 金地数据列表-发起审核失败-退回类型
    returnType: [
      { label: '退单', value: 1 },
      { label: '修改金额', value: 2 },
      { label: '更换渠道', value: 3 },
    ] as SelectItemsModel[],
    // 金地数据列表-发起审核失败-退回原因
    returnReason: [
      { label: '资金方要求', value: 1 },
      { label: '金地要求', value: 2 },
      { label: '供应商要求', value: 3 },
    ] as SelectItemsModel[],
    // 金地数据列表-发起提单-保理商
    enterprise_dc_jd: [
      {
        label: '深圳市柏霖汇商业保理有限公司',
        value: '深圳市柏霖汇商业保理有限公司',
      },
    ] as SelectItemsModel[],
    // 金地数据列表-发起提单-渠道
    productType_new_jd: [
      { label: 'ABS', value: '1', children: [] },
      {
        label: '再保理',
        value: '2',
        children: [
          { label: '东亚', value: '10' },
          { label: '工行再保理', value: '12' },
          { label: '邮储银行', value: '3' },
        ],
      },
      {
        label: '非标',
        value: '99',
        children: [{ label: '国寿', value: '5' }],
      },
    ] as SelectItemsModel[],
    // 金地数据对接-交易状态
    newGemdaleTradeStatus: [
      { label: '平台预录入', value: 'jd_financing_pre' },
      { label: '供应商上传资料', value: 'jd_financing' },
      { label: '平台审核', value: 'jd_platform_verify' },
      { label: '保理商风险审核', value: 'jd_factoring_risk' },
      { label: '项目公司确认应收账款金额', value: 'jd_confirm_receive' },
      { label: '供应商签署合同', value: 'jd_financing_sign' },
      { label: '保理商回传合同', value: 'jd_factoring_passback' },
      { label: '待审批', value: 'wait_verification_500' },
      { label: '审批中', value: 'verificating_500' },
      { label: '保理商签署合同', value: 'factoring_sign_500' },
      { label: '待放款', value: 'wait_loan_500' },
      { label: '待财务审批', value: 'wait_finance_500' },
      { label: '已放款', value: 'loaded_500' },
      { label: '已回款', value: 'repayment_500' },
      { label: '中止', value: 99 },
      { label: '退单', value: 100 },
    ] as SelectItemsModel[],
    // 金地数据对接-台账交易状态
    newGemdaleStatus: [
      { label: '平台预录入', value: 'jd_financing_pre' },
      { label: '供应商上传资料', value: 'jd_financing' },
      { label: '平台审核', value: 'jd_platform_verify' },
      { label: '保理商风险审核', value: 'jd_factoring_risk' },
      { label: '项目公司确认应收账款金额', value: 'jd_confirm_receive' },
      { label: '供应商签署合同', value: 'jd_financing_sign' },
      { label: '保理商回传合同', value: 'jd_factoring_passback' },
      { label: '待审批', value: 'wait_verification_500' },
      { label: '审批中', value: 'verificating_500' },
      { label: '保理商签署合同', value: 'factoring_sign_500' },
      { label: '待财务审批', value: 'wait_finance_500' },
      { label: '待放款', value: 'wait_loan_500' },
      { label: '已放款', value: 'loaded_500' },
      { label: '已回款', value: 'repayment_500' },
    ] as SelectItemsModel[],
    machineNewGemdaleTradeStatus: [
      {
        label: '金地模式(新)',
        value: 56,
        children: [
          { label: '平台预录入', value: 'jd_financing_pre' },
          { label: '供应商上传资料', value: 'jd_financing' },
          { label: '平台审核', value: 'jd_platform_verify' },
          { label: '保理商风险审核', value: 'jd_factoring_risk' },
          { label: '项目公司确认应收账款金额', value: 'jd_confirm_receive' },
          { label: '供应商签署合同', value: 'jd_financing_sign' },
          { label: '保理商回传合同', value: 'jd_factoring_passback' },
          { label: '待审批', value: 'wait_verification_500' },
          { label: '审批中', value: 'verificating_500' },
          { label: '保理商签署合同', value: 'factoring_sign_500' },
          { label: '待财务审批', value: 'wait_finance_500' },
          { label: '待放款', value: 'wait_loan_500' },
          { label: '已放款', value: 'loaded_500' },
          { label: '已回款', value: 'repayment_500' },
          { label: '中止', value: 99 },
          { label: '退单', value: 100 },
        ],
      },
      {
        label: '金地模式(旧)',
        value: 14,
        children: [],
      },
    ] as SelectItemsModel[],
    // 金地数据对接-退单原因
    systemFail_jd: [
      {
        label: '退单',
        value: 1,
        children: [
          { label: '资金方要求', value: 1 },
          { label: '金地要求', value: 2 },
          { label: '供应商要求', value: 3 },
        ],
      },
      {
        label: '修改金额',
        value: 2,
        children: [
          { label: '资金方要求', value: 1 },
          { label: '金地要求', value: 2 },
          { label: '供应商要求', value: 3 },
        ],
      },
      {
        label: '更换渠道',
        value: 3,
        children: [
          { label: '资金方要求', value: 1 },
          { label: '金地要求', value: 2 },
          { label: '供应商要求', value: 3 },
        ],
      },
    ] as SelectItemsModel[],
    // 金地数据对接-还款管理-合同类型
    repayContactType: [
      { label: '无类型选项', value: 0 },
      { label: '工程', value: 1 },
      { label: '贸易', value: 2 },
      { label: '设计', value: 3 },
      { label: '监理', value: 4 },
    ] as SelectItemsModel[],
    // 金地数据对接-台账签署方式
    signType_jd: [
      { label: '线上签署', value: 0 },
      { label: '线下签署', value: 1 },
    ] as SelectItemsModel[],
    // 总部公司  （全部）
    enterprise_dragon_all: [
      { label: '万科企业股份有限公司', value: '万科企业股份有限公司' },
      { label: '雅居乐集团控股有限公司', value: '雅居乐集团控股有限公司' },
      { label: '雅居乐地产控股有限公司', value: '雅居乐地产控股有限公司' },
      { label: '深圳市龙光控股有限公司', value: '深圳市龙光控股有限公司' },
      { label: '金地（集团）股份有限公司', value: '金地（集团）股份有限公司' },
      { label: '龙光工程建设有限公司', value: '龙光工程建设有限公司' },
      { label: '碧桂园地产集团有限公司', value: '碧桂园地产集团有限公司' },
      { label: '深圳华侨城股份有限公司', value: '深圳华侨城股份有限公司' },
    ] as SelectItemsModel[],
    province_and_city: SelectOptions.getProvinceCity() as SelectItemsModel[],

    // 发票查验状态
    invoiceCheckStatus: [
      { label: '未验证', value: 0 },
      { label: '验证成功', value: 1 },
      { label: '重复验证', value: 3 },
      { label: '作废', value: 4 },
      { label: '失控', value: 6 },
      { label: '红冲', value: 7 },
      { label: '状态异常', value: 8 },
      { label: '验证失败', value: 9 },
      { label: '验证中', value: 10 },
    ] as SelectItemsModel[],
    /** 发票截图发票状态 */
    screenshotInvoiceCheck: [
      { label: '红冲', value: 7 },
      { label: '作废', value: 4 },
      { label: '正常', value: 1 },
      { label: '当天查验超过次数', value: -2 },
    ] as SelectItemsModel[],
    /** 发票截图查验状态*/
    screenshotStatus: [
      { label: '查验中', value: 0 },
      { label: '成功', value: 1 },
      { label: '失败', value: 2 },
    ] as SelectItemsModel[],
    // 发票查验类型
    invoiceType: [
      { label: '增值税普通发票', value: 1 },
      { label: '增值税专用发票', value: 2 },
      { label: '增值税普通发票', value: 3 },
      { label: '增值税专用发票', value: 4 },
    ] as SelectItemsModel[],
    // 金地-放款状态
    jdLoanFailStatus: [
      { label: '未反馈', value: -1 },
      { label: '放款成功', value: 0 },
      { label: '放款异常', value: 1 },
    ] as SelectItemsModel[],

    // 雅居乐改造
    // 雅居乐-恒泽 发起提单-保理商
    enterprise_dc_yjl: [
      { label: '广州恒泽商业保理有限公司', value: '广州恒泽商业保理有限公司' },
    ] as SelectItemsModel[],
    // 雅居乐-星顺/恒泽 发起提单-渠道
    productType_yjl_xingshun: [
      { label: 'ABS', value: '1', children: [] },
      {
        label: '再保理',
        value: '2',
        children: [
          { label: '光大', value: '1' },
          { label: '招行', value: '2' },
          { label: '邮储', value: '3' },
          { label: '农行', value: '4' },
          { label: '北京银行', value: '7' },
          { label: '浦发银行', value: '8' },
          { label: '东亚', value: '10' },
        ],
      },
      {
        label: '非标',
        value: '99',
        children: [{ label: '国寿', value: '5' }],
      },
    ] as SelectItemsModel[],
    // 雅居乐-恒泽 交易状态
    agileXingshunTradeStatus: [
      { label: '保理商预录入', value: 'yjl_financing_pre' },
      { label: '供应商上传资料', value: 'yjl_financing' },
      { label: '平台审核', value: 'yjl_platform_verify' },
      { label: '保理商风险审核', value: 'yjl_factoring_risk' },
      { label: '供应商签署合同', value: 'yjl_financing_sign' },
      { label: '保理商回传合同', value: 'yjl_factoring_passback' },
      { label: '待审批', value: 'wait_verification_500' },
      { label: '审批中', value: 'verificating_500' },
      { label: '保理商签署合同', value: 'factoring_sign_500' },
      { label: '待放款', value: 'wait_loan_500' },
      { label: '已放款', value: 'loaded_500' },
      { label: '已回款', value: 'repayment_500' },
      { label: '中止', value: 99 },
      { label: '退单', value: 100 },
    ] as SelectItemsModel[],
    // 雅居乐-恒泽 台账交易状态
    machineAgileXingshunTradeStatus: [
      {
        label: '雅居乐模式(新)',
        value: 57,
        children: [
          { label: '平台预录入', value: 'yjl_financing_pre' },
          { label: '供应商上传资料', value: 'yjl_financing' },
          { label: '平台审核', value: 'yjl_platform_verify' },
          { label: '保理商风险审核', value: 'yjl_factoring_risk' },
          { label: '供应商签署合同', value: 'yjl_financing_sign' },
          { label: '保理商回传合同', value: 'yjl_factoring_passback' },
          { label: '待审批', value: 'wait_verification_500' },
          { label: '审批中', value: 'verificating_500' },
          { label: '保理商签署合同', value: 'factoring_sign_500' },
          { label: '待放款', value: 'wait_loan_500' },
          { label: '已放款', value: 'loaded_500' },
          { label: '已回款', value: 'repayment_500' },
          { label: '中止', value: 99 },
          { label: '退单', value: 100 },
        ],
      },
      {
        label: '雅居乐模式(旧)',
        value: 50,
        children: [],
      },
    ] as SelectItemsModel[],
    // 雅居乐-恒泽 履约证明文件类型
    lvYueFileOptions: [
      {
        label: '工程类-结算款',
        value: '1',
        children: [
          { label: '资金计划', value: '1' },
          { label: '工程结算书', value: '2' },
          { label: '其他文件', value: '3' },
        ],
      },
      {
        label: '工程类-进度款',
        value: '2',
        children: [
          { label: '资金计划', value: '1' },
          { label: '成本台账', value: '2' },
          { label: '监理报告', value: '3' },
          { label: '其他文件', value: '4' },
        ],
      },
      {
        label: '监理类',
        value: '3',
        children: [
          { label: '资金计划', value: '1' },
          { label: '成本台账', value: '2' },
          { label: '监理费用汇总的明细表/工程进度及请款计算表', value: '3' },
          { label: '监理公司的请款函', value: '4' },
          { label: '其他文件', value: '5' },
        ],
      },
      {
        label: '贸易类',
        value: '4',
        children: [
          { label: '资金计划', value: '1' },
          { label: '入库明细', value: '2' },
          { label: '送货单', value: '3' },
          { label: '订货合同', value: '4' },
          { label: '其他文件', value: '5' },
        ],
      },
      {
        label: '设计类',
        value: '5',
        children: [
          { label: '资金计划', value: '1' },
          { label: '设计付款进度确认表', value: '2' },
          { label: '其他文件', value: '3' },
        ],
      },
      {
        label: '设备供应类',
        value: '6',
        children: [
          { label: '资金计划', value: '1' },
          { label: '送货单', value: '2' },
          { label: '到货验收单', value: '3' },
          { label: '其他文件', value: '4' },
        ],
      },
      {
        label: '其他类',
        value: '7',
        children: [{ label: '其他文件', value: '1' }],
      },
    ] as SelectItemsModel[],
    // 雅居乐 审批放款中账号变更原因
    changeReasonYjl: [
      { label: '原收款账号为保理账户', value: 1 },
      { label: '户名名称不全', value: 2 },
      { label: '开户行名称有误', value: 3 },
      { label: '账号号码错误', value: 4 },
      { label: '总包委托付款', value: 5 },
      { label: '提单信息有误', value: 6 },
    ] as SelectItemsModel[],
    // 恒泽流程中 审批放款中账号变更原因，只需要 “提单信息有误” 一个选项
    changeReasonHZ: [{ label: '提单信息有误', value: 6 }] as SelectItemsModel[],

    // 雅居乐-星顺 发起提单-保理商
    enterprise_dc_yjl_xs: [
      {
        label: '深圳市星顺商业保理有限公司',
        value: '深圳市星顺商业保理有限公司',
      },
    ] as SelectItemsModel[],
    // 雅居乐-星顺 交易状态
    agileXsTradeStatus: [
      { label: '保理商预录入', value: 'yjl_financing_pre_common' },
      { label: '供应商上传资料', value: 'yjl_financing_common' },
      { label: '平台审核', value: 'yjl_platform_verify_common' },
      { label: '保理商风险审核', value: 'yjl_factoring_risk_common' },
      { label: '供应商签署合同', value: 'yjl_financing_sign_common' },
      { label: '保理商回传合同', value: 'yjl_factoring_passback_common' },
      { label: '待审批', value: 'wait_verification_500' },
      { label: '审批中', value: 'verificating_500' },
      { label: '保理商签署合同', value: 'factoring_sign_500' },
      { label: '待放款', value: 'wait_loan_500' },
      { label: '已放款', value: 'loaded_500' },
      { label: '已回款', value: 'repayment_500' },
      { label: '中止', value: 99 },
      { label: '退单', value: 100 },
    ] as SelectItemsModel[],
    // 雅居乐-星顺 台账交易状态
    machineAgileXsTradeStatus: [
      {
        label: '雅居乐模式(新)',
        value: 57,
        children: [
          { label: '平台预录入', value: 'yjl_financing_pre_common' },
          { label: '供应商上传资料', value: 'yjl_financing_common' },
          { label: '平台审核', value: 'yjl_platform_verify_common' },
          { label: '保理商风险审核', value: 'yjl_factoring_risk_common' },
          { label: '供应商签署合同', value: 'yjl_financing_sign_common' },
          { label: '保理商回传合同', value: 'yjl_factoring_passback_common' },
          { label: '待审批', value: 'wait_verification_500' },
          { label: '审批中', value: 'verificating_500' },
          { label: '保理商签署合同', value: 'factoring_sign_500' },
          { label: '待放款', value: 'wait_loan_500' },
          { label: '已放款', value: 'loaded_500' },
          { label: '已回款', value: 'repayment_500' },
          { label: '中止', value: 99 },
          { label: '退单', value: 100 },
        ],
      },
      {
        label: '雅居乐模式(旧)',
        value: 50,
        children: [],
      },
    ] as SelectItemsModel[],

    /** 龙光-博时资本  */
    // 发起提单渠道
    productType_pslogan: [
      {
        label: '非标',
        value: '99',
        children: [{ label: '博时资本', value: '9' }],
      },
    ] as SelectItemsModel[],
    productType_logan: [
      { label: 'ABS', value: '1', children: [] },
      { label: 'ABN', value: '4', children: [] },
    ] as SelectItemsModel[],
    // 供应商是否签署基础交易文件
    lgBasicFlieStatus: [
      { label: '是', value: 2 },
      { label: '否', value: 1 },
    ] as SelectItemsModel[],
    reconciliationResult: [
      { label: '对账成功', value: 1 },
      { label: '对账异常', value: 0 },
    ] as SelectItemsModel[],

    /** 20210526 万科数据对接优化新增 */
    // 付款确认书电子章、买方确认函电子章
    vankeSignStatus: [
      { label: '未签', value: 0 },
      { label: '已签', value: 1 },
    ] as SelectItemsModel[],
    // 确认函获取标识
    signBuyer: [
      { label: '纸质', value: 0 },
      { label: '电子', value: 1 },
    ] as SelectItemsModel[],
    // 修改标识
    isUpdated: [
      { label: '未修改', value: 0 },
      { label: '已修改', value: 1 },
    ] as SelectItemsModel[],
    // 授权标识
    isAuth: [
      { label: '未授权', value: 0 },
      { label: '已授权', value: 1 },
    ] as SelectItemsModel[],

    /** 注册优化v1.9 */
    // CFCA审核列表-当前步骤
    caStatus: [
      { label: '经办', value: '@begin' },
      { label: '初审', value: 'operate' },
      { label: '复核', value: 'review' },
    ] as SelectItemsModel[],

    /** 20210621台账优化 */
    // 注册公司-核心企业类型
    orgTypeCompany: [
      { label: '供应商', value: '1' },
      { label: '保理商', value: '3' },
      { label: '银行', value: '4' },
      { label: '风控平台', value: '88' },
      { label: '平台', value: '99' },
      { label: '项目公司', value: '201' },
      { label: '总部公司', value: '202' },
      { label: '中介机构', value: '102' },
      { label: '服务机构', value: '6' },
    ] as SelectItemsModel[],
    // 台帐列表-审核优先级类型
    checkPriorityType: [
      { label: '正常', value: 0 },
      { label: '优先审核', value: 1 },
      { label: '暂缓审核', value: 2 },
    ] as SelectItemsModel[],
    // 台帐列表-放款优先级类型
    loanPriorityType: [
      { label: '正常', value: 0 },
      { label: '放款加急', value: 1 },
      { label: '存量预留', value: 2 },
    ] as SelectItemsModel[],
    // 台帐列表-入池建议类型
    poolAdviseType: [
      { label: '正常', value: 0 },
      { label: '建议入池', value: 1 },
    ] as SelectItemsModel[],

    /** 20210702 上海银行普惠开户新增 */
    // 企业规模 comDibilityLimit
    comDibilityLimit: ComDibilityLimit,
    // 企业类别 custType
    custType: CustType,
    // 所在行业 industry
    industry: Industry,
    // 股东性质 shareholderTypes
    shareholderTypes: ShareholderTypes,
    // 股东/受益人证件类型 shareholderCarsTypes
    shareholderCarsTypes: ShareholderCarsTypes,
    // 受益所有人性质
    earningOwnerType: EarningOwnerType,
    // 对公账号开户银行 acctBank
    acctBank: AcctBank,
    // 办理类型 appApplyType
    appApplyType: AppApplyType,
    // 平台审核资料状态 checkStatus
    checkStatus: CheckStatus,
    /** 开户状态 openAccountStatus */
    openAccountStatus: OpenAccountStatus,
    /** 对公账户激活状态 accountActiveStatus */
    accountActiveStatus: AccountActiveStatus,
    /** 对公账户激活状态类名accountActiveStatusClassName */
    accountActiveStatusClassName: AccountActiveStatusClassName,
    /** 上海银行普惠开户审核状态枚举 ShPuhuiCheckTypes */
    ShPuhuiCheckTypes: ShPuhuiCheckTypes,

    /** 华侨城-上海银行配置 */
    // 关联主体
    relation_so: [
      { label: '无关联', value: 0 },
      { label: '上海银行关联企业', value: 1 },
      { label: '华侨城关联企业', value: 3 },
    ] as SelectItemsModel[],
    /** 20210831 pre进度款项目 */
    isPreTrade: [
      { label: '进度款前置融资产品', value: 1 },
      // { label: '空', value: 0 },
      { label: '未知', value: 2 },
    ] as SelectItemsModel[],
  };
  // 静态方法
  private static provinceCityCache; // 城市
  private static orgIndustryCache; // 行业
  private static accountsreceivable; // 应收账款类型
  private static provinceCityCache2;
  // 构建城市联动选择
  private static buildProvinceCity(): {} {
    if (!isNullOrUndefined(SelectOptions.provinceCityCache)) {
      return SelectOptions.provinceCityCache;
    }

    const ret = {
      firstPlaceHolder: '请选择省份',
      secondPlaceHolder: '请选择城市',
      first: [],
      second: {},
    };
    SelectOptions.buildOneProvince(ret, '北京市', '北京市');
    SelectOptions.buildOneProvince(ret, '上海市', '上海市');
    SelectOptions.buildOneProvince(ret, '天津市', '天津市');
    SelectOptions.buildOneProvince(ret, '重庆市', '重庆市');
    SelectOptions.buildOneProvince(
      ret,
      '广东省',
      '广州市|深圳市|珠海市|佛山市|中山市|韶关市|汕尾市|东莞市|江门市|茂名市|湛江市|云浮市|河源市|惠州市|阳江市|汕头市|揭阳市|清远市|潮州市|肇庆市|梅州市'
    );
    SelectOptions.buildOneProvince(
      ret,
      '江苏省',
      '无锡市|常州市|盐城市|苏州市|宿迁市|徐州市|淮安市|连云港市|南京市|镇江市|南通市|扬州市|泰州市'
    );
    SelectOptions.buildOneProvince(
      ret,
      '浙江省',
      '舟山市|湖州市|嘉兴市|衢州市|金华市|台州市|宁波市|杭州市|丽水市|温州市|绍兴市'
    );
    SelectOptions.buildOneProvince(
      ret,
      '山东省',
      '聊城市|济宁市|临沂市|威海市|德州市|东营市|济南市|潍坊市|烟台市|菏泽市|枣庄市|淄博市|滨州市|日照市|青岛市|泰安市|莱芜市'
    );
    SelectOptions.buildOneProvince(
      ret,
      '江西省',
      '九江市|鹰潭市|上饶市|南昌市|抚州市|宜春市|吉安市|景德镇市|赣州市|萍乡市|新余市'
    );
    SelectOptions.buildOneProvince(
      ret,
      '河南省',
      '济源市|漯河市|新乡市|许昌市|信阳市|安阳市|洛阳市|三门峡市|平顶山市|焦作市|周口市|濮阳市|南阳市|驻马店市|郑州市|鹤壁市|开封市|商丘市'
    );
    SelectOptions.buildOneProvince(
      ret,
      '河北省',
      '沧州市|石家庄市|唐山市|邢台市|邯郸市|衡水市|承德市|保定市|张家口市|秦皇岛市|廊坊市'
    );
    SelectOptions.buildOneProvince(
      ret,
      '四川省',
      '广安市|阿坝藏族羌族自治州|广元市|遂宁市|乐山市|凉山彝族自治州|泸州市|南充市|内江市|宜宾市|资阳市|巴中市|攀枝花市|自贡市|雅安市|眉山市|绵阳市|德阳市|成都市|甘孜藏族自治州|达州市'
    );
    SelectOptions.buildOneProvince(
      ret,
      '湖南省',
      '株洲市|张家界市|湘西土家族苗族自治州|益阳市|怀化市|郴州市|娄底市|邵阳市|衡阳市|常德市|湘潭市|永州市|长沙市|岳阳市'
    );
    SelectOptions.buildOneProvince(
      ret,
      '湖北省',
      '神农架林区|天门市|仙桃市|潜江市|襄樊市|黄冈市|武汉市|随州市|孝感市|恩施土家族苗族自治州|鄂州市|十堰市|荆门市|黄石市|宜昌市|荆州市|咸宁市'
    );
    SelectOptions.buildOneProvince(
      ret,
      '安徽省',
      '铜陵市|亳州市|黄山市|安庆市|宿州市|六安市|蚌埠市|合肥市|池州市|芜湖市|宣城市|淮南市|阜阳市|滁州市|马鞍山市|淮北市'
    );
    SelectOptions.buildOneProvince(
      ret,
      '福建省',
      '厦门市|南平市|三明市|宁德市|莆田市|福州市|漳州市|龙岩市|泉州市'
    );
    SelectOptions.buildOneProvince(
      ret,
      '海南省',
      '海口市|三亚市|三沙市|琼海市|儋州市|五指山市|文昌市|万宁市|东方市|定安县|屯昌县|澄迈县|临高县|白沙黎族自治县|昌江黎族自治县|乐东黎族自治县|陵水黎族自治县|保亭黎族苗族自治县|琼中黎族苗族自治县'
    );
    SelectOptions.buildOneProvince(
      ret,
      '贵州省',
      '黔南布依族苗族自治州|铜仁市|黔西南布依族苗族自治州|黔东南苗族侗族自治州|安顺市|贵阳市|毕节市|遵义市|六盘水市'
    );
    SelectOptions.buildOneProvince(
      ret,
      '云南省',
      '普洱市|昭通市|怒江傈僳族自治州|临沧市|文山壮族苗族自治州|西双版纳傣族自治州|楚雄彝族自治州|丽江市|德宏傣族景颇族自治州|保山市|大理白族自治州|迪庆藏族自治州|玉溪市|红河哈尼族彝族自治州|曲靖市|昆明市'
    );
    SelectOptions.buildOneProvince(
      ret,
      '广西壮族自治区',
      '钦州市|崇左市|河池市|北海市|梧州市|南宁市|百色市|桂林市|来宾市|贺州市|玉林市|柳州市|防城港市|贵港市'
    );
    SelectOptions.buildOneProvince(
      ret,
      '黑龙江省',
      '大庆市|大兴安岭地区|双鸭山市|鹤岗市|鸡西市|佳木斯市|七台河市|伊春市|哈尔滨市|牡丹江市|黑河市|齐齐哈尔市|绥化市'
    );
    SelectOptions.buildOneProvince(
      ret,
      '吉林省',
      '吉林市|松原市|四平市|延边朝鲜族自治州|长春市|白城市|白山市|辽源市|通化市'
    );
    SelectOptions.buildOneProvince(
      ret,
      '辽宁省',
      '本溪市|丹东市|大连市|阜新市|抚顺市|铁岭市|锦州市|沈阳市|葫芦岛市|鞍山市|朝阳市|盘锦市|辽阳市|营口市'
    );
    SelectOptions.buildOneProvince(
      ret,
      '山西省',
      '阳泉市|晋城市|晋中市|太原市|大同市|忻州市|吕梁市|长治市|临汾市|运城市|朔州市'
    );
    SelectOptions.buildOneProvince(
      ret,
      '陕西省',
      '延安市|渭南市|宝鸡市|安康市|铜川市|西安市|榆林市|汉中市|咸阳市|商洛市'
    );
    SelectOptions.buildOneProvince(
      ret,
      '甘肃省',
      '酒泉市|临夏回族自治州|天水市|白银市|定西市|兰州市|甘南藏族自治州|张掖市|陇南市|嘉峪关市|庆阳市|武威市|金昌市|平凉市'
    );
    SelectOptions.buildOneProvince(
      ret,
      '青海省',
      '海北藏族自治州|黄南藏族自治州|果洛藏族自治州|西宁市|玉树藏族自治州|海西蒙古族藏族自治州|海南藏族自治州|海东市'
    );
    SelectOptions.buildOneProvince(
      ret,
      '宁夏回族自治区',
      '银川市|吴忠市|固原市|石嘴山市|中卫市'
    );
    SelectOptions.buildOneProvince(
      ret,
      '新疆维吾尔自治区',
      '吐鲁番市|哈密市|石河子市|阿拉尔市|图木舒克市|五家渠市|北屯市|双河市|可克达拉市|喀什地区|巴音郭楞蒙古自治州|吐鲁番地区|克孜勒苏柯尔克孜自治州|昌吉回族自治州|伊犁哈萨克自治州|阿勒泰地区|塔城地区|阿克苏地区|乌鲁木齐市|博尔塔拉蒙古自治州|克拉玛依市|和田地区'
    );
    SelectOptions.buildOneProvince(
      ret,
      '西藏自治区',
      '昌都市|那曲地区|林芝市|阿里地区|日喀则市|拉萨市|山南市'
    );
    SelectOptions.buildOneProvince(
      ret,
      '内蒙古自治区',
      '乌海市|乌兰察布市|呼和浩特市|鄂尔多斯市|锡林郭勒盟|呼伦贝尔市|巴彦淖尔市|阿拉善盟|包头市|赤峰市|通辽市|兴安盟'
    );
    SelectOptions.buildOneProvince(ret, '香港特别行政区', '香港特别行政区');
    SelectOptions.buildOneProvince(ret, '澳门特别行政区', '澳门特别行政区');
    SelectOptions.buildOneProvince(ret, '台湾省', '台湾省');

    SelectOptions.provinceCityCache = ret;
    return ret;
  }
  private static buildaccountsreceivable(): {} {
    if (!isNullOrUndefined(SelectOptions.accountsreceivable)) {
      return SelectOptions.accountsreceivable;
    }

    const ret = {
      firstPlaceHolder: '请选择',
      secondPlaceHolder: '请选择',
      first: [],
      second: [],
      third: {},
    };
    SelectOptions.buildOneProvince(ret, '商品类', '土建材料');
    SelectOptions.buildOneProvince(ret, '服务类', '上海市');
    SelectOptions.buildOneProvince(ret, '出租资产类', '天津市');
    SelectOptions.accountsreceivable = ret;
    return ret;
  }

  // 构建行业联动选项
  private static buildOrgIndustry(): {} {
    if (!isNullOrUndefined(SelectOptions.orgIndustryCache)) {
      return SelectOptions.orgIndustryCache;
    }

    const ret = {
      firstPlaceHolder: '请选择行业分类',
      secondPlaceHolder: '请选择行业',
      first: [],
      second: {},
    };
    SelectOptions.buildOneProvince(
      ret,
      'A.农、林、牧、渔业',
      '01.农业|02.林业|03.畜牧业|04.渔业|05.农、林、牧、渔服务业'
    );
    SelectOptions.buildOneProvince(
      ret,
      'B.采矿业',
      '06.煤炭开采和洗选业|07.石油和天然气开采业|08.黑色金属矿采选业|09.有色金属矿采选业|10.非金属矿采选业|11.开采辅助活动|12.其他采矿业'
    );
    SelectOptions.buildOneProvince(
      ret,
      'C.制造业',
      `13.农副食品加工业|14.食品制造业|15.酒、饮料和精制茶制造业|16.烟草制品业|17.纺织业|18.纺织服装、服饰业
            |19.皮革、毛皮、羽毛及其制品和制鞋业|20.木材加工和木、竹、藤、棕、草制品业|21.家具制造业|22.造纸和纸制品业|23.印刷和记录媒介复制业
            |24.文教、工美、体育和娱乐用品制造业|25.石油加工、炼焦和核燃料加工业|26.化学原料和化学制品制造业|27.医药制造业|28.化学纤维制造业
            |29.橡胶和塑料制品业|30.非金属矿物制品业|31.黑色金属冶炼和压延加工业|32.有色金属冶炼和压延加工业|33.金属制品业|34.通用设备制造业
            |35.专用设备制造业|36.汽车制造业|37.铁路、船舶、航空航天和其他运输设备制造业|38.电气机械和器材制造业|39.计算机、通信和其他电子设备制造业
            |40.仪器仪表制造业|41.其他制造业|42.废弃资源综合利用业|43.金属制品、机械和设备修理业`
    );
    SelectOptions.buildOneProvince(
      ret,
      'D.电力、热力、燃气及水生产和供应业',
      '44.电力、热力生产和供应业|45.燃气生产和供应业|46.水的生产和供应业'
    );
    SelectOptions.buildOneProvince(
      ret,
      'E.建筑业',
      '47.房屋建筑业|48.土木工程建筑业|49.建筑安装业|50.建筑装饰和其他建筑业'
    );
    SelectOptions.buildOneProvince(
      ret,
      'F.批发和零售业',
      '51.批发业|52.零售业'
    );
    SelectOptions.buildOneProvince(
      ret,
      'G.交通运输、仓储和邮政业',
      '53.铁路运输业|54.道路运输业|55.水上运输业|56.航空运输业|57.管道运输业|58.装卸搬运和运输代理业|59.仓储业|60.邮政业'
    );
    SelectOptions.buildOneProvince(
      ret,
      'H.住宿和餐饮业',
      '61.住宿业|62.餐饮业'
    );
    SelectOptions.buildOneProvince(
      ret,
      'I.信息传输、软件和信息技术服务业',
      '63.电信、广播电视和卫星传输服务|64.互联网和相关服务|65.软件和信息技术服务业'
    );
    SelectOptions.buildOneProvince(
      ret,
      'J.金融业',
      '66.货币金融服务|67.资本市场服务|68.保险业|69.其他金融业'
    );
    SelectOptions.buildOneProvince(ret, 'K.房地产业', '70.房地产业');
    SelectOptions.buildOneProvince(
      ret,
      'L.租赁和商务服务业',
      '71.租赁业|72.商务服务业'
    );
    SelectOptions.buildOneProvince(
      ret,
      'M.科学研究和技术服务业',
      '73.研究和试验发展|74.专业技术服务业|75.科技推广和应用服务业'
    );
    SelectOptions.buildOneProvince(
      ret,
      'N.水利、环境和公共设施管理业',
      '76.水利管理业|77.生态保护和环境治理业|78.公共设施管理业'
    );
    SelectOptions.buildOneProvince(
      ret,
      'O.居民服务、修理和其他服务业',
      '79.居民服务业|80.机动车、电子产品和日用产品修理业|81.其他服务业'
    );
    SelectOptions.buildOneProvince(ret, 'P.教育', '82.教育');
    SelectOptions.buildOneProvince(
      ret,
      'Q.卫生和社会工作',
      '83.卫生|84.社会工作'
    );
    SelectOptions.buildOneProvince(
      ret,
      'R.文化、体育和娱乐业',
      '85.新闻和出版业|86.广播、电视、电影和影视录音制作业|87.文化艺术业|88.体育|89.娱乐业'
    );

    SelectOptions.orgIndustryCache = ret;
    return ret;
  }

  // 构造银行卡列表下拉选项

  private static buildOneProvince(ret: any, province: string, cities: string) {
    ret.first.push({ label: province, value: province });

    const second = [];
    for (const city of cities.split('|')) {
      second.push({ label: city, value: city });
    }
    ret.second[province] = second;
  }

  static get(name: string): any[] {
    return SelectOptions.configs[name];
  }

  static set(checker: any, name: string) {
    if (Object.keys(SelectOptions.configs).includes(name)) {
      throw new Error(`已存在${name}的属性值！`);
    }
    SelectOptions.configs[name] = checker as SelectItemsModel[];
  }

  static getLabel(options: any[], value: any): string {
    if (!(options == null || options.length === 0)) {
      for (const option of options) {
        if (option.value === value) {
          return option.label;
        }
      }
    }

    return '';
  }

  static getConfLabel(confName: string, value: string): string {
    const options = this.configs[confName];
    if (!!options) {
      for (const option of options) {
        if (option.value.toString() === value.toString()) {
          return option.label;
        }
      }
    }

    return '';
  }

  static getConfValue(confName: string, label: string): string {
    const options = this.configs[confName];
    if (!!options) {
      for (const option of options) {
        if (option.label === label) {
          return option.value;
        }
      }
    }

    return '';
  }
  static getProvinceCity() {
    if (SelectOptions.provinceCityCache2) {
      return SelectOptions.provinceCityCache2;
    }
    const data =
      SelectOptions.provinceCityCache || SelectOptions.buildProvinceCity();
    const province = data.first;
    const city = data.second;
    province.forEach((c) => {
      for (const i in city) {
        if (i === c.value) {
          c.children = city[i];
        }
      }
    });
    SelectOptions.provinceCityCache2 = province;
    return province;
  }
}
