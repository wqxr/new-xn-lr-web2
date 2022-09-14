/*************************************************************************
 * Copyright (c) 2017 - 2021 深圳市链融科技股份有限公司
 * Shenzhen Lianrong Technology Co., Ltd.
 * All rights reserved.
 *
 * @file：libs\shared\src\lib\config\options\common-options.ts
 * @summary：common-options.ts
 * @version: 1.0
 * *************************************************************************
 * revision             author            reason             date
 * 1.0                  DengPei           init               2021-07-12
 ***************************************************************************/
import { SelectItemsModel } from '../checkers';
import { RegisterStateEnum, RightStatus, ChannelEnum } from '../enum';

/** 权限系统同步状态 */
export const RightStatusOptions: SelectItemsModel[] = [
  { label: '已注册已同步', value: RightStatus.Down },
  { label: '未注册', value: RightStatus.NotReg },
  { label: '未同步', value: RightStatus.NotSync },
];
/** 注册渠道options */
export const ChannelOptions: SelectItemsModel[] = [
  { label: '农交所', value: ChannelEnum.农交所 },
  { label: '链融平台', value: ChannelEnum.链融平台 },
];
/** 注册所处状态 */
export const RegisterStateOptions: SelectItemsModel[] = [
  { label: '草稿', value: RegisterStateEnum.Draft },
  { label: '未生效', value: RegisterStateEnum.NotActive },
  { label: '已生效', value: RegisterStateEnum.InForce },
];

/**
 * 平台现有产品渠道类型汇总，可用于页面数据展示
 * 需长期维护更新
 */
export const XnProductTypeOptions: SelectItemsModel[] = [
  { label: 'ABS', value: 1, children: [] },
  {
    label: '再保理',
    value: 2,
    children: [
      { label: '光大', value: 1 },
      { label: '招行', value: 2 },
      { label: '邮储', value: 3 },
      { label: '农行', value: 4 },
      { label: '北京银行', value: 7 },
      { label: '浦发银行', value: 8 },
      { label: '东亚', value: 10 },
      { label: '工商银行', value: 12 },
      { label: '民生银行', value: '13' },
    ],
  },
  {
    label: '银行直保',
    value: 3,
    children: [
      { label: '上海银行', value: 6 }, // bank_shanghai
    ],
  },
  { label: 'ABN', value: 4, children: [] },
  {
    label: '非标',
    value: 99,
    children: [
      { label: '国寿财富', value: 5 },
      { label: '博时资本', value: 9 },
    ],
  },
];
