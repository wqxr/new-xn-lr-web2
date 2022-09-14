import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DynamicFormModule } from 'libs/shared/src/lib/common/dynamic-form/dynamic-form.module';
import { PublicModule } from 'libs/shared/src/lib/public/public.module';
import { NewAgileRoutingModule } from './new-agile-routing.module';
import { SortablejsModule } from 'ngx-sortablejs';
import { NewAgileShareModule } from './share/share.module';
import { ConsoleComponents } from './pages/console';
import { TransactionsListComponent } from './pages/common/transactions-list.component';
import { VnakeModeComponents } from './pages/vnake-mode';
import { Service as BankManagementService } from './pages/vnake-mode';
import { SupplierUnsignedContractComponent } from './pages/unsigned-contract/supplier-unsigned-contract.component';
import { PaymentComponent } from './pages/payment/payment.component';
import { ManagesComponents } from './pages/manage';
import { CapitalPoolComponents } from './pages/capital-pool';
import { NewAgileComponent } from './pages/new-agile/new-agile.component';

import { NewAgileProjectmanageComponent } from './pages/newAgile-project-manager/newAgile-project-management.component';
import { NewAgileProjectmanagePlanComponent } from './pages/newAgile-project-manager/newAgile-project-plan-list/newAgile-project-plan-list.component';
import { NewAgileCapitalpoolComponent } from './pages/newAgile-project-manager/newAgile-capital-pool/newAgile-capital-pool.component';
import { NewAgileNoticeManageComponent } from './pages/newAgile-project-manager/newAgile-notice-manage/newAgile-notice-manage-list.component';
import { CapitalSampleComponent } from './pages/newAgile-project-manager/capital-sample/capital-sample.component';
import { CapitalDataAnalyseComponent } from './pages/newAgile-project-manager/capital-data-analyse/capital-data-analyse.component';
import { NewAgileCapitalProductInfoComponent } from './pages/newAgile-project-manager/capital-product-info/capital-product-info.component';
import {NewAgileEnterpoolComponent} from './pages/enter-capital-tool/enter-capital-pool-confirmation.component'

const COMPONENTS = [
    ...VnakeModeComponents,
    ...ManagesComponents,
    ...CapitalPoolComponents,
    ...ConsoleComponents,
    TransactionsListComponent,
    SupplierUnsignedContractComponent,
    PaymentComponent,
    NewAgileComponent,
    NewAgileProjectmanageComponent,
    NewAgileProjectmanagePlanComponent,
    NewAgileCapitalpoolComponent,
    NewAgileNoticeManageComponent,
    CapitalSampleComponent,
    CapitalDataAnalyseComponent,
    NewAgileCapitalProductInfoComponent,
    NewAgileEnterpoolComponent
];

const SERVICES = [
    BankManagementService,
];

@NgModule({
    imports: [
        CommonModule,
        DynamicFormModule,
        PublicModule,
        NewAgileShareModule,
        NewAgileRoutingModule,
        SortablejsModule,
    ],
    declarations: [
        ...COMPONENTS,
    ],
    providers: [
        ...SERVICES,
    ]
})
export class NewAgileModule { }
