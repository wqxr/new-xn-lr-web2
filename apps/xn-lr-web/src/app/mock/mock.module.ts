import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { CommonModule, LocationStrategy, HashLocationStrategy } from '@angular/common';

import { FactoringBusinessModule } from 'libs/products/avenger/src/lib/factoring-business/factoring-business.module';
import { DynamicFormModule } from 'libs/shared/src/lib/common/dynamic-form/dynamic-form.module';
import { PublicModule } from 'libs/shared/src/lib/public/public.module';
import { DataModule } from 'libs/console/src/lib/data/data.module';
import { MockRoutingModule } from './mock-routing.module';

import { MockIndexComponent } from './index.component';
import { MockInputIndexComponent } from './input/index.component';
import { MockShowIndexComponent } from './show/index.component';

import { ApiService } from 'libs/shared/src/lib/services/api.service';
import { AvengerApiService } from 'libs/shared/src/lib/services/avenger-api.service';
import { FileAdapterService } from 'libs/shared/src/lib/services/file-adapter.service';
import { AuthGuard } from 'libs/shared/src/lib/services/auth-guard.service';
import { ModalService } from 'libs/shared/src/lib/services/modal.service';
import { MsgBoxService } from 'libs/shared/src/lib/services/msg-box.service';
import { UserService } from 'libs/shared/src/lib/services/user.service';
import { NavService } from 'libs/shared/src/lib/services/nav.service';
import { LoadingService } from 'libs/shared/src/lib/services/loading.service';
import { XnService } from 'libs/shared/src/lib/services/xn.service';
import { PublicCommunicateService } from 'libs/shared/src/lib/services/public-communicate.service';
import { InvoiceUploadService } from 'libs/shared/src/lib/services/invoice-upload.service';
import { LoadingPercentService } from 'libs/shared/src/lib/services/loading-percent.service';
import { UploadPicService } from 'libs/shared/src/lib/services/upload-pic.service';
import { ContractTypeCommunicateService } from 'libs/shared/src/lib/services/contract-type-communicate.service';
import { BankCardCommunicateService } from 'libs/shared/src/lib/services/bank-card-communicate.service';
import { HwModeService } from 'libs/shared/src/lib/services/hw-mode.service';
import { DateCommunicateService } from 'libs/shared/src/lib/services/date-communicate.service';
import { MoneyCommunicateService } from 'libs/shared/src/lib/services/money-communicate.service';
import { IslcCommunicateService } from 'libs/shared/src/lib/services/islc-communicate.service';
import { BankPublicCommunicateService } from 'libs/shared/src/lib/services/bank-public-communicate.service';
import { LocalStorageService } from 'libs/shared/src/lib/services/local-storage.service';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { DefaultInterceptor } from 'libs/shared/src/lib/services/default-interceptor';
import { AvengerSharedModule } from 'libs/products/avenger/src/lib/shared/shared.module';
import { DragonVankeShareModule } from 'libs/shared/src/lib/public/dragon-vanke/share.module';
import { DragonApiService } from 'libs/shared/src/lib/services/api-extra.service';
import { MachineAccountShareModule } from 'libs/products/machine-account/src/lib/share/share.module';

@NgModule({
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        CommonModule,
        HttpClientModule,
        MockRoutingModule,
        FactoringBusinessModule,
        DynamicFormModule,
        PublicModule,
        DataModule,
        AvengerSharedModule,
        DragonVankeShareModule,
        MachineAccountShareModule
    ],
    declarations: [
        MockIndexComponent,
        MockInputIndexComponent,
        MockShowIndexComponent,
    ],
    providers: [
        ApiService,
        AvengerApiService,
        FileAdapterService,
        AuthGuard,
        ModalService,
        MsgBoxService,
        UserService,
        NavService,
        LoadingService,
        XnService,
        DragonApiService,
        // 组建通讯
        PublicCommunicateService,
        InvoiceUploadService,
        LoadingPercentService, // 百分比上传loading
        UploadPicService,
        ContractTypeCommunicateService,
        BankCardCommunicateService,
        HwModeService,
        DateCommunicateService,
        MoneyCommunicateService,
        IslcCommunicateService,
        BankPublicCommunicateService,
        LocalStorageService,
        DragonApiService,

        { provide: LocationStrategy, useClass: HashLocationStrategy },
        { provide: HTTP_INTERCEPTORS, useClass: DefaultInterceptor, multi: true },
    ],
    bootstrap: [MockIndexComponent]
})
export class MockModule {
    constructor() {
    }
}
