import { FormlyFieldConfig } from "@lr/ngx-formly";

/*************************************************************************
* Copyright (c) 2017 - 2021 深圳市链融科技股份有限公司
* Shenzhen Lianrong Technology Co., Ltd.
* All rights reserved.
*
* @file：libs\products\account-system\src\lib\shared\components\modal\interface.ts
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

export interface FileViewerModel {
  /** modal标题,为空则不显示 */
  nzTitle: string;
  /** modal宽度配置 */
  nzWidth: number;
  /** modal样式 */
  nzStyle?: { [key: string]: any };
  /** 点击蒙层是否允许关闭 */
  nzMaskClosable?: boolean;
  /** 文件配置 */
  filesList: {
    /** 文件列表 */
    files: FileInfo[];
    /** 当前查看文件 */
    current?: FileInfo;
  };
  /** 其他配置 */
  options?: any;
}

/** 选择企业银行账户modal参数  */
export interface FilmBankModalParams {
  /** 企业id */
  appId: string;
  /** 银行账号 */
  accountNo?: string;
}

/** 企业银行账户信息  */
export interface BankInfo {
  /** 银行户名 */
  accountName: string,
  /** 银行账号 */
  accountNo: string,
  /** 开户行 */
  acctBank: string,
  /** 开户行联行号 */
  acctBankCode: string,
  checked?: boolean
}

/** 开户流程记录modal参数  */
export interface ProcessRecordModalParams {
  /** 流程记录 */
  recordList?: RecordConfig[];
}

/** 流程记录  */
export interface RecordConfig {
  /** 操作记录步骤 */
  recordStep?: any,
  /** 操作人企业 */
  operatorAppName?: string,
  /** 操作人 */
  operatorUserName?: string,
  /** 操作时间 */
  createTime?: string,
  /** 备注 */
  remark?: string,
}

/** 按钮组参数字段 */
export interface ButtonGroup {
  /** 按钮标识 */
  btnKey: string;
  /** 按钮标题 */
  label: string;
  /** 按钮类型 'normal','dropdown' 'text' */
  type: string;
  /** 按钮图标类型 */
  btnType?: string;
  /** 按钮图标 */
  icon?: string;
  /** 操作api */
  postUrl?: string;
  /** 是否禁用 */
  disabled?: boolean;
  /** 某些条件下是否显示按钮 */
  show?: boolean;
  /** 点击事件 */
  click?: (e?: any) => void;
  /** 子按钮-适用于下拉按钮 */
  children?: ButtonGroup[];
  /** 其他配置 */
  options?: {
    [key: string]: any
  };
}

export interface ButtonConfigs {
  /** 左边按钮 */
  left?: ButtonGroup[];
  /** 右边按钮 */
  right?: ButtonGroup[];
}

/** 编辑模态框配置参数 */
export interface AccountEditModelParams {
  /** 标题 */
  title: string;
  /** modal位置类名 */
  nzWrapClassName?: string;
  /** 图标类型 */
  tipIconType?: string;
  /** 点击蒙层是否允许关闭 */
  maskClosable?: boolean;
  /** 是否显示图标 */
  showTipIcon?: boolean;
  /** 图标Icon类型 */
  tipIconNzType?: string;
  /** 图标提示类型 */
  layout?: 'horizontal' | 'vertical' | 'inline';
  /** 弹框宽度配置 */
  width?: any;
  /** 输入项 */
  formModalFields: FormlyFieldConfig[];
  /** 按钮 */
  buttons?: ButtonConfigs;
  /** 其他配置 */
  options?: any;
}

/** 编辑模态框提交参数 */
export interface EditModelSubmitParams {
  /** 状态 */
  action: boolean;
  /** 额外参数 */
  params?: any;
}

/** 上传授权书模态框参数 */
export interface AuthorizeModalParams {
  /** 额外提示 */
  tipText: string;
  /** 获取动态法人授权书参数 */
  params: AuthorizationParams;
}

/** 获取动态法人授权书参数 */
export interface AuthorizationParams {
  /** 虚拟账户id */
  accountId: number;
  /** 社会信用代码 */
  identityNo: string;
  /** 经办人姓名 */
  operatorName: string;
  /** 经办人身份证 */
  operatorIdNo: string;
  /** 经办人手机号 */
  operatorMobile: string;
  /** 法人姓名 */
  corpName: string;
  /** 法人身份证 */
  corpIdNo: string;
  /** 法人手机号 */
  corpMobile: string;
}
