/*************************************************************************
 * Copyright (c) 2017 - 2021 深圳市链融科技股份有限公司
 * Shenzhen Lianrong Technology Co., Ltd.
 * All rights reserved.
 *
 * @file：libs\products\abs-gj\src\lib\components\form\input\contract-select\contract-select.component.ts
 * @summary：contract-select.component.ts
 * @version: 1.0
 * *************************************************************************
 * revision             author            reason             date
 * 1.0                  DengPei           init               2021-11-29
 ***************************************************************************/
import { ChangeDetectionStrategy, Component, OnInit, ElementRef, Input, ChangeDetectorRef } from '@angular/core';
import { FormGroup, AbstractControl } from '@angular/forms';
import { DynamicForm } from 'libs/shared/src/lib/common/dynamic-form/dynamic.decorators';
import { XnInputOptions } from 'libs/shared/src/lib/public/form/xn-input.options';
import { XnService } from 'libs/shared/src/lib/services/xn.service';
import { FlowId, IsProxyDef } from '../../../../../../../../shared/src/lib/config/enum';

@Component({
  selector: 'lib-contract-select-gj',
  template: `
    <div [formGroup]="form">
      <select class="form-control xn-input-font" [formControlName]="row.name" [ngClass]="myClass">
        <option value="">请选择</option>
        <option *ngFor="let option of row.selectOptions" value="{{option.value}}">{{option.label}}</option>
      </select>
    </div>
    <span class="xn-input-alert">{{alert}}</span>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,

})
@DynamicForm({type: 'contract-select-gj', formModule: 'dragon-input'})
export class GjContractSelectInputComponent implements OnInit {
  @Input() row: any;
  @Input() form: FormGroup;
  @Input() svrConfig?: any;

  myClass = '';
  alert = '';
  ctrl: AbstractControl;
  xnOptions: XnInputOptions;
  postUrl = '/contract/first_contract_info/get_org_project';
  /** 轨交提单 */
  recordUrl = '/contract/first_contract_info/get_project';

  /** 成都轨交 58 */
  isProxy = IsProxyDef.CDR;

  constructor(
    private er: ElementRef,
    private xn: XnService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.ctrl = this.form.get(this.row.name);
    this.xnOptions = new XnInputOptions(this.row, this.form, this.ctrl, this.er);
    if (['fitProject', 'fitDebtUnit'].includes(this.row.checkerId)) {
      this.onInitOptions();
    }
  }

  onInitOptions() {
    let url = '';
    // 提单 url
    if (this.svrConfig && this.svrConfig.flowId === FlowId.GjFinancingPre) {
      url = this.recordUrl;
    } else {
      url = this.postUrl;
    }
    this.xn.dragon.post(url, {isProxy: this.isProxy})
      .subscribe(x => {
        if (x.ret === 0 && x.data && ['fitDebtUnit'].includes(this.row.checkerId)) {
          const fitArr = x.data.fitDebtUnit || [];
          this.row.selectOptions = fitArr.map((option: any) => {
            return {label: option, value: option};
          });
        } else if (x.ret === 0 && x.data && ['fitProject', 'fitProjectEx'].includes(this.row.checkerId)
        ) {
          const fitArr = x.data.fitProject || [];
          this.row.selectOptions = fitArr.map((option: any) => {
            return {label: option, value: option};
          });
        } else {
          this.row.selectOptions = [];
        }
        this.cdr.markForCheck();
      }, () => {
        this.row.selectOptions = [];
      });
  }
}
