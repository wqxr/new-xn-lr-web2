
/*
 * Copyright(c) 2017-2019, 深圳市链融科技股份有限公司
 * Beijing Xiwei Technology Co., Ltd.
 * All rights reserved.
 *
 * @file：RepaymentConfigList
 * @summary：还款管理页面配置
 * @version: 1.0
 * **********************************************************************
 * revision             author            reason             date
 * 1.0                hucongying       金地数据对接      2020-12-03
 * **********************************************************************
 */

import { TabConfigModel } from 'libs/shared/src/lib/config/list-config-model';
import { Column, TableData } from '@lr/ngx-table';
import * as moment from 'moment';
import { FormlyFieldConfig } from '@lr/ngx-formly';



export default class RepaymentConfigList {

  static commonConfig = {
    // 表头
    heads: [
      { title: '选择', index: 'id', width: 50, type: 'checkbox' },
      {
        title: '序号', index: 'no', width: 50,
        format: (item: TableData, col: Column, index: number): string => (index + 1).toString()
      },
      {
        title: '交易ID', index: 'mainFlowId', render: 'mainFlowIdTpl', sort: {
          default: null, compare: null, key: 'mainFlowId', reName:
            { ascend: '1', descend: '-1' }
        },
      },
      { title: '融资单号', index: 'billNumber' },
      { title: '申请付款单位', index: 'projectCompany' },
      { title: '收款单位', index: 'debtUnit' },
      { title: '总部公司', index: 'headquarters' },
      { title: '付款确认书编号', index: 'payConfirmId' },
      {
        title: '交易金额', index: 'receive', render: 'moneyTpl', sort: {
          default: null, compare: null, key: 'receive', reName:
            { ascend: '1', descend: '-1' }
        },
      },
      { title: '利率', index: 'discountRate', render: 'rateTpl' },
      // 合同类型0：无类型选项 1：工程，2：贸易，3：设计，4：监理
      { title: '合同类型', index: 'contractType', render: 'contractTypeTpl' },
      { title: '资产池名称', index: 'capitalPoolName' },
      {
        title: '保理融资到期日', index: 'factoringEndDate', render: 'dateTpl', sort: {
          default: null, compare: null, key: 'factoringEndDate', reName:
            { ascend: '1', descend: '-1' }
        },
      },
      {
        title: '打款时间', index: 'jdPayTime', render: 'dateTpl', sort: {
          default: null, compare: null, key: 'jdPayTime', reName:
            { ascend: '1', descend: '-1' }
        },
      },
      { title: '打款备注', index: 'jdRemark', render: 'TooltipTpl' },
      { title: '收款账户名称', index: 'jdBankAccountName' },
      { title: '收款开户银行', index: 'jdBankName' },
      { title: '收款账号', index: 'jdBankAccountNumber' },
    ] as Column[],
    // 搜索表单
    showFields: [
      {
        className: 'ant-col ant-col-md-8 ant-col-sm-24',
        wrappers: ['form-field-horizontal'],
        key: 'mainFlowId',
        type: 'input',
        templateOptions: {
          label: '交易ID',
          placeholder: '请输入',
          autocomplete: 'off',
          labelSpan: 9,
          controlSpan: 15,
        },
      },
      {
        className: 'ant-col ant-col-md-8 ant-col-sm-24',
        wrappers: ['form-field-horizontal'],
        key: 'billNumber',
        type: 'input',
        templateOptions: {
          label: '融资单号',
          placeholder: '请输入',
          autocomplete: 'off',
          labelSpan: 9,
          controlSpan: 15,
        },
      },
      {
        className: 'ant-col ant-col-md-8 ant-col-sm-24',
        wrappers: ['form-field-horizontal'],
        key: 'projectCompany',
        type: 'input',
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
        type: 'input',
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
        key: 'payConfirmId',
        type: 'input',
        templateOptions: {
          label: '付款确认书编号',
          placeholder: '请输入',
          autocomplete: 'off',
          labelSpan: 9,
          controlSpan: 15,
        },
      },
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
          nzOnChange: () => { },
        },
      },
      {
        className: 'ant-col ant-col-md-8 ant-col-sm-24',
        key: 'jdPayTime',
        type: 'date-range-picker',
        wrappers: ['form-field-horizontal'],
        defaultValue: [],
        templateOptions: {
          label: '打款时间',
          nzMode: 'time',
          nzShowTime: true,
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
        key: 'capitalPoolName',
        type: 'input',
        templateOptions: {
          label: '资产池名称',
          placeholder: '请输入',
          autocomplete: 'off',
          labelSpan: 9,
          controlSpan: 15,
        },
      },
      {
        className: 'ant-col ant-col-md-8 ant-col-sm-24',
        wrappers: ['form-field-horizontal'],
        key: 'isPool',
        type: 'select',
        templateOptions: {
          label: '是否已入池',
          nzPlaceHolder: '请选择',
          labelSpan: 9,
          controlSpan: 15,
          options: [
            { label: '未入池', value: 0 },
            { label: '已入池', value: 1 }
          ]
        },
      },
    ] as FormlyFieldConfig[]
  };


  // 多标签页，A,B,C,D,E,F......
  static readonly config = {
    // 保理商
    machineAccount: {
      title: '还款管理-金地',
      tabList: [
        {
          label: '待确认账号列表',
          value: 'A',
          subTabList: [
            {
              label: '进行中',
              value: 'DOING',
              canSearch: true,
              canChecked: true,
              count: 0,
              edit: {
                headButtons: [
                  {
                    label: '确认回款账号',
                    operate: 'confirm_repayNumber',
                    post_url: '',
                    disabled: true,
                  },
                  {
                    label: '数据导出',
                    operate: 'export_data',
                    post_url: '/sub_system/jd_system/jd_repayment_excel_download',
                    disabled: true,
                  },
                ],
              },
              showFields: RepaymentConfigList.commonConfig.showFields,
              headText: RepaymentConfigList.commonConfig.heads,
            },
          ],
          post_url: '/sub_system/jd_system/jd_repayment_list',
          params: 0, // 列表类型 0=待确认银行账户 1=已确认 2=已回款
        },
        {
          label: '已确认账号列表',
          value: 'B',
          subTabList: [
            {
              label: '进行中',
              value: 'DOING',
              canSearch: true,
              canChecked: true,
              count: 0,
              edit: {
                headButtons: [
                  {
                    label: '数据导出',
                    operate: 'export_data',
                    post_url: '/sub_system/jd_system/jd_repayment_excel_download',
                    disabled: true,
                  },
                ],
              },
              showFields: RepaymentConfigList.commonConfig.showFields,
              headText: RepaymentConfigList.commonConfig.heads,
            },
          ],
          post_url: '/sub_system/jd_system/jd_repayment_list',
          params: 1, // 列表类型 0=待确认银行账户 1=已确认 2=已回款
        },
        {
          label: '已回款列表',
          value: 'C',
          subTabList: [
            {
              label: '进行中',
              value: 'DOING',
              canSearch: true,
              canChecked: true,
              count: 0,
              edit: {
                headButtons: [
                  {
                    label: '数据导出',
                    operate: 'export_data',
                    post_url: '/sub_system/jd_system/jd_repayment_excel_download',
                    disabled: true,
                  },
                ],
              },
              showFields: [...RepaymentConfigList.commonConfig.showFields,
              {
                className: 'ant-col ant-col-md-8 ant-col-sm-24',
                key: 'jdPaybackTime',
                type: 'date-range-picker',
                wrappers: ['form-field-horizontal'],
                defaultValue: [],
                templateOptions: {
                  label: '金地还款时间',
                  nzMode: 'time',
                  nzShowTime: true,
                  nzAllowClear: true,
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
              }, ],
              headText: [...RepaymentConfigList.commonConfig.heads,
              {
                title: '金地还款时间', index: 'jdPaybackTime', render: 'dateTpl', sort: {
                  default: null, compare: null, key: 'jdPaybackTime', reName:
                    { ascend: '1', descend: '-1' }
                },
              },
              {
                title: '金地还款金额', index: 'jdPaybackAmount', render: 'moneyTpl', sort: {
                  default: null, compare: null, key: 'jdPaybackAmount', reName:
                    { ascend: '1', descend: '-1' }
                },
              }, ],
            },
          ],
          post_url: '/sub_system/jd_system/jd_repayment_list',
          params: 2, // 列表类型 0=待确认银行账户 1=已确认 2=已回款
        },
      ]
    } as TabConfigModel,
  };
  static getConfig(name: string) {
    return this.config[name];
  }
}
