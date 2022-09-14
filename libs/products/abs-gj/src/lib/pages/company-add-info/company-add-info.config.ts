/*************************************************************************
 * Copyright (c) 2017 - 2021 深圳市链融科技股份有限公司
 * Shenzhen Lianrong Technology Co., Ltd.
 * All rights reserved.
 *
 * @file：libs\products\abs-gj\src\lib\pages\company-add-info\company-add-info.config.ts
 * @summary：company-add-info.config.ts
 * @version: 1.0
 * *************************************************************************
 * revision             author            reason             date
 * 1.0                  DengPei           init               2021-12-06
 ***************************************************************************/

import CommBase from '../comm-base';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { CoAddTradeStatusOptions } from 'libs/shared/src/lib/config/options';

export default class CompanyAddInfoConfig {

  showPage = true;
  keys = ['mainFlowId']; // 根据这个数组来匹配

  heads = [
    {
      title: '交易ID',
      checkerId: 'mainFlowId',
      memo: '',
      _inList: {
        sort: false,
        search: true
      },
    },
    {
      title: '收款单位',
      checkerId: 'debtUnit',
      memo: '',
      _inList: {
        sort: false,
        search: true
      }
    },
    {
      title: '基础合同名称',
      checkerId: 'contractName',
      memo: '',
      _inList: {
        sort: false,
        search: true
      }
    },
    {
      title: '项目名称',
      checkerId: 'projectName',
      memo: '',
      _inList: {
        sort: false,
        search: true
      }
    },
    {
      title: '应收账款金额',
      checkerId: 'receive',
      memo: '',
      type: 'money',
      _inList: {
        sort: false,
        search: true
      }
    },
    {
      title: '转让价款',
      checkerId: 'changePrice',
      memo: '',
      type: 'money',
      _inList: {
        sort: false,
        search: false,
      }
    },
    {
      title: '交易状态',
      checkerId: 'tradeStatus',
      memo: '',
      _inList: {
        sort: false,
        search: true
      },
    },
    {
      title: '创建时间',
      checkerId: 'createTime',
      memo: '',
      type: 'date',
      _inList: {
        sort: true,
        search: false
      },
    },
    {
      title: '补充资料经办人',
      checkerId: 'performanceMan',
      memo: '',
      _inList: {
        sort: false,
        search: true
      }
    },
    {
      title: '项目公司补充文件',
      checkerId: 'performanceFile',
      memo: '',
      _inList: {
        sort: false,
        search: false
      },
    }
  ];

  detail = {
    onDetail: (base: CommBase, json) => {
      base.onListDetail(json);
    }
  };

  fieldConfig: FormlyFieldConfig[] = [
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
      key: 'contractName',
      type: 'input',
      templateOptions: {
        label: '基础合同名称',
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
      key: 'changePrice',
      type: 'input',
      wrappers: ['form-field-horizontal'],
      templateOptions: {
        label: '转让价款',
        labelSpan: 6,
        controlSpan: 18,
        placeholder: '请输入',
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
        options: CoAddTradeStatusOptions,
      },
    },
    {
      className: 'ant-col ant-col-md-8 ant-col-sm-24',
      wrappers: ['form-field-horizontal'],
      key: 'projectName',
      type: 'input',
      templateOptions: {
        label: '项目名称',
        placeholder: '请输入',
        labelSpan: 6,
        controlSpan: 18,
      },
    },
    {
      className: 'ant-col ant-col-md-8 ant-col-sm-24',
      key: 'performanceMan',
      type: 'input',
      wrappers: ['form-field-horizontal'],
      templateOptions: {
        label: '补充资料经办人',
        labelSpan: 6,
        controlSpan: 18,
        placeholder: '请输入',
      },
    }
  ];
}
