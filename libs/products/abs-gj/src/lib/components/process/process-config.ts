/*************************************************************************
 * Copyright (c) 2017 - 2021 深圳市链融科技股份有限公司
 * Shenzhen Lianrong Technology Co., Ltd.
 * All rights reserved.
 *
 * @file：libs\products\abs-gj\src\lib\components\process\mock-process.ts
 * @summary：请求当前流程步骤的配置
 * @version: 1.0
 * *************************************************************************
 * revision             author            reason             date
 * 1.0                  DengPei           init               2021-11-24
 ***************************************************************************/

import { FlowId } from '../../../../../../shared/src/lib/config/enum';

export default class Process {
  static configs = [
    /** modelId 用于发起请求，由后台提供，flowId 当前产品提单流程ID */
    {flowId: FlowId.GjFinancingPre, modelId: 'cdr_abs', status: 1, name: '成都轨交发起提单', version: 1},
  ];

  static get(flowId) {
    return Process.configs.filter(item => item.flowId === flowId);
  }
}
