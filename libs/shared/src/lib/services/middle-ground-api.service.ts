/*************************************************************************
* Copyright (c) 2017 - 2021 深圳市链融科技股份有限公司
* Shenzhen Lianrong Technology Co., Ltd.
* All rights reserved.
*
* @file：libs\shared\src\lib\services\middle-ground-api.service.ts
* @summary：中台http服务
* @version: 1.0
* *************************************************************************
* revision             author            reason             date
* 1.0                HuCongying           init           2021-11-05
***************************************************************************/
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { MinUtils } from 'libs/products/account-system/src/lib/shared/utils';
import { Observable, of } from 'rxjs';
import { catchError, filter, map } from 'rxjs/operators';
import { isObject, isString } from 'util';
import { middleRoot } from '../config/config';
import { MiddleResCodeEnum } from '../config/enum';
import { LoadingService } from './loading.service';
import { MsgBoxService } from './msg-box.service';
@Injectable({ providedIn: 'root' })
export class MiddleGroundApiService {
  protected httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json; charset=utf-8',
      'X-Requested-With': 'XMLHttpRequest',
      'Access-Control-Allow-Headers':
        'x-requested-with,content-type,Authorization,timespan,sign',
    }),
  };

  get apiRoot() {
    return `${middleRoot}/api`;
  };

  constructor(
    protected router: Router,
    protected httpClient: HttpClient,
    protected msgBox: MsgBoxService,
    protected loading: LoadingService
  ) { }

  /**
   * 发送POST请求，错误用msgBox显示，并过滤错误
   * @param url url
   * @param params params
   * @returns any
   */
  post(url: string, params: any): Observable<any> {
    return this.postMapCatch(url, params).pipe(
      filter((json) => {
        MinUtils.jsonToHump(json);
        // 错误情况在这里处理，并且直接过滤掉
        return this.handleJsonRet(json);
      })
    );
  }

  /**
   * 发送POST请求，错误用msgBox显示，不过滤错误
   * @param url
   * @param params
   * @returns:{Observable<R>}
   */
  post2(url: string, params: any): Observable<any> {
    return this.postMapCatch(url, params).pipe(
      map((json) => {
        // 错误情况在这里处理，但不过滤
        this.handleJsonRet(json);
        MinUtils.jsonToHump(json);
        return json;
      })
    );
  }

  /**
   * quest
   * @param url
   * @param params
   * @returns
   */
  postOnly(url: string, params: any): Observable<any> {
    return this.httpClient.post(
      this.apiRoot + url,
      params,
      this.httpOptions
    );
  }

  /**
   * 包装错误信息
   * @param url
   * @param params
   * @returns
   */
  postMapCatch(url: string, params: any): Observable<any> {
    return this.postOnly(url, params).pipe(
      catchError((err) => {
        // 把错误信息也包装成json格式
        let msg = '请求出现异常';
        if (err instanceof Response) {
          if ((err as any).Body) {
            msg = `请求异常，状态码${err.status}，${(err as any).Body}`;
          } else {
            msg = `请求异常，状态码${err.status}`;
          }
        }
        return of({
          code: MiddleResCodeEnum.ERROR,
          msg,
        });
      })
    );
  }

  /**
   * 处理错误信息
   * @param json
   * @returns
   */
  handleJsonRet(json: any): boolean {
    if (json.code !== MiddleResCodeEnum.SUCCESS) {
      this.loading.close(); // 请求异常 关闭loading
      if (json.code === MiddleResCodeEnum.FORBIDDEN) {
        // 用户没有登录，跳转到登录界面
        this.msgBox.open(false, '您的登录已经超时，请重新登录!', () => {
          this.router.navigate(['/login']);
        });
      } else {
        let msg: any;
        if (json.msg) {
          if (isObject(json.msg)) {
            msg = `请求失败：${JSON.stringify(json.msg)}(错误代码: ${json.code
              })`;
          } else if (isString(json.msg)) {
            msg = `请求失败：${json.msg}(错误代码: ${json.code})`;
          } else {
            msg = `请求失败：${json.msg}(错误代码: ${json.code})`;
          }
        } else {
          msg = `请求失败：(错误代码: ${json.code})`;
        }
        this.msgBox.open(false, msg);
      }
      return false;
    } else {
      return true;
    }
  }

  /**
   * 下载文件
   * @param url 请求路径
   * @param params 请求参数
   * @returns
   */
  getFileDownload(url: string, params: any): Observable<any> {
    return this.httpClient
      .post(this.apiRoot + url, params, {
        headers: new HttpHeaders({
          'Content-Type': 'application/json; charset=utf-8',
          'X-Requested-With': 'XMLHttpRequest',
        }),
        responseType: 'blob',
        observe: 'response',
      })
      .pipe(map((data) => ({ Body: data })));
  }

  /**
   * 获取下载文件的文件名
   * @param resHeader 响应头
   * @returns
   */
  getFileName(resHeader: any) {
    let fileName: string;
    const contentDisposition = resHeader.get('Content-Disposition');
    if (contentDisposition) {
      fileName = window.decodeURI(contentDisposition.split(';')[0].split('=')[1]);
    }
    fileName = fileName.replace(/\"/g, '');
    return fileName;
  }

  /**
   * 把blob对象变成下载文件
   * @param blob blob文件
   * @param filename 文件名
   */
  save(blob: Blob, filename: string) {
    const evt = document.createEvent('MouseEvents');
    evt.initMouseEvent(
      'click',
      true,
      false,
      window,
      0,
      0,
      0,
      0,
      0,
      false,
      false,
      false,
      false,
      0,
      null
    );
    const link = document.createElement('a');
    link.download = filename;
    link.href = URL.createObjectURL(blob);
    link.dispatchEvent(evt);
  }
}


