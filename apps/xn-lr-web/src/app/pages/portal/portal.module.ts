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
 * 1.0                  zigui             init             2020-11-16
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
import { HomeComponent } from './home/home.component';
import { TechnologyComponent } from './technology/technology.component';
import { NewsComponent } from './news/news.component';
import { AboutComponent } from './about/about.component';
import { HelpComponent } from './help/help.component';
import { JoinComponent } from './join/join.component';
import { RunmiaotieComponent } from './runmiaotie/runmiaotie.component';
import { BhtDetailComponent } from './bht-detail/bht-detail.component';
import { NewsDetailComponent } from './news/news-detail/news-detail.component';
import { ProductSystemComponent } from './product/system/system.component';
import { ProductSolutionComponent } from './product/solution/solution.component';
import { RegistryComponent } from './registry/registry.component';
import { RegistryHelpComponent } from './help/registry-help.component';
import { ProblemHelpComponent } from './help/problem-help.component';
import { VankePreComponent } from './other/vanke-pre/vanke-pre.component';
import { VankePre2Component } from './other/vanke-pre2/vanke-pre2.component';
import { NzCarouselModule } from 'ng-zorro-antd/carousel';
import { ProductNoteComponent } from './product/note/note.component';
import { NzUploadModule } from 'ng-zorro-antd/upload';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzInputNumberModule } from 'ng-zorro-antd/input-number';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { FileViewerModule } from '@lr/ngx-shared';
@NgModule({
  declarations: [
    ...Components,
    LoginComponent,
    PortalComponent,
    HomeComponent,
    TechnologyComponent,
    NewsComponent,
    AboutComponent,
    HelpComponent,
    JoinComponent,
    NewsDetailComponent,
    ProductSystemComponent,
    ProductSolutionComponent,
    RegistryComponent,
    RegistryHelpComponent,
    ProblemHelpComponent,
    VankePreComponent,
    VankePre2Component,
    RunmiaotieComponent,
    ProductNoteComponent,
    BhtDetailComponent,
  ],
  imports: [
    FormsModule,
    SharedModule,
    PortalRoutingModule,
    PublicModule,
    LayoutModule,
    NzCarouselModule,
    NzDividerModule,
    NzUploadModule,
    NzFormModule,
    NzInputNumberModule,
    NzDatePickerModule,
    FileViewerModule

  ],
  exports: [...Components],
  providers: [],
})
export class PortalModule {}
