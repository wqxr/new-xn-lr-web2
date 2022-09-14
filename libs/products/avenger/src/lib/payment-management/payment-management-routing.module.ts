import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import PaymentIndexTabConfig from './payment-management-table';
import { AvengerListComponent } from '../common/avenger-list.component';

const routes: Routes = [
    {path: '', component: AvengerListComponent, data: PaymentIndexTabConfig.getConfig('avenger')}
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class AvengerPaymentmentRouteModule {
}
