import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import ApprovalIndexTabConfig from './approval-loan-table';
import { AvengerListComponent } from '../common/avenger-list.component';
const routes: Routes = [
    {path: '', component: AvengerListComponent, data: ApprovalIndexTabConfig.getConfig('avenger')}
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class AvengerApprovalLoanRouteModule {
}
