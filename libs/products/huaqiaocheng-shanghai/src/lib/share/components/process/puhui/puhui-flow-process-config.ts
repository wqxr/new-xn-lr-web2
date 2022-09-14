/*************************************************************************
* Copyright (c) 2017 - 2021 深圳市链融科技股份有限公司
* Shenzhen Lianrong Technology Co., Ltd.
* All rights reserved.
*
* @file：libs\products\bank-shanghai\src\lib\share\components\process\puhui\puhui-flow-process-config.ts
* @summary：流程导航栏配置
* @version: 1.0
* *************************************************************************
* revision             author            reason             date
* 1.0                 hucongying           init          2021-07-20
***************************************************************************/
import { FlowProcessStatusEnum } from "../../../../logic/public-enum"

/** 供应商发起开户 */
export const supplierProcessJson = [
  {
    id: '2901', subList: [{ id: '290101', name: '普惠记账簿开户申请', status: FlowProcessStatusEnum.current, flowId: 'sub_so_prattwhitney_platform_input' }],
    status: FlowProcessStatusEnum.disabled
  },
  {
    id: '2902', subList: [{ id: '290201', name: '普惠开户审核', status: FlowProcessStatusEnum.disabled, flowId: 'sub_so_prattwhitney_platform_verify' }],
    status: FlowProcessStatusEnum.disabled
  },
  {
    id: '2903', subList: [{ id: '290301', name: '激活对公账户', status: FlowProcessStatusEnum.disabled, flowId: '' }],
    status: FlowProcessStatusEnum.disabled
  },
  {
    id: '2904', subList: [{ id: '290401', name: '完成', status: FlowProcessStatusEnum.disabled, flowId: '' }],
    status: FlowProcessStatusEnum.disabled
  },
]
/** 平台审核 */
export const platProcessJson = [
  {
    id: '2901', subList: [{ id: '290101', name: '普惠记账簿开户申请', status: FlowProcessStatusEnum.success, flowId: 'sub_so_prattwhitney_platform_input' }],
    status: FlowProcessStatusEnum.disabled
  },
  {
    id: '2902', subList: [{ id: '290201', name: '普惠开户审核', status: FlowProcessStatusEnum.current, flowId: 'sub_so_prattwhitney_platform_verify' }],
    status: FlowProcessStatusEnum.disabled
  },
  {
    id: '2903', subList: [{ id: '290301', name: '激活对公账户', status: FlowProcessStatusEnum.disabled, flowId: '' }],
    status: FlowProcessStatusEnum.disabled
  },
  {
    id: '2904', subList: [{ id: '290401', name: '完成', status: FlowProcessStatusEnum.disabled, flowId: '' }],
    status: FlowProcessStatusEnum.disabled
  },
]
