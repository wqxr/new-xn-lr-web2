import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OARoutingModule } from './oa-routing.module';
import { DataModule } from 'libs/console/src/lib/data/data.module';


@NgModule({
  imports: [
    CommonModule,
    DataModule,
    OARoutingModule,
  ],
  declarations: []
})
export class OAModule { }
