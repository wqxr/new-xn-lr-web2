import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import IndexTabConfig from '../common/index-tab.config';
import { AvengerListComponent } from '../common/avenger-list.component';

const routes: Routes = [
    // {
    //     // 房地产供应链标准保理
    //     path: 'pre_record',
    //     pathMatch: 'full',
    //     component: AvengerListComponent
    // },
    { path: '', component: AvengerListComponent, data: { ...IndexTabConfig.getConfig('avenger'), hideTitle: true } }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class AvengerListRoutingModule {
}
