/*************************************************************************
 * Copyright (c) 2017 - 2021 深圳市链融科技股份有限公司
 * Shenzhen Lianrong Technology Co., Ltd.
 * All rights reserved.
 *
 * @file：libs\shared\src\lib\services\browser.service.ts
 * @summary：浏览器相关信息
 * @version: 1.0
 * *************************************************************************
 * revision             author            reason             date
 * 1.0                  DengPei           init               2021-12-03
 ***************************************************************************/
import { XnUtils } from '../common/xn-utils';
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export abstract class BrowserService {
  /** 浏览器滚动条宽度 */
  private sbw: number;

  get scrollbarWidth() {
    if (XnUtils.isEmpty(this.sbw)) {
      this.sbw = this.getScrollbarWidth();
    }

    return this.sbw;
  }

  getScrollbarWidth() {
    const outer = document.createElement('div');
    outer.style.visibility = 'hidden';
    outer.style.width = '100px';

    document.body.appendChild(outer);

    const widthNoScroll = outer.offsetWidth;
    outer.style.overflow = 'scroll';

    const inner = document.createElement('div');
    inner.style.width = '100%';
    outer.appendChild(inner);

    const widthWithScroll = inner.offsetWidth;

    outer.parentNode.removeChild(outer);

    return widthNoScroll - widthWithScroll;
  }
}
