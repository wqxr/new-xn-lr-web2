/*************************************************************************
 * Copyright (c) 2017 - 2020 北京希为科技有限公司
 * Beijing Xiwei Technology Co., Ltd.
 * All rights reserved.
 *
 * @file：xn-factoring-cloud-web\apps\src\app\shared\components\form-modal\form-modal.module.ts
 * @summary：init form-modal.module.ts
 * @version: 1.0
 * *************************************************************************
 * revision             author            reason             date
 * 1.0                  WuShenghui        init             2020-10-04
 ***************************************************************************/
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { XnFormlyModule } from '@lr/ngx-formly';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzButtonModule } from 'ng-zorro-antd/button';

import { FormModalComponent } from './form-modal.component';

const COMPONENTS = [FormModalComponent];

@NgModule({
  declarations: [...COMPONENTS],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    XnFormlyModule,
    NzModalModule,
    NzFormModule,
    NzButtonModule,
    NzIconModule,
  ],
  exports: [...COMPONENTS],
})
export class FormModalModule {}
