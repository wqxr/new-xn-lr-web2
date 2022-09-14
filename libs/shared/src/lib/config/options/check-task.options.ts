/*************************************************************************
* Copyright (c) 2017 - 2021 深圳市链融科技股份有限公司
* Shenzhen Lianrong Technology Co., Ltd.
* All rights reserved.
*
* @file：libs\shared\src\lib\config\options\check-task.options.ts
* @summary：审核任务管理模块options
* @version: 1.0
* *************************************************************************
* revision             author            reason             date
* 1.0                 hucongying          init           2021-09-10
***************************************************************************/

import { SelectItemsModel } from "../checkers";

/** 审核任务状态 */
export const TaskStatus: SelectItemsModel[] = [
  { label: '待分配', value: 1 },
  { label: '已分配', value: 2 },
  { label: '已完成', value: 3 },
]

/** 审核任务交易状态 */
export const TradeStatus: SelectItemsModel[] = [
  /** 万科 */
  { label: '保理预录入', value: 'vanke_financing_pre' },
  { label: '供应商上传资料', value: 'vanke_financing' },
  { label: '平台初审', value: 'vanke_abs_step_platform_verify_operate' },
  { label: '平台复核', value: 'vanke_abs_step_platform_verify_review' },
  { label: '平台审核', value: 'vanke_platform_verify' },
  { label: '保理商风险审核', value: 'vanke_factoring_risk' },
  { label: '供应商签署合同', value: 'vanke_financing_sign' },
  { label: '保理商回传合同', value: 'vanke_factoring_passback' },
  /** 龙光 */
  { label: '保理商预录入', value: 'dragon_financing_pre' },
  { label: '供应商上传资料', value: 'dragon_financing' },
  { label: '平台审核', value: 'dragon_platform_verify' },
  { label: '供应商签署合同', value: 'dragon_supplier_sign' },
  /** 华侨城 */
  { label: '保理预录入', value: 'oct_financing_pre' },
  { label: '供应商上传资料', value: 'oct_financing' },
  { label: '平台审核', value: 'oct_platform_verify' },
  { label: '保理商风险审核', value: 'oct_factoring_risk' },
  { label: '供应商签署合同', value: 'oct_financing_sign' },
  { label: '保理商回传合同', value: 'oct_factoring_passback' },
  /** 碧桂园 */
  { label: '平台预录入', value: 'bgy_financing_pre' },
  { label: '供应商上传资料', value: 'bgy_financing' },
  { label: '平台审核', value: 'bgy_platform_verify' },
  { label: '保理商风险审核', value: 'bgy_factoring_risk' },
  { label: '供应商签署合同', value: 'bgy_financing_sign' },
  /** 万科上海银行 */
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
  /** 万科上海银行-退回审核 */
  { label: '平台审核', value: 'sub_sh_platform_check_retreat' },
  /** 金地 */
  { label: '平台预录入', value: 'jd_financing_pre' },
  { label: '供应商上传资料', value: 'jd_financing' },
  { label: '平台审核', value: 'jd_platform_verify' },
  { label: '保理商风险审核', value: 'jd_factoring_risk' },
  { label: '项目公司确认应收账款金额', value: 'jd_confirm_receive' },
  { label: '供应商签署合同', value: 'jd_financing_sign' },
  { label: '保理商回传合同', value: 'jd_factoring_passback' },
  /** 雅居乐 */
  { label: '保理商预录入', value: 'yjl_financing_pre' },
  { label: '供应商上传资料', value: 'yjl_financing' },
  { label: '平台审核', value: 'yjl_platform_verify' },
  { label: '保理商风险审核', value: 'yjl_factoring_risk' },
  { label: '供应商签署合同', value: 'yjl_financing_sign' },
  { label: '保理商回传合同', value: 'yjl_factoring_passback' },
  /** 雅居乐-星顺 */
  { label: '保理商预录入', value: 'yjl_financing_pre_common' },
  { label: '供应商上传资料', value: 'yjl_financing_common' },
  { label: '平台审核', value: 'yjl_platform_verify_common' },
  { label: '保理商风险审核', value: 'yjl_factoring_risk_common' },
  { label: '供应商签署合同', value: 'yjl_financing_sign_common' },
  { label: '保理商回传合同', value: 'yjl_factoring_passback_common' },
  /** 审批放款状态 */
  { label: '待审批', value: 'wait_verification_500' },
  { label: '审批中', value: 'verificating_500' },
  { label: '保理商签署合同', value: 'factoring_sign_500' },
  { label: '待财务审批', value: 'wait_finance_500' },
  { label: '待放款', value: 'wait_loan_500' },
  { label: '已放款', value: 'loaded_500' },
  { label: '已回款', value: 'repayment_500' },
  { label: '中止', value: 99 },
  { label: '退单', value: 100 },


]
