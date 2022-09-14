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
        // 地产业务列表-金地
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
    { // 付款管理-vanke 万科,金地
        path: 'payment/:type',
        component: GemdalePaymentComponent,
    },
    { // 金地abs 保理商批量签署合同
        path: 'sign-contract',
        component: ComfirmInformationIndexComponent,
        data: TabConfig.get('signContract')
    },
    { // 资产池
        path: 'capital-pool/gemdale',
        pathMatch: 'full',
        component: GemdaleCapitalPoolIndexComponent,

    },
    { // 资产池-交易列表
        path: 'asset-pool/trading-list',
        component: GemdaleCapitalPoolCommListComponent,
        data: CapitalPoolTradingList,
        runGuardsAndResolvers: 'always',
    },
    { // 资产池 - 未入池交易列表
        path: 'unhandled-list',
        component: CapitalPoolUnhandledListComponent,
        data: CapitalPoolUnhandledMainList
    },
    { // 台账
        path: 'machine-account/gemdale',
        pathMatch: 'full',
        component: GemdaleTransactionsListComponent,
        data: DragonTransactionTabConfig.get('dragonProjectList')
    },
    { // 金地abs 集团公司确认付款清单
        path: 'gemdale-supports',
        component: ComfirmInformationIndexComponent,
        data: TabConfig.get('paymentList')
    },
    { // 金地abs 项目公司确认应收账款金额
        path: 'gemdale/confirm-receivable',
        component: ComfirmInformationIndexComponent,
        data: TabConfig.get('receivable')
    },
    // 金地优化-项目公司批量签署回执
    {
        path: 'receipt-list/gemdale',
        component: ReceiptListComponent,
        data: ReceiptList,
    },
    {
        // 资产管理
        path: 'assets-management',
        children: [
            {
                // 拟入池交易列表
                path: 'enter-pool',
                component: GemdaleEnterpoolComponent,
                data: GemdaleEnterPoolConfig.get('enterPoolList'),
            },
            {   // 二次转让合同管理
                path: 'secondtransfer-contract-manage',
                component: GemdaleTransferContractManagerComponent,
                data: { ...secondContractTemplateTab.getConfig('secondContract'), hideTitle: false }
            },
            { // 项目列表
                path: 'project-list',
                component: GemdaleProjectmanageComponent,
            },
            { // 项目列表-专项计划列表
                path: 'projectPlan-management',
                component: GemdaleProjectmanagePlanComponent,
            },
            { // 项目列表-专项计划列表-交易列表-基础资产、交易文件、尽职调查、产品信息
                path: 'capital-pool',
                component: GemdaleCapitalpoolComponent,
            },
            { // 项目列表-提醒管理
                path: 'notice-manage',
                component: GemdaleNoticeManageComponent,
                data: GemdaleNoticeManageList.getConfig('tabConfig'),
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
    { // 金地一次转让合同管理
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
