/*************************************************************************
 * Copyright (c) 2017 - 2020 北京希为科技有限公司
 * Beijing Xiwei Technology Co., Ltd.
 * All rights reserved.
 *
 * @file：xn-formly\src\radio-button\radio-button.module.ts
 * @summary：init radio-button.module.ts
 * @version: 1.0
 * *************************************************************************
 * revision             author            reason             date
 * 1.0                  WuShenghui        init             2020-08-20
 ***************************************************************************/
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormlyModule } from '@ngx-formly/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { FormlySelectModule } from '@ngx-formly/core/select';

import { FormlyNzFormFieldModule } from '@ngx-formly/ng-zorro-antd/form-field';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzGridModule } from 'ng-zorro-antd/grid';

import { XnFormlyFieldLinkageSelect } from './linkage-select.component';

@NgModule({
  declarations: [XnFormlyFieldLinkageSelect],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NzSelectModule,
    NzGridModule,

    FormlyNzFormFieldModule,
    FormlySelectModule,
    FormlyModule.forChild({
      types: [
        {
          name: 'linkage-select',
          component: XnFormlyFieldLinkageSelect,
          wrappers: ['form-field'],
        },
      ],
    }),
  ],
})
export class XnFormlyLinkageSelectModule {}
