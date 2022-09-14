
/*
 * Copyright(c) 2017-2019, 深圳市链融科技股份有限公司
 * Beijing Xiwei Technology Co., Ltd.
 * All rights reserved.
 *
 * @file：libs\console\src\lib\pages\check-task-management\check-task-list-config.ts
 * @summary：审核任务列表配置
 * @version: 1.0
 * **********************************************************************
 * revision             author            reason             date
 * 1.0                hucongying           init           2021-09-23
 * **********************************************************************
 */

import { TabConfigModel } from 'libs/shared/src/lib/config/list-config-model';
import { Column, TableData } from '@lr/ngx-table';
import { FormlyFieldConfig } from '@lr/ngx-formly';
import { TaskStatus } from 'libs/shared/src/lib/config/options';
import { SubTabListEnum, TabListIndexEnum } from 'libs/shared/src/lib/config/enum';
import { SelectOptions } from 'libs/shared/src/lib/config/select-options';



export default class CheckTaskConfigList {

  static commonConfig = {
    // 表头
    heads: [
      { title: '选择', index: 'id', fixed: 'left', width: 50, type: 'checkbox' },
      {
        title: '序号', index: 'no', width: 50,
        format: (item: TableData, col: Column, index: number): string => (index + 1).toString()
      },
      { title: '交易Id', index: 'mainFlowId', render: 'mainFlowIdTpl', width: 260 },
      { title: '任务状态', index: 'taskStatus', render: 'taskStatusTpl', width: 260 },
      { title: '交易状态', index: 'flowId', render: 'tradeStatusTpl', width: 260 },
      { title: '产品名称', index: 'channel', render: 'productTypeTpl', width: 260, },
      { title: '供应商', index: 'debtUnit', width: 260 },
      { title: '申请付款单位', index: 'projectCompany', width: 260 },
      { title: '核心企业内部区域', index: 'area', width: 260 },
      { title: '申请单位归属城市', index: 'supplierCity', width: 260 },
      { title: '应收账款金额', index: 'receive', render: 'receiveTpl', width: 260 },
      { title: '一线审核时间', index: 'ccsAduitDatetime', render: 'dateTimeTpl', width: 260 },
      { title: '资金中心审核时间', index: 'ccsApproveTime', render: 'dateTimeTpl', width: 260 },
      {
        title: '分配时间', index: 'taskCreateTime', render: 'dateTimeTpl',
        sort: { default: null, compare: null, key: 'taskCreateTime', reName: { ascend: 'asc', descend: 'desc' } }, width: 260,

      },
      { title: '分配人', index: 'createUserName', width: 260, },
      { title: '审单经办人', index: 'operatorUserInfo', render: 'operatorsTpl', width: 260 },
      { title: '审单复核人', index: 'reviewerUserInfo', render: 'operatorsTpl', width: 260 },
    ] as Column[],
    // 搜索表单
    showFields: [
      {
        className: 'ant-col ant-col-md-8 ant-col-sm-24',
        wrappers: ['form-field-horizontal'],
        key: 'productType',
        type: 'linkage-select',
        defaultValue: '',
        templateOptions: {
          label: '产品名称',
          placeholder: '请选择',
          mode: 'fixed',
          options: SelectOptions.get('productType_dw'),
          labelSpan: 9,
          controlSpan: 15,
        },
      },
      {
        className: 'ant-col ant-col-md-8 ant-col-sm-24',
        wrappers: ['form-field-horizontal'],
        key: 'taskStatus',
        type: 'select',
        templateOptions: {
          label: '任务状态',
          nzPlaceHolder: '请选择',
          labelSpan: 9,
          controlSpan: 15,
          options: TaskStatus
        },
      },
      {
        className: 'ant-col ant-col-md-8 ant-col-sm-24',
        wrappers: ['form-field-horizontal'],
        key: 'area',
        type: 'input',
        templateOptions: {
          label: '核心企业内部区域',
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
          label: '供应商',
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
        key: 'supplierCity',
        type: 'input',
        templateOptions: {
          label: '申请单位归属城市',
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
          label: '交易Id',
          placeholder: '请输入',
          autocomplete: 'off',
          labelSpan: 9,
          controlSpan: 15,
        },
      },
      {
        className: 'ant-col ant-col-md-8 ant-col-sm-24',
        wrappers: ['form-field-horizontal'],
        key: 'checkTime',
        type: 'date-range-picker',
        templateOptions: {
          label: '一线审核时间',
          nzMode: 'time',
          nzShowTime: true,
          nzAllowClear: true,
          nzPlaceHolder: ['开始时间', '结束时间'],
          nzFormat: 'yyyy-MM-dd HH:mm',
          labelSpan: 9,
          controlSpan: 15,
        },
      },
      {
        className: 'ant-col ant-col-md-8 ant-col-sm-24',
        wrappers: ['form-field-horizontal'],
        key: 'centerCheckTime',
        type: 'date-range-picker',
        templateOptions: {
          label: '资金中心审核时间',
          nzMode: 'time',
          nzShowTime: true,
          nzAllowClear: true,
          nzPlaceHolder: ['开始时间', '结束时间'],
          nzFormat: 'yyyy-MM-dd HH:mm',
          labelSpan: 9,
          controlSpan: 15,
        },
      },
    ] as FormlyFieldConfig[]
  };


  // 多标签页，A,B,C,D,E,F......
  static readonly tabConfig = {
    title: '审核任务管理',
    tabList: [
      {
        label: '待分配',
        value: TabListIndexEnum.NO_ASSIGN,
        subTabList: [
          {
            label: '进行中',
            value: SubTabListEnum.DOING,
            edit: {},
            showFields: CheckTaskConfigList.commonConfig.showFields,
            headText: CheckTaskConfigList.commonConfig.heads,
          },
        ],
        post_url: '/sub_system/jd_system/jd_repayment_list',
      },
    ]
  } as TabConfigModel;

}
