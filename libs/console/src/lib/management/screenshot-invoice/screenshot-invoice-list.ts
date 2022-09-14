import { TableData, Column } from '@lr/ngx-table';
import { FormlyFieldConfig } from '@ngx-formly/core';
import * as moment from 'moment';

export const screenshotInvoiceList: Column[] = [
    {
        title: '序号',
        index: 'no',
        width: 50,
        format: (item: TableData, col: Column, index: number): string => (index + 1).toString()
    },
    {

        title: '操作人', index: 'operatorName', width: 100,
    },
    {
        title: '操作账号', index: 'operatorAccount', width: 100,
    },
    { title: '操作时间', index: 'createTime', width: 100, render: 'dateTpl' },
    /** 0=草稿 1=未生效 2=已生效 */
    {
        title: '状态', index: 'status', render: 'statusTpl', width: 100,
    },
    {
        title: '进度', index: 'completeStatus', render: 'completeStatus', width: 80,
    },
    {
        title: '失败数量', index: 'failCount', render: 'failCount', width: 80,
    },
    {
        title: '上传文件名称', index: 'fileName',width: 140,
    },

];

export const showFieldsInvoice: FormlyFieldConfig[] = [
    {
        className: 'ant-col ant-col-md-8 ant-col-sm-24',
        wrappers: ['form-field-horizontal'],
        key: 'operatorName',
        type: 'input',
        templateOptions: {
            label: '操作人',
            placeholder: '请输入',
            autocomplete: 'off',
            labelSpan: 9,
            controlSpan: 15,
        },
    },
    {
        className: 'ant-col ant-col-md-8 ant-col-sm-24',
        key: 'operatTime',
        type: 'date-range-picker',
        wrappers: ['form-field-horizontal'],
        defaultValue: null,
        templateOptions: {
          label: '操作时间',
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
        key: 'operatorAccount',
        type: 'input',
        templateOptions: {
            label: '操作账号',
            placeholder: '请输入',
            autocomplete: 'off',
            labelSpan: 9,
            controlSpan: 15,
        },
    },
    {
        className: 'ant-col ant-col-md-8 ant-col-sm-24',
        wrappers: ['form-field-horizontal'],
        key: 'status',
        type: 'select',
        templateOptions: {
            label: '状态',
            nzPlaceHolder: '请选择',
            labelSpan: 9,
            controlSpan: 15,
            options: [
                { label: '已完成', value: 1 },
                { label: '未完成', value: 0 },
            ]
        },
    },
    {
        className: 'ant-col ant-col-md-8 ant-col-sm-24',
        wrappers: ['form-field-horizontal'],
        key: 'fileName',
        type: 'input',
        templateOptions: {
            label: '文件名称',
            placeholder: '请输入',
            autocomplete: 'off',
            labelSpan: 9,
            controlSpan: 15,
        },
    },
];
export class detailScreenshotInvoice{
    static screenInvoicesearch = {
        heads:[
            {
                title: '序号',
                index: 'no',
                width: 50,fixed:'left',
                format: (item: TableData, col: Column, index: number): string => (index + 1).toString()
            },
            {

                title: '交易ID', index: 'mainFlowId', width: 250,render:'mainFlowIdTpl'
            },
            {
                title: '付款确认书编号', index: 'payConfirmId', width: 200,
            },
            { title: '发票代码', index: 'invoiceCode', width: 150, },
            /** 0=草稿 1=未生效 2=已生效 */
            {
                title: '发票号码', index: 'invoiceNum', width: 150, render:'file'
            },
            {
                title: '开票日期', index: 'invoiceDate', render: 'dateTpl', width: 150,
            },
            {
                title: '查验时间', index: 'checkTime',render: 'dateTimeTpl', width: 200,
            },
            {
                title: '不含税金额', index: 'amount',  width: 100,
            },
            {
                title: '含税金额', index: 'invoiceAmount', width: 100,
            },
            {
                title: '发票校验码', index: 'checkCode', width: 100,
            },
            {
                title: '查验状态', index: 'status', width: 100,render:'statusTpl'
            },
            {
                title: '发票状态', index: 'checkStatus', width: 100,render:'checkStatus'
            },
        ] as Column[],
        searches:[
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
                wrappers: ['form-field-horizontal'],
                key: 'invoiceCode',
                type: 'input',
                templateOptions: {
                    label: '发票代码',
                    placeholder: '请输入',
                    autocomplete: 'off',
                    labelSpan: 9,
                    controlSpan: 15,
                },
            },
            {
                className: 'ant-col ant-col-md-8 ant-col-sm-24',
                wrappers: ['form-field-horizontal'],
                key: 'invoiceNum',
                type: 'input',
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
                key: 'invoiceDate',
                type: 'date-range-picker',
                wrappers: ['form-field-horizontal'],
                defaultValue: null,
                templateOptions: {
                  label: '开票时间',
                  nzMode: 'time',
                  nzShowTime: false,
                  nzAllowClear: true,
                  // nzSize: 'large',
                  nzFormat: 'yyyy-MM-dd',
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
                key: 'status',
                type: 'select',
                templateOptions: {
                    label: '查验状态',
                    nzPlaceHolder: '请选择',
                    labelSpan: 9,
                    controlSpan: 15,
                    options: [
                        { label: '查验中', value: 0 },
                        { label: '成功', value: 1 },
                        { label: '失败', value: 2 },
                    ]
                },
            },
            {
                className: 'ant-col ant-col-md-8 ant-col-sm-24',
                wrappers: ['form-field-horizontal'],
                key: 'checkStatus',
                type: 'select',
                templateOptions: {
                    label: '发票状态',
                    nzPlaceHolder: '请选择',
                    labelSpan: 9,
                    controlSpan: 15,
                    options: [
                        { label: '红冲', value: 7 },
                        { label: '作废', value: 4 },
                        { label: '正常', value: 1 },
                    ]
                },
            },
            {
                className: 'ant-col ant-col-md-8 ant-col-sm-24',
                wrappers: ['form-field-horizontal'],
                key: 'amount',
                type: 'input',
                templateOptions: {
                    label: '不含税金额',
                    placeholder: '请输入',
                    autocomplete: 'off',
                    labelSpan: 9,
                    controlSpan: 15,
                },
            },
            {
                className: 'ant-col ant-col-md-8 ant-col-sm-24',
                wrappers: ['form-field-horizontal'],
                key: 'invoiceAmount',
                type: 'input',
                templateOptions: {
                    label: '含税金额',
                    placeholder: '请输入',
                    autocomplete: 'off',
                    labelSpan: 9,
                    controlSpan: 15,
                },
            },

        ]
    }
}
