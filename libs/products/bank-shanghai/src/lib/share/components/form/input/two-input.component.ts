import { Component, OnInit, ElementRef, Input, ChangeDetectorRef } from '@angular/core';
import { FormGroup, AbstractControl } from '@angular/forms';
import { XnInputOptions } from 'libs/shared/src/lib/public/form/xn-input.options';
import { XnService } from 'libs/shared/src/lib/services/xn.service';
import { XnFormUtils } from 'libs/shared/src/lib/common/xn-form-utils';
import { XnUtils } from 'libs/shared/src/lib/common/xn-utils';
import { DynamicForm } from 'libs/shared/src/lib/common/dynamic-form/dynamic.decorators';
import { ShowModalService } from '../../../services/show-modal.service';

/**
 *  确认输入框组件
 */
@Component({
  selector: 'lib-two-input',
  template: `
  <div class="row">
    <div class="col-md-12 xn-input-first margin-bottom">
      <input class="form-control xn-input-font xn-input-border-radius" type="text" [readonly]="row.options?.readonly" (blur)="onBlur($event)" onpaste="return false"
      oncopy="return false" placeholder="请输入" [(ngModel)]="valueModel.firstInputValue" autocomplete="off" (input)="inputChange($event, 'firstInputValue')">
    </div>
    <div class="col-md-12 xn-input-second">
      <input class="form-control xn-input-font xn-input-border-radius" type="text" [readonly]="row.options?.readonly" (blur)="onBlur($event)" onpaste="return false"
      oncopy="return false" placeholder="请再次输入进行确认" [(ngModel)]="valueModel.confirmInputValue" autocomplete="off" (input)="inputChange($event, 'confirmInputValue')">
    </div>
  </div>
  <span class="xn-input-alert">{{alert}}</span>
  `
})
@DynamicForm({ type: 'two-input', formModule: 'dragon-input' })
export class TwoInputComponent implements OnInit {
  @Input() row: any;
  @Input() form: FormGroup;

  alert = '';
  myClass = '';
  ctrl: AbstractControl;
  xnOptions: XnInputOptions;

  valueModel: {
    firstInputValue: string,
    confirmInputValue: string
  } = {
    firstInputValue: '',
    confirmInputValue: ''
  };

  constructor(private er: ElementRef, private cdr: ChangeDetectorRef) {
  }

  ngOnInit() {
    this.ctrl = this.form.get(this.row.name);
    // 设置初始值
    if (!!this.ctrl.value) {
      this.valueModel = {
        firstInputValue: this.ctrl.value,
        confirmInputValue: this.ctrl.value
      };
    }
    this.calcAlertClass();
    this.ctrl.valueChanges.subscribe(v => {
      this.ctrl.markAsTouched();
      this.calcAlertClass();
    });
    this.xnOptions = new XnInputOptions(this.row, this.form, this.ctrl, this.er);
  }

  /**
   * @description: 输入事件
   * @param {any} event
   * @param {string} type
   * @return {*}
   */
  inputChange(event: any, type: string) {
    this.valueModel[type] = event.target.value;
    this.toValue();
  }

  onBlur(event) {
    this.calcAlertClass();
  }

  private calcAlertClass() {
    this.myClass = XnFormUtils.getClass(this.ctrl);
    this.alert = XnFormUtils.buildValidatorErrorString(this.ctrl);
    if (!this.valueModel.firstInputValue){
      this.alert = `必填字段;请输入${this.row.title}`;
    } else if (!this.valueModel.confirmInputValue){
      this.alert = `必填字段;请再次输入${this.row.title}进行确认`;
    } else if (this.valueModel.firstInputValue !== this.valueModel.confirmInputValue){
      this.alert = `两次输入的${this.row.title}不一致，请检查后重新输入`;
    }
  }

  private toValue() {
    if (!!this.valueModel.firstInputValue && !!this.valueModel.confirmInputValue && this.valueModel.firstInputValue === this.valueModel.confirmInputValue) {
      this.ctrl.setValue(this.valueModel.confirmInputValue);
    } else {
      this.ctrl.setValue('');
    }
    this.cdr.markForCheck();
  }
}