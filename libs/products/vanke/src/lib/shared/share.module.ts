import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DynamicFormModule } from 'libs/shared/src/lib/common/dynamic-form/dynamic-form.module';
import { PublicModule } from 'libs/shared/src/lib/public/public.module';
import { SortablejsModule } from 'ngx-sortablejs';
import { DragonVankeShareModule } from 'libs/shared/src/lib/public/dragon-vanke/share.module';
import { NgZorroAntDModule } from '../ng-zorro-antd.module';
import { XnACLModule } from '@lr/ngx-acl';
import { XnFormlyModule } from '@lr/ngx-formly';
import { XnTableModule } from '@lr/ngx-table';
import { XnSharedModule } from '@lr/ngx-shared';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { IconDefinition } from '@ant-design/icons-angular';
import * as AllIcons from '@ant-design/icons-angular/icons';
import { RecordInfoComponents } from './components/record';
import { vankeFlowProcessComponent } from './components/process/flow-process.component';


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
  ...RecordInfoComponents,
];

/**
 *  编辑/显示表单组件
 */
const FROM_COMPONENT = [
];

/**
 *  动态生成组件
 */
export const ENTRY_COMPONENT = [
  ...FROM_COMPONENT,
  vankeFlowProcessComponent
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
    ...DIRECTIVES,
  ],
  exports: [
    ...EXPORT_MODULE,
    ...ENTRY_COMPONENT,
    ...FROM_COMPONENT,
    ...COMPONENT,
    ...PIPES,
  ],
  providers: [],
})
export class VankeShareModule {

}
