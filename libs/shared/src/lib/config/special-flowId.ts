/*
 * Copyright(c) 2017-2019, 深圳市链融科技股份有限公司
 * Beijing Xiwei Technology Co., Ltd.
 * All rights reserved.
 *
 * @file：SpecialFlows
 * @summary：此文件下的flowId,在代办，编辑，查看，跳转至新的 `AvengerViewComponent`路径`record/avenger/:type/edit/:id`
 *  `AvengerViewComponent` 路径 ``
 * @version: 1.0
 * **********************************************************************
 * revision             author            reason             date
 * 1.0                 zhyuanan           新增             2019-05-18
 * **********************************************************************
 */

export const SpecialFlows = [
  // 采购融资主要流程id
  { flowId: 'financing_child_201', flowName: '供应商发起融资' },
  { flowId: 'financing_child_202', flowName: '上游客户上传资料' },
  { flowId: 'data_verification_201', flowName: '资料审核' },
  { flowId: 'risk_verification_201', flowName: '资料审核' },
  { flowId: 'supplier_sign_201', flowName: '供应商签署合同' },
  { flowId: 'supplier_sign_202', flowName: '上游客户签署合同' },
  { flowId: 'sub_approval_return_530', flowName: '回款匹配' },
] as Array<{ flowId: string; flowName: string }>;
