/*************************************************************************
* Copyright (c) 2017 - 2021 深圳市链融科技股份有限公司
* Shenzhen Lianrong Technology Co., Ltd.
* All rights reserved.
*
* @file：libs\shared\src\lib\config\enum\shanghai-bank-puhui-enum.ts
* @summary：上海银行普惠开户枚举
* @version: 1.0
* *************************************************************************
* revision             author            reason             date
* 1.0                 hucongying          init           2021-03-03
***************************************************************************/

/** 办理类型枚举 */
export const enum AppApplyTypeEnum {
  /** 法人亲办 */
  LEGAL_PERSON = 1,
  /** 企业授权经办人办理 */
  MANAGER = 2
};

/** 平台审核资料状态 CheckStatus */
export const enum CheckStatus {
  /** 未审核 */
  UNCHECK = -1,
  /** 审核通过 */
  PASS = 1,
  /** 审核不通过 */
  UNPASS = 0
};

/** 开户流程步骤 */
export enum StepValueEnum {
  /** 第一步 */
  FIRST = 1,
  /** 第二步 */
  SECOND = 2,
  /** 第三步 */
  THIRD = 3
}

/** 开户状态状态枚举 */
export const enum OpenAccountStatusEnum {
  /** 待开户 */
  UNOPEN = 0,
  /** 已开户 */
  OPENED = 1,
}

/** 对公账户激活状态枚举 */
export const enum AccountStatusEnum {
  /** 未通过 */
  UNPASS = 0,
  /** 待激活 */
  NEED_ACTIVE = 1,
  /** 已激活 */
  ACTIVED = 2,
}

/** tab页下标枚举 */
export const enum TabIndexEnum {
  /** 首页 */
  FIRST = 0,
  /** 第二页 */
  SECOND = 1,
  /** 第三页 */
  THIRD = 2,
  /** 第四页 */
  FOURTH = 3,
  /** 第五页 */
  FIFTH = 4
}

/** 上海银行普惠开户流程flowId枚举 */
export const enum ShPuhuiFlowIdEnum {
  /** 供应商普惠开户申请 */
  SUB_SH_PRATTWHITNEY_INPUT = 'sub_sh_prattwhitney_input',
  /** 平台审核普惠开户申请 */
  SUB_SH_PRATTWHITNEY_PLATFORM_VERIFY = 'sub_sh_prattwhitney_platform_verify',
  /** 供应商普惠开户激活对公账号 */
  SUB_SH_PRATTWHITNEY_ACCOUNT_ACTIVE = 'sub_sh_prattwhitney_account_active',
  /** 上海银行审核供应商普惠记账簿开户申请 */
  SUB_SH_PRATTWHITNEY_BANK_VERIFY = 'sub_sh_prattwhitney_bank_verify',
  /** 华侨城-上海银行---供应商普惠开户申请 */
  SUB_SO_PRATTWHITNEY_INPUT = 'sub_so_prattwhitney_input',
  /** 华侨城-上海银行---平台审核普惠开户申请 */
  SUB_SO_PRATTWHITNEY_PLATFORM_VERIFY = 'sub_so_prattwhitney_platform_verify',
  /** 华侨城-上海银行---供应商普惠开户激活对公账号 */
  SUB_SO_PRATTWHITNEY_ACCOUNT_ACTIVE = 'sub_so_prattwhitney_account_active',
  /** 华侨城-上海银行---上海银行审核供应商普惠记账簿开户申请 */
  SUB_SO_PRATTWHITNEY_BANK_VERIFY = 'sub_so_prattwhitney_bank_verify',
}

/** 普惠账户更新状态类型 */
export const enum ShEAccountUpdateType {
  /** 不需要更新 */
  NONE = 0,
  /** 更新审核状态 */
  APPLYVERIFY = 1,   // 账户审核
  /** 更新激活状态 */
  ACCOUNTACTIVE = 2,   // 账户激活
}

/** 修改已激活账号绑定卡状态枚举 */
export const enum ModifyBindStatusEnum {
  /** 未通过 */
  UNPASS = 0,
  /** 待激活 */
  NEED_ACTIVE = 1,
  /** 已激活 */
  ACTIVED = 2,
}

/** 供应商上传开户视频方式枚举 */
export const enum VideoUploadTypeEnum {
  /** 本地上传 */
  LOCAL = '1',
  /** 扫码上传*/
  SCAN_CODE = '2'
}

/** 办理类型枚举 */
export const enum ApplyTypeEnum {
  /** 法人亲办 */
  LEGAL_PERSON = '1',
  /** 企业授权经办人办理 */
  MANAGER = '2'
};

/** 股东性质类型枚举 */
export const enum ShareholderTypesEnum {
  /** 直接或间接拥有25%以上股份的控股股东-自然人 */
  NATURAL_PERSON = '1',
  /** 直接或间接拥有25%以上股份的控股股东-企业 */
  ENTERPRISE = '2',
  /** 通过人事、财务控制等方式对公司进行控制的自然人 */
  PERSONNEL = '3'
};

/** 受益所有人性质枚举 */
export const enum EarningOwnerTypeEnum {
  /** 直接或间接拥有超过25%公司股权或者表决权的自然人 */
  NATURAL_PERSON = '1',
  /** 通过人事、财务等其他方式对公司进行控制的自然人 */
  PERSONNEL = '2',
  /** 高级管理人员 */
  SENIOR_MANAGEMENT = '3',
  /** 普通合伙人或者合伙事务执行人 */
  GENERAL_PARTNER = '4',
  /** 其它 */
  OTHER = '5'
};

/** 股东证件类型枚举 */
export const enum ShareholderCardeEnum {
  /** 身份证 */
  IDCARD = '10100',
  /** 临时身份证 */
  TEMPORARY_IDCARD = '10200',
  /** 护照 */
  PASSPORT = '10400',
  /** 港澳居民来往内地通行证 */
  GA_CARD = '11100',
  /** 台湾居民来往大陆通行证 */
  TW_CARD = '11300',
  /** 企业营业执照 */
  BUSINESS_LICENSE = '20600',
};

