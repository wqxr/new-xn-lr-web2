/*************************************************************************
* Copyright (c) 2017 - 2021 深圳市链融科技股份有限公司
* Shenzhen Lianrong Technology Co., Ltd.
* All rights reserved.
*
* @file：libs\products\bank-shanghai\src\lib\share\components\record\puhui\new-puhui.component.ts
* @summary：发起普惠开户流程-第一步表单组件
* @version: 1.0
* *************************************************************************
* revision             author            reason             date
* 1.0                 hucongying          init          2021-07-02
***************************************************************************/
import { Component, OnInit, Input, ChangeDetectorRef, AfterViewChecked } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { XnService } from 'libs/shared/src/lib/services/xn.service';
import { PublicCommunicateService } from 'libs/shared/src/lib/services/public-communicate.service';
import { XnUtils } from 'libs/shared/src/lib/common/xn-utils';
import { XnFormUtils } from 'libs/shared/src/lib/common/xn-form-utils';
import { CheckersOutputModel } from 'libs/shared/src/lib/config/checkers';
import { StepValueEnum } from '../../new-puhui.component';
import * as _ from 'lodash';

@Component({
  selector: 'account-step-first',
  templateUrl: './account-step-first.component.html',
  styles: [
    `
      .checkerTitle {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0px 50px;
      }
      .checkerHead{
        padding-bottom: 10px;
        border-bottom: 1px solid #aaa;
      }
    `,
  ],
})
export class AccountStepFirstComponent implements OnInit, AfterViewChecked {
  public formModule = 'dragon-input';
  /** mainForm */
  public mainForm: FormGroup;
  /** rows checker项 */
  @Input() svrConfig: any;
  @Input() readonly: boolean = false;
  public firstRows: CheckersOutputModel[] = [];

  constructor(
    private xn: XnService,
    private cdr: ChangeDetectorRef,
    private publicCommunicateService: PublicCommunicateService
  ) { }

  ngAfterViewChecked(): void {
    this.cdr.detectChanges();
  }

  ngOnInit() {
    this.buildRows();
  }

  /**
   *  提交
   */
  public onSubmit() { }

  /**
   *  取消并返回
   */
  public onCancel() {
    this.xn.user.navigateBack();
  }

  // 下载模板
  downloadTp() {
    const evt = document.createEvent('MouseEvents');
    evt.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
    const link = document.createElement('a');
    link.download = '上海银行-链融平台普惠记账簿开户指引.pdf';
    link.href = '/assets/lr/doc/bank-sh/上海银行-链融平台普惠记账簿开户指引【1.0】.pdf';
    link.dispatchEvent(evt);
  }

  /**
   * 构建表单
   * @param
   */
  private buildRows(): void {
    this.firstRows = XnUtils.deepClone(this.svrConfig.checkers.slice(0, 16));
    this.firstRows.forEach((show) => {
      if (show.checkerId === 'orgName' || show.checkerId === 'orgCodeNo') {
        show.options.readonly = true;
      } else {
        show.options.readonly = this.readonly;
      }
    });
    this.mainForm = XnFormUtils.buildFormGroup(this.firstRows);
  }

  /**
   * 下一步
   */
  toSecond() {

    if (!this.readonly) {
      const formValue = XnUtils.deepClone(this.mainForm.value);
      /** 第一步表单内容赋值到svrConfig */
      for (const checker of this.svrConfig.checkers) {
        Object.keys(formValue).forEach((key) => {
          if (checker.checkerId === key) {
            checker.value = formValue[key];
          }
        });
      }
    }

    /** 把第一步表单值发射出去 */
    this.publicCommunicateService.change.emit({
      svrConfig: this.svrConfig,
      step: StepValueEnum.SECOND,
    });
  }

  /**
   * 获取other：用于必填项提示 type= 1仅显示提示 2可操作链接
   * @param row 表单数据
   */
  public getRowOther(row: any): any {
    return !!row.other ? XnUtils.parseObject(row.other, {}) : {};
  }
}


