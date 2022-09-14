import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {ContractControlIndexComponent} from './contract-control-index.component';
import {EnterpriseContractComponent} from './enterprise-contract.component';

const routes: Routes = [
    {path: '', component: ContractControlIndexComponent},
    {path: 'enterprise', component: EnterpriseContractComponent},
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ContractRoutingModule {
}
