import { Injectable } from '@angular/core';
import { isNullOrUndefined } from 'util';
import { ApiService } from './api.service';
import { Observable, of, Subject } from 'rxjs';
import { Router } from '@angular/router';
import { XnUtils } from '../common/xn-utils';
import { PlatformLocation } from '@angular/common';
import { NavService } from './nav.service';
import { BusinessMode } from '../common/enums';
import { CustomReuseStrategy } from '../reuse-strategy';
import { LocalStorageService } from './local-storage.service';
import { map } from 'rxjs/operators';
import { WatermarkService } from '@lr/ngx-shared';

import * as cookie from 'cookie_js';
import { MsgBoxService } from './msg-box.service';
import { DragonApiService } from './api-extra.service';
import { xnZhiyaPipe } from '../public/pipe/xn-zhiya.pipe';

@Injectable({ providedIn: 'root' })
export class UserService {

  private logined = false;
  private cache: any = {} as any;
  private redirectUrlWhenLogin: string;  // 登陆后跳转的url

  // 用基于服务的订阅来更新todoCount
  private todoCount = new Subject<object>();
  todoCount$ = this.todoCount.asObservable();

  // 用基于服务的订阅来更新系统消息todoSysMsg
  private todoSysMsg = new Subject<object>();
  todoSysMsg$ = this.todoSysMsg.asObservable();

  // 用基于服务的订阅来更新上银待提现泪飚数量todoDraw
  private todoDraw = new Subject<object>();
  todoDraw$ = this.todoDraw.asObservable();

  private authing = false;
  private observers: any[] = [];

  private states: any[] = [];

  constructor(private api: ApiService, private dragon: DragonApiService,
    private router: Router,
    private localStorage: LocalStorageService,
    private watermarkService: WatermarkService,
    public location: PlatformLocation,
    private nav: NavService,
    private msgBox: MsgBoxService,) {
    location.onPopState(() => {
      this.popUrl();
    });
  }

  /**
   * 检查是否登录，如果未登陆且有cookie就auth一下
   */
  checkLogin(): Observable<boolean> {
    if (this.logined) {
      return of(true);
    }

    // 当前有在auth
    if (this.authing) {
      return Observable.create(observer => {
        this.observers.push(observer);
      });
    }

    if (!this.hasCookie()) {
      return of(false);
    }

    // 去auth请求
    this.authing = true;
    this.api.postMapCatch('/user/auth', {}).subscribe(json => {
      this.authing = false;
      let logined = false;
      if (json.ret === 0) {
        this.initLoginRes(json.data);
        logined = true;
      }

      for (const ob of this.observers) {
        ob.next(logined);
        ob.complete();
      }
      this.observers = [];
    });

    return Observable.create(observer => {
      this.observers.push(observer);
    });
  }

  /**
   * 更新session
   */
  updateSession(): Observable<boolean> {
    // if (this.logined) {
    //     return of(true);
    // }
    // 去auth请求
    this.authing = true;
    this.api.postMapCatch('/user/auth', {}).subscribe(json => {
      this.authing = false;
      let logined = false;
      if (json.ret === 0) {
        this.initLoginRes(json.data);
        logined = true;
      }

      for (const ob of this.observers) {
        ob.next(logined);
        ob.complete();
      }
      this.observers = [];
    });
    return Observable.create(observer => {
      this.observers.push(observer);
    });
  }

  /**
   * 检查是否登录，如果当前在auth，就等auth回来后再返回
   * @returns {boolean}
   */
  isLogin(): Observable<boolean> {
    if (this.logined) {
      return of(true);
    }

    // 当前有在auth
    if (this.authing) {
      return Observable.create(observer => {
        this.observers.push(observer);
      });
    }

    return of(false);
  }

  isLogined(): boolean {
    if (!this.logined) {
      this.logined = this.hasCookie() && this.hasSession();
    }
    return this.logined;
  }

  hasCookie(): boolean {
    return !XnUtils.isEmpty(cookie.get('skey'));
  }

  hasSession(): boolean {
    return !XnUtils.isEmpty(window.sessionStorage.getItem('userId'));
  }

  login(account: string, code: string, password?: string, systemType?: number): Observable<any> {
    // systemType这个参数   1表示链融系统，2表示恒泽系统
    // if (!password) {
    return this.api.postMap('/user/login', {
      account,
      code,
      password,
      systemType
    }).pipe(map(json => {
      if (json.ret === 10112 || json.ret === 30102) {
        return json;
      } else if (json.ret === 0) {
        if (!json.data.multiOrgs) {
          // 这里把登录后的信息保存起来
          this.initLoginRes(json.data);
        }
      } else {
        this.msgBox.open(false, json.msg);
        return;
      }
      return json;
    }));
    // } else {
    //     return this.api.postMap('/user/login', {
    //         account,
    //         code,
    //         password
    //     }).pipe(map(json => {
    //         if (json.ret === 10112) {
    //             return json;
    //         } else if (json.ret === 0) {
    //             if (!json.data.multiOrgs) {
    //                 // 这里把登录后的信息保存起来
    //                 this.initLoginRes(json.data);
    //             }
    //         } else {
    //             this.msgBox.open(false, json.msg);
    //             return;
    //         }

    //         return json;
    //     }));
    // }

  }

  oaLogin(ltpa: string): Observable<any> {
    return this.api.post('/user/oa_login', {
      ltpa
    }).pipe(map(json => {
      if (!json.data.multiOrgs) {
        // 这里把登录后的信息保存起来
        this.initLoginRes(json.data);
      }

      return json;
    }));
  }

  tmpLogin(appId: string, orgType: string, tmpToken: string, factorAppId: string, agencyType: number, modelId: string): Observable<any> {
    return this.api.post('/user/tmp_login', {
      appId,
      orgType,
      tmpToken,
      factorAppId,
      agencyType,
      modelId,
    }).pipe(map(json => {
      this.initLoginRes(json.data);
      return json;
    }));
  }

  logout(redirectToLogin: boolean = true) {
    this.logoutNoRedirect();
    this.nav.removeNavIndex();
    this.deleteCaches();
    if (redirectToLogin) {
      this.router.navigate(['/login']);
    }
    // this.router.navigate(['/login']);
  }

  logoutNoRedirect() {
    this.logined = false;

    (this.router.routeReuseStrategy as CustomReuseStrategy).clear();
    this.watermarkService.removeWatermark();

    cookie.set('skey', '', { path: '/' });

    window.sessionStorage.clear();
  }

  /**
   * 去认证，有错误时直接处理了
   * @returns {Observable<any>}
   */
  auth(): Observable<any> {
    return this.api.post('/user/auth', {})
      .pipe(map(json => {
        // 这里把登录后的信息保存起来
        this.initLoginRes(json.data);
        return json;
      }));
  }

  /**
   * 去认证，但不对结果做处理
   * @returns {Observable<any>}
   */
  authRaw(): Observable<any> {
    return this.api.postMapCatch('/user/auth', {});
  }

  private initLoginRes(res) {
    this.cache = res;
    window.sessionStorage.setItem('userId', res.userId);
    window.sessionStorage.setItem('userName', res.userName);
    window.sessionStorage.setItem('appId', res.appId.toString());
    window.sessionStorage.setItem('roles', JSON.stringify(res.roles));
    window.sessionStorage.setItem('orgName', res.orgName);
    window.sessionStorage.setItem('orgType', res.orgType);
    window.sessionStorage.setItem('status', res.status);
    window.sessionStorage.setItem('appNature', res.appNature);
    window.sessionStorage.setItem('isAdmin', res.isAdmin ? 'true' : 'false');
    window.sessionStorage.setItem('isPlatformAdmin', res.isPlatformAdmin ? 'true' : 'false');
    window.sessionStorage.setItem('env', res.env);
    window.sessionStorage.setItem('isInvoice', res.isInvoice);
    // 万科abs type: 1, // 1=地产类 2=供应链类 subType: 1, // 1=集团公司 2=城市公司 3=项目公司
    window.sessionStorage.setItem('appType', JSON.stringify(res.appType));
    window.sessionStorage.setItem('customFlowIds', JSON.stringify(res.customFlowIds));
    // [financing6 万科， financing14金地] 金地abs  公司性质 xxxx_1 集团公司 ，xxxxx_3 项目公司
    window.sessionStorage.setItem('enterpriseType', JSON.stringify(res.enterpriseType));
    window.sessionStorage.setItem('clientkey', JSON.stringify(res.clientkey));
    // 中介机构信息
    window.sessionStorage.setItem('factorAppId', res.factorAppId);
    window.sessionStorage.setItem('agencyType', res.agencyType);
    window.sessionStorage.setItem('menuRoot', JSON.stringify(res.menuRoot));
    window.sessionStorage.setItem('accountId', res.accountId);
    // systemType这个参数   1表示链融系统，2表示恒泽系统
    window.sessionStorage.setItem('systemType', res.systemType);
  }

  get systemType(): string {
    if (isNullOrUndefined(this.cache.systemType)) {
      this.cache.systemType = window.sessionStorage.getItem('systemType') || 1;
    }
    return this.cache.systemType;
  }

  get accountId(): string {
    if (isNullOrUndefined(this.cache.accountId)) {
      this.cache.accountId = window.sessionStorage.getItem('accountId') || '';
    }
    return this.cache.accountId;
  }

  get userId(): string {
    if (isNullOrUndefined(this.cache.userId)) {
      this.cache.userId = window.sessionStorage.getItem('userId') || '';
    }
    return this.cache.userId;
  }

  get menus() {
    if (isNullOrUndefined(this.cache.menuRoot)) {
      this.cache.menuRoot = JSON.parse(window.sessionStorage.getItem('menuRoot') || '{}');
    }
    return this.cache.menuRoot;
  }

  get orgs() {
    if (isNullOrUndefined(this.cache.orgs)) {
      this.cache.orgs = JSON.parse(window.sessionStorage.getItem('orgs') || '{}');
    }
    return this.cache.orgs;
  }
  get userName(): string {
    if (isNullOrUndefined(this.cache.userName)) {
      this.cache.userName = window.sessionStorage.getItem('userName') || '';
    }
    return this.cache.userName;
  }

  get appId(): string {
    if (isNullOrUndefined(this.cache.appId)) {
      this.cache.appId = window.sessionStorage.getItem('appId') || '';
    }
    return this.cache.appId;
  }

  get roles(): any {
    if (isNullOrUndefined(this.cache.roles2)) {
      this.cache.roles2 = JSON.parse(window.sessionStorage.getItem('roles')) || [];
    }
    return this.cache.roles2;
  }

  get orgName(): string {
    if (isNullOrUndefined(this.cache.orgName)) {
      this.cache.orgName = window.sessionStorage.getItem('orgName') || '';
    }
    return this.cache.orgName;
  }

  get orgType(): number {
    if (isNullOrUndefined(this.cache.orgType)) {
      this.cache.orgType = parseInt(window.sessionStorage.getItem('orgType') || '', 0);
    }
    return this.cache.orgType;
  }

  get status(): number {
    if (isNullOrUndefined(this.cache.status)) {
      this.cache.status = parseInt(window.sessionStorage.getItem('status'), 0);
    }
    return this.cache.status;
  }

  get appNature(): number {
    if (isNullOrUndefined(this.cache.nature)) {
      this.cache.nature = parseInt(window.sessionStorage.getItem('appNature'), 0);
    }
    return this.cache.nature;
  }

  get isAdmin(): boolean {
    if (isNullOrUndefined(this.cache.isAdmin)) {
      this.cache.isAdmin = window.sessionStorage.getItem('isAdmin') === 'true';
    }
    return this.cache.isAdmin;
  }

  get isPlatformAdmin(): boolean {
    if (isNullOrUndefined(this.cache.isPlatformAdmin)) {
      this.cache.isPlatformAdmin = window.sessionStorage.getItem('isPlatformAdmin') === 'true';
    }
    return this.cache.isPlatformAdmin;
  }

  get env(): string {
    if (isNullOrUndefined(this.cache.env)) {
      this.cache.env = window.sessionStorage.getItem('env');
    }
    return this.cache.env;
  }

  get isInvoice(): string {
    if (isNullOrUndefined(this.cache.isInvoice)) {
      this.cache.isInvoice = window.sessionStorage.getItem('isInvoice');
    }
    return this.cache.isInvoice;
  }

  get appType(): any {
    if (isNullOrUndefined(this.cache.appType)) {
      this.cache.appType = JSON.parse(window.sessionStorage.getItem('appType')) || {};
    }
    return this.cache.appType;
  }

  get customFlowIds(): any[] {
    if (isNullOrUndefined(this.cache.customFlowIds2)) {
      this.cache.customFlowIds2 = JSON.parse(window.sessionStorage.getItem('customFlowIds')) || [];
    }
    return this.cache.customFlowIds2;
  }

  // 获取金地abs  企业性质
  get enterpriseType(): any[] {
    if (isNullOrUndefined(this.cache.enterpriseType)) {
      this.cache.enterpriseType = JSON.parse(window.sessionStorage.getItem('enterpriseType')) || [];
    }
    return this.cache.enterpriseType;
  }

  // 获取中介机构类型
  get agencyType(): number {
    if (isNullOrUndefined(this.cache.agencyType)) {
      this.cache.agencyType = parseInt(window.sessionStorage.getItem('agencyType') || '', 0);
    }
    return this.cache.agencyType;
  }
  /**
   * 是否雅居乐-星顺模式
   */
  get isNewAgile(): boolean {
    return this.modelId === `${BusinessMode.Yjl}`;
  }

  get modelId() {
    return window.sessionStorage.getItem('modelId');
  }

  // =================================================================================
  // 导航相关

  setRedirectUrl(url: string): void {
    this.redirectUrlWhenLogin = url;
  }

  redirectWhenLogin(): void {
    if (this.redirectUrlWhenLogin === undefined) {
      this.router.navigate(['/login']);
      return;
    }
    if (!XnUtils.isEmpty(this.redirectUrlWhenLogin)) {
      this.router.navigate([this.redirectUrlWhenLogin]);
      return;
    }

    this.redirectConsole();
  }

  redirectConsole(): void {
    const res = [].concat(this.cache.roles).filter(item => {
      return !(item === undefined || item === null || item === '');
    });
    if (this.cache.orgType === 2) {
      // 核心企业 orgType=2 没有菜单权限
      this.msgBox.open(false, '未找到相应菜单权限，无法登录。请联系平台管理员处理', () => {
        return this.logoutNoRedirect();
      });
      return;
    }
    // 有菜单配置 默认进入菜单配置的第一个菜单
    let homeUrl = '/home/sys-messages';
    const menuRoot = JSON.parse(window.sessionStorage.getItem('menuRoot') || '{}');
    homeUrl = Object.keys(menuRoot).length === 0 || menuRoot.subMenuItem.length === 0 ?
      '/home/sys-messages' : menuRoot.subMenuItem[0].subMenuItem[0].url;
    const productIdent = Object.keys(menuRoot).length === 0 || menuRoot.subMenuItem.length === 0 ?
      '' : menuRoot.subMenuItem[0].subMenuItem[0].productIdent;
    if (!homeUrl) {
      homeUrl = menuRoot.subMenuItem[0].subMenuItem[0].subMenuItem[0].url;
    }
    if (this.isNewAgile) {
      // 雅居乐-星顺模式
      // this.router.navigate(['/home/sys-messages']);
      this.router.navigate([`${homeUrl}`]);
      return;
    }
    // 如果是77号平台直接跳转至ABS首页
    if (this.cache.orgType === 77) {
      this.router.navigate(['/console/capital-pool']);
    } else if (this.cache.orgType === 3 && res.length === 1 && res[0] === 'checkerLimit') {
      // 保理商角色当且仅当为查看权限
      this.router.navigate(['/console/main-list/list']);
    } else {
      if(productIdent){
        this.router.navigate([`${homeUrl}/${productIdent}`]);
      }else{
        this.router.navigate([`${homeUrl}`]);
      }
    }
  }

  navigateBack(): void {
    history.go(-1);
  }

  pushUrl(url: string): void {
    if (this.states.length > 0) {
      const n = this.states[this.states.length - 1];
      if (n.url === url) {
        // console.log('pushUrl skip by same', n.url);
        return;
      } else {
        n.pop = false; // 前一个url的pop固定设置为false
      }
    }

    // console.log('pushUrl', url);
    this.states.push({
      url,
      pop: false, // 代表当前url是后退回来的
      data: null
    });

    // 最多只保留5层
    if (this.states.length > 5) {
      this.states = this.states.slice(-5);
    }
  }

  popUrl(): void {
    const d = this.states.pop();
    // console.log('popUrl', d.url, d.pop);
    if (this.states.length > 0) {
      const n = this.states[this.states.length - 1];
      n.pop = true;
      // console.log('popUrl set true', n.url, n.pop);
    }
  }

  setUrlData(url: string, data: any): void {
    if (this.states.length > 0) {
      const n = this.states[this.states.length - 1];
      if (n.url === url) {
        n.data = data;
        // console.log('setUrlData', n.url, n.pop, n.data);
      } else {
        // console.log('setUrlData but url not match', n.url, url);
      }
    }
  }

  getUrlData(url: string): any {
    if (this.states.length > 0) {
      const n = this.states[this.states.length - 1];
      if (n.url === url) {
        // console.log('getUrlData', n.url, n.pop, n.data);
        const ret = {
          url: n.url,
          pop: n.pop,
          data: n.data
        };
        n.pop = false; // 获取一次后就改为false
        return ret;
      } else {
        // console.log('getUrlData but url not match', n.url, url);
        return null;
      }
    } else {
      // console.log('getUrlData empty');
      return null;
    }
  }

  // =================================================================================
  // todo相关

  getTodoCount() {
    return this.api.post('/user/todo_count', {}).subscribe((json) => {
      this.updateTodoCount(json.data);
    });
  }

  updateTodoCount(data) {
    this.todoCount.next(data);
  }
  // =================================================================================
  // todoSysMsg相关

  geTodoSysMsg() {
    return this.api.post('/message/get_msg?method=get', { status: 0 }).subscribe((json) => {
      this.updateTodoSysMsg(json.data.recordsTotal);
    });
  }

  updateTodoSysMsg(data) {
    this.todoSysMsg.next(data);
  }

  /**
   * @description: 上银--供应商提现列表数量
   * @param {*}
   * @return {*}
   */
  getShDrawTodoCount() {
    return this.dragon.post('/sh_trade/withdrawal_count', {}).subscribe((json) => {
      const count = json.data || 0;
      this.updateTodoDraw(json.data);
    });
  }

  updateTodoDraw(data) {
    this.todoDraw.next(data);
  }

  // =================================================================================
  // 短信验证码相关

  sendSmsCode2(type: number) {
    this.api.post('/sms/send2', {
      type
    }).subscribe(json => {
    });
  }

  sendSmsCode(mobile: string, type: number) {
    this.api.post('/sms/send', {
      mobile,
      type
    }).subscribe(json => {
    });
  }

  deleteCaches() { // 删除缓存
    if (!this.cache) {
      return;
    }
    for (const i in this.cache) {
      if (this.cache.hasOwnProperty(i)) {
        delete this.cache[i];
      }
    }

    this.localStorage.clean();
  }
}
