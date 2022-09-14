/*************************************************************************
 * Copyright (c) 2017 - 2020 深圳市链融科技股份有限公司
 * Shenzhen Lianrong Technology Co., Ltd.
 * All rights reserved.
 *
 * @file：xn-lr-web\apps\src\app\layout\basic-layout\components\header-right-content\header-right-content.component.ts
 * @summary：init header-right-content.component.ts
 * @version: 1.0
 * *************************************************************************
 * revision             author            reason             date
 * 1.0                  WuShenghui        init             2020-11-11
 ***************************************************************************/
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { MenuTheme } from '@lr/ngx-layout';

@Component({
  selector: 'header-right-content',
  templateUrl: 'header-right-content.component.html',
  styleUrls: ['./header-right-content.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderRightContentComponent {
  @Input() theme!: MenuTheme;
  @Input() layout!: string;

  constructor() {}
}
