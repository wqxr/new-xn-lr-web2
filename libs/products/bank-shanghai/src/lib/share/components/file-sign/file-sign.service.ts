/*************************************************************************
 * Copyright (c) 2017 - 2020 北京希为科技有限公司
 * Beijing Xiwei Technology Co., Ltd.
 * All rights reserved.
 *
 * @file：xn-shared\src\lib\components\file-sign\file-sign.service.ts
 * @summary：init file-sign.service.ts
 * @version: 1.0
 * *************************************************************************
 * revision             author            reason             date
 * 1.0                  yutianbao        init             2020-09-10
 ***************************************************************************/
import { ApplicationRef, ComponentFactoryResolver, Injectable, Injector } from '@angular/core';
import { Observable } from 'rxjs';
import { FileSignModal } from './file-sign.modal';
import { clickParams, FileSignData } from './interface';

@Injectable()
export class FileSignService {
  constructor(
    private appRef: ApplicationRef,
    private injector: Injector,
    private componentFactoryResolver: ComponentFactoryResolver
  ) {}

  openModal(params: FileSignData): Observable<clickParams> {
    console.log('params', params);
    const componentRef = this.componentFactoryResolver
      .resolveComponentFactory(FileSignModal)
      .create(this.injector);

    this.appRef.attachView(componentRef.hostView);

    componentRef.instance.data = params;
    // componentRef.instance.showModal();
    return new Observable((observer) => {
      componentRef.instance.showModal().subscribe((v: clickParams) => {
        // 释放组件
        // params.vcr.remove(params.vcr.indexOf(componentRef.hostView));
        componentRef.destroy();
        observer.next(v);
        observer.complete();
      });
    });
  }
}
