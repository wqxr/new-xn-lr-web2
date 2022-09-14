/*************************************************************************
 * Copyright (c) 2017 - 2021 深圳市链融科技股份有限公司
 * Shenzhen Lianrong Technology Co., Ltd.
 * All rights reserved.
 *
 * @file：apps\src\app\shared\components\forms\select-address\index.module.ts
 * @summary：选择地址，省、市、区、详细地址
 * @version: 1.0
 * *************************************************************************
 * revision             author            reason             date
 * 1.0                  DengPei           init               2021-10-25
 ***************************************************************************/
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { FormlyNzFormFieldModule } from '@ngx-formly/ng-zorro-antd/form-field';
import { FormlySelectModule } from '@ngx-formly/core/select';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { FormlyModule } from '@ngx-formly/core';
import { NzFormModule } from 'ng-zorro-antd/form';
import { SelectAddressComponent } from "./index.component";

@NgModule({
  declarations: [SelectAddressComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NzGridModule,
    FormlyNzFormFieldModule,
    FormlySelectModule,
    NzInputModule,
    NzSelectModule,
    NzFormModule,
    FormlyModule.forChild({
      types: [
        {
          name: 'select-address-field',
          component: SelectAddressComponent,
          wrappers: ['form-field'],
        },
      ],
    }),
  ]
})
export class XnFormlySelectAddressModule { }
