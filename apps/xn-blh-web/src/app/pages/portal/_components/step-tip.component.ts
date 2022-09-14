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

@Component({
  selector: 'step-tip',
  template: `
    <div class="step-tip">
      <div class="border" [ngStyle]="tipStyle" nz-button nzPopoverOverlayClassName="step-tip-popover" nz-popover [nzPopoverTitle]="null" [nzPopoverContent]="contentTemplate" nzPopoverPlacement="right">
        <div class="serial">{{serial}}</div>
      </div>
      <ng-template #contentTemplate>
        <div class="step-tip-popover-content ">
          <div class="serial">{{serial}}</div>
          <div class="desc" [innerHTML]="desc | html"></div>
        </div>
      </ng-template>
    </div>`,
  styleUrls: ['./styles.less'],
})

export class StepTipComponent {
  // 边框大小和位置
  @Input() tipStyle: object;
  // 提示内容序号
  @Input() serial = 1;
  // 提示内容
  @Input() desc: any = '';
  // nzPopoverVisibleChange(isShow) {
  //   // 设置提示框内容内边距
  //   if (isShow) {
  //     const dom: any = document.getElementsByClassName('ant-popover-inner-content');
  //     setTimeout(() => {
  //       dom[0].style.padding = '15px';
  //     }, 0);
  //   }
  // }
}
