/*************************************************************************
 * Copyright (c) 2017 - 2020 北京希为科技有限公司
 * Beijing Xiwei Technology Co., Ltd.
 * All rights reserved.
 *
 * @file：xn-shared\src\lib\components\file-sign\interface.ts
 * @summary：init interface.ts
 * @version: 1.0
 * *************************************************************************
 * revision             author            reason             date
 * 1.0                  yutianbao        init             2020-09-12
 ***************************************************************************/
export interface FileInfo {
  /** 文件名 */
  label: string;
  /** 文件标识 */
  value: string;
  /** 签收状态 true已签收 */
  signStatus: boolean | number;
  /** 支持多个文件 */
  files: any[];
  /** 切换文件时-是否选中 */
  selected: boolean;
  /** 其他信息 */
  [key: string]: any;
}

export interface FileSignData {
  /** 文件列表 */
  filesList: FileInfo[];
  /** 标识key */
  appId?: string;
  /** 接口 */
  postUrl?: string;
  /** 当前查看文件 */
  current?: FileInfo;
}

export interface clickParams {
  action: string;
  params?: any;
}
