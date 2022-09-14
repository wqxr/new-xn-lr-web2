/*
 * Copyright(c) 2017-2019, 深圳市链融科技股份有限公司
 * Beijing Xiwei Technology Co., Ltd.
 * All rights reserved.
 *
 * @file：SharedModule
 * @summary：共享模块 - 采购融资公共组件再此模块
 * @version: 1.0
 * **********************************************************************
 * revision             author            reason             date
 * 1.0                 zhyuanan          新增模块             2019-05-05
 * **********************************************************************
 */

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ContractAddCompanyModalComponent } from 'libs/products/avenger/src/lib/contract-manage/add-cotracttemplate/add-contracttemplate.component';
// tslint:disable-next-line:max-line-length
import { CustomerAddCompanyModalComponent } from 'libs/products/avenger/src/lib/customer-manage/customer-addCompany-template/customer-addCompany.modal.component';
import { Ng2Bs3ModalModule } from 'libs/shared/src/lib/common/modal/ng2-bs3-modal';
import { PublicModule } from 'libs/shared/src/lib/public/public.module';
import { ElementDragDirective } from './components/directives/element-drag.directive';
import { AvengerInputComponent } from './components/form/avenger-input.component';
import { NormalForms } from './components/form/normal';
import { ShowAvengerInputComponent } from './components/form/show-avenger-input.component';
import { AvengeraddContractModalComponent } from './components/modal/avenger-contract-write.modal';
import { EditModalComponent } from './components/modal/edit-modal.component';
import { EnumTransformPipe } from './components/pipes/enum-transform.pipe';
import { NullValueDisplayPipe } from './components/pipes/null-value-display.pipe';
import { FlowProcessComponent } from './components/process/flow-process.component';
import { AvengerEditComponent } from './components/record/edit.component';
import { AvengerFlowDetailRecordComponent } from './components/record/flow-detail-record.component';
import { AvengerMemoComponent } from './components/record/memo.component';
import { AvengerNewComponent } from './components/record/new.component';
import { AvengerRecordComponent } from './components/record/record.component';
import { AvengerViewComponent } from './components/record/view.component';
import { DynamicFormModule } from 'libs/shared/src/lib/common/dynamic-form/dynamic-form.module';
import { ShowForms } from './components/form/show/indext';
import { ChoseManageModalComponent } from 'libs/products/avenger/src/lib/guarant-management/guarant-add-manage.template/guarant-add-manage.template.modal';
import { AvengerInvoiceVankeEditModalComponent } from './components/modal/avenger-invoice-vanke-edit-modal.component';
import { AvengerInvoiceShowModalComponent } from './components/modal/avenger-invoice-show-modal.component';
import { AvengerChoseAccountinfoComponent } from './components/modal/avenger-chose-accountinfo.modal';
import { AvengerBankCardAddComponent } from './components/modal/bank-card-add.component';
import { DragonVankeShareModule } from 'libs/shared/src/lib/public/dragon-vanke/share.module';

/**
 *  外部可用模块
 */
const EXPORT_MODULE = [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    Ng2Bs3ModalModule,
    PublicModule,
    DynamicFormModule,
    DragonVankeShareModule
];

/**
 *  外部可用组件
 */
const EXPORT_COMPONENT = [
    AvengerEditComponent,
    AvengerNewComponent,
    FlowProcessComponent,
    AvengerInputComponent,
    ShowAvengerInputComponent,
    AvengerRecordComponent,
    AvengerViewComponent,
    AvengerMemoComponent,
    AvengerFlowDetailRecordComponent,
];

/**
 *  编辑/显示表单组件
 */
const FROM_COMPONENT = [
    ...NormalForms,
    ...ShowForms,
];

/**
 *  动态生成组件
 */
export const ENTRY_COMPONENT = [
    ...FROM_COMPONENT,
    CustomerAddCompanyModalComponent,
    ContractAddCompanyModalComponent,
    AvengeraddContractModalComponent,
    EditModalComponent,
    ChoseManageModalComponent,
    AvengerInvoiceVankeEditModalComponent,
    AvengerInvoiceShowModalComponent,
    AvengerChoseAccountinfoComponent,
    AvengerBankCardAddComponent
];

/**
 *  枚举
 */
const ENUMS = [];

/**
 *  自定义指令
 */
const DIRECTIVES = [
    ElementDragDirective
];
/**
 *  管道
 */
const PIPES = [
    NullValueDisplayPipe,
    EnumTransformPipe
];

@NgModule({
    imports: [
        ...EXPORT_MODULE
    ],
    declarations: [
        ...EXPORT_COMPONENT,
        ...ENTRY_COMPONENT,
        ...FROM_COMPONENT,
        ...ENUMS,
        ...PIPES,
        ...DIRECTIVES
    ],
    exports: [
        ...EXPORT_COMPONENT,
        ...EXPORT_MODULE,
        ...ENTRY_COMPONENT,
        ...FROM_COMPONENT,
        ...ENUMS,
        ...PIPES,
        ...DIRECTIVES
    ]
})
export class AvengerSharedModule {
}
