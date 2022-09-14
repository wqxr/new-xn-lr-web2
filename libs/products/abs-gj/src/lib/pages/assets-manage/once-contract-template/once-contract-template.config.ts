/*************************************************************************
 * Copyright (c) 2017 - 2021 深圳市链融科技股份有限公司
 * Shenzhen Lianrong Technology Co., Ltd.
 * All rights reserved.
 *
 * @file：libs\products\abs-gj\src\lib\pages\assets-manage\once-contract-template\once-contract-template.config.ts
 * @summary：once-contract-template.config.ts
 * @version: 1.0
 * *************************************************************************
 * revision             author            reason             date
 * 1.0                  DengPei           init               2021-12-15
 ***************************************************************************/
import {
  TabConfigModel
} from '../../../../../../../shared/src/lib/config/list-config-model';
import { XnService } from '../../../../../../../shared/src/lib/services/xn.service';
import { FlowId, SubTabValue, TabValue } from '../../../../../../../shared/src/lib/config/enum';

export default class OnceContractTemplateTab {
  static contractGroupList = { // 合同组列表界面页面配置
    heads: [
      {label: '备注', value: 'contractListName'},    // 合同组名称
      {label: '适用总部公司', value: 'headquarters'},
      {label: '合同组', value: 'fitProject', type: 'fit'},  // 适用项目
      {label: '适用收款单位', value: 'fitDebtUnit', type: 'fit'},
      {label: '合同模板', value: 'contractTemplate', type: 'contract'},
      {label: '合同组状态', value: 'contractStatus', type: 'contractStatus'},
      {label: '最后修改时间', value: 'updateTime', type: 'date'},
    ],
    searches: [
      {
        title: '合同组名称',
        checkerId: 'contractListName',
        type: 'text',
        required: false,
        number: 1,
      },
      {
        title: '适用项目',
        checkerId: 'fitProject',
        type: 'contract-select-gj',
        required: false,
        options: {},
        number: 3,
      },
      {
        title: '适用收款单位', checkerId: 'fitDebtUnit', type: 'text', required: false,
      },
      {
        title: '合同组状态',
        checkerId: 'contractStatus',
        type: 'select',
        required: false,
        options: {ref: 'contractStatus'},
        number: 5,
      }
    ],
  };
  static contractTemplate = {
    title: '合同模板选择',
    heads: [
      {label: '合同模板', value: 'templateFile', type: 'contract'},  // templateName
      {label: '合同模板类型', value: 'templateType', type: 'templateType'},
    ],
    searches: [
      {title: '合同模板', checkerId: 'templateName', type: 'text', required: false, number: 1},
      {
        title: '合同模板类型',
        checkerId: 'templateType',
        type: 'select',
        options: {ref: 'templateType'},
        required: false,
        number: 2
      }
    ],
    get_url: '/contract/first_contract_info/get_template_list',
    get_type: 'dragon',
    label: 'templateName'  // 选择后显示的字段值
  };
  static fitProject = {
    title: '适用项目选择',
    heads: [
      {label: '项目名称', value: 'projectName', type: 'text'},
      {label: '来源', value: 'type', type: 'projectType'},
    ],
    searches: [
      {title: '储架/银行', checkerId: 'type', type: 'select', options: {ref: 'projectType'}, required: false, number: 1},
    ],
    get_url: '/contract/first_contract_info/get_project_list',
    get_type: 'dragon',
    label: 'projectName'
  };
  static fitDebtUnit = {
    title: '企业选择',
    heads: [
      {label: '企业ID', value: 'appId', type: 'text'},
      {label: '企业名称', value: 'orgName', type: 'text'},
      {label: '企业类型', value: 'orgType', type: 'orgType'},
      {label: '企业创建时间', value: 'updateTime', type: 'date'},
    ],
    searches: [
      {title: '企业名称', checkerId: 'orgName', type: 'text', required: false, number: 1},
    ],
    get_url: '/contract/first_contract_info/get_org_list',
    get_type: 'dragon',
    label: 'orgName'
  };

  static contractTemplateList = {  // 合同模板列表templateName
    heads: [
      {label: '合同模板名称', value: 'templateFile', type: 'contract'},  // templateName
      {label: '合同模板类型', value: 'templateType', type: 'templateType'},
      {label: '签署方', value: 'signer', type: 'signer'},
      {label: '特定条件', value: 'specialCondition', type: 'specialCondition'},
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
        title: '合同模板类型',
        checkerId: 'templateType',
        type: 'select',
        required: false,
        options: {ref: 'templateType'},
        number: 2,

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

  // 二次转让合同模板列表
  static secondContractTemplateList = {  // 合同模板列表templateName
    heads: [
      {label: '合同模板名称', value: 'templateFile', type: 'contract'},  // templateName
      {label: '签署方式', value: 'signMethod', type: 'signMethod'},
      {label: '生成逻辑', value: 'generateLogic', type: 'text'},
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
        title: '合同模板类型',
        checkerId: 'templateType',
        type: 'select',
        required: false,
        options: {ref: 'templateType'},
        number: 2,

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

  static readonly config = {
    title: '一次转让合同管理功能',
    value: 'once_contract_manage',
    tabList: [
      {
        label: '合同组列表',
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
                  label: '新增',
                  operate: 'sub_first_contract_add',
                  post_url: '/',
                  disabled: false,
                  click: (xn: XnService, params) => {
                    const rolesArr = xn.user.roles.filter((x) => {
                      return x === 'operator';
                    });
                    if (!(rolesArr && rolesArr.length)) {
                      xn.msgBox.open(false, '您好，您的权限不够，仅【业务经办人】可进行操作');
                    } else {
                      xn.router.navigate([`/abs-gj/record/new/${FlowId.CMNAddFirstContract}`],
                        {
                          queryParams: {
                            id: FlowId.CMNAddFirstContract,
                            relate: 'mainIds',
                            relateValue: params,
                          }
                        });
                    }
                  },

                },
              ],
              rowButtons: [
                {
                  label: '修改',
                  operate: 'sub_first_contract_modify',
                  post_url: '',
                  click: (xn: XnService, params) => {
                    const rolesArr = xn.user.roles.filter((x) => {
                      return x === 'operator';
                    });
                    if (!(rolesArr && rolesArr.length)) {
                      xn.msgBox.open(false, '您好，您的权限不够，仅【业务经办人】可进行操作');
                    } else {
                      xn.router.navigate([`/abs-gj/record/new/${FlowId.CMNEditFirstContract}`],
                        {
                          queryParams: {
                            id: FlowId.CMNEditFirstContract,
                            relate: 'mainIds',
                            relateValue: [params],
                          }
                        });
                    }
                  }
                },
                {
                  label: '删除',
                  operate: 'sub_first_contract_delete',
                  post_url: '',
                  click: (xn: XnService, params) => {
                    const rolesArr = xn.user.roles.filter((x) => {
                      return x === 'operator';
                    });
                    if (!(rolesArr && rolesArr.length)) {
                      xn.msgBox.open(false, '您好，您的权限不够，仅【业务经办人】可进行操作');
                    } else {
                      xn.router.navigate([`/abs-gj/record/new/${FlowId.CMNDelFirstContract}`],
                        {
                          queryParams: {
                            id: FlowId.CMNDelFirstContract,
                            relate: 'mainIds',
                            relateValue: [params],
                          }
                        });
                    }
                  }
                }
              ]
            },
            searches: OnceContractTemplateTab.contractGroupList.searches,
            params: 0,
            headText: [...OnceContractTemplateTab.contractGroupList.heads],
          }
        ],
        post_url: '/contract/first_contract_info/contract_list'
      },
      {
        label: '合同模板列表',
        value: TabValue.Second,
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
            searches: OnceContractTemplateTab.contractTemplateList.searches,
            params: 1,
            headText: [...OnceContractTemplateTab.contractTemplateList.heads],
          }
        ],
        post_url: '/contract/first_contract_info/contract_template'
      },
    ]
  } as TabConfigModel;

  static getConfig() {
    return this.config;
  }
}
