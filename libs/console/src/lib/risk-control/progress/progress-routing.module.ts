import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {ProgressIndexComponent} from './progress-index.component';
import {ProgressDetailComponent} from './progress-detail.component';

const routes: Routes = [
    {path: '', component: ProgressIndexComponent},
    {path: 'progress', component: ProgressDetailComponent}
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ProgressRoutingModule {
}
