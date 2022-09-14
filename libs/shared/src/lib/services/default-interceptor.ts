/*
 * Copyright(c) 2017-2019, 深圳市链融科技股份有限公司
 * Beijing Xiwei Technology Co., Ltd.
 * All rights reserved.
 *
 * @file：DefaultInterceptor
 * @summary：拦截器
 * @version: 1.0
 * **********************************************************************
 * revision             author            reason             date
 * 1.0                 zhyuanan             新增         2019-05-20
 * **********************************************************************
 */

import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable, } from 'rxjs';
import { MinUtils } from 'libs/products/account-system/src/lib/shared/utils';

@Injectable({ providedIn: 'root' })
export class DefaultInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler):
    Observable<HttpEvent<any>> {
    return next.handle(this.prepareReq(req));
  }

  private prepareReq(req: HttpRequest<any>): HttpRequest<any> {
    const url = req.url;
    let body: any;
    if (req.url.startsWith('/middle-ground/api')) {
      // java中台接口 请求参数由驼峰形式转下划线格式
      body = MinUtils.jsonToUnderline(req.body);
    } else {
      body = req.body;
    }
    return req.clone({
      url,
      body
    });
  }
}
