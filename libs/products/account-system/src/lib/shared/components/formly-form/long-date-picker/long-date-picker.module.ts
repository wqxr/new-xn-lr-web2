/*************************************************************************
* Copyright (c) 2017 - 2021 深圳市链融科技股份有限公司
* Shenzhen Lianrong Technology Co., Ltd.
* All rights reserved.
*
* @file：libs\products\account-system\src\lib\shared\components\formly-form\long-date-picker\long-date-picker.module.ts
* @summary：long-date-picker
* @version: 1.0
* *************************************************************************
* revision             author            reason             date
* 1.0                HuCongying           init           2021-11-17
***************************************************************************/
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { FormlyModule } from '@ngx-formly/core';

import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { XnFormlyFieldLongDatePicker } from './long-date-picker.component';

@NgModule({
  declarations: [XnFormlyFieldLongDatePicker],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NzDatePickerModule,
    FormlyModule.forChild({
      types: [
        {
          name: 'long-date-picker',
          component: XnFormlyFieldLongDatePicker,
          wrappers: ['form-field'],
        },
      ],
    }),
  ],
})
export class XnFormlyLongDatePickerModule {}
