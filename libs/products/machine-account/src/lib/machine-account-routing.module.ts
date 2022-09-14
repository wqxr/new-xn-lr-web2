import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ZhongdengListComponent } from './pages/zhongdeng-list/zhongdeng-list.component';
import MachineIndexTabConfig from './bean/index-tab.config';
import { MachineNewComponent } from './share/components/record/new.component';
import { MachineRecordComponent } from './share/components/record/record.component';
import { MachineEditComponent } from './share/components/record/edit.component';
import { MachineViewComponent } from './share/components/record/view.component';
import ZhongdengTabConfig from './bean/zhongdeng-tab.config';
import { ZhongdengFlowComponent } from './pages/zhongdeng-flow/zhongdeng-flow.component';
import { ZhongdengRecordComponent } from './pages/zhongdeng-record/zhongdeng-record.component';
import { MachineFlowDetailComponent } from './share/components/record/flow-detail.component';

const routes: Routes = [
    {
        path: 'zhongdeng-list',
        component: ZhongdengListComponent,
        data: ZhongdengTabConfig.getConfig('zhongdeng')
    },
    {
        path: 'zhongdeng/new',
        component: ZhongdengFlowComponent
    },
    {
        path: 'zhongdeng/record/:id/:status',
        component: ZhongdengRecordComponent
    },
    {
        path: 'main-list/detail/:id',
        component: MachineFlowDetailComponent
    },
    {
        // 流程
        path: 'record',
        children: [
            {
                path: 'new/:id/:headquarters',
                pathMatch: 'full',
                component: MachineNewComponent,
            },
            {
                path: 'record/:id',
                component: MachineRecordComponent
            },
            {
                path: 'new/:id/:relatedRecordId',
                component: MachineNewComponent
            },
            {
                path: 'new',
                component: MachineNewComponent
            },
            {
                path: ':type/edit/:id',
                component: MachineEditComponent
            },
            {
                path: ':type/view/:id',
                component: MachineViewComponent
            },
        ]
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class MachineAccountRoutingModule { }
