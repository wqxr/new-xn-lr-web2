/*************************************************************************
* Copyright (c) 2017 - 2021 深圳市链融科技股份有限公司
* Shenzhen Lianrong Technology Co., Ltd.
* All rights reserved.
*
* @file：libs\products\bank-shanghai\src\lib\share\components\form\input\puhui\dragon-select-search-input.component.ts
* @summary：上海银行普惠开户-可搜索下拉选择框show组件
* @version: 1.0
* *************************************************************************
* revision             author            reason             date
* 1.0                 hucongying           init          2021-08-02
***************************************************************************/
import { Component, OnInit, ElementRef, Input, ChangeDetectorRef } from '@angular/core';
import { FormGroup, AbstractControl } from '@angular/forms';
import { XnInputOptions } from 'libs/shared/src/lib/public/form/xn-input.options';
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
    `,
  ],
})
@DynamicForm({ type: 'dragon-select-search', formModule: 'default-show' })
export class DragonSelectSearchShowComponent implements OnInit {
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
    if (this.row.data) {
      this.selectedValue = Number(this.row.data);
    }
    this.nzOptions = XnUtils.deepClone(this.row.selectOptions);
    this.xnOptions = new XnInputOptions(
      this.row,
      this.form,
      this.ctrl,
      this.er
    );
  }

}
