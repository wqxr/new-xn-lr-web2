import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {ComprehensiveTestingIndexComponent} from './comprehensive-testing-index.component';

const routes: Routes = [
    {path: '', component: ComprehensiveTestingIndexComponent},
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class MonitorRoutingModule {
}
