/*
 * Copyright(c) 2017-2019, 深圳市链融科技股份有限公司
 * Beijing Xiwei Technology Co., Ltd.
 * All rights reserved.
 *
 * @file：SurveyRoutingModule
 * @summary：风控管理- 客户管理模块
 * @version: 1.0
 * **********************************************************************
 * revision             author            reason             date
 * 1.0                 zhyuanan          新增             2019-05-29
 * **********************************************************************
 */

import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {SurveyIndexComponent} from './survey-index.component';
import {SurveyDetailComponent} from './survey-detail.component';

const routes: Routes = [
    {path: '', component: SurveyIndexComponent},
    {path: 'survey', component: SurveyDetailComponent},
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class SurveyRoutingModule {
}
