/*
 * Copyright(c) 2017-2019, 深圳市链融科技股份有限公司
 * Beijing Xiwei Technology Co., Ltd.
 * All rights reserved.
 *
 * @file：DynamicFormModule
 * @summary：动态表单模块
 * @version: 1.0
 * **********************************************************************
 * revision             author            reason             date
 * 1.0                WuShenghui    移除表单 ngSwitchCase   2019-06-24
 * **********************************************************************
 */

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { DynamicDirective } from './dynamic-host.directive';
import { DynamicComponentService } from './dynamic.service';
import { InputForms } from './form/input';
import { ShowForms } from './form/show';
import { InputComponent } from './form/input.component';
import { ShowComponent } from './form/show.component';
import { PublicModule } from '../../public/public.module';
import { CollapseConditionFormComponent } from './form/collapse-condition';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { FlowtemplateContractExampleComponent } from '../../public/dragon-vanke/components/commom-component/flow-template-contract-examples.component';
import {FlowtemplateInvoiceExampleComponent} from '../../public/dragon-vanke/components/commom-component/flow-template-invoice-examples.component';
import {FlowtemplateOtherExampleComponent} from '../../public/dragon-vanke/components/commom-component/flow-template-other-examples.component';
/**
 * 自定义组件
 */
const COMPONENT = [
    InputComponent,
    ShowComponent,
    /**
     * cfca通用签章表单
     */
    CollapseConditionFormComponent,
    FlowtemplateContractExampleComponent,
    FlowtemplateInvoiceExampleComponent,
    FlowtemplateOtherExampleComponent
];

/**
 *  动态生成组件
 */
const ENTRY_COMPONENT = [
    ...InputForms,
    ...ShowForms,

];

/**
 *  自定义指令
 */
const DIRECTIVES = [
    DynamicDirective,
];


@NgModule({
    imports: [
        CommonModule,
        ReactiveFormsModule,
        PublicModule,
        NzIconModule,
        NzSelectModule
    ],
    declarations: [
        ...COMPONENT,
        ...ENTRY_COMPONENT,
        ...DIRECTIVES,
    ],
    exports: [
        ...COMPONENT,
        ...ENTRY_COMPONENT
    ],
    providers: [
        DynamicComponentService
    ]
})
export class DynamicFormModule {
}
