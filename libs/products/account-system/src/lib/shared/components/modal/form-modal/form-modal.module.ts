/*************************************************************************
* Copyright (c) 2017 - 2022 深圳市链融科技股份有限公司
* Shenzhen Lianrong Technology Co., Ltd.
* All rights reserved.
*
* @file：libs\products\account-system\src\lib\shared\components\modal\form-modal\form-modal.module.ts
* @summary：init form-modal.module.ts
* @version: 1.0
* *************************************************************************
* revision             author            reason             date
* 1.0                HuCongying           init           2022-01-06
***************************************************************************/
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { XnFormlyModule } from '@lr/ngx-formly';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzButtonModule } from 'ng-zorro-antd/button';

import { xnAccountFormModalComponent } from './form-modal.component';

const COMPONENTS = [xnAccountFormModalComponent];

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
export class XnAccountFormModalModule {}
