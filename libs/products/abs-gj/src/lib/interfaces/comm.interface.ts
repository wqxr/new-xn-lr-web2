/*************************************************************************
 * Copyright (c) 2017 - 2021 深圳市链融科技股份有限公司
 * Shenzhen Lianrong Technology Co., Ltd.
 * All rights reserved.
 *
 * @file：libs\products\abs-gj\src\lib\interfaces\comm.interface.ts
 * @summary：comm.interface.ts
 * @version: 1.0
 * *************************************************************************
 * revision             author            reason             date
 * 1.0                  DengPei           init               2021-11-27
 ***************************************************************************/

export interface IPageConfig {
  /** 每页数量 */
  pageSize?: number;
  /** 当前页 */
  page: number;
  /** 当前页起始记录索引 */
  first: number;
  /** 列表条总数 */
  total?: number;
}

export interface ISortParam {
  /** 排序的列 */
  name: string;
  /** 排序参数 */
  asc: 1 | -1;
}
