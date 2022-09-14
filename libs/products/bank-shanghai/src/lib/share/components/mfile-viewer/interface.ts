import { ButtonConfigs } from '../../../logic/table-button.interface';

export interface FileInfo {
  /** 文件名 */
  fileName: string;
  /** 文件唯一标识 */
  fileId: string;
  /** 文件路径 */
  filePath: string;
  /** 文件请求地址url */
  url: string;
  /** 其他信息 */
  [key: string]: any;
}

export interface FileViewerModel {
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
  /** 文件配置 */
  filesList: {
    /** 文件列表 */
    files: FileInfo[];
    /** 当前查看文件 */
    current?: FileInfo;
    /** 是否显示工具栏按钮 */
    showTools?: boolean | number;
    /** 文件展示区域宽度 */
    width?: string;
    /** 文件展示区域高度 */
    height?: string;
  };
  /** 其他配置 */
  options?: any;
}
