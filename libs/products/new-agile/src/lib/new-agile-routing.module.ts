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
        // ?????????-???????????????????????????
        path: '',
        pathMatch: 'full',
        component: ConsoleHomeComponent,
        data: { todo: Todo, dragonTodo: TodoDragon, sysMsg: SysMessages, payMsg: PaymentMessages }
    },
    {
        // ?????????-????????????
        path: 'new-agile',
        component: NewAgileComponent,
        data: { todo: Todo,  dragonTodo: TodoDragon, newAgileToDo: NewAgileToDo }
    },
    {
        // ????????????
        path: 'new-agile-list',
        pathMatch: 'full',
        component: TransactionsListComponent,
        data: { ...TransactionTabConfig.get('newAgileProjectList') }
    },
    {
        // ??????-????????????
        path: 'new-agile-platform-list',
        pathMatch: 'full',
        component: TransactionsListComponent,
        data: { ...TransactionTabConfig.get('newAgileProjectList'), hideTitle: true }
    },
    {
        path: 'record',
        component: XnTabsComponent,
        data: {
            title: '??????????????????????????????????????????????????????',
            tabs: [{
                label: '?????????',
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
    { // ???????????????????????????
        path: 'yajvle/sign-contract',
        component: YajvleSignContractComponent,
        data: NewAgileSignContractConfig.config
    },
    // ????????????>??????????????????????????????
    {
        path: 'record/unsigned_contract',
        component: SupplierUnsignedContractComponent,
        data: SupplierUnsignedContract
    },
    { // ????????????-?????????
        path: 'payment/vanke/:type',
        component: PaymentComponent,
    },
    {
        // ????????????>????????????>??????????????????
        path: 'additional-materials',
        component: AdditionalMaterialsComponent,
        data: AdditionalMaterials,
    },
    {
        // ????????????>????????????????????????
        path: 'receipt-list/vanke',
        component: ReceiptListVkComponent,
        data: ReceiptListVK,
    },
    {
        path: 'capital-pool',
        pathMatch: 'full',
        component: CapitalPoolIndexComponent,
    },
    { // ????????? - ????????????
        path: 'capital-pool/trading-list',
        component: CapitalPoolCommListComponent,
        data: CapitalPoolTradingList,
        runGuardsAndResolvers: 'always',
    },
    { // ???????????????
        path: 'capital-pool/main-list',
        component: CapitalPoolUnhandledListComponent,
        data: CapitalPoolUnhandledMainList
    },
    {
        // ?????????????????????
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
        // ????????????
        path: 'assets-management',
        children: [
        { // ????????????
            path: 'project-list',
            component: NewAgileProjectmanageComponent,
        },
        { // ????????????-??????????????????
            path: 'projectPlan-management',
            component: NewAgileProjectmanagePlanComponent,
        },
        { // ????????????-??????????????????-????????????-?????????????????????????????????????????????????????????
            path: 'capital-pool',
            component: NewAgileCapitalpoolComponent,
        },
        { // ????????????-????????????
            path: 'notice-manage',
            component: NewAgileNoticeManageComponent,
            data: NewAgileNoticeManageList.getConfig('tabConfig'),
        },
        { // ????????????
            path: 'capital-sample',
            component: CapitalSampleComponent
        },
        { // ??????????????????
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
