/*************************************************************************
* Copyright (c) 2017 - 2021 深圳市链融科技股份有限公司
* Shenzhen Lianrong Technology Co., Ltd.
* All rights reserved.
*
* @file：libs\products\bank-shanghai\src\lib\share\components\form\input\puhui\dragon-select-search-input.component.ts
* @summary：上海银行普惠开户-可搜索下拉选择框input组件
* @version: 1.0
* *************************************************************************
* revision             author            reason             date
* 1.0                 hucongying           init          2021-08-02
***************************************************************************/
import { Component, OnInit, ElementRef, Input, ChangeDetectorRef } from '@angular/core';
import { FormGroup, AbstractControl } from '@angular/forms';
import { XnInputOptions } from 'libs/shared/src/lib/public/form/xn-input.options';
import { XnFormUtils } from 'libs/shared/src/lib/common/xn-form-utils';
import { XnUtils } from 'libs/shared/src/lib/common/xn-utils';
import { DynamicForm } from 'libs/shared/src/lib/common/dynamic-form/dynamic.decorators';
import { XnService } from 'libs/shared/src/lib/services/xn.service';

@Component({
  template: `
    <section>
      <div>
        <nz-select
          nzShowSearch
          nzAllowClear
          nzPlaceHolder="请选择"
          [nzDisabled]="readonly"
          (ngModelChange)="onChanges($event)"
          [(ngModel)]="selectedValue"
        >
          <nz-option *ngFor="let o of nzOptions" [nzLabel]="o.label" [nzValue]="o.value"></nz-option>
        </nz-select>
      </div>
      <span class="xn-input-alert">{{ alert }}</span>
    </section>
  `,
  styles: [
    `
      ::ng-deep .ant-select {
        width: 100%;
      }
      ::ng-deep .cdk-overlay-container {
        z-index: 2000;
      }
      ::ng-deep .ant-cascader-menus {
        z-index: 1060;
      }
    `,
  ],
})
@DynamicForm({ type: 'dragon-select-search', formModule: 'default-input' })
export class DragonSelectSearchInputComponent implements OnInit {
  @Input() row: any;
  @Input() form: FormGroup;

  // 下拉配置项
  // public nzOptions: SelectItemsModel[] | null = null;
  public nzOptions: any[] | null = null;
  public selectedValue: any = null;

  public ctrl: AbstractControl;
  public alert = '';
  public myClass = '';
  public xnOptions: XnInputOptions;

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
      this.selectedValue = Number(this.ctrl.value);
      this.setVlue();
    }
    this.nzOptions = XnUtils.deepClone(this.row.selectOptions);
    this.calcAlertClass();
    this.ctrl.valueChanges.subscribe((v) => {
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
   * 值发生变化时触发
   * @param value
   */
  onChanges(value: any): void {
    this.selectedValue = value;
    this.setVlue();
  }

  /**
   *
   * @param e 清除值时触发
   */
  onClear(e: any) {
    this.selectedValue = null;
    this.setVlue();
  }

  /**
   * 赋值操作
   */
  setVlue() {
    if (XnUtils.isEmptys(this.selectedValue)) {
      this.ctrl.setValue('');
    } else {
      this.ctrl.setValue(this.selectedValue);
    }
  }

  private calcAlertClass() {
    this.myClass = XnFormUtils.getClass(this.ctrl);
    this.alert = XnFormUtils.buildValidatorErrorString(this.ctrl);
  }
}
