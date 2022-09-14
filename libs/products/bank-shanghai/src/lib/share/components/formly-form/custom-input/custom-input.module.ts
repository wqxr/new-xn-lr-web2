/*************************************************************************
 * Copyright (c) 2017 - 2020 深圳市链融科技股份有限公司
 * Shenzhen Lianrong Technology Co., Ltd.
 * All rights reserved.
 *
 * @file：xn-formly\src\input-group\input-group.module.ts
 * @summary：init input-group.module.ts
 * @version: 1.0
 * *************************************************************************
 * revision             author            reason             date
 * 1.0                  WuShenghui        init             2020-10-26
 ***************************************************************************/
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormlyModule } from '@ngx-formly/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzIconModule } from 'ng-zorro-antd/icon';

import { FormlyNzFormFieldModule } from '@ngx-formly/ng-zorro-antd/form-field';

import { XnFormlyFieldCustomInput } from './custom-input.component';

@NgModule({
  declarations: [XnFormlyFieldCustomInput],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NzInputModule,
    NzIconModule,

    FormlyNzFormFieldModule,
    FormlyModule.forChild({
      types: [
        {
          name: 'custom-input',
          component: XnFormlyFieldCustomInput,
          wrappers: ['form-field'],
        },
      ],
    }),
  ],
})
export class XnFormlyCustomInputModule {}
