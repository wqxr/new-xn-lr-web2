/*************************************************************************
 * Copyright (c) 2017 - 2021 深圳市链融科技股份有限公司
 * Shenzhen Lianrong Technology Co., Ltd.
 * All rights reserved.
 *
 * @file：libs\products\abs-gj\src\lib\components\form\show\contract-select\index.component.ts
 * @summary：index.component.ts
 * @version: 1.0
 * *************************************************************************
 * revision             author            reason             date
 * 1.0                  DengPei           init               2021-11-29
 ***************************************************************************/

import { ChangeDetectionStrategy, Component, OnInit, ElementRef, Input, ChangeDetectorRef } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { DynamicForm } from 'libs/shared/src/lib/common/dynamic-form/dynamic.decorators';
import { XnService } from 'libs/shared/src/lib/services/xn.service';

@Component({
  template: `
    <div style='width:100%'>
      <div class="form-control xn-input-font xn-input-border-radius">
        <div class="label-line">{{label}}</div>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,

})
@DynamicForm({type: 'contract-select-gj', formModule: 'dragon-show'})
export class GjContractSelectShowComponent implements OnInit {

  @Input() row: any;
  @Input() form: FormGroup;
  @Input() svrConfig?: any;
  label: any;

  constructor(private er: ElementRef, private xn: XnService,
              private cdr: ChangeDetectorRef,) {
  }

  ngOnInit() {
    if (!!this.row.data) {
      this.label = this.row.data;
    }
  }
}
