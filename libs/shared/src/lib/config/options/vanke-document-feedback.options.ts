/*************************************************************************
* Copyright (c) 2017 - 2022 深圳市链融科技股份有限公司
* Shenzhen Lianrong Technology Co., Ltd.
* All rights reserved.
*
* @file：libs\shared\src\lib\config\options\vanke-document-feedback.options.ts
* @summary：万科汇融文件反馈模块用到的options
* @version: 1.0
* *************************************************************************
* revision             author            reason             date
* 1.0                 hucongying          init           2022-04-01
***************************************************************************/

import { SelectItemsModel } from "../checkers";

/** 万科汇融文件：合同退回原因  */
export const VankeContratReasons: SelectItemsModel[] = [
  { label: '无合同影像件', value: '无合同影像件' },
  { label: '汇融提供的合同文件缺封面页', value: '汇融提供的合同文件缺封面页' },
  { label: '汇融提供的合同文件缺标的页', value: '汇融提供的合同文件缺标的页' },
  { label: '汇融提供的合同文件缺合同价款页', value: '汇融提供的合同文件缺合同价款页' },
  { label: '汇融提供的合同文件缺签章页', value: '汇融提供的合同文件缺签章页' },
  { label: '汇融提供的合同签章页章不完整', value: '汇融提供的合同签章页章不完整' },
  { label: '汇融提供的合同文件缺支付条款页', value: '汇融提供的合同文件缺支付条款页' },
  { label: '汇融提供的合同支付条款页不完整', value: '汇融提供的合同支付条款页不完整' },
  { label: '汇融提供的集采协议缺封面', value: '汇融提供的集采协议缺封面' },
  { label: '汇融提供的集采协议缺首页', value: '汇融提供的集采协议缺首页' },
  { label: '汇融提供的集采协议缺签章页', value: '汇融提供的集采协议缺签章页' },
  { label: '汇融提供的集采协议缺支付条款页', value: '汇融提供的集采协议缺支付条款页' },
  { label: '汇融提供的合同文件缺采筑系统订单详情截图', value: '汇融提供的合同文件缺采筑系统订单详情截图' },
  { label: '汇融提供的合同文件缺慧盟平台合同详情截图', value: '汇融提供的合同文件缺慧盟平台合同详情截图' },
  { label: '汇融提供的合同文件缺相关补充协议', value: '汇融提供的合同文件缺相关补充协议' },
  { label: '汇融提供的补充协议缺签章页', value: '汇融提供的补充协议缺签章页' },
  { label: '汇融提供的补充协议签章页章不完整', value: '汇融提供的补充协议签章页章不完整' },
  { label: '汇融提供的合同影像件与提单信息不一致', value: '汇融提供的合同影像件与提单信息不一致' },
]

/** 万科汇融文件：付款申请退回原因  */
export const VankePaymentReasons: SelectItemsModel[] = [
  { label: '未提供付款申请表', value: '未提供付款申请表' },
  { label: '汇融提供的付款申请表信息不完整', value: '汇融提供的付款申请表信息不完整' },
  { label: '付款申请表的应收账款金额与本次提单的应收账款金额不一致', value: '付款申请表的应收账款金额与本次提单的应收账款金额不一致' },
  { label: '汇融提供的付款申请表清晰度低', value: '汇融提供的付款申请表清晰度低' },
]

/** 万科汇融文件：产值确认单退回原因  */
export const VankeOutputReasons: SelectItemsModel[] = [
  { label: '未提供产值确认单', value: '未提供产值确认单' },
  { label: '产值确认单信息不完整', value: '产值确认单信息不完整' },
  { label: '产值确认单清晰度低', value: '产值确认单清晰度低' },
]

/** 万科汇融文件：竣工协议退回原因  */
export const VankeCompleteReasons: SelectItemsModel[] = [
  { label: '结算款未提供竣工协议', value: '结算款未提供竣工协议' },
  { label: '汇融提供的竣工协议内容与提单信息不一致', value: '汇融提供的竣工协议内容与提单信息不一致' },
  { label: '汇融提供的竣工协议中应付金额小于本次应收账款金额', value: '汇融提供的竣工协议中应付金额小于本次应收账款金额' },
  { label: '汇融提供的竣工协议清晰度低', value: '汇融提供的竣工协议清晰度低' },
  { label: '汇融提供的竣工协议中信息未填写完整', value: '汇融提供的竣工协议中信息未填写完整' },
]

/** 万科汇融文件：发票退回原因  */
export const VankeInvoiceReasons: SelectItemsModel[] = [
  { label: '缺少发票影像件', value: '缺少发票影像件' },
  { label: '发票影像件与汇融提供的发票信息不一致', value: '发票影像件与汇融提供的发票信息不一致' },
  { label: '发票已作废', value: '发票已作废' },
  { label: '发票已红冲', value: '发票已红冲' },
  { label: '发票影像件缺发票专用章', value: '发票影像件缺发票专用章' },
  { label: '发票影像件清晰度低', value: '发票影像件清晰度低' },
  { label: '发票开票时间超五年，国税局无法查验', value: '发票开票时间超五年，国税局无法查验' },
  { label: '发票联次不是发票联', value: '发票联次不是发票联' },
]
