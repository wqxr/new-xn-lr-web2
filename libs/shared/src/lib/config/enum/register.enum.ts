/*************************************************************************
 * Copyright (c) 2017 - 2021 深圳市链融科技股份有限公司
 * Shenzhen Lianrong Technology Co., Ltd.
 * All rights reserved.
 *
 * @file：libs\shared\src\lib\config\enum\register.enum.ts
 * @summary：注册相关枚举
 * @version: 1.0
 * *************************************************************************
 * revision             author            reason             date
 * 1.0                  DengPei           init               2021-07-28
 ***************************************************************************/

/** 注册所处状态 */
export enum RegisterStateEnum {
  /** 草稿 */
  Draft = 0,
  /** 未生效 */
  NotActive = 1,
  /** 已生效 */
  InForce = 2
}

/** 注册流程类型 */
export enum RegisterFlowTypes {
  /** 默认注册流程 */
  PatternWithAgency = 'patternWithAgency',
  /** 保函通-注册流程 */
  PatternWithGuaranteeAgency = 'patternWithGuaranteeAgency'
}

/** 注册流程类型 */
export enum RegisterFlowType {
  /** 默认注册流程 */
  PatternWithAgency = 0,
  /** 保函通-注册流程 */
  PatternWithGuaranteeAgency = 1
}

/** 注册流程类型 */
export enum RegisterRouterUrl {
  /** 默认注册流程 */
  PatternWithAgency = '/registry',
  /** 保函通-注册流程 */
  PatternWithGuaranteeAgency = '/guarantee/register/flow/index'
}

/** 产品树节点key */
export enum ProductNodeKey {
  /** 默认注册流程 */
  id = 0,
  /** 保函通-注册流程 */
  code = 1
}

/** 保函通-机构类型 */
export enum GuaranteeAgencyTypes {
  /** 平台 */
  Platform = 0,
  /** 投标人 */
  Bidder = 1, 
  /** 担保机构 */
  Guarantee = 2,
  /** 出函机构 */
  Letter = 3,
  /** 招标人 */
  Bidding = 4,
  /** 中介 */
  Intermediary = 5,
  /** 游客 */
  Guest = 6
}
