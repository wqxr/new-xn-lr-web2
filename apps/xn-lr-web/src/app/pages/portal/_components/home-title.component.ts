  /*************************************************************************
 * Copyright (c) 2017 - 2020 深圳市链融科技股份有限公司
 * Shenzhen Lianrong Technology Co., Ltd.
 * All rights reserved.
 *
 * @file：xn-lr-web\apps\src\app\pages\portal\_components\home-title.component.ts
 * @summary：init home-title.component.ts
 * @version: 1.0
 * *************************************************************************
 * revision             author            reason             date
 * 1.0                  zigui             init             2020-11-16
 ***************************************************************************/
import { Component, Input } from '@angular/core';
import { StoreService } from '../shared/services/store.service';

  @Component({
  selector: 'home-title',
  template: `
    <div [ngClass]="[store.isPhone ? 'h5-home-title' : 'home-title']">
      <!--      <img src="assets/images/icon/title-bg-left.png">-->
      <!--      <div class="title" [ngStyle]="{color: titleColor}">{{title}}</div>-->
      <!--      <img src="assets/images/icon/title-bg-right.png">-->
      <div class="title-box" [ngStyle]="{color: titleColor}">
        <div class="line-left"></div>
        <div class="title">{{title}}</div>
        <div class="line-right"></div>
      </div>
    </div>`,
  styleUrls: ['./styles.less']
})
export class HomeTitleComponent {
  @Input() title = '';
  @Input() titleColor = '';
  constructor(public store: StoreService) {
  }
}
