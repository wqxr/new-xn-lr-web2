import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomeComponent as ConsoleHomeComponent } from 'libs/console/src/lib/home.component';
import { XnTabsComponent } from 'libs/shared/src/lib/public/component/tabs/tabs.component';
import { OldAgile, TabConfig, SupplierUnsignedContract, ReceiptListOldAgile, AdditionalMaterials, OldAgileTransactionTabConfig } from './logic';
// import Todo from 'libs/console/src/lib/todo';
import SysMessages from 'libs/shared/src/lib/logic/sys-messages';
import PaymentMessages from 'libs/shared/src/lib/logic/payment-messages';
import TodoDragon from 'libs/products/dragon/src/lib/Tododragon';
import Todo from 'libs/shared/src/lib/logic/todo';

import { CommListComponent } from './pages/upload-pay-plan/comm-list.component';
import { PaymentComponent } from './pages/payment/payment.component';
import { YajvleSignContractComponent } from './pages/sign-contract/yajvle-sign-contract.component';
import { SupplierUnsignedContractComponent } from './pages/unsigned_contract/supplier-unsigned-contract.component';
import { CapitalPoolIndexComponent } from './pages/capital-pool/capital-pool-index.component';
import { ReceiptListVkComponent } from './pages/receipt-list/receipt-list-vk.component';
import { AdditionalMaterialsComponent } from './pages/additional-materials/additional-materials.component';
import { OldAgileTransactionsListComponent } from './pages/machine-list/dragon-transactions-list.component';
import { TransSupplementInfoComponent } from './pages/supplement_info/trans-supplement-info-component';
import CapitalPoolTradingList from 'libs/shared/src/lib/logic/capital-pool-trading-list';
import { OldAgileCapitalPoolCommListComponent } from './pages/trading-list/capital-pool-comm-list.component';
import { OldAgileProjectmanageComponent } from './pages/oldAgile-project-manager/oldAgile-project-management.component';
import { OldAgileProjectmanagePlanComponent } from './pages/oldAgile-project-manager/oldAgile-project-plan-list/oldAgile-project-plan-list.component';
import { OldAgileCapitalpoolComponent } from './pages/oldAgile-project-manager/oldAgile-capital-pool/oldAgile-capital-pool.component';
import { OldAgileNoticeManageComponent } from './pages/oldAgile-project-manager/oldAgile-notice-manage/oldAgile-notice-manage-list.component';
import OldAgileNoticeManageList from './pages/oldAgile-project-manager/oldAgile-notice-manage/oldAgile-notice-manage'
import { CapitalSampleComponent } from './pages/oldAgile-project-manager/capital-sample/capital-sample.component';
import { CapitalDataAnalyseComponent } from './pages/oldAgile-project-manager/capital-data-analyse/capital-data-analyse.component';
import { OldAgileEnterpoolComponent } from './pages/enter-capital-tool/enter-capital-pool-confirmation.component';
import OldAgileEnterPoolConfig from './pages/enter-capital-tool/enter-pool-capital'
import { CapitalPoolUnhandledListComponent } from './pages/capital-pool/capital-pool-unhandled-list/capital-pool-unhandled-list.component';
import CapitalPoolUnhandledMainList from './pages/capital-pool/capital-pool-unhandled-list/capital-pool-unhandled-main-list'


const routes: Routes = [
    {
        // ?????????-???????????????????????????
        path: '',
        pathMatch: 'full',
        component: ConsoleHomeComponent,
        data: { todo: Todo, dragonTodo: TodoDragon, sysMsg: SysMessages, payMsg: PaymentMessages }
    },
    {
        path: 'record',
        component: XnTabsComponent,
        data: {
            title: '??????????????????-?????????',
            // tabs: [{
            //     label: '?????????',
            //     link: 'record-old-agile/financing_pre6',
            //     index: 0
            // }]
        },
        children: [{
            path: 'record-old-agile/:id',
            pathMatch: 'full',
            component: CommListComponent,
            data: { ...OldAgile, hideTitle: true }
        }]
    },

    { // ????????????-vanke ??????,??????
        path: 'payment/:type',
        component: PaymentComponent,
    },
    { // ??????abs??????????????? ???????????????????????????
        path: 'yajvle/sign-contract',
        component: YajvleSignContractComponent,
        data: TabConfig.get('yajvleSignContract')
    },
    // ????????????>??????????????????????????????
    {
        path: 'record/unsigned_contract',
        component: SupplierUnsignedContractComponent,
        data: SupplierUnsignedContract
    },
    { // ?????????
        path: 'capital-pool',
        component: XnTabsComponent,
        data: {
            title: '?????????-?????????',
            tabs: [{
                label: '?????????',
                link: 'oldagile',
                index: 0,
            }
            ]
        },
        children: [
            {
                path: 'oldagile',
                pathMatch: 'full',
                component: CapitalPoolIndexComponent,
            },
        ]
    },
    { // ???????????? - ???????????????????????????????????????
        path: 'trading-list',
        component: OldAgileCapitalPoolCommListComponent,
        data: CapitalPoolTradingList,
        runGuardsAndResolvers: 'always',
    },
    { // ???????????? - ??????????????????????????????????????????????????????
        path: 'unhandled-list',
        component: CapitalPoolUnhandledListComponent,
        data: CapitalPoolUnhandledMainList
    },
    // ????????????-???????????????????????????????????????
    {
        path: 'receipt-list/oldagile',
        component: ReceiptListVkComponent,
        data: ReceiptListOldAgile,
    },
    // ????????????-??????????????????
    {
        path: 'additional-materials',
        component: AdditionalMaterialsComponent,
        data: AdditionalMaterials,
    },
    {
        path: 'machine-account',
        component: XnTabsComponent,
        data: {
            title: '??????-?????????',
            tabs: [
                {
                    label: '?????????',
                    link: 'oldagile',
                    index: 0
                }
            ]
        },
        children: [
            {
                path: 'oldagile',
                pathMatch: 'full',
                component: OldAgileTransactionsListComponent,
                data: { ...OldAgileTransactionTabConfig.get('oldAgileProjectList'), hideTitle: true }
            }
        ]
    },
    { // ????????? - ???????????? - ???????????? - ????????????
        path: 'standard_factoring/trans_lists/supplement_info',
        component: TransSupplementInfoComponent,
        data: TabConfig.get('standardFactoringSupplementInfo')
    },
    {
        // ????????????
        path: 'assets-management',
        children: [
            {
                // ?????????????????????
                path: 'enter-pool',
                component: OldAgileEnterpoolComponent,
                data: OldAgileEnterPoolConfig.get('enterPoolList'),
            },
            { // ????????????
                path: 'project-list',
                component: OldAgileProjectmanageComponent,
            },
            { // ????????????-??????????????????
                path: 'projectPlan-management',
                component: OldAgileProjectmanagePlanComponent,
            },
            { // ????????????-??????????????????-????????????-?????????????????????????????????????????????????????????
                path: 'capital-pool',
                component: OldAgileCapitalpoolComponent,
            },
            { // ????????????-????????????
                path: 'notice-manage',
                component: OldAgileNoticeManageComponent,
                data: OldAgileNoticeManageList.getConfig('tabConfig'),
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
export class OldAgileRoutingModule { }
