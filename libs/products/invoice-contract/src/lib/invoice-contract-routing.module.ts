import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {ServiceFeeComponent} from './pages/service-fee/service-fee.component';
import {ServiceFeePromisePayComponent} from './pages/service-fee-promise-pay/service-fee-promise-pay.component';
import {CommListComponent} from 'libs/shared/src/lib/public/component/comm-list.component';

import MainDepositList from 'libs/shared/src/lib/logic/main-list-deposit';
import InvoiceUnfillList from 'libs/shared/src/lib/logic/invoice-unfill-list';
import MainList from './pages/common/main-list';
import { RecordComponent } from 'libs/console/src/lib/record/record.component';
import { NewComponent } from 'libs/console/src/lib/record/new.component';
import { EditComponent } from 'libs/console/src/lib/record/edit.component';
import { ViewComponent } from 'libs/console/src/lib/record/view.component';
import { View2Component } from 'libs/console/src/lib/record/view2.component';
// import { InfoComponent } from 'libs/console/src/lib/my-information/info.component';




const routes: Routes = [
    {
        // 平台服务费管理
        path: 'service-fee',
        component: ServiceFeeComponent
    },
    // 待补发票
    {
        path: 'invoice-unifll-list/list',
        component: CommListComponent,
        data: InvoiceUnfillList
    },
    {
        // 保证付款服务费管理
        path: 'service-fee-promise-pay',
        component: ServiceFeePromisePayComponent
    },
    { // 保证金列表
        path: 'deposit/list',
        component: CommListComponent,
        data: MainDepositList
    },
    // 流程
    {
        path: 'record/record/:id',
        component: RecordComponent
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
    { // 资产证券平台 查看子流程
        path: 'record/view',
        component: View2Component
    },
    // {
    //     path: 'record/info',
    //     component: InfoComponent
    // },
    {
        path: 'manage/limit-manage/:id',
        component: NewComponent
    },
    {
        path: 'manage/lv-manage/:id',
        component: NewComponent
    },
    {
        path: 'manage/lv-wan-manage/:id',
        component: NewComponent
    },
    { // 台账-两票一合同
        path: 'main-list/list',
        component: CommListComponent,
        data: MainList
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class InvoiceContractRoutingModule {
}
