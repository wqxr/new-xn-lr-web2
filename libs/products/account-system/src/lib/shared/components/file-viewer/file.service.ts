/*************************************************************************
 * Copyright (c) 2017 - 2020 深圳市链融科技股份有限公司
 * Shenzhen Lianrong Technology Co., Ltd.
 * All rights reserved.
 *
 * @file：xn-shared\src\lib\components\file-viewer\file.service.ts
 * @summary：init file.service.ts
 * @version: 1.0
 * *************************************************************************
 * revision             author            reason             date
 * 1.0                  WuShenghui        init             2020-10-23
 ***************************************************************************/
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';

export interface ViewFileService {
  view(fileKey: string): Observable<any>;
}

@Injectable()
export class FileViewerConfigService {
  fileService: ViewFileService;
  constructor(private http: HttpClient) { }
  set(options: ViewFileService) {
    this.fileService = options;
  }

  view(account_id: string) {
    return this.http.post(
      '/middle-ground/api/account/service/protocol',
      { account_id: account_id },
      { responseType: 'blob' }
    );
  }
}
