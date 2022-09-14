/*************************************************************************
 * Copyright (c) 2017 - 2020 深圳市链融科技股份有限公司
 * Shenzhen Lianrong Technology Co., Ltd.
 * All rights reserved.
 *
 * @file：xn-lr-web\apps\src\app\pages\portal\_components\step-tip.component.ts
 * @summary：init step-tip.component.ts
 * @version: 1.0
 * *************************************************************************
 * revision             author            reason             date
 * 1.0                  zigui             init             2020-11-17
 ***************************************************************************/
import { Component, Input } from '@angular/core';
import { StoreService } from '../shared/services/store.service';

@Component({
  selector: 'portal-bar',
  template: `
    <div [ngClass]="{'portal-bar-black': type === 'black', 'portal-bar-blue': type === 'blue', 'h5-portal-bar': type === 'h5'}">
      ©深圳市链融科技股份有限公司版权所有 2017-2022 1.16.7<br *ngIf="store.isPhone">
      <img *ngIf="!store.isPhone" src='assets/lr/img/police.png'>
      <a href="http://www.beian.gov.cn/portal/registerSystemInfo?recordcode=44030402004002" target="_blank">粤公网安备 44030402004002号</a>&nbsp;&nbsp;&nbsp;
      <a href="http://beian.miit.gov.cn/" target="_blank">粤ICP备17097165号</a>&nbsp;&nbsp;&nbsp;
      <a *ngIf="!!isBlockChain" href="https://bcbeian.ifcert.cn/search-result" target="_blank">粤网信备44030520701478930010号</a>
    </div>`,
  styleUrls: ['./styles.less'],
})

export class PortalBarComponent {
  @Input() type: string = 'black';
  @Input() isBlockChain: boolean = false;
  constructor(public store: StoreService) {}
}
