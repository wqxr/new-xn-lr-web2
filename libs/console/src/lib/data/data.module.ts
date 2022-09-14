import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PublicModule } from 'libs/shared/src/lib/public/public.module';

import { EnterpriseComponent } from './enterprise.component';
import { DriveComponent } from './drive.component';
import { FactoringEfficiencyComponent } from './factoring-efficiency.component';
import { CapitalMapComponent } from './capital-map.component';

const COMPONENTS = [
    EnterpriseComponent,
    DriveComponent,
    FactoringEfficiencyComponent,
    CapitalMapComponent,
];

@NgModule({
  imports: [
    CommonModule,
    PublicModule
  ],
  declarations: [
    ...COMPONENTS
  ]
})
export class DataModule { }
