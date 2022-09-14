/*************************************************************************
* Copyright (c) 2017 - 2021 深圳市链融科技股份有限公司
* Shenzhen Lianrong Technology Co., Ltd.
* All rights reserved.
*
* @file：libs\products\account-system\src\lib\shared\services\show-modal.service.ts
* @summary：ShowModalService
* @version: 1.0
* *************************************************************************
* revision             author            reason             date
* 1.0                 hucongying          init           2021-11-01
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
     return new Observable((observer) => {
       const instance: any = componentRef.instance;
       instance.open(params).subscribe((v: any) => {
         // 释放组件
         componentRef.destroy();
         observer.next(v);
         observer.complete();
       });
     });
   }
 }
