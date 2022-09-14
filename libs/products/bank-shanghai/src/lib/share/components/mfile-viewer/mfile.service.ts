/*************************************************************************
 * Copyright (c) 2017 - 2020 深圳市链融科技股份有限公司
 * Shenzhen Lianrong Technology Co., Ltd.
 * All rights reserved.
 *
 * @file：xn-shared\src\lib\components\mfile-viewer\mfile.service.ts
 * @summary：init file.service.ts
 * @version: 1.0
 * *************************************************************************
 * revision             author            reason             date
 * 1.0                  WuShenghui        init             2020-10-23
 ***************************************************************************/
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';

export interface ViewFileService {
  view(fileKey: string): Observable<any>;
}

@Injectable()
export class MFileViewerConfigService {
  fileService: ViewFileService;

  set(options: ViewFileService) {
    this.fileService = options;
  }

  view(fileKey: string) {
    if (this.fileService) {
      return this.fileService.view(fileKey);
    } else {
      return throwError(new Error('FileService is null'));
    }
  }
}
