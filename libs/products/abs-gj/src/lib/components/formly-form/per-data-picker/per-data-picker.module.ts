/*************************************************************************
 * Copyright (c) 2017 - 2021 深圳市链融科技股份有限公司
 * Shenzhen Lianrong Technology Co., Ltd.
 * All rights reserved.
 *
 * @file：libs\products\abs-gj\src\lib\components\formly-form\linkage-select\linkage-select.module.ts
 * @summary：linkage-select.module.ts
 * @version: 1.0
 * *************************************************************************
 * revision             author            reason             date
 * 1.0                  DengPei           init               2021-12-10
 ***************************************************************************/
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormlyModule } from '@ngx-formly/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { FormlyNzFormFieldModule } from '@ngx-formly/ng-zorro-antd/form-field';
import { NzSelectModule } from 'ng-zorro-antd/select';

import { GjFormlyFieldPerDataPickerComponent } from './per-data-picker.component';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';

@NgModule({
  declarations: [GjFormlyFieldPerDataPickerComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NzSelectModule,

    FormlyNzFormFieldModule,
    FormlyModule.forChild({
      types: [
        {
          name: 'per-date-picker',
          component: GjFormlyFieldPerDataPickerComponent,
          wrappers: ['form-field'],
        },
      ],
    }),
    NzInputModule,
    NzDatePickerModule,
  ],
})
export class XnFormlyPerDataPickerModule {}
