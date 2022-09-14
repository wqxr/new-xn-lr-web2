import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {AmountControlIndexComponent} from './amount-control-index.component';

const routes: Routes = [
    {path: '', component: AmountControlIndexComponent}
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class AmountRoutingModule {
}
