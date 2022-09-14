import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {RiskWarningIndexComponent} from './risk-warning-index.component';

const routes: Routes = [
    {
        path: '', component: RiskWarningIndexComponent,
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class RiskWarningRoutingModule {
}
