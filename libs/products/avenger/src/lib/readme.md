# 万科供应商保理业务

+ 此模块为独立的一个模块，可使用全局注入的方法，管道、模态框。
+ `PublicModule` 模块中定义的部分管道，模态框,可公用
+ edit、view、new、 memo、record、show-input、input、detail 公用组件使用共享模块 `SharedModule` 中重新定义的组件。

+ 平台角色【客户管理，保后管理，合同管理】 使用旧版 `PublicModule` 公用组件

+ 说明

|功能   |模块                       |加载方式|特殊说明  |
|-------|--------------------------|-------|---  |
|保后管理| GuarantManagementModule  |       动态加载|     |
|合同管理| ContractManageModule     |      动态加载 |     |
|客户管理| CustomerManageModule     |      动态加载 |     |
|交易列表| AvengerListModule        |     动态加载  |     |
|审批放款| AvengerApprovalLoanModule | 动态加载 |         |

|财务资料| CreditReportUploadModule |     暂时无  |  直接发起流程   |
|征信报告| FinancialReportInfoModule|      暂时无 |   直接发起流程  |
|供应商保理信息| FactoringBusinessModule|  根模块       |     |
|流程配置| flow|  子流程操作配置，钩子回调函数       | 非流程    |

+ 代码范例
``` js
            { // 客户管理
                path: 'customer-manage',
                loadChildren: 'app/avenger/customer-manage/customer-manage.module#CustomerManageModule',
            }, { // 保后管理
                path: 'guarant-manage',
                loadChildren: 'app/avenger/guarant-management/guarant-management.module#GuarantManagementModule'
            }, { // 合同管理
                path: 'contract-manage',
                loadChildren: 'app/avenger/contract-manage/contract-manage.module#ContractManageModule'
            }, { // 交易列表
                path: 'main-list/avenger-list',
                loadChildren: 'app/avenger/avenger-list/avenger-list.module#AvengerListModule'
            }
  ```
