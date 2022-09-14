/*************************************************************************
 * Copyright (c) 2017 - 2021 深圳市链融科技股份有限公司
 * Shenzhen Lianrong Technology Co., Ltd.
 * All rights reserved.
 *
 * @file：libs\products\abs-gj\src\lib\pages\home-task\home-task.config.ts
 * @summary：home-task.config.ts
 * @version: 1.0
 * *************************************************************************
 * revision             author            reason             date
 * 1.0                  DengPei           init               2021-12-01
 ***************************************************************************/

import DragonCommBase from 'libs/shared/src/lib/public/component/comm-dragon-base';
import { CompanyAppId, CompanyName, IsProxyDef } from '../../../../../../shared/src/lib/config/enum';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { IsPerformanceOptions, TaskFlowIdOptions, ProgressStepOptions } from 'libs/shared/src/lib/config/options';

export interface IToDoConfig {
  flowId: string;
  showName: string;
  showPage: boolean;
  apiUrlBase: string;
  webUrlBase: string;
  /** 展示操作项 */
  canDo: boolean;
  tableText: string;
  isProxy: number;
  headquarters: string;
  factoringAppId: number;
  /** 产品标识 */
  productIdent: string;
  /** 是否个人待办标识 */
  isPerson: boolean;
  heads: any[];
  fieldConfig: any[];
  fieldExt: any[];
  list: { [key: string]: any };
}

/** 首页代办配置 */
export class ToDoConfig implements IToDoConfig {
  flowId = '';
  showName = '';
  showPage = true;
  apiUrlBase = '/list/todo_record/list';
  webUrlBase = ``;
  canDo = true;
  tableText = 'text-left';
  isProxy = IsProxyDef.CDR;
  productIdent = '';
  isPerson = false;
  headquarters = CompanyName.CDR;
  factoringAppId = CompanyAppId.BLH;

  fieldConfig: FormlyFieldConfig[] = [
    {
      className: 'ant-col ant-col-md-8 ant-col-sm-24',
      wrappers: ['form-field-horizontal'],
      key: 'nowProcedureId',
      type: 'select',
      templateOptions: {
        label: '当前步骤',
        nzPlaceHolder: '请选择',
        labelSpan: 6,
        controlSpan: 18,
        options: ProgressStepOptions,
      },
    },
    {
      className: 'ant-col ant-col-md-8 ant-col-sm-24',
      wrappers: ['form-field-horizontal'],
      key: 'isPerformance',
      type: 'select',
      templateOptions: {
        label: '履约证明',
        nzPlaceHolder: '请选择',
        labelSpan: 6,
        controlSpan: 18,
        options: IsPerformanceOptions,
      },
    },
    {
      className: 'ant-col ant-col-md-8 ant-col-sm-24',
      wrappers: ['form-field-horizontal'],
      key: 'enterpriseOrgName',
      type: 'input',
      templateOptions: {
        label: '核心企业',
        placeholder: '请输入',
        labelSpan: 6,
        controlSpan: 18,
      },
    },
    {
      className: 'ant-col ant-col-md-8 ant-col-sm-24',
      wrappers: ['form-field-horizontal'],
      key: 'temporaryPerson',
      type: 'input',
      templateOptions: {
        label: '暂存人',
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
      key: 'receive',
      type: 'input',
      wrappers: ['form-field-horizontal'],
      templateOptions: {
        label: '交易金额',
        labelSpan: 6,
        controlSpan: 18,
        placeholder: '请输入',
      },
    },
  ];

  /** 【待办类型】查询表单项 */
  fieldExt: FormlyFieldConfig[] = [{
    className: 'ant-col ant-col-md-8 ant-col-sm-24',
    wrappers: ['form-field-horizontal'],
    key: 'flowId',
    type: 'select',
    templateOptions: {
      label: '待办类型',
      nzPlaceHolder: '请选择',
      labelSpan: 6,
      controlSpan: 18,
      options: TaskFlowIdOptions,
    },
  }];

  readonly heads = [
    {
      title: '记录ID', checkerId: 'flowName', memo: '', type: 'list-title',
      _inList: {
        sort: false,
        search: false
      },
    },
    {
      title: '标题', checkerId: 'title', memo: '', type: 'long-title',
      _inList: {
        sort: false,
        search: true
      }
    },
    {
      title: '项目名称', checkerId: 'projectName', memo: '',
      _inList: {
        sort: false,
        search: true
      }
    },
    {
      title: '履约证明', checkerId: 'isPerformance', memo: '', type: 'accountReceipts',
      _inList: {
        sort: false,
        search: false,
      }
    },
    {
      title: '核心企业', checkerId: 'enterpriseOrgName', memo: '',
      _inList: {
        sort: false,
        search: false,
      }
    },
    {
      title: '交易金额', checkerId: 'receive', memo: '', type: 'money',
      _inList: {
        sort: false,
        search: false,
      }
    },
    {
      title: '当前步骤', checkerId: 'nowProcedureId', memo: '',
      _inList: {
        sort: false,
        search: false,
      },
      type: 'select',
    },
    {
      title: '暂存人', checkerId: 'temporaryPerson', memo: '', type: 'people',
      _inList: {
        sort: false,
        search: false,
      }
    },
    {
      title: '收款单位', checkerId: 'debtUnit', memo: '', type: 'people',
      _inList: {
        sort: false,
        search: false,
      }
    },
    {
      title: '转让价款', checkerId: 'changePrice', memo: '', type: 'money',
      _inList: {
        sort: false,
        search: false,
      }
    },
  ];

  readonly list = {
    onList: (base: DragonCommBase, params) => {
      base.onDefaultList(params);
    },

    // 允许在行内根据不同条件增加行按钮
    rowButtons: [
      {
        title: '查看处理',
        type: 'a',
        // 如果can未定义，则默认是能显示的
        can: () => true,
      }
    ],
  };
}
