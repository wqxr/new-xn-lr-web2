/*************************************************************************
 * Copyright (c) 2017 - 2021 深圳市链融科技股份有限公司
 * Shenzhen Lianrong Technology Co., Ltd.
 * All rights reserved.
 *
 * @file：libs\products\abs-gj\src\lib\components\formly-form\per-text\per-text.component.ts
 * @summary：per-text.component.ts
 * @version: 1.0
 * *************************************************************************
 * revision             author            reason             date
 * 1.0                  DengPei           init               2021-12-11
 ***************************************************************************/
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FieldType } from '@ngx-formly/core';
import { IsPerformanceOptions } from 'libs/shared/src/lib/config/options/abs-gj.options';
import { YesOrNo } from 'libs/shared/src/lib/config/enum/abs-gj.enum';

@Component({
  selector: 'lib-formly-field-per-data-picker',
  template: `
    <nz-input-group [nzAddOnBefore]="addOnBeforeTemplate">
      <input
        [disabled]="!selectRes"
        type="text" nz-input
        [ngModel]="inputValue"
        (ngModelChange)="inputChange($event)" />
    </nz-input-group>
    <ng-template #addOnBeforeTemplate>
      <nz-select [ngModel]="selectRes" (ngModelChange)="selectChange($event)" style="width: 60px">
        <nz-option *ngFor="let item of hNOptions" [nzLabel]="item.label" [nzValue]="item.value"></nz-option>
      </nz-select>
    </ng-template>
  `,
  styles: [``],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GjFormlyFieldPerTextComponent extends FieldType implements OnInit {
  hNOptions = IsPerformanceOptions;
  /** 用于在 model 里记录下拉框所选的结果，恢复【展开、折叠】操作后被清除的记录 */
  selectKey = 'capitalPoolStatus';

  selectRes: number;
  inputValue: string;

  constructor(private cdr: ChangeDetectorRef) {
    super();
  }

  /** 【展开、折叠】操作会导致组件重新加载 */
  ngOnInit() {
    console.log(this.model);
    if (Reflect.has(this.model, this.selectKey) && typeof this.model[this.selectKey] === 'number') {
      this.selectRes = this.model[this.selectKey];
      if (this.selectRes === YesOrNo.No) {
        this.formControl.setValue(null);
        this.inputValue = null;
      }
      if (this.selectRes === YesOrNo.Yes) {
        this.formControl.setValue(this.model[this.field.key as string]);
        this.inputValue = this.model[this.field.key as string];
      }
    }
    this.cdr.markForCheck();
  }

  selectChange(ev: number) {
    this.selectRes = ev;
    this.model[this.selectKey] = ev;
    if (ev === YesOrNo.No) {
      this.inputValue = null;
      this.formControl.setValue(null);
      this.model[this.field.key as string] = null;
    }
  }

  inputChange(ev: string) {
    this.inputValue = ev;
    this.formControl.setValue(ev);
    this.model[this.field.key as string] = ev;
  }
}
