/*
 * Copyright(c) 2017-2019, 深圳市链融科技股份有限公司
 * Beijing Xiwei Technology Co., Ltd.
 * All rights reserved.
 *
 * @file：switch-modal.component.ts
 * @summary：新增文件模态框  配置参数  EditParamInputModel
 * @version: 1.0
 * **********************************************************************
 * revision             author            reason             date
 * 1.0                yutianbao          增加功能1         2019-05-21
 * **********************************************************************
 */

import { ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';
import { ModalComponent, ModalSize } from 'libs/shared/src/lib/common/modal/components/modal';
import { XnService } from 'libs/shared/src/lib/services/xn.service';
import { XnFormUtils } from 'libs/shared/src/lib/common/xn-form-utils';
import { CheckersOutputModel } from 'libs/shared/src/lib/config/checkers';

/**
 *  参数默认
 */
export class EditParamInputModel {
  /** 标题 */
  public title?: string;
  /** 输入项 */
  public checker: CheckersOutputModel[];
  /** 其他配置 */
  public options?: any;
  /** 按钮 */
  public buttons?: string[];
  /** 弹框大小配置 */
  public size?: any;
  public type?: number;
  public mainFlowId?: string;
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
                <h4 class="modal-title">{{ params.title }}</h4>
            </modal-header>
            <modal-body>
                <div class="clearfix" style="max-height: calc( 100vh - 400px);overflow-y: auto;overflow-x:hidden;">
                    <div class="form-group" *ngFor="let row of params.checker">
                        <div class="col-sm-2 xn-control-label"
                            [class.required-star]="row.required !== false && row.required !== 0">
                            {{ row.title }}
                        </div>
                        <div class="col-sm-8">
                            <app-dynamic-input [row]="row" [form]="mainForm" [svrConfig]="svrConfig"
                             formModule="dragon-input"></app-dynamic-input>
                        </div>
                        <div class="col-sm-2 xn-control-desc">
                            {{ row.memo }}
                        </div>
                    </div>
                </div>
            </modal-body>
            <modal-footer>
                <span *ngIf="params?.options?.tips" class="label-tips">{{params?.options?.tips}}</span>
                <button type="button" class="btn btn-default" (click)="handleCancel()">
                  {{ params.buttons[0] }}
                </button>
                <button type="submit" *ngIf="isSubmitButton && params.buttons[1]" class="btn btn-primary" [disabled]="!mainForm.valid">
                  {{ params.buttons[1] }}
                </button>
                <button type="button" *ngIf="!isSubmitButton && params.buttons[1]" class="btn btn-primary" [disabled]="!mainForm.valid"
                (click)="handleOk()">
                  {{ params.buttons[1] }}
                </button>
            </modal-footer>
        </form>
    </modal>
    `
})
export class SwitchModalComponent {
  @ViewChild('modal') modal: ModalComponent;
  public params: EditParamInputModel = new EditParamInputModel();
  private observer: any;
  public mainForm: FormGroup;
  public svrConfig: any;
  public modalTitle: string;
  public inputParams: {[key: string]: EditParamInputModel};
  public step = '';
  public subMItRes: any = {
    relation: '',
    ruleId: ''
  };

  get isSubmitButton(): boolean {
    return this.step && this.step === 'addToRuleList';
  }
  constructor(private cdr: ChangeDetectorRef, private xn: XnService) {}

  open(params: {[key: string]: EditParamInputModel}): Observable<any> {
    this.inputParams = params;
    this.svrConfig = params.svrConfig;
    this.buildChecker(params, 'relation');
    this.modal.open(this.params.size);
    return new Observable(observer => {
      this.observer = observer;
    });
  }

  /**
   *  去添加按钮-提交
   */
  public handleSubmit() {
    this.subMItRes.ruleId = this.mainForm.value?.ruleId || '';
    const param = {
      ruleId: this.subMItRes.ruleId,
      companyName: this.svrConfig.debtUnit,
      originType: 2		// ( 来源，0:未定义, 1:规则新增, 2:初审标记 )
    };
    this.xn.dragon.post('/shanghai_bank/sh_company_limit/addSupplierLimit', param).subscribe((x: any) => {
      if (x && x.ret === 0) {
        this.close({
          action: 'ok'
        });
      }
    });
  }

  /**
   *  确定按钮-提交
   */
  public handleOk() {
    this.subMItRes.relation = this.mainForm.value?.relation || '';
    const param = {
      appId: this.svrConfig.debtUnitId,
      relation: this.subMItRes.relation	// 0:无关联，1：万科关联企业，2：上海银行关联企业
    };
    this.xn.dragon.post(`/shanghai_bank/${this.svrConfig.record.flowId?.substring(0, 2)}_supplier/setSupplierRelation`, param).subscribe((x: any) => {
      if (x && x.ret === 0) {
        if (![0, '0'].includes(param.relation)){
          this.buildChecker(this.inputParams, 'addToRuleList');
        } else {
          this.close({
            action: 'ok'
          });
        }
        this.cdr.markForCheck();
      }
    });
  }

  /**
   *  取消添加
   */
  public handleCancel() {
    this.close({
      action: 'cancel'
    });
  }

  /**
   * 动态更新表单项
   * @param param checker项对象
   * @param type 区分更新顺序
   */
  private buildChecker(param: any, type: string) {
    this.step = type;
    // XnFormUtils.buildSelectOptions(param[type].checker);
    for (const row of param[type].checker) {
      XnFormUtils.convertChecker(row);
    }
    this.params = Object.assign({}, this.params, param[type]);
    this.modalTitle = param[type].title || '标题';
    this.mainForm = XnFormUtils.buildFormGroup(param[type].checker);
  }

  private close(value: any) {
    this.modal.close();
    this.observer.next(value);
    this.observer.complete();
  }

}
