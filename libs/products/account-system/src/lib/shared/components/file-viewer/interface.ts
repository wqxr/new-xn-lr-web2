/*************************************************************************
* Copyright (c) 2017 - 2021 深圳市链融科技股份有限公司
* Shenzhen Lianrong Technology Co., Ltd.
* All rights reserved.
*
* @file：libs\products\account-system\src\lib\shared\components\file-viewer\interface.ts
* @summary：init interface.ts
* @version: 1.0
* *************************************************************************
* revision             author            reason             date
* 1.0                HuCongying           init           2021-11-01
***************************************************************************/
export interface FileInfo {
  /** 文件名 */
  name: string;
  /** 文件路径 */
  url: string;
  /** 其他信息 */
  [key: string]: any;
}

export interface FileViewerData {
  /** 文件列表 */
  files: FileInfo[];
  /** 当前查看文件 */
  current?: FileInfo;
}
