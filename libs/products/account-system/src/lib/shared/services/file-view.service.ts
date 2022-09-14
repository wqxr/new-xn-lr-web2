/*************************************************************************
* Copyright (c) 2017 - 2021 深圳市链融科技股份有限公司
* Shenzhen Lianrong Technology Co., Ltd.
* All rights reserved.
*
* @file：
* @summary：FileViewService
* @version: 1.0
* *************************************************************************
* revision             author            reason             date
* 1.0                HuCongying           init           2021-11-01
***************************************************************************/
//  import { HttpService } from './../http/http.service';
//  import { Injectable } from '@angular/core';
//  import { ViewFileService } from '@lr/ngx-shared';

import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { ViewFileService } from "@lr/ngx-shared";


@Injectable({ providedIn: 'root' })
export class FileViewService implements ViewFileService {
  constructor(private http: HttpClient) { }

  view(fileKey: string) {
    return this.http.post(
      '/middle-ground/api/file/download',
      { fileKey: fileKey },
      { responseType: 'blob' }
    );
  }
}
