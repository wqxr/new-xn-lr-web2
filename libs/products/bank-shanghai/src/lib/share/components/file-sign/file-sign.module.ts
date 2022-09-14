/*************************************************************************
 * Copyright (c) 2017 - 2020 北京希为科技有限公司
 * Beijing Xiwei Technology Co., Ltd.
 * All rights reserved.
 *
 * @file：xn-shared\src\lib\components\file-sign\file-sign.module.ts
 * @summary：init file-sign.module.ts
 * @version: 1.0
 * *************************************************************************
 * revision             author            reason             date
 * 1.0                  yutianbao        init             2020-09-09
 ***************************************************************************/
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxViewerModule } from 'ngx-viewer';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzListModule } from 'ng-zorro-antd/list';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzEmptyModule } from 'ng-zorro-antd/empty';

import { FileSignComponent } from './file-sign.component';
import { FileSignModal } from './file-sign.modal';
import { FileSignService } from './file-sign.service';

@NgModule({
  declarations: [FileSignComponent, FileSignModal],
  imports: [
    CommonModule,
    NgxViewerModule,
    PdfViewerModule,
    NzButtonModule,
    NzSpinModule,
    NzIconModule,
    NzModalModule,
    NzLayoutModule,
    NzListModule,
    NzTagModule,
    NzEmptyModule,
  ],
  providers: [FileSignService],
  exports: [FileSignComponent],
})
export class FileSignModule {}
