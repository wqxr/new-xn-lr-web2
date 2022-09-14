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
      ©深圳市链融科技股份有限公司版权所有 2017-2021<br *ngIf="store.isPhone">
      <a href="http://www.beian.gov.cn/portal/registerSystemInfo?recordcode=44030402004597" target="_blank"></a>&nbsp;
      <img src='assets/lr/img/police.png'><a  href="http://www.beian.gov.cn/portal/registerSystemInfo?recordcode=44030402004597" target="_blank">粤公网安备 44030402004597号</a>&nbsp;&nbsp;
      <a href="http://beian.miit.gov.cn/" target="_blank">粤ICP备17097165号</a>
      <nz-divider style="background-color: #52538a;height: 15px;
      width: 2px;margin: 0 15px;" nzType="vertical"></nz-divider>
      <a href="https://www.lrscft.com/" target="_blank">技术支持服务商：链融科技</a>
    </div>`,
  styleUrls: ['./styles.less'],
})

export class PortalBarComponent {
  @Input() type: string = 'black';
  constructor(public store: StoreService) { }
}
