/*************************************************************************
 * Copyright (c) 2017 - 2021 深圳市链融科技股份有限公司
 * Shenzhen Lianrong Technology Co., Ltd.
 * All rights reserved.
 *
 * @file：apps\xn-lr-web\src\app\pages\portal\product\note\note.enum.ts
 * @summary：note.enum.ts
 * @version: 1.0
 * *************************************************************************
 * revision             author            reason             date
 * 1.0                  DengPei           init               2022-02-16
 ***************************************************************************/
/** 组件的上传状态 */
export enum UploadStatus {
  /** 上传中 */
  Uploading = 'uploading',
  /** 上传完成 */
  Done      = 'done',
  /** 上传失败 */
  Error     = 'error',
  /** 已删除 */
  Removed   = 'removed',
  /** 上传成功 */
  Success   = 'success',
}

/** 识别状态 */
export enum Identify {
  /** 识别中 */
  Identifying = 'identifying',
  /** 已识别 */
  Recognized  = 'recognized',
  /** 识别失败 */
  Fail        = 'fail'
}

/** 票据正反面 */
export enum BillFace {
  /** 正面 */
  Front = 'front',
  /** 反面 */
  Back  = 'back',
}
