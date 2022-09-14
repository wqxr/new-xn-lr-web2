/*************************************************************************
 * Copyright (c) 2017 - 2020 深圳市链融科技股份有限公司
 * Shenzhen Lianrong Technology Co., Ltd.
 * All rights reserved.
 *
 * @file：libs\products\bank-shanghai\src\lib\share\components\formly-form\custom-input\custom-input.component.ts
 * @summary：init custom-input.component.ts
 * @version: 1.0
 * *************************************************************************
 * revision             author            reason             date
 * 1.0                  yutianbao        init             2020-10-26
 ***************************************************************************/
import { Component, ChangeDetectionStrategy, OnInit } from '@angular/core';
import { FieldType } from '@ngx-formly/core';

@Component({
  selector: 'xn-formly-field-custom-input',
  template: `
    <input
      nz-input
      [formControl]="formControl"
      [type]="to.type || 'text'"
      [formlyAttributes]="field"
      [autocomplete]="to.autocomplete"
    />
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class XnFormlyFieldCustomInput extends FieldType implements OnInit {
  defaultOptions = {
    templateOptions: {},
  };

  constructor() {
    super();
  }

  ngOnInit() {
  }

}
