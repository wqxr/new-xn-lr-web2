import { ActivatedRoute } from '@angular/router';
import { FormlyFieldConfig } from '@lr/ngx-formly';
import { Column, ColumnButton, TableData } from '@lr/ngx-table';
import {
  startOfDay, endOfDay,
  startOfToday, endOfToday,
  format,
  endOfMonth, startOfMonth,
  startOfWeek, endOfWeek,
  startOfYesterday, endOfYesterday
} from 'date-fns';
import { XnUtils } from 'libs/shared/src/lib/common/xn-utils';
import { SelectOptions } from 'libs/shared/src/lib/config/select-options';
import { ButtonConfigs } from './table-button.interface';
import * as moment from 'moment';

// 上海银行复核列表配置
export default class ReviewListConfig {
  static defaultFields: FormlyFieldConfig[] = [
    {
      className: 'ant-col ant-col-md-8 ant-col-sm-24',
      wrappers: ['form-field-horizontal'],
      key: 'mainFlowId',
      type: 'custom-input',
      templateOptions: {
        label: '交易id',
        placeholder: '请输入',
        autocomplete: 'off',
        labelSpan: 9,
        controlSpan: 15,
      },
    },
    {
      className: 'ant-col ant-col-md-8 ant-col-sm-24',
      wrappers: ['form-field-horizontal'],
      key: 'tradeStatus',
      type: 'select',
      templateOptions: {
        label: '交易状态',
        nzPlaceHolder: '请选择',
        nzAllowClear: true,
        options: SelectOptions.get('tradeStatus_so'),
        labelSpan: 9,
        controlSpan: 15,
      },
      hooks: {
        onInit: (field: any) => {
          field?.formControl?.valueChanges.subscribe((val: any) => {
            if(!XnUtils.isEmptys(val, [0])) {
              field?.form?.get('reviewStatus')?.setValue(null);
            }
          });
        }
      }
    },
    // {
    //   className: 'ant-col ant-col-md-8 ant-col-sm-24',
    //   wrappers: ['form-field-horizontal'],
    //   key: 'headquarters',
    //   type: 'input',
    //   templateOptions: {
    //     label: '总部公司',
    //     placeholder: '请输入',
    //     labelSpan: 9,
    //     controlSpan: 15,
    //   },
    // },
    {
      className: 'ant-col ant-col-md-8 ant-col-sm-24',
      wrappers: ['form-field-horizontal'],
      key: 'coreType',
      type: 'select',
      templateOptions: {
        label: '核心企业',
        nzPlaceHolder: '请选择',
        nzAllowClear: true,
        options: SelectOptions.get('coreType'),
        labelSpan: 9,
        controlSpan: 15,
      },
    },
    {
      className: 'ant-col ant-col-md-8 ant-col-sm-24',
      wrappers: ['form-field-horizontal'],
      key: 'projectCompany',
      type: 'custom-input',
      templateOptions: {
        label: '申请付款单位',
        placeholder: '请输入',
        autocomplete: 'off',
        labelSpan: 9,
        controlSpan: 15,
      },
    },
    {
      className: 'ant-col ant-col-md-8 ant-col-sm-24',
      wrappers: ['form-field-horizontal'],
      key: 'debtUnit',
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
      className: 'ant-col ant-col-md-8 ant-col-sm-24',
      wrappers: ['form-field-horizontal'],
      key: 'receive',
      type: 'custom-input',
      templateOptions: {
        label: '应收账款金额',
        placeholder: '请输入',
        autocomplete: 'off',
        labelSpan: 9,
        controlSpan: 15,
      },
    },
    {
      className: 'ant-col ant-col-md-8 ant-col-sm-24',
      wrappers: ['form-field-horizontal'],
      key: 'changePrice',
      type: 'custom-input',
      templateOptions: {
        label: '转让价款',
        placeholder: '请输入',
        autocomplete: 'off',
        labelSpan: 9,
        controlSpan: 15,
      },
    },
    // {
    //   className: 'ant-col ant-col-md-8 ant-col-sm-24',
    //   wrappers: ['form-field-horizontal'],
    //   key: 'serviceRate',
    //   type: 'custom-input',
    //   templateOptions: {
    //     label: '服务费率',
    //     placeholder: '请输入',
    //     autocomplete: 'off',
    //     labelSpan: 9,
    //     controlSpan: 15,
    //   },
    // },
    {
      className: 'ant-col ant-col-md-8 ant-col-sm-24',
      wrappers: ['form-field-horizontal'],
      key: 'discountRate',
      type: 'custom-input',
      templateOptions: {
        label: '融资利率',
        placeholder: '请输入',
        autocomplete: 'off',
        labelSpan: 9,
        controlSpan: 15,
      },
    },
    {
      className: 'ant-col ant-col-md-8 ant-col-sm-24',
      wrappers: ['form-field-horizontal'],
      key: 'payConfirmId',
      type: 'custom-input',
      templateOptions: {
        label: '付款确认书编号',
        placeholder: '请输入',
        autocomplete: 'off',
        labelSpan: 9,
        controlSpan: 15,
      },
    },
    // {
    //   className: 'ant-col ant-col-md-8 ant-col-sm-24',
    //   wrappers: ['form-field-horizontal'],
    //   key: 'factoringStartDate',
    //   type: 'date-picker',
    //   defaultValue: '',
    //   templateOptions: {
    //     label: '起息日',
    //     placeholder: '请选择时间',
    //     nzClassName: 'full-width',
    //     nzFormat: 'yyyy-MM-dd',
    //     nzDefaultPickerValue: '',
    //     labelSpan: 9,
    //     controlSpan: 15,
    //   },
    // },
    {
      className: 'ant-col ant-col-md-8 ant-col-sm-24',
      key: 'factoringStartDate',
      type: 'date-range-picker',
      wrappers: ['form-field-horizontal'],
      defaultValue: [],
      templateOptions: {
        label: '起息日',
        nzMode: 'date',
        nzShowTime: false,
        nzAllowClear: true,
        // nzSize: 'large',
        nzFormat: 'yyyy-MM-dd',
        nzPlaceHolder: ['开始日期', '结束日期'],
        nzDefaultPickerValue: [],
        nzRanges: {
          今天: [moment().toDate(), moment().toDate()],
          昨天: [moment().subtract(1, 'days').toDate(), moment().subtract(1, 'days').toDate()],
          近7天: [moment().subtract(7, 'days').toDate(), moment().toDate()],
          近30天: [moment().subtract(30, 'days').toDate(), moment().toDate()],
          近90天: [moment().subtract(90, 'days').toDate(), moment().toDate()],
          近180天: [moment().subtract(180, 'days').toDate(), moment().toDate()],
          近365天: [moment().subtract(365, 'days').toDate(), moment().toDate()],
          这个月: [moment().startOf('month').toDate(), moment().endOf('month').toDate()],
          上个月: [moment().subtract(1, 'month').startOf('month').toDate(), moment().subtract(1, 'month').endOf('month').toDate()],
        },
        labelSpan: 9,
        controlSpan: 15,
        nzOnChange: () => {},
      },
    },
    // {
    //   className: 'ant-col ant-col-md-8 ant-col-sm-24',
    //   wrappers: ['form-field-horizontal'],
    //   key: 'factoringEndDate',
    //   type: 'date-picker',
    //   defaultValue: '',
    //   templateOptions: {
    //     label: '保理融资到期日',
    //     placeholder: '请选择时间',
    //     nzFormat: 'yyyy-MM-dd',
    //     nzDefaultPickerValue: '',
    //     labelSpan: 9,
    //     controlSpan: 15,
    //   },
    // },
    {
      className: 'ant-col ant-col-md-8 ant-col-sm-24',
      key: 'factoringEndDate',
      type: 'date-range-picker',
      wrappers: ['form-field-horizontal'],
      defaultValue: [],
      templateOptions: {
        label: '保理融资到期日',
        nzMode: 'date',
        nzShowTime: false,
        nzAllowClear: true,
        // nzSize: 'large',
        nzFormat: 'yyyy-MM-dd',
        nzPlaceHolder: ['开始日期', '结束日期'],
        nzDefaultPickerValue: [],
        nzRanges: {
          今天: [moment().toDate(), moment().toDate()],
          昨天: [moment().subtract(1, 'days').toDate(), moment().subtract(1, 'days').toDate()],
          近7天: [moment().subtract(7, 'days').toDate(), moment().toDate()],
          近30天: [moment().subtract(30, 'days').toDate(), moment().toDate()],
          近90天: [moment().subtract(90, 'days').toDate(), moment().toDate()],
          近180天: [moment().subtract(180, 'days').toDate(), moment().toDate()],
          近365天: [moment().subtract(365, 'days').toDate(), moment().toDate()],
          这个月: [moment().startOf('month').toDate(), moment().endOf('month').toDate()],
          上个月: [moment().subtract(1, 'month').startOf('month').toDate(), moment().subtract(1, 'month').endOf('month').toDate()],
        },
        labelSpan: 9,
        controlSpan: 15,
        nzOnChange: () => {},
      },
    },
    {
      className: 'ant-col ant-col-md-8 ant-col-sm-24',
      wrappers: ['form-field-horizontal'],
      key: 'reviewStatus',
      type: 'select',
      templateOptions: {
        label: '审核状态',
        nzPlaceHolder: '请选择',
        nzAllowClear: true,
        options: SelectOptions.get('reviewStatus_sh'),
        labelSpan: 9,
        controlSpan: 15,
      },
      hooks: {
        onInit: (field: any) => {
          field?.formControl?.valueChanges.subscribe((val: any) => {
            if(!XnUtils.isEmptys(val, [0])) {
              field?.form?.get('tradeStatus')?.setValue(null);
            }
          });
        }
      }
    },
    {
      className: 'ant-col ant-col-md-8 ant-col-sm-24',
      wrappers: ['form-field-horizontal'],
      key: 'reviewer',
      type: 'custom-input',
      templateOptions: {
        label: '审核人',
        placeholder: '请输入',
        autocomplete: 'off',
        labelSpan: 9,
        controlSpan: 15,
      },
    },
    {
      className: 'ant-col ant-col-md-8 ant-col-sm-24',
      wrappers: ['form-field-horizontal'],
      key: 'depositBank',
      type: 'custom-input',
      templateOptions: {
        label: '托管行',
        placeholder: '请输入',
        autocomplete: 'off',
        labelSpan: 9,
        controlSpan: 15,
      },
    },
    {
      className: 'ant-col ant-col-md-8 ant-col-sm-24',
      wrappers: ['form-field-horizontal'],
      key: 'isFactoringEndDate',
      type: 'select',
      templateOptions: {
        label: '是否补充到期日',
        nzPlaceHolder: '请输入',
        nzAllowClear: true,
        options: SelectOptions.get('defaultRadio'),
        labelSpan: 9,
        controlSpan: 15,
      },
    },
  ];

  // 表格头部按钮配置
  static tableHeadBtn: ButtonConfigs = {
    left: [
      { label: '导出清单', type: 'normal', btnKey: 'export_manifest', postUrl: '/sh_trade/down_list' },
    ],
    right: [
      { label: '自定义表格字段', type: 'normal', btnKey: 'custom_table_fields' },
    ]
  };

  static defaultColumns: Column[] = [
    { title: '选择', index: 'id', width: 50, fixed: 'left', type: 'checkbox' },
    { title: '序号', index: 'no', width: 50, fixed: 'left', format: (item: TableData, col: Column, index: number): string =>
      (index + 1).toString() },
    { title: '交易ID', index: 'mainFlowId', width: 240 },
    { title: '交易状态', index: 'tradeStatus', width: 200, render: 'tradeStatusTpl' },
    // { title: '总部公司', index: 'headquarters', width: 200 },
    { title: '核心企业', index: 'coreType', width: 200, render: 'multipleMatchTpl'},
    { title: '申请付款单位', index: 'projectCompany', width: 240 },
    { title: '收款单位', index: 'debtUnit', width: 240 },
    { title: '应收账款金额', index: 'receive', width: 200, sort: {default: null, compare: null, key: 'receive', reName:
      { ascend: '1', descend: '-1' }}, render: 'moneyTpl' },
    { title: '转让价款', index: 'changePrice', width: 200, sort: {default: null, compare: null, key: 'changePrice', reName:
      { ascend: '1', descend: '-1' }}, render: 'moneyTpl' },
    // { title: '服务费率', index: 'serviceRate', width: 100, sort: {default: null, compare: null, key: 'serviceRate', reName:
    //   { ascend: '1', descend: '-1' }}, render: 'rateTpl' },
    { title: '融资利率', index: 'discountRate', width: 100, sort: {default: null, compare: null, key: 'discountRate', reName:
      { ascend: '1', descend: '-1' }}, render: 'rateTpl' },
    { title: '付款确认书编号', index: 'payConfirmId', width: 240, sort: {default: null, compare: null, key: 'payConfirmId', reName:
      { ascend: '1', descend: '-1' }} },
    // { title: '付款确认书文件', index: 'pdfProjectFiles', width: 300, render: 'filesTpl' },
    { title: '总部付确', index: 'groupPayConfirmFile', width: 300, render: 'filesTpl' },
    { title: '项目公司付确', index: 'proJectPayConfirmFile', width: 300, render: 'filesTpl' },
    { title: '审核状态', index: 'reviewStatus', width: 200, render: 'reviewStatusTpl' },
    { title: '起息日', index: 'factoringStartDate', width: 180, sort: {default: null, compare: null, key: 'factoringStartDate', reName:
      { ascend: '1', descend: '-1' }}, render: 'dateTpl' },
    { title: '保理融资到期日', index: 'factoringEndDate', width: 180, sort: {default: null, compare: null, key: 'factoringEndDate', reName:
      { ascend: '1', descend: '-1' }}, render: 'dateTpl' },
    { title: '审核人', index: 'reviewer', width: 100,  },
    { title: '托管行', index: 'depositBank', width: 220,  },
    { title: '是否补充到期日', index: 'isFactoringEndDate', width: 120, render: 'factoringEndDateTpl' },
  ];

  static getConfig(name: string) {
    return ReviewListConfig[name];
  }

  /**
   * @description: 配置数据处理--自定义表头 搜索项
   * @param {string[]} columns 字段数组
   * @param {string} fieldKey 'key'搜索项  'index'表头
   * @param {string} type 'defaultFields'搜索项  'defaultColumns'表头
   * @param {string[]} exceptKeys 过滤掉特殊字段
   * @return {*}
   */
  static setConfigValue(columns: string[], fieldKey: string, type: string, exceptKeys: string[] = [] ) {
    const filterArr = (ReviewListConfig[type] as any[]).filter((x: any) => !exceptKeys.includes(x[fieldKey]));
    const syllables = JSON.parse(JSON.stringify(filterArr));
    syllables.map((x: any) => {
      x.checked = !!columns.includes(x[fieldKey]);
    });
    return syllables;
  }
}
