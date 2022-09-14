/*************************************************************************
 * Copyright (c) 2017 - 2020 深圳市链融科技股份有限公司
 * Shenzhen Lianrong Technology Co., Ltd.
 * All rights reserved.
 *
 * @file：xn-blockchain-web\src\app\shared\shared.module.ts
 * @summary：init shared.module.ts
 * @version: 1.0
 * *************************************************************************
 * revision             author            reason             date
 * 1.0                  WuShenghui        init             2020-11-09
 ***************************************************************************/
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { TransformNumPipe } from './pipes/transform-num.pipe';
import { HtmlPipe } from './pipes/html.pipe';

import { NzMessageModule } from 'ng-zorro-antd/message';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzBreadCrumbModule } from 'ng-zorro-antd/breadcrumb';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { NzPaginationModule } from 'ng-zorro-antd/pagination';
import { NzPopoverModule } from 'ng-zorro-antd/popover';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzEmptyModule } from 'ng-zorro-antd/empty';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzStepsModule } from 'ng-zorro-antd/steps';
import { PortalBarComponent } from '../_components/portal.bar.component';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { FileViewerConfigService } from '@lr/ngx-shared';
import { FileService } from './services/file.service';
const MODULES = [
  CommonModule,
  HttpClientModule,
  ReactiveFormsModule,
  NzMessageModule,
  NzTableModule,
  NzCardModule,
  NzInputModule,
  NzIconModule,
  NzBreadCrumbModule,
  NzGridModule,
  NzMenuModule,
  NzButtonModule,
  NzTabsModule,
  NzPaginationModule,
  NzPopoverModule,
  NzDropDownModule,
  NzSpinModule,
  NzEmptyModule,
  NzModalModule,
  NzStepsModule,
  NzSelectModule,
];

@NgModule({
  declarations: [TransformNumPipe, PortalBarComponent, HtmlPipe],
  imports: [...MODULES],
  exports: [...MODULES, TransformNumPipe, PortalBarComponent, HtmlPipe],
  providers: [],
})
export class SharedModule {
  constructor(
    private fileService: FileService,
    private xnFileViewerConfig: FileViewerConfigService
  ) {
    this.xnFileViewerConfig.set(this.fileService);
  }
}
