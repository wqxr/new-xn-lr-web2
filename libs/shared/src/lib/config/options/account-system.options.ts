/*************************************************************************
* Copyright (c) 2017 - 2021 深圳市链融科技股份有限公司
* Shenzhen Lianrong Technology Co., Ltd.
* All rights reserved.
*
* @file：libs\shared\src\lib\config\options\account-system.options.ts
* @summary：账户体系options
* @version: 1.0
* *************************************************************************
* revision             author            reason             date
* 1.0                 hucongying          init           2021-08-24
***************************************************************************/
import { SelectItemsModel } from '../checkers';
import { PageTypeEnum, RecordTypeEnum } from '../enum';

/** 企业账户状态 */
export const AccountStatusOptions: SelectItemsModel[] = [
  { label: '已提交', value: '0' },
  { label: '待激活', value: '1' },
  { label: '已开户', value: '2' },
  { label: '已注销', value: '3' },
  { label: '已取消', value: '4' },
  { label: '未开户', value: '5' },
  { label: '工商信息待激活', value: '6' },
  { label: '开户信息-平台初审', value: '7' },
  { label: '开户信息-平台复核', value: '8' },
  { label: '开户信息-审核退回', value: '9' },
  { label: '开户信息待确认', value: '10' },
  { label: '经办人信息修改-平台初审', value: '11' },
  { label: '经办人信息修改-平台复核', value: '12' },
  { label: '经办人信息修改-审核退回', value: '13' },
  { label: '经办人信息修改-待用户确认', value: '14' },
  { label: '工商信息修改-平台初审', value: '15' },
  { label: '工商信息修改-平台复核', value: '16' },
  { label: '工商信息修改-审核退回', value: '17' },
  { label: '工商信息修改-待用户确认', value: '18' },
  { label: '经办人信息未激活', value: '19' },
];

/** 企业注册状态 */
export const RegisterStatusOptions: SelectItemsModel[] = [
  { label: '未注册', value: 0 },
  { label: '已注册', value: 1 },
];

/** 企业开户状态 */
export const HasAccountOptions: SelectItemsModel[] = [
  { label: '未开户', value: 0 },
  { label: '已开户', value: 1 },
];

/** 账户体系银行企业规模类型 */
export const EnterprisScaleOptions: SelectItemsModel[] = [
  { label: '少于15人', value: '1' },
  { label: '15-50人', value: '2' },
  { label: '50-150人', value: '3' },
  { label: '150-500人', value: '4' },
  { label: '500-2000人', value: '5' },
  { label: '2000人以上', value: '6' },
];

/** 账户体系法人证件类型类型 */
export const CorpCardTypeOptions: SelectItemsModel[] = [
  { label: '身份证', value: '01' },
  { label: '护照', value: '02' },
  { label: '台胞证', value: '03' },
  { label: '港澳通行证', value: '04' },
  { label: '其他证件', value: '05' },
];

/** 账户体系开户资料审核类型 */
export const AuditStatusOptions: SelectItemsModel[] = [
  { label: '待审核', value: '0' },
  { label: '已审核', value: '1' },
  { label: '审核失败', value: '2' },
];

/** 账户体系开户资料审核icon类型 */
export const AuditIconTypeOptions: SelectItemsModel[] = [
  { label: 'exclamation-circle', value: '0' },
  { label: 'check-circle', value: '1' },
  { label: 'close-circle', value: '2' },
];

/** 账户体系开户资料审核图标颜色类型 */
export const AuditIconColorOptions: SelectItemsModel[] = [
  { label: '#fb9e17', value: '0' },
  { label: '#07c160', value: '1' },
  { label: '#f46a6a', value: '2' },
];

/** 账户信息激活状态 */
export const InfoActiveOptions: SelectItemsModel[] = [
  { label: '未激活', value: 0 },
  { label: '已激活', value: 1 },
];

/** 账户体系存款人类别 */
export const DepositHumanOptions: SelectItemsModel[] = [
  { label: '企业法人', value: '01' },
  { label: '非法人企业', value: '02' },
];

/** 账户体系注册类型 */
export const RegisteredTypeOptions: SelectItemsModel[] = [
  { label: '企业法人营业执照(企业法人)', value: 'A' },
  { label: '企业营业执照(非企业法人)', value: 'B' },
  { label: '个体工商执照', value: 'C' },
  { label: '民办非企业登记证书', value: 'D' },
];

/** 账户体系交易方向类型 */
export const TradeDirectionOptions: SelectItemsModel[] = [
  { label: '转入', value: '2' },
  { label: '转出', value: '1' },
];

/** 账户体系交易状态 */
export const TradeStatusOptions: SelectItemsModel[] = [
  { label: '交易中', value: '0' },
  { label: '成功', value: '1' },
  { label: '失败', value: '2' },
  { label: '未明', value: '3' },
  { label: '已退汇', value: '4' },
];

/** 账户体系动账金额类型 */
export const TranAmtTypeOptions: SelectItemsModel[] = [
  { label: '可用', value: '00' },
  { label: '可用金额', value: '01' },
  { label: '冻结1', value: '02' },
  { label: '冻结2', value: '03' },
  { label: '司法冻结', value: '04' },
  { label: '飞金', value: '05' },
  { label: '在途', value: '06' },
  { label: '阈值1', value: '07' },
  { label: '阈值2', value: '08' },
];

/** 账户体系交易类别 */
export const TradeTypeOptions: SelectItemsModel[] = [
  { label: '线下充值', value: 'INCOME_0001' },
  { label: '退汇', value: 'INCOME_0002' },
  { label: '行内上账', value: 'INCOME_0003  ' },
  { label: '转入', value: 'INCOME_0099' },
  { label: '待清分转担保', value: 'MUTUAL_0001  ' },
  { label: '担保清分', value: 'MUTUAL_0002' },
  { label: '订单退款', value: 'MUTUAL_0003' },
  { label: '订单确认', value: 'MUTUAL_0004' },
  { label: '手续费平台补贴', value: 'MUTUAL_0005' },
  { label: '补贴退款', value: 'MUTUAL_0006' },
  { label: '平台服务费', value: 'MUTUAL_0007' },
  { label: '分账1', value: 'MUTUAL_0008' },
  { value: 'MUTUAL_0009', label: ' 提现服务费退回' },
  { value: 'MUTUAL_0010', label: ' 支付渠道手续费退款' },
  { value: 'MUTUAL_0011', label: ' 受托支付清算' },
  { value: 'MUTUAL_0012', label: ' 订单退款退到备付金账户' },
  { value: 'MUTUAL_0013', label: ' 受托支付互转' },
  { value: 'MUTUAL_0014', label: ' 98转待清分' },
  { value: 'MUTUAL_0015', label: ' 退款户转待清分' },
  { value: 'MUTUAL_0016', label: ' 受托支付退款' },
  { value: 'MUTUAL_0017', label: ' 虚账簿归集' },
  { value: 'MUTUAL_0018', label: ' 平台优惠补贴1' },
  { value: 'MUTUAL_0019', label: ' 平台优惠补贴2' },
  { value: 'MUTUAL_0020', label: ' 平台优惠补贴3' },
  { value: 'MUTUAL_0021', label: ' 分账2' },
  { value: 'MUTUAL_0022', label: ' 分账3' },
  { value: 'MUTUAL_0023', label: ' 分账4' },
  { value: 'MUTUAL_0024', label: ' 分账5' },
  { value: 'MUTUAL_0025', label: ' 平台补贴1退款' },
  { value: 'MUTUAL_0026', label: ' 平台补贴2退款' },
  { value: 'MUTUAL_0027', label: ' 平台补贴3退款' },
  { value: 'MUTUAL_0028', label: ' 垫资退款' },
  { value: 'MUTUAL_0029', label: ' 分账1退款' },
  { value: 'MUTUAL_0030', label: ' 分账2退款' },
  { value: 'MUTUAL_0031', label: ' 分账3退款' },
  { value: 'MUTUAL_0032', label: ' 分账4退款' },
  { value: 'MUTUAL_0033', label: ' 分账5退款' },
  { value: 'MUTUAL_0034', label: ' 退款垫付手续费' },
  { value: 'MUTUAL_0035', label: ' 罚款扣费' },
  { value: 'MUTUAL_0036', label: ' 平台服务费扣费' },
  { value: 'MUTUAL_0037', label: ' 未迁移订单垫资退款扣还' },
  { value: 'MUTUAL_0038', label: ' 垫资退款扣还' },
  { value: 'MUTUAL_0039', label: ' 退汇中间户转回原提现账户' },
  { value: 'MUTUAL_0099', label: ' 转账//业务类型不明确，统一为转账 ' },
  { value: 'WITHDR_0001', label: ' 提现' },
  { value: 'WITHDR_0002', label: ' 代缴' },
  { value: 'WITHDR_0003', label: ' 退款退到备付金账户' },
  { value: 'WITHDR_0004', label: ' 往账激活' },
  { value: 'WITHDR_0005', label: ' 行内下账' },
  { value: 'WITHDR_0006', label: ' 原路退款' },
  { value: 'WITHDR_0007', label: ' 激活款项退款' },
  { value: 'WITHDR_0008', label: ' 自动归集' },
  { value: 'WITHDR_0099', label: ' 转出' },
];

/** 账户体系银行类型 */
export const AccountBankTypeOptions: SelectItemsModel[] = [
  { label: '上海银行', value: '0' },
]

/** 审核信息跳转路由url */
export const RouteUrlOptions: SelectItemsModel[] = [
  /** 账户待激活 */
  { label: 'active-account', value: '1' },
  /** 激活工商信息 */
  { label: 'active-business', value: '6' },
  /** 开户信息审核-初审 */
  { label: 'check-account-audit', value: '7' },
  /** 开户信息审核-复核 */
  { label: 'check-account-review', value: '8' },
  /** 开户信息待确认 */
  { label: 'confirm-account-info', value: '10' },
  /** 修改经办人信息-初审 */
  { label: 'check-operator-audit', value: '11' },
  /** 修改经办人信息-复核 */
  { label: 'check-operator-review', value: '12' },
  /** 修改经办人信息待确认 */
  { label: 'operator-info/confirm', value: '14' },
  /** 修改工商信息-初审 */
  { label: 'check-business-audit', value: '15' },
  /** 修改工商信息-复核 */
  { label: 'check-business-review', value: '16' },
  /** 修改工商信息待确认 */
  { label: 'business-info/confirm', value: '18' },
  /** 激活经办人信息 */
  { label: 'active-operator', value: '19' },
];

/** 操作记录步骤 */
export const RecordStepOptions: SelectItemsModel[] = [
  { label: '提交开户申请信息', value: '0' },
  { label: '补充开户信息', value: '1' },
  { label: '开户审核-初审', value: '2' },
  { label: '开户审核-复核', value: '3' },
  { label: '确认开户', value: '4' },
  { label: '激活账户', value: '5' },
  { label: '开户审核-审核退回', value: '6' },
  { label: '取消开户', value: '7' },
  { label: '注销账户', value: '8' },
  { label: '初始化经办人信息', value: '9' },
  { label: '修改经办人信息', value: '10' },
  { label: '修改经办人信息审核-初审', value: '11' },
  { label: '修改经办人信息审核-复核', value: '12' },
  { label: '修改经办人信息审核-审核退回', value: '13' },
  { label: '确认修改经办人信息', value: '14' },
  { label: '取消修改经办人信息', value: '15' },
  { label: '激活经办人信息', value: '16' },
  { label: '初始化工商信息', value: '17' },
  { label: '修改工商信息', value: '18' },
  { label: '修改工商信息审核-初审', value: '19' },
  { label: '修改工商信息审核-复核', value: '20' },
  { label: '修改工商信息审核-审核退回', value: '21' },
  { label: '确认修改工商信息', value: '22' },
  { label: '取消修改工商信息', value: '23' },
  { label: '激活工商信息', value: '24' },
];

/** 当前审核步骤 */
export const CheckFlowOptions: SelectItemsModel[] = [
  { label: '初审', value: PageTypeEnum.CHECK_AUDIT },
  { label: '复核', value: PageTypeEnum.CHECK_REVIEW },
];

/** 账户审核Url */
export const CheckUrlOptions: SelectItemsModel[] = [
  { label: '/account/audit', value: PageTypeEnum.CHECK_AUDIT },
  { label: '/account/review', value: PageTypeEnum.CHECK_REVIEW },
];

/** 审核流程类型 */
export const FlowTypeOptions: SelectItemsModel[] = [
  { label: '开户', value: RecordTypeEnum.OPEN_ACCOUNT },
  { label: '修改经办人信息', value: RecordTypeEnum.MODIFIY_OPERATOR },
  { label: '修改工商信息', value: RecordTypeEnum.MODIFIY_BUSINESS },
];

export const FlowCheckValueOptions: SelectItemsModel[] = [
  { label: '是', value: true },
  { label: '否', value: false },
];

