import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import * as md5 from 'js-md5';
import { Observable, of } from 'rxjs';
import { catchError, filter, map } from 'rxjs/operators';
import { isObject, isString } from 'util';
import { avengerRoot } from '../config/config';
import { LoadingService } from './loading.service';
import { MsgBoxService } from './msg-box.service';

declare let $: any;

export abstract class ApiBaseService {
  protected httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json; charset=utf-8',
      'X-Requested-With': 'XMLHttpRequest', // 告诉后台thinkjs这是个ajax请求，这样thinkjs对于其他错误也会用json格式返回
      'Access-Control-Allow-Headers':
        'x-requested-with,content-type,Authorization,timespan,sign',
    }),
  };

  abstract get apiRoot();

  constructor(
    protected router: Router,
    protected httpClient: HttpClient,
    protected msgBox: MsgBoxService,
    protected loading: LoadingService
  ) {}

  /**
   * 发送POST请求，错误用msgBox显示，并过滤错误
   * @param url url
   * @param params params
   * @returns any
   */
  post(url: string, params: any): Observable<any> {
    return this.postMapCatch(url, params).pipe(
      filter((json) => {
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
        return json;
      })
    );
  }

  /**
   * 发送POST请求，错误用alert显示，并过滤错误
   * @param url
   * @param params
   * @returns {any}
   */
  post3(url: string, params: any): Observable<any> {
    return this.postMapCatch(url, params).pipe(
      filter((json) => {
        // 错误情况在这里处理，并且直接过滤掉
        return this.handleJsonRet(json, true);
      })
    );
  }

  postOnly(url: string, params: any): Observable<any> {
    return this.httpClient.post(
      this.apiRoot + url,
      JSON.stringify(params),
      this.httpOptions
    );
  }

  postMap(url: string, params: any): Observable<any> {
    return this.postOnly(url, params).pipe(
      map((res) => {
        this.loading.close();
        return res;
      })
    );
  }

  postMapCatch(url: string, params: any): Observable<any> {
    return this.postMap(url, params).pipe(
      catchError((err) => {
        // 把错误信息也包装成json格式
        let msg = '请求出现异常';
        if (err instanceof Response) {
          if ((err as any)._body) {
            msg = `请求异常，状态码${err.status}，${(err as any)._body}`;
          } else {
            msg = `请求异常，状态码${err.status}`;
          }
        }
        return of({
          ret: 99900,
          msg,
        });
      })
    );
  }

  handleJsonRet(json: any, useAlert?: boolean): boolean {
    if (json.ret !== 0) {
      this.loading.close(); // 请求异常 关闭loading
      if (json.ret === 99902 || json.ret === 20001) {
        // 用户没有登录，跳转到登录界面
        this.msgBox.open(false, '您的登录已经超时，请重新登录!', () => {
          this.router.navigate(['/login']);
        });
      } else if (json.ret === 10105) {
        this.msgBox.open(false, '首次登陆需要修改密码', () => {
          this.router.navigate(['/user/find']);
        });
      } else if (json.ret === 10107) {
        this.msgBox.open(false, '首次登陆需要修改密码', () => {
          this.router.navigate(['/user/reset']);
        });
      } else if (json.ret === 30000012) {
        this.msgBox.open(
          false,
          `请求失败：${json.msg}(错误代码: ${json.ret})`,
          () => {
            this.router.navigate([
              `/console/record/new/supplier_upload_information`,
            ]);
          }
        );
      } else if (json.ret === 30000013) {
        this.msgBox.open(
          true,
          `请求失败：${json.msg}(错误代码: ${json.ret})`,
          () => {
            this.router.navigate([`/console/record/info`]);
          }
        );
      } else if (json.ret === 30002002) {
        // 供应商若未提交上海银行准入资料，则点击”查看处理“时弹出补充资料提示弹窗
        this.msgBox.open(
          true,
          `${json.msg}`,
          () => {
            this.router.navigate([`/bank-shanghai/record/new/`], {
              queryParams: {
                id: 'sub_sh_supplementaryinfo_input',
                relate: 'mainIds',
                relateValue: [],
              },
            });
          },
          () => {
            this.router.navigate([`/bank-shanghai/estate-shanghai`]);
          },
          ['取消', '去补充']
        );
      } else if (json.ret === 30002004) {
        // 供应商若未提交上海银行准入资料，则点击”查看处理“时弹出补充资料提示弹窗
        this.msgBox.open(
          true,
          `${json.msg}`,
          () => {
            this.router.navigate([`/oct-shanghai/record/new/`], {
              queryParams: {
                id: 'sub_so_supplementaryinfo_input',
                relate: 'mainIds',
                relateValue: [],
              },
            });
          },
          () => {
            this.router.navigate([`/oct-shanghai/estate-shanghai`]);
          },
          ['取消', '去补充']
        );
      }else if (json.ret === 88888) {
        // 雅居乐-星顺 项目公司未补充履约证明弹窗提示，确定后返回待办列表
        this.msgBox.open(
          false,
          `请求失败：${json.msg}(错误代码: ${json.ret})`,
          () => {
            window.history.go(-1);
          }
        );
      } else {
        let msg;
        if (json.msg) {
          if (json.ret === 1000 && isString(json.msg) && json.data) {
            msg = `${json.msg}：${Object.values(json.data).join(
              ','
            )}(错误代码: ${json.ret})`;
          } else if (isObject(json.msg)) {
            msg = `请求失败：${JSON.stringify(json.msg)}(错误代码: ${
              json.ret
            })`;
          } else if (isString(json.msg)) {
            msg = `请求失败：${json.msg}(错误代码: ${json.ret})`;
          } else {
            msg = `请求失败：${json.msg}(错误代码: ${json.ret})`;
          }
        } else {
          msg = `请求失败：(错误代码: ${json.ret})`;
        }
        if (useAlert) {
          alert(msg);
        } else {
          this.msgBox.open(false, msg);
        }
      }

      return false;
    } else {
      return true;
    }
  }

  /**
   * 把文件上传的ajax调用也用Observable包装起来
   * @param url
   * @param fd
   * @returns {Observable<any>}
   */
  upload(url: string, fd: FormData): Observable<any> {
    console.log('upload', url);
    return Observable.create((observer) => {
      let $upload = null;
      $.ajax({
        url: this.apiRoot + url,
        type: 'POST',
        processData: false,
        contentType: false,
        data: fd,
        xhr: () => {
          const xhr = $.ajaxSettings.xhr();
          $upload = $(xhr.upload);
          $upload.on('progress', null, (e) => {
            observer.next({
              type: 'progress',
              data: e,
            });
          });
          return xhr;
        },
        success: (json) => {
          if ($upload) {
            $upload.off('progress');
          }
          observer.next({
            type: 'complete',
            data: json,
          });
          observer.complete();
        },
        error: (xhr, err) => {
          if ($upload) {
            console.log('upload error, remove event listener');
            $upload.off('progress');
          }
          observer.error(err);
        },
      });
    });
  }

  /**
   * 方便测试的mock接口
   * @param url
   * @param params
   * @returns {any} 返回params
   */
  mock(url: string, params: any): Observable<any> {
    return of(params);
  }

  /**
   * ajax方式把文件下载到内存中
   * @param url
   * @param params
   * @returns {Observable<any>}
   */
  download(url: string, params: any): Observable<any> {
    return this.httpClient
      .post(this.apiRoot + url, JSON.stringify(params), {
        headers: new HttpHeaders({
          'Content-Type': 'application/json; charset=utf-8',
          'X-Requested-With': 'XMLHttpRequest', // 告诉后台thinkjs这是个ajax请求，这样thinkjs对于其他错误也会用json格式返回
        }),
        responseType: 'blob',
      })
      .pipe(map((data) => ({ _body: data })));
  }

  getFileDownload(url: string, params: any): Observable<any> {
    return this.httpClient
      .post(this.apiRoot + url, JSON.stringify(params), {
        headers: new HttpHeaders({
          'Content-Type': 'application/json; charset=utf-8',
          'X-Requested-With': 'XMLHttpRequest', // 告诉后台thinkjs这是个ajax请求，这样thinkjs对于其他错误也会用json格式返回
        }),
        responseType: 'blob',
        observe: 'response',
      })
      .pipe(map((data) => ({ _body: data })));
  }

  getFileName(params) {
    let fileName;
    const contentDisposition = params.get('Content-Disposition');
    if (contentDisposition) {
      fileName = window.decodeURI(contentDisposition.split('=')[1]);
    }
    fileName = fileName.replace(/\"/g, '');
    return fileName;
  }
  /**
   * ajax方式把文件下载到内存中
   * @param url
   * @param params
   * @returns {Observable<any>}
   */
  AvengerDownload(url: string, params: any): Observable<any> {
    return this.httpClient
      .post(avengerRoot + url, JSON.stringify(params), {
        headers: new HttpHeaders({
          'Content-Type': 'application/json; charset=utf-8',
          'X-Requested-With': 'XMLHttpRequest', // 告诉后台thinkjs这是个ajax请求，这样thinkjs对于其他错误也会用json格式返回
        }),
        responseType: 'blob',
      })
      .pipe(map((data) => ({ _body: data })));
  }

  /**
   * 把blob对象变成下载文件
   * @param blob
   * @param filename
   */
  save(blob: Blob, filename: string) {
    if (window.navigator.msSaveOrOpenBlob) {
      window.navigator.msSaveOrOpenBlob(blob, filename);
    } else {
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

  /**
   * 获取assets目录下的html资源
   * @param url 例如 /assets/html/shou-ze.html
   * @returns {Observable<any>}
   */
  assets(url: string, resType?): Observable<any> {
    return this.httpClient
      .get(url, {
        responseType: !resType ? 'text' : resType,
      })
      .pipe(map((data) => ({ _body: data })));
  }

  // assetsGet(url: string, resType): Observable<any> {
  //     return this.httpClient.get(url, {
  //         responseType: resType
  //     }).pipe(map(data => ({ _body: data })));
  // }
}

export abstract class HttpClientApiBaseService extends ApiBaseService {
  constructor(
    protected router: Router,
    protected httpClient: HttpClient,
    protected msgBox: MsgBoxService,
    protected loading: LoadingService
  ) {
    super(router, httpClient, msgBox, loading);
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
    return this.httpClient.post(
      this.apiRoot + url,
      JSON.stringify(params),
      this.httpOptions
    );
  }

  postMap(url: string, params: any): Observable<any> {
    return this.postOnly(url, params).pipe(
      map((res) => {
        this.loading.close();
        return res;
      })
    );
  }

  /**
   * 把文件上传的ajax调用也用Observable包装起来
   * @param url
   * @param fd
   * @returns {Observable<any>}
   */
  upload(url: string, fd: FormData): Observable<any> {
    const { t, sign } = this.getSignInfo();
    fd.append('t', `${t}`);
    fd.append('sign', sign);
    return super.upload(url, fd);
  }

  /**
   * ajax方式把文件下载到内存中
   * @param url
   * @param params
   * @returns {Observable<any>}
   */
  download(url: string, params: any): Observable<any> {
    const { t, sign } = this.getSignInfo();
    params.t = t;
    params.sign = sign;
    return this.httpClient
      .post(this.apiRoot + url, JSON.stringify(params), {
        headers: new HttpHeaders({
          'Content-Type': 'application/json; charset=utf-8',
          'X-Requested-With': 'XMLHttpRequest', // 告诉后台thinkjs这是个ajax请求，这样thinkjs对于其他错误也会用json格式返回
        }),
        responseType: 'blob',
      })
      .pipe(map((data) => ({ _body: data })));
  }
}
