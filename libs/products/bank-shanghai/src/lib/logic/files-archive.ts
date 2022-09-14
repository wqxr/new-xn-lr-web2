import { ActivatedRoute } from '@angular/router';
import { FormlyFieldConfig } from '@lr/ngx-formly';
import { Column, ColumnButton, TableData } from '@lr/ngx-table';
import { startOfDay, endOfDay, format, endOfMonth, startOfMonth } from 'date-fns';
import { SelectOptions } from 'libs/shared/src/lib/config/select-options';
import { ButtonConfigs } from './table-button.interface';

// 上海银行文件归档列表
export default class FilesArchiveConfig {
  static defaultFields: FormlyFieldConfig[] = [
    {
      className: 'ant-col ant-col-md-8 ant-col-sm-24',
      wrappers: ['form-field-horizontal'],
      key: 'orgName',
      type: 'custom-input',
      templateOptions: {
        label: '收款单位',
        placeholder: '请输入',
        autocomplete: 'off',
        labelSpan: 9,
        controlSpan: 15,
      },
    },
    {
      className: 'ant-col ant-col-md-16 ant-col-sm-24',
      wrappers: ['form-field-horizontal'],
      key: 'signForStatus',
      type: 'linkage-select',
      defaultValue: '',
      templateOptions: {
        label: '签收状态',
        placeholder: '请选择',
        mode: 'fixed',
        options: SelectOptions.get('signForStatus_sh'),
        labelSpan: 5,
        controlSpan: 19,
      },
    }
  ];

  // 表格头部按钮配置
  static tableHeadBtn: ButtonConfigs = {
    left: [
      { label: '导出清单', type: 'normal', btnKey: 'export_manifest', postUrl: '/shanghai_bank/sh_supplier_archive/dwList' },
    ],
    right: []
  };

  static defaultColumns: Column[] = [
    { title: '序号', index: 'no', width: 50, format: (item: TableData, col: Column, index: number): string => (index + 1).toString() },
    { title: '供应商', index: 'orgName', width: 180 },
    { title: '文档名称', index: 'fileName', width: 180, render: 'fileNameTpl' },
    { title: '签收状态', index: 'signForStatus', width: 200, render: 'signForTpl' },
  ];

  static getConfig(name: string) {
    return FilesArchiveConfig[name];
  }
}
