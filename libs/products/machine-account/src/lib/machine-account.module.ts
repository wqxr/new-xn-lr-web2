import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MachineAccountRoutingModule } from './machine-account-routing.module';
import { PublicModule } from 'libs/shared/src/lib/public/public.module';
import { DynamicFormModule } from 'libs/shared/src/lib/common/dynamic-form/dynamic-form.module';
import { DataModule } from 'libs/console/src/lib/data/data.module';
import { MachineAccountShareModule } from './share/share.module';
import { ZhongdengListComponent } from './pages/zhongdeng-list/zhongdeng-list.component';
import { ZhongdengFlowComponent } from './pages/zhongdeng-flow/zhongdeng-flow.component';
import { ZhongdengComponent } from './pages/zhongdeng-flow/zhongdeng.component';
import { ZhongdengRecordComponent } from './pages/zhongdeng-record/zhongdeng-record.component';
import { SortablejsModule } from 'ngx-sortablejs';

const COMPONENTS = [
    ZhongdengListComponent,
    ZhongdengFlowComponent,
    ZhongdengComponent,
    ZhongdengRecordComponent,
];

@NgModule({
    imports: [
        CommonModule,
        PublicModule,
        DynamicFormModule,
        MachineAccountShareModule,
        MachineAccountRoutingModule,
        DataModule,
        SortablejsModule,

    ],
    declarations: [
        ...COMPONENTS
    ],
})
export class MachineAccountModule { }
