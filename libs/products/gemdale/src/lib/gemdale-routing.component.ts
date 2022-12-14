import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { GemdaleCommListComponent } from './pages/upload-pay-plan/comm-list.component';
import Gemdale from 'libs/shared/src/lib/logic/gemdale';
import { GemdalePaymentComponent } from './pages/payment/payment.component';
import { ComfirmInformationIndexComponent } from './pages/gemdale-mode/confirm-inforamtion-index.component';
import TabConfig from './pages/gemdale-mode/tab-pane';
import { GemdaleCapitalPoolIndexComponent } from './pages/capital-pool/capital-pool-index.component';
import { GemdaleTransactionsListComponent } from './pages/gemdale-transactions/gemdale-transactions-list.component';
import DragonTransactionTabConfig from './pages/gemdale-transactions/transaction.config';
import { ReceiptListComponent } from './pages/receipt-list/receipt-list.component';
import ReceiptList from 'libs/shared/src/lib/logic/receipt-list';

import TodoGemdale from './TodoGemdale';
import { EstateGemdaleComponent } from './pages/estate-gemdale/estate-gemdale.component';
import { CapitalPoolCommListComponent } from 'libs/shared/src/lib/public/component/capital-pool-comm-list.component';
import CapitalPoolTradingList from 'libs/shared/src/lib/logic/capital-pool-trading-list';
import { GemdaleCapitalPoolCommListComponent } from './pages/trading-list/capital-pool-comm-list.component';
import { GemdaleProjectmanageComponent } from './pages/gemdale-project-manager/gemdale-project-management.component';
import { GemdaleProjectmanagePlanComponent } from './pages/gemdale-project-manager/gemdale-project-plan-list/gemdale-project-plan-list.component';
import { GemdaleCapitalpoolComponent } from './pages/gemdale-project-manager/gemdale-capital-pool/gemdale-capital-pool.component';
import { GemdaleNoticeManageComponent } from './pages/gemdale-project-manager/gemdale-notice-manage/gemdale-notice-manage-list.component';
import GemdaleNoticeManageList from './pages/gemdale-project-manager/gemdale-notice-manage/gemdale-notice-manage'
import { CapitalSampleComponent } from './pages/gemdale-project-manager/capital-sample/capital-sample.component';
import { CapitalDataAnalyseComponent } from './pages/gemdale-project-manager/capital-data-analyse/capital-data-analyse.component';
import secondContractTemplateTab from './pages/contract-template/second-contract-template.tab'

import {GemdaleTransferContractManagerComponent} from './pages/contract-template/contract-template.component'
import GemdaleonceContractTemplateTab from './pages/contract-template/gemdale-once-contract-template.tab'
import { CapitalPoolUnhandledListComponent } from './pages/capital-pool/capital-pool-unhandled-list/capital-pool-unhandled-list.component';
import CapitalPoolUnhandledMainList from './pages/capital-pool/capital-pool-unhandled-list/capital-pool-unhandled-main-list'
import { GemdaleEnterpoolComponent } from './pages/enter-capital-tool/enter-capital-pool-confirmation.component';
import GemdaleEnterPoolConfig from './pages/enter-capital-tool/enter-pool-capital'
const routes: Routes = [
    {
        // ??????????????????-??????
        path: 'estate-gemdale',
        component: EstateGemdaleComponent,
        data: { todo: TodoGemdale }
    },
    {
        path: 'record/record-old-agile/:id',
        pathMatch: 'full',
        component: GemdaleCommListComponent,
        data: Gemdale
    },
    { // ????????????-vanke ??????,??????
        path: 'payment/:type',
        component: GemdalePaymentComponent,
    },
    { // ??????abs ???????????????????????????
        path: 'sign-contract',
        component: ComfirmInformationIndexComponent,
        data: TabConfig.get('signContract')
    },
    { // ?????????
        path: 'capital-pool/gemdale',
        pathMatch: 'full',
        component: GemdaleCapitalPoolIndexComponent,

    },
    { // ?????????-????????????
        path: 'asset-pool/trading-list',
        component: GemdaleCapitalPoolCommListComponent,
        data: CapitalPoolTradingList,
        runGuardsAndResolvers: 'always',
    },
    { // ????????? - ?????????????????????
        path: 'unhandled-list',
        component: CapitalPoolUnhandledListComponent,
        data: CapitalPoolUnhandledMainList
    },
    { // ??????
        path: 'machine-account/gemdale',
        pathMatch: 'full',
        component: GemdaleTransactionsListComponent,
        data: DragonTransactionTabConfig.get('dragonProjectList')
    },
    { // ??????abs ??????????????????????????????
        path: 'gemdale-supports',
        component: ComfirmInformationIndexComponent,
        data: TabConfig.get('paymentList')
    },
    { // ??????abs ????????????????????????????????????
        path: 'gemdale/confirm-receivable',
        component: ComfirmInformationIndexComponent,
        data: TabConfig.get('receivable')
    },
    // ????????????-??????????????????????????????
    {
        path: 'receipt-list/gemdale',
        component: ReceiptListComponent,
        data: ReceiptList,
    },
    {
        // ????????????
        path: 'assets-management',
        children: [
            {
                // ?????????????????????
                path: 'enter-pool',
                component: GemdaleEnterpoolComponent,
                data: GemdaleEnterPoolConfig.get('enterPoolList'),
            },
            {   // ????????????????????????
                path: 'secondtransfer-contract-manage',
                component: GemdaleTransferContractManagerComponent,
                data: { ...secondContractTemplateTab.getConfig('secondContract'), hideTitle: false }
            },
            { // ????????????
                path: 'project-list',
                component: GemdaleProjectmanageComponent,
            },
            { // ????????????-??????????????????
                path: 'projectPlan-management',
                component: GemdaleProjectmanagePlanComponent,
            },
            { // ????????????-??????????????????-????????????-?????????????????????????????????????????????????????????
                path: 'capital-pool',
                component: GemdaleCapitalpoolComponent,
            },
            { // ????????????-????????????
                path: 'notice-manage',
                component: GemdaleNoticeManageComponent,
                data: GemdaleNoticeManageList.getConfig('tabConfig'),
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
    { // ??????????????????????????????
        path: 'oncetransfer-contract-manage',
        component: GemdaleTransferContractManagerComponent,
        data: { ...GemdaleonceContractTemplateTab.getConfig('onceContract'), hideTitle: false }
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class GemdaleRoutingModule { }
