/*************************************************************************
 * Copyright (c) 2017 - 2021 深圳市链融科技股份有限公司
 * Shenzhen Lianrong Technology Co., Ltd.
 * All rights reserved.
 *
 * @file：libs\shared\src\lib\config\options\abs-gj.options.ts
 * @summary：abs-gj.options.ts
 * @version: 1.0
 * *************************************************************************
 * revision             author            reason             date
 * 1.0                  DengPei           init               2021-11-22
 ***************************************************************************/

import { SelectItemsModel } from '../checkers';
import {
  Channel,
  CompanyName,
  FlowId,
  RecordStatus,
  ProgressStep,
  YesOrNo,
  Signer, ContractTempStatus
} from '../enum';

/** 提单状态 */
export const RecordStatusOptions: SelectItemsModel[] = [
  {label: '草稿', value: RecordStatus.Draft},
  {label: '进行中', value: RecordStatus.Progress},
  {label: '已完结', value: RecordStatus.Finished},
  {label: '已中止', value: RecordStatus.Aborted},
];

/**
 * 提单页面【查询条件】、【发起交易申请】 -- 渠道
 * 拟入池交易列表【查询条件】 -- 渠道
 */
export const GjChannelOptions: SelectItemsModel[] = [
  {label: 'ABS', value: Channel.ABS},
];

/**  */
/**
 * 提单页面【发起交易申请】 -- 总部公司
 * 拟入池交易列表页面【查询条件】 -- 总部公司
 */
export const CompanyNameOptions: SelectItemsModel[] = [
  {label: '成都轨道交通集团有限公司', value: CompanyName.CDR},
];

/** 待办页面【查询条件】 -- 当前步骤 */
export const ProgressStepOptions: SelectItemsModel[] = [
  {label: '经办', value: ProgressStep.Begin},
  {label: '初审', value: ProgressStep.Operate},
  {label: '复核', value: ProgressStep.Review},
  {label: '高管复核', value: ProgressStep.WindReview},
  {label: '风险复核', value: ProgressStep.RiskReview},
];

/**
 * 待办页面【查询条件】 -- 履约证明
 *
 * 应收账款转让回执列表页面【查询条件】
 * 《项目公司回执（一次转让)》/《项目公司回执（二次转让)》/《债权转让及账户变更通知的补充说明》
 *
 * 拟入池交易列表页面【查询条件】 -- 实际上传发票与预录入是否一致
 *
 * formly-form 组件 per-date-picker，per-text 中使用
 */
export const IsPerformanceOptions: SelectItemsModel[] = [
  {label: '有', value: YesOrNo.Yes},
  {label: '无', value: YesOrNo.No},
];

/**
 * 台账页面【补充资料弹窗】 -- 是否需后补资料
 */
export const IsBackUpOptions: SelectItemsModel[] = [
  {label: '有', value: YesOrNo.Yes},
  {label: '否', value: YesOrNo.PnNo},
];

/** 待办页面【查询条件】 -- 待办类型 */
export const TaskFlowIdOptions: SelectItemsModel[] = [
  {label: '一次转让合同组新增', value: FlowId.CMNAddFirstContract},
  {label: '一次转让合同组删除', value: FlowId.CMNDelFirstContract},
  {label: '一次转让合同组修改', value: FlowId.CMNEditFirstContract},
  {label: '平台审核退单', value: FlowId.CMNPlatRetreat},
  {label: '平台审核', value: FlowId.GjPlatformVerify},
  {label: '修改预录入信息', value: FlowId.CMNPreChange},
  {label: '中止', value: FlowId.CMNStop},
];

/** 项目公司补充资料交易列表页面【查询条件】 -- 交易状态 */
export const CoAddTradeStatusOptions: SelectItemsModel[] = [
  {label: '保理预录入', value: FlowId.GjFinancingPre},
  {label: '供应商上传资料', value: FlowId.GjFinancing},
  {label: '平台审核', value: FlowId.GjPlatformVerify},
  {label: '供应商签署合同', value: FlowId.GjSupplierSign},
];

/** 台账列表、拟入池交易列表页面【查询条件】 -- 交易状态 */
export const GjTradeStatusOptions: SelectItemsModel[] = [
  {label: '保理商预录入', value: FlowId.GjFinancingPre},
  {label: '供应商上传资料', value: FlowId.GjFinancing},
  {label: '平台审核', value: FlowId.GjPlatformVerify},
  {label: '保理商风险审核', value: FlowId.GjFactoringRisk},
  {label: '供应商签署合同', value: FlowId.GjSupplierSign},
  {label: '保理商回传合同', value: FlowId.GjFactoringPassback},
  {label: '待审批', value: FlowId.CMNWaitVerify},
  {label: '审批中', value: FlowId.CMNVerifying},
  {label: '保理商签署合同', value: FlowId.CMNFactoringSign},
  {label: '待财务审批', value: FlowId.CMNWaitFinance},
  {label: '待放款', value: FlowId.CMNWaitLoan},
  {label: '已放款', value: FlowId.CMNLoaned},
  {label: '已回款', value: FlowId.CMNRepayment},
];


/** 二次转让合同管理【查询条件】 -- 签署方 */
export const SignerOptions: SelectItemsModel[] = [
  {label: '总部公司', value: Signer.Head},
  {label: '收款单位', value: Signer.Unit},
  {label: '项目公司', value: Signer.Project},
  {label: '保理商', value: Signer.Factoring},
];

/** 二次转让合同管理【查询条件】 -- 合同模板状态 */
export const ContractTempStatusOptions: SelectItemsModel[] = [
  {label: '未生效', value: ContractTempStatus.NotActive},
  {label: '已生效', value: ContractTempStatus.Active},
];
