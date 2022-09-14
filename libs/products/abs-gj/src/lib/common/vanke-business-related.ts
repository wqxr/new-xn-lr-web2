/*************************************************************************
 * Copyright (c) 2017 - 2021 深圳市链融科技股份有限公司
 * Shenzhen Lianrong Technology Co., Ltd.
 * All rights reserved.
 *
 * @file：libs\products\abs-gj\src\lib\common\vanke-business-related.ts
 * @summary：vanke-business-related.ts
 * @version: 1.0
 * *************************************************************************
 * revision             author            reason             date
 * 1.0                  DengPei           init               2021-11-25
 ***************************************************************************/
import { ListHeadsFieldOutputModel } from '../../../../../shared/src/lib/config/list-config-model';

export default class BusinessDataTabConfig {
  static businessRelated = {
    heads: [
      {label: '流程id', value: 'recordId', type: 'recordId', width: '19%'},
      {label: '流程类型', value: 'linkName', type: 'text', width: '10%'},
      {label: '流程', value: 'flowName', type: 'text', width: '10%'},
      {label: '当前步骤', value: 'nowProcedureName', width: '10%'},
      {label: '流程发起时间', value: 'createTime', type: 'date', width: '10%'},
      {label: '流程结束时间', value: 'updateTime', type: 'date', width: '10%'},
    ] as ListHeadsFieldOutputModel[],
  };
}
