import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {RateControlIndexComponent} from './rate-control-index.component';

const routes: Routes = [
    {path: '', component: RateControlIndexComponent}
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class RateRoutingModule {
}
