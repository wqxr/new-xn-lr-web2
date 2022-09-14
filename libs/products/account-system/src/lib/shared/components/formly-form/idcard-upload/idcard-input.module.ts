/*************************************************************************
* Copyright (c) 2017 - 2021 深圳市链融科技股份有限公司
* Shenzhen Lianrong Technology Co., Ltd.
* All rights reserved.
*
* @file：libs\products\account-system\src\lib\shared\components\formly-form\idcard-upload\idcard-input.module.ts
* @summary：XnFormlyIdcardUploadModule
* @version: 1.0
* *************************************************************************
* revision             author            reason             date
* 1.0                 hucongying          init           2021-10-28
***************************************************************************/
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { FormlyModule } from '@ngx-formly/core';
import { FormlySelectModule } from '@ngx-formly/core/select';
import { FormlyNzFormFieldModule } from '@ngx-formly/ng-zorro-antd/form-field';
import { NzInputModule } from 'ng-zorro-antd/input';
import { IdcardUploadComponent } from './idcard-input.component';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { NzUploadModule } from 'ng-zorro-antd/upload';
import { NzButtonModule } from 'ng-zorro-antd/button';

@NgModule({
  declarations: [IdcardUploadComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NzInputModule,
    NzIconModule,
    NzToolTipModule,
    NzButtonModule,
    NzUploadModule,
    FormlyNzFormFieldModule,
    FormlySelectModule,
    FormlyModule.forChild({
      types: [
        {
          name: 'idcard-upload',
          component: IdcardUploadComponent,
          wrappers: ['form-field'],
        },
        { name: 'enum', extends: 'idcard-upload' },
      ],
    }),
  ],
})
export class XnFormlyIdcardUploadModule { }
