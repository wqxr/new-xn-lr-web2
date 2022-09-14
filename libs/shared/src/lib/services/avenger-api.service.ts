import { Injectable } from '@angular/core';
import { avengerRoot } from '../config/config';
import { Observable, of } from 'rxjs';
import * as md5 from 'js-md5';
import { ApiBaseService } from './api-base';
import { Router } from '@angular/router';
import { MsgBoxService } from './msg-box.service';
import { LoadingService } from './loading.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';

const httpOptions = {
    headers: new HttpHeaders({
        'Content-Type': 'application/json; charset=utf-8',
        'X-Requested-With': 'XMLHttpRequest',  // 告诉后台thinkjs这是个ajax请求，这样thinkjs对于其他错误也会用json格式返回
        'Access-Control-Allow-Headers': 'x-requested-with,content-type,Authorization,timespan,sign'
    })
};

@Injectable({ providedIn: 'root' })
export class AvengerApiService extends ApiBaseService {
    get apiRoot() {
        return avengerRoot;
    }

    constructor(protected router: Router,
                private http: HttpClient,
                protected msgBox: MsgBoxService,
                protected loading: LoadingService) {
        super(router, http, msgBox, loading);
    }

    getSignInfo() {
        const time = Math.floor(new Date().getTime() / 1000);
        const appId = window.sessionStorage.getItem('appId');
        const clientkey = window.sessionStorage.getItem('clientkey');
        const userId = window.sessionStorage.getItem('userId');

        return {
            t: time,
            sign: md5(`${appId}${clientkey}${time}${userId}`),
        };
    }

    postOnly(url: string, params: any): Observable<any> {
        const { t, sign } = this.getSignInfo();
        params.t = t;
        params.sign = sign;
        return this.httpClient.post(avengerRoot + url, JSON.stringify(params), httpOptions);
    }

    postMap(url: string, params: any): Observable<any> {
        return this.postOnly(url, params)
            .pipe(map(res => {
                this.loading.close();
                return res;
            }));
    }

    /**
     * ajax方式把文件下载到内存中
     * @param url
     * @param params
     * @returns {Observable<Response>}
     */
    downLoad(url: string, params: any): Observable<any> {
        const { t, sign } = this.getSignInfo();
        params.t = t;
        params.sign = sign;
        return this.http.post(avengerRoot + url, JSON.stringify(params), {
            headers: new HttpHeaders({
                'Content-Type': 'application/json; charset=utf-8',
                'X-Requested-With': 'XMLHttpRequest'  // 告诉后台thinkjs这是个ajax请求，这样thinkjs对于其他错误也会用json格式返回
            }),
            responseType: 'blob'
        }).pipe(map(data => ({_body: data})));
    }
}
