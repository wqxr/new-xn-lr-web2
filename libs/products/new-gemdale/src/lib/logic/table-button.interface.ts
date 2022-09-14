/**
 *  按钮组参数字段
 */
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
