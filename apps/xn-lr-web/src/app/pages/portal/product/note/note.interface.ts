/*************************************************************************
 * Copyright (c) 2017 - 2021 深圳市链融科技股份有限公司
 * Shenzhen Lianrong Technology Co., Ltd.
 * All rights reserved.
 *
 * @file：apps\xn-lr-web\src\app\pages\portal\product\note\note.interface.ts
 * @summary：note.interface.ts
 * @version: 1.0
 * *************************************************************************
 * revision             author            reason             date
 * 1.0                  DengPei           init               2022-02-16
 ***************************************************************************/
import { BillFace } from './note.enum';

/** 票据表单 */
export interface BillForm {
  /** 票据号码 */
  code: string;
  /** 票据状态 */
  status: string;
  /** 票据金额 */
  money: string | number;
  /** 出票人 */
  drawerName: string;
  /** 出票人账户 */
  drawerBankAccountCode: string;
  /** 收票人 */
  draweeName: string;
  /** 收票人账户 */
  draweeBankAccountCode: string;
  /** 承兑人 */
  acceptorName: string;
  /** 承兑人账户 */
  acceptorBankAccountCode: string;
  /** 承兑人开户行名称 */
  acceptorBankName: string;
  /** 承兑人开户行行号 */
  acceptorBankCode: string;
  /** 出票日期 */
  date: string;
  /** 汇票到期日 */
  dulDate: string;
  /** 能否转让 */
  transfer: string;
  /** 背书次数 */
  endorseTimes: number;
  /** 票据文件 */
  files?: BillFileInfo[];
}

/** 票据信息 */
export interface BillInfo extends BillForm{
  /** 收票人开户银行 */
  draweeBankName: string;
  /** 出票人开户银行 */
  drawerBankName: string;
  /** 票据文件id */
  frontFileId: number;
}

export interface BillFileInfo extends FileInfo{
  type: BillFace.Front | BillFace.Back;
  /** 能否删除， true -> 不能，false | null -> 能 */
  cantDel?: boolean;
}

/** 询价表单值 */
export interface FormModel {
  /** 票据号码 */
  code: string;
  /** 票据金额 */
  money: string | number;
  /** 承兑人 */
  acceptorName: string;
  /** 出票日期 */
  date: string;
  /** 汇票到期日 */
  dulDate: string;
  /** 背书次数 */
  endorseTimes: number;
}

/** 文件信息 */
export interface FileInfo {
  key: string;
  fileId: string | number;
  fileName: string;
}
