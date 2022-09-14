import { Component, ElementRef, Input, OnInit } from '@angular/core';
import { AbstractControl, FormGroup } from '@angular/forms';
import { XnUtils } from '../../common/xn-utils';
import { XnInputOptions } from './xn-input.options';

@Component({
  selector: 'xn-label-dselect-input',
  templateUrl: './label-dselect.component.html',
  styles: [
    `.showInfo{
            display:flex;
            padding-top:5px
        }
        .showInfo>div:nth-child(1) span{
            margin-right: 20px;
        }
        .showInfo a{
            text-align: center;
            display: block;
            height: 22px;
            line-height: 22px;
        }
        .showInfo>div:nth-shild(3){
            margin-left:40px;
        }
        `
  ]
})
export class LabelDselectInputComponent implements OnInit {

  @Input() row: any;
  @Input() form: FormGroup;

  required = false;
  firstClass = '';
  secondClass = '';
  alert = '';

  ctrl: AbstractControl;
  xnOptions: XnInputOptions;

  secondOptions: any[] = [];

  firstValue = '';
  secondValue = '';
  // 是否显现
  isDisplay: boolean;
  public display: boolean = true;

  constructor(private er: ElementRef) {
  }

  ngOnInit() {
    this.ctrl = this.form.get(this.row.name);
    this.required = (this.row.required === true || this.row.required === 1);
    // 设置初始值
    if (this.ctrl.value) {
      const value = XnUtils.parseObject(this.ctrl.value);
      this.firstValue = value.first || '';
      this.secondValue = value.second || '';
      this.secondOptions = this.row.selectOptions.second[this.firstValue];
    }
    this.xnOptions = new XnInputOptions(this.row, this.form, this.ctrl, this.er);
  }
  changeInfo(bool) {
    this.display = bool
    // 点击保存重新设置值
    if (bool) { this.ngOnInit()}
  }
}
