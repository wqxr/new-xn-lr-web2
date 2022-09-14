/*************************************************************************
 * Copyright (c) 2017 - 2020 深圳市链融科技股份有限公司
 * Shenzhen Lianrong Technology Co., Ltd.
 * All rights reserved.
 *
 * @file：xn-blockchain-web\src\app\shared\http\request.interceptor.ts
 * @summary：init request.interceptor.ts
 * @version: 1.0
 * *************************************************************************
 * revision             author            reason             date
 * 1.0                  WuShenghui        init             2020-11-09
 ***************************************************************************/
import { Injectable, Injector } from '@angular/core';
import { Router } from '@angular/router';
import {
  HttpErrorResponse,
  HttpHandler,
  HttpHeaderResponse,
  HttpInterceptor,
  HttpProgressEvent,
  HttpRequest,
  HttpResponse,
  HttpSentEvent,
  HttpUserEvent,
  HttpClient,
} from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { catchError, mergeMap } from 'rxjs/operators';
import { NzMessageService } from 'ng-zorro-antd/message';

const loginUrl = `/`;

@Injectable()
export class RequestInterceptor implements HttpInterceptor {
  constructor(private injector: Injector, private http: HttpClient) {}

  get msg(): NzMessageService {
    return this.injector.get(NzMessageService);
  }

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler,
  ): Observable<
    | HttpSentEvent
    | HttpHeaderResponse
    | HttpProgressEvent
    | HttpResponse<any>
    | HttpUserEvent<any>
  > {
    // 不对静态资源做处理
    const localUrl = /\/assets\/\S+.html?\S*$/gim;
    if (req.url.match(localUrl)) {
      return next.handle(req);
    }

    const newReq = this.prepareReq(req);

    return next.handle(newReq).pipe(
      mergeMap((event: any) => {
        // 允许统一对请求错误处理，这是因为一个请求若是业务上错误的情况下其HTTP请求的状态是200的情况下需要
        if (event instanceof HttpResponse && event.status === 200) {
          return this.handleData(event);
        }

        // 若一切都正常，则后续操作
        return of(event);
      }),
      catchError((err: HttpErrorResponse) => {
        if (err.error && err.error.text && typeof err.error.text === 'string') {
          // think js error: request timeout.
          const msg = this.getDomTextContent(
            err.error.text,
            '<div class="error-msg">',
          );
          this.msg.error(msg);

          if (msg.includes('请登录')) {
            this.goTo(loginUrl);
          }
        }

        return throwError(err);
      }),
    );
  }

  // tslint:disable-next-line:prefer-function-over-method
  private prepareReq(req: HttpRequest<any>): HttpRequest<any> {
    const url = req.url;

    // 统一加上服务端前缀
    // if (!url.startsWith('https://') && !url.startsWith('http://')) {
    //   url = `/api/${url}`;
    // }

    console.log('req >>', req);

    const newReq = req.clone({
      url,
    });

    return newReq;
  }

  private goTo(url: string): void {
    setTimeout(() => this.injector.get(Router).navigateByUrl(url));
  }

  private handleData(
    event: HttpResponse<any> | HttpErrorResponse,
  ): Observable<any> {
    // 业务处理：一些通用操作
    switch (event.status) {
      case 200:
        // 业务层级错误处理，以下是假定restful有一套统一输出格式（指不管成功与否都有相应的数据格式）情况下进行处理
        // 例如响应内容：
        //  错误内容：{ status: 1, msg: '非法参数' }
        //  正确内容：{ status: 0, response: {  } }
        // 则以下代码片断可直接适用
        if (event instanceof HttpResponse) {
          const body: any = event.body;
          if (
            body &&
            event.body.constructor !== Blob &&
            body.status !== 0 &&
            body.msg.length
          ) {
            this.msg.error(body.msg);
            // 继续抛出错误中断后续所有 Pipe、subscribe 操作，因此：
            // this.http.get('/').subscribe() 并不会触发

            return throwError({ msg: body.msg });
          } else {
            // 重新修改 `body` 内容为 `response` 内容，对于绝大多数场景已经无须再关心业务状态码
            // return of(
            //   new HttpResponse(Object.assign(event, { body: body.response })),
            // );

            // 或者依然保持完整的格式
            return of(event);
          }
        } else {
          if (event.error.text) {
            // think js error
            const err = {
              ret: 500,
              msg: this.getDomTextContent(
                event.error.text,
                '<div class="wrap">',
              ),
            };
            this.handleError(err);

            return of();
          }
        }
        break;
      case 401: // 未登录状态码
        this.goTo(loginUrl);
        break;
      case 403:
      case 404:
      case 500:
        this.goTo(`/${event.status}`);
        break;
      default:
        if (event instanceof HttpErrorResponse) {
          console.warn(
            '未可知错误，大部分是由于后端不支持CORS或无效配置引起',
            event,
          );
          this.msg.error(event.message);
        }
        break;
    }

    return of(event);
  }

  private handleError(event: { ret: number; msg: string }): void {
    if (event.ret !== 0) {
      if (event.ret === 99902) {
        // 用户没有登录，跳转到登录界面
        this.goTo(loginUrl);
      } else {
        let msg;
        if (event.msg) {
          msg =
            event.msg === Object(event.msg)
              ? `请求失败：${JSON.stringify(event.msg)}(错误代码: ${event.ret})`
              : `请求失败：${event.msg}(错误代码: ${event.ret})`;
        } else {
          msg = `请求失败：(错误代码: ${event.ret})`;
        }
        this.msg.error(msg);
      }
    }
  }

  // tslint:disable-next-line:prefer-function-over-method
  private getDomTextContent(
    htmlText: string,
    substringStart: string,
    substringEnd = '</div>',
  ): string {
    const markup = htmlText.substring(
      htmlText.lastIndexOf(substringStart),
      htmlText.lastIndexOf(substringEnd),
    );
    const parser = new DOMParser();
    const el = parser.parseFromString(markup, 'text/html');

    return el?.body?.firstChild?.textContent || '';
  }
}
