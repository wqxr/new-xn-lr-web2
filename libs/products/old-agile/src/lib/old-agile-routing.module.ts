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
        // 雅居乐-星顺保理控制台主页
        path: '',
        pathMatch: 'full',
        component: ConsoleHomeComponent,
        data: { todo: Todo, dragonTodo: TodoDragon, sysMsg: SysMessages, payMsg: PaymentMessages }
    },
    {
        path: 'record',
        component: XnTabsComponent,
        data: {
            title: '上传付款计划-雅居乐',
            // tabs: [{
            //     label: '雅居乐',
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

    { // 付款管理-vanke 万科,金地
        path: 'payment/:type',
        component: PaymentComponent,
    },
    { // 万科abs（雅居乐） 保理商批量签署合同
        path: 'yajvle/sign-contract',
        component: YajvleSignContractComponent,
        data: TabConfig.get('yajvleSignContract')
    },
    // 我的交易>供应商待签署合同交易
    {
        path: 'record/unsigned_contract',
        component: SupplierUnsignedContractComponent,
        data: SupplierUnsignedContract
    },
    { // 资产池
        path: 'capital-pool',
        component: XnTabsComponent,
        data: {
            title: '资产池-雅居乐',
            tabs: [{
                label: '雅居乐',
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
    { // 老资产池 - 交易列表（用于查看老资产）
        path: 'trading-list',
        component: OldAgileCapitalPoolCommListComponent,
        data: CapitalPoolTradingList,
        runGuardsAndResolvers: 'always',
    },
    { // 老资产池 - 未入池交易列表（用于老资产添加交易）
        path: 'unhandled-list',
        component: CapitalPoolUnhandledListComponent,
        data: CapitalPoolUnhandledMainList
    },
    // 项目公司-待签署合同列表（签署回执）
    {
        path: 'receipt-list/oldagile',
        component: ReceiptListVkComponent,
        data: ReceiptListOldAgile,
    },
    // 项目公司-补充业务资料
    {
        path: 'additional-materials',
        component: AdditionalMaterialsComponent,
        data: AdditionalMaterials,
    },
    {
        path: 'machine-account',
        component: XnTabsComponent,
        data: {
            title: '台账-雅居乐',
            tabs: [
                {
                    label: '雅居乐',
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
    { // 保理商 - 标准保理 - 交易列表 - 补充信息
        path: 'standard_factoring/trans_lists/supplement_info',
        component: TransSupplementInfoComponent,
        data: TabConfig.get('standardFactoringSupplementInfo')
    },
    {
        // 资产管理
        path: 'assets-management',
        children: [
            {
                // 拟入池交易列表
                path: 'enter-pool',
                component: OldAgileEnterpoolComponent,
                data: OldAgileEnterPoolConfig.get('enterPoolList'),
            },
            { // 项目列表
                path: 'project-list',
                component: OldAgileProjectmanageComponent,
            },
            { // 项目列表-专项计划列表
                path: 'projectPlan-management',
                component: OldAgileProjectmanagePlanComponent,
            },
            { // 项目列表-专项计划列表-交易列表-基础资产、交易文件、尽职调查、产品信息
                path: 'capital-pool',
                component: OldAgileCapitalpoolComponent,
            },
            { // 项目列表-提醒管理
                path: 'notice-manage',
                component: OldAgileNoticeManageComponent,
                data: OldAgileNoticeManageList.getConfig('tabConfig'),
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
export class OldAgileRoutingModule { }
