import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {TransactionControlIndexComponent} from './transaction-control-index.component';
import {TransactionControlEnterpriseComponent} from './transaction-control-enterprise.component';

const routes: Routes = [
    {path: '', component: TransactionControlIndexComponent},
    {path: 'enterprise', component: TransactionControlEnterpriseComponent},
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class TransactionRoutingModule {
}
