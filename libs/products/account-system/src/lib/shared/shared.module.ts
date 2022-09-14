/*************************************************************************
* Copyright (c) 2017 - 2021 深圳市链融科技股份有限公司
* Shenzhen Lianrong Technology Co., Ltd.
* All rights reserved.
*
* @file：libs\products\account-system\src\lib\shared\shared.module.ts
* @summary：init AccountSystemShareModule
* @version: 1.0
* *************************************************************************
* revision             author            reason             date
* 1.0                HuCongying           init           2021-11-27
***************************************************************************/
import { NgModule, ViewContainerRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { XnFormlyModule } from '@lr/ngx-formly';
import { XnTableModule } from '@lr/ngx-table';
import { FileViewerConfigService, XnSharedModule } from '@lr/ngx-shared';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { IconDefinition } from '@ant-design/icons-angular';
import * as AllIcons from '@ant-design/icons-angular/icons';
import { XnFormlyNzCascaderModule } from './components/formly-form/cascader-input/cascader-input.module';
import { ShowModalService } from './services/show-modal.service';
import { ModalComponents } from './components/modal';
import { ProtocolFileViewerModule } from './components/file-viewer';
import { NgZorroAntDModule } from 'libs/shared/src/lib/ng-zorro-antd.module';
import { AtMoneyPipe, XnSelectOptionPipe } from './pipes';
import { FileViewService } from './services/file-view.service';
import { XnFormlyInputCodeModule } from './components/formly-form/input-code/input-groups.module';
import { XnAccountFormModalModule } from './components/modal/form-modal';
import { XnFormlyIdcardUploadModule } from './components/formly-form/idcard-upload/idcard-input.module';
import { XnFormlySelectAddressModule } from './components/formly-form/select-address/index.module';
import { XnFormlyLongDatePickerModule } from './components/formly-form/long-date-picker/long-date-picker.module';
import { XnFormlyInputTipModule } from './components/formly-form/input-money/input-tip.module';
import { NzTimelineModule } from 'ng-zorro-antd/timeline';
import { XnTimeLineComponent } from './components/process-record/process-record.component';
import { AccountCheckCardComponent } from './components/account-check-card/account-check-card.component';
import { CheckRequestService } from './services/check-request.service';
const antDesignIcons = AllIcons as {
  [key: string]: IconDefinition;
};
const ICONS = Object.keys(antDesignIcons).map((key) => antDesignIcons[key]);

/**
 *  外部可用模块
 */
const COMPONENT = [
  ModalComponents,
  XnTimeLineComponent,
  AccountCheckCardComponent,
];

/**
 *  外部可用模块
 */
const EXPORT_MODULE = [
  ProtocolFileViewerModule,
  XnFormlyNzCascaderModule,
  XnFormlyInputCodeModule,
  XnAccountFormModalModule,
  XnFormlyIdcardUploadModule,
  XnFormlySelectAddressModule,
  XnFormlyLongDatePickerModule,
  XnFormlyInputTipModule
];

/**
 *  自定义指令
 */
const DIRECTIVES = [

];
/**
 *  管道
 */
const PIPES = [
  XnSelectOptionPipe,
  AtMoneyPipe
];

@NgModule({
  imports: [
    CommonModule,
    NzIconModule.forChild(ICONS),
    XnFormlyModule.forRoot(),
    XnTableModule,
    XnSharedModule,
    NgZorroAntDModule,
    NzTimelineModule,
    ...EXPORT_MODULE
  ],
  declarations: [
    ...PIPES,
    ...DIRECTIVES,
    ...COMPONENT
  ],
  exports: [
    ...COMPONENT,
    ...PIPES,
    ...EXPORT_MODULE
  ],
  providers: [ShowModalService, XnSelectOptionPipe, CheckRequestService],
})
export class AccountSystemShareModule {
  constructor(
    private fileViewService: FileViewService,
    private xnFileViewerConfig: FileViewerConfigService
  ) {
    this.xnFileViewerConfig.set(this.fileViewService);
  }
}
