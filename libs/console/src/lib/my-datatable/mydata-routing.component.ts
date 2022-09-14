import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from 'libs/shared/src/lib/services/auth-guard.service';
import { EnterpriseComponent } from './pages/enterprise.component';
import { CaStatusComponent } from './pages/ca-status.component';
import { ClientMapComponent } from './pages/client-map.component';
import { PiaojcComponent } from './pages/piaojc.component';
import { MoneyTableComponent } from './pages/money-table.component';
import { PlanManageComponent } from './pages/plan-manage.component';
import { CommListComponent } from 'libs/shared/src/lib/public/component/comm-list.component';
import InvoiceDisplayList from 'libs/shared/src/lib/logic/invoice-display-list';
import HonourList from 'libs/shared/src/lib/logic/honour-list';
import { ReportFormListComponent } from './pages/report-form-list.component';
import { ReportingListComponent } from './pages/reporting-list.component';
import { ReportingDetailComponent } from './pages/reporting-detail.component';
import { HomeComponent as BlockchainHomeComponent } from '../blockchain/home.component';
import { BlocksComponent } from '../blockchain/blocks.component';
import { DetailComponent as BlockchainDetailComponent } from '../blockchain/detail.component';


const routes: Routes = [
    {
        path: 'data',
        canActivate: [AuthGuard],
        children: [
            // 融资详情
            {
                path: 'enterprise',
                component: EnterpriseComponent
            },
            // 客户地图
            {
                path: 'client-map',
                component: ClientMapComponent
            },
            // 资产结构
            {
                path: 'piaojc',
                component: PiaojcComponent
            },
            // 资金回笼
            {
                path: 'money-table',
                component: MoneyTableComponent
            },
        ]
    },
    {
        path: 'szca/ca-status',
        component: CaStatusComponent
    },
    {
        path: 'manage/plan-manage',
        component: PlanManageComponent
    },
    { // 发票展示
        path: 'invoice-display/list',
        component: CommListComponent,
        data: InvoiceDisplayList
    },
    { // honour-list
        path: 'honour-list/list',
        component: CommListComponent,
        data: HonourList
    },
    {
        path: 'data/report-form-list',
        component: ReportFormListComponent
    },
    {
        path: 'data/reporting-list',
        component: ReportingListComponent
    },
    {
        path: 'data/reporting-list/:id',
        component: ReportingDetailComponent
    },
    {
        path: 'blockchain/home',
        component: BlockchainHomeComponent
    },
    {
        path: 'blockchain/detail/:type/:ledger/:id',
        component: BlockchainDetailComponent
    },
    {
        path: 'blockchain/blocks/:ledger/:id',
        component: BlocksComponent
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class MyDataRoutingModule { }
