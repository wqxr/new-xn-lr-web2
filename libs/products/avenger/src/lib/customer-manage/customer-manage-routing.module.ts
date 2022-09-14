import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {CustomerTemplateComponent} from './customer-template/customer-template-component';
import {CustomerDetailComponent} from './Custom-Detail-template/Customer-Detail-template-component';
import {CustomerChangeManagerComponent} from './customer-managing-template/customer-managing.component';


const routes: Routes = [
    {
        path: '',
        component: CustomerTemplateComponent,
    },
    {
        path: 'company-detail',
        component: CustomerDetailComponent,
    },
    {
        path: 'changeManager',
        component: CustomerChangeManagerComponent

    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class CustomerManageRoutingModule {


}
