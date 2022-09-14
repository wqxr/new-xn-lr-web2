import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {RiskMapIndexComponent} from './risk-map-index.component';

const routes: Routes = [
    {path: '', component: RiskMapIndexComponent},
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class RiskMapRoutingModule {
}
