import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DynamicFormModule } from 'libs/shared/src/lib/common/dynamic-form/dynamic-form.module';
import { PublicModule } from 'libs/shared/src/lib/public/public.module';
import { SortablejsModule } from 'ngx-sortablejs';
import { NgZorroAntDModule } from '../ng-zorro-antd.module';
import { XnACLModule } from '@lr/ngx-acl';
import { XnFormlyModule } from '@lr/ngx-formly';
import { XnTableModule } from '@lr/ngx-table';
import { XnSharedModule } from '@lr/ngx-shared';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { IconDefinition } from '@ant-design/icons-angular';
import * as AllIcons from '@ant-design/icons-angular/icons';
import { BankShanghaiShareModule } from 'libs/products/bank-shanghai/src/lib/share/share.module';

import { InputForms } from './components/form/input';
import { ShowForms } from './components/form/show';
import { ModalComponents } from './modal';
import { RecordComponents } from './components/record';
import { OctFlowProcessComponent } from './components/process/flow-process.component';

import { OctPuhuiNewComponent } from './components/record/puhui/new-puhui.component';
import { OctAccountStepFirstComponent } from './components/record/puhui/components/account-step-first-form/account-step-first.component';
import { OctAccountStepSecondComponent } from './components/record/puhui/components/account-step-second-form/account-step-second.component';
import { OctAccountStepThirdComponent } from './components/record/puhui/components/account-step-third-form/account-step-third.component';
import { OctPuhuiEditComponent } from './components/record/puhui/edit-puhui.component';
import { XnOctPuhuiFlowProcessComponent } from './components/process/puhui/puhui-flow-process.component';
import { QRCodeModule } from 'angularx-qrcode';

const antDesignIcons = AllIcons as {
    [key: string]: IconDefinition;
  };
const ICONS = Object.keys(antDesignIcons).map((key) => antDesignIcons[key]);

/**
 *  外部可用模块
 */
const EXPORT_MODULE = [

];

/**
 *  外部可用组件
 */
const COMPONENT = [
    ...RecordComponents,
    OctFlowProcessComponent,
    /** 普惠开户流程new组件 */
    OctPuhuiNewComponent,
    OctAccountStepFirstComponent,
    OctAccountStepSecondComponent,
    OctAccountStepThirdComponent,
    OctPuhuiEditComponent,
    XnOctPuhuiFlowProcessComponent
];

/**
 *  编辑/显示表单组件
 */
const FROM_COMPONENT = [
    ...InputForms,
    ...ShowForms,
    ...ModalComponents,
];

/**
 *  动态生成组件
 */
export const ENTRY_COMPONENT = [
    ...FROM_COMPONENT,
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
];

@NgModule({
    imports: [
        QRCodeModule,
        CommonModule,
        SortablejsModule,
        PublicModule,
        DynamicFormModule,
        NgZorroAntDModule,
        NzIconModule.forChild(ICONS),
        XnACLModule,
        XnFormlyModule.forRoot(),
        XnTableModule,
        XnSharedModule,
        BankShanghaiShareModule,
        ...EXPORT_MODULE
    ],
    declarations: [
        ...COMPONENT,
        ...ENTRY_COMPONENT,
        ...FROM_COMPONENT,
        ...PIPES,
        ...DIRECTIVES
    ],
    exports: [
        ...EXPORT_MODULE,
        ...ENTRY_COMPONENT,
        ...FROM_COMPONENT,
        ...COMPONENT,
        ...PIPES,
    ],
    providers: []
})
export class OctBankShanghaiShareModule {

}
