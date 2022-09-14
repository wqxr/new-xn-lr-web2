/*************************************************************************
* Copyright (c) 2017 - 2021 深圳市链融科技股份有限公司
* Shenzhen Lianrong Technology Co., Ltd.
* All rights reserved.
*
* @file：libs\products\bank-shanghai\src\lib\share\components\form\show\puhui\dragon-cascader-search-show.component.ts
* @summary：上海银行普惠开户-行业类别三级下拉选择框show组件
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
import { NzCascaderOption } from 'ng-zorro-antd/cascader';

@Component({
  template: `
    <div>
      <nz-cascader
        [nzDisabled]="readonly"
        [nzOptions]="nzOptions"
        [(ngModel)]="values"
      >
      </nz-cascader>
    </div>
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
@DynamicForm({ type: 'dragon-cascader-search', formModule: 'dragon-show' })
export class DragonCascaderSearchShowComponent implements OnInit {
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
  ) { }

  ngOnInit() {
    if (this.row.data) {
      this.values = JSON.parse(this.row.data);
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
