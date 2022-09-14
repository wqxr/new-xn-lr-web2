/*************************************************************************
 * Copyright (c) 2017 - 2020 深圳市链融科技股份有限公司
 * Shenzhen Lianrong Technology Co., Ltd.
 * All rights reserved.
 *
 * @file：xn-shared\src\lib\components\mfile-viewer\mfile-viewer.module.ts
 * @summary：init mfile-viewer.module.ts
 * @version: 1.0
 * *************************************************************************
 * revision             author            reason             date
 * 1.0                 yutianbao        init             2020-09-09
 ***************************************************************************/
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxViewerModule } from 'ngx-viewer';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzResultModule } from 'ng-zorro-antd/result';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzAlertModule } from 'ng-zorro-antd/alert';
import { NzEmptyModule } from 'ng-zorro-antd/empty';
import { NzSpaceModule } from 'ng-zorro-antd/space';

import { MFileViewerComponent } from './mfile-viewer.component';
import { MFileViewerModalComponent } from './mfile-viewer.modal';
import { MFileViewerService } from './mfile-viewer.service';
import { FileSecurePipe } from './file-secure.pipe';
import { MFileViewerConfigService } from './mfile.service';

@NgModule({
  declarations: [MFileViewerComponent, MFileViewerModalComponent, FileSecurePipe],
  imports: [
    CommonModule,
    NgxViewerModule,
    PdfViewerModule,
    NzButtonModule,
    NzSpinModule,
    NzSpaceModule,
    NzResultModule,
    NzIconModule,
    NzModalModule,
    NzAlertModule,
    NzEmptyModule,
  ],
  providers: [MFileViewerService, MFileViewerConfigService],
  exports: [MFileViewerComponent, FileSecurePipe],
})
export class MFileViewerModule {}
