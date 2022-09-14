/*************************************************************************
 * Copyright (c) 2017 - 2020 深圳市链融科技股份有限公司
 * Shenzhen Lianrong Technology Co., Ltd.
 * All rights reserved.
 *
 * @file：xn-lr-web\apps\src\app\pages\portal\login\login.component.ts
 * @summary：init login.component.ts
 * @version: 1.0
 * *************************************************************************
 * revision             author            reason             date
 * 1.0                  zigui             init             2020-11-19
 ***************************************************************************/
import { AfterViewInit, Component, OnInit, ViewContainerRef, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import * as md5 from 'js-md5';
import { XnService } from 'libs/shared/src/lib/services/xn.service';
import { switchMap } from 'rxjs/operators';
import { of } from 'rxjs';
import XnLoginSwitchUtils from 'libs/shared/src/lib/common/xn-login-switch';
import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { NzMessageService } from 'ng-zorro-antd/message';
import { XnModalUtils } from 'libs/shared/src/lib/common/xn-modal-utils';
import { CfcaLoginPreReadComponent } from 'libs/shared/src/lib/public/modal/login-pre-read-modal.component';
import { PointService } from 'libs/shared/src/lib/services/point.service';
import { ViewButtonType } from 'libs/shared/src/lib/config/enum';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.less'],
})
export class LoginComponent implements OnInit, AfterViewInit {
  confirmModal?: NzModalRef;
  account: string = '';
  code: string = '';
  codeTip: string = '获取验证码';
  userAgent: any = null;
  isNeedPsw: boolean = false;  // 是否显示密码框
  password: string = '';
  private codeTime: number = 60;
  private timer: any = null;
  style: any = {};
  loading: boolean = false;
  accountMexLen = 12;
  codeMexLen = 7;
  @ViewChild('getpassword', { static: true }) getpassword: ElementRef;
  get isWebKit() {
    return this.userAgent.indexOf('applewebkit/') > 0 ? 'on' : 'off';
  }
  constructor(
    private pointService: PointService,
    private router: Router,
    private xn: XnService,
    private vcr: ViewContainerRef,
    private $modal: NzModalService,
    private $message: NzMessageService) { }
  onPaste(type) {
    // if (type === 'account' && this.account.length === 11) {
    //   return ;
    // }
    // if (type === 'code' && this.code.length === 6) {
    //   return ;
    // }
    if (type === 'account') {
      this.accountMexLen = 12;
    } else if (type === 'code') {
      this.codeMexLen = 7;
    }
    setTimeout(() => {
      this.onKeyUp(type);
    }, 0);
  }
  getSms(event) {
    if ((event.keyCode || event.witch) === 13) { // 删除键
      this.onLogin();
    }
  }
  getfocus(event) {
    if ((event.keyCode || event.witch) === 13) { // 聚焦
      this.getpassword.nativeElement.focus();
    }
  }
  // 登录
  onLogin(): void {
    if (this.loading) { return; }
    const account = this.account.trim();
    const code = this.code.trim();
    let password = this.password.trim();
    if (!account && !code) {
      this.$message.error('手机号码、验证码不能为空');
      return;
    }
    if (!account) {
      // 手机号码不能为空
      this.$message.error('手机号码不能为空');
      return;
    }
    if (!code) {
      // 短信验证码不能为空
      this.$message.error('短信验证码不能为空');
      return;
    }
    if (account && account.length !== 11) {
      this.$message.error('请输入11位手机号码');
      return;
    }
    if (this.isNeedPsw && !password) {
      // 密码不能为空
      this.$message.error('密码不能为空');
      return;
    } else {
      password = !password ? password : md5(password).toUpperCase();
    }
    const afterCompleted = {
      next: (value) => {
        this.pointService.setPoint({itemName: ViewButtonType.UserLogin})
        this.loading = false;
        if (!value && value !== 2) {
          return;
        } else if (!!value && value === 2) {
          XnModalUtils.openInViewContainer(this.xn, this.vcr, CfcaLoginPreReadComponent, {}).subscribe(x => {
            if (x && x.action === 'ok') {
              this.xn.user.redirectConsole();
            }
          });
        }

      },
      complete: () => {
        this.loading = false;
      }
    };
    this.loading = true;
    this.xn.user.login(account, code, password)
      .pipe(switchMap(json => {
        this.loading = false;
        if (json.ret === 10112) {
          this.xn.msgBox.open(false, json.msg, () => {
            this.isNeedPsw = true;
          });
          return of(null);
        } else if (json.ret === 30102) {
          // 验证码错误， 重置定时器
          this.$modal.error({
            nzTitle: '提示',
            nzContent: '验证码错误',
            nzOnOk: () => {
              this.codeTime = 60;
              this.codeTip = `获取验证码`;
              clearInterval(this.timer);
              this.timer = null;
            },
          });
          return of(null);
        } else {
          return XnLoginSwitchUtils.switchModal(this.xn, this.vcr, json.data);
        }
      })).subscribe(afterCompleted);
  }
  // 获取验证码
  getCode(): void {
    // 验证account
    this.getpassword.nativeElement.focus();
    const account = this.account.trim();
    if (!account) {
      // 手机号码不能为空
      this.$message.error('手机号码不能为空');
      return;
    }
    if (account && account.length !== 11) {
      this.$message.error('请输入11位手机号码');
      return;
    }
    if (this.timer) {
      return;
    }
    // 发送事件
    this.xn.user.sendSmsCode(this.account, 1);
    // 倒计时
    this.timer = setInterval(() => {
      this.codeTip = `重新发送(${this.codeTime}s)`;
      --this.codeTime;
      if (this.codeTime < 0) {
        this.codeTime = 60;
        this.codeTip = `获取验证码`;
        clearInterval(this.timer);
        this.timer = null;
      }
    }, 1000);
  }
  onKeyUp(type) {
    if (type === 'account') {
      this.accountMexLen = 11;
      this.account = this.account.replace(/\D/g, '');
    } else if (type === 'code') {
      this.codeMexLen = 6;
      this.code = this.code.replace(/\D/g, '');
    }
  }
  ngOnInit(): void {
    this.userAgent = navigator.userAgent.toLowerCase();
    this.xn.api.post('/user/logout', {}).subscribe();
    this.xn.user.logoutNoRedirect();
  }
  ngAfterViewInit() {
    this.style = { backgroundImage: `url(assets/images/bg/bg-login-bg.png)` };
  }
  navToHome(): void {
    this.router.navigate(['/portal/home']);
  }
}
