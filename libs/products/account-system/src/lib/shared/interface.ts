/*************************************************************************
* Copyright (c) 2017 - 2022 深圳市链融科技股份有限公司
* Shenzhen Lianrong Technology Co., Ltd.
* All rights reserved.
*
* @file：libs\products\account-system\src\lib\shared\components\modal\interface.ts
* @summary：init interface.ts
* @version: 1.0
* *************************************************************************
* revision             author            reason             date
* 1.0                HuCongying           init           2022-01-11
***************************************************************************/

/** 审核流程参数配置  */
export interface CheckParams {
  /** 账户Id */
  accountId: any,
  /** 流程类型 */
  flowType: string,
  /** 审核通过意见 */
  auditResult: boolean,
  /** 审核备注 */
  remark: string,
  /** 页面类型 */
  pageType: string,
  /** post url */
  postUrl: string,

}

/** 查询操作记录参数  */
export interface RecordTypeParams {
  /** 账户Id */
  accountId: any,
  /** 操作记录类型 */
  recordType: string,
}
