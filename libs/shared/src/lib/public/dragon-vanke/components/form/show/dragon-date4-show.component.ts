/*************************************************************************
* Copyright (c) 2017 - 2021 深圳市链融科技股份有限公司
* Shenzhen Lianrong Technology Co., Ltd.
* All rights reserved.
*
* @file：libs\shared\src\lib\public\dragon-vanke\components\form\show\dragon-date4-show.component.ts
* @summary：日期date4组件show展示
* @version: 1.0
* *************************************************************************
* revision             author            reason             date
* 1.0                 hucongying           init          2021-07-14
***************************************************************************/

import { Component, Input, OnInit, } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { DynamicForm } from '../../../../../common/dynamic-form/dynamic.decorators';

@Component({
  template: `
    <div style="width:100%">
      <div class="form-control xn-input-font xn-input-border-radius">
        {{ label }}
      </div>
    </div>
  `,
})
@DynamicForm({ type: 'date4', formModule: 'dragon-show' })
export class DragonDate4ShowComponent implements OnInit {
  @Input() row: any;
  @Input() form: FormGroup;
  @Input() svrConfig: any;
  label: any;

  constructor() {}

  ngOnInit() {
    if (!!this.row.data) {
      this.label = this.row.data;
    }
  }
}
