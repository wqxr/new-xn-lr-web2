import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PublicModule } from 'libs/shared/src/lib/public/public.module';
import { DynamicFormModule } from 'libs/shared/src/lib/common/dynamic-form/dynamic-form.module';
import { DataModule } from 'libs/console/src/lib/data/data.module';
import { BankPuHuiTongShareModule } from './share/share.module';
import { BankPuHuitongRoutingModule } from './bank-puhuitong-routing.module';
import { BankPuhuiTongComponent } from './pages/bank-list/bank-custom-manager.component';
import { BankExtensionListComponent } from './pages/bank-extension-list/bank-extension-list.component';

const COMPONENTS = [
    BankPuhuiTongComponent,
    BankExtensionListComponent
];

@NgModule({
    imports: [
        CommonModule,
        PublicModule,
        DynamicFormModule,
        BankPuHuiTongShareModule,
        BankPuHuitongRoutingModule,
        DataModule,
    ],
    declarations: [
        ...COMPONENTS
    ],
})
export class BankPuhuitongModule { }
