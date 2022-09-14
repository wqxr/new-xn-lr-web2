/*************************************************************************
* Copyright (c) 2017 - 2021 深圳市链融科技股份有限公司
* Shenzhen Lianrong Technology Co., Ltd.
* All rights reserved.
*
* @file：libs\products\account-system\src\lib\shared\components\file-viewer\file-viewer.module.ts
* @summary：init file-viewer.module.ts
* @version: 1.0
* *************************************************************************
* revision             author            reason             date
* 1.0                HuCongying           init           2021-11-01
***************************************************************************/
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxViewerModule } from 'ngx-viewer';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzAlertModule } from 'ng-zorro-antd/alert';
import { NzEmptyModule } from 'ng-zorro-antd/empty';

import { ProtocolFileViewerComponent } from './protocol-file-viewer.component';
import { SecurePipe } from './secure.pipe';
import { FileViewerConfigService } from './file.service';
import { XnScrollEventDirective } from '../../directives';

@NgModule({
  declarations: [ProtocolFileViewerComponent, SecurePipe, XnScrollEventDirective],
  imports: [
    CommonModule,
    NgxViewerModule,
    PdfViewerModule,
    NzButtonModule,
    NzSpinModule,
    NzIconModule,
    NzModalModule,
    NzAlertModule,
    NzEmptyModule,
  ],
  providers: [FileViewerConfigService],
  exports: [ProtocolFileViewerComponent, SecurePipe, XnScrollEventDirective],
})
export class ProtocolFileViewerModule { }
