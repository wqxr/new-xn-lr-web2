/*************************************************************************
 * Copyright (c) 2017 - 2020 深圳市链融科技股份有限公司
 * Shenzhen Lianrong Technology Co., Ltd.
 * All rights reserved.
 *
 * @file：xn-formly\src\textarea\textarea-count.module.ts
 * @summary：init textarea.module.ts
 * @version: 1.0
 * *************************************************************************
 * revision             author            reason             date
 * 1.0                 hucongying        init             2020-12-23
 ***************************************************************************/
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormlyModule } from '@ngx-formly/core';
import { ReactiveFormsModule } from '@angular/forms';

import { FormlyNzFormFieldModule } from '@ngx-formly/ng-zorro-antd/form-field';
import { NzInputModule } from 'ng-zorro-antd/input';

import { XnFormlyFieldTextAreaCount } from './textarea-count.component';

@NgModule({
  declarations: [XnFormlyFieldTextAreaCount],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NzInputModule,
    FormlyNzFormFieldModule,
    FormlyModule.forChild({
      types: [
        {
          name: 'textarea-count',
          component: XnFormlyFieldTextAreaCount,
          wrappers: ['form-field'],
        },
      ],
    }),
  ],
})
export class XnFormlyNzTextAreaCountModule {}
