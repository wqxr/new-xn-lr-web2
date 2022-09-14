/*************************************************************************
* Copyright (c) 2017 - 2021 深圳市链融科技股份有限公司
* Shenzhen Lianrong Technology Co., Ltd.
* All rights reserved.
*
* @file：libs\products\bank-shanghai\src\lib\share\components\form\show\puhui\phone-code-show.component.ts
* @summary：获取手机验证码组件的show展示
* @version: 1.0
* *************************************************************************
* revision             author            reason             date
* 1.0                 hucongying           init          2021-08-03
***************************************************************************/

import { Component, Input, OnInit, ViewContainerRef } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { DynamicForm } from 'libs/shared/src/lib/common/dynamic-form/dynamic.decorators';
import { XnService } from 'libs/shared/src/lib/services/xn.service';


@Component({
  template: `
    <div class="form-control xn-input-font xn-input-border-radius" style='height:auto;min-height:34px'>
      <div class="label-line">
        {{ label }}
      </div>
    </div>
    `,
  styleUrls: []
})
@DynamicForm({ type: 'code-phone-input', formModule: 'dragon-show' })
export class CodePhoneShowComponent implements OnInit {
  @Input() row: any;
  @Input() form: FormGroup;
  @Input() svrConfig: any;
  public label: any = '';

  constructor(
    private xn: XnService,
    private vcr: ViewContainerRef) {
  }

  ngOnInit() {
    const data = this.row.data;
    if (data) {
      this.label = data;
    }
  }
}
