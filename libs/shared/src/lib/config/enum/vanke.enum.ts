/*************************************************************************
* Copyright (c) 2017 - 2021 深圳市链融科技股份有限公司
* Shenzhen Lianrong Technology Co., Ltd.
* All rights reserved.
*
* @file：libs\shared\src\lib\config\enum\vanke.enum.ts
* @summary：init 万科产品枚举
* @version: 1.0
* *************************************************************************
* revision             author            reason             date
* 1.0                HuCongying           init           2021-12-07
***************************************************************************/
/** 万科流程flowId枚举 */
export enum VankeFlowEnum {
  /** 保理预录入 */
  FinancingPre = 'vanke_financing_pre',
  /** 供应商上传资料 */
  Financing = 'vanke_financing',
  /** 平台审核 */
  PlatformVerify = 'vanke_platform_verify',
  /** 保理商风险审核 */
  FactoringRisk = 'vanke_factoring_risk',
  /** 供应商签署合同 */
  FinancingSign = 'vanke_financing_sign',
  /** 保理商回传合同 */
  FactoringPassback = 'vanke_factoring_passback',

  /** 分步提交-保理商预录入 */
  StepFinancingPre = 'vanke_abs_step_financing_pre',
  /** 分步提交-供应商上传资料 */
  StepFinancing = 'vanke_abs_step_financing',
  /** 分步提交-平台初审 */
  StepPlatformOperate = 'vanke_abs_step_platform_verify_operate',
  /** 分步提交-平台复核 */
  StepPlatformReview = 'vanke_abs_step_platform_verify_review',
  /** 分步提交-保理商风险审核 */
  StepFactoringRisk = 'vanke_abs_step_factoring_risk',
  /** 分步提交-供应商签署合同 */
  StepFinancingSign = 'vanke_abs_step_financing_sign',
  /** 分步提交-保理商回传合同 */
  StepFactoringPassback = 'vanke_abs_step_factoring_passback',

  /** 待审批 */
  WaitVerification = 'wait_verification_500',
  /** 审批中 */
  Verificating = 'verificating_500',
  /** 保理商签署合同 */
  FactoringSign = 'factoring_sign_500',
  /** 待财务审批 */
  WaitFinance = 'wait_finance_500',
  /** 待放款 */
  WaitLoan = 'wait_loan_500',
  /** 已放款 */
  Loaded = 'loaded_500',
  /** 已回款 */
  Repayment = 'repayment_500',
}

/** 万科交易暂停状态 */
export enum VankePauseStatus {
  /** 正常 */
  Normal = 0,
  /** 暂停（待万科修改） */
  Pause = 1,
  /** 暂停恢复 */
  Recover = 2,
}

/** 万科交易受理状态 */
export enum VankeAcceptStatus {
  /** 未受理 */
  NotAccepted = 0,
  /** 已受理 */
  Accepted = 1,
  /** 待万科受理 */
  Pending = 2,
  /** 恢复受理-待办恢复 */
  Recover = 3,
}
