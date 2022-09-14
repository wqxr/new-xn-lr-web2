/*************************************************************************
 * Copyright (c) 2017 - 2021 深圳市链融科技股份有限公司
 * Shenzhen Lianrong Technology Co., Ltd.
 * All rights reserved.
 *
 * @file：libs\products\abs-gj\src\lib\pages\receipt-list\receipt-list.ts
 * @summary：receipt-list.ts
 * @version: 1.0
 * *************************************************************************
 * revision             author            reason             date
 * 1.0                  DengPei           init               2021-11-24
 ***************************************************************************/
import { IsPerformanceOptions } from '../../../../../../shared/src/lib/config/options/abs-gj.options';
import CommBase from '../comm-base';
import { FormlyFieldConfig } from '@ngx-formly/core';

export default class ReceiptList {
  static readonly showName = '待签署合同列表';
  static readonly showPage = true;
  static readonly apiUrlBase = '/project_add_file/signList';
  static readonly apiUrlDetail = '/flow/main/detail';
  static readonly webUrlBase = '/console/main-list/';
  static readonly keys = ['mainFlowId']; // 根据这个数组来匹配

  static readonly fields = [
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
      title: '申请付款单位',
      checkerId: 'projectCompany',
      memo: '',
      type: 'br',
      _inList: {
        sort: false,
        search: true
      },
      _inNew: false
    },
    {
      title: '应收账款金额', checkerId: 'receive', memo: '',
      _inList: false,
      _inEdit: {
        options: {
          readonly: true
        }
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
      title: '基础合同名称', checkerId: 'contractName', memo: '',
      _inSearch: {
        number: 3
      },
      _inList: false,
      _inEdit: {
        options: {
          readonly: true
        }
      }
    },
    {
      title: '总部公司',
      checkerId: 'headquarters',
      memo: '',
      _inList: {
        sort: false,
        search: false
      }
    },
    {
      title: '资产编号',
      checkerId: 'poolTradeCode',
      memo: '',
      _inList: {
        sort: false,
        search: false
      }
    },
    {
      title: '付款确认书编号（总部致券商）',
      checkerId: 'codeBrokerPayConfirm',
      memo: '',
      _inList: {
        sort: false,
        search: false
      }
    },
    {
      title: '付款确认书编号（总部致保理商）',
      checkerId: 'codeFactoringPayConfirm',
      memo: '',
      _inList: {
        sort: false,
        search: false
      }
    },
    {
      title: '项目名称',
      checkerId: 'projectName',
      memo: '',
      _inList: {
        sort: false,
        search: false
      }
    },
    {
      title: '合同名称',
      checkerId: 'contractName',
      memo: '',
      _inList: {
        sort: false,
        search: false
      }
    },
    {
      title: '合同编号',
      checkerId: 'contractId',
      memo: '',
      _inList: {
        sort: false,
        search: false
      }
    },
    {
      title: '资产池名称',
      checkerId: 'capitalPoolName',
      memo: '',
      _inList: {
        sort: false,
        search: false
      }
    },
    {
      title: '审核经办人(一次签署)',
      checkerId: 'signCheckPerson',
      memo: '',
      _inList: {
        sort: false,
        search: false
      }
    },
    {
      title: '审核经办人(二次签署)',
      checkerId: 'signCheckPersonTwo',
      memo: '',
      _inList: {
        sort: false,
        search: false
      }
    },
    {
      title: '审核经办人(补充协议签署)',
      checkerId: 'signCheckPersonAdd',
      memo: '',
      _inList: {
        sort: false,
        search: false
      }
    },
    {
      title: '交易金额',
      checkerId: 'receive',
      memo: '',
      type: 'money',
      _inList: {
        sort: false,
        search: false
      }
    },
    {
      title: '资产转让折扣率',
      checkerId: 'discountRate',
      memo: '',
      _inList: {
        sort: false,
        search: true
      }
    },
    {
      title: '交易状态',
      checkerId: 'tradeStatus',
      memo: '',
      type: 'xnMainFlowStatus',
      _inList: {
        sort: false,
        search: false
      },
      _inNew: false
    },
    {
      title: '资金渠道',
      checkerId: 'moneyChannel',
      memo: '',
      type: 'xnMoneyChannel',
      _inList: {
        sort: false,
        search: false
      },
      _inNew: false
    },
    {
      title: '《致项目公司通知书（二次转让）》',
      checkerId: 'projectNotice2',
      memo: '',
      _inList: {
        sort: false,
        search: false
      },
      _inNew: false
    },
    {
      title: '《项目公司回执（二次转让)》',
      checkerId: 'hasProjectReceipt2',
      memo: '',
      _inList: false,
      _inNew: false
    },
    {
      title: '《项目公司回执（二次转让)》',
      checkerId: 'projectReceipt2',
      memo: '',
      _inList: {
        sort: false,
        search: false
      },
      _inNew: false
    },
    {
      title: '《项目公司回执（一次转让)》',
      checkerId: 'hasProjectReceipt1',
      memo: '',
      _inList: false,
      _inNew: false
    },
    {
      title: '《项目公司回执(一次转让)》',
      checkerId: 'projectReceipt1',
      memo: '',
      _inList: {
        sort: false,
        search: false
      },
      _inNew: false
    },
    {
      title: '《债权转让及账户变更通知的补充说明》',
      checkerId: 'hasChangeNoticeAdd',
      memo: '',
      _inList: false,
      _inNew: false
    },
    {
      title: '《债权转让及账户变更通知的补充说明》',
      checkerId: 'changeNoticeAdd',
      memo: '',
      _inList: {
        sort: false,
        search: false
      },
      _inNew: false
    },
    {
      title: '推送企业次数',
      checkerId: 'pushCount',
      memo: '',
      _inList: {
        sort: false,
        search: false
      },
      _inNew: false
    },
  ];

  // 只要存在detail配置就允许查看详情
  static readonly detail = {
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
        labelSpan: 8,
        controlSpan: 16,
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
        labelSpan: 8,
        controlSpan: 16,
      },
    },
    {
      className: 'ant-col ant-col-md-8 ant-col-sm-24',
      key: 'changePrice',
      type: 'input',
      wrappers: ['form-field-horizontal'],
      templateOptions: {
        label: '转让价款',
        labelSpan: 8,
        controlSpan: 16,
        placeholder: '请输入',
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
        labelSpan: 8,
        controlSpan: 16,
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
        labelSpan: 8,
        controlSpan: 16,
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
        labelSpan: 8,
        controlSpan: 16,
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
        labelSpan: 8,
        controlSpan: 16,
      },
    },
    {
      className: 'ant-col ant-col-md-8 ant-col-sm-24 lone-label-fix',
      wrappers: ['form-field-horizontal'],
      key: 'signCheckPerson',
      type: 'input',
      templateOptions: {
        label: '审核经办人(一次签署)',
        placeholder: '请输入',
        labelSpan: 8,
        controlSpan: 16,
      },
    },
    {
      className: 'ant-col ant-col-md-8 ant-col-sm-24 lone-label-fix',
      wrappers: ['form-field-horizontal'],
      key: 'signCheckPersonTwo',
      type: 'input',
      templateOptions: {
        label: '审核经办人(二次签署)',
        placeholder: '请输入',
        labelSpan: 8,
        controlSpan: 16,
      },
    },
    {
      className: 'ant-col ant-col-md-8 ant-col-sm-24 lone-label-fix',
      wrappers: ['form-field-horizontal'],
      key: 'signCheckPersonAdd',
      type: 'input',
      templateOptions: {
        label: '审核经办人(补充协议签署)',
        placeholder: '请输入',
        labelSpan: 8,
        controlSpan: 16,
      },
    },
    {
      className: 'ant-col ant-col-md-8 ant-col-sm-24 lone-label-fix',
      wrappers: ['form-field-horizontal'],
      key: 'hasProjectReceipt1',
      type: 'select',
      templateOptions: {
        label: '《项目公司回执（一次转让)》',
        nzPlaceHolder: '请选择',
        labelSpan: 8,
        controlSpan: 16,
        options: IsPerformanceOptions,
      },
    },
    {
      className: 'ant-col ant-col-md-8 ant-col-sm-24 lone-label-fix',
      wrappers: ['form-field-horizontal'],
      key: 'projectReceipt2',
      type: 'select',
      templateOptions: {
        label: '《项目公司回执（二次转让)》',
        nzPlaceHolder: '请选择',
        labelSpan: 8,
        controlSpan: 16,
        options: IsPerformanceOptions,
      },
    },
    {
      className: 'ant-col ant-col-md-8 ant-col-sm-24 lone-label-fix',
      wrappers: ['form-field-horizontal'],
      key: 'hasChangeNoticeAdd',
      type: 'select',
      templateOptions: {
        label: '《债权转让及账户变更通知补充说明》',
        nzPlaceHolder: '请选择',
        labelSpan: 8,
        controlSpan: 16,
        options: IsPerformanceOptions,
      },
    },
  ];
}
