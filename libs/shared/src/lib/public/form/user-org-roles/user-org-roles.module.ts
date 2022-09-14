/*************************************************************************
 * Copyright (c) 2017 - 2021 深圳市链融科技股份有限公司
 * Shenzhen Lianrong Technology Co., Ltd.
 * All rights reserved.
 *
 * @file：libs\shared\src\lib\public\form\user-org-roles\user-org-roles.module.ts
 * @summary：user-org-roles.module.ts
 * @version: 1.0
 * *************************************************************************
 * revision             author            reason             date
 * 1.0                  DengPei           init               2021-07-12
 ***************************************************************************/
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { FormlyNzFormFieldModule } from '@ngx-formly/ng-zorro-antd/form-field';
import { FormlySelectModule } from '@ngx-formly/core/select';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzInputNumberModule } from 'ng-zorro-antd/input-number';
import { FormlyModule } from '@ngx-formly/core';
import { NzFormModule } from 'ng-zorro-antd/form';
import { UserOrgRolesComponent } from './user-org-roles.component';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NzSpinModule } from 'ng-zorro-antd/spin';

@NgModule({
  declarations: [UserOrgRolesComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NzButtonModule,
    NzGridModule,
    FormlyNzFormFieldModule,
    FormlySelectModule,
    NzInputModule,
    NzSelectModule,
    NzInputNumberModule,
    NzFormModule,
    FormlyModule.forChild({
      types: [
        {
          name: 'user-org-roles-field',
          component: UserOrgRolesComponent,
          wrappers: ['form-field'],
        },
      ],
    }),
    NzCheckboxModule,
    NzSpinModule,
  ]
})
export class XnFormlyUserOrgRolesModule { }
