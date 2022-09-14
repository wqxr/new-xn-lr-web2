/*************************************************************************
 * Copyright (c) 2017 - 2021 深圳市链融科技股份有限公司
 * Shenzhen Lianrong Technology Co., Ltd.
 * All rights reserved.
 *
 * @file：libs\products\abs-gj\src\lib\common\enter-pool-capital.ts
 * @summary：enter-pool-capital.ts
 * @version: 1.0
 * *************************************************************************
 * revision             author            reason             date
 * 1.0                  DengPei           init               2021-11-24
 ***************************************************************************/

import { ListHeadsFieldOutputModel } from '../../../../../../../shared/src/lib/config/list-config-model';
import { TabValue } from 'libs/shared/src/lib/config/enum/abs-gj.enum';
import {
  GjChannelOptions,
  CompanyNameOptions,
  GjTradeStatusOptions, IsPerformanceOptions
} from 'libs/shared/src/lib/config/options/abs-gj.options';
import { FormlyFieldConfig } from '@ngx-formly/core';

export default class GjEnterPoolConfig {
  static enterPoolList = {
    heads: [
      {
        label: '交易ID', value: 'mainFlowId', type: 'mainFlowId', _inList: {
          sort: true,
          search: true
        }
      },
      {label: '资产池名称', value: 'capitalPoolName'},
      {label: '收款单位', value: 'debtUnit'},
      {label: '申请付款单位', value: 'projectCompany', },
      {label: '总部公司', value: 'headquarters'},
      {label: '渠道', value: 'productType', type: 'productType'},
      {
        label: '应收账款金额', value: 'receive', type: 'money', _inList: {
          sort: true,
          search: true
        },
      },
      {label: '上传发票与预录入是否一致', value: 'isInvoiceFlag', type: 'text1'},
      {label: '创建时间', value: 'createTime', type: 'date'},
      {label: '总部提单日期', value: 'headPreDate', type: 'date'},
      {label: '付款确认书编号', value: 'payConfirmId', type: ''},
      {label: '合同签署时间', value: 'signContractDate', type: 'date'},
      {label: '预计放款日', value: 'priorityLoanDate', type: 'date'},
      {label: '当前步骤', value: 'flowId', type: 'currentStep'},
      {label: '实际放款日', value: 'realLoanDate', type: 'date'},
      {label: '收款单位是否注册', value: 'isRegisterSupplier', type: 'text1'},
      {
        label: '资金渠道', value: 'channelType', type: 'text1', _inList: {
          sort: false,
          search: false
        },
      },
      {
        label: '付款银行', value: 'bankName', type: 'fundingInfo', _inList: {
          sort: false,
          search: false
        }
      },
      {
        label: '付款银行账号', value: 'cardCode', type: 'fundingInfo', _inList: {
          sort: false,
          search: false
        }
      },
      {label: '台账备注', value: 'memo', type: 'memo'},
    ] as ListHeadsFieldOutputModel[],
  };

  readonly config = {
    title: '拟入池交易列表',
    tabList: [
      {
        label: '所有交易',
        value: TabValue.First,
        canChecked: true,
        edit: {
          leftheadButtons: [
            {
              label: '移入资产池',
              operate: 'enter-capitalpool',
              post_url: '/customer/changecompany',
              disabled: false,
            },
            {
              label: '批量补充信息',
              operate: 'batch-information',
              post_url: '/customer/changecompany',
              disabled: false,
            },
          ],
          rightheadButtons: [
            {
              label: '下载附件',
              operate: 'download-file',
              post_url: '/customer/changecompany',
              disabled: false,
            },
            {
              label: '导出清单',
              operate: 'export-file',
              post_url: '/customer/changecompany',
              disabled: false,
            },
          ],
        },
        headText: GjEnterPoolConfig.enterPoolList.heads,
        get_url: '/project_manage/pool/pool_plan_list',
      }
    ]
  };

  readonly fieldConfig: FormlyFieldConfig[] = [
    {
      className: 'ant-col ant-col-md-8 ant-col-sm-24',
      wrappers: ['form-field-horizontal'],
      key: 'debtUnit',
      type: 'input',
      templateOptions: {
        label: '收款单位',
        placeholder: '请输入',
        labelSpan: 6,
        controlSpan: 18,
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
        labelSpan: 6,
        controlSpan: 18,
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
        labelSpan: 6,
        controlSpan: 18,
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
        labelSpan: 6,
        controlSpan: 18,
      },
    },
    {
      className: 'ant-col ant-col-md-8 ant-col-sm-24',
      wrappers: ['form-field-horizontal'],
      key: 'flowId',
      type: 'select',
      templateOptions: {
        label: '交易状态',
        nzPlaceHolder: '请选择',
        labelSpan: 6,
        controlSpan: 18,
        options: GjTradeStatusOptions,
      },
    },
    {
      className: 'ant-col ant-col-md-8 ant-col-sm-24',
      wrappers: ['form-field-horizontal'],
      key: 'capitalPoolName',
      type: 'per-text',
      templateOptions: {
        label: '资产池名称',
        placeholder: '请输入',
        labelSpan: 6,
        controlSpan: 18,
      },
    },
    {
      className: 'ant-col ant-col-md-8 ant-col-sm-24',
      key: 'preDate',
      type: 'per-date-picker',
      wrappers: ['form-field-horizontal'],
      templateOptions: {
        label: '总部提单日期',
        labelSpan: 6,
        controlSpan: 18,
      },
    },
    {
      className: 'ant-col ant-col-md-8 ant-col-sm-24',
      key: 'receive',
      type: 'input',
      wrappers: ['form-field-horizontal'],
      templateOptions: {
        placeholder: '请输入',
        label: '应收账款金额',
        labelSpan: 6,
        controlSpan: 18,
      },
    },
    {
      className: 'ant-col ant-col-md-8 ant-col-sm-24',
      key: 'type',
      type: 'select',
      wrappers: ['form-field-horizontal'],
      templateOptions: {
        nzPlaceHolder: '请选择',
        label: '渠道',
        labelSpan: 6,
        controlSpan: 18,
        options: GjChannelOptions,
      },
    },
    {
      className: 'ant-col ant-col-md-8 ant-col-sm-24',
      key: 'headquarters',
      type: 'select',
      wrappers: ['form-field-horizontal'],
      templateOptions: {
        nzPlaceHolder: '请选择',
        label: '总部公司',
        labelSpan: 6,
        controlSpan: 18,
        options: CompanyNameOptions,
      },
    },
    {
      className: 'ant-col ant-col-md-8 ant-col-sm-24 lone-label-fix',
      key: 'isInvoiceFlag',
      type: 'select',
      wrappers: ['form-field-horizontal'],
      templateOptions: {
        nzPlaceHolder: '请选择',
        label: '实际上传发票与预录入是否一致',
        labelSpan: 6,
        controlSpan: 18,
        options: IsPerformanceOptions,
      },
    },
  ];
}
