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
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzResultModule } from 'ng-zorro-antd/result';
import { NzSpaceModule } from 'ng-zorro-antd/space';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzAlertModule } from 'ng-zorro-antd/alert';
import { NzGridModule } from 'ng-zorro-antd/grid';

import { AntResultModalComponent } from './ant-result-modal.component';

// import { BusinessStateListComponent } from '../../../pages/business-state/business-state-list.component';
// import { DynamicFormModule } from 'libs/shared/src/lib/common/dynamic-form/dynamic-form.module';
// import { DragonVankeShareModule } from 'libs/shared/src/lib/public/dragon-vanke/share.module';
// import { PublicModule } from 'libs/shared/src/lib/public/public.module';

const COMPONENTS = [AntResultModalComponent];

@NgModule({
  declarations: [...COMPONENTS],
  imports: [
    CommonModule,
    NzModalModule,
    NzGridModule,
    NzButtonModule,
    NzIconModule,
    NzResultModule,
    NzSpaceModule,
    NzDropDownModule,
    NzAlertModule,
  ],
  exports: [...COMPONENTS],
})
export class AntResultModalModule {}
