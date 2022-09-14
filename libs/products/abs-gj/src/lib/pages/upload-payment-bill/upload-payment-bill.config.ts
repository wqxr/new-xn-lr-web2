/*************************************************************************
 * Copyright (c) 2017 - 2021 深圳市链融科技股份有限公司
 * Shenzhen Lianrong Technology Co., Ltd.
 * All rights reserved.
 *
 * @file：libs\products\abs-gj\src\lib\pages\upload-payment-bill\upload-payment-bill.config.ts
 * @summary：upload-payment-bill.config.ts
 * @version: 1.0
 * *************************************************************************
 * revision             author            reason             date
 * 1.0                  DengPei           init               2021-12-01
 ***************************************************************************/
import { ListHeadsFieldOutputModel, TabConfigModel } from '../../../../../../shared/src/lib/config/list-config-model';
import { XnService } from '../../../../../../shared/src/lib/services/xn.service';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { DEFAULT_DATE_TIME_OPTIONS } from '../../../../../../shared/src/lib/config/constants';
import { FlowId, SubTabValue, TabValue } from '../../../../../../shared/src/lib/config/enum';

export default class UploadPaymentBillConfig {
  static headsAndSearches = {
    heads: [
      {label: '交易ID', value: 'mainFlowId', type: 'mainFlowId'},
      {label: '申请付款单位', value: 'projectCompany'},
      {label: '收款单位', value: 'debtUnit'},
      {label: '总部公司', value: 'headquarters'},
      {label: '资产池名称', value: 'capitalPoolName'},
      {label: '合同编号', value: 'contractId'},
      {label: '应收账款金额', value: 'receive', type: 'receive'},
      {label: '提单日期', value: 'createTime', type: 'date'},
      {label: '起息日', value: 'valueDate', type: 'date'},
      {label: '保理融资到期日', value: 'factoringEndDate', type: 'date'},
    ] as ListHeadsFieldOutputModel[],
  };

  config = {
    title: '上传付款确认书',
    value: 'upload_qrs',
    tabList: [
      {
        label: '',
        value: TabValue.First,
        subTabList: [
          {
            label: '未上传',
            value: SubTabValue.DOING,
            canSearch: true,
            canChecked: true,
            edit: {
              headButtons: [
                {
                  label: '人工匹配付款确认书',
                  operate: 'person_match_qrs',
                  post_url: '/customer/changecompany',
                  disabled: false,
                  click: (xn: XnService, params) => {
                    xn.router.navigate([`/abs-gj/record/new/${FlowId.CMNPersonMatchQrs}`],
                      {
                        queryParams: {
                          id: FlowId.CMNPersonMatchQrs,
                          relate: 'mainIds',
                          relateValue: params,
                        }
                      });
                  },
                },
              ],
              rowButtons: []
            },
            headText: [...UploadPaymentBillConfig.headsAndSearches.heads,
              {label: '付款确认书（总部致保理商）影印件', value: 'factoringPayConfirmYyj', type: 'file'},
              {label: '付款确认书（总部致保理商）合同编号', value: 'codeFactoringPayConfirm', type: 'text'},
              {label: '付款确认书（总部致券商）影印件', value: 'brokerPayConfirmYyj', type: 'file'},
              {label: '付款确认书（总部致券商）合同编号', value: 'codeBrokerPayConfirm', type: 'text'}
            ],
          },
          {
            label: '已上传',
            value: SubTabValue.DONE,
            canSearch: true,
            canChecked: true,
            edit: {
              headButtons: [
                {
                  label: '替换付款确认书',
                  operate: 'replace_qrs',
                  post_url: '/customer/changecompany',
                  disabled: false,
                  click: (xn: XnService, params) => {
                    xn.router.navigate([`/abs-gj/record/new/sub_replace_qrs`],
                      {
                        queryParams: {
                          id: 'sub_replace_qrs',
                          relate: 'mainIds',
                          relateValue: params,
                        }
                      });
                  },
                },
              ],
              rowButtons: []
            },
            headText: [...UploadPaymentBillConfig.headsAndSearches.heads,
              {label: '付款确认书（总部致保理商）影印件', value: 'factoringPayConfirmYyj', type: 'file'},
              {label: '付款确认书（总部致保理商）合同编号', value: 'codeFactoringPayConfirm', type: 'text'},
              {label: '付款确认书（总部致券商）影印件', value: 'brokerPayConfirmYyj', type: 'file'},
              {label: '付款确认书（总部致券商）合同编号', value: 'codeBrokerPayConfirm', type: 'text'},
              {label: '付确匹配方式', value: 'qrsMatchMethod', type: 'qrsMatchMethod'}
            ],
          },
        ],
        post_url: '/upload_qrs/list'
      },
    ]
  } as TabConfigModel;

  fieldConfig: FormlyFieldConfig[] = [
    {
      className: 'ant-col ant-col-md-8 ant-col-sm-24',
      wrappers: ['form-field-horizontal'],
      key: 'capitalPoolName',
      type: 'input',
      templateOptions: {
        label: '资产池名称',
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
      key: 'receive',
      type: 'input',
      templateOptions: {
        label: '应收账款金额',
        placeholder: '请输入',
        labelSpan: 6,
        controlSpan: 18,
      },
    },
    {
      className: 'ant-col ant-col-md-8 ant-col-sm-24',
      key: 'preDate',
      type: 'date-range-picker',
      wrappers: ['form-field-horizontal'],
      templateOptions: {
        ...DEFAULT_DATE_TIME_OPTIONS,
        nzFormat: 'yyyy-MM-dd',
        nzShowTime: false,
        label: '提单日期',
        labelSpan: 6,
        controlSpan: 18,
      },
    },
    {
      className: 'ant-col ant-col-md-8 ant-col-sm-24',
      key: 'factoringEndDate',
      type: 'date-range-picker',
      wrappers: ['form-field-horizontal'],
      templateOptions: {
        ...DEFAULT_DATE_TIME_OPTIONS,
        nzFormat: 'yyyy-MM-dd',
        nzShowTime: false,
        label: '保理融资到期日',
        labelSpan: 6,
        controlSpan: 18,
      },
    },
  ];
}
