import { TableData, Column } from '@lr/ngx-table';
import { FormlyFieldConfig } from '@ngx-formly/core';
import * as moment from 'moment';

export const zdSearchRecordList: Column[] = [
    {
        title: '序号',
        index: 'no',
        width: 50,
        format: (item: TableData, col: Column, index: number): string => (index + 1).toString()
    },
    {
        title: '操作机构', index: 'app_name', width: 100,
    },
    { title: '操作账号', index: 'mobile', width: 100, },
    /** 0=草稿 1=未生效 2=已生效 */
    {
        title: '操作人', index: 'user_name', width: 100,
    },
    {
        title: '出让人', index: 'transferor', width: 100,
    },
    {
        title: '操作时间', index: 'gmt_create', width: 100,
    },

];
export const SearchDetailHeads: Column[] = [
    {
        title: '序号',
        index: 'no',
        width: 100,
        format: (item: TableData, col: Column, index: number): string => (index + 1).toString()
    },
    {
        title: '登记证明编号', index: 'register_no'
    },
    {
        title: '识别类型', index: 'classify', render: 'zdStatusTpl'
    },
]

export const zdSearchRecordfieldList: FormlyFieldConfig[] = [
    {
        className: 'ant-col ant-col-md-8 ant-col-sm-24',
        wrappers: ['form-field-horizontal'],
        key: 'app_name',
        type: 'input',
        templateOptions: {
            label: '操作机构',
            placeholder: '请输入',
            autocomplete: 'off',
            labelSpan: 9,
            controlSpan: 15,
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
        key: 'user_name',
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
        wrappers: ['form-field-horizontal'],
        key: 'transferor',
        type: 'input',
        templateOptions: {
            label: '出让人',
            placeholder: '请输入',
            autocomplete: 'off',
            labelSpan: 9,
            controlSpan: 15,
        },
    },
    {
        className: 'ant-col ant-col-md-8 ant-col-sm-24',
        key: 'operateTime',
        type: 'date-picker',
        wrappers: ['form-field-horizontal'],
        templateOptions: {
            label: '操作时间',
            nzShowTime: false,
            nzAllowClear: true,
            required: false,
            nzFormat: 'yyyy-MM-dd',
            labelSpan: 9,
            controlSpan: 15,
        },
    },
];
