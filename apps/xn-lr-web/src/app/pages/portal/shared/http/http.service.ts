/*************************************************************************
 * Copyright (c) 2017 - 2020 深圳市链融科技股份有限公司
 * Shenzhen Lianrong Technology Co., Ltd.
 * All rights reserved.
 *
 * @file：xn-blockchain-web\src\app\shared\http\http.service.ts
 * @summary：init http.service.ts
 * @version: 1.0
 * *************************************************************************
 * revision             author            reason             date
 * 1.0                  WuShenghui        init             2020-11-09
 ***************************************************************************/
import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { XnUtils } from '../utils';
import { NzMessageService } from 'ng-zorro-antd/message';

export interface HeaderParam {
  key: string;
  value: string;
}

const testAppId = '8d969eef6ecad3c29a3a629280e686cf0c3f5d5a86aff3ca12020c923adc6c92';
const prodAppId = '08c9099044f13049f1389c249b9b79a0452195bf2359706497f0ceb2a535bc11';

@Injectable({
  providedIn: 'root',
})
export class HttpService {
  urlPrefix = 'access/';
  appId = prodAppId; // testAppId;
  get signInfo() {
    return XnUtils.requestSign();
  }

  get businessType() {
    return window.sessionStorage.getItem('businessType')
  }

  constructor(private http: HttpClient, private msg: NzMessageService) {}

  /**
   * Get 请求
   * @param url 请求地址
   * @param params 请求参数
   * @param credentials 请求是否携带cookie
   */
  get<T>(
    url: string,
    params: any = null,
    credentials: boolean = true
  ): Observable<any> {
    if (params) {
      url += this.objectToQueryString({ ...params, ...this.signInfo });
    }
    return this.http.get<T>(this.urlPrefix + url, {
      withCredentials: credentials,
    });
  }

  /**
   * Post 请求
   * @param url 请求地址
   * @param params 请求参数
   * @param headers 请求头
   * @param credentials 请求是否携带cookie
   */
  post<T>(
    url: string,
    params: any,
    headers?: Array<HeaderParam>,
    credentials: boolean = true
  ): Observable<any> {
    const param: { [name: string]: string } = {
      'Content-Type': 'application/json',
    };
    if (headers) {
      headers.forEach((val) => {
        param[val.key] = val.value;
      });
    }
    const httpHeaders: HttpHeaders = new HttpHeaders(param);
    return this.http.post<T>(
      this.urlPrefix + url,
      { body: { ...params }, ...this.signInfo, appId: this.appId, businessType: this.businessType},
      {
        headers: httpHeaders,
        withCredentials: credentials,
      }
    );
  }

  /**
   * 通用请求
   * @param method 请求方法
   * @param url 请求地址
   * @param params 请求参数
   * @param header 请求头
   * @param credentials 请求是否携带cookie
   */
  request(
    method: 'get' | 'post',
    url: string,
    params: any,
    header?: HttpHeaders,
    responseType: 'arraybuffer' | 'blob' | 'json' | 'text' = 'json',
    credentials: boolean = true
  ): Observable<any> {
    const requestParams =
      method === 'get'
        ? { params: { ...params, ...this.signInfo } }
        : { body: { ...params, ...this.signInfo } };

    return this.http.request(method, this.urlPrefix + url, {
      ...requestParams,
      headers: header,
      withCredentials: credentials,
      responseType,
    });
  }

  /**
   * 文件上传
   * @param url 请求地址
   * @param formData 文件数据
   * @param header 请求头
   * @param credentials 请求是否携带cookie
   */
  uploadFile(
    url: string,
    formData: any,
    header?: Array<HeaderParam>,
    credentials: boolean = true
  ): Observable<any> {
    const param: { [name: string]: string } = {
      Accept: 'application/json',
    };
    if (header) {
      header.forEach((val) => {
        param[val.key] = val.value;
      });
    }
    return this.http.post(url, formData, {
      headers: param,
      withCredentials: credentials,
    });
  }

  /**
   * 下载
   * @param method 请求方法
   * @param url 请求地址
   * @param params 请求参数
   * @param filename 文件名称
   */
  download(
    method: 'get' | 'post',
    url: string,
    params: any,
    filename = '文件'
  ) {
    this.request(method, url, params, undefined, 'blob').subscribe((res) => {
      this.save(res, filename);
    });
  }

  /**
   * 下载 blob对象文件
   */
  save(blob: Blob, filename: string) {
    if (window.navigator.msSaveOrOpenBlob) {
      window.navigator.msSaveOrOpenBlob(blob, filename);
    } else {
      const event = document.createEvent('MouseEvents');
      event.initMouseEvent( 'click', true, true, window, 1, 0, 0, 0, 0, false, false, false, false, 0, null);
      const link = document.createElement('a');
      link.setAttribute('href', URL.createObjectURL(blob));
      link.setAttribute('download', filename);
      link.dispatchEvent(event);
    }
  }

  private objectToQueryString(params: object | undefined) {
    return params
      ? Object.entries(params).reduce((queryString, [key, val]) => {
          const symbol = queryString.length === 0 ? '?' : '&';
          queryString +=
            ['string', 'number', 'boolean'].includes(typeof(val))
              ? `${symbol}${key}=${encodeURIComponent(val)}`
              : '';
          return queryString;
        }, '')
      : '';
  }
}
