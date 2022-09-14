/*************************************************************************
* Copyright (c) 2017 - 2021 深圳市链融科技股份有限公司
* Shenzhen Lianrong Technology Co., Ltd.
* All rights reserved.
*
* @file：libs\products\bank-shanghai\src\lib\share\components\record\puhui\components\account-step-second-form\account-step-second.component.ts
* @summary：发起普惠开户流程第二步
* @version: 1.0
* *************************************************************************
* revision             author            reason             date
* 1.0                 hucongying          init          2021-07-07
***************************************************************************/
import { Component, OnInit, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { PublicCommunicateService } from 'libs/shared/src/lib/services/public-communicate.service';
import { XnUtils } from 'libs/shared/src/lib/common/xn-utils';
import { XnFormUtils } from 'libs/shared/src/lib/common/xn-form-utils';
import { StepValueEnum } from '../../new-puhui.component';
import { CheckersOutputModel } from 'libs/shared/src/lib/config/checkers';
import { ChangeDetectorRef } from '@angular/core';
import { AfterViewChecked } from '@angular/core';

@Component({
  selector: 'account-step-second',
  templateUrl: './account-step-second.component.html',
  styles: []
})
export class AccountStepSecondComponent implements OnInit, AfterViewChecked {
  public formModule = 'dragon-input';
  /** mainForm */
  public mainForm: FormGroup;
  /** rows checker项 */
  @Input() svrConfig: any;
  // true：新发起流程 false：资料补正编辑流程
  @Input() newFlow: boolean = true;
  @Input() readonly: boolean = false;
  // 表单配置
  public secondRows: CheckersOutputModel[] = [];

  constructor(
    private publicCommunicateService: PublicCommunicateService, private cdr: ChangeDetectorRef,) { }

  ngOnInit() {
    this.buildRows();
  }

  ngAfterViewChecked(): void {
    this.cdr.detectChanges()
  }

  /**
   * 构建表单
   */
  private buildRows(): void {
    this.secondRows = XnUtils.deepClone(this.svrConfig.checkers.slice(16, 17));
    this.secondRows.forEach(show => { show.options.readonly = this.readonly });
    this.mainForm = XnFormUtils.buildFormGroup(this.secondRows);
  }

  /**
   * 返回
   */
  goBack() {
    window.history.go(-1)
  }

  /**
   * 返回第一步
   */
  toFirst() {
    // 只读状态不用保存，否则会丢失表单数据
    if(!this.readonly){
      this.saveForm();
    }
    this.publicCommunicateService.change.emit({ svrConfig: this.svrConfig, step: StepValueEnum.FIRST });
  }

  /**
   * 保存当前表单的值
   */
  saveForm() {
    const formValue = XnUtils.deepClone(this.mainForm.value);
    /** 第一步表单内容赋值到svrConfig */
    for (const checker of this.svrConfig.checkers) {
      Object.keys(formValue).forEach(key => {
        if (checker.checkerId === key) {
          checker.value = formValue[key]
        }
      })
    }
  }

  /**
   * 下一步
   */
  toThird() {
    if(!this.readonly){
      this.saveForm();
    }
    /** 把第一步表单值发射出去 */
    this.publicCommunicateService.change.emit({ svrConfig: this.svrConfig, step: StepValueEnum.THIRD });
  }
}


