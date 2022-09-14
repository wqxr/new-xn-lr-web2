import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SortablejsModule } from 'ngx-sortablejs';
import { PublicModule } from 'libs/shared/src/lib/public/public.module';
import { TargeteRoutingModule } from './targete-routing.module';


const COMPONENTS = [
];
@NgModule({
  declarations: [...COMPONENTS],
  imports: [
    CommonModule,
    SortablejsModule,
    PublicModule,
    TargeteRoutingModule,
  ],
})
export class TargeteModule { }
