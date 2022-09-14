/*************************************************************************
 * Copyright (c) 2017 - 2021 深圳市链融科技股份有限公司
 * Shenzhen Lianrong Technology Co., Ltd.
 * All rights reserved.
 *
 * @file：libs\products\abs-gj\src\lib\components\formly-form\per-data-picker\per-data-picker.component.ts
 * @summary：per-data-picker.component.ts
 * @version: 1.0
 * *************************************************************************
 * revision             author            reason             date
 * 1.0                  DengPei           init               2021-12-11
 ***************************************************************************/
import { Component, ChangeDetectionStrategy, OnInit, ChangeDetectorRef } from '@angular/core';
import { FieldType } from '@ngx-formly/core';
import { DEFAULT_DATE_TIME_OPTIONS } from 'libs/shared/src/lib/config/constants';
import { IsPerformanceOptions } from 'libs/shared/src/lib/config/options/abs-gj.options';
import { YesOrNo } from 'libs/shared/src/lib/config/enum/abs-gj.enum';
import { endOfDay, startOfDay } from 'date-fns';

@Component({
  selector: 'lib-formly-field-per-data-picker',
  template: `
    <nz-input-group [nzAddOnBefore]="addOnBeforeTemplate">
      <nz-range-picker
        [(ngModel)]="rangeDate"
        [nzFormat]="nzFormat"
        [nzDisabled]="!selectRes"
        [nzRanges]="pickerConfig.nzRanges"
        (ngModelChange)="pickerChange($event)"
      ></nz-range-picker>
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
export class GjFormlyFieldPerDataPickerComponent extends FieldType implements OnInit {
  hNOptions = IsPerformanceOptions;
  pickerConfig = DEFAULT_DATE_TIME_OPTIONS;
  nzFormat = 'yyyy-MM-dd';
  /** 用于在 model 里记录下拉框所选的结果，恢复【展开、折叠】操作后被清除的记录 */
  selectKey = 'isHeadPreDate';

  selectRes: number;
  rangeDate: Date[];

  constructor(private cdr: ChangeDetectorRef) {
    super();
  }

  /** 【展开、折叠】操作会导致组件重新加载 */
  ngOnInit() {
    // console.log(this.model);
    if (Reflect.has(this.model, this.selectKey) && typeof this.model[this.selectKey] === 'number') {
      this.selectRes = this.model[this.selectKey];
      if (this.selectRes === YesOrNo.No) {
        this.formControl.setValue(null);
        this.rangeDate = null;
      }
      if (this.selectRes === YesOrNo.Yes) {
        this.formControl.setValue(this.model[this.field.key as string]);
        this.rangeDate = this.model[this.field.key as string];
      }
    }
    this.cdr.markForCheck();
  }

  selectChange(ev: number) {
    this.selectRes = ev;
    this.model[this.selectKey] = ev;
    if (ev === YesOrNo.No) {
      this.rangeDate = null;
      this.formControl.setValue(null);
      this.model[this.field.key as string] = null;
    }
    if (ev === YesOrNo.Yes) {
      this.pickerChange(this.defaultCreateTime());
    }
  }

  pickerChange(ev: Date[]) {
    this.rangeDate = ev;
    this.formControl.setValue(ev);
    this.model[this.field.key as string] = ev;
  }

  defaultCreateTime() {
    return [
      startOfDay(new Date().setFullYear(new Date().getFullYear() - 1)),
      endOfDay(new Date())
    ];
  }
}
