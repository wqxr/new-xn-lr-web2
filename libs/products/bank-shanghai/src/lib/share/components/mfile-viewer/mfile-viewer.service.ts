/*************************************************************************
 * Copyright (c) 2017 - 2020 深圳市链融科技股份有限公司
 * Shenzhen Lianrong Technology Co., Ltd.
 * All rights reserved.
 *
 * @file：xn-shared\src\lib\components\mfile-viewer\mfile-viewer.service.ts
 * @summary：init mfile-viewer.service.ts
 * @version: 1.0
 * *************************************************************************
 * revision             author            reason             date
 * 1.0                 yutianbao        init             2020-09-10
 ***************************************************************************/
import { ApplicationRef, ComponentFactoryResolver, Injectable, Injector, ViewContainerRef } from '@angular/core';
import { MFileViewerModalComponent } from './mfile-viewer.modal';
import { FileViewerModel } from './interface';
import { Observable } from 'rxjs';

@Injectable()
export class MFileViewerService {
  constructor(
    private appRef: ApplicationRef,
    private injector: Injector,
    private componentFactoryResolver: ComponentFactoryResolver
  ) {}

  openModal(params: FileViewerModel): Observable<any> {
    console.log('params', params);
    const componentRef = this.componentFactoryResolver
      .resolveComponentFactory(MFileViewerModalComponent)
      .create(this.injector);

    this.appRef.attachView(componentRef.hostView);

    // componentRef.instance.data = params;
    return new Observable((observer) => {
      const instance: any = componentRef.instance;
      instance.open(params).subscribe((v: any) => {
        // 释放组件
        // params.vcr.remove(params.vcr.indexOf(componentRef.hostView));
        componentRef.destroy();
        observer.next(v);
        observer.complete();
      });
    });
  }
}
