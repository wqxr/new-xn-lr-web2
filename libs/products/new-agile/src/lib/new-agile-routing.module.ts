import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent as ConsoleHomeComponent  } from 'libs/console/src/lib/home.component';
// import Todo from 'libs/console/src/lib/todo';
import SysMessages from 'libs/shared/src/lib/logic/sys-messages';
import PaymentMessages from 'libs/shared/src/lib/logic/payment-messages';
import { NewAgileCommListComponent } from './share/components/comm-list.component';
import { TransactionsListComponent } from './pages/common/transactions-list.component';
import { XnTabsComponent } from 'libs/shared/src/lib/public/component/tabs/tabs.component';

import { YajvleSignContractComponent } from './pages/vnake-mode/yajvle-sign-contract.component';

import { FlowDetailComponent } from './share/components/flow/flow-detail.component';


import {
    NewAgile,
    TransactionTabConfig,
    NewAgileSignContractConfig,
    SupplierUnsignedContract,
    AdditionalMaterials,
    ReceiptListVK,
    CapitalPoolTradingList,
    CapitalPoolUnhandledMainList,
} from './logic';

import { SupplierUnsignedContractComponent } from './pages/unsigned-contract/supplier-unsigned-contract.component';

import { PaymentComponent } from './pages/payment/payment.component';
import { AdditionalMaterialsComponent } from './pages/manage/additional-materials.component';
import { ReceiptListVkComponent } from './pages/manage/receipt-list-vk.component';

import { CapitalPoolCommListComponent } from './pages/capital-pool/comm-list/capital-pool-comm-list.component';
import { CapitalPoolUnhandledListComponent } from './pages/capital-pool/unhandled-list/capital-pool-unhandled-list.component';
import { CapitalPoolIndexComponent } from './pages/capital-pool/capital-pool-index.component';

import { NewComponent } from './share/components/record/new.component';
import { EditComponent } from './share/components/record/edit.component';
import { ViewComponent } from './share/components/record/view.component';
import TodoDragon from 'libs/products/dragon/src/lib/Tododragon';
import Todo from 'libs/shared/src/lib/logic/todo';

import NewAgileToDo from './pages/console/todo';
import {NewAgileComponent} from './pages/new-agile/new-agile.component';
import { NewAgileProjectmanageComponent } from './pages/newAgile-project-manager/newAgile-project-management.component';
import { NewAgileProjectmanagePlanComponent } from './pages/newAgile-project-manager/newAgile-project-plan-list/newAgile-project-plan-list.component';
import { NewAgileCapitalpoolComponent } from './pages/newAgile-project-manager/newAgile-capital-pool/newAgile-capital-pool.component';
import { NewAgileNoticeManageComponent } from './pages/newAgile-project-manager/newAgile-notice-manage/newAgile-notice-manage-list.component';
import NewAgileNoticeManageList from './pages/newAgile-project-manager/newAgile-notice-manage/newAgile-notice-manage'
import { CapitalSampleComponent } from './pages/newAgile-project-manager/capital-sample/capital-sample.component';
import { CapitalDataAnalyseComponent } from './pages/newAgile-project-manager/capital-data-analyse/capital-data-analyse.component';
import { NewAgileEnterpoolComponent } from './pages/enter-capital-tool/enter-capital-pool-confirmation.component';
import NewAgileEnterPoolConfig from './pages/enter-capital-tool/enter-pool-capital'

const routes: Routes = [
    {
        // 雅居乐-星顺保理控制台主页
        path: '',
        pathMatch: 'full',
        component: ConsoleHomeComponent,
        data: { todo: Todo, dragonTodo: TodoDragon, sysMsg: SysMessages, payMsg: PaymentMessages }
    },
    {
        // 雅居乐-星顺列表
        path: 'new-agile',
        component: NewAgileComponent,
        data: { todo: Todo,  dragonTodo: TodoDragon, newAgileToDo: NewAgileToDo }
    },
    {
        // 交易列表
        path: 'new-agile-list',
        pathMatch: 'full',
        component: TransactionsListComponent,
        data: { ...TransactionTabConfig.get('newAgileProjectList') }
    },
    {
        // 平台-交易列表
        path: 'new-agile-platform-list',
        pathMatch: 'full',
        component: TransactionsListComponent,
        data: { ...TransactionTabConfig.get('newAgileProjectList'), hideTitle: true }
    },
    {
        path: 'record',
        component: XnTabsComponent,
        data: {
            title: '上传付款计划（房地产供应链标准保理）',
            tabs: [{
                label: '雅居乐',
                link: 'record/record-new-agile/financing_pre18',
                index: 0
            }]
        },
        children: [{
            path: 'record-new-agile/:id',
            pathMatch: 'full',
            component: NewAgileCommListComponent,
            data: { ...NewAgile, hideTitle: true }
        }]
    },
    { // 保理商批量签署合同
        path: 'yajvle/sign-contract',
        component: YajvleSignContractComponent,
        data: NewAgileSignContractConfig.config
    },
    // 我的交易>供应商待签署合同交易
    {
        path: 'record/unsigned_contract',
        component: SupplierUnsignedContractComponent,
        data: SupplierUnsignedContract
    },
    { // 付款管理-保理商
        path: 'payment/vanke/:type',
        component: PaymentComponent,
    },
    {
        // 项目公司>标准保理>补充业务资料
        path: 'additional-materials',
        component: AdditionalMaterialsComponent,
        data: AdditionalMaterials,
    },
    {
        // 项目公司>项目公司签署合同
        path: 'receipt-list/vanke',
        component: ReceiptListVkComponent,
        data: ReceiptListVK,
    },
    {
        path: 'capital-pool',
        pathMatch: 'full',
        component: CapitalPoolIndexComponent,
    },
    { // 资产池 - 交易列表
        path: 'capital-pool/trading-list',
        component: CapitalPoolCommListComponent,
        data: CapitalPoolTradingList,
        runGuardsAndResolvers: 'always',
    },
    { // 未入池交易
        path: 'capital-pool/main-list',
        component: CapitalPoolUnhandledListComponent,
        data: CapitalPoolUnhandledMainList
    },
    {
        // 拟入池交易列表
        path: 'enter-pool',
        component: NewAgileEnterpoolComponent,
        data: NewAgileEnterPoolConfig.get('enterPoolList'),
    },
    {
        path: 'record/new/:id',
        component: NewComponent
    },
    {
        path: 'record/new/:id/:relatedRecordId',
        component: NewComponent
    },
    {
        path: 'record/new',
        component: NewComponent
    },
    {
        path: 'record/:type/edit/:id',
        component: EditComponent
    },
    {
        path: 'record/:type/view/:id',
        component: ViewComponent
    },
    {
        path: 'record/view/:id',
        component: ViewComponent
    },

    {
        path: 'main-list/detail/:id/:proxy',
        component: FlowDetailComponent,
    },
    {
        path: 'main-list/detail/:id',
        component: FlowDetailComponent,
    },
    {
        // 资产管理
        path: 'assets-management',
        children: [
        { // 项目列表
            path: 'project-list',
            component: NewAgileProjectmanageComponent,
        },
        { // 项目列表-专项计划列表
            path: 'projectPlan-management',
            component: NewAgileProjectmanagePlanComponent,
        },
        { // 项目列表-专项计划列表-交易列表-基础资产、交易文件、尽职调查、产品信息
            path: 'capital-pool',
            component: NewAgileCapitalpoolComponent,
        },
        { // 项目列表-提醒管理
            path: 'notice-manage',
            component: NewAgileNoticeManageComponent,
            data: NewAgileNoticeManageList.getConfig('tabConfig'),
        },
        { // 抽样页面
            path: 'capital-sample',
            component: CapitalSampleComponent
        },
        { // 数据分析页面
            path: 'capital-data-analyse',
            component: CapitalDataAnalyseComponent
        },
        ],
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class NewAgileRoutingModule { }
