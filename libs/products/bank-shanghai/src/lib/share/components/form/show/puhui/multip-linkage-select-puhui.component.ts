/*************************************************************************
* Copyright (c) 2017 - 2021 深圳市链融科技股份有限公司
* Shenzhen Lianrong Technology Co., Ltd.
* All rights reserved.
*
* @file：libs\products\bank-shanghai\src\lib\share\components\form\input\puhui\multip-linkage-select-puhui.component.ts
* @summary：上海银行普惠开户-注册地址三级下拉选择框show组件
* @version: 1.0
* *************************************************************************
* revision             author            reason             date
* 1.0                 hucongying           init          2021-07-14
***************************************************************************/

import { Component, Input, OnInit, ElementRef } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { DynamicForm } from 'libs/shared/src/lib/common/dynamic-form/dynamic.decorators';
import { XnUtils } from 'libs/shared/src/lib/common/xn-utils';
import { Area, City, Provice, SelectValue } from '../../input/puhui/multip-linkage-select-puhui.component';

@Component({
  template: `
    <div style="display: flex;">
      <div class="xn-mselect-right" style="flex: 1;">
        <!-- 省 -->
        <div class="form-control xn-input-font xn-input-border-radius">
          {{ provice.provice }}
        </div>
      </div>
      <!-- 市 -->
      <div
        class="xn-mselect-right xn-mselect-left"
        style="flex: 1;"
      >
        <div class="form-control xn-input-font xn-input-border-radius">
          {{ city.city }}
        </div>
      </div>
      <!-- 区 -->
      <div class="xn-mselect-left" *ngIf="area?.area" style="flex: 1;">
        <div class="form-control xn-input-font xn-input-border-radius">
          {{ area.area }}
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      .xn-mselect-right {
        padding-right: 2px;
      }
      .xn-mselect-left {
        padding-left: 2px;
      }
    `,
  ],
})
@DynamicForm({
  type: 'multip-linkage-select-puhui',
  formModule: 'dragon-show',
})
export class PujuiMultipLinkageSelectShowComponent implements OnInit {
  @Input() row: any;
  @Input() form: FormGroup;
  // 组件value
  public ctrlValue: SelectValue;
  /** 省 */
  public provice: Provice;
  /** 市 */
  public city: City;
  /** 区 */
  public area: Area;

  constructor(private er: ElementRef) { }

  ngOnInit() {
    // 设置初始值
    if (!!this.row.data) {
      const valObj = XnUtils.parseObject(this.row.data);
      this.ctrlValue = XnUtils.deepClone(valObj);
      this.provice = this.ctrlValue.provice
      this.city = this.ctrlValue.city
      this.area = this.ctrlValue.area
    }
  }
}
