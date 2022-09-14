import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { DynamicFormModule } from 'libs/shared/src/lib/common/dynamic-form/dynamic-form.module';
import { DragonVankeShareModule } from 'libs/shared/src/lib/public/dragon-vanke/share.module';
import { PublicModule } from 'libs/shared/src/lib/public/public.module';
import { SortablejsModule } from 'ngx-sortablejs';
import { CountryGradenRoutingModule } from './country-graden-routing.component';
import { CountryGradenComponent } from './country-graden.component';
import { CountryGradenDatalockingComponent } from './pages/country-graden-data-docking/country-graden-data-docking.component';
import { CountryGradenShareModule } from './share/share.module';
import { MachineListComponent } from './pages/machine-list/machine-list.component'
import { BatchModifyComponent } from './pages/batch-modify/batch-modify.component';
import { CountryGradenUploadPaymentsComponent } from './pages/upload-payment-confirmation/upload-payment-confirmation.component';
import { EstateCountryGradenComponent } from './pages/estate-country-graden/country-graden.component'
import { CountryGradenTransferContractManagerComponent } from './pages/contract-template/contract-template.component'
import { BusinessMatchmakerListComponent } from './pages/business-matchmaker-manager/business-matchmaker-list.component'
import { GradenHomeCommListComponent } from './pages/country-graden/home-comm-list.component'
import { CountryGradenAvengerListComponent } from './pages/approval-list/avenger-list.component'
import { CountryGradenEnterpoolComponent } from './pages/assets-management/enter-capital-tool/enter-capital-pool-confirmation.component'
import { CountryGradenSecondTransferContractManagerComponent } from './pages/assets-management/contract-template/contract-template.component'
import { CountryGradenProjectmanageComponent } from './pages/assets-management/country-graden-project-manager/country-graden-project-management.component'
import { CountryGradenProjectmanagePlanComponent } from './pages/assets-management/country-graden-project-manager/country-graden-project-plan-list/country-graden-project-plan-list.component'
import { CountryGradenCapitalpoolComponent } from './pages/assets-management/country-graden-project-manager/country-graden-capital-pool/country-graden-capital-pool.component'
import { CopuntryGradenCapitalProductInfoComponent } from './pages/assets-management/country-graden-project-manager/capital-product-info/capital-product-info.component'
import { CapitalDataAnalyseComponent } from './pages/assets-management/country-graden-project-manager/capital-data-analyse/capital-data-analyse.component'
import { CapitalSampleComponent } from './pages/assets-management/country-graden-project-manager/capital-sample/capital-sample.component'
import { CountryGradenNoticeManageComponent } from './pages/assets-management/country-graden-project-manager/country-graden-notice-manage/country-graden-notice-manage-list.component'

const COMPONENTS = [
  CountryGradenComponent,
  CountryGradenDatalockingComponent,
  MachineListComponent,
  BatchModifyComponent,
  CountryGradenUploadPaymentsComponent,
  EstateCountryGradenComponent,
  CountryGradenTransferContractManagerComponent,
  BusinessMatchmakerListComponent,
  GradenHomeCommListComponent,
  CountryGradenAvengerListComponent,
  CountryGradenEnterpoolComponent,
  CountryGradenSecondTransferContractManagerComponent,
  CountryGradenProjectmanageComponent,
  CountryGradenProjectmanagePlanComponent,
  CountryGradenCapitalpoolComponent,
  CopuntryGradenCapitalProductInfoComponent,
  CapitalDataAnalyseComponent,
  CapitalSampleComponent,
  CountryGradenNoticeManageComponent
]

@NgModule({
  declarations: [...COMPONENTS],
  imports: [
    CommonModule,
    DynamicFormModule,
    PublicModule,
    CountryGradenShareModule,
    CountryGradenRoutingModule,
    SortablejsModule,
    DragonVankeShareModule
  ],
  exports: [...COMPONENTS]
})
export class CountryGradenModule { }
