/*************************************************************************
 * Copyright (c) 2017 - 2021 深圳市链融科技股份有限公司
 * Shenzhen Lianrong Technology Co., Ltd.
 * All rights reserved.
 *
 * @file：apps\xn-lr-web\src\app\pages\portal\shared\services\file.service.ts
 * @summary：file.service.ts
 * @version: 1.0
 * *************************************************************************
 * revision             author            reason             date
 * 1.0                  DengPei           init               2022-02-16
 ***************************************************************************/
import { Injectable } from '@angular/core';
import { ViewFileService } from '@lr/ngx-shared';
import { HttpClient } from '@angular/common/http';
import * as md5 from 'js-md5';

@Injectable({ providedIn: 'root' })
export class FileService implements ViewFileService {
  constructor(private http: HttpClient) {}

  view(fileKey: string) {
    return this.http.post(
      '/bill/file/view',
      { key: fileKey, ...this.tAndSign() },
      { responseType: 'blob' }
    );
  }

  tAndSign() {
    return {
      t: Math.floor(new Date().getTime() / 1000),
      sign: md5(Math.random().toString(36).substring(2)),
    };
  }
}
