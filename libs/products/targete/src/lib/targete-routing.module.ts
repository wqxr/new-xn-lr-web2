import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CommListComponent } from 'libs/shared/src/lib/public/component/comm-list.component';

import DirectedPayment from 'libs/shared/src/lib/logic/directed-payment';
import MainList from './common/main-list';
import {InvoiceReplaceComponent} from 'libs/shared/src/lib/public/form/hw-mode/invoice-replace.component';
import {InvoiceReplaceRecordComponent} from 'libs/shared/src/lib/public/form/hw-mode/invoice-replace-record.component';

import {RecordComponent} from 'libs/console/src/lib/record/record.component';
import {NewComponent} from 'libs/console/src/lib/record/new.component';
import {EditComponent} from 'libs/console/src/lib/record/edit.component';
import {ViewComponent} from 'libs/console/src/lib/record/view.component';
import {View2Component} from 'libs/console/src/lib/record/view2.component';
// import {InfoComponent} from 'libs/console/src/lib/record/info.component';

const routes: Routes = [
    // 定向收款保理
    {
      path: 'record/record-directed/:id',
      component: CommListComponent,
      data: DirectedPayment
    },
    // 待替换发票交易列表
    {
        path: 'record/record-change/:id',
        component: InvoiceReplaceComponent,
    },
    // 替换发票记录
    {
        path: 'record/invoice-change/:mainFlowId',
        component: InvoiceReplaceRecordComponent,
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
    { // 台账-定向收款保理
        path: 'main-list/list',
        component: CommListComponent,
        data: MainList
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class TargeteRoutingModule { }
