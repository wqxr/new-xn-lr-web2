import { NgModule } from '@angular/core';
import { SortablejsModule } from 'ngx-sortablejs';
import { CommonModule } from '@angular/common';
import { InputForms } from './components/form/input';
import { ShowForms } from './components/form/show';
import { NewComponent } from './components/record/new.component';
import { PublicModule } from '../../../../../shared/src/lib/public/public.module';
import { DynamicFormModule } from '../../../../../shared/src/lib/common/dynamic-form/dynamic-form.module';
import { DragonViewComponent } from './components/record/view.component';
import { DragonRecordComponent } from './components/record/record.component';
import { DragonMemoComponent } from './components/record/memo.component';
import { DragonEditComponent } from './components/record/edit.component';
import { FlowProcessComponent } from './process/flow-process.component';
import { ModalComponents } from './modal';
import { DragonFlowDetailComponent } from './components/record/flow-detail.component';
import { FlowDetailRecordComponent } from './components/record/flow-detail-record.component';
import { VankebusinessComponent } from './components/record/vanke-business-related.component';
import { VankeRelatedFileComponent } from './components/record/vanke-related-file.component';
import { DragonView2Component } from './components/record/view2.component';
import { ModalAvengerComponents } from '../avenger/modal/index';
import { ManagementModule } from 'libs/console/src/lib/management/management.module';
import { FormModalModule } from './components/form-modal/form-modal.module'
import { XnFormlyLinkageSelectModule } from './components/formly-form/linkage-select/linkage-select.module'

/** antd模块 */
import * as AllIcons from '@ant-design/icons-angular/icons';
import { IconDefinition } from '@ant-design/icons-angular';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NewFlowProcessComponent } from './process/new-flow-process.component';
import { NzStepsModule } from 'ng-zorro-antd/steps';
import { FlowCommonComponent } from './components/commom-component/flow-common-comp.component';
import { XnTableModule } from '@lr/ngx-table';
import { XnFormlyModule } from '@lr/ngx-formly';
import { NgZorroAntDModule } from 'libs/shared/src/lib/ng-zorro-antd.module'
const antDesignIcons = AllIcons as {
  [key: string]: IconDefinition;
};
const ICONS = Object.keys(antDesignIcons).map((key) => antDesignIcons[key]);

/**
 *  外部可用模块
 */
const EXPORT_MODULE = [
  FormModalModule,
  XnFormlyLinkageSelectModule
];

/**
 *  外部可用组件
 */
const COMPONENT = [
    NewComponent,
    DragonEditComponent,
    DragonMemoComponent,
    DragonRecordComponent,
    DragonViewComponent,
    DragonFlowDetailComponent,
    FlowDetailRecordComponent,
    VankebusinessComponent,
    VankeRelatedFileComponent,
    DragonView2Component,
];

/**
 *  编辑/显示表单组件
 */
const FROM_COMPONENT = [
    ...InputForms,
    ...ShowForms,
    // ...CfcaSignForms,
    ModalComponents,
    ModalAvengerComponents,
    FlowCommonComponent,
];

/**
 *  动态生成组件
 */
export const ENTRY_COMPONENT = [
    ...FROM_COMPONENT,
    FlowProcessComponent,
    NewFlowProcessComponent

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
        NzStepsModule,
        XnTableModule,
        NgZorroAntDModule,
        NzIconModule.forChild(ICONS),
        XnFormlyModule.forRoot(),
        ...EXPORT_MODULE,
    ],
    declarations: [
        ...COMPONENT,
        ...ENTRY_COMPONENT,
        ...FROM_COMPONENT,
        ...PIPES,
        ...DIRECTIVES,
    ],
    exports: [
        DynamicFormModule,
        ...EXPORT_MODULE,
        ...ENTRY_COMPONENT,
        ...FROM_COMPONENT,
        ...COMPONENT,
    ]
})
export class DragonVankeShareModule {

}
