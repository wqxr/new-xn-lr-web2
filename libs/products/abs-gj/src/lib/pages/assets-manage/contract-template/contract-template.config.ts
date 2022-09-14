/*************************************************************************
 * Copyright (c) 2017 - 2021 深圳市链融科技股份有限公司
 * Shenzhen Lianrong Technology Co., Ltd.
 * All rights reserved.
 *
 * @file：libs\products\abs-gj\src\lib\common\second-contract-template.tab.ts
 * @summary：second-contract-template.tab.ts
 * @version: 1.0
 * *************************************************************************
 * revision             author            reason             date
 * 1.0                  DengPei           init               2021-12-13
 ***************************************************************************/

import { TabConfigModel } from 'libs/shared/src/lib/config/list-config-model';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { ContractTempStatusOptions, SignerOptions } from 'libs/shared/src/lib/config/options/abs-gj.options';
import { SubTabValue, TabValue } from 'libs/shared/src/lib/config/enum/abs-gj.enum';

export default class ContractTemplateConfig {
  // 二次转让合同模板列表
  static secondContractTemplateList = {
    heads: [
      {label: '合同模板名称', value: 'templateFile', type: 'contract'},  // templateName
      {label: '总部公司', value: 'headquarters', type: 'text'},
      {label: '签署方式', value: 'signType', type: 'signType'},
      {label: '生成逻辑', value: 'style', type: 'style'},
      {label: '签署方', value: 'signer', type: 'signer'},
      {label: '合同模板状态', value: 'templateStatus', type: 'templateStatus'},
      {label: '最后修改时间', value: 'updateTime', type: 'date'},
    ],
    searches: [
      {
        title: '合同模板名称',
        checkerId: 'templateName',
        type: 'text',
        required: false,
        number: 1,
      },
      {
        title: '签署方',
        checkerId: 'signer',
        type: 'select',
        required: false,
        options: {ref: 'signer'},
        number: 3,

      },
      {
        title: '合同模板状态',
        checkerId: 'templateStatus',
        type: 'select',
        required: false,
        options: {ref: 'contractStatus'},
        number: 4,
      }
    ],
  };

  readonly config = {
    title: '二次转让合同管理-成都轨交',
    value: 'second_contract_manage',
    tabList: [
      {
        label: '合同模板列表',
        value: TabValue.First,
        subTabList: [
          {
            label: '未上传',
            value: SubTabValue.DOING,
            canSearch: true,
            canChecked: true,
            edit: {
              headButtons: [],
              rowButtons: []
            },
            searches: ContractTemplateConfig.secondContractTemplateList.searches,
            headText: [...ContractTemplateConfig.secondContractTemplateList.heads],
          }
        ],
        post_url: '/contract/second_contract_info/contract_template'
      },
    ]
  } as TabConfigModel;

  fieldConfig: FormlyFieldConfig[] = [
    {
      className: 'ant-col ant-col-md-8 ant-col-sm-24',
      wrappers: ['form-field-horizontal'],
      key: 'templateName',
      type: 'input',
      templateOptions: {
        label: '合同模板名称',
        placeholder: '请输入',
        labelSpan: 6,
        controlSpan: 18,
      },
    },
    {
      className: 'ant-col ant-col-md-8 ant-col-sm-24',
      wrappers: ['form-field-horizontal'],
      key: 'signer',
      type: 'select',
      templateOptions: {
        label: '签署方',
        nzPlaceHolder: '请选择',
        options: SignerOptions,
        labelSpan: 6,
        controlSpan: 18,
      },
    },
    {
      className: 'ant-col ant-col-md-8 ant-col-sm-24',
      wrappers: ['form-field-horizontal'],
      key: 'templateStatus',
      type: 'select',
      templateOptions: {
        label: '合同模板状态',
        nzPlaceHolder: '请选择',
        options: ContractTempStatusOptions,
        labelSpan: 6,
        controlSpan: 18,
      },
    },
  ];
}
