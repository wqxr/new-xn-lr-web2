import { TabConfigModel } from './list-config-model';

export class ProjectManageAuth {
  // 中介机构权限-通用配置
  static readonly allAgencyConfig = {
    // 项目列表
    projectList: {
      title: '项目管理',
      value: 'projectList',
      tabList: [
        {
          label: 'ABS储架项目',
          value: 'A',
          agencyTypeList: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
          subTabList: [
            {
              label: '进行中',
              value: 'DOING',
              canSearch: true,
              canChecked: true,
              // 列表内容
              tableContent: { readonly: [] },
              agencyTypeList: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
              edit: {
                leftheadButtons: [
                  {
                    label: '回传文件',
                    operate: 'return_file',
                    post_url:
                      '/custom/avenger/down_file/download_approval_list',
                    disabled: false,
                    readonly: [],
                    agencyTypeList: [0],
                  },
                ],
                rightheadButtons: [
                  {
                    label: '设立项目',
                    operate: 'set-up-project',
                    post_url: '/jd/approval',
                    disabled: false,
                    readonly: [],
                    agencyTypeList: [0],
                  },
                ],
                rowButtons: [
                  {
                    label: '专项计划列表',
                    operate: 'confirm_receivable',
                    post_url: '/customer/changecompany',
                    disabled: false,
                    readonly: [],
                    agencyTypeList: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
                  },
                  {
                    label: '设置',
                    operate: 'set-up-button',
                    readonly: [],
                    agencyTypeList: [0, 1, 7],
                    children: [
                      {
                        label: '修改基本信息',
                        operate: 'change_info',
                        post_url: '',
                        disabled: false,
                        readonly: [],
                        agencyTypeList: [0],
                      },
                      {
                        label: '添加参与机构',
                        operate: 'intermediary_agencyForm',
                        post_url: '',
                        disabled: false,
                        readonly: [],
                        agencyTypeList: [0],
                      },
                      {
                        label: '选择交易文件',
                        operate: 'chose_fileComplate',
                        post_url: '',
                        disabled: false,
                        readonly: [],
                        agencyTypeList: [0],
                      },
                      {
                        label: '设置警戒比例',
                        operate: 'alert_ratioForm',
                        post_url: '',
                        disabled: false,
                        readonly: [],
                        agencyTypeList: [0],
                      },
                      {
                        label: '提醒管理',
                        operate: 'notice_manage',
                        post_url: '',
                        disabled: false,
                        readonly: [],
                        agencyTypeList: [0, 1, 7],
                      },
                      {
                        label: '删除项目',
                        operate: 'delete_project',
                        post_url: '',
                        disabled: false,
                        readonly: [],
                        agencyTypeList: [0],
                      },
                    ],
                  },
                ],
              },
              searches: [],
              headText: [],
            },
          ],
          post_url: '/project_manage/project/project_list',
          params: 1,
        },
        {
          label: '再保理银行项目',
          value: 'F',
          agencyTypeList: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
          subTabList: [
            {
              label: '进行中',
              value: 'DOING',
              canSearch: true,
              canChecked: true,
              // 列表内容
              tableContent: { readonly: [] },
              agencyTypeList: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
              edit: {
                leftheadButtons: [
                  {
                    label: '回传文件',
                    operate: 'return_file',
                    post_url:
                      '/custom/avenger/down_file/download_approval_list',
                    disabled: false,
                    readonly: [],
                    agencyTypeList: [0],
                  },
                ],
                rightheadButtons: [
                  {
                    label: '设立项目',
                    operate: 'set-up-project',
                    post_url: '/jd/approval',
                    disabled: false,
                    readonly: [],
                    agencyTypeList: [0],
                  },
                ],
                rowButtons: [
                  {
                    label: '专项计划列表',
                    operate: 'confirm_receivable',
                    post_url: '/customer/changecompany',
                    disabled: false,
                    readonly: [],
                    agencyTypeList: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
                  },
                  {
                    label: '设置',
                    operate: 'set-up-button',
                    readonly: [],
                    agencyTypeList: [0, 1, 7],
                    children: [
                      {
                        label: '修改基本信息',
                        operate: 'change_info',
                        post_url: '',
                        disabled: false,
                        readonly: [],
                        agencyTypeList: [0],
                      },
                      {
                        label: '添加参与机构',
                        operate: 'intermediary_agencyForm',
                        post_url: '',
                        disabled: false,
                        readonly: [],
                        agencyTypeList: [0],
                      },
                      {
                        label: '选择交易文件',
                        operate: 'chose_fileComplate',
                        post_url: '',
                        disabled: false,
                        readonly: [],
                        agencyTypeList: [0],
                      },
                      {
                        label: '设置警戒比例',
                        operate: 'alert_ratioForm',
                        post_url: '',
                        disabled: false,
                        readonly: [],
                        agencyTypeList: [0],
                      },
                      {
                        label: '提醒管理',
                        operate: 'notice_manage',
                        post_url: '',
                        disabled: false,
                        readonly: [],
                        agencyTypeList: [0, 1, 7],
                      },
                      {
                        label: '删除项目',
                        operate: 'delete_project',
                        post_url: '',
                        disabled: false,
                        readonly: [],
                        agencyTypeList: [0],
                      },
                    ],
                  },
                ],
              },
              searches: [],
              headText: [],
            },
          ],
          post_url: '/project_manage/project/project_list',
          params: 2,
        },
      ],
    } as TabConfigModel,
    // 专项计划列表
    specialPlanList: {
      title: '专项计划列表',
      value: 'specialPlanList',
      tabList: [
        {
          label: '专项计划列表',
          value: 'A',
          agencyTypeList: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
          subTabList: [
            {
              label: '进行中',
              value: 'DOING',
              canSearch: true,
              canChecked: true,
              // 列表内容
              tableContent: { readonly: [] },
              agencyTypeList: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
              edit: {
                rightheadButtons: [
                  {
                    label: '设立专项计划',
                    operate: 'set-plan',
                    post_url: '/jd/approval',
                    disabled: false,
                    readonly: [],
                    agencyTypeList: [0],
                  },
                  // {
                  //     label: '设立专项计划（旧）',
                  //     operate: 'set-oldplan',
                  //     post_url: '/jd/approval',
                  //     disabled: false,
                  //     readonly: [],
                  //     agencyTypeList: [0],
                  // },
                  {
                    label: '选择项目',
                    operate: 'chose-plan',
                    post_url: '/jd/approval',
                    disabled: false,
                    readonly: [],
                    agencyTypeList: [0],
                  },
                ],
                rowButtons: [
                  {
                    label: '统计信息',
                    operate: 'total_info',
                    post_url: '',
                    disabled: false,
                    readonly: [2, 3, 4, 5, 6, 7, 8],
                    agencyTypeList: [0, 2, 3, 4, 5, 6, 7, 8],
                  },
                  {
                    label: '添加交易',
                    operate: 'add_transaction',
                    post_url: '/customer/changecompany',
                    disabled: false,
                    readonly: [],
                    agencyTypeList: [0],
                  },
                  {
                    label: '设置',
                    operate: 'set-up-button',
                    readonly: [],
                    agencyTypeList: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
                    children: [
                      {
                        label: '修改发行要素',
                        operate: 'change_info',
                        post_url: '',
                        disabled: false,
                        readonly: [],
                        agencyTypeList: [0],
                      },
                      {
                        label: '回款维护',
                        operate: 'collect_amount',
                        post_url: '',
                        disabled: false,
                        readonly: [],
                        agencyTypeList: [0],
                      },
                      {
                        label: '产品配置',
                        operate: 'product_Config',
                        post_url: '',
                        disabled: false,
                        readonly: [],
                        agencyTypeList: [0],
                      },
                      {
                        label: '设置执行信息',
                        operate: 'set_executionInfo',
                        post_url: '',
                        disabled: false,
                        readonly: [2, 3, 4, 5, 6, 7, 8, 9],
                        agencyTypeList: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
                      },
                      {
                        label: '补充信息',
                        operate: 'add_Info',
                        post_url: '',
                        disabled: false,
                        readonly: [],
                        agencyTypeList: [0],
                      },
                      {
                        label: '上传文件',
                        operate: 'updata_file',
                        post_url: '',
                        disabled: false,
                        readonly: [],
                        agencyTypeList: [0, 1, 2, 3, 4, 5, 6, 7, 9, 10],
                      },
                      {
                        label: '评级',
                        operate: 'rate_grade',
                        post_url: '',
                        disabled: false,
                        readonly: [],
                        agencyTypeList: [0, 4, 7],
                      },
                      {
                        label: '锁定',
                        operate: 'lock_pool',
                        post_url: '',
                        disabled: false,
                        readonly: [],
                        agencyTypeList: [0],
                      },
                      {
                        label: '解锁',
                        operate: 'unlock_pool',
                        post_url: '',
                        disabled: false,
                        readonly: [],
                        agencyTypeList: [0],
                      },
                      {
                        label: '删除',
                        operate: 'delete_Info',
                        post_url: '',
                        disabled: false,
                        readonly: [],
                        agencyTypeList: [0],
                      },
                    ],
                  },
                ],
              },
              searches: [],
              headText: [],
            },
          ],
          post_url: '/project_manage/pool/pool_list',
          params: 1,
        },
      ],
    } as TabConfigModel,
    // 交易列表
    cpaitalTadeList: {
      title: '交易列表',
      value: 'cpaitalTadeList',
      tabList: [
        {
          label: '基础资产',
          value: 'A',
          agencyTypeList: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
          subTabList: [
            {
              label: '进行中',
              value: 'DOING',
              canSearch: true,
              canChecked: true,
              // 列表内容
              tableContent: { readonly: [] },
              agencyTypeList: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
              edit: {
                leftheadButtons: [
                  {
                    label: '交易变动记录',
                    operate: 'transaction_changes',
                    post_url: '',
                    disabled: false,
                    readonly: [0, 1, 2, 4, 5, 7, 8, 11],
                    agencyTypeList: [0, 1, 2, 4, 5, 7, 8, 11],
                  },
                  {
                    label: '批量补充信息',
                    operate: 'batch_information',
                    post_url: '',
                    disabled: false,
                    readonly: [],
                    agencyTypeList: [0],
                  },
                  {
                    label: '移除交易',
                    operate: 'remove_transaction',
                    post_url: '',
                    disabled: false,
                    readonly: [],
                    agencyTypeList: [0],
                  },
                  {
                    label: '添加交易',
                    operate: 'add_transaction',
                    post_url: '',
                    disabled: false,
                    readonly: [],
                    agencyTypeList: [0],
                  },
                ],
                rightheadButtons: [
                  {
                    label: '其他',
                    operate: 'other_btn',
                    readonly: [],
                    agencyTypeList: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
                    children: [
                      {
                        label: '抽样',
                        operate: 'capital_sample',
                        post_url: '/trade/down_file',
                        disabled: false,
                        readonly: [],
                        agencyTypeList: [5],
                      },
                      {
                        label: '数据分析',
                        operate: 'data_analyse',
                        post_url: '',
                        disabled: false,
                        readonly: [],
                        agencyTypeList: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
                      },
                      {
                        label: '特殊资产标记',
                        operate: 'specialAsset_mark',
                        post_url: '',
                        disabled: false,
                        readonly: [],
                        agencyTypeList: [1],
                      },
                      {
                        label: '发起变更',
                        operate: 'start_change',
                        post_url: '',
                        disabled: false,
                        readonly: [],
                        agencyTypeList: [0],
                      },
                    ],
                  },
                  {
                    label: '下载附件',
                    operate: 'download_file',
                    post_url: '/trade/down_file',
                    disabled: false,
                    readonly: [],
                    agencyTypeList: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
                  },
                  {
                    label: '导出清单',
                    operate: 'export_file',
                    post_url: '/trade/down_list',
                    disabled: false,
                    readonly: [],
                    agencyTypeList: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
                  },
                ],
                rowButtons: [],
              },
              searches: [],
              headText: [],
            },
          ],
          post_url: '/project_manage/pool/trade_list',
          params: 1,
        },
        {
          label: '交易文件',
          value: 'B',
          agencyTypeList: [0, 1, 2, 4, 5, 7, 8, 11],
          subTabList: [
            {
              label: '进行中',
              value: 'DOING',
              canSearch: true,
              canChecked: true,
              // 列表内容
              tableContent: { readonly: [] },
              agencyTypeList: [0, 1, 2, 4, 5, 7, 8, 11],
              edit: {
                leftheadButtons: [
                  {
                    label: '生成合同',
                    operate: 'generate_Contract',
                    post_url: '/jd/passApproval',
                    disabled: false,
                    readonly: [],
                    agencyTypeList: [0],
                  },
                  {
                    label: '生成并签署合同',
                    operate: 'contract_sign',
                    post_url: '/jd/passApproval',
                    disabled: false,
                    readonly: [],
                    agencyTypeList: [0],
                  },
                  {
                    label: '回传文件',
                    operate: 'return_file',
                    post_url:
                      '/custom/avenger/down_file/download_approval_list',
                    disabled: false,
                    readonly: [],
                    agencyTypeList: [0],
                  },
                  {
                    label: '其他',
                    operate: 'other_btn',
                    readonly: [],
                    agencyTypeList: [0],
                    children: [
                      {
                        label: '推送企业',
                        operate: 'push_business',
                        post_url:
                          '/custom/avenger/down_file/download_approval_list',
                        disabled: false,
                        readonly: [],
                        agencyTypeList: [0],
                      },
                      {
                        label: '推送企业(补充协议)',
                        operate: 'push_business_supply',
                        post_url: '',
                        disabled: false,
                        readonly: [],
                        agencyTypeList: [0],
                      },
                    ],
                  },
                ],
                rightheadButtons: [
                  {
                    label: '下载附件',
                    operate: 'download_file',
                    post_url: '/jd/approval',
                    disabled: false,
                    readonly: [],
                    agencyTypeList: [0, 1, 2, 4, 5, 7, 8, 11],
                  },
                  {
                    label: '导出清单',
                    operate: 'export_file',
                    post_url: '/jd/approval',
                    disabled: false,
                    readonly: [],
                    agencyTypeList: [0, 1, 2, 4, 5, 7, 8, 11],
                  },
                ],
                rowButtons: [],
              },
              searches: [],
              headText: [],
            },
          ],
          post_url: '/project_manage/file_contract/list',
          params: 2,
        },
        {
          label: '尽职调查',
          value: 'C',
          agencyTypeList: [0, 1, 2, 3, 4, 5, 6, 7, 8, 10, 11],
          subTabList: [
            {
              label: '进行中',
              value: 'DOING',
              canSearch: true,
              canChecked: true,
              // 列表内容
              tableContent: { readonly: [] },
              agencyTypeList: [0, 1, 2, 3, 4, 5, 6, 7, 8, 10, 11],
              edit: {
                rightheadButtons: [
                  {
                    label: '数据分析',
                    operate: 'data_analyse',
                    post_url: '',
                    disabled: false,
                    readonly: [],
                    agencyTypeList: [0, 1, 2, 3, 4, 5, 6, 7, 8, 10, 11],
                  },
                  {
                    label: '下载附件',
                    operate: 'download_file',
                    post_url: '/jd/passApproval',
                    disabled: false,
                    readonly: [],
                    agencyTypeList: [0, 1, 2, 3, 4, 5, 6, 7, 8, 10, 11],
                  },
                  {
                    label: '导出清单',
                    operate: 'export_file',
                    post_url: '/jd/passApproval',
                    disabled: false,
                    readonly: [],
                    agencyTypeList: [0, 1, 2, 3, 4, 5, 6, 7, 8, 10, 11],
                  },
                ],
                rowButtons: [
                  {
                    label: '发起尽调',
                    operate: 'sub_start_survey',
                    post_url: '',
                    disabled: false,
                    readonly: [],
                    agencyTypeList: [1, 5],
                  },
                ],
              },
              searches: [],
              headText: [],
            },
          ],
          post_url: '/project_manage/pool/trade_list',
          params: 3,
        },
        {
          label: '产品信息',
          value: 'D',
          agencyTypeList: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
          subTabList: [],
          post_url: '',
          params: 4,
        },
        {
          label: '特殊资产',
          value: 'E',
          agencyTypeList: [0, 1, 2, 4, 5, 7, 8],
          subTabList: [
            {
              label: '进行中',
              value: 'DOING',
              canSearch: true,
              canChecked: true,
              // 列表内容
              tableContent: { readonly: [] },
              agencyTypeList: [0, 1, 2, 4, 5, 7, 8],
              edit: {
                rightheadButtons: [
                  {
                    label: '下载附件',
                    operate: 'download_file',
                    post_url: '/jd/passApproval',
                    disabled: false,
                    readonly: [],
                    agencyTypeList: [0, 1, 2, 4, 5, 7, 8],
                  },
                  {
                    label: '导出清单',
                    operate: 'export_file',
                    post_url: '/jd/passApproval',
                    disabled: false,
                    readonly: [],
                    agencyTypeList: [0, 1, 2, 4, 5, 7, 8],
                  },
                ],
                rowButtons: [
                  {
                    label: '处置特殊资产',
                    operate: 'sub_dispose_special_capital',
                    post_url: '',
                    disabled: false,
                    readonly: [],
                    agencyTypeList: [0, 1],
                  },
                ],
              },
              searches: [],
              headText: [],
            },
          ],
          post_url: '/project_manage/pool/trade_list',
          params: 4,
        },
      ],
    } as TabConfigModel,
  };

  // 中介机构文件操作权限-通用配置
  static readonly agencyFilesConfig = {
    // 计划管理人文件
    palnManagerFile: {
      // 可见角色
      agencyTypeList: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
      // 上传文件
      upload: [0, 1, 7],
      // 删除文件
      delete: [0, 1, 7],
      // 下载文件
      download: [0, 1, 5, 7],
    },
    // 律所文件
    lawFirmFile: {
      agencyTypeList: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
      upload: [1, 5],
      delete: [1, 5],
      download: [0, 1, 5, 7],
    },
    // 资产服务机构文件
    assetServiceOrgFile: {
      agencyTypeList: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
      upload: [1, 7],
      delete: [1, 7],
      download: [0, 1, 5, 7],
    },
    // 评级机构文件
    rateOrgFile: {
      agencyTypeList: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
      upload: [1, 4],
      delete: [1, 4],
      download: [0, 1, 4, 5, 7],
    },
    // 托管服务机构文件
    hostServiceOrgFile: {
      agencyTypeList: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
      upload: [0, 1, 7, 9],
      delete: [0, 1, 7, 9],
      download: [0, 1, 5, 7, 9],
    },
    // 承销机构文件
    saleFile: {
      agencyTypeList: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
      upload: [0, 1, 3, 6, 7],
      delete: [0, 1, 3, 6, 7],
      download: [0, 1, 3, 5, 6, 7],
    },
    // 会计师事务所文件
    accountingFirmFile: {
      agencyTypeList: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
      upload: [0, 1, 2, 7],
      delete: [0, 1, 2, 7],
      download: [0, 1, 2, 5, 7],
    },
    // 资金服务机构文件
    caseServiceOrgFile: {
      agencyTypeList: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
      upload: [0, 1, 7, 10],
      delete: [0, 1, 7, 10],
      download: [0, 1, 5, 7, 10],
    },
    // 原始权益人文件
    originalOrderFile: {
      agencyTypeList: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
      upload: [0, 1],
      delete: [0, 1],
      download: [0, 1, 5, 7],
    },
  };

  /**
   * 获取中介机构配置
   * @param name
   */
  static getAgencyConfig(name: string): any {
    return ProjectManageAuth[name];
  }
}

// 中介类型
export enum AgencyType {
  'factor' = 0, // 保理商
  'planAdministrator' = 1, // 计划管理人
  'accountingFirm' = 2, // 会计师事务所
  'unitSalesAgency' = 3, // 联合销售机构
  'ratingAgency' = 4, // 评级机构
  'lawFirm' = 5, // 律师事务所
  'majorSalesAgency' = 6, // 主要销售机构
  'assetServiceAgency' = 7, // 资产服务机构
  'investor' = 8, // 投资者
  'depositServiceAgency' = 9, // 托管服务机构
  'fundServiceAgency' = 10, // 资金服务机构
  'reFactoringBank' = 11, // 再保理银行
}

/** 资产池列表当前标签页标识 */
export enum TadeListTabIndex {
  /** 基础资产 */
  BASE_ASSESTS = 'A',
  /** 交易文件 */
  DEAL_FILE = 'B',
  /** 尽职调查 */
  DUE_DILIGENCE = 'C',
  /** 产品信息 */
  PRODUCT_INFO = 'D',
  /** 特殊资产 */
  SPECIAL_ASSETS = 'E',
}
