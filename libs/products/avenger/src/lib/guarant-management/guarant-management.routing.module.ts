import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import { GuarantManagementTemplateComponent } from './guarant-management.template/guarant-management.template.component';
import { GuarantManagementReportTemplateComponent } from './guarant-management-report.template/guarant-management-report.template';
import {ReportDetailComponent} from './guarant-report-detail.template/report-detail.component';
import {CheckDetailComponent} from './guarant-check-detail.template/check-detail.component';
const routes: Routes = [
    {
        path: '',
        component: GuarantManagementTemplateComponent,
    },
    {
        path: 'get-report',
        component : GuarantManagementReportTemplateComponent
    },
    {
        path : 'view-exceptions',
        component: GuarantManagementReportTemplateComponent
    },
    {
        path: 'report-detail',
        component: ReportDetailComponent
    },
    {
        path: 'check-detail',
        component: CheckDetailComponent
    }

];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class GuarantManagementRoutingModule {
}
