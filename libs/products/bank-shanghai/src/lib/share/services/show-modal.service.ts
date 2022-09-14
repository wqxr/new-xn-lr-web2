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
import { ApplicationRef, ComponentFactoryResolver, Injectable, Injector, ViewContainerRef } from '@angular/core';
import { XnService } from 'libs/shared/src/lib/services/xn.service';
import { Observable } from 'rxjs';

@Injectable(
  // {providedIn: 'root'}
)
export class ShowModalService {
  constructor(
    private appRef: ApplicationRef,
    private injector: Injector,
    private componentFactoryResolver: ComponentFactoryResolver
  ) {}

  openModal(xn: XnService, vcr: ViewContainerRef, modalComponent: any, params: any): Observable<any> {
    const componentRef = this.componentFactoryResolver
      .resolveComponentFactory(modalComponent)
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
