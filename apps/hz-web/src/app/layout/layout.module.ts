import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FactoringBusinessModule } from 'libs/products/avenger/src/lib/factoring-business/factoring-business.module';
import { XnLayoutModule } from '@lr/ngx-layout';

import { NewPortalFooterComponent } from './default/new-portal-footer.component';

import { NewConsoleHeaderComponent } from './admin/new-console-header.component';

import { BlankLayoutComponent } from './blank-layout/blank-layout.component';
import { NzAvatarModule } from 'ng-zorro-antd/avatar';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzBackTopModule } from 'ng-zorro-antd/back-top';
import { BasicLayoutComponents } from './basic-layout';
import { GlobalConfigModule } from './global-config.module';
import { NgZorroAntDModule } from '../ng-zorro-antd';

const COMPONENTS = [
    NewPortalFooterComponent,

    NewConsoleHeaderComponent,
    BlankLayoutComponent,
    ...BasicLayoutComponents,
];

@NgModule({
    imports: [
        CommonModule,
        RouterModule,
        XnLayoutModule,
        NzAvatarModule,
        NzDropDownModule,
        NzBackTopModule,
        NgZorroAntDModule,
        NzIconModule,
        GlobalConfigModule.forRoot(),
        FactoringBusinessModule
    ],
    declarations: [...COMPONENTS],
    exports: [...COMPONENTS]
})
export class LayoutModule { }
