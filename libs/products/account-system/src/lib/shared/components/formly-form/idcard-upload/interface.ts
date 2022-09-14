/*************************************************************************
* Copyright (c) 2017 - 2021 深圳市链融科技股份有限公司
* Shenzhen Lianrong Technology Co., Ltd.
* All rights reserved.
*
* @file：libs\products\account-system\src\lib\shared\components\formly-form\idcard-upload\interface.ts
* @summary：init interface.ts
* @version: 1.0
* *************************************************************************
* revision             author            reason             date
* 1.0                HuCongying           init           2021-11-11
***************************************************************************/
export class idCardCheckInfo {
  /** 文件名 */
  fileName: string = '';
  /** 审核状态 */
  checkText: string = '';
  /** 图标 */
  iconType: string = '';
  /** 图标颜色 */
  nzColor: string = '';
  /** 是否展示审核信息 */
  showReason: boolean = false;
  /** 审核异常信息 */
  checkReason: string = '';
}
