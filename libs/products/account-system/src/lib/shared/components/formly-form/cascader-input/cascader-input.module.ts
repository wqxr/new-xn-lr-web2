/*************************************************************************
* Copyright (c) 2017 - 2021 深圳市链融科技股份有限公司
* Shenzhen Lianrong Technology Co., Ltd.
* All rights reserved.
*
* @file：libs\products\account-system\src\lib\shared\components\formly-form\cascader-input\cascader-input.module.ts
* @summary：cascader
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
import { NzCascaderModule } from 'ng-zorro-antd/cascader';
import { XnFormlyFieldCascader } from './cascader-input.component';

 @NgModule({
   declarations: [XnFormlyFieldCascader],
   imports: [
     CommonModule,
     ReactiveFormsModule,
     NzCascaderModule,
     FormlyNzFormFieldModule,
     FormlySelectModule,
     FormlyModule.forChild({
       types: [
         {
           name: 'cascader-input',
           component: XnFormlyFieldCascader,
           wrappers: ['form-field'],
         },
         { name: 'enum', extends: 'cascader-input' },
       ],
     }),
   ],
 })
 export class XnFormlyNzCascaderModule {}
