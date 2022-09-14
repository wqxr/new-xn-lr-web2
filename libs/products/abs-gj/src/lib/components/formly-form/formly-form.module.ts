/*************************************************************************
 * Copyright (c) 2017 - 2021 深圳市链融科技股份有限公司
 * Shenzhen Lianrong Technology Co., Ltd.
 * All rights reserved.
 *
 * @file：libs\products\abs-gj\src\lib\components\formly-form\formly-form.module.ts
 * @summary：formly-form.module.ts
 * @version: 1.0
 * *************************************************************************
 * revision             author            reason             date
 * 1.0                  DengPei           init               2021-12-10
 ***************************************************************************/

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { XnFormlyPerDataPickerModule } from './per-data-picker/per-data-picker.module';
import { XnFormlyPerTextModule } from './per-text/per-text.module';

@NgModule({
  imports: [
    CommonModule,
    XnFormlyPerDataPickerModule,
    XnFormlyPerTextModule
  ],
  declarations: [],
  exports: []
})
export class AbsGjFormlyFormModule {}
