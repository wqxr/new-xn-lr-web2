/*************************************************************************
* Copyright (c) 2017 - 2021 深圳市链融科技股份有限公司
* Shenzhen Lianrong Technology Co., Ltd.
* All rights reserved.
*
* @file：libs\products\bank-shanghai\src\lib\share\components\form\input\puhui\phone-code-input.component.ts
* @summary：获取手机验证码
* @version: 1.0
* *************************************************************************
* revision             author            reason             date
* 1.0                 hucongying           init          2021-07-27
***************************************************************************/
import { Component, OnInit, ElementRef, Input, ChangeDetectorRef } from '@angular/core';
import { FormGroup, AbstractControl } from '@angular/forms';
import { XnInputOptions } from 'libs/shared/src/lib/public/form/xn-input.options';
import { XnFormUtils } from 'libs/shared/src/lib/common/xn-form-utils';
import { DynamicForm } from 'libs/shared/src/lib/common/dynamic-form/dynamic.decorators';
import { XnService } from 'libs/shared/src/lib/services/xn.service';

@Component({
  template: `
    <div style="display: flex;">
      <input
        class="form-control xn-input-font xn-input-border-radius"
        type="text"
        maxlength="11"
        [readonly]="row.options?.readonly"
        placeholder="请输入"
        autocomplete="off"
        [(ngModel)]="ctrlValue"
        (input)="onInputChange($event)"
      />
      <button type="button" class="btn btn-primary" [disabled]="showCodeBtn" (click)="sendCode()">
        {{ btnText }}
      </button>
    </div>
    <span class="xn-input-alert">{{ alert }}</span>
  `,
})
@DynamicForm({ type: 'code-phone-input', formModule: 'dragon-input' })
export class CodePhoneInputComponent implements OnInit {
  @Input() row: any;
  @Input() form: FormGroup;

  // 按钮文案
  public btnText: string = '获取验证码';
  public alert = '';
  public ctrl: AbstractControl;
  public ctrlValue: string = '';
  public showCodeBtn: boolean = true;
  public time: number = 0;
  public timeId: any = null;
  public xnOptions: XnInputOptions;

  constructor(
    private er: ElementRef,
    private xn: XnService,
    private cdr: ChangeDetectorRef) { }

  ngOnInit() {
    this.ctrl = this.form.get(this.row.name);
    // 设置初始值
    if (this.ctrl.value) {
      this.ctrlValue = this.ctrl.value;
      this.showCodeBtn = this.row.options.readonly ? true : false;
    }
    this.calcAlertClass();
    this.ctrl.valueChanges.subscribe((v) => {
      if (!v) {
        this.ctrlValue = '';
      } else {
        this.ctrlValue = v;
      }
      this.ctrl.markAsTouched();
      this.calcAlertClass();
    });
    this.xnOptions = new XnInputOptions(
      this.row,
      this.form,
      this.ctrl,
      this.er
    );
  }

  /**
   * onInputChange
   * @param e
   */
  onInputChange(e: any) {
    const re: RegExp = /^[1][0-9]{10}$/;
    const ok = re.test(e.target.value);
    if (ok) {
      this.showCodeBtn = false;
      this.alert = '';
      this.ctrl.setValue(e.target.value)
    } else {
      this.showCodeBtn = true;
      this.alert = '请输入合法的手机号码';
      this.ctrl.setValue('');
    }
  }

  /**
   * 获取验证码
   */
  sendCode() {
    if (!this.ctrlValue) {
      this.alert = '请输入合法的手机号码';
      return
    } else {
      this.fetchCodeData();
      // 60s倒计时
      this.time = 60;
      this.timeId = setInterval(() => {
        --this.time;
        if (this.time <= 0) {
          clearInterval(this.timeId);
          this.timeId = null;
          this.btnText = `获取验证码`;
          this.showCodeBtn = false;
        } else {
          this.showCodeBtn = true;
          this.btnText = `${this.time}秒后可重发`;
        }
      }, 1000);
    }
  }

  /**
   * 发送手机验证码
   */
  fetchCodeData() {
    this.xn.dragon.post('/shanghai_bank/sh_general/sendSmsCode', { mobile: this.ctrlValue }).subscribe(res => { })
  }

  private calcAlertClass() {
    this.alert = XnFormUtils.buildValidatorErrorString(this.ctrl);
  }

}
