/*************************************************************************
 * Copyright (c) 2017 - 2021 深圳市链融科技股份有限公司
 * Shenzhen Lianrong Technology Co., Ltd.
 * All rights reserved.
 *
 * @file：libs\products\abs-gj\src\lib\components\record\memo.component.ts
 * @summary：memo.component.ts
 * @version: 1.0
 * *************************************************************************
 * revision             author            reason             date
 * 1.0                  DengPei           init               2021-11-24
 ***************************************************************************/

import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'lib-memo-gj',
  templateUrl: './memo.component.html',
  styles: [
    `.xn-input-border-radius {
      border-style: dashed;
    }

    .xn-show-input-textarea {
      background-color: #ffffff;
      border-style: dashed;
      resize: none
    }`
  ]
})
export class GjMemoComponent implements OnInit {

  @Input() memo: string;
  /**
   *  1=普通字符串 2=是下面的JSON字符串
   *  {
   *         operatorName: '',
   *         operatorTime: '',
   *         operatorMemo: '',
   *         reviewerName: '',
   *         reviewerTime: '',
   *         reviewerMemo: ''
   *     }
   */
  type: number;
  data: any;

  constructor() {}

  ngOnInit() {
    const pos = this.memo.indexOf(';');
    if (pos > 0) {
      const s = this.memo.substring(0, pos).trim();
      const type = parseInt(s, 0);
      if ([1, 2].includes(type)) {
        this.type = type;
        const data = this.memo.substring(pos + 1).trim();
        if (type === 1) {
          this.data = data;
        } else if (type === 2) {
          this.data = JSON.parse(data);
        }
      } else {
        this.type = 1;
        this.data = this.memo;
      }
    } else {
      this.type = 1;
      this.data = this.memo;
    }
  }
}
