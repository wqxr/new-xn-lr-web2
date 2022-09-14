/*************************************************************************
 * Copyright (c) 2017 - 2021 深圳市链融科技股份有限公司
 * Shenzhen Lianrong Technology Co., Ltd.
 * All rights reserved.
 *
 * @file：libs\shared\src\lib\config\constants\common-constant.ts
 * @summary：全局定义的一些常量
 * @version: 1.0
 * *************************************************************************
 * revision             author            reason             date
 * 1.0                HuCongying           init           2021-12-22
 ***************************************************************************/

import { endOfDay, endOfMonth, startOfDay, startOfMonth, subDays, subMonths } from 'date-fns';

/** 时间选择器中字集合 */
const DATE_RANGE_CN = {
  now: '此刻',
  today: '今日',
  thisMonth: '本月',
  lastMonth: '上月',
  days7: '近7天',
  days30: '近30天',
  days90: '近90天',
  days180: '近180天',
  days365: '近365天',
};

/** nz-range-picker */
export const DEFAULT_DATE_TIME_OPTIONS = {
  nzMode: 'time',
  nzShowTime: true,
  nzFormat: 'yyyy-MM-dd HH:mm:ss',
  nzPlaceHolder: ['开始日期', '结束日期'],
  nzDefaultPickerValue: [],
  nzRanges: {
    [DATE_RANGE_CN.now]: () => [new Date(), new Date()],
    [DATE_RANGE_CN.today]: [startOfDay(new Date()), endOfDay(new Date())],
    [DATE_RANGE_CN.thisMonth]: [startOfMonth(new Date()), endOfMonth(new Date())],
    [DATE_RANGE_CN.days7]: [startOfDay(subDays(new Date(), 7)), endOfDay(new Date())],
    [DATE_RANGE_CN.days30]: [startOfDay(subDays(new Date(), 30)), endOfDay(new Date())],
    [DATE_RANGE_CN.days90]: [startOfDay(subDays(new Date(), 90)), endOfDay(new Date())],
    [DATE_RANGE_CN.days180]: [startOfDay(subDays(new Date(), 180)), endOfDay(new Date())],
    [DATE_RANGE_CN.days365]: [startOfDay(subDays(new Date(), 365)), endOfDay(new Date())],
    [DATE_RANGE_CN.lastMonth]: [startOfMonth(subMonths(new Date(), 1)), endOfMonth(subMonths(new Date(), 1))],
  },
};

/** table排序类型 */
export const LIST_SORT_TYPE = {
  /** 升序 */
  asc: 1,
  /** 降序 */
  desc: -1
};

/** 万科数据对接列表排序字段值 */
export const DOCKING_SORT_VALUE = {
  /** 保理融资到期日 */
  expiredDate: 1,
  /** 应收账款金额 */
  financingAmount: 2,
  /** 付款确认书编号 */
  transNumber: 3,
  /** 一线单据编号 */
  billNumber: 4,
  /** 交易id */
  mainFlowId: 5
};

/** 长期有效 */
export const LONG_DATE_SH = '2999-12-31';

