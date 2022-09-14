/*************************************************************************
* Copyright (c) 2017 - 2021 深圳市链融科技股份有限公司
* Shenzhen Lianrong Technology Co., Ltd.
* All rights reserved.
*
* @file：libs\shared\src\lib\config\enum\check-task.enum.ts
* @summary：分单模块枚举
* @version: 1.0
* *************************************************************************
* revision             author            reason             date
* 1.0                 hucongying          init           2021-09-23
***************************************************************************/

/** 当前标签页标识 */
export enum TabListIndexEnum {
  /** 待分配 */
  NO_ASSIGN = 'A',
  /** 已分配 */
  ASSIGN = 'B',
}

/** 子页面标识 */
export enum SubTabListEnum {
  /** 准备 */
  TODO = 'TODO',
  /** 进行中 */
  DOING = 'DOING',
}

/** 审核任务状态 */
export enum TaskStatusEnum {
  /** 待分配 */
  WAIT_ALLOCATION = 1,
  /** 已分配 */
  ALLOCATED = 2,
  /** 已完成 */
  DONE = 3
}
