/*************************************************************************
 * Copyright (c) 2017 - 2021 深圳市链融科技股份有限公司
 * Shenzhen Lianrong Technology Co., Ltd.
 * All rights reserved.
 *
 * @file：libs\products\account-system\src\lib\shared\components\formly-form\input-money\input-tip.component.ts
 * @summary：输入框+提示语
 * @version: 1.0
 * *************************************************************************
 * revision             author            reason             date
 * 1.0                HuCongying           init           2021-11-23
 ***************************************************************************/
import { Component, ChangeDetectionStrategy, OnInit } from '@angular/core';
import { FieldType } from '@ngx-formly/core';

@Component({
  selector: 'xn-formly-field-input-tip',
  template: `
    <input
      nz-input
      nzSize="default"
      [formControl]="formControl"
      [type]="to.type || 'text'"
      [formlyAttributes]="field"
    />
    <div *ngIf="to.tip">
      {{ to.tip }}
    </div>
  `,
  styles: [
    `
      .suffix {
        cursor: pointer;
      }
      .suffix:hover {
        color: blue;
      }
      ::ng-deep .ant-input-group-addon {
        padding: 0;
        border: none;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InputTipComponent extends FieldType implements OnInit {
  defaultOptions = {
    templateOptions: {
      tip: '',
    },
  };

  constructor() {
    super();
  }

  ngOnInit() {
    //
  }
}
