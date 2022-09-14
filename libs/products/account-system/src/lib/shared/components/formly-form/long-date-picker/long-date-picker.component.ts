/*************************************************************************
 * Copyright (c) 2017 - 2021 深圳市链融科技股份有限公司
 * Shenzhen Lianrong Technology Co., Ltd.
 * All rights reserved.
 *
 * @file：libs\products\account-system\src\lib\shared\components\formly-form\date-picker\date-picker.component.ts
 * @summary：XnFormlyFieldLongDatePicker
 * @version: 1.0
 * *************************************************************************
 * revision             author            reason             date
 * 1.0                HuCongying           init           2021-11-17
 ***************************************************************************/
import {
  Component,
  ChangeDetectionStrategy,
  OnInit,
  ViewEncapsulation,
  ViewChild,
} from '@angular/core';
import { FieldType } from '@ngx-formly/core';
import { NzDatePickerComponent } from 'ng-zorro-antd/date-picker';
import { LONG_DATE } from '../../../constants';

@Component({
  selector: 'xn-formly-field-long-date-picker',
  template: `
    <nz-date-picker
      [formControl]="formControl"
      [formlyAttributes]="field"
      [nzAllowClear]="to.nzAllowClear"
      [nzAutoFocus]="to.nzAutoFocus"
      [nzDisabled]="to.nzDisabled"
      [nzInputReadOnly]="to.nzInputReadOnly"
      [nzDisabledDate]="to.nzDisabledDate"
      [nzFormat]="to.nzFormat"
      [nzPlaceHolder]="to.nzPlaceHolder"
      [nzPopupStyle]="to.nzPopupStyle"
      [nzDropdownClassName]="to.nzDropdownClassName"
      [nzSize]="to.nzSize"
      [nzDefaultPickerValue]="to.nzDefaultPickerValue"
      [nzDateRender]="to.nzDateRender"
      [nzDisabledTime]="to.nzDisabledTime"
      [nzRenderExtraFooter]="extraTemplate"
      [nzShowToday]="to.nzShowToday"
      [ngModel]="defaultValue"
      [nzMode]="to.nzMode"
      [nzShowTime]="to.nzShowTime"
      [nzSuffixIcon]="to.nzSuffixIcon"
      (nzOnPanelChange)="to.nzOnPanelChange($event)"
      (nzOnCalendarChange)="to.nzOnCalendarChange($event)"
      (nzOnOpenChange)="to.nzOnOpenChange($event)"
      (ngModelChange)="to.nzOnChange($event)"
      (nzOnOk)="to.nzOnOk($event)"
      #datePicker
    ></nz-date-picker>
    <ng-template #extraTemplate>
      <div style="text-align: center;">
        <a (click)="setLongDate()">长期有效</a>
      </div>
    </ng-template>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class XnFormlyFieldLongDatePicker extends FieldType implements OnInit {
  @ViewChild('datePicker') datePicker: NzDatePickerComponent;
  defaultOptions = {
    templateOptions: {
      nzAllowClear: true,
      nzAutoFocus: false,
      nzDisabled: false,
      nzInputReadOnly: false,
      nzFormat: '',
      nzPlaceHolder: '',
      nzPopupStyle: '',
      nzDropdownClassName: '',
      nzSize: '',
      nzValue: null,
      nzDefaultPickerValue: null,
      nzDateRender: null,
      nzShowTime: false,
      nzDisabledTime: null,
      nzShowToday: false,
      nzMode: 'date',
      nzSuffixIcon: 'calendar',
      nzDisabledDate: () => false,
      nzOnChange: (): void => {},
      nzOnCalendarChange: (): void => {},
      nzOnOpenChange: (): void => {},
      nzOnPanelChange: (): void => {},
      nzOnOk: (): void => {},
    },
  };

  defaultValue = null;

  ngOnInit() {
    this.defaultValue =
      this.field.defaultValue || this.model[`${this.field.key}`];
  }

  /**
   * 设置长期有效
   */
  setLongDate() {
    const valueDate = new Date(LONG_DATE);
    this.datePicker.close();
    this.formControl.setValue(valueDate);
  }
}
