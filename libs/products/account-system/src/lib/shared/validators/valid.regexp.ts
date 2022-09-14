/*************************************************************************
* Copyright (c) 2017 - 2021 深圳市链融科技股份有限公司
* Shenzhen Lianrong Technology Co., Ltd.
* All rights reserved.
*
* @file：libs\products\account-system\src\lib\shared\validators\valid.regexp.ts
* @summary：正则文件
* @version: 1.0
* *************************************************************************
* revision             author            reason             date
* 1.0                HuCongying           init           2021-11-23
***************************************************************************/

/** 身份证 */
// 两个以上中文姓名，外国翻译过来的中文姓名很长，而且有个·
export const IDCardReg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;

/** 手机号码 */
export const MobileReg = /^[1][0-9]{10}$/;

/** 邮箱 */
// 支持下划线
export const EmailReg = /^[A-Za-z0-9_-\u4e00-\u9fa5\.]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/;

/** 数字 */
// 最多支持两位小数
export const TwoDecimalsReg = /^(\d+|\d+\.\d{1,2})$/;
