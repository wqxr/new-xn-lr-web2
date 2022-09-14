/*************************************************************************
* Copyright (c) 2017 - 2021 深圳市链融科技股份有限公司
* Shenzhen Lianrong Technology Co., Ltd.
* All rights reserved.
*
* @file：libs\products\bank-shanghai\src\lib\share\components\form\input\puhui\dragon-nzdate-picker-input.component.ts
* @summary：上海银行普惠开户-日期组件
* @version: 1.0
* *************************************************************************
* revision             author            reason             date
* 1.0                 hucongying           init          2021-08-05
***************************************************************************/
import { Component, OnInit, ElementRef, Input, ChangeDetectorRef, ViewChild } from '@angular/core';
import { FormGroup, AbstractControl } from '@angular/forms';
import { XnInputOptions } from 'libs/shared/src/lib/public/form/xn-input.options';
import { XnFormUtils } from 'libs/shared/src/lib/common/xn-form-utils';
import { DynamicForm } from 'libs/shared/src/lib/common/dynamic-form/dynamic.decorators';
import { XnService } from 'libs/shared/src/lib/services/xn.service';
import * as moment from 'moment';
import { NzDatePickerComponent } from 'ng-zorro-antd/date-picker';
import { LONG_DATE_SH } from 'libs/shared/src/lib/config/constants/index'

@Component({
  template: `
    <section>
      <nz-date-picker
        [nzDisabled]="readonly"
        nzShowToday="false"
        [(ngModel)]="valueDate"
        nzPlaceHolder="请选择"
        nzFormat="yyyyMMdd"
        [nzRenderExtraFooter]="extraTemplate"
        (ngModelChange)="onDateChanges($event)"
        (nzClear)="onDateClear($event)"
        #datePicker
      ></nz-date-picker>
      <ng-template #extraTemplate>
        <div style="text-align: center;">
        <a (click)="setLongDate()">长期有效</a>
        </div>
      </ng-template>
      <span class="xn-input-alert">{{ alert }}</span>
    </section>
  `,
  styles: [
    `
      ::ng-deep .ant-picker {
        width: 100%;
      }
    `,
  ],
})
@DynamicForm({ type: 'dragon-nzdate', formModule: 'default-input' })
export class DragonNzDateInputComponent implements OnInit {
  @Input() row: any;
  @Input() form: FormGroup;
  @ViewChild('datePicker') datePicker: NzDatePickerComponent;


  public ctrl: AbstractControl;
  public alert = '';
  public myClass = '';
  public xnOptions: XnInputOptions;
  public valueDate: any = null;

  get readonly() {
    return this.row.options?.readonly ? true : false;
  }

  constructor(
    private er: ElementRef,
    private xn: XnService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.ctrl = this.form.get(this.row.name);
    if (this.ctrl.value) {
      const date = this.ctrl.value;
      this.valueDate = this.formatValue(date);
      this.setVlue();
    }

    this.calcAlertClass();
    this.ctrl.valueChanges.subscribe((v) => {
      if (!v) {
        this.valueDate = null;
      } else {
        this.valueDate = this.formatValue(v)
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

  formatValue(date: string) {
    if (!date) {
      return null
    }
    // 年
    const year = date.substr(0, 4);
    // 月
    const mounth = date.substr(4, 2);
    // 日
    const day = date.substr(-2);
    return new Date(`${year}-${mounth}-${day}`);
  }

  /**
   * 值发生变化时触发
   * @param values
   */
  onDateChanges(e: any) {
    this.setVlue();
  }

  /**
   * 清除
   * @param e
   */
  onDateClear(e: any) {
    this.valueDate = null;
    this.setVlue();
  }

  /**
   * 设置长期有效
   */
  setLongDate() {
    this.valueDate = new Date(LONG_DATE_SH);
    this.datePicker.close();
    this.setVlue();
  }

  /**
   * 赋值操作
   */
  setVlue() {
    if (this.valueDate === null) {
      this.ctrl.setValue('');
    } else {
      const date = moment(this.valueDate).format('YYYYMMDD');
      this.ctrl.setValue(date);
    }
  }

  private calcAlertClass() {
    this.myClass = XnFormUtils.getClass(this.ctrl);
    this.alert = XnFormUtils.buildValidatorErrorString(this.ctrl);
  }
}
