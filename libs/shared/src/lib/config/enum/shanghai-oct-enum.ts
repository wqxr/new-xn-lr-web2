/*************************************************************************
* Copyright (c) 2017 - 2021 深圳市链融科技股份有限公司
* Shenzhen Lianrong Technology Co., Ltd.
* All rights reserved.
*
* @file：libs\shared\src\lib\config\enum\shanghai-bank-puhui-enum.ts
* @summary：华侨城-上海银行枚举
* @version: 1.0
* *************************************************************************
* revision             author            reason             date
* 1.0                 hucongying          init           2021-03-03
***************************************************************************/

/** 适用产品 */
export enum FitproductSo {
  /** 通用 */
  Normal = 1,
  /** 普惠通-华侨城-上海银行 */
  So = 2,
  /** 普惠通-万科-上海银行 */
  Sh = 3,
}
/** 产品信息接口url */
export enum SoSupplierInfoUrl {
  /** 通用 */
  Normal = '/custom/avenger/customer_manager/get_app_file',
  /** 普惠通-华侨城-上海银行 */
  So = '/shanghai_bank/so_supplier/getSupplierInfo',
  /** 普惠通-万科-上海银行 */
  Sh = '/shanghai_bank/sh_supplier/getSupplierInfo'
}
/** 产品信息调用接口类型 */
export enum SoSupplierInfoPostType {
  /** 通用 */
  Normal = 'api',
  /** 普惠通-万科-上海银行 普惠通-华侨城-上海银行 */
  So = 'dragon'
}
/** 产品信息字段标识 */
export enum SoSupplierInfoFieldType {
  So = 0,
  Normal = 1
}

/** 关联类型 */
export enum RelationSO {
  /** 万科-上海银行 */
  SH = 'relation',
  /** 华侨城-上海银行 */
  SO = 'relation_so'
}

/** 关联类型名 */
export enum RelationSOName {
  /** 万科-上海银行 */
  SH = '万科',
  /** 华侨城-上海银行 */
  SO = '华侨城'
}