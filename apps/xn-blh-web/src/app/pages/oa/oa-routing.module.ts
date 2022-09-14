import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { JumpComponent } from './jump.component';
import { AuthGuard } from 'libs/shared/src/lib/services/auth-guard.service';
import { DriveComponent } from 'libs/console/src/lib/data/drive.component';
import { FactoringEfficiencyComponent } from 'libs/console/src/lib/data/factoring-efficiency.component';
import { CapitalMapComponent } from 'libs/console/src/lib/data/capital-map.component';

const routes: Routes = [
    {
        path: '',
        component: JumpComponent
    },
    {
        path: 'data',
        canActivate: [AuthGuard],
        children: [
            {
                path: 'drive',
                component: DriveComponent
            },
            {
                path: 'factoring-efficiency',
                component: FactoringEfficiencyComponent
            },
            {
                path: 'capital-map',
                component: CapitalMapComponent
            }
        ]
    }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OARoutingModule { }
