/*************************************************************************
 * Copyright (c) 2017 - 2020 深圳市链融科技股份有限公司
 * Shenzhen Lianrong Technology Co., Ltd.
 * All rights reserved.
 *
 * @file：xn-lr-web\apps\src\app\pages\portal\block-chain-browser\block-chain-browser.module.ts
 * @summary：init block-chain-browser.module.ts
 * @version: 1.0
 * *************************************************************************
 * revision             author            reason             date
 * 1.0                  zigui              init             2020-11-11
 ***************************************************************************/
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';
import { BlockChainBrowserRoutingModule } from './block-chain-browser-routing.module';
import { InfoComponent } from './info/info.component';
import { DetailComponent } from './detail/detail.component';
import { BlockChainBrowserComponent } from './block-chain-browser.component';
import { Components } from './_components';
import { LayoutComponent } from './layout/layout.component';


@NgModule({
  declarations: [InfoComponent, DetailComponent, BlockChainBrowserComponent, ...Components, LayoutComponent],
  imports: [
    CommonModule,
    BlockChainBrowserRoutingModule,
    FormsModule,
    SharedModule,
    ReactiveFormsModule,
  ],
  exports: [...Components],
})
export class BlockChainBrowserModule { }
