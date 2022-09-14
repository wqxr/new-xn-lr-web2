import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import DragonInvoiceTabConfig from './invoice-management';
import { DragonInvoiceManagementComponent } from './invoice-management.component';

const routes: Routes = [
    {
        path: '',
        pathMatch: 'full',
        component: DragonInvoiceManagementComponent,
        data: { ...DragonInvoiceTabConfig.getConfig('invoice'), hideTitle: false }
    }
];
@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class AvengerInvoiceRouteModule {
}
