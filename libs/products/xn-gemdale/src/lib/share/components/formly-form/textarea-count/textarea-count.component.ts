/*************************************************************************
 * Copyright (c) 2017 - 2020 深圳市链融科技股份有限公司
 * Shenzhen Lianrong Technology Co., Ltd.
 * All rights reserved.
 *
 * @file：xn-formly\src\textarea\textarea.component.ts
 * @summary：init textarea.component.ts
 * @version: 1.0
 * *************************************************************************
 * revision             author            reason             date
 * 1.0                 hucongying        init             2020-12-23
 ***************************************************************************/
import { Component, ChangeDetectionStrategy } from '@angular/core';
import { FieldType } from '@ngx-formly/core';

@Component({
  selector: 'formly-field-nz-textarea-count',
  template: `
  <nz-textarea-count [nzMaxCharacterCount]="to.nzMaxCharacterCount">
    <textarea
      nz-input
      [nzSize]="to.nzSize"
      [nzAutosize]="to.nzAutosize"
      [nzBorderless]="to.nzBorderless"
      [formControl]="formControl"
      [formlyAttributes]="field"
    ></textarea>
  </nz-textarea-count>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class XnFormlyFieldTextAreaCount extends FieldType {
  defaultOptions = {
    templateOptions: {
      nzSize: 'default',
      nzAutosize: {
        minRows: 3,
        maxRows: 6,
      },
      nzBorderless: false,
    }
  };
}
