/*************************************************************************
 * Copyright (c) 2017 - 2021 深圳市链融科技股份有限公司
 * Shenzhen Lianrong Technology Co., Ltd.
 * All rights reserved.
 *
 * @file：libs\products\account-system\src\lib\shared\components\formly-form\cascader-input\cascader-input.component.ts
 * @summary：cascader组件
 * @version: 1.0
 * *************************************************************************
 * revision             author            reason             date
 * 1.0                 hucongying          init           2021-10-28
 ***************************************************************************/
import {
  Component,
  ChangeDetectionStrategy,
  ViewEncapsulation,
} from '@angular/core';
import { FieldType } from '@ngx-formly/core';
import { NzCascaderOption } from 'ng-zorro-antd/cascader';

@Component({
  selector: 'formly-field-nz-cascader',
  template: `
    <nz-cascader
      [formControl]="formControl"
      [formlyAttributes]="field"
      [nzAllowClear]="to.nzAllowClear"
      [nzChangeOnSelect]="to.nzChangeOnSelect"
      [nzDisabled]="to.nzDisabled"
      [nzExpandTrigger]="to.nzExpandTrigger"
      [nzPlaceHolder]="to.nzPlaceHolder"
      [nzShowArrow]="to.nzShowArrow"
      [nzShowInput]="to.nzShowInput"
      [nzShowSearch]="to.nzShowSearch"
      [nzSize]="to.nzSize"
      [nzOptions]="to.options"
      [nzChangeOn]="to.nzChangeOn"
      (nzClear)="to.nzClear"
      [nzLoadData]="to.loadData"
      (nzSelectionChange)="to.nzSelectionChange"
    ></nz-cascader>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class XnFormlyFieldCascader extends FieldType {
  defaultOptions = {
    templateOptions: {
      options: [],
      nzAllowClear: false,
      nzChangeOnSelect: false,
      nzDisabled: false,
      nzExpandTrigger: 'click',
      nzPlaceHolder: null,
      nzShowArrow: true,
      nzShowInput: true,
      nzShowSearch: false,
      nzSize: 'default',
      nzChangeOn: (option: any, index: number) => { },
      nzClear: () => { },
      nzSelectionChange: () => { },
    },
  };
  ngOnInit() {

  }

  loadData(node: NzCascaderOption, index: number): PromiseLike<void> {
    if (this.to.loadData) {
     return this.to.loadData(node, index);
    }
  }
}
