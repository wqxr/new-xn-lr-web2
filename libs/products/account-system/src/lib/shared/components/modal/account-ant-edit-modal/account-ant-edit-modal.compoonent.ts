/*************************************************************************
* Copyright (c) 2017 - 2022 深圳市链融科技股份有限公司
* Shenzhen Lianrong Technology Co., Ltd.
* All rights reserved.
*
* @file：libs\products\account-system\src\lib\shared\components\modal\account-ant-edit-modal\account-ant-edit-modal.compoonent.ts
* @summary：init account-ant-edit-modal.compoonent.ts
* @version: 1.0
* *************************************************************************
* revision             author            reason             date
* 1.0                HuCongying           init           2022-01-06
***************************************************************************/

import { AfterContentChecked, ChangeDetectorRef, Component } from '@angular/core';
import { Observable } from 'rxjs';
import { AccountEditModelParams, ButtonGroup, EditModelSubmitParams } from '../interface';
@Component({
  templateUrl: './account-ant-edit-modal.compoonent.html',
  styles: [`
    .table-head-btn {
        margin-bottom: 5px;
        width: 100%;
    }
    `]
})
export class AccountAntEditModalComponent implements AfterContentChecked {

  params: AccountEditModelParams = {
    width: 300,
    title: '标题',
    maskClosable: false,
    showTipIcon: false,
    nzWrapClassName: 'vertical-center-modal',
    buttons: {
      left: [],
      right: [
        { label: '取消', type: 'normal', btnKey: 'cancel' },
        { label: '确定', type: 'normal', btnKey: 'ok' },
      ]
    },
    formModalFields: [],
    layout: 'horizontal'
  };
  private observer: any;
  public isVisible = true;
  constructor(public cdr: ChangeDetectorRef) { }
  get tableHeadBtnConfig() {
    return Object.keys(this.params.buttons) || [];
  }

  open(params: AccountEditModelParams): Observable<any> {
    this.params = Object.assign({}, this.params, params);
    return new Observable(observer => {
      this.observer = observer;
    });
  }

  /**
   *  提交
   */
  public handleSubmit(e: { [key: string]: any }) {
    this.close({
      action: true,
      params: { ...e }
    });
  }

  /**
   *  取消
   */
  public handleCancel() {
    this.close({
      action: false
    });
  }

  /**
   * 自定义按钮事件
   */
  handleBtnClick(btn: ButtonGroup, model: { [key: string]: any }) {
    if (btn.btnKey === 'ok') {
      this.handleSubmit({ ...model });
    } else if (btn.btnKey === 'cancel') {
      this.handleCancel();
    }
    this.isVisible = false;
  }

  private close(value: EditModelSubmitParams) {
    this.isVisible = false;
    this.observer.next(value);
    this.observer.complete();
  }

  ngAfterContentChecked(): void {
    this.cdr.detectChanges()
  }
}
