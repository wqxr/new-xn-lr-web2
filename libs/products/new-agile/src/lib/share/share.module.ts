import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DynamicFormModule } from 'libs/shared/src/lib/common/dynamic-form/dynamic-form.module';
import { PublicModule } from 'libs/shared/src/lib/public/public.module';
import { SortablejsModule } from 'ngx-sortablejs';
import { InputForms } from './components/form/input';
import { ShowForms } from './components/form/show';
import { RecordComponents } from './components/record';
import { FlowInfoComponents } from './components/flow';
import { Pipes } from './pipe';
import { ModalComponents } from './modal';

import { NewAgileCommListComponent } from './components/comm-list.component';
import { QrcodeComponent } from './components/qrcode/qrcode.component';
import { NewAgileHomeCommListComponent } from './components/home-comm-list/home-comm-list.component';

/**
 *  外部可用模块
 */
const EXPORT_MODULE = [

];

/**
 *  外部可用组件
 */
const COMPONENT = [
    NewAgileCommListComponent,
    QrcodeComponent,
    NewAgileHomeCommListComponent,
    ...RecordComponents,
    ...FlowInfoComponents,
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
    ...Pipes,
];

@NgModule({
    imports: [
        CommonModule,
        SortablejsModule,
        PublicModule,
        DynamicFormModule,
        ...EXPORT_MODULE
    ],
    declarations: [
        ...COMPONENT,
        ...ENTRY_COMPONENT,
        ...FROM_COMPONENT,
        ...PIPES,
        ...DIRECTIVES,
        ...EXPORT_MODULE
    ],
    exports: [
        ...EXPORT_MODULE,
        ...ENTRY_COMPONENT,
        ...FROM_COMPONENT,
        ...COMPONENT,
        ...PIPES,
    ]
})
export class NewAgileShareModule {

}
