import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  Input,
  ElementRef,
  ViewChild,
  AfterViewChecked
} from '@angular/core';
import { FormGroup, AbstractControl } from '@angular/forms';
import { XnInputOptions } from 'libs/shared/src/lib/public/form/xn-input.options';
import { XnFormUtils } from 'libs/shared/src/lib/common/xn-form-utils';
import { DynamicForm } from '../../dynamic.decorators';
import { XnUtils } from 'libs/shared/src/lib/common/xn-utils';

declare const $;

@Component({
  selector: 'vanke-number-input',
  templateUrl: './number-input.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [
    `.inMemo {
      padding: 5px 0;
      color: #f20000
    }

    .xn-money-alert {
      color: #8d4bbb;
      font-size: 12px;
    }

    .hide {
      width: 0;
      height: 0;
      opacity: 0;
      visibility: hidden;
    }
    `
  ]
})
@DynamicForm({type: 'number-input', formModule: 'default-input'})
export class TextNumberInputComponent implements OnInit, AfterViewChecked {

  @Input() row: any;
  @Input() form: FormGroup;
  @ViewChild('input', {static: true}) input: ElementRef;
  @ViewChild('inputEx', {static: true}) inputEx: ElementRef;
  @ViewChild('moneyAlertRef', {static: true}) moneyAlertRef: ElementRef;

  myClass = '';
  alert = '';
  ctrl: AbstractControl;
  xnOptions: XnInputOptions;
  inMemo = '';
  public ctrlWith = false; // 特殊属性

  constructor(private er: ElementRef) {}

  ngOnInit() {
    if (!this.row.placeholder) {
      this.row.placeholder = '';
      if (this.row.type === 'text' && this.row.value === 0) {
        this.row.placeholder = 0;
      }
    }
    this.inMemo = !!this.row.options && this.row.options !== '' && this.row.options.inMemo || '';
    this.ctrl = this.form.get(this.row.name);
    this.fromValue();
    this.xnOptions = new XnInputOptions(this.row, this.form, this.ctrl, this.er);
  }

  exInput(ev: any) {
    this.inputEx.nativeElement.value = XnUtils.formatMoney(ev.target.value);
    this.ctrl.setValue(ev.target.value.replace(/\,/g, ''));
  }

  onBlur(event: any): void {
    if (!this.isNumber(event.target.value)) {
      this.ctrl.setValue('');
    }
  }

  /**
   *  初始值
   */
  private fromValue() {
    if (!this.input.nativeElement.value && this.input.nativeElement.value !== '') {
      return;
    }
    this.input.nativeElement.value = this.ctrl.value;
    this.moneyFormat(); // 将拉取到的数据进行money格式化
    this.calcAlertClass();
  }

  ngAfterViewChecked() {
    if (this.ctrl && !!this.ctrl.value && !this.input.nativeElement.value) {
      const a = setTimeout(() => {
        clearTimeout(a);
        this.fromValue();
        this.calcAlertClass();
        return;
      }, 0);
    }

    if (this.ctrlWith) {
      if (this.input.nativeElement.value === '') {
        setTimeout(() => {
          if (this.input.nativeElement.value === '') {
            this.alert = '';
          }
        }, 0);
      }

      if (isNaN(parseInt(this.ctrl.value, 0)) && this.input.nativeElement.value !== '') {
        this.input.nativeElement.value = 0;
        this.inputEx.nativeElement.value = 0;
        const ret = XnUtils.convertCurrency(this.input.nativeElement.value);
        const a = setTimeout(() => {
          this.alert = ret[1];
          clearTimeout(a);
          return;
        });
      }

      if (parseInt(this.ctrl.value, 0) !== parseInt(this.input.nativeElement.value.replace(/,/g, ''), 0)) {
        const a = setTimeout(() => {
          clearTimeout(a);
          this.fromValue();
          this.calcAlertClass();
          return;
        }, 0);
      }
    }
  }

  /**
   *  提示判断
   */
  private calcAlertClass(): void {
    this.input.nativeElement.disabled = this.ctrl.disabled;
    this.myClass = XnFormUtils.getClass(this.ctrl);
    this.alert = XnFormUtils.buildValidatorErrorString(this.ctrl);
    if (this.input.nativeElement.value) {
      const ret = XnUtils.convertCurrency(this.input.nativeElement.value);
      this.alert = ret[1];
      if (!ret[0]) {
        $(this.moneyAlertRef.nativeElement).addClass('red');
      } else {
        $(this.moneyAlertRef.nativeElement).removeClass('red');
      }
    }
  }

  isNumber(value) {
    const currentValue = this.ReceiveData(value);
    const y = String(currentValue).indexOf('.') + 1; // 获取小数点的位置
    const count = String(currentValue).length - y; // 获取小数点后的个数
    if (isNaN(currentValue)) {
      this.alert = '格式错误，请输入数字';
      return false;
    }
    if (y > 0 && count > 2) {
      this.alert = '格式错误，只保留两位小数';
      return false;
    }
    if (Number(currentValue) > 10000000000) {
      this.alert = `请输入0-${XnUtils.formatMoney(10000000000)}的数字`;
      return false;
    } else {
      return true;
    }
  }

  /**
   *  金额显示格式化，加千分位
   */
  private moneyFormat() {
    this.inputEx.nativeElement.value = XnUtils.formatMoney(this.input.nativeElement.value);
  }

  // 计算应收账款转让金额
  public ReceiveData(item: any) {
    let tempValue = item.replace(/,/g, '');
    tempValue = parseFloat(tempValue).toFixed(2);
    return Number(tempValue);
  }
}
