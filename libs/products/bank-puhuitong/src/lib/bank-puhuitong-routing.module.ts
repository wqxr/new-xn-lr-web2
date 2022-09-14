import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BankNewComponent } from './share/components/record/new.component';
import { BankRecordComponent } from './share/components/record/record.component';
import { BankEditComponent } from './share/components/record/edit.component';
import { BankViewComponent } from './share/components/record/view.component';
import { BankPuhuiTongComponent } from './pages/bank-list/bank-custom-manager.component';
import IndexTabConfig from './pages/bank-list/bank-custom-list';
import { BankExtensionListComponent } from './pages/bank-extension-list/bank-extension-list.component';

const routes: Routes = [
    {
        path: '',
        component: BankPuhuiTongComponent,
        data: IndexTabConfig.getConfig('banklist'),
    },
    {
        path: 'bank-extension',
        component: BankExtensionListComponent,
    },


    {
        // 流程
        path: 'record',
        children: [
            {
                path: 'record/:id',
                component: BankRecordComponent
            },
            {
                path: 'new',
                component: BankNewComponent
            },
            {
                path: 'edit/:id',
                component: BankEditComponent
            },
            {
                path: 'view/:id',
                component: BankViewComponent
            },

            {
                path: ':type/edit/:id',
                component: BankEditComponent
            },
            {
                path: ':type/view/:id',
                component: BankViewComponent
            },
        ]
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class BankPuHuitongRoutingModule { }
