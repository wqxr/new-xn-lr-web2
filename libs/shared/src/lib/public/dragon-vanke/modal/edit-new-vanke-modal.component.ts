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
 * 1.0                 zhyuanan          增加功能1         2019-05-21
 * **********************************************************************
 */

import { Component, ViewChild, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';
import { ModalComponent, ModalSize } from '../../../common/modal/components/modal';
import { XnFormUtils } from '../../../common/xn-form-utils';
import { CheckersOutputModel } from '../../../config/checkers';
import { ConsoleRoutingModule } from 'libs/console/src/lib/console-routing.module';
import { SelectOptions } from '../../../config/select-options';

/**
 *  参数默认
 */
export class EditNewVankeParamInputModel {
  /** 标题 */
  public title?: string;
  /** 输入项 */
  public checker: CheckersOutputModel[];
  /** 其他配置 */
  public options?: any;
  /** 按钮*/
  public buttons?: string[];
  /** 弹框大小配置 */
  public size?: any;
  /**其他信息 */
  public info?: any;

  constructor() {
    this.options = { tips: '' };
    this.buttons = ['取消', '确定'];
    this.size = ModalSize.Large;
  }
}
@Component({
  template: `
    <modal #modal [backdrop]="'static'" [keyboard]="false" [animation]="false">
      <form class="form-horizontal" (ngSubmit)="handleSubmit()" [formGroup]="mainForm" *ngIf="!!mainForm">
        <modal-header [showClose]="false">
          <h4 class="modal-title">{{params.title}}</h4>
        </modal-header>
        <modal-body>
          <div class="clearfix" style="max-height: calc( 100vh - 280px);overflow-y: auto;overflow-x:hidden;">
            <div class="form-group" *ngFor="let row of params.checker">
              <div class="col-sm-2 xn-control-label"
                [class.required-star]="row.required !== false && row.required !== 0">
                {{row.title}}
              </div>
              <div class="col-sm-8">
                <ng-container *ngIf="row.checkerId!=='fitProject';else block">
                    <xn-input [row]="row" [form]="mainForm"></xn-input>
                </ng-container>
                <ng-template #block>
                    <app-dynamic-input [row]="row" [form]="mainForm" [formModule]="formModule" [svrConfig]="info">
                    </app-dynamic-input>
                </ng-template>
              </div>
              <div class="col-sm-2 xn-control-desc">
                {{row.memo}}
              </div>
            </div>
          </div>
        </modal-body>
        <modal-footer>
          <span *ngIf="params?.options?.tips" class="label-tips">{{params?.options?.tips}}</span>
          <button type="button" class="btn btn-default" (click)="handleCancel()"> {{params.buttons[0] }}</button>
          <button type="submit" *ngIf="params.buttons[1]&&params.buttons[1]!==''" class="btn btn-success" [disabled]="!mainForm.valid">
          {{params.buttons[1]}}</button>
        </modal-footer>
      </form>
    </modal>
    `
})
export class EditNewVankeModalComponent {

  @ViewChild('modal') modal: ModalComponent;
  public params: EditNewVankeParamInputModel = new EditNewVankeParamInputModel();
  private observer: any;
  public mainForm: FormGroup;
  public formModule = 'dragon-input';
  public info: any;

  open(params: EditNewVankeParamInputModel): Observable<any> {
    // 根据上面所选“总部公司”，出现【一次转让合同管理】功能列表中该总部公司对应的“适用项目”
    this.info = params.info || '';
    this.params = Object.assign({}, this.params, params);
    XnFormUtils.buildSelectOptions(this.params.checker);
    this.buildChecker(this.params.checker);
    this.mainForm = XnFormUtils.buildFormGroup(this.params.checker);
    this.modal.open(this.params.size);
    return Observable.create(observer => {
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
  // ngOnChanges() {
  //     console.info('dskfsaksf--onchange');
  //     XnFormUtils.buildSelectOptions(this.params.checker);
  //     this.buildChecker(this.params.checker);
  //     this.mainForm = XnFormUtils.buildFormGroup(this.params.checker);

  // }
  // change() {
  //     console.info('dskfsaksf--onchange');
  //     XnFormUtils.buildSelectOptions(this.params.checker);
  //     this.buildChecker(this.params.checker);
  //     this.mainForm = XnFormUtils.buildFormGroup(this.params.checker);
  // }

  private close(value) {
    this.modal.close();
    console.log(value,'value')
    this.observer.next(value);
    this.observer.complete();
  }
}
