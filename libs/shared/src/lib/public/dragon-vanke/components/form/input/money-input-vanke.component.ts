/*
 * Copyright(c) 2017-2019, 深圳市链融科技股份有限公司
 * Senzhen Lianrong Technology Co., Ltd.
 * All rights reserved.
 *
 * @file：libs\shared\src\lib\public\dragon-vanke\components\form\input\money-input-vanke.component.ts
 * @summary：万科发票组件-修改发票转让金额
 * @version: 1.0
 * **********************************************************************
 * revision             author            reason                date
 * 1.0                 hucongying     万科数据对接优化         2021-06-08
 * **********************************************************************
 */

import { AfterViewChecked, ChangeDetectionStrategy, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, FormGroup } from '@angular/forms';
import { DynamicForm } from 'libs/shared/src/lib/common/dynamic-form/dynamic.decorators';
import { XnFormUtils } from 'libs/shared/src/lib/common/xn-form-utils';
import { XnUtils } from 'libs/shared/src/lib/common/xn-utils';
import { XnInputOptions } from '../../../../form/xn-input.options';



@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [
    `
      .xn-money-alert {
        color: #8d4bbb;
        font-size: 12px;
      }

      .red {
        color: #e15f63;
      }
    `,
  ],
  template: `
    <div [formGroup]="form" style="display: flex;">
      <input
        #input
        class="form-control xn-input-font xn-input-border-radius"
        style="border-top-right-radius: 0;border-bottom-right-radius: 0;"
        [ngClass]="myClass"
        type="text"
        [placeholder]="row.placeholder"
        [formControlName]="row.checkerId"
        (blur)="onBlur()"
        autocomplete="off"
      />
      <div
        class="input-group-addon"
        style="width: 39px;background-color: #fff;padding: 8px;"
      >
        元
      </div>
      <ng-container *ngIf="vankeTransferMoney">
        <button style="margin-left:5px" type="button" class="btn btn-success" (click)="getVankeMoney()">填充为万科建议转让金额</button>
      </ng-container>
    </div>
    <span class="xn-money-alert" #moneyAlertRef>{{ moneyAlert }}</span>

  `,
})
@DynamicForm({ type: 'money-vanke', formModule: 'default-input' })
export class MoneyInputVnkeComponent implements AfterViewChecked, OnInit {
  @Input() row: any;
  @Input() form: FormGroup;
  @ViewChild('input', { static: true }) input: ElementRef;
  @ViewChild('moneyAlertRef', { static: true }) moneyAlertRef: ElementRef;
  public myClass = ''; // 控件样式
  public alert = ''; // 错误提示
  public moneyAlert = ''; // 金额提示
  public ctrl: AbstractControl;
  public xnOptions: XnInputOptions;
  public ctrlWith = false; // 特殊属性
  // 万科建议转让金额
  public vankeTransferMoney: number = 0;

  constructor(private er: ElementRef) {
    //
  }

  ngOnInit() {
    console.log(this.row);

    if (!this.row.placeholder) {
      this.row.placeholder = '';
    }
    this.vankeTransferMoney = Number(this.row?.vankeTransferMoney) || 0;
    this.ctrl = this.form.get(this.row.name);
    this.ctrlWith = this.row.options && this.row.options.with === 'picker';
    this.fromValue();
    this.xnOptions = new XnInputOptions(
      this.row,
      this.form,
      this.ctrl,
      this.er
    );
    this.ctrl.valueChanges.subscribe(() => {
      this.moneyFormat(); // 将拉取到的数据进行money格式化
      this.calcAlertClass();
    });
  }

  ngAfterViewChecked() {
    if (this.ctrl && !!this.ctrl.value && !this.input.nativeElement.value) {
      const a = setTimeout(() => {
        clearTimeout(a);
        this.fromValue();
        this.calcAlertClass();
        // console.log("run");
        return;
      }, 0);
    }

    if (this.ctrlWith) {
      if (this.input.nativeElement.value === '') {
        setTimeout(() => {
          if (this.input.nativeElement.value === '') {
            this.moneyAlert = '';
          }
        }, 0);
        return;
      }
      if (
        isNaN(parseInt(this.ctrl.value, 0)) &&
        this.input.nativeElement.value !== ''
      ) {
        this.input.nativeElement.value = 0;
        const ret = XnUtils.convertCurrency(this.input.nativeElement.value);
        const a = setTimeout(() => {
          this.moneyAlert = ret[1];
          clearTimeout(a);
          return;
        });
        return;
      }

      if (
        parseInt(this.ctrl.value, 0) !==
        parseInt(this.input.nativeElement.value.replace(/,/g, ''), 0)
      ) {
        const a = setTimeout(() => {
          clearTimeout(a);
          this.fromValue();
          this.calcAlertClass();
          return;
        }, 0);
      }
    }
  }

  /**
   *  填充为万科建议转让金额
   */
  getVankeMoney() {
    if (this.vankeTransferMoney > 0) {
      this.input.nativeElement.value = this.vankeTransferMoney;
      this.moneyFormat(); // 将拉取到的数据进行money格式化
      this.calcAlertClass();
      this.toValue();
    }
  }

  /**
   *  失去焦点时处理金额值
   */
  public onBlur(): void {
    this.toValue();
  }

  /**
   *  提示判断
   */
  private calcAlertClass(): void {
    this.input.nativeElement.disabled = this.ctrl.disabled;
    this.myClass = XnFormUtils.getClass(this.ctrl);
    this.alert = XnFormUtils.buildValidatorErrorString(this.ctrl);
    if (this.input.nativeElement.value) {
      const ret = XnUtils.convertCurrency(this.input.nativeElement.value);
      this.moneyAlert = ret[1];
      if (!ret[0]) {
        $(this.moneyAlertRef.nativeElement).addClass('red');
      } else {
        $(this.moneyAlertRef.nativeElement).removeClass('red');
      }
    }
  }

  /**
   *  初始值
   */
  private fromValue() {
    if (
      !this.input.nativeElement.value &&
      this.input.nativeElement.value !== ''
    ) {
      return;
    }
    this.input.nativeElement.value = this.ctrl.value;
    this.moneyFormat(); // 将拉取到的数据进行money格式化
    this.calcAlertClass();
    this.toValue();
  }

  /**
   *  格式化数据
   */
  private toValue() {
    if (!this.input.nativeElement.value) {
      this.ctrl.setValue('');
      this.moneyAlert = '';
    } else {
      const tempValue = this.input.nativeElement.value;
      this.ctrl.setValue(tempValue.toString());
    }
    this.ctrl.markAsTouched();
    this.calcAlertClass();
  }

  /**
   *  金额显示格式化，加千分位
   */
  private moneyFormat() {
    this.input.nativeElement.value = XnUtils.formatMoney(
      this.input.nativeElement.value
    );
  }
}
