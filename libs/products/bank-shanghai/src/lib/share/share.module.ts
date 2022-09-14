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

import { InputForms } from './components/form/input';
import { ShowForms } from './components/form/show';
import { ModalComponents } from './modal';
import { RecordComponents } from './components/record';
import { FlowProcessComponent } from './components/process/flow-process.component';
import { FileSignModule } from './components/file-sign';
import { FormModalModule } from './components/form-modal';
import { ShangHaiContractComponent } from './components/form/input/contract.component';
import { ShowModalService } from './services/show-modal.service';
import { AntResultModalModule } from './components/result-modal/ant-result-modal.module';
import { MFileViewerModule } from './components/mfile-viewer/mfile-viewer.module';
import { JsonShowComponent } from './components/json-pre/json-show.component';

import { XnFormlyLinkageSelectModule } from '../share/components/formly-form/linkage-select/linkage-select.module';
import { XnFormlyCustomInputModule } from '../share/components/formly-form/custom-input/custom-input.module';
import { PuhuiNewComponent } from './components/record/puhui/new-puhui.component';
import { AccountStepFirstComponent } from './components/record/puhui/components/account-step-first-form/account-step-first.component';
import { AccountStepSecondComponent } from './components/record/puhui/components/account-step-second-form/account-step-second.component';
import { AccountStepThirdComponent } from './components/record/puhui/components/account-step-third-form/account-step-third.component';
import { PuhuiEditComponent } from './components/record/puhui/edit-puhui.component';
import { XnPuhuiFlowProcessComponent } from './components/process/puhui/puhui-flow-process.component';
import { QRCodeModule } from 'angularx-qrcode';

const antDesignIcons = AllIcons as {
    [key: string]: IconDefinition;
  };
const ICONS = Object.keys(antDesignIcons).map((key) => antDesignIcons[key]);

/**
 *  外部可用模块
 */
const EXPORT_MODULE = [
    FileSignModule,
    FormModalModule,
    AntResultModalModule,
    MFileViewerModule,
    XnFormlyLinkageSelectModule,
    XnFormlyCustomInputModule,
];

/**
 *  外部可用组件
 */
const COMPONENT = [
    ...RecordComponents,
    ShangHaiContractComponent,
    FlowProcessComponent,
    JsonShowComponent,
    /** 普惠开户流程new组件 */
    PuhuiNewComponent,
    AccountStepFirstComponent,
    AccountStepSecondComponent,
    AccountStepThirdComponent,
    PuhuiEditComponent,
    XnPuhuiFlowProcessComponent
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
    providers: [ShowModalService],
})
export class BankShanghaiShareModule {

}
