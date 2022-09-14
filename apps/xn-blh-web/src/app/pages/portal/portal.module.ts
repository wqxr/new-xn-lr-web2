/*************************************************************************
 * Copyright (c) 2017 - 2020 深圳市链融科技股份有限公司
 * Shenzhen Lianrong Technology Co., Ltd.
 * All rights reserved.
 *
 * @file：xn-lr-web\apps\src\app\pages\portal\portal.module.ts
 * @summary：init portal.module.ts
 * @version: 1.0
 * *************************************************************************
 * revision             author            reason             date
 * 1.0                  wangqing             init             2021-05-15
 ***************************************************************************/
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SharedModule } from './shared/shared.module';
import { LayoutModule } from '../../layout/layout.module';
import { Components } from './_components';
import { PortalRoutingModule } from './portal-routing.module';
import { PublicModule } from 'libs/shared/src/lib/public/public.module';
import { LoginComponent } from './login/login.component';
import { PortalComponent } from './portal.component';
import { RegistryComponent } from './registry/registry.component';
import { NgZorroAntDModule } from '../../ng-zorro-antd';

@NgModule({
  declarations: [
    ...Components,
    LoginComponent,
    PortalComponent,
    RegistryComponent,
  ],
  imports: [
    FormsModule,
    SharedModule,
    PortalRoutingModule,
    PublicModule,
    LayoutModule,
    NgZorroAntDModule
  ],
  exports: [...Components],
  providers: [],
})
export class PortalModule {}
