/*************************************************************************
* Copyright (c) 2017 - 2021 深圳市链融科技股份有限公司
* Shenzhen Lianrong Technology Co., Ltd.
* All rights reserved.
*
* @file：libs\products\bank-shanghai\src\lib\share\components\form\input\puhui\dragon-cascader-search-input.component.ts
* @summary：上海银行普惠开户-行业类别三级下拉选择框input组件
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
import { NzCascaderOption } from 'ng-zorro-antd/cascader';

@Component({
  template: `
    <section>
      <div>
        <nz-cascader
          [nzDisabled]="readonly"
          [nzOptions]="nzOptions"
          [(ngModel)]="values"
          [nzShowSearch]="true"
          (ngModelChange)="onChanges($event)"
          (nzClear)="onClear($event)"
        >
        </nz-cascader>
      </div>
      <span class="xn-input-alert">{{ alert }}</span>
    </section>
  `,
  styles: [
    `
      .change-options {
        display: inline-block;
        font-size: 12px;
        margin-top: 8px;
      }
      ::ng-deep .ant-cascader-picker {
        width: 100%;
      }
    `,
  ],
})
@DynamicForm({ type: 'dragon-cascader-search', formModule: 'default-input' })
export class DragonCascaderSearchInputComponent implements OnInit {
  @Input() row: any;
  @Input() form: FormGroup;

  // 下拉配置项
  public nzOptions: NzCascaderOption[] | null = null;
  public values: string[] | null = null;

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
  ) {}

  ngOnInit() {
    this.ctrl = this.form.get(this.row.name);
    if (this.ctrl.value) {
      this.values = JSON.parse(this.ctrl.value)
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
   * @param values
   */
  onChanges(values: string[]): void {
    this.setVlue();
  }

  /**
   *
   * @param e 清除值时触发
   */
  onClear(e: any) {
    this.values = [];
    this.setVlue();
  }

  /**
   * 赋值操作
   */
  setVlue() {
    if (XnUtils.isEmptys(this.values)) {
      this.ctrl.setValue('');
    } else {
      this.ctrl.setValue(JSON.stringify(this.values));
    }
  }

  private calcAlertClass() {
    this.myClass = XnFormUtils.getClass(this.ctrl);
    this.alert = XnFormUtils.buildValidatorErrorString(this.ctrl);
  }
}
