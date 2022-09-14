/*************************************************************************
 * Copyright (c) 2017 - 2021 深圳市链融科技股份有限公司
 * Shenzhen Lianrong Technology Co., Ltd.
 * All rights reserved.
 *
 * @file：libs\products\abs-gj\src\lib\check-config\data-content.config.ts
 * @summary：提单上传 excel api 配置，展示 excel 内容表格配置，下载提单模板配置
 * @version: 1.0
 * *************************************************************************
 * revision             author            reason             date
 * 1.0                  DengPei           init               2021-12-03
 ***************************************************************************/

import { IInputDataContentConfig } from '../../../../../shared/src/lib/public/dragon-vanke/components/form/input/data-content.component';
import { CompanyName } from '../../../../../shared/src/lib/config/enum';
import { IShowDataContentConfig } from 'libs/shared/src/lib/public/dragon-vanke/components/form/show/data-content.component';

export const GjInputDataContentConfig: IInputDataContentConfig = {
  [CompanyName.CDR]: {
    headText: [
      {label: '应收账款序号', value: 'index'},
      {label: '总部公司', value: 'headquarters'},
      {label: '申请付款单位', value: 'projectCompany'},
      {label: '合同编号', value: 'contractId'},
      {label: '合同名称', value: 'contractName'},
      {label: '资产转让折扣率', value: 'discountRate', options: {type: 'rate'}},
      {label: '预录入发票编号', value: 'preInvoiceNum', options: {type: 'multiple'}},
      {label: '应付账款金额', value: 'receive', options: {type: 'money'}},
      {label: '收款单位', value: 'debtUnit'},
      {label: '收款单位账号户名', value: 'debtUnitName'},
      {label: '收款单位账号', value: 'debtUnitAccount'},
      {label: '收款单位开户行', value: 'debtUnitBank'},
      {label: '联系人', value: 'linkMan'},
      {label: '联系人手机号', value: 'linkPhone'},
      {label: '运营部对接人', value: 'operatorName'},
      {label: '运营部对接人手机号', value: 'operatorPhone'},
      {label: '市场部对接人', value: 'marketName'},
      {label: '市场部对接人手机号', value: 'marketPhone'},
      {label: '收款单位归属城市', value: 'supplierCity'},
      {label: '收款单位是否注册', value: 'isRegisterSupplier', options: {type: 'boolean', style: 'red'}},
    ],
    excel_down_url: '/assets/lr/doc/abs-gj/提单模板：成都轨交付款计划表.xlsx',
    excel_up_url: '/pay_plan/cdr_upload_excel',
  }
};

export const GjShowDataContentConfig: IShowDataContentConfig = {
  headText: GjInputDataContentConfig[CompanyName.CDR].headText,
};
