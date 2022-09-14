import { ButtonConfigs, ButtonGroup } from '../../../logic/table-button.interface';

export interface ResultParamInputModel {
  /** modal标题,为空则不显示 */
  nzTitle: string;
  /** modal宽度配置 */
  nzWidth: number;
  /** modal样式 */
  nzStyle?: {[key: string]: any};
  /** 点击蒙层是否允许关闭 */
  nzMaskClosable?: boolean;
  /** 是否显示右上角的关闭按钮。确认框模式下该值无效（默认会被隐藏） */
  nzClosable?: boolean;
  /** 对话框外层容器的类名 */
  nzWrapClassName?: string;
  /** modal页脚是否显示 */
  nzFooter: boolean;
  /** 页脚按钮，当nzFooter为true时有效 */
  buttons?: ButtonConfigs;
  /** 延时自动关闭modal，单位ms */
  delayTime?: number;
  /** message提示提示配置 */
  message?: {
    /** 提示类型，决定图标类型 'check-circle' | 'close-circle' | 'exclamation-circle'| 'info-circle' */
    nzType: string;
    /** 图标颜色 '#52c41a' | '#ff4d4f' | '#faad14'| '#1890ff' */
    nzColor: string;
    /** 提示标题 */
    nzTitle: string;
    /** 提示内容 */
    nzContent: string;
    /** 按钮 */
    buttons?: ButtonGroup;
  };
  /** result结果配置 */
  result?: {
    /** 结果的状态，决定图标和颜色 'success' | 'error' | 'info' | 'warning'| '404' | '403' | '500' | 'info' */
    nzStatus: string;
    /** 标题 */
    nzTitle: string;
    /** 副标题 */
    nzSubTitle: string;
    /** 按钮组 */
    buttons?: ButtonGroup[];
  };
  /** 本地pdf、图片预览配置 */
  localFilesView?: {
    src: string;
    height?: number | string;
    width?: number | string;
  };
  /** 组件 */
  // components?: {
  //   componentRef: string;
  //   inputParams: {[key: string]: any};
  //   height?: number | string;
  //   width?: number | string;
  // };
  /** 其他配置 */
  options?: any;
}
