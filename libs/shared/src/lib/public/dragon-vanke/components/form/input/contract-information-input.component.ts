import { Component, Input, OnInit } from '@angular/core';
import { AbstractControl, FormGroup } from '@angular/forms';
import { DynamicForm } from '../../../../../common/dynamic-form/dynamic.decorators';
import { XnUtils } from '../../../../../common/xn-utils';


/**
 *  合同编号信息
 *      付款确认书（总部致保理商）编号
 *      付款确认书（总部致券商）编号
 *      致总部公司通知书（二次转让）编号
 *      总部公司回执（二次转让）编号
 */
@Component({
  selector: 'xn-contract-information-input',
  templateUrl: './contract-information-input.component.html',
  styles: [`
        .title {
            padding: 10px 0;
            font-weight: bold;
        }

        .title-text:after {
            content: '*';
            color: #df0000;
        }
        .control-label {
            padding-left: 0;
        }
    `]
})
@DynamicForm({ type: 'contract-info', formModule: 'dragon-input' })
export class ContractInformationInputComponent implements OnInit {
  @Input() row: any;
  @Input() form: FormGroup;
  ctrl: AbstractControl;
  data: any;
  dataObj: any;
  factoringPayConfirmTilte: string = '《付款确认书（总部致保理商）》编号';
  /** isLoganBoshi 龙光博时资本标识 */
  public isLoganBoshi: boolean = false;

  public constructor() { }

  public ngOnInit() {
    this.ctrl = this.form.get(this.row.name);
    this.fromValue();
  }

  handleEdit(e, label) {
    this.data[label] = e.target.value;
    this.toValue();
  }

  private fromValue() {
    this.data = XnUtils.parseObject(this.ctrl.value, []);
    this.dataObj = Object.assign({}, this.data); // 拷贝对象，
    this.toValue();
  }

  private toValue() {
    const { isLoganBoshi } = this.row;
    this.isLoganBoshi = isLoganBoshi;
    this.factoringPayConfirmTilte = isLoganBoshi ? '《付款确认书（总部致管理人）》编号' : '《付款确认书（总部致保理商）》编号';
    if (!!this.row.required && this.row.required === true) {
      const { codeFactoringPayConfirm, codeBrokerPayConfirm, codeNotice2, codeReceipt2 } = this.data;
      if ([codeFactoringPayConfirm, codeBrokerPayConfirm, codeNotice2, codeReceipt2].includes('')) {
        this.ctrl.setValue('');
      } else {
        this.ctrl.setValue(this.data);
      }
    } else {
      this.ctrl.setValue(this.data);
    }

  }
}
