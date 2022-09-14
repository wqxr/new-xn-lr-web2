import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MyDataRoutingModule } from './mydata-routing.component';
import { EnterpriseComponent } from './pages/enterprise.component'
import { ClientMapComponent } from './pages/client-map.component';
import {PiaojcComponent} from './pages/piaojc.component';
import {MoneyTableComponent} from './pages/money-table.component';
import { PublicModule } from 'libs/shared/src/lib/public/public.module';
import {PlanManageComponent} from './pages/plan-manage.component';
import {ReportFormListComponent} from './pages/report-form-list.component';
import {ReportingListComponent} from './pages/reporting-list.component';
import {ReportingDetailComponent} from './pages/reporting-detail.component';
@NgModule({
    imports: [
        CommonModule,
        MyDataRoutingModule,
        PublicModule,
    ],
    declarations: [EnterpriseComponent,
        ClientMapComponent,
        PiaojcComponent,
        MoneyTableComponent,
        PlanManageComponent,
        ReportFormListComponent,
        ReportingListComponent,
        ReportingDetailComponent

    ]
})
export class MyDataModule { }
