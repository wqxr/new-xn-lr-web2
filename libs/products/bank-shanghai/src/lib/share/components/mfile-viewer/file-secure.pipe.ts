/*************************************************************************
 * Copyright (c) 2017 - 2020 深圳市链融科技股份有限公司
 * Shenzhen Lianrong Technology Co., Ltd.
 * All rights reserved.
 *
 * @file：xn-shared\src\lib\components\mfile-viewer\file-secure.pipe.ts
 * @summary：init file-secure.pipe.ts
 * @version: 1.0
 * *************************************************************************
 * revision             author            reason             date
 * 1.0                  WuShenghui        init             2020-10-22
 ***************************************************************************/
import { Pipe, PipeTransform } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { Observable, of } from 'rxjs';
import { MFileViewerConfigService } from './mfile.service';

@Pipe({
  name: 'filesecure',
})
export class FileSecurePipe implements PipeTransform {
  constructor(
    private fileService: MFileViewerConfigService,
    private message: NzMessageService
  ) {}

  transform(url: string) {
    if (url.includes('/')) {
      return of(url);
    }

    return new Observable<string>((observer: { next: any; error?: any }) => {
      observer.next('/');

      this.fileService.view(url).subscribe(
        (blob) => {
          const reader = new FileReader();
          reader.readAsDataURL(blob);
          reader.onload = () => {
            observer.next(reader.result);
          };
        },
        (err: any) => {
          observer.next('404');
        }
      );

      return { unsubscribe() {} };
    });
  }
}
