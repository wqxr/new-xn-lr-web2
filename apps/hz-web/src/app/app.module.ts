import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { DefaultInterceptor } from 'libs/shared/src/lib/services/default-interceptor';
import { NgZorroAntDModule } from './ng-zorro-antd';
import { XnACLModule } from '@lr/ngx-acl';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

import { IndexComponent as OaIndexComponent } from './pages/oa/index.component';
import { JumpComponent } from './pages/oa/jump.component';

import { RouteReuseStrategy } from '@angular/router';
import { CustomReuseStrategy } from 'libs/shared/src/lib/reuse-strategy';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { LayoutModule } from './layout/layout.module';
import { PublicModule } from 'libs/shared/src/lib/public/public.module';
import { NzStepsModule } from 'ng-zorro-antd/steps';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzConfig, NZ_CONFIG } from 'ng-zorro-antd/core/config';
import { PdfViewService } from 'libs/shared/src/lib/services/pdf-view.service';
import { UnsupportedBrowserComponent } from './pages/unsupported-browser.component';

import { NzIconService, NZ_ICONS } from 'ng-zorro-antd/icon';
import { IconDefinition } from '@ant-design/icons-angular';
import * as AllIcons from '@ant-design/icons-angular/icons';
// import { XnLayoutModule } from 'libs/xn-web-libs/lr/ngx-layout/src/lib/layout.module';

const antDesignIcons = AllIcons as {
  [key: string]: IconDefinition;
};
const icons = Object.keys(antDesignIcons).map((key) => antDesignIcons[key]);

const ngZorroConfig: NzConfig = {
    // 注意组件名称没有 nz 前缀
    message: { nzTop: 120 },
    notification: { nzTop: 240 }
  };
@NgModule({
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        NgZorroAntDModule,
        XnACLModule.forRoot(),
        LayoutModule,
        // SortablejsModule.forRoot({ animation: 150 }),
        HttpClientModule,
        AppRoutingModule,
        PublicModule,
        NzStepsModule,
       // NzIconModule.forRoot(icons)

    ],
    declarations: [
        AppComponent,
        OaIndexComponent,
        JumpComponent,
        UnsupportedBrowserComponent,
    ],
    providers: [
        NzMessageService,
        PdfViewService,
        { provide: RouteReuseStrategy, useClass: CustomReuseStrategy },
        { provide: NZ_CONFIG, useValue: ngZorroConfig },
        { provide: HTTP_INTERCEPTORS, useClass: DefaultInterceptor, multi: true },
        { provide: NZ_ICONS, useValue: icons },
    ],
    bootstrap: [AppComponent]
})
export class AppModule {
  constructor(private iconService: NzIconService) {
    this.iconService.fetchFromIconfont({
      scriptUrl: 'assets/iconfont/iconfont.js'
    });
  }

}
