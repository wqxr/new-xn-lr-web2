import { selectType } from './../../../../../../../products/bank-shanghai/src/lib/logic/vanke-dataChange';
import { XnUtils } from './../../../xn-utils';
import { Component, OnInit, ElementRef, Input, AfterViewInit } from '@angular/core';
import { FormGroup, AbstractControl } from '@angular/forms';
import { DynamicForm } from '../../dynamic.decorators';
import { XnInputOptions } from 'libs/shared/src/lib/public/form/xn-input.options';
import { XnFormUtils } from 'libs/shared/src/lib/common/xn-form-utils';
import { SelectOptions } from 'libs/shared/src/lib/config/select-options';
import XnFlowUtils from 'libs/shared/src/lib/common/xn-flow-utils';

@Component({
  template: `
    <div [formGroup]="form">
      <textarea class="form-control xn-input-textarea xn-input-font xn-input-border-radius" rows="6"
        [formControlName]="row.name" [ngClass]="myClass" [placeholder]="row.placeholder" (blur)="onBlur()"
        [maxLength]="inputMaxLength" autocomplete="off" style="white-space: pre-wrap;"></textarea>
      <span class="textarea-tip">{{inputLength}}/{{inputMaxLength}}</span>
    </div>
    <span class="xn-input-alert">{{alert}}</span>
    `,
  styles: [
    `.xn-input-textarea {
        resize: none
      }
      .textarea-tip {
        font-size: 14px;
        color: #ccc;
      }
    `
  ]
})
// {{inputLength}}/{{inputMaxLength}}
@DynamicForm({ type: 'text-area', formModule: 'default-input' })

export class TextareaLimitInputComponent implements OnInit, AfterViewInit {
  inputMaxLength = 3000;
  inputLength = 0;
  @Input() row: any;
  @Input() form: FormGroup;

  myClass = '';
  alert = '';
  ctrl: AbstractControl;
  checkTypeCtrl: AbstractControl;
  xnOptions: XnInputOptions;

  constructor(private er: ElementRef) {
  }

  ngOnInit() {
    if (!this.row.placeholder) {
      this.row.placeholder = '';
    }
    if (!!this.row.options && !!this.row.options.inputMaxLength) {
      this.inputMaxLength = this.row.options.inputMaxLength;
    }
    this.ctrl = this.form.get(this.row.name);
    this.inputLength = !!this.ctrl.value ? String(this.ctrl.value).length : 0;
    this.calcAlertClass();

    if (this.row.checkerId === 'checkText') {
      this.checkTypeCtrl = this.form.get('checkType');
      this.checkTypeCtrl.valueChanges.subscribe(val => {
        if (!!val) {
          const statusText = XnFlowUtils.fnTransform(JSON.parse(val), 'systemFail');
          let newValue = !!this.ctrl.value ? `${this.ctrl.value}\n${statusText}：` : `${statusText}：`;
          const preSelectProxy = XnUtils.parseObject(this.checkTypeCtrl.value).proxy;
          const preSelectStatus = XnUtils.parseObject(this.checkTypeCtrl.value).status;
          const invoiceData = XnUtils.parseObject(this.row.invoiceData);
          if (preSelectProxy === selectCheckType.selectProxy && preSelectStatus === selectCheckType.selectStatus) {
            newValue = `${statusText}：${invoiceData.map(item => {
              return `【${item.invoiceNum}】(转让金额：${XnUtils.formatMoney(item.transferMoney)})`;
            })}
              `;
          }
          this.ctrl.setValue(newValue);
        }
        this.calcAlertClass();
      });
    }

    this.ctrl.valueChanges.subscribe(v => {
      this.inputLength = !!v ? String(v).length : 0;
      this.calcAlertClass();
    });

    this.xnOptions = new XnInputOptions(this.row, this.form, this.ctrl, this.er);
  }

  ngAfterViewInit(): void {
    /**
     * Internet Explorer 10、Firefox、Chrome 以及 Safari 支持 maxlength 属性。
     * Internet Explorer 9 以及更早的版本或 Opera 不支持 maxlength 属性。
     * 侦听input事件(firefox, safari...)和propertychange事件(IE)，限制textarea输入框的长度[maxlength]
     */
    // $("textarea").on('input propertychange', (e)=> {
    //     let maxLength = this.inputMaxLength;  //$(e.target).attr('maxlength');
    //     if ($(e.target).val().length > maxLength) {
    //         $(e.target).val($(e.target).val().substring(0, maxLength));
    //     }
    // });
  }

  onBlur() {
    this.calcAlertClass();
  }

  calcAlertClass() {
    this.myClass = XnFormUtils.getClass(this.ctrl);
    this.alert = XnFormUtils.buildValidatorErrorString(this.ctrl);
  }
}
/**
 * suspendReason 平台业务暂停原因select枚举类型值
 */
enum selectCheckType {
  selectProxy = '1',  // 业务资料修改
  selectStatus = '3'  // 发票变更
}
