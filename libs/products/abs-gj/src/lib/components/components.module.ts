/*************************************************************************
 * Copyright (c) 2017 - 2021 深圳市链融科技股份有限公司
 * Shenzhen Lianrong Technology Co., Ltd.
 * All rights reserved.
 *
 * @file：libs\products\abs-gj\src\lib\components\components.module.ts
 * @summary：components.module.ts
 * @version: 1.0
 * *************************************************************************
 * revision             author            reason             date
 * 1.0                  DengPei           init               2021-11-22
 ***************************************************************************/
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PublicModule } from 'libs/shared/src/lib/public/public.module';
import { DynamicFormModule } from 'libs/shared/src/lib/common/dynamic-form/dynamic-form.module';
import { NzStepsModule } from 'ng-zorro-antd/steps';

import { GjTodoListComponent } from './task-list/index.component';
import { GjContractComponent } from './view-contract/contract.component';
import { GjCapitalProductInfoComponent } from './capital-product-info/capital-product-info.component';
import { GjFlowProcessComponent } from './process/flow-process.component';
import { GjFlowDetailComponent } from './record/flow-detail.component';
import { GjBusinessComponent } from './record/business-related.component';
import { GjRelatedFileComponent } from './record/related-file.component';
import { GjFlowDetailRecordComponent } from './record/flow-detail-record.component';
import { GjMemoComponent } from './record/memo.component';
import { GjNewComponent } from './record/new.component';
import { GjEditComponent } from './record/edit.component';
import { GjViewComponent } from './record/view.component';
import { GjRecordViewComponent } from './record/record.component';
import { GjContractSelectShowComponent } from './form/show/contract-select/index.component';
import { GjContractSelectInputComponent } from './form/input/contract-select/index.component';
import { DragonVankeShareModule } from '../../../../../shared/src/lib/public/dragon-vanke/share.module';
import { SearchFormModule } from '@lr/ngx-shared';
import { AbsGjFormlyFormModule } from './formly-form/formly-form.module';
import { GjDownloadModalComponent } from './download-modal/download-modal.component';

const COMPONENTS = [
  GjNewComponent,
  GjEditComponent,
  GjViewComponent,
  GjRecordViewComponent,
  GjTodoListComponent,
  GjFlowProcessComponent,
  GjMemoComponent,
  GjContractComponent,
  GjFlowDetailComponent,
  GjFlowDetailRecordComponent,
  GjBusinessComponent,
  GjRelatedFileComponent,
  GjCapitalProductInfoComponent,
  GjDownloadModalComponent,
];

/** 编辑/显示表单组件 */
const FROM_COMPONENT = [
  GjContractSelectShowComponent,
  GjContractSelectInputComponent,
];

@NgModule({
  imports: [
    CommonModule,
    PublicModule,
    DynamicFormModule,
    NzStepsModule,
    DragonVankeShareModule,
    SearchFormModule,
    AbsGjFormlyFormModule
  ],
  declarations: [...COMPONENTS, ...FROM_COMPONENT],
  exports: [
    ...FROM_COMPONENT,
    GjTodoListComponent,
    GjCapitalProductInfoComponent,
    GjDownloadModalComponent,
  ]
})
export class AbsGjComponentsModule {}
