/*************************************************************************
 * Copyright (c) 2017 - 2020 深圳市链融科技股份有限公司
 * Shenzhen Lianrong Technology Co., Ltd.
 * All rights reserved.
 *
 * @file：xn-lr-web\apps\src\app\layout\global-config.module.ts
 * @summary：init global-config.module.ts
 * @version: 1.0
 * *************************************************************************
 * revision             author            reason             date
 * 1.0                  WuShenghui        init             2020-11-11
 ***************************************************************************/
import { NgModule, ModuleWithProviders } from '@angular/core';
import { XN_LAYOUT } from '@lr/ngx-layout';

@NgModule()
export class GlobalConfigModule {
  static forRoot(): ModuleWithProviders<GlobalConfigModule> {
    return {
      ngModule: GlobalConfigModule,
      providers: [
        {
          provide: XN_LAYOUT,
          useValue: {
            title: '',
            logo: 'assets/logo.svg',
            navTheme: 'dark',
            primaryColor: '#1890FF',
            layout: 'sidemenu',
            contentWidth: 'Fluid',
            fixedHeader: false,
            autoHideHeader: false,
            fixSiderbar: false
          }
        }
      ],
    };
  }
}
