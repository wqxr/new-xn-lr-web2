import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DynamicFormModule } from 'libs/shared/src/lib/common/dynamic-form/dynamic-form.module';
import { PublicModule } from 'libs/shared/src/lib/public/public.module';
import { SortablejsModule } from 'ngx-sortablejs';
import { RecordInfoComponents } from './components/record';
import { DragonVankeShareModule } from 'libs/shared/src/lib/public/dragon-vanke/share.module';
import { FlowProcessComponent } from './process/flow-process.component';
import { ModalComponents } from './modal/index'
import { InputForms } from './components/form/input';
import { ShowForms } from './components/form/show';

/**
 *  外部可用模块
 */
const EXPORT_MODULE = [

];

/**
 *  外部可用组件
 */
const COMPONENT = [
    ...RecordInfoComponents,
];

/**
 *  编辑/显示表单组件
 */
const FROM_COMPONENT = [
    ModalComponents,
    ...InputForms,
    ...ShowForms
];

/**
 *  动态生成组件
 */
export const ENTRY_COMPONENT = [
    ...FROM_COMPONENT,
    FlowProcessComponent
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
        CommonModule,
        SortablejsModule,
        PublicModule,
        DynamicFormModule,
        DragonVankeShareModule,
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
export class CountryGradenShareModule {

}
