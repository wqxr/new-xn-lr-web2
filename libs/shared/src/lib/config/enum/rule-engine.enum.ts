/*************************************************************************
* Copyright (c) 2017 - 2021 深圳市链融科技股份有限公司
* Shenzhen Lianrong Technology Co., Ltd.
* All rights reserved.
*
* @file：libs\shared\src\lib\config\enum\rule-engine.enum.ts
* @summary：规则引擎审核结果用到的枚举类型
* @version: 1.0
* *************************************************************************
* revision             author            reason             date
* 1.0                 hucongying          init           2021-09-08
***************************************************************************/

/** 规则审核结果类型枚举 */
export enum ResultTypeEnum {
  /** 通过 */
  SUCCESS = '通过',
  /** 异常 */
  ERROR = '异常'
}

/** 规则校验类型枚举 */
export enum RuleValidTypeEnum {
  /** 硬控 */
  HARD_CONTROL = 1,
  /** 强提醒 */
  STRONG_REMINDER = 2,
  /** 非硬控 */
  NON_HARD_CONTROL = 3,
}

/** 强提醒处理方式枚举 */
export enum RuleHandTypeEnum {
  /** 添加备注 */
  ADD_REMARK = '1',
  /** 补充文件 */
  ADD_FILE = '2',
}

/** 人工审核标准勾选状态 */
export enum StandCheckStatuEnum {
  /** 通过 */
  SUCCESS = 1,
  /** 异常 */
  ERROR = 0
}

/** 文件操作类型枚举 */
export enum FileOperateEnum {
  /** 修改文件 */
  CHANGE_FILE = '修改文件',
  /**上传文件 */
  UPLOAD_FILE = '上传特殊事项审批表',
}

/** 规则引擎审核页面，操作按钮类型枚举 */
export enum RuleOperateTypeEnum {
  /** 保存按钮 */
  SAVE = 1,
  /** 确定按钮 */
  OK,
}
