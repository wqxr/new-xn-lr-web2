/*
 * Copyright(c) 2017-2019, 深圳市链融科技股份有限公司
 * Beijing Xiwei Technology Co., Ltd.
 * All rights reserved.
 *
 * @file：EditModalComponent
 * @summary：新增文件模态框  配置参数  EditParamInputModel
 * @version: 1.0
 * **********************************************************************
 * revision             author            reason             date
 * 1.0                 wangqing          增加功能1         2019-05-21
 * **********************************************************************
 */

import { Component, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { CheckersOutputModel } from '../../../config/checkers';
import {
  ModalSize,
  ModalComponent,
} from '../../../common/modal/components/modal';
import { XnFormUtils } from '../../../common/xn-form-utils';

/**
 *  参数默认
 */
export class EditParamInputModel {
  // 标题
  public title?: string;
  // 输入项
  public checker: CheckersOutputModel[];
  // 其他配置
  public options?: any;
  // 按钮
  public buttons?: string[];
  // 弹框大小配置
  public size?: any;
  public type?: number;
  public mainFlowId?: string;
  // 增加一个 content 参数可以展示body text
  public content?: string;
  public subContent?: string;
  constructor() {
    this.options = { tips: '' };
    this.buttons = ['取消', '确定'];
    this.size = ModalSize.Large;
  }
}
@Component({
  template: `
    <modal #modal [backdrop]="'static'" [keyboard]="false" [animation]="false">
      <form
        class="form-horizontal"
        (ngSubmit)="handleSubmit()"
        [formGroup]="mainForm"
        *ngIf="!!mainForm"
      >
        <modal-header [showClose]="false">
          <h4 class="modal-title">{{ params.title }}</h4>
        </modal-header>
        <modal-body>
          <div *ngIf="params?.content !== ''" class="content-text">
            {{ params.content }}
          </div>
          <div *ngIf="params?.subContent !== ''" class="subContent-text">
            {{ params.subContent }}
          </div>
          <div
            *ngIf="params?.type === 999; else block"
            class="clearfix"
            style="max-height: calc( 100vh - 400px);overflow-y: auto;overflow-x:hidden;"
          >
            <div class="form-group" *ngFor="let row of params.checker">
              <div class="col-sm-12">
                <app-dynamic-input
                  [row]="row"
                  [form]="mainForm"
                  [svrConfig]="svrConfig"
                  formModule="dragon-input"
                >
                </app-dynamic-input>
              </div>
            </div>
          </div>
          <ng-template #block>
            <div
              class="clearfix"
              style="max-height: calc( 100vh - 400px);overflow-y: auto;overflow-x:hidden;"
              #block
            >
              <div class="form-group" *ngFor="let row of params.checker">
                <div
                  class="col-sm-2 xn-control-label"
                  [class.required-star]="
                    row.required !== false && row.required !== 0
                  "
                >
                  {{ row.title }}
                </div>
                <div class="col-sm-8">
                  <app-dynamic-input
                    [row]="row"
                    [form]="mainForm"
                    [svrConfig]="svrConfig"
                    formModule="dragon-input"
                  >
                  </app-dynamic-input>
                </div>
                <div class="col-sm-2 xn-control-desc">
                  {{ row.memo }}
                </div>
              </div>
            </div>
          </ng-template>
        </modal-body>
        <modal-footer>
          <span *ngIf="params?.options?.tips" class="label-tips">{{
            params?.options?.tips
          }}</span>
          <button
            type="button"
            class="btn btn-default"
            (click)="handleCancel()"
          >
            {{ params.buttons[0] }}
          </button>
          <button
            type="submit"
            *ngIf="params.buttons[1] && params.buttons[1] !== ''"
            class="btn btn-success"
            [disabled]="!mainForm.valid"
          >
            {{ params.buttons[1] }}
          </button>
        </modal-footer>
      </form>
    </modal>
  `,
  styles: [
    `
      .content-text {
        display: flex;
        justify-content: center;
        font-size: 18px;
        font-weight: 600;
        margin: 10px auto 0;
        width: calc(100vh - 200px);
      }
      .subContent-text {
        display: flex;
        justify-content: center;
        font-size: 14px;
        margin: 10px auto 20px;
        width: calc(100vh - 200px);
        color: #b9b9b9;
      }
    `,
  ],
})
export class EditModalComponent {
  @ViewChild('modal') modal: ModalComponent;
  public params: EditParamInputModel = new EditParamInputModel();
  private observer: any;
  public mainForm: FormGroup;
  public svrConfig: any;

  open(params: EditParamInputModel): Observable<any> {
    this.params = Object.assign({}, this.params, params);
    XnFormUtils.buildSelectOptions(this.params.checker);
    this.buildChecker(this.params.checker);
    this.mainForm = XnFormUtils.buildFormGroup(this.params.checker);
    this.modal.open(this.params.size);
    // TODO: updtae new Observable()
    // see https://stackoverflow.com/questions/55539103/angular-create-is-deprecated-use-new-observable-instead
    return Observable.create((observer) => {
      this.observer = observer;
    });
  }

  /**
   *  提交
   */
  public handleSubmit() {
    this.close(this.mainForm.value);
  }

  /**
   *  取消
   */
  public handleCancel() {
    this.close(null);
  }

  private buildChecker(stepRows) {
    for (const row of stepRows) {
      XnFormUtils.convertChecker(row);
    }
  }

  private close(value) {
    this.modal.close();
    this.observer.next(value);
    this.observer.complete();
  }
}
