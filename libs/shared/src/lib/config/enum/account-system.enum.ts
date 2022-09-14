/*************************************************************************
* Copyright (c) 2017 - 2021 深圳市链融科技股份有限公司
* Shenzhen Lianrong Technology Co., Ltd.
* All rights reserved.
*
* @file：libs\shared\src\lib\config\enum\account-info.enum.ts
* @summary：账户体系枚举文件
* @version: 1.0
* *************************************************************************
* revision             author            reason             date
* 1.0                 hucongying          init           2021-10-27
***************************************************************************/

/** 电子账本状态 */
export enum AccountStatusTypeEnum {
  /** 已提交 */
  SUBMITTED = '0',
  /** 待激活  */
  NEED_ACTIVE = '1',
  /** 已开户 */
  ACCOUNT_OPENED = '2',
  /** 已注销  */
  LOGGED_OUT = '3',
  /** 已取消 */
  CANCELLED = '4',
  /** 未开户 */
  NO_ACCOUNT = '5',
  /** 工商信息未激活(只在修改企业名称时出现) */
  MODIFIY = '6',
  /** 开户审核-初审 */
  OPEN_BEGIN = '7',
  /** 开户审核-复核 */
  OPEN_REVIEW = '8',
  /** 开户审核-退回 */
  OPEN_REJECT= '9',
  /** 开户信息待确认 */
  OPEN_CONFIRM = '10',
  /** 修改经办人信息-初审 */
  OPERATOR_BEGIN = '11',
  /** 修改经办人信息-复核 */
  OPERATOR_REVIEW = '12',
  /** 修改经办人信息-退回 */
  OPERATOR_REJECT = '13',
  /** 修改经办人信息待用户确认 */
  OPERATOR_CONFIRM = '14',
  /** 修改工商信息-初审 */
  BUSINESS_BEGIN = '15',
  /** 修改工商信息-复核 */
  BUSINESS_REVIEW = '16',
  /** 修改工商信息-退回 */
  BUSINESS_REJECT = '17',
  /** 修改工商信息待用户确认 */
  BUSINESS_CONFIRM = '18',
  /** 经办人信息未激活 */
  OPERATOR_UNACTIVE = '19',

}

/** 模板下载枚举 */
export enum TemplateTypeEnum {
  /** 企业上传模板 */
  UPLOAD_COMPANY = '0',
}

/** 账户体系银行类型枚举 */
export enum BankTypeEnum {
  /** 上海银行 */
  SH_BANK = '0',
}

/** 是否是第一次开户 */
export enum AccountApplyEnum {
  /** 第一次开户 */
  IS_FIRST = 1,
  /** 非第一次开户 */
  NO_FIRST = 0,
}

/** 证件信息审核状态 */
export enum AuditStatusEnum {
  /** 待审核 */
  PENDING_REVIEW = '0',
  /** 已审核 */
  AUDITED = '1',
  /** 审核失败 */
  AUDIT_FAILURE = '2',
}
/** 账户信息激活状态 */
export enum InfoActiveEnum {
  /** 未激活 */
  INACTIVATED = 0,
  /** 已激活 */
  ACTIVATED = 1,
}

/** 账户体系地区层级类型 */
export enum AreaLevelEnum {
  /** 省 */
  PROVINCE = '1',
  /** 市 */
  CITY = '2',
  /** 区 */
  AREA = '3',
  /** 地区 */
  REGION = '4',
}

/** 系统类型 */
export enum SystemCodeEnum {
  /** 链融系统 */
  XN_LR = 'xn-lr',
}

/** 账户体系交易状态 */
export enum TradeStatusEnum {
  /** 交易中 */
  IN_TRANSACTION = '0',
  /** 成功 */
  SUCCESS = '1',
  /** 失败 */
  ERROR = '2',
  /** 未明 */
  UNKNOW = '3',
  /** 已退汇 */
  REFUNDED = '4',
}

/** 是否为主绑卡 */
export enum IsMainCardEnum {
  /** 否 */
  NO = 0,
  /** 是 */
  YES = 1,
}

/** 文件上传状态枚举 */
export enum FileUploadStatusEnum {
  /** error */
  ERROR = 'error',
  /** success */
  SUCCESS = 'success',
  /** done */
  DONE = 'done',
  /** uploading */
  UPLOADING = 'uploading',
  /** removed */
  REMOVED = 'removed',
}

/** 行业层级枚举 */
export enum IndustryLevelEnum {
  UNKNOW = 0,
  /** 第一层 */
  FIRST = 1,
  /** 第二层 */
  SECOND = 2,
  /** 第三层 */
  THIRD = 3,
  /** 第四层 */
  FOURTH = 4,
}

/** 中台服请求响应状态码 */
export enum MiddleResCodeEnum {
  /** 成功 */
  SUCCESS = 0,
  /** 系统繁忙 */
  ERROR = 1,
  /** 无效的参数 */
  INVALID_PARAMETERS = 400,
  /** 登录已经超时 */
  FORBIDDEN = 401,
  /** 缺少参数 */
  MISSING_PARAMETER = 402,
  /** 无操作权限 */
  UNAUTHORIZED = 403,
  /** URL地址不存在 */
  NOT_FOUND = 404,
  /** 网络请求错误, 请求方法未允许 */
  REQUEST_REQUIRED = 405,
  /** 登录未选择机构 */
  LOGIN_ORG_NO_SELECTED = 412,
  /** 不支持的媒体类型 */
  CONTENT_TYPE_INVALID = 415,
  /** 网关网络超时 */
  GATEWAY_REQUEST_TIMEOUT = 504,
  /** 服务器错误, 请联系管理员 */
  SYSTEM_ERROR = 500,
}

/** 页面类型 */
export enum PageTypeEnum {
  /** 平台查看 */
  READ = 'read',
  /** 平台审核-初审 */
  CHECK_AUDIT = 'checkAudit',
  /** 平台审核-复核 */
  CHECK_REVIEW = 'checkReview',
  /** 查看 */
  VIEW = 'view',
  /** 修改 */
  EDIT = 'edit',
  /** 确认修改 */
  CONFIRM = 'confirm',
}

/** 操作记录类型枚举 */
export enum RecordTypeEnum {
  /** 账户体系开户 */
  OPEN_ACCOUNT = '0',
  /** 账户体系修改经办人信息 */
  MODIFIY_OPERATOR = '1',
  /** 账户体系修改工商信息 */
  MODIFIY_BUSINESS = '2',
}

/** 操作记录步骤枚举 */
export enum RecordStepEnum {
  /** 提交开户申请信息 */
  OPEN_ACCOUNT = '0',
  /** 补充开户信息 */
  SUPPLY_ACCOUNT = '1',
  /** 开户审核-初审 */
  OPEN_BEGIN = '2',
  /** 开户审核-复核 */
  OPEN_REVIEW = '3',
  /** 确认开户 */
  CONFIRM_OPEN= '4',
  /** 激活账户 */
  ACTIVE_ACCOUNT = '5',
  /** 开户审核-审核退回 */
  OPEN_REJECT= '6',
  /** 取消开户 */
  CANCEL_OPEN = '7',
  /** 注销账户 */
  REMOVE_ACCOUNT = '8',
  /** 初始化经办人信息 */
  OPERATOR_INIT = '9',
  /** 修改经办人信息 */
  MODIFIY_OPERATOR = '10',
  /** 修改经办人信息审核-初审 */
  OPERATOR_BEGIN = '11',
  /** 修改经办人信息审核-复核 */
  OPERATOR_REVIEW = '12',
  /** 修改经办人信息审核-审核退回 */
  OPERATOR_REJECT = '13',
  /** 确认修改经办人信息 */
  OPERATOR_CONFIRM = '14',
  /** 取消修改经办人信息 */
  CANCEL_OPERATOR = '15',
  /** 激活经办人信息 */
  ACTIVE_OPERATOR = '16',
  /** 初始化工商信息 */
  BUSINESS_INIT = '17',
  /** 修改工商信息 */
  MODIFIY_BUSINESS = '18',
  /** 修改工商信息审核-初审 */
  BUSINESS_BEGIN = '19',
  /** 修改工商信息审核-复核 */
  BUSINESS_REVIEW = '20',
  /** 修改工商信息审核-审核退回 */
  BUSINESS_REJECT = '21',
  /** 确认修改工商信息 */
  BUSINESS_CONFIRM = '22',
  /** 取消修改工商信息 */
  CANCEL_BUSINESS = '23',
  /** 激活工商信息 */
  ACTIVE_BUSINESS = '24',
}
