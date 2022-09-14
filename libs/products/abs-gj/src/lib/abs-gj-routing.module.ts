/*************************************************************************
 * Copyright (c) 2017 - 2021 深圳市链融科技股份有限公司
 * Shenzhen Lianrong Technology Co., Ltd.
 * All rights reserved.
 *
 * @file：libs\products\abs-gj\src\lib\abs-gj-routing.module.ts
 * @summary：abs-gj-routing.module.ts
 * @version: 1.0
 * *************************************************************************
 * revision             author            reason             date
 * 1.0                  DengPei           init               2021-11-22
 ***************************************************************************/
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import ReceiptList from './pages/receipt-list/receipt-list';
import DragonApprovallistIndexTabConfig from './pages/approval-list/list.config';
import MachineIndexTabConfig from './pages/machine-list/machine-list.config';
import OnceContractTemplateTab from './pages/assets-manage/once-contract-template/once-contract-template.config';

import { GjHomeTaskComponent } from './pages/home-task/index.component';
import { GjRecordComponent } from './pages/record/record-gj.component';
import { GjApprovalListComponent } from './pages/approval-list/list.component';
import { GjReceiptListComponent } from './pages/receipt-list/list.component';
import { GjNewComponent } from './components/record/new.component';
import { GjEditComponent } from './components/record/edit.component';
import { GjViewComponent } from './components/record/view.component';
import { GjFlowDetailComponent } from './components/record/flow-detail.component';
import { GjRecordViewComponent } from './components/record/record.component';
import { GjMachineListComponent } from './pages/machine-list/machine-list.component';
import {
  GjProjectCapitalPoolComponent
} from './pages/assets-manage/project-manager/capital-pool/capital-pool.component';
import { GjProjectManageComponent } from './pages/assets-manage/project-manager/project-manage.component';
import { GjNoticeManageComponent } from './pages/assets-manage/project-manager/notice-manage/notice-manage.component';
import {
  GjCapitalSampleComponent
} from './pages/assets-manage/project-manager/capital-sample/capital-sample.component';
import {
  GjCapitalDataAnalyseComponent
} from './pages/assets-manage/project-manager/capital-data-analyse/capital-data-analyse.component';
import {
  GjEnterCapitalPoolComponent
} from './pages/assets-manage/enter-capital-tool/enter-capital-pool-confirmation.component';
import { GjContractManageComponent } from './pages/assets-manage/contract-template/contract-template.component';
import {
  GjProjectPlanComponent
} from './pages/assets-manage/project-manager/project-plan-list/project-plan-list.component';
import { GjCompanyAddInfoComponent } from './pages/company-add-info/company-add-info.component';
import { GjUploadPaymentBillComponent } from './pages/upload-payment-bill/upload-payment-bill.component';
import { GjBatchModifyComponent } from './pages/capital-pool/batch-modify/batch-modify.component';
import {
  GjOnceContractManageComponent
} from './pages/assets-manage/once-contract-template/once-contract-template.component';
import { GjPushReceiptListComponent } from './pages/push-receipt-list/push-receipt-list.component';

const routes: Routes = [
  /** 发起提单 */
  {
    path: 'pre_record/financing_pre6',
    component: GjRecordComponent,
  },
  /** 上传付款确认书 */
  {
    path: 'confirmation-list',
    pathMatch: 'full',
    component: GjUploadPaymentBillComponent,
  },
  /** 待办列表 */
  {
    path: 'estate-dragon/:productIdent',
    component: GjHomeTaskComponent,
    data: {isPerson: false}
  },
  /** 【个人】待办列表 */
  {
    path: 'estate-dragon-person/:productIdent',
    component: GjHomeTaskComponent,
    data: {isPerson: true}
  },
  {
    // 审批放款
    path: 'approval_list',
    component: GjApprovalListComponent,
    data: DragonApprovallistIndexTabConfig.getConfig(),
  },
  /** 台账 */
  {
    path: 'machine_list',
    component: GjMachineListComponent,
    data: {...MachineIndexTabConfig.getConfig(), name: '台账'},
  },
  {
    // 资产池
    path: 'capital-pool',
    children: [
      {
        // 批量补充
        path: 'batch-modify',
        component: GjBatchModifyComponent,
      },
    ],
  },
  {
    // 项目公司补充业务资料
    path: 'projectCompany-addInfo',
    component: GjCompanyAddInfoComponent,
  },
  {
    // 一次转让合同管理
    path: 'oncetransfer-contract-manage',
    component: GjOnceContractManageComponent,
    data: {...OnceContractTemplateTab.getConfig()},
  },
  {
    // 资产管理
    path: 'assets-management',
    children: [
      {
        // 拟入池交易列表
        path: 'enter-pool',
        component: GjEnterCapitalPoolComponent,
      },
      {
        // 二次转让合同管理
        path: 'secondtransfer-contract-manage',
        component: GjContractManageComponent,
      },
      {
        // 项目管理
        path: 'project-list',
        component: GjProjectManageComponent,
      },
      {
        // 项目列表-专项计划列表
        path: 'projectPlan-management',
        component: GjProjectPlanComponent,
      },
      {
        // 项目列表-专项计划列表-交易列表-基础资产、交易文件、尽职调查、产品信息
        path: 'capital-pool',
        component: GjProjectCapitalPoolComponent,
      },
      {
        // 项目列表-提醒管理
        path: 'notice-manage',
        component: GjNoticeManageComponent,
      },
      {
        // 抽样页面
        path: 'capital-sample',
        component: GjCapitalSampleComponent,
      },
      {
        // 数据分析页面
        path: 'capital-data-analyse',
        component: GjCapitalDataAnalyseComponent,
      },
    ],
  },
  {
    /** 流程相关 */
    path: 'record',
    children: [
      /** 新流程页面 */
      {
        path: 'new/:id',
        pathMatch: 'full',
        component: GjNewComponent,
      },
      /** 流程发起后跳转至此 */
      {
        path: 'record/:id',
        component: GjRecordViewComponent,
      },
      {
        path: 'new/:id/:relatedRecordId',
        component: GjNewComponent,
      },
      /** id 流程记录id */
      {
        path: ':type/edit/:id',
        component: GjEditComponent,
      },
      /** id 流程记录id */
      {
        path: ':type/view/:id',
        component: GjViewComponent,
      },
      {
        path: 'view/:id',
        component: GjViewComponent,
      },
    ],
  },
  {
    path: 'main-list/detail/:id',
    component: GjFlowDetailComponent,
  },
  {
    // 生成应收账款回执
    path: 'receipt-list',
    component: GjReceiptListComponent,
    data: ReceiptList,
  },
  {
    // 项目公司签署回执
    path: 'sign-receipt',
    component: GjPushReceiptListComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AbsGjRoutingModule {}
