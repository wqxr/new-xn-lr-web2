import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import { ContractManagerComponent } from './contract-template/contract-template.component';

const routes: Routes = [
    {path: '', component: ContractManagerComponent}
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ContractManageRoutingModule {
}
