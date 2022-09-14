/*************************************************************************
* Copyright (c) 2017 - 2022 深圳市链融科技股份有限公司
* Shenzhen Lianrong Technology Co., Ltd.
* All rights reserved.
*
* @file：libs\console\src\lib\management\vanke-document-feedback\components\formly-form\expand-select\expand-select.component.ts
* @summary：init XnFormlyExpandSelectModule
* @version: 1.0
* *************************************************************************
* revision             author            reason             date
* 1.0                HuCongying           init           2022-03-14
***************************************************************************/
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormlyModule } from '@ngx-formly/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { FormlySelectModule } from '@ngx-formly/core/select';
import { FormlyNzFormFieldModule } from '@ngx-formly/ng-zorro-antd/form-field';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { XnFormlyFieldInvoiceFeedback } from './vanke-invoice-feedback.component';
import { XnTableModule } from '@lr/ngx-table';
import { PublicModule } from 'libs/shared/src/lib/public/public.module';

@NgModule({
  declarations: [XnFormlyFieldInvoiceFeedback],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NzSelectModule,
    NzInputModule,
    NzDividerModule,
    NzIconModule,
    FormlyNzFormFieldModule,
    FormlySelectModule,
    XnTableModule,
    PublicModule,
    FormlyModule.forChild({
      types: [
        {
          name: 'vanke-invoice-feedback',
          component: XnFormlyFieldInvoiceFeedback,
          wrappers: ['form-field'],
        },
      ],
    }),
  ],
})
export class XnFormlyInvoiceFeedbackModule { }
