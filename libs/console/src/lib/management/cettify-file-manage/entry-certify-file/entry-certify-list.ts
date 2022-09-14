import { TableData, Column } from '@lr/ngx-table';
import { FormlyFieldConfig } from '@ngx-formly/core';
import * as moment from 'moment';

export const entryCertifylist: Column[] = [
    { title: '选择', index: 'id', fixed: 'left', width: 50, type: 'checkbox' },
    {
        title: '序号',
        index: 'no',
        width: 50,
        format: (item: TableData, col: Column, index: number): string => (index + 1).toString()
    },
    {

        title: '企业名称', index: 'appName', width: 100,
    },
    {
        title: '录入状态', index: 'record_status', width: 100, render: 'statusTpl', sort: {
            default: null,
            compare: null,
            key: '2',
            reName: { ascend: 'asc', descend: 'desc' },
        },
    },
    {
        title: '录入时间', index: 'createTime', width: 100, render: 'dateTpl',
        sort: {
            default: null,
            compare: null,
            key: '1',
            reName: { ascend: 'asc', descend: 'desc' },
        },

    },
    /** 0=草稿 1=未生效 2=已生效 */
    {
        title: '录入人员', index: 'operator_user_name', width: 100,
    },
];

export const entryCertifySearch: FormlyFieldConfig[] = [
    {
        className: 'ant-col ant-col-md-8 ant-col-sm-24',
        wrappers: ['form-field-horizontal'],
        key: 'appName',
        type: 'input',
        templateOptions: {
            label: '企业名称',
            placeholder: '请输入',
            autocomplete: 'off',
            labelSpan: 9,
            controlSpan: 15,
        },
    },
    {
        className: 'ant-col ant-col-md-8 ant-col-sm-24',
        wrappers: ['form-field-horizontal'],
        key: 'record_status',
        type: 'select',
        templateOptions: {
            label: '录入状态',
            nzPlaceHolder: '请选择',
            labelSpan: 9,
            controlSpan: 15,
            options: [
                { label: '经办', value: 1 },
                { label: '复核', value: 2 },
                { label: '已完成', value: 3 },
                { label: '已中止', value: 4 },

            ]
        },
    },
    {
        className: 'ant-col ant-col-md-8 ant-col-sm-24',
        key: 'createTime',
        type: 'date-range-picker',
        wrappers: ['form-field-horizontal'],
        defaultValue: null,
        templateOptions: {
            label: '录入时间',
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
        key: 'operator_user_name',
        type: 'input',
        templateOptions: {
            label: '录入人员',
            placeholder: '请输入',
            autocomplete: 'off',
            labelSpan: 9,
            controlSpan: 15,
        },
    },
];
