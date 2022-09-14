import * as moment from 'moment';
import { FormlyFieldConfig } from '@lr/ngx-formly';
import { SelectOptions } from 'libs/shared/src/lib/config/select-options';
import { TabConfigModel } from 'libs/shared/src/lib/config/list-config-model';
// import { FormlyFieldConfig } from '@lr/ngx-formly';


// 中登查询表格配置
export default class ZdSearchData {
  static zdsearch = {  // 合同模板列表templateName
    heads: [
      { label: '登记证明编号', value: 'registerNo', type: 'text', width: '2%' },  // templateName
      { label: '登记类型', value: 'registerType', type: 'text', width: '2%' },  // templateName
      { label: '交易业务类型', value: 'bizType', type: 'text', width: '5%' },  // templateName

      { label: '登记时间', value: 'registerDate', type: 'date', width: '4%' },
      { label: '登记到期日', value: 'registerDueDate', type: 'date', width: '4%' },
      { label: '命中信息', value: 'hitInfomation', type: 'information', width: '20%' },
      // { label: '合同名称', value: 'contractName', type: 'contractNo1', width: '20%' },
      // { label: '基础合同编号', value: 'contractNo', type: 'contractNo', width: '10%' },
      // { label: '发票信息', value: 'invoiceInfo', type: 'invoiceInfo', width: '30%' },
      { label: '转让财产描述', value: 'transferAssetDesc', type: 'transferAssetDesc', width: '30%' },
      { label: '受让人', value: 'assignee', type: 'contractNo', width: '10%' },
      { label: '中登类别', value: 'classify', type: 'classType', width: '2%' },
      // { label: '中登附件', value: 'file', type: 'contract', width: '2%' },
      { label: '备注信息', value: 'remark', type: 'text', width: '5%' },
    ],
    showFields: [
      {
        className: 'ant-col ant-col-md-8 ant-col-sm-24',
        wrappers: ['form-field-horizontal'],
        key: 'transferor',
        type: 'input',
        defaultValue: '',
        templateOptions: {
          label: '出让人',
          placeholder: '请输入出让人',
          autocomplete: 'off',
          labelSpan: 9,
          controlSpan: 15,
          required: true,
        },
      },
      {
        className: 'ant-col ant-col-md-8 ant-col-sm-24',
        wrappers: ['form-field-horizontal'],
        key: 'invoices',
        type: 'input',
        defaultValue: null,
        templateOptions: {
          label: '发票号码',
          placeholder: '请输入',
          autocomplete: 'off',
          labelSpan: 9,
          controlSpan: 15,
        },
      },
      {
        className: 'ant-col ant-col-md-8 ant-col-sm-24',
        wrappers: ['form-field-horizontal'],
        key: 'contractNo',
        type: 'input',
        defaultValue: null,
        templateOptions: {
          label: '合同编号',
          placeholder: '请输入',
          autocomplete: 'off',
          labelSpan: 9,
          controlSpan: 15,
        },
      },
      {
        className: 'ant-col ant-col-md-8 ant-col-sm-24',
        wrappers: ['form-field-horizontal'],
        key: 'assignee',
        type: 'input',
        defaultValue: null,
        templateOptions: {
          label: '受让人',
          placeholder: '请输入',
          autocomplete: 'off',
          labelSpan: 9,
          controlSpan: 15,
        },
      },
      {
        className: 'ant-col ant-col-md-8 ant-col-sm-24',
        wrappers: ['form-field-horizontal'],
        key: 'invoicebetween',
        type: 'serial-invoice-search',
        defaultValue: null,
        templateOptions: {
          label: '连号发票查询',
          placeholder: '请输入',
          autocomplete: 'off',
          labelSpan: 9,
          controlSpan: 15,
          required: false,
        },
        validators: {
          invoicebetween: {
            expression: (c: { value: string }) => {
              if (c.value && JSON.parse(c.value).invoiceStart !== '' && JSON.parse(c.value).invoiceEnd !== '') {
                return /^(\d{8}|\d{10})$/.test(JSON.parse(c.value)?.invoiceStart)
                && /^(\d{8}|\d{10})$/.test(JSON.parse(c.value)?.invoiceEnd);
              } else {
                return true;
              }
            }

            ,
            message: (error: any, field: FormlyFieldConfig) => {
              return `请输入合法的发票号`;
            }


          }
        }
      },

      {
        className: 'ant-col ant-col-md-8 ant-col-sm-24',
        wrappers: ['form-field-horizontal'],
        key: 'contractName',
        type: 'input',
        defaultValue: null,
        templateOptions: {
          label: '合同名称',
          placeholder: '请输入合同名称',
          autocomplete: 'off',
          labelSpan: 9,
          controlSpan: 15,
        },
      },
      {
        className: 'ant-col ant-col-md-8 ant-col-sm-24',
        wrappers: ['form-field-horizontal'],
        key: 'debtor',
        type: 'input',
        defaultValue: null,
        templateOptions: {
          label: '债务人',
          placeholder: '请输入债务人',
          autocomplete: 'off',
          labelSpan: 9,
          controlSpan: 15,
        },
      },
      {
        className: 'ant-col ant-col-md-8 ant-col-sm-24',
        key: 'registerTime',
        type: 'date-range-picker',
        wrappers: ['form-field-horizontal'],
        defaultValue: null,
        templateOptions: {
          label: '登记时间',
          nzMode: 'time',
          nzShowTime: false,
          nzAllowClear: true,
          // nzSize: 'large',
          nzFormat: 'yyyy-MM-dd HH:mm:ss',
          nzPlaceHolder: ['开始日期', '结束日期'],
          nzDefaultPickerValue: [],
          nzRanges: {
            今天: [moment().startOf('day').toDate(), moment().endOf('day').toDate()],
            昨天: [moment().subtract(1, 'days').startOf('day').toDate(), moment().subtract(1, 'days').endOf('day').toDate()],
            近7天: [moment().subtract(7, 'days').startOf('day').toDate(), moment().endOf('day').toDate()],
            近30天: [moment().subtract(30, 'days').startOf('day').toDate(), moment().endOf('day').toDate()],
            近90天: [moment().subtract(90, 'days').startOf('day').toDate(), moment().endOf('day').toDate()],
            近180天: [moment().subtract(180, 'days').startOf('day').toDate(), moment().endOf('day').toDate()],
            近365天: [moment().subtract(365, 'days').startOf('day').toDate(), moment().endOf('day').toDate()],
            这个月: [moment().startOf('month').toDate(), moment().endOf('month').toDate()],
            上个月: [moment().subtract(1, 'month').startOf('month').toDate(), moment().subtract(1, 'month').endOf('month').toDate()],
          },
          labelSpan: 9,
          controlSpan: 15,
          nzOnChange: () => { },
        },
      },
      {
        className: 'ant-col ant-col-md-8 ant-col-sm-24',
        wrappers: ['form-field-horizontal'],
        key: 'registerNo',
        type: 'input',
        defaultValue: null,
        templateOptions: {
          label: '登记证明编号',
          placeholder: '请输入登记证明编号',
          autocomplete: 'off',
          labelSpan: 9,
          controlSpan: 15,
        },
      },
      {
        className: 'ant-col ant-col-md-8 ant-col-sm-24',
        wrappers: ['form-field-horizontal'],
        key: 'bizType',
        type: 'select',
        defaultValue: null,
        templateOptions: {
          label: '交易业务类型',
          nzPlaceHolder: '请选择',
          labelSpan: 9,
          controlSpan: 15,
          options: [
            { label: '应收账款转让', value: '应收账款转让' },
            { label: '融资租赁', value: '融资租赁' },
            { label: '应收账款质押', value: '应收账款质押' },
            { label: '生产设备、原材料、半成品、产品抵押', value: '生产设备、原材料、半成品、产品抵押' },
            { label: '存款单、仓单、提单质押', value: '存款单、仓单、提单质押' },
            { label: '所有权保留', value: '所有权保留' },
            { label: '保证金质押', value: '保证金质押' },
            { label: '存货质押', value: '存货质押' },
            { label: '留置权', value: '留置权' },
            { label: '动产信托', value: '动产信托' },
            { label: '其他动产权利担保', value: '其他动产权利担保' },
          ]
        },
      },
      {
        className: 'ant-col ant-col-md-8 ant-col-sm-24',
        key: 'registerDueDate',
        type: 'date-range-picker',
        wrappers: ['form-field-horizontal'],
        defaultValue: null,
        templateOptions: {
          label: '登记到期日',
          nzMode: 'time',
          nzShowTime: false,
          nzAllowClear: true,
          nzAutoFocus: false,
          // nzSize: 'large',
          nzFormat: 'yyyy-MM-dd HH:mm:ss',
          nzPlaceHolder: ['开始日期', '结束日期'],
          nzDefaultPickerValue: [],
          nzRanges: {
            今天: [moment().startOf('day').toDate(), moment().endOf('day').toDate()],
            昨天: [moment().subtract(1, 'days').startOf('day').toDate(), moment().subtract(1, 'days').endOf('day').toDate()],
            近7天: [moment().subtract(7, 'days').startOf('day').toDate(), moment().endOf('day').toDate()],
            近30天: [moment().subtract(30, 'days').startOf('day').toDate(), moment().endOf('day').toDate()],
            近90天: [moment().subtract(90, 'days').startOf('day').toDate(), moment().endOf('day').toDate()],
            近180天: [moment().subtract(180, 'days').startOf('day').toDate(), moment().endOf('day').toDate()],
            近365天: [moment().subtract(365, 'days').startOf('day').toDate(), moment().endOf('day').toDate()],
            这个月: [moment().startOf('month').toDate(), moment().endOf('month').toDate()],
            上个月: [moment().subtract(1, 'month').startOf('month').toDate(), moment().subtract(1, 'month').endOf('month').toDate()],
          },
          labelSpan: 9,
          controlSpan: 15,
          nzOnChange: () => { },
        },
      },
      {
        className: 'ant-col ant-col-md-8 ant-col-sm-24',
        wrappers: ['form-field-horizontal'],
        key: 'classify',
        type: 'select',
        defaultValue: null,
        templateOptions: {
          label: '中登类别',
          nzPlaceHolder: '请选择',
          labelSpan: 9,
          controlSpan: 15,
          options: SelectOptions.get('zhongDengInvoiceType')
        },
      },
    ] as FormlyFieldConfig[],
  };
  // 多标签页，A,B,C,D,E,F......
  static readonly config = {
    zhongdengsearch: {
      title: '中登查询',
      value: 'zd-search',
      tabList: [
        {
          label: '',
          value: 'A',
          subTabList: [
            {
              label: '未上传',
              value: 'DOING',
              canSearch: true,
              canChecked: true,
              edit: {
                headButtons: [
                ],
                rowButtons: [
                ]
              },
              searches: ZdSearchData.zdsearch.showFields,
              headText: [...ZdSearchData.zdsearch.heads],
            }
          ],
          post_url: '/custom/zhongdeng/zd/smart_query'
        },
      ]
    } as TabConfigModel
  };
  static getConfig(name) {
    return this.config[name];
  }
}
