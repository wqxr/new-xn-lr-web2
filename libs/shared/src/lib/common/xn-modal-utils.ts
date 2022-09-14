import { ViewContainerRef, Injector, ComponentFactoryResolver, ApplicationRef } from '@angular/core';
import { Observable } from 'rxjs';
import { XnService } from '../services/xn.service';

export class XnModalUtils {

  /**
   * 在ViewContainerRef中动态创建modal, 紧挨着本组件来创建
   * @param xn
   * @param vcr
   * @param modalComponent 组件类
   * @param params 模态框open参数
   * @return Observable<any>
   */
  static openInViewContainer(xn: XnService, vcr: ViewContainerRef, modalComponent: any, params: any): Observable<any> {
    const comFactory = xn.cfr.resolveComponentFactory(modalComponent);
    const comRef = vcr.createComponent(comFactory);
    return Observable.create(observer => {
      // 使用setTimeout是为了在下一个渲染期执行
      setTimeout(() => {
        const instance: any = comRef.instance;
        instance.open(params).subscribe(v => {
          // 释放组件
          vcr.remove(vcr.indexOf(comRef.hostView));
          comRef.destroy();

          observer.next(v);
          observer.complete();
        });
      }, 0);
    });
  }

  /**
   * 与openInViewContainer的区别是返回值为void，调用者需在params里提供onSubmit函数
   * @param xn
   * @param vcr
   * @param modalComponent
   * @param params
   */
  static openInViewContainer2(xn: XnService, vcr: ViewContainerRef, modalComponent: any, params: any): void {
    const comFactory = xn.cfr.resolveComponentFactory(modalComponent);
    const comRef = vcr.createComponent(comFactory);
    // 使用setTimeout是为了在下一个渲染期执行
    setTimeout(() => {
      const instance: any = comRef.instance;
      instance.open(params).subscribe(() => {
        console.log('open component');
        // 释放组件
        vcr.remove(vcr.indexOf(comRef.hostView));
        comRef.destroy();
      });
    }, 0);
  }

  /**
   * 在ApplicationRef动态创建modal
   * @param cfr
   * @param ar
   * @param injector
   * @param modalComponent 组件类
   * @param params 模态框open参数
   * @returns Observable<any>
   *
   * injector怎么得到？
   * let injector = ReflectiveInjector.resolveAndCreate([], this.vcr.parentInjector); // 这里演示的是不需要额外的providers
   * let injector = ReflectiveInjector.resolveAndCreate([DemoService], this.vcr.parentInjector); // 这里演示的是需要额外的providers
   */
  static openInApplication(xn: XnService, injector: Injector, modalComponent: any, params: any): Observable<any> {
    const comFactory = xn.cfr.resolveComponentFactory(modalComponent);
    const comRef = comFactory.create(injector);
    xn.application.attachView(comRef.hostView);

    return Observable.create(observer => {
      setTimeout(() => {
        const instance: any = comRef.instance;
        instance.open(params).subscribe(v => {
          xn.application.detachView(comRef.hostView);
          comRef.destroy();

          observer.next(v);
          observer.complete();
        });
      }, 0);
    });
  }
}
